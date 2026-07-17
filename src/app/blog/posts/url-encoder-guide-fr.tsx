import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Les URL semblent simples de l'extérieur — une chaîne de texte pointant vers une ressource. Mais sous
        le capot, elles suivent une grammaire stricte qui n'autorise qu'un ensemble précis de caractères. Dès
        que vous tentez d'insérer un espace, une esperluette ou un caractère non-ASCII dans une URL sans
        l'encoder, les choses se brisent d'une façon difficile à déboguer. L'encodage pourcent (communément
        appelé encodage URL) est le mécanisme qui permet d'intégrer des données arbitraires de façon sûre
        dans une URL.
      </p>
      <ToolCTA slug="url-encoder" variant="inline" />
      <p>
        Vous pouvez encoder et décoder des URL instantanément avec l'outil{" "}
        <a href="/tools/url-encoder">Encodeur/Décodeur d'URL BrowseryTools</a> — gratuit, sans inscription,
        tout reste dans votre navigateur.
      </p>

      <h2>Pourquoi les caractères spéciaux cassent les URL</h2>
      <p>
        La spécification URL (RFC 3986) réserve certains caractères à des fins structurelles. Le{" "}
        <code>?</code>{" "}
        sépare le chemin de la chaîne de requête. Le <code>&amp;</code> sépare les paramètres de requête
        entre eux. Le <code>#</code> marque un identifiant de fragment. Le <code>/</code> sépare les
        segments de chemin. Si vos données contiennent l'un de ces caractères, un analyseur d'URL ne peut
        pas distinguer vos données de la structure de l'URL elle-même.
      </p>
      <p>
        Considérons une recherche pour <code>rock &amp; roll</code>. En construisant naïvement l'URL :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── looks like a new parameter begins here
          └── this & splits q from a phantom second parameter`}
      </pre>
      <p>
        L'analyseur lit <code>q=rock </code> (avec un espace en fin) comme premier paramètre, puis
        rencontre ce qui ressemble au début d'un second paramètre nommé <code> roll</code>. Les deux
        valeurs sont incorrectes. L'URL correcte est <code>/search?q=rock%20%26%20roll</code> — l'espace
        devient <code>%20</code> et l'esperluette devient <code>%26</code>.
      </p>

      <h2>Ce que fait réellement l'encodage pourcent</h2>
      <p>
        L'encodage pourcent convertit un octet en une séquence de trois caractères : un signe pourcent
        littéral suivi de deux chiffres hexadécimaux majuscules représentant la valeur de l'octet.
        Le caractère espace (octet ASCII 32, hex <code>0x20</code>) devient <code>%20</code>. Le signe
        arobase (<code>@</code>, ASCII 64, hex{" "}
        <code>0x40</code>) devient <code>%40</code>. La règle est :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`percent-encode(byte) = "%" + byte.toString(16).toUpperCase().padStart(2, "0")

Examples:
  space  (0x20) → %20
  @      (0x40) → %40
  [      (0x5B) → %5B
  €      (UTF-8: 0xE2 0x82 0xAC) → %E2%82%AC`}
      </pre>
      <p>
        Pour les caractères Unicode multi-octets (tout ce qui est hors ASCII), le caractère est d'abord
        encodé en octets UTF-8, puis chaque octet est encodé en pourcent. Le signe euro <code>€</code>{" "}
        est composé de trois octets UTF-8, il devient donc trois séquences encodées en pourcent :{" "}
        <code>%E2%82%AC</code>.
      </p>

      <h2>Caractères sûrs vs caractères réservés</h2>
      <p>
        Tous les caractères n'ont pas besoin d'être encodés. La RFC 3986 définit deux ensembles
        utilisables tels quels :
      </p>
      <ul>
        <li><strong>Caractères non réservés</strong> — A–Z, a–z, 0–9, tiret, underscore, point, tilde. Ces caractères n'ont aucune signification spéciale et n'ont jamais besoin d'être encodés.</li>
        <li><strong>Caractères réservés</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. Ils sont sûrs dans leurs positions structurelles, mais doivent être encodés lorsqu'ils apparaissent en tant que valeurs de données.</li>
      </ul>
      <p>
        Tout le reste — espaces, Unicode, caractères de contrôle, la plupart des signes de ponctuation — doit toujours être encodé.
      </p>

      <h2>encodeURI vs encodeURIComponent : la différence critique</h2>
      <p>
        JavaScript propose deux fonctions d'encodage intégrées, et les confondre est l'un des bugs
        d'encodage URL les plus courants dans les applications web.
      </p>
      <p>
        <code>encodeURI()</code> est conçu pour encoder une URL complète. Il laisse tous les caractères
        réservés intacts car ils ont une signification structurelle dans une URL complète. À utiliser si
        vous avez une URL complète qui pourrait contenir des espaces ou de l'Unicode mais qui a une
        structure valide :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> est conçu pour encoder une valeur individuelle — la valeur
        d'un paramètre de requête, un segment de chemin, tout ce qui doit être traité comme une donnée
        brute. Il encode également les caractères réservés, dont <code>&amp;</code>, <code>=</code>,{" "}
        <code>?</code> et <code>/</code> :
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURIComponent("rock & roll")
// → "rock%20%26%20roll"
//   ✓ & encoded — safe to use as a query parameter value

encodeURIComponent("https://example.com/page")
// → "https%3A%2F%2Fexample.com%2Fpage"
//   ✓ colons and slashes encoded — safe as a redirect_uri value`}
      </pre>
      <p>
        La règle à retenir : lors de la construction d'une URL, utilisez <code>encodeURIComponent()</code>{" "}
        sur chaque valeur de paramètre individuelle, jamais sur l'URL complète. N'utilisez{" "}
        <code>encodeURI()</code> que sur une URL complète à normaliser. Dans le code moderne, préférez
        les API <code>URL</code> et <code>URLSearchParams</code> à l'encodage manuel — elles gèrent
        l'encodage automatiquement et correctement.
      </p>

      <h2>Pièges de l'encodage de chaîne de requête</h2>
      <p>
        Plusieurs bugs subtils reviennent régulièrement lors de l'encodage de chaînes de requête. Le signe{" "}
        <code>+</code> mérite une attention particulière : dans le format{" "}
        <code>application/x-www-form-urlencoded</code> (le format utilisé par les formulaires HTML), un
        espace est encodé en <code>+</code> plutôt qu'en <code>%20</code>. Il s'agit d'une convention
        héritée qui précède la RFC 3986. Si votre backend décode selon les règles d'encodage de formulaire
        et que votre frontend envoie <code>%20</code>, cela fonctionne. Mais si le frontend envoie{" "}
        <code>+</code> et que votre backend décode selon les règles RFC 3986, le <code>+</code> est
        conservé comme signe plus littéral — pas comme un espace.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// URLSearchParams uses application/x-www-form-urlencoded (+ for spaces)
