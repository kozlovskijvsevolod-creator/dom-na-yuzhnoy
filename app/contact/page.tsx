"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-intro">
        <span>Частные обращения / 07</span>
        <h1>Тихий ответ<br />на <em>личный запрос.</em></h1>
        <p>Для уточнения свободных дат и стоимости свяжитесь с владельцами Дома на Южной по телефону или через официальный профиль в Инстаграм.</p>
        <div>
          <a href="tel:+375296479387">+375 29 647-93-87 <ArrowUpRight /></a>
          <a href="tel:+375296442910">+375 29 644-29-10 <ArrowUpRight /></a>
          <a href="https://www.instagram.com/dom_na_yuzhnoy/" target="_blank" rel="noreferrer">Написать в Инстаграм <ArrowUpRight /></a>
        </div>
      </section>
      <section className="contact-form">
        {sent ? (
          <div className="form-success">
            <span>✓</span>
            <h2>Готово.</h2>
            <p>Форма заполнена. Для отправки запроса владельцам свяжитесь с ними по телефону или через Инстаграм.</p>
            <button onClick={() => setSent(false)}>Отправить ещё одно сообщение</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="field"><label>Ваше имя</label><input required placeholder="Как к вам обращаться?" /></div>
            <div className="field"><label>Электронная почта</label><input required type="email" placeholder="вашадрес@почта.рф" /></div>
            <div className="field"><label>Телефон / мессенджер</label><input placeholder="+375 29 000-00-00" /></div>
            <div className="field">
              <label>Формат поездки</label>
              <select>
                <option>Уединённый отдых</option>
                <option>Семейная встреча</option>
                <option>Камерное торжество</option>
                <option>Долгосрочная аренда</option>
              </select>
            </div>
            <div className="field"><label>Ваше сообщение</label><textarea required rows={4} placeholder="Расскажите, что вы задумали..." /></div>
            <button className="send">Подготовить обращение <ArrowUpRight /></button>
          </form>
        )}
      </section>
    </div>
  );
}
