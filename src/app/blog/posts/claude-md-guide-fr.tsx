import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Chaque base de code a un contexte qui ne vit que dans la tête des ingénieurs qui y travaillent.
        La raison pour laquelle les migrations s'exécutent dans un ordre spécifique. La convention pour
        nommer les tables de base de données. Le fichier qu'il ne faut jamais toucher sans d'abord lancer
        la suite de tests complète. Quand vous intégrez un assistant de codage IA dans cette base de code
        sans lui fournir ce contexte, vous obtenez des suggestions génériques qui ratent vos conventions,
        cassent vos schémas et nécessitent des corrections constantes.
      </p>
      <ToolCTA slug="claude-md-generator" variant="inline" />
      <p>
        Un fichier <code>CLAUDE.md</code> résout ce problème. Vous pouvez utiliser le{" "}
        <a href="/tools/claude-md-generator">Générateur CLAUDE.md BrowseryTools</a> — gratuit, sans
        inscription, tout reste dans votre navigateur — pour construire un fichier de contexte bien
        structuré pour votre projet en quelques minutes.
      </p>

      <h2>Qu'est-ce que CLAUDE.md ?</h2>
      <p>
        <code>CLAUDE.md</code> est un fichier Markdown simple placé à la racine de votre projet que
        Claude Code lit automatiquement au début de chaque session. Ce n'est pas un fichier de
        configuration au sens technique — pas de syntaxe spéciale, pas de schéma à valider. C'est de la
        documentation rédigée pour un lecteur IA plutôt qu'humain, répondant aux questions qu'un nouvel
        ingénieur qualifié poserait lors de son premier jour.
      </p>
      <p>
        Quand Claude Code démarre dans le répertoire de votre projet, il lit <code>CLAUDE.md</code> et
        utilise le contenu comme contexte permanent tout au long de la session. Chaque suggestion, chaque
        génération de code, chaque réponse à une question est informée par ce qui se trouve dans ce
        fichier. L'effet est immédiat et significatif : une IA qui connaît votre stack, vos conventions
        de nommage et votre architecture donne fondamentalement de meilleures suggestions qu'une IA qui
        fait des suppositions.
      </p>

      <h2>Que faut-il inclure</h2>

      <h3>Stack technologique et environnement</h3>
      <p>
        Commencez par les fondamentaux. Quel langage, framework et runtime ce projet utilise-t-il ? Quel
        gestionnaire de paquets ? Quelle version de Node, Python ou Go ? Quelle base de données ?
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

      <h3>Architecture du projet</h3>
      <p>
        Décrivez la structure de haut niveau — comment la base de code est organisée et pourquoi. S'il
        y a plusieurs applications dans un monorepo, nommez-les. S'il y a une séparation significative
        entre le frontend et le backend, expliquez-la.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Architecture
Monorepo Turborepo avec trois packages :
- apps/web — Application Next.js côté client
- apps/dashboard — Panneau d'administration interne (même stack)
- packages/db — Schéma Drizzle partagé et outillage de migration

Tous les accès à la base de données passent par packages/db. Ne jamais importer
supabase-js directement dans le code des applications — utiliser le client typé
exporté depuis packages/db.`}
      </pre>

      <h3>Commandes de développement</h3>
      <p>
        C'est l'une des sections à plus haute valeur ajoutée. Listez les commandes exactes pour lancer
        le projet, exécuter les tests, compiler, linter et déployer. Claude utilisera celles-ci plutôt
        que de supposer des commandes courantes qui pourraient ne pas s'appliquer à votre configuration.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Commands
- \`pnpm dev\` — Démarrer toutes les applications en mode développement
- \`pnpm test\` — Lancer les tests unitaires Vitest
- \`pnpm test:e2e\` — Lancer les tests end-to-end Playwright (nécessite un serveur de dev en cours d'exécution)
- \`pnpm lint\` — Vérifications ESLint + Biome
- \`pnpm db:migrate\` — Appliquer les migrations Drizzle en attente
- \`pnpm db:generate\` — Générer une nouvelle migration depuis les changements de schéma
- \`pnpm build\` — Build de production (lance la vérification de types en premier)`}
      </pre>

      <h3>Conventions de code</h3>
      <p>
        Listez les conventions qui diffèrent des défauts du langage ou que les nouveaux ingénieurs ont
        systématiquement du mal à respecter. Des choses comme les schémas de nommage, l'organisation des
        fichiers, la gestion des erreurs et l'ordre des imports.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Conventions
