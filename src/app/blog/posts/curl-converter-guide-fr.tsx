export default function Content() {
  return (
    <div>
      <p>
        Chaque API a une documentation. Presque universellement, cette documentation inclut des exemples
        de code en cURL — le client HTTP en ligne de commande fourni avec chaque système de type Unix et
        lingua franca de la documentation API depuis des décennies. Le problème est que vous n'écrivez
        pas des scripts shell. Vous écrivez du JavaScript, Python, Go ou Ruby, et vous devez traduire
        cette commande cURL en code fonctionnel avant de pouvoir l'utiliser.
      </p>
      <p>
        Cette traduction est fastidieuse et sujette aux erreurs. Les en-têtes, les schémas
        d'authentification, les corps de requête et l'encodage d'URL doivent tous être mappés aux bons
        appels de méthode dans le bon langage. Le{" "}
        <a href="/tools/curl-converter">Convertisseur cURL BrowseryTools</a> fait cela automatiquement —
        collez une commande cURL et obtenez le code équivalent en JavaScript fetch, Python requests,
        Node.js axios et plus encore. Gratuit, sans inscription, tout reste dans votre navigateur.
      </p>

      <h2>Qu'est-ce que cURL ?</h2>
      <p>
        cURL (Client URL) est un outil en ligne de commande pour transférer des données via des URL. Il
        prend en charge HTTP, HTTPS, FTP, WebSockets et des dizaines d'autres protocoles. Pour les
        développeurs, il est le plus couramment utilisé pour effectuer des requêtes HTTP depuis le
        terminal — tester un point de terminaison d'API, télécharger un fichier ou déboguer une
        authentification.
      </p>
      <p>
        cURL est installé par défaut sur macOS et la plupart des distributions Linux. Sous Windows, il
        est intégré au système d'exploitation depuis Windows 10. Cette omniprésence est exactement
        pourquoi les équipes de documentation API se tournent par défaut vers cURL pour les exemples —
        elles peuvent être certaines que n'importe quel développeur lisant la documentation peut
        exécuter l'exemple immédiatement, sans rien installer.
      </p>

      <h2>Anatomie d'une commande cURL</h2>
      <p>
        Une commande cURL est construite à partir d'une URL de base et d'un ensemble de drapeaux. Voici
        un exemple complet couvrant les drapeaux les plus importants :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Décomposition de chaque drapeau :
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — définit la méthode HTTP. Les valeurs valides sont GET, POST, PUT, PATCH, DELETE, etc. Si omis et que <code>-d</code> est présent, cURL passe par défaut à POST.</li>
        <li><strong><code>-H "En-tête: Valeur"</code></strong> — ajoute un en-tête de requête. Peut être répété plusieurs fois pour plusieurs en-têtes.</li>
        <li><strong><code>-d '...'</code></strong> — le corps de la requête. Pour JSON, combinez avec <code>-H "Content-Type: application/json"</code>. cURL encode le corps en URL par défaut sauf si vous utilisez <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — envoie le corps exactement tel quel sans encodage URL. Requis quand le corps contient des caractères comme <code>@</code> que <code>-d</code> interpréterait spécialement.</li>
        <li><strong><code>-u identifiant:motdepasse</code></strong> — raccourci d'authentification basique. cURL l'encode en un en-tête Authorization Base64 pour vous.</li>
        <li><strong><code>-s</code></strong> — mode silencieux ; supprime la barre de progression. Presque toujours utilisé dans les scripts.</li>
        <li><strong><code>-v</code></strong> — mode verbose ; affiche les en-têtes de requête et de réponse. Inestimable pour déboguer les échecs d'authentification.</li>
        <li><strong><code>-o nomdefichier</code></strong> — écrit la sortie dans un fichier plutôt que dans stdout.</li>
      </ul>

      <h2>Modèles cURL courants pour les API REST</h2>

      <h3>Requête GET avec paramètres de requête</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Les paramètres de requête vont directement dans l'URL. Mettez l'URL entière entre guillemets pour
        éviter que le shell n'interprète le <code>&amp;</code> comme un opérateur d'arrière-plan.
      </p>

      <h3>POST avec corps JSON</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Envoi de fichier (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        Le drapeau <code>-F</code> envoie des données multipart/form-data. Le préfixe <code>@</code>
        signifie « lire depuis le fichier ». C'est le format utilisé pour les téléversements d'images,
        les API de traitement de documents et tout point de terminaison acceptant des données binaires.
      </p>

      <h2>Conversion de cURL en JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// cURL d'origine :
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Conversion de cURL en Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        Le paramètre <code>json=</code> de la bibliothèque <code>requests</code> gère à la fois la
        sérialisation et la définition automatique de l'en-tête <code>Content-Type: application/json</code>
        — pas besoin de le définir manuellement.
      </p>

      <h2>Conversion de cURL en Node.js avec axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>Comment fonctionne « Copier en tant que cURL » dans les DevTools du navigateur</h2>
      <p>
        L'une des fonctionnalités les plus utiles dans les DevTools du navigateur est « Copier en tant
        que cURL ». Dans Chrome, Firefox ou Safari : ouvrez les DevTools, allez dans l'onglet Réseau,
        effectuez une requête (connectez-vous, cliquez sur un bouton, chargez une page), faites un clic
        droit sur la requête dans la liste réseau et sélectionnez « Copier en tant que cURL ».
      </p>
      <p>
        Le navigateur génère une commande cURL complète qui inclut chaque en-tête envoyé par le
        navigateur — y compris les cookies, les tokens de session, les tokens CSRF et tout autre matériel
        d'authentification. Cela signifie que vous pouvez rejouer la requête exacte que le navigateur a
        faite, avec tout son contexte d'authentification, depuis le terminal ou depuis du code.
      </p>
      <p>
        C'est inestimable pour le débogage : si la requête du navigateur fonctionne mais que la requête
        de votre code échoue, collez les deux dans un outil de diff et trouvez la différence d'en-tête
        ou de corps. Vous pouvez aussi coller le cURL copié directement dans le{" "}
        <a href="/tools/curl-converter">Convertisseur cURL BrowseryTools</a> pour obtenir le code
        équivalent dans votre langage préféré — le convertisseur gère automatiquement tout l'échappement,
        les guillemets et la traduction des drapeaux.
      </p>

      <h2>Résumé</h2>
      <p>
        cURL est le langage universel de HTTP. Les docs API l'utilisent parce que tout le monde peut
        l'exécuter. Les DevTools le copient parce qu'il capture chaque détail d'une requête. Apprendre
        à lire cURL couramment — et à le traduire précisément dans le langage dans lequel vous travaillez
        — est une compétence pratique qui porte ses fruits chaque fois que vous intégrez une nouvelle
        API. Passez-vous de la traduction manuelle fastidieuse et utilisez le{" "}
        <a href="/tools/curl-converter">Convertisseur cURL BrowseryTools</a> pour obtenir du code
        propre et fonctionnel en quelques secondes.
      </p>
    </div>
  );
}
