export default function Content() {
  return (
    <div>
      <p>
        Every codebase has context that lives only in the heads of the engineers who work on it. The
        reason migrations run in a specific order. The convention for naming database tables. The one
        file that must never be touched without running the full test suite first. When you bring an AI
        coding assistant into that codebase without giving it this context, you get generic suggestions
        that miss your conventions, break your patterns, and require constant correction.
      </p>
      <p>
        A <code>CLAUDE.md</code> file solves this. You can use the{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md Generator</a> — free, no sign-up,
        everything stays in your browser — to build a well-structured context file for your project in
        minutes.
      </p>

      <h2>What Is CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> is a plain Markdown file placed at the root of your project that Claude
        Code automatically reads at the start of every session. It is not a configuration file in the
        technical sense — no special syntax, no schema to validate against. It is documentation written
        for an AI reader rather than a human one, answering the questions a skilled new engineer would
        ask on their first day.
      </p>
      <p>
        When Claude Code starts in your project directory, it reads <code>CLAUDE.md</code> and uses the
        contents as standing context throughout the session. Every suggestion, every code generation, every
        answer to a question is informed by what is in that file. The effect is immediate and significant:
        an AI that knows your stack, your naming conventions, and your architecture gives fundamentally
        better suggestions than one that is guessing.
      </p>

      <h2>What to Include</h2>

      <h3>Tech Stack and Environment</h3>
      <p>
        Start with the fundamentals. What language, framework, and runtime is this project using? What
        package manager? What version of Node, Python, or Go? What database?
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

      <h3>Project Architecture</h3>
      <p>
        Describe the high-level structure — how the codebase is organized and why. If there are multiple
        apps in a monorepo, name them. If there is a meaningful separation between frontend and backend,
        explain it.
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

      <h3>Development Commands</h3>
      <p>
        This is one of the highest-value sections. List the exact commands to run the project, run tests,
        build, lint, and deploy. Claude will use these rather than guessing common commands that might
        not apply to your setup.
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

      <h3>Code Conventions</h3>
      <p>
        List the conventions that differ from language defaults or that new engineers consistently get
        wrong. Things like naming patterns, file organization, how to handle errors, and import ordering.
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

      <h3>Key Files and Directories</h3>
      <p>
        Point out files that are particularly important, non-obvious, or dangerous to modify without
        understanding their role.
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

      <h2>What NOT to Include</h2>
      <ul>
        <li><strong>Secrets and credentials</strong> — Never put API keys, database passwords, or tokens
        in <code>CLAUDE.md</code>. The file is committed to version control and is readable by anyone
        with repository access. Use environment variables and a secrets manager.</li>
        <li><strong>Information that is already obvious</strong> — You do not need to tell Claude that
        TypeScript files end in <code>.ts</code> or that React components return JSX. Focus on things
        that are specific to your project and would not be obvious from the file structure alone.</li>
        <li><strong>Outdated instructions</strong> — A <code>CLAUDE.md</code> that says "we use Redux"
        when you migrated to Zustand six months ago is worse than no file at all. Treat it like any other
        documentation: update it when the codebase changes.</li>
        <li><strong>Internal discussions or rationale</strong> — Long explanations of why you made an
        architectural decision are better in a separate ADR (Architecture Decision Record). Keep
        <code>CLAUDE.md</code> as a quick reference, not a history document.</li>
      </ul>

      <h2>A Complete CLAUDE.md Example</h2>
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

      <h2>How the CLAUDE.md Generator Helps</h2>
      <p>
        Writing a <code>CLAUDE.md</code> from scratch means remembering to cover every important section
        and filling them in consistently. The{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md Generator</a> provides a structured
        form that walks you through each section — tech stack, commands, architecture, conventions, key
        files — and produces a clean, well-formatted Markdown file you can drop into your project root
        immediately. It takes about five minutes and the payoff in AI suggestion quality is immediate.
      </p>

      <h2>CLAUDE.md Files for Sub-Directories</h2>
      <p>
        Claude Code also reads <code>CLAUDE.md</code> files in subdirectories when working within those
        directories. This means a monorepo can have a root-level <code>CLAUDE.md</code> covering shared
        conventions and separate <code>CLAUDE.md</code> files in each app directory covering
        app-specific details. The root-level context is always included; the subdirectory context is
        added when Claude is working in that part of the tree.
      </p>

      <h2>Summary</h2>
      <p>
        A <code>CLAUDE.md</code> file is the single most impactful thing you can add to a codebase if
        you use Claude Code regularly. Five minutes of documentation writing eliminates dozens of
        corrections per session. Include your tech stack, dev commands, architecture overview, code
        conventions, and pointers to critical files. Leave out secrets, obvious facts, and outdated
        information. Keep it current and treat it as first-class documentation — because for AI-assisted
        development, it effectively is.
      </p>
    </div>
  );
}
