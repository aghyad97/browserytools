import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        В каждой кодовой базе есть контекст, который живёт только в головах работающих с ней
        инженеров. Причина запуска миграций в определённом порядке. Соглашение об именовании
        таблиц в базе данных. Файл, который нельзя трогать без предварительного прогона полного
        набора тестов. Когда вы подключаете AI-ассистента для написания кода без этого контекста,
        вы получаете обобщённые предложения, нарушающие ваши соглашения, ломающие ваши паттерны
        и требующие постоянных поправок.
      </p>
      <ToolCTA slug="claude-md-generator" variant="inline" />
      <p>
        Файл <code>CLAUDE.md</code> решает эту проблему. Воспользуйтесь{" "}
        <a href="/tools/claude-md-generator">Генератором CLAUDE.md BrowseryTools</a> — бесплатно,
        без регистрации, всё остаётся в браузере — чтобы создать хорошо структурированный
        файл контекста для вашего проекта за несколько минут.
      </p>

      <h2>Что такое CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> — это простой файл Markdown, расположенный в корне проекта,
        который Claude Code автоматически читает в начале каждой сессии. Это не конфигурационный
        файл в техническом смысле — никакого специального синтаксиса, никакой схемы для валидации.
        Это документация, написанная для AI-читателя, а не для человека, — отвечающая на вопросы,
        которые задал бы квалифицированный новый разработчик в первый день работы.
      </p>
      <p>
        Когда Claude Code запускается в директории вашего проекта, он читает <code>CLAUDE.md</code>{" "}
        и использует содержимое как постоянный контекст на протяжении всей сессии. Каждое
        предложение, каждая генерация кода, каждый ответ на вопрос опирается на то, что
        написано в этом файле. Эффект немедленный и ощутимый: AI, знающий ваш стек, соглашения
        об именовании и архитектуру, даёт принципиально лучшие предложения, чем тот, что
        догадывается.
      </p>

      <h2>Что включать</h2>

      <h3>Технологический стек и окружение</h3>
      <p>
        Начните с основ. Какой язык, фреймворк и среда выполнения используются в проекте?
        Какой менеджер пакетов? Какая версия Node, Python или Go? Какая база данных?
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Tech Stack
- Language: TypeScript 5.x
- Framework: Next.js 15 (App Router)
- Database: PostgreSQL via Supabase (supabase-js v2)
- Styling: Tailwind CSS v4
- Package manager: pnpm
- Node version: 22 (see .nvmrc)`}
      </pre>

      <h3>Архитектура проекта</h3>
      <p>
        Опишите высокоуровневую структуру — как организована кодовая база и почему. Если
        в монорепозитории несколько приложений — назовите их. Если есть значимое разделение
        между фронтендом и бэкендом — объясните его.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Architecture
Turborepo monorepo with three packages:
- apps/web — Next.js customer-facing app
- apps/dashboard — Internal admin panel (same stack)
- packages/db — Shared Drizzle schema and migration tooling

All database access goes through packages/db. Never import raw supabase-js
directly in app code — use the typed client exported from packages/db.`}
      </pre>

      <h3>Команды разработки</h3>
      <p>
        Это одна из самых ценных секций. Перечислите точные команды для запуска проекта,
        тестов, сборки, линтинга и деплоя. Claude будет использовать их, а не угадывать
        типичные команды, которые могут не подходить для вашей конфигурации.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Commands
- \`pnpm dev\` — Start all apps in development mode
- \`pnpm test\` — Run Vitest unit tests
- \`pnpm test:e2e\` — Run Playwright end-to-end tests (requires running dev server)
- \`pnpm lint\` — ESLint + Biome checks
- \`pnpm db:migrate\` — Apply pending Drizzle migrations
- \`pnpm db:generate\` — Generate new migration from schema changes
- \`pnpm build\` — Production build (runs type-check first)`}
      </pre>

      <h3>Соглашения кода</h3>
      <p>
        Перечислите соглашения, отличающиеся от языковых стандартов или которые новые инженеры
        последовательно нарушают. Такие вещи, как паттерны именования, организация файлов,
        обработка ошибок и порядок импортов.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Conventions
