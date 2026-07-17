import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Tout développeur a déjà vécu cette situation : deux versions d'un fichier qui devraient être
        identiques, mais quelque chose a changé. Peut-être un fichier de configuration modifié
        manuellement sur un serveur. Peut-être un contrat revenu d'un avocat avec des changements non
        divulgués. Peut-être un fichier de traduction renvoyé par un prestataire et que vous devez
        vérifier pour vous assurer que rien n'a été supprimé accidentellement. Dans tous ces cas, la
        réponse est la même : lancez un diff.
      </p>
      <ToolCTA slug="text-diff" variant="inline" />
      <p>
        Vous pouvez comparer deux blocs de texte instantanément grâce à l'outil{" "}
        <a href="/tools/text-diff">Diff de texte BrowseryTools</a> — gratuit, sans inscription, tout
        reste dans votre navigateur.
      </p>

      <h2>Pourquoi la comparaison de texte est importante</h2>
      <p>
        La comparaison de texte n'est pas uniquement un outil de développeur. Toute situation où deux
        versions d'un document existent et où les différences doivent être mises en évidence est un
        problème de diff :
      </p>
      <ul>
        <li><strong>Revue de code</strong> — comprendre ce qui a changé entre deux versions du code source avant d'approuver une fusion</li>
        <li><strong>Comparaison de contrats et documents juridiques</strong> — identifier exactement quelles clauses ont été ajoutées, supprimées ou modifiées entre deux versions</li>
        <li><strong>Gestion de configuration</strong> — confirmer qu'un fichier de configuration déployé correspond à la version dans le contrôle de source</li>
        <li><strong>Vérification de contenu traduit</strong> — vérifier qu'un document traduit couvre toutes les mêmes sections que l'original</li>
        <li><strong>Validation de données</strong> — comparer des exports CSV de deux systèmes pour trouver des divergences</li>
        <li><strong>Relecture</strong> — détecter des changements involontaires entre le brouillon d'un document et sa version publiée</li>
      </ul>

      <h2>Comment fonctionnent les algorithmes de diff</h2>
      <p>
        Le problème central qu'un algorithme de diff résout est : étant donné deux séquences A et B,
        trouver l'ensemble minimal de modifications (insertions et suppressions) nécessaires pour
        transformer A en B. C'est formellement le problème de la Plus Longue Sous-séquence Commune
        (LCS). Le diff rapporte ensuite ce qui n'était pas dans le LCS — les lignes uniques à A
        (suppressions) et les lignes uniques à B (insertions).
      </p>
      <p>
        Deux algorithmes dominent les implémentations pratiques :
      </p>
      <ul>
        <li>
          <strong>Diff de Myers (1986)</strong> — l'algorithme derrière la commande Unix originale <code>diff</code>{" "}
          et Git. Eugene Myers l'a conçu pour trouver le script de modification le plus court (le diff avec le
          moins d'insertions et de suppressions au total) en temps O(ND), où N est la taille totale des deux
          entrées et D est le nombre de différences. Il est rapide et produit des diffs minimaux, mais peut
          produire une sortie peu intuitive quand de grands blocs de code sont déplacés.
        </li>
        <li>
          <strong>Diff de patience</strong> — développé par Bram Cohen (créateur de BitTorrent) et utilisé par
          Bazaar, puis popularisé par Kaleidoscope. Au lieu de travailler ligne par ligne, le diff de patience
          commence par faire correspondre les lignes uniques qui apparaissent exactement une fois dans les deux
          fichiers. Cela produit une sortie qui préserve bien mieux les limites de fonctions et de blocs que le
          diff de Myers pour le code source. Git le prend en charge via{" "}
          <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Lire la sortie de diff unifiée</h2>
      <p>
        Le format de diff unifié est la sortie standard de <code>git diff</code> et de la plupart des
        outils de diff. Une fois que vous comprenez la notation, elle devient immédiatement lisible.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (original file)
