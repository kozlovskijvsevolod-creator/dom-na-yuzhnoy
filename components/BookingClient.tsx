"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  KeyRound,
  LoaderCircle,
  Mail,
  Phone,
  UserRound,
  Users,
  X
} from "lucide-react";
import { FormEvent, useState } from "react";
import { AvailabilityCalendar, DateRangeSelection } from "@/components/AvailabilityCalendar";

const steps = [
  ["01", "Запрос", "Вы сообщаете даты, количество гостей и формат отдыха."],
  ["02", "Подтверждение", "Владелец проверяет свободные даты и уточняет актуальную стоимость."],
  ["03", "Согласование", "Вы подтверждаете купель, размещение с питомцем или оформление события."],
  ["04", "Заезд", "Дом готовят к вашему приезду в согласованное время."]
];

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "arrival" | "departure" | "guests", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormData) {
  const errors: FieldErrors = {};
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const arrival = String(form.get("arrival") ?? "");
  const departure = String(form.get("departure") ?? "");
  const guests = Number(form.get("guests"));
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2) errors.name = "Укажите имя, чтобы мы знали, как к вам обращаться.";
  if (!emailPattern.test(email)) errors.email = "Проверьте адрес электронной почты.";
  if (phoneDigits.length < 9 || phoneDigits.length > 15) errors.phone = "Укажите телефон в международном формате.";
  if (!arrival) errors.arrival = "Выберите дату заезда.";
  if (!departure) errors.departure = "Выберите дату выезда.";
  if (arrival && departure && departure <= arrival) errors.departure = "Дата выезда должна быть позже даты заезда.";
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) errors.guests = "Выберите количество гостей.";

  return errors;
}

