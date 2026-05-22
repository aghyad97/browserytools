export default function Content() {
  return (
    <div>
      <p>
        Markdown est partout. C'est le format d'écriture par défaut sur GitHub, la colonne vertébrale
        de la plupart des générateurs de sites statiques, le langage natif d'outils comme Obsidian et
        Notion, et le format vers lequel les développeurs se tournent pour écrire des README, de la
        documentation et des notes techniques. Malgré son omniprésence, beaucoup d'écrivains et de
        développeurs n'apprennent que les bases — gras, italique et quelques niveaux de titres — et
        ratent les fonctionnalités qui rendent Markdown vraiment puissant pour l'écriture structurée.
      </p>
      <p>
        Vous pouvez écrire et prévisualiser du Markdown instantanément grâce à l'outil{" "}
        <a href="/tools/markdown-editor">Éditeur Markdown BrowseryTools</a> — gratuit, sans inscription,
        tout reste dans votre navigateur.
      </p>

      <h2>Qui a créé Markdown et pourquoi</h2>
      <p>
        Markdown a été créé par John Gruber, en collaboration avec Aaron Swartz, et publié en 2004. L'objectif
        déclaré de Gruber était de créer un format d'écriture en texte brut lisible tel quel — avant tout
        rendu — et qui se convertit proprement en HTML valide. Le nom est un jeu de mots sur « markup
        language » (HTML est HyperText Markup Language), inversant le concept : au lieu d'ajouter de la
        syntaxe pour contrôler la mise en forme, Markdown utilise les habitudes de ponctuation naturelles
        que les gens avaient déjà développées dans les e-mails en texte brut.
      </p>
      <p>
        La motivation était pratique. Le HTML est verbeux et distrayant à écrire en ligne. Une phrase comme{" "}
        <code> &lt;p&gt;This is &lt;strong&gt;important&lt;/strong&gt; text.&lt;/p&gt;</code> demande
        beaucoup plus d'effort mental que <code>This is **important** text.</code> Gruber voulait que les
        blogueurs et les écrivains se concentrent sur les mots, pas sur les balises. La spécification
        Markdown originale était un script Perl qui convertissait des fichiers Markdown en texte brut
        vers du HTML.
      </p>

      <h2>Syntaxe de base</h2>
      <p>
        La syntaxe Markdown de base couvre tout ce dont la plupart des écrivains ont besoin pour des
        documents structurés.
      </p>

      <h3>Titres</h3>
      <p>
        Utilisez des dièses pour créer des titres. Un dièse pour H1, deux pour H2, jusqu'à six pour H6.
        La plupart des guides de style recommandent un seul H1 par document (généralement le titre) et
        d'utiliser H2 à H4 pour la hiérarchie du contenu.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4`}
      </pre>

      <h3>Emphase et gras</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*italic* or _italic_
**bold** or __bold__
***bold and italic***
~~strikethrough~~`}
      </pre>

      <h3>Liens et images</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Link text](https://example.com)
[Link with title](https://example.com "Page title")
![Alt text](image.png)
![Alt text](image.png "Image title")`}
      </pre>

      <h3>Listes</h3>
      <p>
        Les listes non ordonnées utilisent des tirets, des astérisques ou des signes plus. Les listes
        ordonnées utilisent des chiffres suivis de points. Les éléments indentés (2 ou 4 espaces) créent
        des listes imbriquées.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Unordered item
- Another item
  - Nested item

1. First
2. Second
3. Third`}
      </pre>

      <h3>Code</h3>
      <p>
        Le code en ligne utilise des guillemets simples. Les blocs de code délimités utilisent des
        triples guillemets avec un identifiant de langue optionnel pour la coloration syntaxique.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Use \`console.log()\` for debugging.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Citations</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too.`}
      </pre>

      <h3>Règles horizontales</h3>
      <p>
        Trois tirets, astérisques ou underscores ou plus sur une ligne seule créent une règle horizontale.
        <code>---</code> est la convention la plus courante.
      </p>

      <h2>Syntaxe étendue</h2>
      <p>
        La spécification Markdown originale omettait plusieurs fonctionnalités dont les écrivains ont
        souvent besoin. La syntaxe étendue, prise en charge par la plupart des processeurs modernes,
        ajoute ces capacités.
      </p>

      <h3>Tableaux</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Column 1  | Column 2  | Column 3  |
|-----------|:---------:|----------:|
| Left      | Center    | Right     |
| aligned   | aligned   | aligned   |`}
      </pre>
      <p>
        La position des deux-points dans la ligne de séparation contrôle l'alignement : gauche (par
        défaut), centre (deux-points des deux côtés) ou droite (deux-points à droite).
      </p>

      <h3>Listes de tâches</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Write first draft
- [x] Peer review
- [ ] Final edits
- [ ] Publish`}
      </pre>

      <h3>Notes de bas de page</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Here is a claim that needs a citation.[^1]

