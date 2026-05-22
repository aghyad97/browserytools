export default function Content() {
  return (
    <div>
      <p>
        Toda base de código tem contexto que vive apenas nas cabeças dos engenheiros que trabalham
        nela. A razão pela qual as migrações rodam em uma ordem específica. A convenção para nomear
        tabelas de banco de dados. O único arquivo que nunca deve ser tocado sem executar o conjunto
        completo de testes primeiro. Quando você traz um assistente de codificação de IA para essa
        base de código sem dar-lhe esse contexto, você obtém sugestões genéricas que ignoram suas
        convenções, quebram seus padrões e exigem correções constantes.
      </p>
      <p>
        Um arquivo <code>CLAUDE.md</code> resolve isso. Você pode usar o{" "}
        <a href="/tools/claude-md-generator">Gerador de CLAUDE.md do BrowseryTools</a> — gratuito,
        sem cadastro, tudo fica no seu navegador — para construir um arquivo de contexto bem
        estruturado para o seu projeto em minutos.
      </p>

      <h2>O que É o CLAUDE.md?</h2>
      <p>
        <code>CLAUDE.md</code> é um arquivo Markdown simples colocado na raiz do seu projeto que
        o Claude Code lê automaticamente no início de cada sessão. Não é um arquivo de configuração
        no sentido técnico — sem sintaxe especial, sem esquema para validar. É documentação escrita
        para um leitor de IA em vez de um humano, respondendo às perguntas que um novo engenheiro
        habilidoso faria no seu primeiro dia.
      </p>
      <p>
        Quando o Claude Code inicia no diretório do seu projeto, ele lê o <code>CLAUDE.md</code>{" "}
        e usa o conteúdo como contexto permanente ao longo da sessão. Cada sugestão, cada geração
        de código, cada resposta a uma pergunta é informada pelo que está nesse arquivo. O efeito
        é imediato e significativo: uma IA que conhece sua stack, suas convenções de nomenclatura
        e sua arquitetura dá sugestões fundamentalmente melhores do que uma que está adivinhando.
      </p>

      <h2>O que Incluir</h2>

      <h3>Stack Tecnológica e Ambiente</h3>
      <p>
        Comece com os fundamentos. Que linguagem, framework e runtime este projeto usa? Que
        gerenciador de pacotes? Que versão de Node, Python ou Go? Que banco de dados?
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

      <h3>Arquitetura do Projeto</h3>
      <p>
        Descreva a estrutura de alto nível — como a base de código está organizada e por quê.
        Se há vários aplicativos em um monorepo, nomeie-os. Se há uma separação significativa
        entre frontend e backend, explique-a.
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

      <h3>Comandos de Desenvolvimento</h3>
      <p>
        Esta é uma das seções de maior valor. Liste os comandos exatos para rodar o projeto,
        executar testes, fazer build, lint e deploy. O Claude usará estes em vez de adivinhar
        comandos comuns que podem não se aplicar à sua configuração.
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

      <h3>Convenções de Código</h3>
      <p>
        Liste as convenções que diferem dos padrões de linguagem ou que novos engenheiros
        consistentemente erram. Coisas como padrões de nomenclatura, organização de arquivos, como
        tratar erros e ordenação de importações.
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

      <h3>Arquivos e Diretórios Principais</h3>
      <p>
        Aponte arquivos que são particularmente importantes, não óbvios ou perigosos de modificar
        sem entender seu papel.
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

      <h2>O que NÃO Incluir</h2>
      <ul>
        <li><strong>Segredos e credenciais</strong> — Nunca coloque chaves de API, senhas de banco
        de dados ou tokens no <code>CLAUDE.md</code>. O arquivo é submetido ao controle de versão
        e pode ser lido por qualquer pessoa com acesso ao repositório. Use variáveis de ambiente
        e um gerenciador de segredos.</li>
        <li><strong>Informações que já são óbvias</strong> — Você não precisa dizer ao Claude que
        arquivos TypeScript terminam em <code>.ts</code> ou que componentes React retornam JSX.
        Concentre-se em coisas específicas do seu projeto que não seriam óbvias apenas a partir
        da estrutura de arquivos.</li>
        <li><strong>Instruções desatualizadas</strong> — Um <code>CLAUDE.md</code> que diz "usamos
        Redux" quando você migrou para Zustand seis meses atrás é pior do que nenhum arquivo.
        Trate-o como qualquer outra documentação: atualize-o quando a base de código mudar.</li>
        <li><strong>Discussões internas ou justificativas</strong> — Longas explicações sobre por
        que você tomou uma decisão arquitetural são melhores em um ADR separado (Registro de
        Decisão de Arquitetura). Mantenha o <code>CLAUDE.md</code> como uma referência rápida,
        não um documento histórico.</li>
      </ul>

      <h2>Um Exemplo Completo de CLAUDE.md</h2>
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

      <h2>Como o Gerador de CLAUDE.md Ajuda</h2>
      <p>
        Escrever um <code>CLAUDE.md</code> do zero significa lembrar de cobrir cada seção
        importante e preenchê-las de forma consistente. O{" "}
        <a href="/tools/claude-md-generator">Gerador de CLAUDE.md do BrowseryTools</a> fornece
        um formulário estruturado que guia você por cada seção — stack tecnológica, comandos,
        arquitetura, convenções, arquivos principais — e produz um arquivo Markdown limpo e bem
        formatado que você pode colocar na raiz do seu projeto imediatamente. Leva cerca de cinco
        minutos e o retorno na qualidade das sugestões de IA é imediato.
      </p>

      <h2>Arquivos CLAUDE.md para Subdiretórios</h2>
      <p>
        O Claude Code também lê arquivos <code>CLAUDE.md</code> em subdiretórios quando trabalha
        dentro desses diretórios. Isso significa que um monorepo pode ter um <code>CLAUDE.md</code>{" "}
        no nível raiz cobrindo convenções compartilhadas e arquivos <code>CLAUDE.md</code>{" "}
        separados em cada diretório de aplicativo cobrindo detalhes específicos do app. O contexto
        do nível raiz é sempre incluído; o contexto do subdiretório é adicionado quando o Claude
        está trabalhando naquela parte da árvore.
      </p>

      <h2>Resumo</h2>
      <p>
        Um arquivo <code>CLAUDE.md</code> é a coisa mais impactante que você pode adicionar a uma
        base de código se você usa o Claude Code regularmente. Cinco minutos de escrita de
        documentação eliminam dezenas de correções por sessão. Inclua sua stack tecnológica,
        comandos de desenvolvimento, visão geral da arquitetura, convenções de código e ponteiros
        para arquivos críticos. Deixe de fora segredos, fatos óbvios e informações desatualizadas.
        Mantenha-o atualizado e trate-o como documentação de primeira classe — porque para o
        desenvolvimento assistido por IA, efetivamente é.
      </p>
    </div>
  );
}
