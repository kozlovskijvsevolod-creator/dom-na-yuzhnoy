import { NextResponse } from "next/server";
import { checkCalendarRange } from "@/lib/google-calendar";

export const runtime = "nodejs";

type BookingPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  arrival?: unknown;
  departure?: unknown;
  guests?: unknown;
  occasion?: unknown;
  services?: unknown;
  message?: unknown;
  website?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = await request.json() as BookingPayload;
  } catch {
    return NextResponse.json({ error: "Некорректный формат заявки." }, { status: 400 });
  }

  if (text(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(payload.name, 80);
  const email = text(payload.email, 120);
  const phone = text(payload.phone, 40);
  const arrival = text(payload.arrival, 20);
  const departure = text(payload.departure, 20);
  const occasion = text(payload.occasion, 80) || "Не указан";
  const message = text(payload.message, 1200) || "Нет";
  const guests = Number(payload.guests);
  const phoneDigits = phone.replace(/\D/g, "");
  const services = Array.isArray(payload.services)
    ? payload.services.map((service) => text(service, 80)).filter(Boolean).slice(0, 10)
    : [];

  if (
    name.length < 2 ||
    !emailPattern.test(email) ||
    phoneDigits.length < 9 ||
    phoneDigits.length > 15 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(arrival) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(departure) ||
    departure <= arrival ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 10
  ) {
    return NextResponse.json({ error: "Проверьте обязательные поля и даты поездки." }, { status: 400 });
  }

  let calendarVerified = false;
  try {
    const availability = await checkCalendarRange(arrival, departure);
    calendarVerified = availability.configured;

    if (availability.configured && !availability.available) {
      return NextResponse.json(
        {
          code: "DATES_UNAVAILABLE",
          error: "Эти даты уже заняты. Выберите другой свободный период в календаре."
        },
        { status: 409 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        code: "CALENDAR_UNAVAILABLE",
        error: "Не удалось повторно проверить доступность дат. Обновите календарь и попробуйте ещё раз."
      },
      { status: 503 }
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN ?? process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID ?? process.env.CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Онлайн-отправка временно недоступна. Позвоните по номеру, указанному внизу страницы." },
      { status: 503 }
    );
  }

  const telegramMessage = [
    "Новая заявка с сайта «Дом на Южной»",
    "",
    `Имя: ${name}`,
    `Email: ${email}`,
    `Телефон: ${phone}`,
    `Заезд: ${arrival}`,
    `Выезд: ${departure}`,
    `Гостей: ${guests}`,
    `Повод: ${occasion}`,
    `Дополнительно: ${services.length ? services.join(", ") : "Не выбрано"}`,
    `Пожелания: ${message}`,
    `Google Calendar: ${calendarVerified ? "даты проверены, свободны" : "автопроверка не настроена"}`
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
      signal: controller.signal,
      cache: "no-store"
    });

    if (!telegramResponse.ok) {
      console.error("Telegram booking request failed:", telegramResponse.status);
      return NextResponse.json(
        { error: "Не удалось передать заявку владельцам. Попробуйте ещё раз чуть позже." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram booking request error:", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { error: "Сервис отправки временно недоступен. Попробуйте ещё раз чуть позже." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