new URLSearchParams({ q: "rock & roll" }).toString()
// → "q=rock+%26+roll"

// encodeURIComponent uses RFC 3986 (%20 for spaces)
"q=" + encodeURIComponent("rock & roll")
// → "q=rock%20%26%20roll"

// Both are valid — just be consistent on both ends`}
      </pre>

      <h2>Comment les données de formulaire sont encodées en URL</h2>
      <p>
        Lorsqu'un formulaire HTML est soumis avec <code>method="GET"</code>, le navigateur sérialise les
        champs du formulaire en une chaîne de requête utilisant{" "}
        <code>application/x-www-form-urlencoded</code>. Chaque nom et valeur de champ est encodé
        (espaces en <code>+</code>, caractères spéciaux en <code>%XX</code>), et les champs sont joints
        par <code>&amp;</code>. Pour les formulaires <code>method="POST"</code> sans attribut{" "}
        <code>enctype</code>, le même encodage est utilisé mais les données sont envoyées dans le corps
        de la requête plutôt que dans l'URL.
      </p>
      <p>
        C'est également le format utilisé par <code>fetch()</code> lorsqu'on lui passe un objet{" "}
        <code>URLSearchParams</code> comme corps, et c'est ce que la plupart des frameworks côté serveur
        décodent automatiquement lors de la lecture des soumissions de formulaires.
      </p>

      <h2>Base64 dans les URL</h2>
      <p>
        Le Base64 standard utilise <code>+</code> et <code>/</code> — deux caractères ayant une
        signification spéciale dans les URL. Lorsque des données encodées en Base64 doivent apparaître
        dans une URL (cas courant pour les jetons, les données d'image ou les signatures
        cryptographiques), utilisez plutôt la variante Base64URL. Elle remplace <code>+</code> par{" "}
        <code>-</code> et <code>/</code> par <code>_</code>, produisant une chaîne sûre dans n'importe
        quelle position d'une URL sans encodage supplémentaire. Les JWT utilisent ce format pour leurs
        segments d'en-tête et de charge utile.
      </p>

      <h2>Bugs d'encodage courants en production</h2>
      <p>
        Quelques patterns de bugs qui reviennent fréquemment dans les applications en production :
      </p>
      <ul>
        <li><strong>Double encodage</strong> — encoder une URL déjà encodée. <code>%20</code> devient <code>%2520</code> car <code>%</code> lui-même est encodé en <code>%25</code>. Vérifiez toujours si une valeur est déjà encodée avant de l'encoder à nouveau.</li>
        <li><strong>Oubli d'encodeURIComponent sur redirect_uri</strong> — les flux OAuth passent un <code>redirect_uri</code> en tant que paramètre de requête. S'il contient un <code>?</code> ou un <code>&amp;</code> non encodé, le serveur d'autorisation analyse ces caractères comme faisant partie de la structure de l'URL externe, ce qui casse la redirection.</li>
        <li><strong>Encodage non UTF-8</strong> — les systèmes anciens ou mal configurés encodent parfois en ISO-8859-1 au lieu d'UTF-8. La séquence d'octets pour <code>é</code> diffère entre les deux. Imposez UTF-8 de manière cohérente des deux côtés.</li>
        <li><strong>Journalisation d'URL brutes</strong> — journaliser une URL contenant des données utilisateur encodées peut produire des journaux trompeurs si votre outil de visualisation décode automatiquement les séquences pourcent, masquant ce qui a réellement été envoyé sur le réseau.</li>
      </ul>

      <h2>Encodez et décodez des URL instantanément</h2>
      <p>
        Que vous déboguiez une redirection OAuth, construisiez une chaîne de requête à la main, inspectiez
        une requête API malformée ou essayiez simplement de comprendre ce que contient réellement une URL
        encodée en pourcent — l'outil{" "}
        <a href="/tools/url-encoder">Encodeur/Décodeur d'URL BrowseryTools</a> le fait instantanément.
        Collez votre chaîne, choisissez encoder ou décoder, et voyez le résultat immédiatement. Aucun
        appel serveur, sans inscription.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Encodeur / Décodeur d'URL gratuit — 100 % dans votre navigateur
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Ouvrir l'encodeur d'URL →
        </a>
      </div>
      <ToolCTA slug="url-encoder" variant="card" />
    </div>
  );
}
