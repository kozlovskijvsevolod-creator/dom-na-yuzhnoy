import "server-only";

export type BusyRange = {
  start: string;
  end: string;
};

export type CalendarAvailability = {
  configured: boolean;
  busy: BusyRange[];
  timeZone: string;
  updatedAt: string;
};

type GoogleCalendarEvent = {
  status?: string;
  transparency?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

type GoogleCalendarResponse = {
  items?: GoogleCalendarEvent[];
  nextPageToken?: string;
  error?: { message?: string };
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function calendarConfig() {
  return {
    apiKey: process.env.GOOGLE_CALENDAR_API_KEY ?? process.env.GOOGLE_API_KEY ?? "",
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? process.env.CALENDAR_ID ?? "",
    timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE ?? "Europe/Minsk"
  };
}

export function addDays(date: string, amount: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + amount);
  return value.toISOString().slice(0, 10);
}

export function todayInTimeZone(timeZone = "Europe/Minsk") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function localDate(dateTime: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(dateTime));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function endsAtMidnight(dateTime: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date(dateTime));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return values.hour === "00" && values.minute === "00" && values.second === "00";
}

function eventRange(event: GoogleCalendarEvent, timeZone: string): BusyRange | null {
  if (event.status === "cancelled" || event.transparency === "transparent") return null;

  if (event.start?.date && event.end?.date) {
    return { start: event.start.date, end: event.end.date };
  }

  if (event.start?.dateTime && event.end?.dateTime) {
    const start = localDate(event.start.dateTime, timeZone);
    const endDate = localDate(event.end.dateTime, timeZone);
    const end = endsAtMidnight(event.end.dateTime, timeZone) ? endDate : addDays(endDate, 1);
    return { start, end };
  }

  return null;
}

function mergeRanges(ranges: BusyRange[]) {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const merged: BusyRange[] = [];

  for (const range of sorted) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = previous.end > range.end ? previous.end : range.end;
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}

export async function getCalendarAvailability(
  from: string,
  to: string,
  options: { fresh?: boolean } = {}
): Promise<CalendarAvailability> {
  if (!datePattern.test(from) || !datePattern.test(to) || from >= to) {
    throw new Error("Некорректный диапазон календаря.");
  }

  const { apiKey, calendarId, timeZone } = calendarConfig();
  const updatedAt = new Date().toISOString();

  if (!apiKey || !calendarId) {
    return { configured: false, busy: [], timeZone, updatedAt };
  }

  const events: GoogleCalendarEvent[] = [];
  let pageToken = "";
  let page = 0;

  do {
    const parameters = new URLSearchParams({
      key: apiKey,
      timeMin: `${addDays(from, -1)}T00:00:00Z`,
      timeMax: `${addDays(to, 1)}T00:00:00Z`,
      singleEvents: "true",
      orderBy: "startTime",
      showDeleted: "false",
      maxResults: "2500",
      timeZone
    });
    if (pageToken) parameters.set("pageToken", pageToken);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${parameters}`,
      options.fresh ? { cache: "no-store" } : { next: { revalidate: 60 } }
    );
    const data = await response.json().catch(() => ({})) as GoogleCalendarResponse;

    if (!response.ok) {
      console.error("Google Calendar availability request failed:", response.status, data.error?.message ?? "unknown");
      throw new Error("Не удалось проверить календарь доступности.");
    }

    events.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? "";
    page += 1;
  } while (pageToken && page < 10);

  const busy = mergeRanges(
    events
      .map((event) => eventRange(event, timeZone))
      .filter((range): range is BusyRange => Boolean(range))
      .filter((range) => range.start < to && range.end > from)
      .map((range) => ({
        start: range.start < from ? from : range.start,
        end: range.end > to ? to : range.end
      }))
  );

  return { configured: true, busy, timeZone, updatedAt };
}

export async function checkCalendarRange(arrival: string, departure: string) {
  const availability = await getCalendarAvailability(arrival, departure, { fresh: true });
  const conflict = availability.busy.some(
    (range) => arrival < range.end && departure > range.start
  );
  return { ...availability, available: !conflict };
}
