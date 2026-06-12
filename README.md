# Дом на Южной

Сайт аренды дома в Борисове, созданный на Next.js 15, React, TypeScript и Tailwind CSS.

## Локальный запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run dev
```

После запуска сайт будет доступен по адресу `http://localhost:3000`.

## Производственная сборка

```bash
npm install
npm run build
npm run start
```

## Публикация на Vercel

1. Загрузите содержимое проекта в репозиторий GitHub.
2. Импортируйте репозиторий на Vercel.
3. Добавьте переменную окружения:

```env
NEXT_PUBLIC_SITE_URL=https://ваш-домен.by
TELEGRAM_BOT_TOKEN=токен_бота
TELEGRAM_CHAT_ID=идентификатор_чата
GOOGLE_CALENDAR_API_KEY=ключ_google_calendar_api
GOOGLE_CALENDAR_ID=идентификатор_календаря
GOOGLE_CALENDAR_TIMEZONE=Europe/Minsk
```

`TELEGRAM_BOT_TOKEN` выдаёт BotFather. В `TELEGRAM_CHAT_ID` указывается чат, группа или канал, куда должны приходить заявки. Бота необходимо заранее добавить в выбранный чат.

Для календаря необходимо включить Google Calendar API в Google Cloud, ограничить API-ключ только этим API и открыть выбранному календарю доступ на чтение событий. Сайт не передаёт ключ в браузер: запросы выполняются серверными маршрутами Next.js.

4. Выполните публикацию.

Все фотографии, логотипы, favicon и Open Graph изображения уже находятся в папке `public`.

## Обновление отзывов

Отзывы и сводный рейтинг хранятся отдельно от интерфейса в `data/reviews.json`. Для обновления достаточно изменить этот файл и дату `source.updatedAt`; клиентский компонент и SEO-разметка обновятся автоматически.
