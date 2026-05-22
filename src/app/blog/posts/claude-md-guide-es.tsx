export default function Content() {
  return (
    <div>
      <p>
        Cada base de código tiene contexto que solo vive en la cabeza de los ingenieros que trabajan
        en ella. La razón por la que las migraciones se ejecutan en un orden específico. La convención
        para nombrar las tablas de la base de datos. El único archivo que nunca debe tocarse sin
        ejecutar primero la suite de pruebas completa. Cuando incorporas un asistente de código de IA
        a esa base de código sin darle este contexto, obtienes sugerencias genéricas que no respetan
        tus convenciones, rompen tus patrones y requieren corrección constante.
      </p>
      <p>
        Un archivo <code>CLAUDE.md</code> resuelve esto. Puedes usar el{" "}
        <a href="/tools/claude-md-generator">Generador de CLAUDE.md de BrowseryTools</a> —gratis, sin
        registro, todo se queda en tu navegador— para construir un archivo de contexto bien estructurado
        para tu proyecto en minutos.
      </p>

      <h2>¿Qué Es CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> es un archivo Markdown plano colocado en la raíz de tu proyecto que
        Claude Code lee automáticamente al inicio de cada sesión. No es un archivo de configuración
        en el sentido técnico —sin sintaxis especial, sin esquema que validar. Es documentación escrita
        para un lector de IA en lugar de uno humano, respondiendo las preguntas que un nuevo ingeniero
        hábil haría en su primer día.
      </p>
      <p>
        Cuando Claude Code se inicia en el directorio de tu proyecto, lee <code>CLAUDE.md</code> y usa
        el contenido como contexto permanente durante toda la sesión. Cada sugerencia, cada generación
        de código, cada respuesta a una pregunta está informada por lo que hay en ese archivo. El efecto
        es inmediato y significativo: una IA que conoce tu stack, tus convenciones de nomenclatura y tu
        arquitectura da sugerencias fundamentalmente mejores que una que adivina.
      </p>

      <h2>Qué Incluir</h2>

      <h3>Stack Tecnológico y Entorno</h3>
      <p>
        Empieza con los fundamentos. ¿Qué lenguaje, framework y runtime usa este proyecto? ¿Qué gestor
        de paquetes? ¿Qué versión de Node, Python o Go? ¿Qué base de datos?
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

      <h3>Arquitectura del Proyecto</h3>
      <p>
        Describe la estructura de alto nivel —cómo está organizada la base de código y por qué. Si hay
        múltiples aplicaciones en un monorepo, nómbralas. Si hay una separación significativa entre
        frontend y backend, explícala.
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

      <h3>Comandos de Desarrollo</h3>
      <p>
        Esta es una de las secciones de mayor valor. Lista los comandos exactos para ejecutar el
        proyecto, ejecutar pruebas, construir, hacer lint y desplegar. Claude los usará en lugar de
        adivinar comandos comunes que podrían no aplicarse a tu configuración.
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

      <h3>Convenciones de Código</h3>
      <p>
        Lista las convenciones que difieren de los valores predeterminados del lenguaje o que los nuevos
        ingenieros sistemáticamente se equivocan. Cosas como patrones de nomenclatura, organización de
        archivos, cómo manejar errores y ordenación de imports.
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

      <h3>Archivos y Directorios Clave</h3>
      <p>
        Señala los archivos que son especialmente importantes, no obvios o peligrosos de modificar sin
        entender su papel.
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

      <h2>Qué NO Incluir</h2>
      <ul>
        <li><strong>Secretos y credenciales</strong> — Nunca pongas claves de API, contraseñas de base de datos
        o tokens en <code>CLAUDE.md</code>. El archivo se confirma en el control de versiones y es legible
        por cualquiera con acceso al repositorio. Usa variables de entorno y un gestor de secretos.</li>
        <li><strong>Información que ya es obvia</strong> — No necesitas decirle a Claude que los archivos
        TypeScript terminan en <code>.ts</code> o que los componentes React devuelven JSX. Enfócate en cosas
        específicas de tu proyecto que no serían obvias solo por la estructura de archivos.</li>
        <li><strong>Instrucciones desactualizadas</strong> — Un <code>CLAUDE.md</code> que dice «usamos Redux»
        cuando migraste a Zustand hace seis meses es peor que no tener ningún archivo. Trátalo como cualquier
        otra documentación: actualízalo cuando cambie la base de código.</li>
        <li><strong>Debates internos o justificaciones</strong> — Las largas explicaciones de por qué tomaste
        una decisión arquitectónica son mejor para un ADR (Architecture Decision Record) separado. Mantén
        <code>CLAUDE.md</code> como referencia rápida, no como documento histórico.</li>
      </ul>

      <h2>Un Ejemplo Completo de CLAUDE.md</h2>
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

      <h2>Cómo Ayuda el Generador de CLAUDE.md</h2>
      <p>
        Escribir un <code>CLAUDE.md</code> desde cero significa recordar cubrir cada sección importante
        y rellenarlas de forma consistente. El{" "}
        <a href="/tools/claude-md-generator">Generador de CLAUDE.md de BrowseryTools</a> proporciona
        un formulario estructurado que te guía por cada sección —stack tecnológico, comandos,
        arquitectura, convenciones, archivos clave— y produce un archivo Markdown limpio y bien
        formateado que puedes colocar directamente en la raíz de tu proyecto. Tarda unos cinco minutos
        y la mejora en la calidad de las sugerencias de IA es inmediata.
      </p>

      <h2>Archivos CLAUDE.md para Subdirectorios</h2>
      <p>
        Claude Code también lee los archivos <code>CLAUDE.md</code> en los subdirectorios cuando
        trabaja dentro de esos directorios. Esto significa que un monorepo puede tener un{" "}
        <code>CLAUDE.md</code> a nivel raíz que cubra las convenciones compartidas y archivos{" "}
        <code>CLAUDE.md</code> separados en cada directorio de aplicación que cubran los detalles
        específicos de la aplicación. El contexto a nivel raíz siempre se incluye; el contexto del
        subdirectorio se añade cuando Claude está trabajando en esa parte del árbol.
      </p>

      <h2>Resumen</h2>
      <p>
        Un archivo <code>CLAUDE.md</code> es lo más impactante que puedes añadir a una base de código
        si usas Claude Code con regularidad. Cinco minutos de escritura de documentación eliminan
        docenas de correcciones por sesión. Incluye tu stack tecnológico, los comandos de desarrollo,
        la descripción general de la arquitectura, las convenciones de código y los punteros a los
        archivos críticos. Deja fuera los secretos, los hechos obvios y la información desactualizada.
        Mantenlo actualizado y trátalo como documentación de primera clase —porque para el desarrollo
        asistido por IA, efectivamente lo es.
      </p>
    </div>
  );
}