export function BookingClient() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [dates, setDates] = useState<DateRangeSelection>({ arrival: "", departure: "" });
  const [calendarRefresh, setCalendarRefresh] = useState(0);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const errors = validate(form);
    setFieldErrors(errors);
    setError("");

    if (Object.keys(errors).length) {
      const firstError = Object.keys(errors)[0];
      if (firstError === "arrival" || firstError === "departure") {
        formElement.querySelector<HTMLElement>(".booking-calendar-field")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        formElement.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      arrival: form.get("arrival"),
      departure: form.get("departure"),
      guests: Number(form.get("guests")),
      occasion: form.get("occasion"),
      services: form.getAll("services"),
      message: form.get("message"),
      website: form.get("website")
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({})) as { error?: string; code?: string };

      if (!response.ok) {
        if (result.code === "DATES_UNAVAILABLE") {
          setDates({ arrival: "", departure: "" });
          setFieldErrors({
            arrival: "Выбранный период уже занят.",
            departure: "Пожалуйста, выберите новые даты."
          });
          setCalendarRefresh((current) => current + 1);
        }
        throw new Error(result.error || "Не удалось отправить заявку.");
      }

      formElement.reset();
      setDates({ arrival: "", departure: "" });
      setDone(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="request-hero">
        <div className="request-key"><KeyRound /></div>
        <span>Частное бронирование / 08</span>
        <h1>Ваш отдых начинается<br />с <em>персонального запроса.</em></h1>
        <p>Напишите даты и состав гостей. Мы передадим заявку владельцам, чтобы они проверили свободные даты, рассчитали стоимость и связались с вами лично.</p>
      </section>

      <section className="booking-intro-strip">
        <div><CalendarDays /><span>Даты</span><p>Укажите желаемые дни заезда и выезда.</p></div>
        <div><Users /><span>Компания</span><p>Дом рассчитан максимум на 10 гостей.</p></div>
        <div><Clock3 /><span>Ответ</span><p>Заявка поступит владельцам через Telegram.</p></div>
        <Link href="/prices">Посмотреть все цены</Link>
      </section>

      <section className="private-form-section">
        <div className="form-heading">
          <span>Запрос свободных дат</span>
          <h2>Расскажите о<br />предстоящем отдыхе.</h2>
          <p>Поля со звёздочкой обязательны. После отправки заявки владелец подтвердит даты и окончательную стоимость.</p>
          <div className="form-assurance"><Check /> Данные используются только для связи по вашей заявке.</div>
        </div>

        <form className="private-form booking-request-form" onSubmit={submit} noValidate>
          <div className={`booking-calendar-field ${fieldErrors.arrival || fieldErrors.departure ? "has-error" : ""}`}>
            <AvailabilityCalendar
              value={dates}
              refreshToken={calendarRefresh}
              onChange={(selection) => {
                setDates(selection);
                clearFieldError("arrival");
                clearFieldError("departure");
              }}
            />
            <input type="hidden" name="arrival" value={dates.arrival} />
            <input type="hidden" name="departure" value={dates.departure} />
            {(fieldErrors.arrival || fieldErrors.departure) && (
              <small className="booking-calendar-error">{fieldErrors.arrival ?? fieldErrors.departure}</small>
            )}
          </div>

          <div className={`booking-field ${fieldErrors.name ? "has-error" : ""}`}>
            <label htmlFor="booking-name">Полное имя *</label>
            <div><UserRound /><input id="booking-name" required name="name" autoComplete="name" placeholder="Как к вам обращаться?" onChange={() => clearFieldError("name")} /></div>
            {fieldErrors.name && <small>{fieldErrors.name}</small>}
          </div>

          <div className={`booking-field ${fieldErrors.email ? "has-error" : ""}`}>
            <label htmlFor="booking-email">Электронная почта *</label>
            <div><Mail /><input id="booking-email" required name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" onChange={() => clearFieldError("email")} /></div>
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </div>

          <div className={`booking-field booking-field-wide ${fieldErrors.phone ? "has-error" : ""}`}>
            <label htmlFor="booking-phone">Телефон / мессенджер *</label>
            <div><Phone /><input id="booking-phone" required name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 29 000-00-00" onChange={() => clearFieldError("phone")} /></div>
            <small className="field-hint">Лучше указать номер, к которому привязан Telegram или WhatsApp.</small>
            {fieldErrors.phone && <small>{fieldErrors.phone}</small>}
          </div>

          <div className={`booking-field ${fieldErrors.guests ? "has-error" : ""}`}>
            <label htmlFor="booking-guests">Количество гостей *</label>
            <div><Users /><select id="booking-guests" name="guests" defaultValue="" onChange={() => clearFieldError("guests")}><option value="" disabled>Выберите</option>{Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option value={count} key={count}>{count} {count === 1 ? "гость" : count < 5 ? "гостя" : "гостей"}</option>)}</select></div>
            {fieldErrors.guests && <small>{fieldErrors.guests}</small>}
          </div>

          <div className="booking-field">
            <label htmlFor="booking-occasion">Повод поездки</label>
            <div><select id="booking-occasion" name="occasion" defaultValue="Отдых с близкими"><option>Отдых с близкими</option><option>Семейная поездка</option><option>Торжество</option><option>Банкет</option><option>Деловая встреча</option><option>Другое</option></select></div>
          </div>

          <fieldset className="booking-services">
            <legend>Что нужно учесть</legend>
            {["Купель Фурако", "Праздничное оформление", "Банкет", "Долгосрочная аренда", "Размещение с питомцем"].map((service) => (
              <label key={service}><input type="checkbox" name="services" value={service} /><span>{service}</span></label>
            ))}
          </fieldset>

          <div className="booking-field booking-field-wide">
            <label htmlFor="booking-message">Особые пожелания</label>
            <div className="booking-textarea"><textarea id="booking-message" rows={5} name="message" maxLength={1200} placeholder="Например: нужен банкет на 8 человек, планируем приехать с небольшой собакой..." /></div>
          </div>

          <label className="booking-honeypot" aria-hidden="true">Сайт<input name="website" tabIndex={-1} autoComplete="off" /></label>

          <AnimatePresence>
            {error && (
              <motion.div className="booking-form-error" role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <CircleAlert /> <span><strong>Заявка не отправлена.</strong>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="booking-submit" type="submit" disabled={submitting}>
            {submitting ? <><LoaderCircle className="booking-spinner" /> Отправляем заявку...</> : <>Отправить заявку <span>↗</span></>}
          </button>
          <small className="booking-consent">Нажимая кнопку, вы соглашаетесь на обработку данных для ответа на запрос о бронировании.</small>
        </form>
      </section>

      <section className="next-steps">
        <span>Что произойдёт дальше</span>
        <h2>Личный подход<br />с первого сообщения.</h2>
        <div>{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <AnimatePresence>
        {done && (
          <motion.div className="booking-confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="booking-success-title">
            <motion.div initial={{ scale: .9, y: 35 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 230, damping: 24 }}>
              <button type="button" onClick={() => setDone(false)} aria-label="Закрыть подтверждение"><X /></button>
              <motion.span initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: .15, type: "spring" }}><Check /></motion.span>
              <small>Запрос принят</small>
              <h2 id="booking-success-title">Заявка успешно отправлена</h2>
              <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время для подтверждения бронирования.</p>
              <button type="button" className="booking-confirmation-close" onClick={() => setDone(false)}>Вернуться на сайт</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
