"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GalleryCategory =
  | "exterior"
  | "interior"
  | "bedrooms"
  | "living"
  | "kitchen"
  | "grounds"
  | "bath"
  | "relaxation"
  | "amenities";

type GalleryItem = {
  file: string;
  category: GalleryCategory;
  categoryLabel: string;
  caption: string;
  alt: string;
  shape?: "portrait" | "landscape" | "standard";
};

const shots: GalleryItem[] = [
  ["album-03.jpg", "grounds", "Территория", "Терраса, купель и дом", "Крытая терраса, купель Фурако и Дом на Южной", "landscape"],
  ["album-04.jpg", "bath", "Купель", "Купель у тёплой террасы", "Купель Фурако рядом с крытой террасой", "portrait"],
  ["album-29.jpg", "exterior", "Дом снаружи", "Дом среди зелени", "Внешний вид Дома на Южной в Борисове", "landscape"],
  ["album-36.jpg", "grounds", "Территория", "Место для долгого вечера", "Уютная терраса с шезлонгами", "portrait"],
  ["album-24.jpg", "bath", "Купель", "Горячая вода под открытым небом", "Уличная купель Фурако", "standard"],
  ["album-22.jpg", "kitchen", "Кухня", "Всё для домашних ужинов", "Оборудованная кухня Дома на Южной", "landscape"],
  ["album-38.jpg", "bedrooms", "Спальни", "Тихое утро в доме", "Светлая спальня для гостей", "portrait"],
  ["album-08.jpg", "living", "Гостиная", "Пространство для праздника", "Празднично оформленная гостиная", "landscape"],
  ["album-01.jpg", "relaxation", "Зона отдыха", "Отдых на свежем воздухе", "Купель и шезлонги на деревянной террасе", "portrait"],
  ["album-30.jpg", "exterior", "Дом снаружи", "Архитектура для отдыха", "Боковой фасад Дома на Южной", "standard"],
  ["album-31.jpg", "grounds", "Территория", "Зелёная приватная территория", "Шезлонги в зелёном дворе", "landscape"],
  ["album-35.jpg", "kitchen", "Кухня", "Общий стол и кухня", "Кухня и обеденная зона", "portrait"],
  ["album-02.jpg", "grounds", "Территория", "Терраса за лёгкими шторами", "Крытая терраса с мягкими шторами", "portrait"],
  ["album-05.jpg", "amenities", "Дополнительные удобства", "Сервировка для особого дня", "Праздничная сервировка на террасе", "landscape"],
  ["album-06.jpg", "bath", "Купель", "Летнее настроение", "Купель с надувным фламинго", "standard"],
  ["album-07.jpg", "relaxation", "Зона отдыха", "Неспешный день у купели", "Пикник и зона отдыха рядом с купелью", "portrait"],
  ["album-09.jpg", "living", "Гостиная", "Дом, готовый к торжеству", "Праздничное оформление гостиной", "standard"],
  ["album-10.jpg", "living", "Гостиная", "Вечер за общим столом", "Гостиная с праздничным столом", "portrait"],
  ["album-11.jpg", "living", "Гостиная", "Всё готово к встрече гостей", "Банкетный стол в гостиной", "landscape"],
  ["album-12.jpg", "exterior", "Дом снаружи", "Праздник начинается у входа", "Украшенный вход в Дом на Южной", "portrait"],
  ["album-13.jpg", "bath", "Купель", "Купель в вечернем свете", "Купель Фурако с фиолетовой подсветкой", "landscape"],
  ["album-14.jpg", "bath", "Купель", "Вода, свет и тепло", "Вода в купели с вечерней подсветкой", "portrait"],
  ["album-15.jpg", "bath", "Купель", "Вечер у купели", "Накрытый стол рядом с купелью", "standard"],
  ["album-16.jpg", "bath", "Купель", "Мягкий гидромассаж", "Работающая купель Фурако с подсветкой", "landscape"],
  ["album-17.jpg", "relaxation", "Зона отдыха", "Ужин рядом с тёплой водой", "Закуски в зоне отдыха у купели", "portrait"],
  ["album-18.jpg", "bedrooms", "Спальни", "Комната для спокойного сна", "Гостевая спальня Дома на Южной", "standard"],
  ["album-19.jpg", "grounds", "Территория", "Воздух и пространство", "Терраса и купель на территории дома", "portrait"],
  ["album-20.jpg", "exterior", "Дом снаружи", "Дом в тихом районе Борисова", "Фасад дома и зелёная территория", "landscape"],
  ["album-21.jpg", "living", "Гостиная", "Большой праздничный стол", "Банкет в гостиной Дома на Южной", "portrait"],
  ["album-23.jpg", "amenities", "Дополнительные удобства", "Комфорт в каждой детали", "Ванная комната для гостей", "standard"],
  ["album-25.jpg", "bath", "Купель", "Напитки всегда рядом", "Подставка для напитков в купели", "portrait"],
  ["album-26.jpg", "relaxation", "Зона отдыха", "Бокал в тёплой воде", "Шампанское в зоне купели Фурако", "landscape"],
  ["album-27.jpg", "bath", "Купель", "Всё подготовлено к отдыху", "Купель Фурако и банные халаты", "portrait"],
  ["album-28.jpg", "bath", "Купель", "Купель для небольшой компании", "Просторная купель рядом с лавками", "standard"],
  ["album-32.jpg", "interior", "Интерьер", "Светлая обеденная зона", "Интерьер столовой и гостиной", "landscape"],
  ["album-33.jpg", "kitchen", "Кухня", "Удобная кухня для компании", "Кухонная зона с техникой", "portrait"],
  ["album-34.jpg", "relaxation", "Зона отдыха", "Пауза с бокалом игристого", "Бокалы шампанского в зоне отдыха", "standard"],
  ["album-37.jpg", "grounds", "Территория", "Купель среди зелени", "Купель Фурако на закрытой территории", "portrait"],
  ["album-39.jpg", "kitchen", "Кухня", "Кухня с выходом на террасу", "Кухня и дверь на террасу", "landscape"]
].map(([file, category, categoryLabel, caption, alt, shape]) => ({
  file,
  category: category as GalleryCategory,
  categoryLabel,
  caption,
  alt,
  shape: shape as GalleryItem["shape"]
}));

