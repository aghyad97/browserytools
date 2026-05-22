export default function Content() {
  return (
    <div>
      <p>
        Lorsque les développeurs commencent à travailler avec les API de grands modèles de langage, une
        question surgit presque immédiatement : « Quelle est la limite ? » Ils pensent en mots, en
        paragraphes ou en caractères — mais le modèle, lui, pense en tokens. Comprendre ce que sont les
        tokens, comment ils sont comptés et pourquoi ce comptage est important est l'une des choses les
        plus pratiquement utiles que vous puissiez apprendre avant de construire quoi que ce soit de
        sérieux par-dessus un LLM.
      </p>
      <p>
        Vous pouvez utiliser le{" "}
        <a href="/tools/token-counter">Compteur de tokens BrowseryTools</a> — gratuit, sans inscription,
        tout reste dans votre navigateur — pour compter les tokens de n'importe quel texte avant de
        l'envoyer à une API.
      </p>

      <h2>Qu'est-ce qu'un token ? (Ni un mot, ni un caractère)</h2>
      <p>
        Un token est l'unité fondamentale de texte qu'un modèle de langage traite. Ce n'est pas un mot.
        Ce n'est pas un caractère. C'est un fragment de texte que le tokeniseur du modèle a appris à traiter
        comme une unité unique — et ce fragment peut aller d'un seul caractère à un fragment de mot ou à un
        mot courant complet.
      </p>
      <p>
        Voici quelques exemples de la façon dont une phrase pourrait être découpée en tokens par un
        tokeniseur de la famille GPT :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 tokens

"unbelievable"
→ ["un", "believ", "able"]  — 3 tokens

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 tokens

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 tokens`}
</pre>
      <p>
        Notez comment les mots courts courants comme « Hello » correspondent à un seul token, tandis que
        les mots plus longs ou peu courants sont découpés en plusieurs tokens. La ponctuation, les chiffres
        et les caractères spéciaux sont souvent leurs propres tokens. Le tokeniseur ne se contente pas de
        découper sur les espaces ou la ponctuation — il utilise un vocabulaire appris d'unités sub-lexicales
        pour atteindre le meilleur équilibre entre taille du vocabulaire et efficacité de la représentation.
      </p>

      <h2>Comment fonctionnent les tokeniseurs : le Byte-Pair Encoding</h2>
      <p>
        La plupart des LLM modernes — GPT-4, Claude, Gemini, Llama — utilisent une variante du{" "}
        <strong>Byte-Pair Encoding (BPE)</strong> ou un algorithme étroitement lié appelé SentencePiece.
        Le BPE a été développé à l'origine pour la compression de données ; il a été adapté au traitement
        du langage naturel car il résout élégamment le problème du vocabulaire ouvert.
      </p>
      <p>
        Le processus d'entraînement du BPE commence avec des caractères individuels (ou octets) comme
        vocabulaire de base. Il trouve ensuite de manière répétée la paire de symboles co-occurrente la
        plus fréquente dans le corpus d'entraînement et les fusionne en un nouveau symbole unique. Après
        des milliers de telles fusions, le vocabulaire résultant contient des mots courants comme tokens
        uniques, des préfixes et suffixes courants comme tokens, et des mots rares comme séquences de
        tokens plus petits. La taille finale du vocabulaire est généralement de 32 000 à 100 000 tokens.
      </p>
      <p>
        Cela signifie que la tokenisation de n'importe quel texte dépend entièrement du vocabulaire
        spécifique avec lequel ce modèle a été entraîné. <strong>GPT-4, Claude et Gemini utilisent tous
        des tokeniseurs différents</strong> — le même texte peut donner des nombres de tokens différents
        sur chaque modèle. Ne supposez jamais qu'un nombre de tokens mesuré pour un modèle s'applique
        à un autre.
      </p>

      <h2>La règle des 750 mots pour 1 000 tokens</h2>
      <p>
        Vous verrez souvent citer l'approximation « 1 000 tokens ≈ 750 mots » pour les textes en anglais.
        C'est une heuristique raisonnable pour de la prose typique — articles de blog, articles, documentation.
        Elle découle de l'observation que dans un corpus anglais équilibré, la longueur moyenne d'un token
        est d'environ 4 à 5 caractères, et le mot anglais moyen fait environ 5 caractères plus un espace.
        Un mot correspond donc en moyenne à environ 1,3 token.
      </p>
      <p>
        Mais « règle de base » est le bon cadrage — elle s'effondre rapidement en pratique :
      </p>
      <ul>
        <li>
          <strong>Le code se tokenise plus densément</strong> — Les langages de programmation utilisent
          beaucoup de mots-clés courts, d'opérateurs et d'identifiants qui sont souvent des tokens uniques.
          Un bloc Python peut se tokeniser en moins de tokens par caractère que de la prose anglaise.
        </li>
        <li>
          <strong>Les URL et les chaînes techniques sont coûteuses</strong> — Une longue URL comme{" "}
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code> peut se
          tokeniser en plus de 20 tokens malgré une apparence courte à l'écran.
        </li>
        <li>
          <strong>Les nombres sont étonnamment coûteux</strong> — Chaque chiffre dans un long nombre est
          souvent un token séparé. Le nombre « 1738371600 » peut devenir 5 à 7 tokens.
        </li>
        <li>
          <strong>Les espaces et la mise en forme répétées</strong> — Le JSON avec indentation, les tableaux
          Markdown et le code profondément imbriqué ajoutent tous des tokens issus des espaces.
        </li>
      </ul>

      <h2>Langues non anglaises : arabe, chinois et la différence de coût en tokens</h2>
      <p>
        La règle des 750 mots pour 1 000 tokens est une heuristique pour l'<em>anglais</em>. Pour d'autres
        langues, le ratio peut être radicalement différent — et cela a des implications réelles en termes
        de coûts pour les applications multilingues.
      </p>
      <p>
        <strong>L'arabe et l'hébreu</strong> utilisent une morphologie de radical et de schème, où un seul
        radical génère des dizaines de formes dérivées par préfixes, suffixes et changements vocaliques
        internes. Des mots comme « وسيستخدمونها » (ils l'utiliseront) sont des mots orthographiques uniques
        mais peuvent se tokeniser en 5 à 8 tokens car le vocabulaire BPE a été entraîné majoritairement sur
        des données anglaises et n'a pas ces formes arabes comme tokens uniques.
      </p>
      <p>
        <strong>Le chinois et le japonais</strong> posent un défi différent. Les caractères sont
        logographiques — chaque caractère est une unité porteuse de sens — mais le vocabulaire de tokens
        couvre les caractères uniques courants et certains mots courants multi-caractères. Le texte chinois
        génère typiquement 1,5 à 2 fois plus de tokens par « équivalent de mot » que l'anglais. Le japonais,
        avec son mélange de hiragana, katakana et kanji, peut être encore plus élevé.
      </p>
      <p>
        Une implication pratique : si vous construisez une application pour l'arabe, le chinois ou d'autres
        langues à écriture non latine, vos estimations de coûts basées sur des tests en anglais
        sous-estimeront significativement les coûts réels de l'API. Mesurez toujours les nombres de tokens
        avec votre contenu réel en utilisant le{" "}
        <a href="/tools/token-counter">Compteur de tokens BrowseryTools</a> ou une bibliothèque de
        tokenisation avant de faire des projections budgétaires.
      </p>

      <h2>Limites de la fenêtre de contexte : pourquoi les dépasser fait tout échouer</h2>
      <p>
        Chaque LLM a une <strong>fenêtre de contexte</strong> — le nombre maximum de tokens qu'il peut
        traiter dans une seule requête, comptant à la fois votre entrée et la sortie du modèle. Début 2026 :
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — 128 000 tokens</li>
        <li><strong>Claude 3.5 Sonnet</strong> — 200 000 tokens</li>
        <li><strong>Gemini 1.5 Pro</strong> — 1 000 000 tokens</li>
        <li><strong>Llama 3.1 70B</strong> — 128 000 tokens</li>
      </ul>
      <p>
        Si votre entrée dépasse la limite de la fenêtre de contexte, l'API retournera une erreur — la
        requête échoue purement et simplement. Il n'y a pas de dégradation gracieuse par défaut ; vous
        devez gérer cela dans la logique de votre application. Plus subtilement, même à l'intérieur de
        la fenêtre de contexte, il existe un phénomène appelé le problème du « perdu au milieu » : les
        modèles ont tendance à mieux rappeler les informations au début et à la fin de leur contexte que
        les informations enfouies au milieu. Une fenêtre de contexte de 200K ne signifie pas que chaque
        token qu'elle contient est traité de façon équivalente.
      </p>
      <p>
        Pour les applications de chat, la fenêtre de contexte se remplit à mesure que les conversations
        s'allongent. Après suffisamment d'échanges, vous devez soit tronquer les anciens messages, les
        résumer, soit atteindre la limite et échouer. Connaître votre nombre de tokens à chaque étape est
        ce qui vous permet de prendre cette décision de manière proactive.
      </p>

      <h2>Implications pour la conception de prompts</h2>
      <p>
        La conscience des tokens change la façon dont vous rédigez vos prompts. Quelques implications
        concrètes :
      </p>
      <ul>
        <li>
          <strong>Les prompts système se cumulent sur chaque requête</strong> — Un prompt système de
          500 tokens coûte 500 × votre nombre de requêtes × votre prix d'entrée. Sur 10 000 requêtes
          quotidiennes, réduire votre prompt système de 500 à 300 tokens génère de vraies économies
          chaque mois.
        </li>
        <li>
          <strong>Les exemples few-shot sont chers mais efficaces</strong> — Inclure 3 exemples dans
          votre prompt peut ajouter 300 à 500 tokens. Évaluez si cette amélioration de qualité vaut le
          coût par rapport à un fine-tuning unique du modèle.
        </li>
        <li>
          <strong>La longueur de sortie est contrôlable</strong> — Utilisez <code>max_tokens</code> pour
          plafonner la sortie du modèle. Ajoutez des instructions explicites dans votre prompt : « Répondez
          en moins de 100 mots. » Les modèles suivent généralement bien les instructions de longueur de
          sortie, ce qui réduit directement les coûts des tokens de sortie.
        </li>
        <li>
          <strong>Le formatage JSON ajoute de la surcharge</strong> — Si vous utilisez la sortie structurée
          (mode JSON), les guillemets, crochets et noms de clés ajoutent des tokens en plus de vos valeurs
          de données réelles. Une réponse avec 5 champs courts peut facilement représenter 40 % de tokens
          de formatage en surcharge.
        </li>
      </ul>

      <h2>Comptez vos tokens avant d'envoyer</h2>
      <p>
        La meilleure habitude à développer lorsqu'on travaille avec les API LLM est de compter vos tokens
        avant de vous engager sur une architecture ou de passer en production. Collez votre prompt système,
        un message utilisateur représentatif et tout contexte que vous prévoyez d'inclure dans le{" "}
        <a href="/tools/token-counter">Compteur de tokens BrowseryTools</a>. Vous verrez immédiatement
        si votre conception est bien dans les limites de la fenêtre de contexte ou dangereusement proche —
        et vous aurez les chiffres nécessaires pour estimer les coûts avec précision.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Compteur de tokens gratuit — Fonctionne dans votre navigateur, sans inscription
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir le Compteur de tokens →
        </a>
      </div>
    </div>
  );
}