- Noms de fichiers : kebab-case pour tous les fichiers (user-profile.tsx, pas UserProfile.tsx)
- Exports de composants : exports nommés uniquement, pas d'exports par défaut dans les composants
- Tables de base de données : snake_case (user_profiles, pas userProfiles)
- Gestion des erreurs : toujours utiliser le type Result de packages/utils, jamais throw
- Routes API : style REST, versionnées à /api/v1/
- Variables d'environnement : doivent être déclarées dans /apps/web/env.ts avant utilisation`}
      </pre>

      <h3>Fichiers et répertoires clés</h3>
      <p>
        Signalez les fichiers particulièrement importants, non évidents ou dangereux à modifier sans
        comprendre leur rôle.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Key Files
- packages/db/schema.ts — Source de vérité unique pour toutes les tables DB. Toute modification
  nécessite une migration (pnpm db:generate).
- apps/web/middleware.ts — Gère le routage d'auth et la détection de locale. À toucher avec
  précaution — les bugs ici affectent chaque chargement de page.
- apps/web/app/api/webhooks/ — Gestionnaires de webhooks Stripe et Supabase. Doit être
  testé avec de vrais payloads de webhooks, pas avec des mocks.`}
      </pre>

      <h2>Ce qu'il NE faut PAS inclure</h2>
      <ul>
        <li><strong>Secrets et identifiants</strong> — Ne jamais mettre de clés API, mots de passe de base de données ou tokens dans <code>CLAUDE.md</code>. Le fichier est commité dans le contrôle de version et est lisible par quiconque ayant accès au dépôt. Utilisez des variables d'environnement et un gestionnaire de secrets.</li>
        <li><strong>Informations déjà évidentes</strong> — Vous n'avez pas besoin de dire à Claude que les fichiers TypeScript se terminent par <code>.ts</code> ou que les composants React retournent du JSX. Concentrez-vous sur les éléments spécifiques à votre projet et qui ne seraient pas évidents à partir de la structure de fichiers seule.</li>
        <li><strong>Instructions obsolètes</strong> — Un <code>CLAUDE.md</code> qui dit « nous utilisons Redux » alors que vous avez migré vers Zustand il y a six mois est pire que pas de fichier du tout. Traitez-le comme toute autre documentation : mettez-le à jour quand la base de code change.</li>
        <li><strong>Discussions internes ou justifications</strong> — Les longues explications de pourquoi vous avez pris une décision architecturale sont mieux dans un ADR (Architecture Decision Record) séparé. Gardez <code>CLAUDE.md</code> comme une référence rapide, pas un document historique.</li>
      </ul>

      <h2>Un exemple complet de CLAUDE.md</h2>
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

      <h2>Comment le Générateur CLAUDE.md aide</h2>
      <p>
        Rédiger un <code>CLAUDE.md</code> depuis zéro signifie penser à couvrir chaque section importante
        et à les remplir de façon cohérente. Le{" "}
        <a href="/tools/claude-md-generator">Générateur CLAUDE.md BrowseryTools</a> fournit un formulaire
        structuré qui vous guide à travers chaque section — stack technologique, commandes, architecture,
        conventions, fichiers clés — et produit un fichier Markdown propre et bien formaté que vous pouvez
        déposer immédiatement à la racine de votre projet. Cela prend environ cinq minutes et le gain en
        qualité des suggestions IA est immédiat.
      </p>

      <h2>Fichiers CLAUDE.md pour les sous-répertoires</h2>
      <p>
        Claude Code lit aussi les fichiers <code>CLAUDE.md</code> dans les sous-répertoires quand il
        travaille dans ces répertoires. Cela signifie qu'un monorepo peut avoir un{" "}
        <code>CLAUDE.md</code> au niveau racine couvrant les conventions partagées et des fichiers{" "}
        <code>CLAUDE.md</code> séparés dans chaque répertoire d'application couvrant les détails
        spécifiques à l'application. Le contexte au niveau racine est toujours inclus ; le contexte du
        sous-répertoire est ajouté quand Claude travaille dans cette partie de l'arbre.
      </p>

      <h2>Résumé</h2>
      <p>
        Un fichier <code>CLAUDE.md</code> est la chose la plus impactante que vous puissiez ajouter à
        une base de code si vous utilisez Claude Code régulièrement. Cinq minutes de rédaction de
        documentation éliminent des dizaines de corrections par session. Incluez votre stack technologique,
        les commandes de développement, un aperçu de l'architecture, les conventions de code et des
        pointeurs vers les fichiers critiques. Omettez les secrets, les faits évidents et les informations
        obsolètes. Gardez-le à jour et traitez-le comme une documentation de premier ordre — car pour le
        développement assisté par IA, c'est effectivement ce qu'il est.
      </p>
      <ToolCTA slug="claude-md-generator" variant="card" />
    </div>
  );
}
