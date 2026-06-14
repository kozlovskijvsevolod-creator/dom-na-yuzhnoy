"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Maximize2, Quote, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type Review = {
  author: string;
  date: string;
  rating: number;
  text: string;
  accent: string;
  image?: string;
  imageAlt?: string;
};

export type ReviewsData = {
  source: { name: string; url: string; updatedAt: string };
  rating: number;
  ratingCount: number;
  reviewCount: number;
  collectionCount: number;
  items: Review[];
};

const ratingFilters = ["Все", "5", "4", "3", "2", "1"];

export function ReviewsClient({ data }: { data: ReviewsData }) {
  const [filter, setFilter] = useState("Все");
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const reviews = useMemo(
    () => [...data.items].sort((first, second) => second.rating - first.rating),
    [data.items]
  );
  const filtered = useMemo(
    () => filter === "Все" ? reviews : reviews.filter((review) => review.rating === Number(filter)),
    [filter, reviews]
  );

  useEffect(() => {
    if (!activeReview) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveReview(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeReview]);

  return (
    <>
      <section className="reviews-summary editorial">
        <div className="reviews-score">
          <small>Рейтинг на Яндекс Картах</small>
          <strong>{String(data.rating).replace(".", ",")}</strong>
          <div aria-label={`Рейтинг ${String(data.rating).replace(".", ",")} из 5`}>
            {Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" />)}
          </div>
          <p>{data.ratingCount} оценок на Яндекс Картах · {data.collectionCount} отзывов в подборке</p>
        </div>
        <div className="reviews-trust-copy">
          <span>Проверенный источник</span>
          <h2>Впечатления людей,<br /><em>которые уже были в доме.</em></h2>
          <p>В подборке собраны отзывы с Яндекс Карт и оригинальные скриншоты, предоставленные владельцем. Для новых отзывов можно открыть исходное изображение.</p>
          <a href={data.source.url} target="_blank" rel="noreferrer">
            Открыть отзывы на Яндекс Картах <ExternalLink />
          </a>
          <small className="reviews-updated">Данные обновлены: {data.source.updatedAt.split("-").reverse().join(".")}</small>
        </div>
      </section>

      <section className="reviews-list-section editorial">
        <div className="reviews-list-heading">
          <div><span>Отзывы гостей</span><h2>Спокойно. Честно.<br />Из первых рук.</h2></div>
          <div className="review-filters" aria-label="Фильтр отзывов по оценке">
            {ratingFilters.map((rating) => (
              <button type="button" key={rating} onClick={() => setFilter(rating)} className={filter === rating ? "active" : ""}>
                {rating === "Все" ? "Все" : <>{rating} <Star fill="currentColor" /></>}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="review-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, index) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: .96 }}
                transition={{ delay: index * .05 }}
                key={`${review.author}-${review.date}`}
              >
                <Quote />
                {review.image && (
                  <button
                    type="button"
                    className="review-original"
                    onClick={() => setActiveReview(review)}
                    aria-label={`Открыть оригинал отзыва: ${review.accent}`}
                  >
                    <Image
                      src={review.image}
                      fill
                      alt={review.imageAlt ?? `Оригинал отзыва от ${review.author}`}
                      quality={90}
                      loading="lazy"
                      sizes="(max-width: 800px) 92vw, 45vw"
                    />
                    <span><Maximize2 /> Открыть оригинал</span>
                  </button>
                )}
                <div className="review-card-stars">
                  {review.rating > 0
                    ? Array.from({ length: review.rating }, (_, star) => <Star key={star} fill="currentColor" />)
                    : <span>Без числовой оценки</span>}
                </div>
                <h3>{review.accent}</h3>
                <p>{review.text}</p>
                <footer><strong>{review.author}</strong><span>{review.date}</span></footer>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {!filtered.length && (
          <motion.div className="review-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Star />
            <h3>Отзывов с такой оценкой пока нет</h3>
            <p>Все опубликованные гости поставили Дому на Южной 5 из 5.</p>
            <button type="button" onClick={() => setFilter("Все")}>Показать все отзывы</button>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {activeReview?.image && (
          <motion.div
            className="review-image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Оригинал отзыва от ${activeReview.author}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveReview(null);
            }}
          >
            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }}>
              <button type="button" onClick={() => setActiveReview(null)} aria-label="Закрыть оригинал отзыва"><X /></button>
              <Image src={activeReview.image} fill alt={activeReview.imageAlt ?? `Оригинал отзыва от ${activeReview.author}`} quality={100} sizes="95vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
