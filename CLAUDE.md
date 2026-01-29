# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

PDF Styler — React-приложение для стилизации документов с AI-анализом структуры. Преобразует txt/md/docx/csv в красиво оформленные PDF.

**Стек:** Vite + React + TypeScript

## Команды

```bash
npm install      # Установка зависимостей
npm run dev      # Dev-сервер (localhost:5173)
npm run build    # Сборка в dist/
npm run preview  # Превью production-сборки
```

## Структура проекта

```
├── src/
│   ├── main.tsx           # Точка входа
│   ├── App.tsx            # Корневой компонент
│   ├── pdf_styler.tsx     # Основной компонент (~870 строк)
│   └── vite-env.d.ts      # TypeScript типы для Vite
├── index.html             # HTML-шаблон
├── vite.config.ts         # Конфигурация Vite
├── tsconfig.json          # TypeScript конфигурация
└── package.json           # Зависимости и скрипты
```

## Архитектура компонента

`src/pdf_styler.tsx` содержит:

| Функция/Компонент | Назначение |
|-------------------|------------|
| `analyzeWithAI()` | Отправка текста на анализ через Open Router (DeepSeek) |
| `parseSimple()` | Fallback парсер без AI (markdown, списки, заголовки) |
| `parseCsv()` | Парсинг CSV через PapaParse |
| `generatePDF()` | Создание PDF с jsPDF |
| `Preview` | Компонент превью документа |
| `ThemeCard` | Карточка выбора темы |
| `Confetti` | Анимация при успешном создании |

### Состояния приложения

```
idle → loading → analyzing → ready → (generating)
         ↓
       error
```

### Поддерживаемые форматы

- `.txt`, `.md` — текстовые файлы
- `.docx` — через mammoth
- `.csv` — через PapaParse

Лимит: 10 МБ на файл.

## Темы оформления

7 встроенных тем: `minimalism`, `elegant`, `modern`, `corporate`, `creative`, `academic`, `dark`

Каждая тема определяет: цвета, шрифты, стили заголовков (`headingStyle`), цитат (`quoteStyle`), списков (`listStyle`).

## API интеграция

AI-анализ использует Open Router API с моделью DeepSeek (`deepseek/deepseek-chat-v3-0324`).

**Конфигурация:**
- URL: `https://openrouter.ai/api/v1/chat/completions`
- Формат: OpenAI-совместимый (messages с system/user roles)
- Ключ: переменная окружения `VITE_OPENROUTER_API_KEY`

Fallback на `parseSimple()` при недоступности API. Текст обрезается до 15000 символов.

## Деплой на Vercel

**Настройки Vercel:**
- Framework Preset: **Vite**
- Build Command: `vite build`
- Output Directory: `dist`
- Environment Variables: `VITE_OPENROUTER_API_KEY`

## Горячие клавиши

- `←/→` — переключение тем
- `Space` — создать PDF

## Зависимости

- `react`, `react-dom` — React 18
- `lucide-react` — иконки
- `mammoth` — парсинг DOCX
- `papaparse` — парсинг CSV
- `jsPDF` — загружается из CDN v2.5.1
