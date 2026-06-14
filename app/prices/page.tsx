import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgePercent, CalendarDays, Check, Flame, PartyPopper, Users } from "lucide-react";
import { BookingBand, PageHero, Reveal } from "@/components/UI";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";

export const metadata: Metadata = {
  title: "Цены и акции",
  description: "Актуальные цены на аренду Дома на Южной, стоимость купели и банкета, акции и мини-календарь ближайшей доступности."
};

const weekdays = [
  [2, 200], [3, 300], [4, 350], [5, 400], [6, 450], [7, 500], [8, 600], [9, 650], [10, 700]
];

const weekends = [
  [2, 200], [3, 300], [4, 400], [5, 500], [6, 550], [7, 600], [8, 650], [9, 700], [10, 750]
];

const offers = [
  ["−50%", "Для пар", "Скидка на второй день бронирования.", "DGQGOfsNNbm-1.jpg"],
  ["−20%", "Срочное бронирование", "При бронировании за один день до заезда или непосредственно в день заезда.", "DF7csgDMZnU-1.jpg"],
  ["от 200 BYN", "Тариф для двоих", "Стоимость проживания для пары в будний или выходной день.", "DEqTvIQthrb-1.jpg"],
  ["Можно вместе", "Отдых с питомцами", "Дом принимает гостей с домашними животными. Условия размещения согласовываются заранее.", "offers/pets-friendly.jpg"]
];

function PriceTable({ rows }: { rows: number[][] }) {
  return (
    <div className="price-table">
      {rows.map(([guests, price]) => (
        <div key={guests}>
          <span>{guests} {guests < 5 ? "гостя" : "гостей"}</span>
          <strong>{price} BYN</strong>
        </div>
      ))}
    </div>
  );
}

export default function PricesPage() {
  return (
    <>
      <PageHero
        eyebrow="Цены / 05"
        title="Понятная стоимость. Никаких сюрпризов."
        text="Цена зависит от дня недели и количества гостей. Все суммы ниже перенесены из официального прайса Дома на Южной."
        image="/images/album/album-03.jpg"
      />

      <section className="price-intro editorial">
        <div>
          <span>Проживание</span>
          <h2>Выберите день<br /><em>и состав компании.</em></h2>
        </div>
        <p>Минимальная стоимость проживания — 200 BYN за двоих. В праздничные дни действует прайс выходного дня. Итоговую сумму и свободные даты подтверждает владелец.</p>
      </section>

      <section className="price-cards editorial">
        <article className="price-card">
          <div className="price-card-top"><CalendarDays /><span>Пн · Вт · Ср · Чт</span></div>
          <small>Будние дни</small>
          <h2>От 200 BYN</h2>
          <p>Стоимость суток для компании от 2 до 10 гостей.</p>
          <PriceTable rows={weekdays} />
          <Link href="/booking">Запросить будние даты <ArrowUpRight /></Link>
        </article>

        <article className="price-card price-card-featured">
          <div className="price-popular">Самый популярный тариф</div>
          <div className="price-card-top"><CalendarDays /><span>Пт · Сб · Вс</span></div>
          <small>Выходные дни</small>
          <h2>От 200 BYN</h2>
          <p>В праздничные дни также применяется этот прайс.</p>
          <PriceTable rows={weekends} />
          <Link href="/booking">Запросить выходные даты <ArrowUpRight /></Link>
        </article>
      </section>

      <section className="extras-pricing editorial">
        <div className="extras-heading">
          <span>Дополнительные форматы</span>
          <h2>Тепло купели.<br /><em>Большой общий стол.</em></h2>
        </div>
        <div className="extras-grid">
          <article>
            <Flame />
            <span>Купель Фурако</span>
            <h3>От 150 BYN</h3>
            <ul>
              <li><Check /> Для пары — 150 BYN</li>
              <li><Check /> Для компании из 4 человек — 200 BYN</li>
              <li><Check /> Для компании свыше 4 человек — 250 BYN</li>
              <li><Check /> Вторые и последующие сутки без смены воды — 80 BYN</li>
            </ul>
            <p>Купель одновременно вмещает до 6 человек.</p>
          </article>
          <article>
            <PartyPopper />
            <span>Банкет</span>
            <h3>От 40 BYN / чел.</h3>
            <ul>
              <li><Check /> До 10 человек — 50 BYN с человека</li>
              <li><Check /> Свыше 10 человек — 40 BYN с человека</li>
              <li><Check /> Время проведения — с 14:00 до 00:00</li>
              <li><Check /> После 00:00 — 50 BYN за каждый час</li>
            </ul>
            <p>Скидки и акции на бронирование банкета не распространяются.</p>
          </article>
        </div>
      </section>

      <section className="offers-section price-offers editorial">
        <div className="price-offers-title"><BadgePercent /><span>Акции</span><h2>Больше времени<br /><em>для своих.</em></h2><p>Акции перенесены с главной страницы. Их применение, сочетание и доступность на выбранные даты подтверждает владелец.</p></div>
        <div className="verified-offers">
          {offers.map(([value, title, text, image], index) => (
            <Reveal key={title} delay={index * .08}>
              <div className="verified-offer-image"><Image src={`/images/${image}`} fill alt={`Акция: ${title}`} loading="lazy" sizes="(max-width: 680px) 92vw, 33vw" /></div>
              <span>0{index + 1}</span><strong>{value}</strong><h3>{title}</h3><p>{text}</p>
              <Link href="/booking">Уточнить условия <ArrowUpRight /></Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="price-availability editorial">
        <div className="price-availability-copy">
          <span>Доступность дома</span>
          <h2>Сначала даты.<br /><em>Затем планы.</em></h2>
          <p>Календарь показывает занятые периоды из Google Calendar владельца. Для выбора точного периода перейдите к форме бронирования.</p>
        </div>
        <AvailabilityCalendar mode="compact" />
      </section>

      <section className="price-note">
        <Users />
        <p>Дом рассчитан на 10 спальных мест. Праздники, банкет, размещение с питомцами и дополнительные услуги согласовываются заранее.</p>
      </section>

      <BookingBand />
    </>
  );
}
