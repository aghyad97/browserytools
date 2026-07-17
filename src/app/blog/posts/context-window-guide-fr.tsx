import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        L'une des sources de frustration les plus courantes pour les développeurs qui travaillent avec des
        LLM est de heurter un mur invisible — une requête qui échoue sans explication, une conversation
        qui perd soudainement son contexte, ou un document traité de façon incomplète. Dans presque tous
        les cas, le coupable est la fenêtre de contexte. Comprendre ce qu'est une fenêtre de contexte, ce
        que ses limites signifient en pratique et comment travailler habilement dans ces limites est la
        base pour construire des applications alimentées par l'IA fiables.
      </p>
      <ToolCTA slug="context-window" variant="inline" />
      <p>
        Vous pouvez utiliser l'{" "}
        <a href="/tools/context-window">outil Fenêtre de contexte BrowseryTools</a> — gratuit, sans
        inscription, tout reste dans votre navigateur — pour visualiser quelle part de la fenêtre de
        contexte d'un modèle votre contenu occupe avant de l'envoyer à une API.
      </p>

      <h2>Qu'est-ce qu'une fenêtre de contexte ?</h2>
      <p>
        Une fenêtre de contexte est la quantité maximale de texte — mesurée en tokens — qu'un modèle de
        langage peut « voir » et sur laquelle il peut raisonner dans une seule requête. C'est la mémoire
        de travail du modèle. Tout ce qui est pertinent pour générer le prochain token doit tenir dans
        cette fenêtre : votre prompt système, l'intégralité de l'historique de conversation, tout document
        inclus, et les tokens que le modèle génère en ce moment.
      </p>
      <p>
        Contrairement à la mémoire de travail humaine, qui se dégrade progressivement quand elle est
        surchargée, les fenêtres de contexte ont une limite stricte. Quand vous la dépassez, l'API retourne
        une erreur. Il n'y a pas de succès partiel — la requête échoue purement et simplement, et votre
        application doit gérer cela correctement.
      </p>
      <p>
        La fenêtre de contexte est un pool unique partagé entre entrée et sortie. Si un modèle a une
        fenêtre de contexte de 128K tokens et que votre entrée fait 120K tokens, il ne vous reste que
        8K tokens pour la réponse du modèle. C'est une contrainte importante lors de la conception de
        tâches nécessitant de longues sorties.
      </p>

      <h2>Limites actuelles de la fenêtre de contexte par modèle</h2>
      <p>
        Les fenêtres de contexte ont considérablement augmenté ces dernières années, et les chiffres
        continuent de progresser à mesure que les modèles s'améliorent :
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> — 128 000 tokens (~96 000 mots). Suffisant pour un roman complet ou
          une grande base de code.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> — 200 000 tokens (~150 000 mots). Anthropic
          a systématiquement repoussé cette limite plus loin qu'OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> — 1 000 000 tokens (~750 000 mots). Une fenêtre de contexte
          véritablement sans précédent qui peut contenir des bases de code entières ou des heures de
          transcriptions de réunions.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> — 1 000 000 tokens, optimisé pour la vitesse et un coût
          inférieur.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> — 128 000 tokens, disponible via divers fournisseurs
          dont together.ai et Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> — 128 000 tokens.
        </li>
      </ul>
      <p>
        À titre de comparaison, cet article de blog complet fait environ 1 200 tokens. Même la « petite »
        fenêtre de 128K de GPT-4o est suffisamment grande pour traiter la totalité de la plupart des
        documents pratiques. La question n'est pas seulement de savoir si votre contenu tient — c'est aussi
        de savoir comment le modèle gère le contenu à différentes positions dans cette fenêtre.
      </p>

      <h2>Que se passe-t-il quand vous dépassez la fenêtre de contexte</h2>
      <p>
        Quand votre entrée dépasse la longueur de contexte maximale du modèle, l'API retourne une erreur.
        Les messages d'erreur courants incluent :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// OpenAI
{
  "error": {
    "type": "invalid_request_error",
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 128000 tokens. However, your messages resulted in 134291 tokens."
  }
}

