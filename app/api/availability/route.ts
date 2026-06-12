import { NextRequest, NextResponse } from "next/server";
import { addDays, getCalendarAvailability, todayInTimeZone } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const revalidate = 60;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const defaultFrom = todayInTimeZone();
  const from = request.nextUrl.searchParams.get("from") ?? defaultFrom;
  const to = request.nextUrl.searchParams.get("to") ?? addDays(from, 370);

  if (
    !datePattern.test(from) ||
    !datePattern.test(to) ||
    from >= to ||
    to > addDays(from, 400)
  ) {
    return NextResponse.json({ error: "Некорректный диапазон дат." }, { status: 400 });
  }

  try {
    const availability = await getCalendarAvailability(from, to);
    return NextResponse.json(availability, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось загрузить доступность. Попробуйте обновить календарь." },
      { status: 502 }
    );
  }
}
