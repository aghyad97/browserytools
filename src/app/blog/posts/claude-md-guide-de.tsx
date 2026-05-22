export default function Content() {
  return (
    <div>
      <p>
        Jede Codebasis hat Kontext, der nur in den Köpfen der Entwickler lebt, die daran arbeiten.
        Der Grund, warum Migrationen in einer bestimmten Reihenfolge ausgeführt werden. Die Konvention
        für die Benennung von Datenbanktabellen. Die eine Datei, die niemals angefasst werden darf,
        ohne zuerst die gesamte Test-Suite auszuführen. Wenn man einen KI-Coding-Assistenten in diese
        Codebasis einführt, ohne ihm diesen Kontext zu geben, erhält man generische Vorschläge, die
        Konventionen verfehlen, Muster brechen und ständige Korrekturen erfordern.
      </p>
      <p>
        Eine <code>CLAUDE.md</code>-Datei löst dieses Problem. Mit dem{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md-Generator</a> – kostenlos,
        keine Anmeldung, alles bleibt im Browser – kann in Minuten eine gut strukturierte
        Kontextdatei für das eigene Projekt erstellt werden.
      </p>

      <h2>Was ist CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> ist eine einfache Markdown-Datei, die im Stammverzeichnis des Projekts
        abgelegt wird und die Claude Code automatisch zu Beginn jeder Sitzung liest. Es ist keine
        Konfigurationsdatei im technischen Sinne – keine spezielle Syntax, kein Schema zum
        Validieren. Es ist Dokumentation, die für einen KI-Leser statt für einen menschlichen
        verfasst wurde, und beantwortet die Fragen, die ein kompetenter neuer Entwickler am ersten
        Tag stellen würde.
      </p>
      <p>
        Wenn Claude Code im Projektverzeichnis startet, liest es <code>CLAUDE.md</code> und verwendet
        den Inhalt als dauerhaften Kontext während der gesamten Sitzung. Jeder Vorschlag, jede
        Code-Generierung, jede Antwort auf eine Frage wird durch den Inhalt dieser Datei informiert.
        Der Effekt ist sofort und erheblich: Ein KI-Assistent, der den eigenen Stack, die Namenskonventionen
        und die Architektur kennt, gibt grundlegend bessere Vorschläge als einer, der rät.
      </p>

      <h2>Was einzuschließen ist</h2>

      <h3>Tech Stack und Umgebung</h3>
      <p>
        Mit den Grundlagen anfangen. Welche Sprache, welches Framework und welche Laufzeit verwendet
        das Projekt? Welcher Paketmanager? Welche Version von Node, Python oder Go? Welche Datenbank?
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

      <h3>Projektarchitektur</h3>
      <p>
        Die übergeordnete Struktur beschreiben – wie die Codebasis organisiert ist und warum. Wenn
        es mehrere Apps in einem Monorepo gibt, diese nennen. Wenn es eine bedeutende Trennung
        zwischen Frontend und Backend gibt, diese erklären.
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

      <h3>Entwicklungsbefehle</h3>
      <p>
        Dies ist einer der wertvollsten Abschnitte. Die genauen Befehle zum Starten des Projekts,
        zum Ausführen von Tests, zum Bauen, Linting und Deployen auflisten. Claude wird diese
        verwenden, anstatt gebräuchliche Befehle zu raten, die möglicherweise nicht zutreffen.
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

      <h3>Code-Konventionen</h3>
      <p>
        Die Konventionen auflisten, die von Sprachstandards abweichen oder bei denen neue Entwickler
        konsistent Fehler machen. Dinge wie Benennungsmuster, Dateiorganisation, Fehlerbehandlung
        und Import-Reihenfolge.
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

      <h3>Wichtige Dateien und Verzeichnisse</h3>
      <p>
        Auf Dateien hinweisen, die besonders wichtig, nicht offensichtlich oder gefährlich zu
        ändern sind, ohne ihre Rolle zu verstehen.
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

      <h2>Was NICHT einzuschließen ist</h2>
      <ul>
        <li><strong>Geheimnisse und Zugangsdaten</strong> – Niemals API-Schlüssel, Datenbankpasswörter
        oder Tokens in <code>CLAUDE.md</code> aufnehmen. Die Datei wird in die Versionskontrolle
        committet und ist für jeden mit Repository-Zugang lesbar. Umgebungsvariablen und einen
        Secrets-Manager verwenden.</li>
        <li><strong>Offensichtliche Informationen</strong> – Claude muss nicht mitgeteilt werden, dass
        TypeScript-Dateien auf <code>.ts</code> enden oder dass React-Komponenten JSX zurückgeben.
        Auf Dinge fokussieren, die spezifisch für das Projekt sind und nicht aus der Dateistruktur
        allein offensichtlich wären.</li>
        <li><strong>Veraltete Anweisungen</strong> – Eine <code>CLAUDE.md</code>, die „wir verwenden
        Redux" sagt, obwohl man vor sechs Monaten zu Zustand migriert ist, ist schlimmer als gar
        keine Datei. Wie jede andere Dokumentation behandeln: aktualisieren, wenn sich die
        Codebasis ändert.</li>
        <li><strong>Interne Diskussionen oder Begründungen</strong> – Lange Erklärungen, warum eine
        Architekturentscheidung getroffen wurde, passen besser in ein separates ADR
        (Architecture Decision Record). <code>CLAUDE.md</code> als schnelle Referenz halten,
        nicht als Verlaufsdokument.</li>
      </ul>

      <h2>Ein vollständiges CLAUDE.md-Beispiel</h2>
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

      <h2>Wie der CLAUDE.md-Generator hilft</h2>
      <p>
        Eine <code>CLAUDE.md</code> von Grund auf zu schreiben bedeutet, sich daran zu erinnern,
        jeden wichtigen Abschnitt abzudecken und sie konsistent auszufüllen. Der{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md-Generator</a> bietet ein
        strukturiertes Formular, das durch jeden Abschnitt führt – Tech Stack, Befehle, Architektur,
        Konventionen, wichtige Dateien – und produziert eine saubere, gut formatierte Markdown-Datei,
        die sofort in das Projektstammverzeichnis abgelegt werden kann. Das dauert etwa fünf Minuten
        und der Gewinn an KI-Vorschlagsqualität ist sofort spürbar.
      </p>

      <h2>CLAUDE.md-Dateien für Unterverzeichnisse</h2>
      <p>
        Claude Code liest auch <code>CLAUDE.md</code>-Dateien in Unterverzeichnissen, wenn es in
        diesen Verzeichnissen arbeitet. Das bedeutet, ein Monorepo kann eine Root-Level-{" "}
        <code>CLAUDE.md</code> mit gemeinsamen Konventionen und separate <code>CLAUDE.md</code>-Dateien
        in jedem App-Verzeichnis mit appspezifischen Details haben. Der Root-Level-Kontext ist
        immer eingeschlossen; der Unterverzeichnis-Kontext wird hinzugefügt, wenn Claude in
        diesem Teil des Verzeichnisbaums arbeitet.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        Eine <code>CLAUDE.md</code>-Datei ist das Wirkungsvollste, was man zu einer Codebasis
        hinzufügen kann, wenn man Claude Code regelmäßig nutzt. Fünf Minuten Dokumentationsarbeit
        eliminieren Dutzende von Korrekturen pro Sitzung. Tech Stack, Entwicklungsbefehle,
        Architekturübersicht, Code-Konventionen und Hinweise auf kritische Dateien aufnehmen.
        Geheimnisse, offensichtliche Fakten und veraltete Informationen weglassen. Aktuell halten
        und als erstklassige Dokumentation behandeln – denn für KI-gestützte Entwicklung ist sie
        es effektiv.
      </p>
    </div>
  );
}
