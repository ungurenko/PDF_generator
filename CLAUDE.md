# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

PDF Styler — React-компонент для стилизации документов с AI-анализом структуры. Преобразует txt/md/docx/csv в красиво оформленные PDF.

**Статус:** Standalone компонент без инфраструктуры сборки (нет package.json, тестов).

## Зависимости

Для работы компонента требуются:

```
react (16.8+ с hooks)
lucide-react (иконки)
mammoth (парсинг DOCX)
papaparse (парсинг CSV)
jsPDF (загружается из CDN v2.5.1)
```

API: Open Router (`deepseek/deepseek-chat-v3-0324`)

## Архитектура компонента

`pdf_styler.tsx` (~870 строк) содержит:

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

**Для Vercel:** добавить `VITE_OPENROUTER_API_KEY` в Settings → Environment Variables.

Fallback на `parseSimple()` при недоступности API. Текст обрезается до 15000 символов.

## Горячие клавиши

- `←/→` — переключение тем
- `Space` — создать PDF

## Известные ограничения

- Нет инфраструктуры сборки — компонент нужно импортировать в существующее React-приложение
- jsPDF загружается из CDN динамически
- Требуется переменная окружения `VITE_OPENROUTER_API_KEY` с ключом Open Router