[^1]: The supporting source or explanation goes here.`}
      </pre>

      <h2>Les variantes Markdown : CommonMark, GFM et MDX</h2>
      <p>
        La spécification Markdown originale présentait des ambiguïtés — des endroits où les processeurs
        prenaient des décisions différentes sur les cas limites. Cela a conduit à des implémentations
        incompatibles entre différents outils. Plusieurs efforts de standardisation ont émergé pour
        résoudre cela.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — une spécification rigoureuse qui résout chaque ambiguïté de la spec Markdown originale avec une suite de tests formelle. Adopté par Discourse, Reddit, Stack Overflow et bien d'autres. La variante la plus interopérable.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — l'extension de CommonMark par GitHub qui ajoute les tableaux, les listes de tâches, le barré, les liens automatiques et les URL littérales. Si vous écrivez des fichiers README ou des commentaires GitHub, vous utilisez GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown étendu avec le support des composants JSX, très utilisé dans les sites de documentation basés sur React (docs Next.js, Docusaurus, Astro). Permet d'importer et d'intégrer des composants React directement dans les fichiers Markdown.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — extensions riches en fonctionnalités pour l'écriture académique, avec prise en charge des citations, des équations mathématiques (LaTeX) et du formatage complexe des tableaux.
        </li>
      </ul>

      <h2>Où Markdown est utilisé</h2>
      <ul>
        <li><strong>GitHub et GitLab</strong> — les fichiers README, issues, pull requests, wikis et commentaires rendent tous le Markdown</li>
        <li><strong>Notion</strong> — prend en charge l'import/export Markdown et un sous-ensemble de raccourcis Markdown pour la mise en forme en ligne</li>
        <li><strong>Obsidian</strong> — une application de gestion des connaissances entièrement construite sur des fichiers Markdown avec des extensions de liens wiki</li>
        <li><strong>Générateurs de sites statiques</strong> — Jekyll, Hugo, Gatsby, Astro et Next.js utilisent tous Markdown ou MDX comme format de contenu par défaut</li>
        <li><strong>Plateformes de documentation</strong> — ReadTheDocs, GitBook et Docusaurus sont construits autour de Markdown</li>
        <li><strong>Plateformes de messagerie</strong> — Slack, Discord et Teams prennent en charge des sous-ensembles de Markdown pour le formatage des messages</li>
        <li><strong>Clients de messagerie</strong> — certains clients (Superhuman, HEY) prennent en charge la saisie Markdown</li>
      </ul>

      <h2>Markdown vs éditeurs de texte enrichi</h2>
      <p>
        Les éditeurs de texte enrichi (WYSIWYG — What You See Is What You Get) comme Google Docs,
        Microsoft Word ou l'éditeur intégré de Contentful affichent le résultat formaté pendant la
        saisie. Markdown affiche la source brute. Les compromis sont réels.
      </p>
      <ul>
        <li><strong>Avantages de Markdown</strong> — fichiers en texte brut, fonctionne dans n'importe quel éditeur, versionnable avec git, pas de dépendance fournisseur, workflow rapide clavier uniquement</li>
        <li><strong>Avantages du texte enrichi</strong> — immédiatement visuel, pas de syntaxe à apprendre, plus facile pour les contributeurs non techniques, meilleur pour les mises en forme complexes (notes de bas de page, commentaires, suivi des modifications)</li>
      </ul>
      <p>
        Pour l'écriture technique, la documentation développeur et la gestion personnelle des connaissances,
        la portabilité de Markdown et sa compatibilité avec le contrôle de version en font le meilleur
        choix. Pour les documents d'entreprise collaboratifs ou le contenu avec des exigences de mise en
        forme complexes, un éditeur de texte enrichi est souvent plus pratique.
      </p>

      <h2>Erreurs courantes en Markdown</h2>
      <ul>
        <li><strong>Lignes vides manquantes</strong> — la plupart des éléments de bloc (titres, listes, blocs de code) nécessitent une ligne vide avant et après pour être rendus correctement</li>
        <li><strong>Espaces après les dièses</strong> — <code>##Heading</code> sans espace après les dièses n'est pas un titre dans la plupart des processeurs</li>
        <li><strong>Marqueurs de liste incohérents</strong> — mélanger <code>-</code> et <code>*</code> dans la même liste peut produire des résultats inattendus dans certains processeurs</li>
        <li><strong>Oublier d'échapper les caractères spéciaux</strong> — les astérisques, underscores et guillemets dans le texte nécessitent un backslash d'échappement s'ils doivent s'afficher littéralement</li>
        <li><strong>Supposer que la syntaxe étendue est universelle</strong> — les tableaux et les listes de tâches sont des fonctionnalités GFM non prises en charge par tous les processeurs ; vérifiez votre environnement cible</li>
      </ul>
      <p>
        L'<a href="/tools/markdown-editor">Éditeur Markdown BrowseryTools</a> offre une prévisualisation
        en temps réel pour que vous puissiez détecter les problèmes de rendu immédiatement à l'écriture,
        sans copier le texte dans un autre outil. Collez votre Markdown et voyez la sortie HTML rendue
        côte à côte.
      </p>
    </div>
  );
}
