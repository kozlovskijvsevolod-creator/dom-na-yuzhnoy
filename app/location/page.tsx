import Image from "next/image";
import { ArrowUpRight, Building2, BusFront, Clock3, House, MapPin, Route } from "lucide-react";
import { BookingBand, PageHero, Reveal } from "@/components/UI";

export const metadata = { title: "Расположение", description: "Дом на Южной находится по адресу: Беларусь, Минская область, Борисов, улица Южная, 12А. Около 70 км от Минска." };

const distances = [
  [Route, "≈ 70 км", "от Минска"],
  [BusFront, "550 м", "до остановки «Улица Батурина»"],
  [Building2, "Борисов", "городские удобства рядом"],
  [Clock3, "24 / 7", "режим работы по Яндекс Картам"],
  [MapPin, "12А", "улица Южная"]
];

export default function Location() {
  return <>
    <PageHero eyebrow="Расположение / 05" title="В центре Борисова. В тихом районе." text="Минская область, Борисов, улица Южная, 12А. Около 70 километров от Минска." image="/images/DEXe4w0oUmD-2.jpg" />
    <section className="location-mood">
      <div className="location-mood-image"><Image src="/images/DEXe4w0oUmD-3.jpg" fill alt="Дом на Южной и крытая терраса" sizes="50vw" /></div>
      <Reveal><span>Тихий городской район</span><h2>Спокойная улица.<br />Всё нужное<br />остаётся рядом.</h2><p>Дом расположен в тихом и безопасном районе Борисова. Гости получают приватное пространство для отдыха, не отказываясь от удобства городской инфраструктуры.</p></Reveal>
    </section>
    <section className="distance-section editorial">
      <span>Проверенные ориентиры</span>
      <div className="distance-grid">{distances.map(([Icon,time,label],i) => <Reveal key={label as string} delay={i*.05}><Icon /><span>0{i+1}</span><strong>{time as string}</strong><p>{label as string}</p></Reveal>)}</div>
    </section>
    <section className="dark-map">
      <div className="map-lines"><i /><i /><i /></div>
      <span className="gold-pin pin-house"><House aria-hidden="true" /><small>ДОМ НА ЮЖНОЙ</small></span>
      <span className="gold-pin pin-air">М<small>МИНСК · ОКОЛО 70 КМ</small></span>
      <span className="gold-pin pin-sea">●<small>ОСТАНОВКА · 550 М</small></span>
      <div className="dark-map-copy"><span>Минская область · Борисов</span><h2>Южная улица, 12А.</h2><p>Маршрут и актуальное положение дома можно открыть в официальной карточке организации на Яндекс Картах.</p><a href="https://yandex.by/maps/org/dom_na_yuzhnoy/101450404971/" target="_blank" rel="noreferrer">Открыть на карте <ArrowUpRight /></a></div>
    </section>
    <BookingBand />
  </>;
}
