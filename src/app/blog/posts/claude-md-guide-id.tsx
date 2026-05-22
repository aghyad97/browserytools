export default function Content() {
  return (
    <div>
      <p>
        Setiap codebase memiliki konteks yang hanya ada dalam kepala engineer yang bekerja dengannya.
        Alasan migrasi dijalankan dalam urutan tertentu. Konvensi penamaan tabel database. Satu file
        yang tidak boleh disentuh tanpa menjalankan seluruh test suite terlebih dahulu. Ketika Anda
        membawa asisten coding AI ke codebase tanpa memberikan konteks ini, Anda mendapatkan saran
        generik yang melewatkan konvensi Anda, melanggar pola Anda, dan memerlukan koreksi konstan.
      </p>
      <p>
        File <code>CLAUDE.md</code> mengatasi ini. Anda dapat menggunakan{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md Generator</a> — gratis, tanpa
        pendaftaran, semuanya tetap di browser Anda — untuk membangun file konteks yang terstruktur
        dengan baik untuk proyek Anda dalam hitungan menit.
      </p>

      <h2>Apa Itu CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> adalah file Markdown biasa yang ditempatkan di root proyek Anda yang
        dibaca Claude Code secara otomatis di awal setiap sesi. Ini bukan file konfigurasi dalam arti
        teknis — tidak ada sintaks khusus, tidak ada skema yang perlu divalidasi. Ini adalah dokumentasi
        yang ditulis untuk pembaca AI daripada pembaca manusia, menjawab pertanyaan yang akan diajukan
        engineer baru yang terampil pada hari pertama mereka.
      </p>
      <p>
        Ketika Claude Code dimulai di direktori proyek Anda, ia membaca <code>CLAUDE.md</code> dan
        menggunakan kontennya sebagai konteks tetap sepanjang sesi. Setiap saran, setiap pembuatan
        kode, setiap jawaban atas pertanyaan diinformasikan oleh apa yang ada dalam file tersebut.
        Efeknya langsung dan signifikan: AI yang mengetahui stack, konvensi penamaan, dan arsitektur
        Anda memberikan saran yang fundamentally lebih baik daripada yang menebak.
      </p>

      <h2>Apa yang Disertakan</h2>

      <h3>Tech Stack dan Lingkungan</h3>
      <p>
        Mulai dengan hal-hal fundamental. Bahasa, framework, dan runtime apa yang digunakan proyek
        ini? Manajer paket apa? Versi Node, Python, atau Go berapa? Database apa?
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

      <h3>Arsitektur Proyek</h3>
      <p>
        Jelaskan struktur tingkat tinggi — bagaimana codebase diorganisasikan dan mengapa. Jika ada
        beberapa app dalam monorepo, sebutkan namanya. Jika ada pemisahan bermakna antara frontend dan
        backend, jelaskan.
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

      <h3>Perintah Development</h3>
      <p>
        Ini adalah salah satu bagian yang paling bernilai tinggi. Daftarkan perintah tepat untuk
        menjalankan proyek, menjalankan test, membangun, lint, dan deploy. Claude akan menggunakan
        ini daripada menebak perintah umum yang mungkin tidak berlaku untuk setup Anda.
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

      <h3>Konvensi Kode</h3>
      <p>
        Daftarkan konvensi yang berbeda dari default bahasa atau yang secara konsisten salah dipahami
        oleh engineer baru. Hal-hal seperti pola penamaan, organisasi file, cara menangani error, dan
        pengurutan import.
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

      <h3>File dan Direktori Utama</h3>
      <p>
        Tunjukkan file yang sangat penting, tidak jelas, atau berbahaya untuk dimodifikasi tanpa
        memahami perannya.
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

      <h2>Apa yang TIDAK Disertakan</h2>
      <ul>
        <li><strong>Rahasia dan kredensial</strong> — Jangan pernah memasukkan API key, password
        database, atau token dalam <code>CLAUDE.md</code>. File ini di-commit ke version control dan
        dapat dibaca oleh siapa saja yang memiliki akses repositori. Gunakan variabel lingkungan dan
        manajer rahasia.</li>
        <li><strong>Informasi yang sudah jelas</strong> — Anda tidak perlu memberi tahu Claude bahwa
        file TypeScript berakhiran <code>.ts</code> atau bahwa komponen React mengembalikan JSX.
        Fokus pada hal-hal yang spesifik untuk proyek Anda dan tidak akan jelas hanya dari struktur
        file.</li>
        <li><strong>Instruksi yang sudah usang</strong> — <code>CLAUDE.md</code> yang mengatakan
        "kami menggunakan Redux" ketika Anda sudah bermigrasi ke Zustand enam bulan lalu lebih buruk
        dari tidak ada file sama sekali. Perlakukan seperti dokumentasi lainnya: perbarui ketika
        codebase berubah.</li>
        <li><strong>Diskusi internal atau alasan</strong> — Penjelasan panjang tentang mengapa Anda
        membuat keputusan arsitektur lebih baik ada dalam ADR (Architecture Decision Record) terpisah.
        Pertahankan <code>CLAUDE.md</code> sebagai referensi cepat, bukan dokumen sejarah.</li>
      </ul>

      <h2>Contoh CLAUDE.md yang Lengkap</h2>
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

      <h2>Cara CLAUDE.md Generator Membantu</h2>
      <p>
        Menulis <code>CLAUDE.md</code> dari awal berarti mengingat untuk mencakup setiap bagian penting
        dan mengisinya secara konsisten.{" "}
        <a href="/tools/claude-md-generator">BrowseryTools CLAUDE.md Generator</a> menyediakan formulir
        terstruktur yang memandu Anda melalui setiap bagian — tech stack, perintah, arsitektur, konvensi,
        file utama — dan menghasilkan file Markdown yang bersih dan terformat yang langsung bisa Anda
        drop ke root proyek. Membutuhkan sekitar lima menit dan manfaatnya dalam kualitas saran AI
        langsung terasa.
      </p>

      <h2>File CLAUDE.md untuk Sub-Direktori</h2>
      <p>
        Claude Code juga membaca file <code>CLAUDE.md</code> di subdirektori saat bekerja dalam
        direktori tersebut. Ini berarti monorepo dapat memiliki <code>CLAUDE.md</code> tingkat root
        yang mencakup konvensi bersama dan file <code>CLAUDE.md</code> terpisah di setiap direktori
        app yang mencakup detail spesifik app. Konteks tingkat root selalu disertakan; konteks
        subdirektori ditambahkan ketika Claude bekerja di bagian pohon tersebut.
      </p>

      <h2>Ringkasan</h2>
      <p>
        File <code>CLAUDE.md</code> adalah satu hal yang paling berdampak yang dapat Anda tambahkan
        ke codebase jika Anda menggunakan Claude Code secara rutin. Lima menit penulisan dokumentasi
        menghilangkan puluhan koreksi per sesi. Sertakan tech stack, perintah dev, gambaran arsitektur,
        konvensi kode, dan petunjuk ke file kritis. Hilangkan rahasia, fakta yang jelas, dan informasi
        yang sudah usang. Pertahankan kekiniannya dan perlakukan sebagai dokumentasi kelas satu —
        karena untuk pengembangan berbantuan AI, itu memang begitu adanya.
      </p>
    </div>
  );
}
