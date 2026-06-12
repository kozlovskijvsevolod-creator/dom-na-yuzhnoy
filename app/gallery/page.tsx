import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { GalleryClient } from "@/components/GalleryClient";
import { BookingBand, PageHero } from "@/components/UI";

export const metadata = { title: "Галерея Дома на Южной", description: "39 фотографий дома, спален, кухни, гостиной, территории, зоны отдыха, купели Фурако и праздничного оформления Дома на Южной." };

export default function Gallery() {
  return <>
    <PageHero eyebrow="Галерея / 03" title="Посмотрите, как устроен Дом на Южной." text="Все фотографии из альбома: комнаты, кухня, крытая терраса, территория, горячая купель и варианты оформления для праздников." image="/images/album/album-03.jpg" />
    <section className="gallery-page editorial"><GalleryClient /></section>
    <section className="video-tour">
      <Image src="/images/album/album-29.jpg" fill alt="Дом на Южной среди зелени" sizes="100vw" />
      <div className="hero-shade" />
      <div><span>Видео из официального профиля</span><h2>Прогуляйтесь по дому<br />до своего приезда.</h2><a className="video-play-link" href="https://www.tiktok.com/@dom_na_yuzhnoy" target="_blank" rel="noreferrer" aria-label="Открыть видео Дома на Южной в ТикТок"><Play fill="currentColor" /></a></div>
    </section>
    <section className="tour-cta"><span>Свежие фотографии и видео</span><h2>Следите за жизнью<br />Дома на Южной.</h2><Link href="https://www.instagram.com/dom_na_yuzhnoy/" target="_blank" rel="noreferrer">Открыть Инстаграм <ArrowUpRight /></Link></section>
    <BookingBand />
  </>;
}