const filters: Array<[GalleryCategory | "all", string]> = [
  ["all", "Все"],
  ["exterior", "Дом снаружи"],
  ["interior", "Интерьер"],
  ["bedrooms", "Спальни"],
  ["living", "Гостиная"],
  ["kitchen", "Кухня"],
  ["grounds", "Территория"],
  ["bath", "Купель"],
  ["relaxation", "Зона отдыха"],
  ["amenities", "Дополнительные удобства"]
];

export function GalleryClient() {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [active, setActive] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(
    () => shots.filter((shot) => filter === "all" || shot.category === filter),
    [filter]
  );

  const close = useCallback(() => setActive(null), []);
  const previous = useCallback(() => {
    setActive((current) => current === null ? null : (current - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);
  const next = useCallback(() => {
    setActive((current) => current === null ? null : (current + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (active === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [active, close, next, previous]);

  useEffect(() => {
    if (active === null) return;
    thumbsRef.current
      ?.querySelector<HTMLButtonElement>(`[data-gallery-index="${active}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const selectFilter = (value: GalleryCategory | "all") => {
    setFilter(value);
    setActive(null);
  };

  return (
    <>
      <div className="gallery-filters" aria-label="Категории фотографий">
        {filters.map(([key, label]) => (
          <button
            type="button"
            className={filter === key ? "active" : ""}
            onClick={() => selectFilter(key)}
            key={key}
          >
            {label}<span>{key === "all" ? shots.length : shots.filter((shot) => shot.category === key).length}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="gallery-masonry">
        <AnimatePresence mode="popLayout">
          {filtered.map((shot, index) => (
            <motion.button
              type="button"
              aria-label={`Открыть фото: ${shot.caption}`}
              className={`gallery-card gallery-card-${shot.shape ?? "standard"}`}
              layout
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: .96 }}
              transition={{ duration: .55, delay: Math.min(index * .025, .3) }}
              key={shot.file}
              onClick={() => setActive(index)}
            >
              <Image
                src={`/images/album/${shot.file}`}
                fill
                alt={shot.alt}
                loading="lazy"
                quality={82}
                sizes="(max-width: 680px) 94vw, (max-width: 1000px) 48vw, 32vw"
              />
              <span className="gallery-card-shade" />
              <span className="gallery-card-copy">
                <small>{shot.categoryLabel}</small>
                <strong>{shot.caption}</strong>
              </span>
              <span className="gallery-card-open"><Maximize2 size={15} /></span>
              <span className="gallery-card-number">{String(index + 1).padStart(2, "0")}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active !== null && filtered[active] && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Полноэкранный просмотр галереи"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div className="gallery-lightbox-top">
              <span>{filtered[active].categoryLabel}</span>
              <span>{String(active + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}</span>
              <button type="button" onClick={close} aria-label="Закрыть полноэкранный просмотр"><X /></button>
            </div>

            <button type="button" className="gallery-lightbox-prev" onClick={previous} aria-label="Предыдущее изображение"><ArrowLeft /></button>
            <motion.div
              className="gallery-lightbox-stage"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={.18}
              onDragEnd={(_, info) => {
                if (info.offset.x > 60) previous();
                if (info.offset.x < -60) next();
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="gallery-lightbox-image"
                  key={filtered[active].file}
                  initial={{ opacity: 0, scale: .96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: .35 }}
                >
                  <Image
                    src={`/images/album/${filtered[active].file}`}
                    fill
                    priority
                    quality={88}
                    alt={filtered[active].alt}
                    sizes="95vw"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <button type="button" className="gallery-lightbox-next" onClick={next} aria-label="Следующее изображение"><ArrowRight /></button>

            <div className="gallery-lightbox-bottom">
              <div className="gallery-lightbox-caption">
                <p>{filtered[active].caption}</p>
                <small>Листайте свайпом, миниатюрами или стрелками</small>
              </div>
              <div className="gallery-lightbox-thumbs" ref={thumbsRef} aria-label="Миниатюры галереи">
                {filtered.map((shot, index) => (
                  <button
                    type="button"
                    data-gallery-index={index}
                    className={index === active ? "active" : ""}
                    aria-label={`Показать фото ${index + 1}: ${shot.caption}`}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => setActive(index)}
                    key={shot.file}
                  >
                    <Image src={`/images/album/${shot.file}`} fill alt="" loading="lazy" sizes="68px" quality={55} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
