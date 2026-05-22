export default function Content() {
  return (
    <div>
      <p>
        Les expressions régulières sont l'un de ces outils que les développeurs adorent ou évitent
        complètement. Elles semblent intimidantes — une chaîne dense de caractères spéciaux qui paraît
        défier toute lisibilité — mais le modèle sous-jacent est simple. Une fois que vous avez compris
        leur fonctionnement, une regex bien construite devient l'un des outils les plus puissants en une
        seule ligne de tout votre arsenal.
      </p>
      <p>
        Ce guide coupe court aux digressions. Plutôt que de cataloguer toutes les fonctionnalités des
        regex, il se concentre sur les 20 % de syntaxe qui couvrent 80 % des cas d'usage réels : classes
        de caractères, quantificateurs, ancres, groupes et drapeaux. Au fil du guide, vous pouvez tester
        chaque exemple dans le{" "}
        <a href="/tools/regex-tester">Testeur de regex BrowseryTools</a> — gratuit, sans inscription,
        tout reste dans votre navigateur.
      </p>

      <h2>Qu'est-ce qu'une expression régulière ?</h2>
      <p>
        Une expression régulière est un motif qui décrit un ensemble de chaînes de caractères. Quand vous
        appliquez une regex à un texte, vous demandez : « cette chaîne correspond-elle à mon motif ? » —
        ou plus concrètement : « trouvez toutes les sous-chaînes correspondant à mon motif ». Le motif
        lui-même est rédigé dans un mini-langage compact que la plupart des langages de programmation
        prennent en charge nativement.
      </p>
      <p>
        Les expressions régulières sont utiles chaque fois que vous devez valider une saisie (est-ce une
        adresse e-mail valide ?), extraire des données (extraire toutes les URL d'un bloc de texte),
        transformer du texte (remplacer toutes les occurrences d'un motif) ou diviser une chaîne sur un
        délimiteur complexe. Elles fonctionnent dans le navigateur, sur le serveur, dans le terminal —
        partout.
      </p>

      <h2>La syntaxe de base : les 20 % qui couvrent 80 % des cas</h2>

      <h3>Caractères littéraux et le point</h3>
      <p>
        La plupart des caractères dans une regex se correspondent à eux-mêmes. Le motif <code>hello</code>
        correspond littéralement à la chaîne « hello ». Le point <code>.</code> est le joker universel —
        il correspond à n'importe quel caractère unique sauf un saut de ligne. Ainsi <code>h.llo</code>
        correspond à « hello », « hallo », « hxllo », etc.
      </p>

      <h3>Classes de caractères</h3>
      <p>
        Les crochets définissent une classe de caractères — un ensemble de caractères dont n'importe
        lequel peut correspondre à cette position.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> — correspond à n'importe quelle voyelle</li>
        <li><strong><code>[a-z]</code></strong> — correspond à n'importe quelle lettre minuscule (syntaxe de plage)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> — correspond à n'importe quel caractère alphanumérique</li>
        <li><strong><code>[^0-9]</code></strong> — le <code>^</code> à l'intérieur des crochets nie la classe ; correspond à tout ce qui N'EST PAS un chiffre</li>
      </ul>
      <p>
        Les classes de raccourci couvrent les cas les plus courants : <code>\d</code> correspond à tout
        chiffre (identique à <code>[0-9]</code>), <code>\w</code> correspond à tout caractère de mot
        (lettres, chiffres, tiret bas) et <code>\s</code> correspond à tout espace blanc. Leurs inverses
        en majuscules — <code>\D</code>, <code>\W</code>, <code>\S</code> — correspondent à l'opposé.
      </p>

      <h3>Quantificateurs</h3>
      <p>
        Les quantificateurs contrôlent le nombre de fois que l'élément précédent doit apparaître.
      </p>
      <ul>
        <li><strong><code>*</code></strong> — zéro fois ou plus</li>
        <li><strong><code>+</code></strong> — une fois ou plus</li>
        <li><strong><code>?</code></strong> — zéro ou une fois (rend quelque chose optionnel)</li>
        <li><strong><code>{"{3}"}</code></strong> — exactement 3 fois</li>
        <li><strong><code>{"{2,5}"}</code></strong> — entre 2 et 5 fois (inclus)</li>
        <li><strong><code>{"{3,}"}</code></strong> — 3 fois ou plus</li>
      </ul>
      <p>
        Par défaut, les quantificateurs sont gourmands — ils correspondent autant que possible. Ajouter
        un <code>?</code> après le quantificateur le rend paresseux : <code>.*?</code> correspond le moins
        possible. Cette distinction est très importante lors de l'extraction de contenu entre délimiteurs.
      </p>

      <h3>Ancres</h3>
      <p>
        Les ancres ne correspondent pas à des caractères ; elles correspondent à des positions dans la
        chaîne.
      </p>
      <ul>
        <li><strong><code>^</code></strong> — le début de la chaîne (ou début d'une ligne en mode multiligne)</li>
        <li><strong><code>$</code></strong> — la fin de la chaîne (ou fin d'une ligne en mode multiligne)</li>
        <li><strong><code>\b</code></strong> — une limite de mot — la position entre un caractère de mot et un caractère qui n'en est pas un</li>
      </ul>
      <p>
        Les ancres sont essentielles pour la validation. Sans elles, le motif <code>\d+</code>
        correspondrait aux chiffres à l'intérieur de « abc123xyz ». Avec des ancres — <code>^\d+$</code>
        — il ne correspond qu'aux chaînes constituées entièrement de chiffres.
      </p>

      <h3>Groupes et alternation</h3>
      <p>
        Les parenthèses créent des groupes capturants. Elles servent deux objectifs : regrouper une
        sous-expression pour qu'un quantificateur s'applique au groupe entier, et capturer la sous-chaîne
        correspondante pour l'extraction.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Groupe avec quantificateur : correspond à une ou plusieurs répétitions de "ab"
/(ab)+/   →  correspond à "ab", "abab", "ababab"

// Alternation avec | : correspond à "cat" ou "dog"
/(cat|dog)/  →  correspond à "I have a cat" et "I have a dog"

// Groupe capturant nommé
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Les groupes non capturants — <code>(?:...)</code> — regroupent sans capturer, ce qui est plus
        propre quand vous n'avez besoin que du regroupement et pas d'extraire le texte correspondant.
      </p>

      <h2>Exemples pratiques</h2>

      <h3>Validation d'adresse e-mail</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Décomposition : <code>^</code> ancre au début. <code>[a-zA-Z0-9._%+-]+</code>{" "}
        correspond à la partie locale (un ou plusieurs caractères autorisés). <code>@</code> est un
        arobase littéral. <code>[a-zA-Z0-9.-]+</code> correspond au nom de domaine. <code>\.</code> est
        un point littéral (échappé, car le <code>.</code> non échappé signifie « tout caractère »).{" "}
        <code>[a-zA-Z]{"{2,}"}</code>{" "}
        correspond au TLD avec au moins 2 lettres. <code>$</code> ancre à la fin.
      </p>

      <h3>Numéro de téléphone (format américain)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        Cela correspond aux formats comme <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code> et <code>5558675309</code>. L'astuce clé est d'utiliser{" "}
        <code>?</code> pour rendre les séparateurs optionnels et de grouper l'indicatif régional avec
        des parenthèses optionnelles.
      </p>

      <h3>Extraction d'URL depuis un texte</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> correspond à « http » et « https » (le <code>s</code> est optionnel).{" "}
        <code>:\/\/</code> correspond au « :// » littéral avec les slashes échappés.{" "}
        <code>[^\s"'&lt;&gt;]+</code>{" "}
        correspond à tout ce qui n'est pas un espace ou des caractères terminant couramment une URL. Le
        drapeau <code>g</code> trouve toutes les correspondances, pas seulement la première.
      </p>

      <h2>Drapeaux de regex</h2>
      <p>
        Les drapeaux modifient la façon dont le motif entier est appliqué.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> — trouver toutes les correspondances, pas seulement la première</li>
        <li><strong><code>i</code> (insensible à la casse)</strong> — traiter les majuscules et les minuscules comme équivalentes ; <code>/hello/i</code> correspond à « Hello », « HELLO » et « hello »</li>
        <li><strong><code>m</code> (multiligne)</strong> — fait que <code>^</code> et <code>$</code> correspondent au début/fin de chaque ligne plutôt qu'à la chaîne entière</li>
        <li><strong><code>s</code> (dotAll)</strong> — fait que <code>.</code> correspond aussi aux sauts de ligne, utile pour correspondre sur plusieurs lignes</li>
      </ul>
      <p>
        En JavaScript, les drapeaux se placent après le slash fermant : <code>/motif/gi</code>. En Python,
        ils sont passés comme second argument : <code>re.findall(motif, texte, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs Python : différences clés</h2>
      <p>
        La syntaxe des regex est largement la même entre JavaScript et Python, mais il y a quelques
        différences importantes.
      </p>
      <ul>
        <li><strong>Groupes nommés</strong> : JavaScript utilise <code>(?&lt;name&gt;...)</code>, Python utilise la même chose. Les deux retournent des groupes nommés mais y accèdent différemment — <code>match.groups.name</code> en JS, <code>match.group('name')</code> en Python.</li>
        <li><strong>Lookahead / lookbehind</strong> : Les deux supportent <code>(?=...)</code> (lookahead positif) et <code>(?!...)</code> (lookahead négatif). Python supporte aussi les lookbehinds à longueur variable ; les anciens moteurs JavaScript ne le font pas.</li>
        <li><strong>Unicode</strong> : JavaScript nécessite le drapeau <code>u</code> pour gérer les séquences d'échappement de propriétés Unicode comme <code>\p{"{Letter}"}</code>. Le module <code>re</code> de Python gère l'Unicode par défaut.</li>
        <li><strong>Chaînes brutes</strong> : En Python, utilisez toujours des chaînes brutes (<code>r"\d+"</code>) pour éviter le double-échappement des barres obliques inverses. En JavaScript, utilisez soit la syntaxe littérale <code>/\d+/</code> soit la chaîne <code>"\\d+"</code> lors de la construction avec <code>new RegExp()</code>.</li>
      </ul>

      <h2>Erreurs courantes avec les regex</h2>
      <ul>
        <li><strong>Backtracking catastrophique</strong> — des motifs comme <code>(a+)+</code> sur une chaîne qui ne correspond pas peuvent provoquer un backtracking exponentiel, bloquant le moteur. Évitez les quantificateurs imbriqués sur des motifs qui se chevauchent.</li>
        <li><strong>Oublier d'échapper le point</strong> — <code>3.14</code> comme motif correspond à « 3X14 » car <code>.</code> est un joker. Utilisez <code>3\.14</code> pour correspondre au point littéral.</li>
        <li><strong>Ne pas ancrer les motifs de validation</strong> — sans <code>^</code> et <code>$</code>, un motif censé valider la chaîne entière correspondra à toute chaîne contenant le motif en sous-chaîne.</li>
        <li><strong>Utiliser les regex pour analyser du HTML</strong> — les regex ne peuvent pas gérer des structures arbitrairement imbriquées. Utilisez un véritable analyseur HTML (DOMParser dans le navigateur, BeautifulSoup en Python) pour le HTML.</li>
      </ul>

      <h2>Testez vos motifs en toute sécurité dans le navigateur</h2>
      <p>
        Écrire des regex dans un éditeur sans boucle de retour est pénible. Vous écrivez un motif, lancez
        votre code, voyez qu'il échoue, ajustez le motif, relancez. Un testeur de regex en temps réel
        court-circuite cette boucle — vous voyez les correspondances surlignées en temps réel pendant
        que vous tapez.
      </p>
      <p>
        Le{" "}
        <a href="/tools/regex-tester">Testeur de regex BrowseryTools</a> vous permet d'écrire un motif,
        de coller des chaînes de test et de voir toutes les correspondances surlignées instantanément. Il
        s'exécute entièrement dans votre navigateur, vous pouvez donc tester avec des données réelles —
        journaux, saisies utilisateurs, chaînes de production — sans rien envoyer à un serveur.
      </p>

      <h2>Résumé</h2>
      <p>
        Les expressions régulières récompensent le temps que vous investissez à les apprendre. Le
        vocabulaire de base — classes de caractères, quantificateurs, ancres, groupes et drapeaux — est
        petit. Les motifs que vous pouvez construire à partir de lui sont vastes. Commencez par les
        exemples de ce guide, testez-les sur vos propres chaînes, et la syntaxe deviendra intuitive
        plus vite que vous ne le pensez.
      </p>
    </div>
  );
}
