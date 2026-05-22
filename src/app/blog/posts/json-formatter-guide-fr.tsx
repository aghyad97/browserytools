export default function Content() {
  return (
    <div>
      <p>
        JSON est partout. Il alimente les API REST, les fichiers de configuration, les sorties de bases
        de données, les payloads de webhooks et les agrégateurs de journaux. Vous le rencontrez des
        dizaines de fois par jour que vous construisiez un service backend, déboguiez une application
        frontend ou lisiez de la documentation. Comprendre JSON en profondeur — pas seulement comment
        l'analyser, mais comment le lire, le valider et le déboguer — est l'une des compétences à plus
        fort levier qu'un développeur puisse avoir.
      </p>
      <p>
        Ce guide couvre tout, des fondamentaux de la syntaxe JSON au débogage des erreurs d'analyse
        courantes, en passant par les stratégies de formatage et le travail avec des structures
        profondément imbriquées. Collez n'importe quel JSON dans le{" "}
        <a href="/tools/json-formatter">Formateur JSON BrowseryTools</a> pour le valider et le mettre
        en forme instantanément — gratuit, sans inscription, tout reste dans votre navigateur.
      </p>

      <h2>Pourquoi JSON a gagné (et XML a perdu)</h2>
      <p>
        Avant que JSON ne devienne le format d'échange de données par défaut, XML était la norme. Les
        API SOAP, les flux RSS et les fichiers de configuration utilisaient tous XML. JSON a émergé comme
        une alternative plus simple et a progressivement pris le dessus pour la plupart des cas d'usage.
        Les raisons sont simples :
      </p>
      <ul>
        <li><strong>Moins verbeux</strong> — JSON ne nécessite pas de balises fermantes. Les mêmes données se représentent en 30 à 50 % moins de caractères.</li>
        <li><strong>Natif à JavaScript</strong> — JSON signifie JavaScript Object Notation. Il se mappe directement sur les objets et tableaux JavaScript, rendant triviale l'analyse et la sérialisation dans le navigateur.</li>
        <li><strong>Lisible par les humains</strong> — un payload JSON correctement formaté est plus facile à lire que l'équivalent XML avec ses chevrons et déclarations d'espaces de noms.</li>
        <li><strong>Largement pris en charge</strong> — chaque langage majeur dispose d'un analyseur JSON intégré. Il n'est pas nécessaire d'installer une bibliothèque juste pour désérialiser une réponse API.</li>
      </ul>
      <p>
        XML a encore des cas d'usage légitimes — formats de documents (DOCX, SVG), configurations
        nécessitant des commentaires (que JSON ne prend pas en charge) et protocoles comme SOAP où il
        est requis. Mais pour la communication API et le stockage de données, JSON est le grand gagnant
        incontesté.
      </p>

      <h2>Règles de syntaxe JSON</h2>
      <p>
        JSON a une syntaxe petite et stricte. Voici les règles qui surprennent le plus les développeurs :
      </p>
      <ul>
        <li><strong>Les clés doivent être des chaînes entre guillemets doubles</strong> — <code>{"{"}"name": "Alice"{"}"}</code> est valide ; <code>{"{"}name: "Alice"{"}"}</code> ne l'est pas. Contrairement aux littéraux d'objets JavaScript, JSON n'autorise pas les clés sans guillemets.</li>
        <li><strong>Pas de virgules finales</strong> — <code>[1, 2, 3,]</code> est du JSON invalide. La virgule finale après le dernier élément est acceptée par JavaScript et de nombreux analyseurs, mais elle ne fait pas partie de la spécification JSON.</li>
        <li><strong>Pas de commentaires</strong> — JSON n'a pas de syntaxe de commentaire. Cela surprend les développeurs qui souhaitent annoter des fichiers de configuration. Si vous avez besoin de commentaires dans un fichier de configuration, envisagez JSONC (JSON with Comments) ou YAML à la place.</li>
        <li><strong>Les chaînes n'utilisent que des guillemets doubles</strong> — les chaînes entre guillemets simples comme <code>'hello'</code> ne sont pas du JSON valide.</li>
        <li><strong>Les nombres ne peuvent pas avoir de zéros initiaux</strong> — <code>007</code> est invalide ; utilisez <code>7</code> à la place.</li>
        <li><strong>Seulement six types de valeurs</strong> — chaînes, nombres, booléens (<code>true</code> / <code>false</code>), null, objets et tableaux. Pas de dates, pas de fonctions, pas d'undefined.</li>
      </ul>

      <h2>Erreurs JSON courantes et leur signification</h2>
      <p>
        Les erreurs d'analyse JSON peuvent être cryptiques. Voici les plus courantes et comment les
        corriger.
      </p>

      <h3>Token inattendu</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Erreur : Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Les guillemets simples ne sont pas du JSON valide. Remplacez-les par des guillemets doubles :{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Token } / ] inattendu"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Erreur : Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Une virgule finale avant le crochet fermant. Supprimez la virgule après le dernier élément.
        C'est l'erreur JSON la plus courante pour les développeurs venant de JavaScript, où les virgules
        finales sont tout à fait valides.
      </p>

      <h3>Fin inattendue de l'entrée JSON</h3>
      <p>
        Cela signifie que le JSON est tronqué — la chaîne se termine avant que tous les objets et
        tableaux ouverts ne soient fermés. Comptez vos accolades et crochets d'ouverture et de fermeture.
        Ils doivent correspondre.
      </p>

      <h3>Les noms de propriétés doivent être des chaînes</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Invalide — clé sans guillemets
{ name: "Alice" }

// Valide
{ "name": "Alice" }`}
      </pre>

      <h2>Mise en forme vs minification</h2>
      <p>
        JSON peut être représenté de deux façons : mis en forme (avec indentation et sauts de ligne) ou
        minifié (tout l'espace blanc supprimé). Le choix dépend du contexte.
      </p>
      <p>
        <strong>Mettez en forme</strong> quand vous lisez, déboguez, révisez ou stockez du JSON dans
        le contrôle de version. Le JSON indenté est immédiatement lisible et produit des diffs propres
        dans Git car chaque valeur est sur sa propre ligne.
      </p>
      <p>
        <strong>Minifiez</strong> quand vous transmettez du JSON sur un réseau. Les espaces blancs sont
        une pure surcharge dans les réponses HTTP. Un payload JSON de 100 Ko mis en forme peut se
        comprimer à 60 Ko une fois minifié, puis à 15 Ko supplémentaires avec gzip. La plupart des API
        servent du JSON minifié sur le réseau et laissent le client le mettre en forme selon ses besoins.
      </p>
      <p>
        En JavaScript : <code>JSON.stringify(data, null, 2)</code> met en forme avec 2 espaces
        d'indentation. <code>JSON.stringify(data)</code> minifie. Le{" "}
        <a href="/tools/json-formatter">Formateur JSON BrowseryTools</a> fait les deux — collez votre
        JSON et basculez entre les vues mises en forme et minifiées instantanément.
      </p>

      <h2>Naviguer dans un JSON profondément imbriqué</h2>
      <p>
        Les réponses d'API réelles sont souvent profondément imbriquées. Un payload de webhook Stripe,
        une réponse de l'API GitHub ou une configuration Kubernetes peuvent avoir des objets à cinq ou
        six niveaux de profondeur. Voici des stratégies pour les gérer :
      </p>

      <h3>Utiliser le chaînage optionnel en JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Sans chaînage optionnel — plante si un niveau est undefined
const city = user.address.location.city;

// Avec chaînage optionnel — retourne undefined au lieu de lever une exception
const city = user?.address?.location?.city;

// Avec l'opérateur nullish coalescing pour une valeur par défaut
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Utiliser jq pour les requêtes JSON en ligne de commande</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Mettre en forme toute la réponse
curl https://api.example.com/users | jq .

# Extraire un champ spécifique
curl https://api.example.com/users | jq '.[0].email'

# Filtrer un tableau
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON dans les API vs les fichiers de configuration</h2>
      <p>
        JSON remplit deux rôles très différents selon le contexte, et les bonnes pratiques diffèrent
        entre eux.
      </p>
      <p>
        Dans les <strong>réponses d'API</strong>, JSON est généré par du code et consommé par du code.
        Vous l'écrivez rarement à la main. La priorité est la correction et la cohérence — utilisez une
        bibliothèque de sérialisation et laissez-la gérer l'échappement. Minifiez pour la production,
        incluez un en-tête Content-Type <code>application/json</code> et versionnez votre API pour que
        les changements de structure JSON ne soient pas des ruptures.
      </p>
      <p>
        Dans les <strong>fichiers de configuration</strong> (package.json, tsconfig.json, .eslintrc.json),
        JSON est écrit par des humains. La lisibilité compte davantage ici. Utilisez 2 espaces
        d'indentation, gardez la structure aussi peu profonde que possible, et ajoutez des commentaires
        avec un analyseur compatible JSONC si votre outillage le prend en charge. Ne minifiez jamais les
        fichiers de configuration qui vivent dans le contrôle de version.
      </p>

      <h2>Validation par schéma JSON</h2>
      <p>
        JSON Schema est une spécification pour définir la structure, les types et les contraintes d'un
        document JSON. Elle vous permet de valider qu'un payload JSON est conforme à une forme attendue
        avant d'essayer de l'utiliser.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 }
  },
  "additionalProperties": false
}`}
      </pre>
      <p>
        Des bibliothèques comme <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python) et{" "}
        <code>JSON.NET Schema</code> (.NET) peuvent valider un document JSON par rapport à un schéma à
        l'exécution — détectant les payloads malformés à la frontière de l'API avant qu'ils ne causent
        des erreurs inattendues plus profondément dans l'application.
      </p>

      <h2>Résumé</h2>
      <p>
        La simplicité de JSON est sa plus grande force. Six types de valeurs, des règles de guillemets
        strictes, pas de commentaires, pas de virgules finales — les contraintes sont petites et le
        format est sans ambiguïté. Quand quelque chose tourne mal, c'est presque toujours l'une d'une
        poignée d'erreurs de syntaxe prévisibles. Collez votre JSON cassé dans le{" "}
        <a href="/tools/json-formatter">Formateur JSON BrowseryTools</a> et l'erreur sera immédiatement
        visible avec la position exacte surlignée.
      </p>
    </div>
  );
}
