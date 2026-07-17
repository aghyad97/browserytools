import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Vous avez trouvé l'appel API dont vous avez besoin — mais il est écrit en cURL, et vous
        travaillez en JavaScript ou Python. Ou vous avez ouvert les DevTools de votre navigateur,
        effectué un clic droit sur une requête, et choisi &ldquo;Copier en tant que cURL&rdquo;,
        et vous vous retrouvez maintenant avec un mur d'options à transformer en vrai code.
        Traduire cURL à la main est fastidieux : chaque <code>-H</code>, <code>-d</code>,{" "}
        <code>-u</code> et <code>-X</code> doit correspondre au bon argument dans votre langage,
        et un seul en-tête manquant casse la requête.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        Le <a href="/tools/curl-converter">convertisseur cURL de BrowseryTools</a> le fait
        instantanément — collez une commande cURL et obtenez du code propre en JavaScript{" "}
        <code>fetch</code>, Python <code>requests</code>, Node.js, et plus encore, tout dans
        votre navigateur sans rien uploader. Ce guide présente la correspondance options-code
        pour que vous puissiez lire et valider le résultat.
      </p>

      <h2>Le flux de travail &ldquo;Copier en tant que cURL&rdquo;</h2>
      <p>
        Le moyen le plus rapide d'obtenir une requête fonctionnelle est de laisser le navigateur
        l'écrire pour vous. Ouvrez les DevTools (F12), allez dans l'onglet <strong>Réseau</strong>,
        effectuez l'action que vous voulez reproduire, puis cliquez droit sur la requête et
        choisissez <strong>Copier &rarr; Copier en tant que cURL</strong>. Vous disposez maintenant
        d'une commande cURL avec les en-têtes, cookies et corps exacts que le vrai site a envoyés.
        Collez-la dans le{" "}
        <a href="/tools/curl-converter">convertisseur</a> et vous obtenez la même requête sous
        forme de code à intégrer dans votre projet.
      </p>

      <h2>Comment les options cURL correspondent au code</h2>
      <p>
        Une fois que vous connaissez la poignée d'options qui comptent, vous pouvez lire n'importe
        quelle commande cURL d'un coup d'œil :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  the HTTP method
-H "Key: Value"  ->  a request header
-d '{...}'       ->  the request body (implies POST)
-u user:pass     ->  HTTP Basic auth
-F field=value   ->  multipart/form-data upload
-b "name=value"  ->  a cookie
-L               ->  follow redirects`}
      </pre>
      <p>
        Un en-tête comme <code>-H &quot;Authorization: Bearer abc123&quot;</code> devient une
        entrée dans l'objet <code>headers</code>. Un corps passé avec <code>-d</code> devient
        le corps de la requête, et si le type de contenu est JSON il est sérialisé en conséquence.
        <code>-u user:pass</code> devient un en-tête d'authentification Basic. Connaître cette
        correspondance vous permet de vérifier le code généré plutôt que de lui faire aveuglément confiance.
      </p>

      <h2>La même requête en trois langages</h2>
      <p>
        Prenons un POST authentifié simple. En cURL :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>En JavaScript <code>fetch</code> :</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>En Python <code>requests</code> :</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Remarquez comment l'argument <code>json=</code> de Python définit le corps <em>et</em>{" "}
        l'en-tête Content-Type automatiquement — une petite différence idiomatique que le
        convertisseur gère pour vous.
      </p>

      <h2>Pièges courants</h2>
      <p>
        <strong>Les guillemets et l'échappement.</strong> Les corps cURL sont entourés de guillemets
        simples dans le shell ; quand ils contiennent du JSON avec des guillemets doubles, la
        traduction manuelle est là où des bugs s'infiltrent. Laisser un convertisseur analyser
        cela élimine ce risque.
      </p>
      <p>
        <strong>Le POST implicite.</strong> Utiliser <code>-d</code> rend la requête POST même sans{" "}
        <code>-X POST</code>. Si vous ne traduisez que les options visibles, vous pourriez
        produire à tort un GET.
      </p>
      <p>
        <strong>Les secrets dans la commande.</strong> Une requête cURL copiée contient souvent
        des jetons et cookies actifs. Comme le convertisseur s'exécute entièrement dans votre
        navigateur, ces secrets ne sont jamais envoyés à un serveur — mais vous devriez quand même
        les supprimer avant de coller le code dans un dépôt partagé ou un ticket.
      </p>

      <h2>Questions fréquemment posées</h2>
      <p>
        <strong>Vers quels langages puis-je convertir ?</strong> JavaScript fetch, Python requests,
        Node.js, et d'autres cibles courantes.
      </p>
      <p>
        <strong>Le convertisseur envoie-t-il ma commande quelque part ?</strong> Non. L'analyse
        et la conversion se font localement dans votre navigateur, donc tous les jetons de la
        commande restent sur votre appareil.
      </p>
      <p>
        <strong>Puis-je coller un &ldquo;Copier en tant que cURL&rdquo; depuis les DevTools ?</strong>
        Oui — c'est l'un des meilleurs usages. Cela capture les en-têtes et le corps exacts
        d'une vraie requête.
      </p>
      <p>
        <strong>Est-ce gratuit ?</strong> Oui — sans compte, sans limite.
      </p>

      <h2>Convertir maintenant</h2>
      <p>
        Ouvrez le <a href="/tools/curl-converter">convertisseur cURL</a>, collez votre commande,
        et copiez le code équivalent. Pour une vue approfondie de la syntaxe cURL et des modèles
        REST, lisez notre{" "}
        <a href="/blog/curl-converter-guide">guide sur la conversion des requêtes API entre langages</a>,
        et pour comprendre les réponses que vous obtenez consultez le{" "}
        <a href="/blog/http-status-codes-guide">guide des codes de statut HTTP</a>.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
