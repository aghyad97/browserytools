export default function Content() {
  return (
    <div>
      <p>
        La différence entre une réponse d'IA médiocre et une réponse véritablement utile est rarement
        liée aux capacités du modèle — elle tient presque toujours à la façon dont le prompt a été rédigé.
        La structure, la clarté et les bons indices de formatage peuvent transformer une sortie vague et
        décousue en une réponse précise et exploitable. Si vous avez déjà eu l'impression qu'un outil IA
        ne tient pas ses promesses, le format de votre prompt est la première chose à examiner.
      </p>
      <p>
        Vous pouvez utiliser le{" "}
        <a href="/tools/prompt-formatter">Formateur de prompts BrowseryTools</a> — gratuit, sans
        inscription, tout reste dans votre navigateur — pour nettoyer, restructurer et affiner vos
        prompts avant de les envoyer à n'importe quel modèle d'IA.
      </p>

      <h2>Pourquoi le formatage compte plus que vous ne le pensez</h2>
      <p>
        Les modèles de langage ne lisent pas les prompts comme un humain parcoure un message. Ils traitent
        les tokens séquentiellement et sont sensibles à la façon dont les instructions sont formulées,
        ordonnées et séparées. Un prompt rédigé en un long paragraphe ininterrompu enfouit les instructions
        les plus importantes au milieu — exactement là où elles ont le moins de chances d'influencer la
        sortie. Un prompt bien formaté place les contraintes et les objectifs en tête, utilise des
        délimiteurs clairs entre les sections et indique explicitement le format de sortie attendu.
      </p>
      <p>
        Pensez au formatage d'un prompt comme à la rédaction d'un cahier des charges pour un prestataire.
        Plus vous spécifiez précisément le livrable, les contraintes et le contexte, plus le premier jet
        sera proche de ce dont vous avez réellement besoin.
      </p>

      <h2>Technique 1 : Attribution d'un rôle</h2>
      <p>
        L'une des techniques de formatage les plus efficaces est de donner un rôle au modèle avant la
        tâche réelle. Cela active un registre spécifique et un ensemble de conventions que le modèle
        associe à ce rôle, produisant une sortie plus cohérente.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sans rôle :
"Explique comment rédiger un bon README."

✅ Avec rôle :
"Tu es un mainteneur open source senior qui examine des centaines de dépôts.
Explique comment rédiger un README qui communique clairement la valeur
d'un projet aux lecteurs techniques et non techniques."`}
      </pre>
      <p>
        Le cadrage par le rôle ne restreint pas le modèle — il le focalise. Vous obtenez une rédaction
        qui correspond aux standards et au vocabulaire du persona, plutôt qu'un aperçu générique.
      </p>

      <h2>Technique 2 : Blocs d'instructions clairs</h2>
      <p>
        Séparez la description de la tâche, le contexte et les contraintes en sections distinctes. Les
        en-têtes Markdown et les délimiteurs triple-backtick fonctionnent bien ici. De nombreux modèles
        ont été entraînés sur des documents avec cette structure et y répondent bien.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Tâche
Résumez les retours clients suivants en trois priorités produit exploitables.

## Contexte
Ce sont des retours d'utilisateurs B2B SaaS collectés au T4 2025. Le public
pour ce résumé est un chef de produit préparant une session de sprint planning.

## Contraintes
- Maximum 150 mots au total
- Utiliser des puces
- Ne pas inclure de citations directes

## Entrée
"""
[les retours clients vont ici]
"""`}
      </pre>
      <p>
        Les sections étiquetées rendent immédiatement clair ce qui va où. Vous pouvez ajuster le contexte
        ou les contraintes indépendamment sans réécrire tout le prompt.
      </p>

      <h2>Technique 3 : Exemples few-shot</h2>
      <p>
        Si vous avez besoin d'une sortie dans un style ou un format spécifique, la technique la plus
        fiable est d'inclure un ou deux exemples de ce que vous voulez. C'est ce qu'on appelle le
        prompting few-shot et cela surpasse systématiquement les longues descriptions verbales du format
        souhaité.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Convertis une demande de fonctionnalité brute en user story selon le format suivant.

Exemple d'entrée : "Les utilisateurs veulent exporter les données en CSV"
Exemple de sortie : "En tant qu'analyste de données, je veux exporter les données de mon
tableau de bord en CSV afin de pouvoir effectuer une analyse personnalisée dans des outils de tableur."

Maintenant convertis : "Les utilisateurs veulent être notifiés quand un rapport est prêt"`}
      </pre>
      <p>
        Notez que l'exemple définit à la fois la structure (« En tant que... Je veux... afin de... ») et
        le niveau de spécificité attendu. Vous n'avez pas besoin d'expliquer le format en prose — l'exemple
        le montre.
      </p>

      <h2>Technique 4 : Prompting par chaîne de pensée</h2>
      <p>
        Pour les tâches de raisonnement — débogage, analyse, calculs, prise de décision — demander
        explicitement au modèle de réfléchir étape par étape avant de donner une réponse finale améliore
        considérablement la précision. Ce n'est pas une astuce : cela change la façon dont le modèle
        alloue son calcul interne pendant la génération.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Sans chaîne de pensée :
"Quelle est la meilleure base de données pour un jeu multijoueur en temps réel ?"

✅ Avec chaîne de pensée :
"Quelle est la meilleure base de données pour un jeu multijoueur en temps réel ?
Réfléchis aux exigences étape par étape — latence, modèle de concurrence,
structure des données, garanties de cohérence — avant de donner ta recommandation."`}
      </pre>
      <p>
        L'instruction étape par étape fait apparaître un raisonnement intermédiaire que vous pouvez
        évaluer. Vous êtes aussi beaucoup plus susceptible de détecter les erreurs quand vous pouvez voir
        la chaîne de raisonnement plutôt qu'une simple conclusion.
      </p>

      <h2>Technique 5 : Prompts structurés XML et JSON</h2>
      <p>
        Quand vous avez besoin que la sortie elle-même soit structurée — un objet JSON, un tableau, un
        schéma spécifique — rendez le format de sortie explicite et utilisez une structure correspondante
        dans le prompt. Claude et GPT-4 répondent particulièrement bien aux sections balisées en XML.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extrayez les champs suivants de la description de poste ci-dessous.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[texte de la description de poste ici]
</input>`}
      </pre>
      <p>
        Les balises XML servent de délimiteurs non ambigus. Le modèle sait exactement où ses instructions
        se terminent et où commencent les données d'entrée, réduisant le risque que le modèle traite vos
        instructions comme une partie du contenu à traiter.
      </p>

      <h2>Erreurs courantes de formatage de prompts</h2>
      <ul>
        <li><strong>Enfouir l'instruction principale</strong> — Placez ce que vous voulez que le modèle fasse au début, pas après trois paragraphes de contexte. Les modèles pondèrent davantage les tokens antérieurs.</li>
        <li><strong>Contraintes contradictoires</strong> — « Sois concis mais couvre tous les détails » force le modèle à faire un compromis arbitraire. Précisez lequel compte le plus.</li>
        <li><strong>Supposer un contexte partagé</strong> — Le modèle n'a aucune mémoire de vos sessions précédentes. Incluez tout le contexte pertinent dans le prompt lui-même.</li>
        <li><strong>Aucun format de sortie spécifié</strong> — Si vous avez besoin d'une liste, dites liste. Si vous avez besoin de JSON, dites JSON. Si vous avez besoin d'une réponse de moins de 200 mots, dites-le. Format non spécifié = sortie imprévisible.</li>
        <li><strong>Règles de style trop spécifiées</strong> — Les longues listes d'instructions négatives (« ne fais pas X, ne dis jamais Y ») consomment du contexte et produisent souvent une sortie guindée et maladroite. Une ou deux contraintes fortes surpassent dix contraintes faibles.</li>
      </ul>

      <h2>Avant et après : la même demande, reformatée</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Avant :
"Peux-tu m'aider à écrire un email à mon patron sur un retard de projet ?
On devait lancer la nouvelle intégration de paiement vendredi dernier mais
l'API tierce a eu des problèmes et maintenant on regarde peut-être mercredi
ou jeudi, tu peux le rendre professionnel ?"

✅ Après :
Tu es un communicant d'affaires expérimenté.

## Tâche
Rédige un email professionnel de notification de retard d'un développeur
à son responsable.

## Contexte
- Projet : intégration de passerelle de paiement
- Date limite initiale : vendredi dernier
- Nouvelle estimation : mercredi ou jeudi cette semaine
- Cause : problèmes avec une API tierce (pas la faute de notre équipe)

## Ton
Professionnel, direct et orienté solution — ni défensif ni excessivement excusé

## Sortie
Objet + corps de l'email, moins de 150 mots`}
      </pre>
      <p>
        La version reformatée prend 20 secondes de plus à rédiger et produit une sortie immédiatement
        utilisable, plutôt que d'exiger deux ou trois corrections de suivi.
      </p>

      <h2>Utiliser le Formateur de prompts</h2>
      <p>
        Le{" "}
        <a href="/tools/prompt-formatter">Formateur de prompts BrowseryTools</a> vous aide à appliquer
        ces techniques sans mémoriser chaque règle. Collez votre prompt brut, choisissez la structure
        adaptée à votre cas d'usage, et obtenez une version propre et bien organisée prête à envoyer à
        ChatGPT, Claude, Gemini ou tout autre modèle. Aucun compte requis, et vos prompts ne quittent
        jamais votre navigateur.
      </p>

      <h2>Résumé</h2>
      <p>
        Le formatage des prompts est une compétence qui s'apprend avec un retour sur investissement
        mesurable. L'attribution d'un rôle focalise le modèle, les sauts de section clairs éliminent
        l'ambiguïté, les exemples few-shot définissent votre format attendu, et les contraintes de sortie
        explicites suppriment les suppositions. Le meilleur prompt n'est pas le plus élaboré — c'est celui
        qui laisse le moins de questions sans réponse avant que la génération ne commence.
      </p>
    </div>
  );
}