// Anthropic
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is too long: 201483 tokens > 200000 maximum"
  }
}`}
      </pre>
      <p>
        Dans une application de chat, cela se produit fréquemment après suffisamment d'échanges dans une
        longue conversation. À mesure que chaque message utilisateur et réponse de l'assistant est ajouté
        à l'historique, le nombre total de tokens augmente jusqu'à atteindre la limite. Sans gestion
        proactive, l'application plante à l'échange suivant. Les utilisateurs vivent cela comme l'IA qui
        refuse soudainement de répondre ou qui génère une erreur en pleine conversation — une expérience
        très frustrante.
      </p>

      <h2>Le problème du « perdu au milieu »</h2>
      <p>
        Avoir une grande fenêtre de contexte ne signifie pas que le modèle prête une attention égale à
        tout. Les recherches ont montré systématiquement que les modèles basés sur les transformers
        fonctionnent mieux sur les informations placées au début ou à la fin du contexte — un phénomène
        connu sous le nom de problème du <strong>perdu au milieu</strong>.
      </p>
      <p>
        En pratique, cela signifie que si vous faites de la génération augmentée par récupération (RAG)
        et que vous injectez 20 fragments de documents récupérés au milieu d'un long contexte, le modèle
        peut ne pas référencer les fragments aux positions 8 à 14 même s'ils sont les plus pertinents.
        Les informations les plus importantes pour votre tâche devraient être placées soit au tout début
        (près du prompt système), soit à la toute fin (juste avant la question de l'utilisateur) du contexte.
      </p>
      <p>
        Cela signifie aussi que donner simplement au modèle un contexte de 1M de tokens et y déverser tout
        ce que vous avez n'est pas toujours la bonne stratégie. Un contexte ciblé de 10K tokens avec
        précisément les bonnes informations surpassera souvent un contexte de 500K rempli de matériau
        vaguement pertinent.
      </p>

      <h2>Stratégies pour travailler dans les limites du contexte</h2>

      <h3>Découpage en morceaux</h3>
      <p>
        Pour les documents qui dépassent la fenêtre de contexte, découpez-les en morceaux qui se chevauchent
        et traitez chaque morceau indépendamment. Utilisez un petit chevauchement (par exemple 20 % de la
        taille du morceau) pour préserver la continuité aux limites. Cela fonctionne bien pour des tâches
        comme la résumé, l'extraction et la classification où chaque morceau est relativement autonome.
      </p>

      <h3>Résumé / Compression</h3>
      <p>
        Pour les longues conversations ou les historiques de documents, résumez périodiquement le contenu
        plus ancien et remplacez-le par le résumé. Une conversation de 50 échanges peut souvent être
        compressée en un résumé de 300 tokens qui préserve le contexte clé sans consommer tout l'historique.
        C'est particulièrement efficace dans les applications de chat où les premiers échanges deviennent
        moins pertinents à mesure que la conversation progresse.
      </p>

      <h3>Génération augmentée par récupération (RAG)</h3>
      <p>
        Au lieu de placer des documents entiers dans le contexte, intégrez-les dans une base de données
        vectorielle et ne récupérez que les passages les plus pertinents au moment de la requête. Un
        système RAG bien conçu peut faire qu'un modèle avec une fenêtre de contexte de 128K « connaît »
        effectivement des millions de tokens de documentation — il ne récupère simplement ce qui est
        nécessaire par requête. Cela réduit aussi significativement les coûts par rapport à l'utilisation
        d'un modèle à long contexte complet sur chaque requête.
      </p>

      <h3>Inclusion sélective du contexte</h3>
      <p>
        Soyez délibéré dans ce que vous incluez. Dans un assistant de codage, vous n'avez pas besoin
        d'inclure chaque fichier du projet — uniquement les fichiers pertinents pour la tâche en cours.
        Dans un système de Q&amp;R sur documents, n'incluez pas le document entier sauf si la question
        porte sur quelque chose qui s'étend à l'ensemble du document. Construisez une logique qui sélectionne
        le contexte de manière intelligente plutôt que d'inclure tout par défaut.
      </p>

      <h2>Comment surveiller votre utilisation du contexte</h2>
      <p>
        La plupart des API de fournisseurs d'IA retournent l'utilisation des tokens dans leurs réponses.
        L'objet de réponse d'OpenAI inclut un champ <code>usage</code> avec <code>prompt_tokens</code>,
        <code>completion_tokens</code> et <code>total_tokens</code>. Anthropic retourne{" "}
        <code>input_tokens</code> et <code>output_tokens</code>. Journaliser ces comptages pour chaque
        requête vous donne une visibilité sur les tendances de croissance avant d'atteindre la limite.
      </p>
      <p>
        Pour des vérifications préalables avant d'envoyer une requête, utilisez l'{" "}
        <a href="/tools/context-window">outil Fenêtre de contexte BrowseryTools</a> pour coller votre
        prompt et voir exactement combien de tokens il occupe et quel pourcentage de la fenêtre de contexte
        de chaque modèle cela représente. C'est particulièrement utile lors de la construction de prompts
        système ou de la conception de stratégies de récupération RAG — vous pouvez voir l'impact de vos
        choix avant de faire un seul appel API.
      </p>

      <h2>Plus grand n'est pas toujours mieux</h2>
      <p>
        L'expansion des fenêtres de contexte est une véritable réussite d'ingénierie, et les contextes
        d'un million de tokens ouvrent des cas d'usage véritablement nouveaux. Mais pour la plupart des
        applications, la stratégie gagnante n'est pas de remplir la fenêtre de contexte au maximum — c'est
        de placer les bonnes informations à la bonne position dans un contexte bien délimité. Combinez cela
        avec une compréhension de la quantité de contexte que vous utilisez à tout moment, et vous
        construirez des applications plus rapides, moins chères et plus fiables que celles qui traitent la
        fenêtre de contexte comme une décharge.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Outil Fenêtre de contexte gratuit — Visualisez la taille de votre prompt instantanément
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir l'outil Fenêtre de contexte →
        </a>
      </div>
      <ToolCTA slug="context-window" variant="card" />
    </div>
  );
}
