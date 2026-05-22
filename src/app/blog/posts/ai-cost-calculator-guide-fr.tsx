export default function Content() {
  return (
    <div>
      <p>
        Les API d'IA ont rendu l'intégration de grands modèles de langage dans les applications
        remarquablement facile — mais elles ont aussi rendu remarquablement facile le fait de dépenser
        son budget sans s'en rendre compte. La tarification à base de tokens n'est pas évidente au premier
        abord, et la différence entre les coûts en entrée et en sortie, les niveaux de modèles et le
        volume de requêtes peut générer des factures des ordres de grandeur supérieures à ce qui était
        prévu. Quelques minutes d'estimation préalable peuvent éviter bien des mauvaises surprises.
      </p>
      <p>
        Vous pouvez utiliser le{" "}
        <a href="/tools/ai-cost-calculator">Calculateur de coûts IA BrowseryTools</a> — gratuit, sans
        inscription, tout reste dans votre navigateur — pour modéliser vos coûts sur GPT-4, Claude,
        Gemini et d'autres modèles majeurs avant d'écrire une seule ligne de code.
      </p>

      <h2>Comment fonctionne la tarification à base de tokens</h2>
      <p>
        Chaque grande API d'IA — OpenAI, Anthropic, Google — facture au token, pas à la requête ni à la
        seconde. Un token correspond approximativement à 3–4 caractères de texte anglais, soit environ
        0,75 mot. Lorsque vous envoyez un prompt à une API, le fournisseur compte les tokens de votre
        entrée, génère une réponse, compte ces tokens de sortie et facture les deux — à des tarifs
        différents.
      </p>
      <p>
        Les prix sont indiqués pour 1 000 tokens (parfois pour 1 million de tokens pour les niveaux de
        tarification plus récents à fort volume). Début 2026, des repères approximatifs donnent :
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — ~2,50 $ par million de tokens en entrée, ~10,00 $ par million en sortie</li>
        <li><strong>Claude 3.5 Sonnet</strong> — ~3,00 $ par million de tokens en entrée, ~15,00 $ par million en sortie</li>
        <li><strong>Gemini 1.5 Pro</strong> — ~1,25 $ par million de tokens en entrée, ~5,00 $ par million en sortie</li>
        <li><strong>GPT-4o mini</strong> — ~0,15 $ par million de tokens en entrée, ~0,60 $ par million en sortie</li>
        <li><strong>Claude 3 Haiku</strong> — ~0,25 $ par million de tokens en entrée, ~1,25 $ par million en sortie</li>
      </ul>
      <p>
        Ces chiffres évoluent à mesure que les modèles sont mis à jour, vérifiez donc toujours la page
        de tarification actuelle du fournisseur. L'enseignement clé est l'écart entre la tarification en
        entrée et en sortie : les tokens de sortie coûtent généralement 3 à 5 fois plus que les tokens
        en entrée pour le même modèle.
      </p>

      <h2>Pourquoi les tokens de sortie coûtent plus cher</h2>
      <p>
        L'asymétrie entre la tarification en entrée et en sortie reflète de vraies différences de calcul.
        Traiter un token en entrée (durant la phase de « prefill ») implique un seul passage en avant à
        travers les couches d'attention du modèle. Générer chaque token de sortie (durant le « décodage »)
        nécessite un passage en avant séparé — en série, un token à la fois — ce qui est bien plus
        intensif en calcul à grande échelle.
      </p>
      <p>
        Cela a une implication directe pour l'estimation des coûts : votre nombre de tokens de sortie
        compte plus que votre nombre de tokens en entrée. Un prompt système de 500 tokens qui produit une
        réponse de 1 500 tokens coûte plus en sortie que toute l'entrée. Si vous concevez une fonctionnalité
        qui génère de longs documents, rapports ou fichiers de code, modélisez soigneusement la longueur
        de sortie — c'est elle qui domine la facture.
      </p>

      <h2>Estimation des coûts mensuels : un cadre</h2>
      <p>
        Pour estimer vos dépenses mensuelles d'API IA, vous avez besoin de quatre chiffres :
      </p>
      <ul>
        <li><strong>Tokens en entrée moyens par requête</strong> — votre prompt système + message utilisateur + tout contexte</li>
        <li><strong>Tokens en sortie moyens par requête</strong> — la longueur typique de la réponse du modèle</li>
        <li><strong>Requêtes par jour</strong> — votre volume d'appels quotidien prévu à l'échelle</li>
        <li><strong>Tarification du modèle</strong> — coût en entrée et en sortie par million de tokens pour le modèle prévu</li>
      </ul>
      <p>
        La formule : <code>(tokens_entrée_moy × prix_entrée + tokens_sortie_moy × prix_sortie) × requêtes_par_jour × 30</code>.
        Cela semble simple, mais estimer les nombres de tokens avant d'avoir des données réelles est là où
        la plupart des gens se trompent. Un prompt système « court » qui semble faire 50 mots peut
        facilement représenter 80 à 100 tokens. Une question utilisateur plus l'historique de conversation
        dans une application de chat peut atteindre des milliers de tokens par requête sans gestion prudente.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Exemple : bot de support client
avg_input_tokens  = 800   // prompt système + message utilisateur + historique
avg_output_tokens = 300   // réponse de support typique
requests_per_day  = 5000  // volume de production modéré
model             = Claude 3.5 Sonnet

daily_cost = (800 × $0.003 + 300 × $0.015) par 1K tokens × 5000
           = ($2.40 + $4.50) × 5
           = ~$34.50/jour → ~$1,035/mois`}
      </pre>
      <p>
        La même charge de travail sur GPT-4o mini à 0,15 $/0,60 $ par million de tokens coûterait environ
        15 $/mois. Le choix du modèle seul représente un facteur de coût de 70x pour cette charge.
      </p>

      <h2>Stratégies pratiques pour réduire les coûts d'API IA</h2>
      <p>
        Une fois que vous avez une estimation des coûts, l'étape suivante est d'identifier où réduire.
        Voici les techniques à plus fort levier :
      </p>
      <ul>
        <li>
          <strong>Choisissez le bon niveau de modèle</strong> — Utilisez les modèles puissants (GPT-4,
          Claude Sonnet, Gemini Pro) uniquement pour les tâches qui nécessitent un raisonnement approfondi.
          Pour la classification, l'extraction simple ou les Q&amp;R courtes, les modèles plus petits comme
          GPT-4o mini ou Claude Haiku délivrent des résultats comparables à un coût 10 à 50 fois inférieur.
        </li>
        <li>
          <strong>Mettez en cache les entrées répétées</strong> — Si votre prompt système est le même pour
          des milliers de requêtes, la mise en cache des prompts (prise en charge par Anthropic et OpenAI)
          vous permet d'éviter de le retokeniser à chaque fois. Sur les applications à fort volume, cela
          peut seul réduire les coûts de 30 à 50 %.
        </li>
        <li>
          <strong>Élaguez le contexte agressivement</strong> — Chaque token dans la fenêtre de contexte
          coûte de l'argent. Dans les applications de chat, n'incluez pas tout l'historique de conversation
          — gardez une fenêtre glissante des 5 à 10 derniers échanges, ou résumez les échanges plus anciens.
          Dans les pipelines RAG, ne récupérez que les passages les plus pertinents plutôt que d'injecter
          des documents en masse.
        </li>
        <li>
          <strong>Limitez le nombre maximum de tokens en sortie</strong> — Définissez <code>max_tokens</code>{" "}
          adapté à la tâche. Si vous générez un titre de produit, limitez-le à 30 tokens. Si le modèle ne
          peut pas répondre dans votre limite, vous détecterez ce cas limite plutôt que de payer
          silencieusement pour une réponse de 2 000 tokens.
        </li>
        <li>
          <strong>Traitez par lots quand c'est possible</strong> — OpenAI et Anthropic offrent des API de
          traitement par lots à 50 % de réduction pour les charges de travail ne nécessitant pas de réponses
          en temps réel. Les tâches de traitement nocturne, la classification de documents et les pipelines
          de génération de contenu sont de bons candidats.
        </li>
        <li>
          <strong>Surveillez et alertez</strong> — Définissez des limites de dépenses et des alertes
          d'utilisation dans le tableau de bord de votre fournisseur avant de passer en production. Des
          bugs dans la logique de nouvelle tentative ou des boucles infinies peuvent transformer une
          estimation de 50 $/mois en une surprise de 5 000 $ avant que vous ne vous en rendiez compte.
        </li>
      </ul>

      <h2>Planification budgétaire pour différents cas d'usage</h2>
      <p>
        Différents types d'applications ont des profils de coûts très différents. Un modèle mental rapide :
      </p>
      <ul>
        <li>
          <strong>Prototypes et projets personnels</strong> — 5 à 20 $/mois. Utilisez des modèles mini/haiku,
          gardez le contexte court, construisez sur le niveau gratuit quand c'est possible.
        </li>
        <li>
          <strong>Outils métier internes (faible volume)</strong> — 50 à 300 $/mois. Quelques centaines
          d'employés utilisant un outil de recherche ou de traitement de documents assisté par IA quelques
          fois par jour.
        </li>
        <li>
          <strong>Applications grand public avec fonctionnalités IA (échelle modérée)</strong> — 500 à
          5 000 $/mois. Des dizaines de milliers d'utilisateurs actifs interagissant quotidiennement avec
          des fonctionnalités IA. Le choix du modèle est critique ici.
        </li>
        <li>
          <strong>Produit IA cœur (fort volume)</strong> — 10 000 $/mois et plus. L'IA est la proposition
          de valeur principale, utilisée constamment. À cette échelle, négociez des tarifs entreprise et
          investissez dans l'infrastructure de mise en cache et de gestion du contexte.
        </li>
      </ul>

      <h2>Commencez par une estimation des coûts</h2>
      <p>
        Avant de vous engager sur un modèle, une architecture ou un niveau de tarification, modélisez vos
        coûts avec de vrais chiffres. Le{" "}
        <a href="/tools/ai-cost-calculator">Calculateur de coûts IA BrowseryTools</a> vous permet de
        saisir des nombres de tokens, des volumes de requêtes et des choix de modèles pour voir les
        dépenses mensuelles projetées côte à côte entre fournisseurs. Cela prend deux minutes et peut
        éviter des mois de mauvaises surprises sur les factures.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculateur de coûts IA gratuit — Comparez GPT-4, Claude, Gemini
        </p>
        <a
          href="/tools/ai-cost-calculator"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le Calculateur de coûts IA →
        </a>
      </div>
    </div>
  );
}