- File names: kebab-case for all files (user-profile.tsx, not UserProfile.tsx)
- Component exports: named exports only, no default exports in components
- Database tables: snake_case (user_profiles, not userProfiles)
- Error handling: always use the Result type from packages/utils, never throw
- API routes: REST-style, versioned at /api/v1/
- Environment variables: must be declared in /apps/web/env.ts before use`}
      </pre>

      <h3>Ключевые файлы и директории</h3>
      <p>
        Укажите файлы, особенно важные, неочевидные или опасные для изменения без понимания
        их роли.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Key Files
- packages/db/schema.ts — Single source of truth for all DB tables. Modifying
  this requires a migration (pnpm db:generate).
- apps/web/middleware.ts — Handles auth routing and locale detection. Touch
  with care — bugs here affect every page load.
- apps/web/app/api/webhooks/ — Stripe and Supabase webhook handlers. Must be
  tested against real webhook payloads, not mocked.`}
      </pre>

      <h2>Что НЕ включать</h2>
      <ul>
        <li><strong>Секреты и учётные данные</strong> — никогда не помещайте API-ключи, пароли
        баз данных или токены в <code>CLAUDE.md</code>. Файл коммитится в систему контроля версий
        и доступен всем, у кого есть доступ к репозиторию. Используйте переменные окружения и
        менеджеры секретов.</li>
        <li><strong>Очевидную информацию</strong> — не нужно сообщать Claude, что TypeScript-файлы
        имеют расширение <code>.ts</code> или что React-компоненты возвращают JSX. Сосредоточьтесь
        на том, что специфично для вашего проекта и не было бы очевидно из структуры файлов.</li>
        <li><strong>Устаревшие инструкции</strong> — файл <code>CLAUDE.md</code>, в котором написано
        «мы используем Redux», когда вы уже полгода назад перешли на Zustand, хуже, чем его отсутствие.
        Обращайтесь с ним как с любой другой документацией: обновляйте при изменении кодовой базы.</li>
        <li><strong>Внутренние обсуждения и обоснование решений</strong> — длинные объяснения причин
        архитектурного решения лучше хранить в отдельных ADR (Architecture Decision Records). Держите
        <code>CLAUDE.md</code> как краткий справочник, а не исторический документ.</li>
      </ul>

      <h2>Полный пример CLAUDE.md</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`# Project: Acme Dashboard

## Tech Stack
- TypeScript 5 / Next.js 15 App Router
- Tailwind CSS v4 + shadcn/ui
- Supabase (auth + database)
- Vitest (unit) + Playwright (e2e)
- pnpm workspaces

## Commands
- \`pnpm dev\` — start dev server on :3000
- \`pnpm test\` — unit tests
- \`pnpm lint\` — biome check
- \`pnpm db:push\` — push schema to Supabase (dev only)

## Architecture
Single Next.js app. Server Components by default; use "use client" only when
needed for interactivity. All data fetching goes through lib/data/ functions
which wrap supabase-js queries. Never call supabase directly in components.

## Conventions
- kebab-case filenames everywhere
- Named exports for all components
- Zod for all form validation
- shadcn/ui components live in components/ui/, custom components in components/

## Key Files
- lib/supabase/server.ts — server-side Supabase client (use in RSC)
- lib/supabase/client.ts — browser Supabase client (use in client components)
- middleware.ts — auth session refresh, runs on every request`}
      </pre>

      <h2>Как помогает Генератор CLAUDE.md</h2>
      <p>
        Написание <code>CLAUDE.md</code> с нуля требует помнить, что охватить в каждой важной
        секции, и заполнять их последовательно.{" "}
        <a href="/tools/claude-md-generator">Генератор CLAUDE.md BrowseryTools</a> предоставляет
        структурированную форму, проводящую через каждую секцию — технологический стек, команды,
        архитектуру, соглашения, ключевые файлы — и создающую чистый, хорошо отформатированный
        файл Markdown, который можно немедленно поместить в корень проекта. Это занимает около
        пяти минут, а улучшение качества AI-предложений ощущается сразу.
      </p>

      <h2>Файлы CLAUDE.md для поддиректорий</h2>
      <p>
        Claude Code также читает файлы <code>CLAUDE.md</code> в поддиректориях при работе внутри
        них. Это значит, что монорепозиторий может иметь <code>CLAUDE.md</code> на корневом
        уровне, охватывающий общие соглашения, и отдельные <code>CLAUDE.md</code> в директории
        каждого приложения с его специфическими деталями. Контекст корневого уровня всегда
        включается; контекст поддиректории добавляется, когда Claude работает в этой части дерева.
      </p>

      <h2>Итоги</h2>
      <p>
        Файл <code>CLAUDE.md</code> — самое значимое улучшение, которое можно добавить в кодовую
        базу при регулярном использовании Claude Code. Пять минут документирования устраняют
        десятки поправок за сессию. Включайте технологический стек, команды разработки, обзор
        архитектуры, соглашения кода и указания на критические файлы. Исключайте секреты,
        очевидные факты и устаревшую информацию. Поддерживайте актуальность и относитесь к нему
        как к документации первого класса — потому что в контексте AI-разработки это именно так и есть.
      </p>
      <ToolCTA slug="claude-md-generator" variant="card" />
    </div>
  );
}