+++ b/config.yml       (modified file)
@@ -10,7 +10,8 @@     (hunk header)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        Les éléments clés à lire :
      </p>
      <ul>
        <li><strong>Lignes commençant par <code>-</code></strong> — présentes dans l'original, supprimées dans la nouvelle version (affichées en rouge)</li>
        <li><strong>Lignes commençant par <code>+</code></strong> — absentes de l'original, ajoutées dans la nouvelle version (affichées en vert)</li>
        <li><strong>Lignes sans préfixe (espace)</strong> — lignes de contexte inchangées, affichées pour l'orientation</li>
        <li>
          <strong>L'en-tête de section <code>@@</code></strong> — se lit comme « à partir de la ligne 10, affichant 7 lignes de l'original ; à partir de la ligne 10, affichant 8 lignes de la nouvelle version. » Le format est{" "}
          <code>@@ -début,nombre +début,nombre @@</code>.
        </li>
      </ul>

      <h2>Diff au niveau du mot vs de la ligne vs du caractère</h2>
      <p>
        La granularité d'un diff détermine son utilité pour une tâche donnée.
      </p>
      <ul>
        <li>
          <strong>Diff au niveau de la ligne</strong> — la valeur par défaut pour le code source. Chaque ligne est traitée comme une unité atomique. Rapide et adapté au code où les lignes sont courtes et significatives. Si un seul mot change dans un long paragraphe, toute la ligne s'affiche comme modifiée.
        </li>
        <li>
          <strong>Diff au niveau du mot</strong> — adapté à la prose et à la documentation. Les mots modifiés dans une ligne sont mis en évidence individuellement, donnant un signal beaucoup plus clair dans les documents à forte teneur en texte. La plupart des outils de comparaison de documents (Suivi des modifications Word, Historique des versions Google Docs) fonctionnent au niveau du mot.
        </li>
        <li>
          <strong>Diff au niveau du caractère</strong> — met en évidence les changements de caractères individuels dans les mots. Très utile pour détecter des fautes de frappe subtiles, des changements d'espacement, des caractères invisibles (espaces à largeur nulle, espaces insécables) ou des différences d'encodage. Indispensable pour comparer des données qui semblent visuellement identiques mais diffèrent au niveau des octets.
        </li>
      </ul>
      <p>
        L'outil <a href="/tools/text-diff">Diff de texte BrowseryTools</a> met en évidence les
        différences en ligne, facilitant la détection des changements en un coup d'œil sans lire
        manuellement le format de diff unifié.
      </p>

      <h2>git diff sous le capot</h2>
      <p>
        Quand vous exécutez <code>git diff</code>, Git calcule le diff de Myers entre les versions
        d'objets stockées dans sa base de données d'objets. Quelques indicateurs utiles changent le
        comportement :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git diff HEAD~3               # current state vs 3 commits ago
git diff main...feature       # what feature branch adds to main
git diff --word-diff          # word-level highlighting
git diff --patience           # use patience algorithm (better for code)
git diff --stat               # summary: files changed, insertions, deletions`}
      </pre>
      <p>
        Pour comprendre spécifiquement <code>git diff main...feature</code> : la notation à trois points
        montre ce que la branche feature a ajouté depuis sa divergence de main, en excluant les
        changements survenus sur main depuis le point de divergence. C'est presque toujours ce que vous
        voulez pour la revue de pull request, contrairement à la double notation{" "}
        <code>main..feature</code> qui compare directement les pointes actuelles des deux branches.
      </p>

      <h2>Cas d'usage pratiques</h2>

      <h3>Comparaison de fichiers de configuration</h3>
      <p>
        Les fichiers de configuration (YAML, TOML, JSON, .env) sont des sources fréquentes de bugs en
        production quand les versions déployées divergent des versions sous contrôle de source. Avant
        de déboguer un problème de production mystérieux, comparer la configuration en ligne avec la
        configuration attendue en révèle souvent la cause immédiatement.
      </p>

      <h3>Comparaison de contrats et documents</h3>
      <p>
        Quand un brouillon de contrat revient de l'autre partie, ne faites jamais confiance à un résumé
        des changements. Exportez les deux versions en texte brut et lancez un diff. Les avocats sont
        connus pour modifier des termes définis, ajouter des plafonds de responsabilité ou changer des
        délais de préavis de façon que une lecture rapide puisse manquer. Un diff au niveau du mot rend
        chaque changement visible.
      </p>

      <h3>Vérification de documents traduits</h3>
      <p>
        Quand vous travaillez avec du contenu traduit, comparez la structure du document traduit avec la
        source. Un diff structurel des titres de sections et du nombre de paragraphes révèle si des
        sections ont été accidentellement omises ou fusionnées lors de la traduction.
      </p>

      <h2>Comparaison des outils de diff</h2>
      <ul>
        <li><strong>git diff</strong> — intégré, au niveau de la ligne, format de diff unifié, pas de GUI. La référence pour tout travail de code.</li>
        <li><strong>vimdiff</strong> — diff côte à côte dans le terminal à l'intérieur de Vim. Puissant pour des comparaisons rapides sans quitter le terminal ; courbe d'apprentissage prononcée.</li>
        <li><strong>Beyond Compare</strong> — outil de bureau commercial avec synchronisation de dossiers, diff binaire et fusion à trois voies. Le standard de référence pour la comparaison de documents non développeurs.</li>
        <li><strong>Meld</strong> — outil de diff GUI gratuit et multiplateforme avec support de fusion à trois voies. La meilleure alternative gratuite à Beyond Compare.</li>
        <li><strong>Diff de texte BrowseryTools</strong> — instantané, basé sur le navigateur, sans installation. Idéal pour les comparaisons ponctuelles rapides, surtout pour du texte que vous ne souhaiteriez pas coller dans un service en ligne.</li>
      </ul>
      <ToolCTA slug="text-diff" variant="card" />
    </div>
  );
}
