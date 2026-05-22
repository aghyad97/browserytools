import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Chaque développeur accumule une liste mentale de sites de référence pour les tâches rapides : décoder cette chaîne Base64, valider ce bloc JSON, vérifier ce que contient réellement ce JWT. Le problème, c&apos;est que cette liste comprend généralement une douzaine de sites différents — chacun avec ses propres bannières de cookies, ses invites d&apos;inscription et ses questions de confidentialité.
      </p>

      <p>
        <strong>BrowseryTools</strong> regroupe les utilitaires de développement les plus essentiels dans une suite unique, rapide et axée sur la confidentialité. Tout s&apos;exécute localement dans votre navigateur. Aucun téléversement. Aucune clé d&apos;API. Aucune limite de débit. Ce guide passe en revue chaque outil et vous montre exactement quand et pourquoi vous y feriez appel.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Pourquoi les outils de navigateur surpassent les paquets npm et les API cloud :</strong> installer un paquet npm prend du temps, alourdit votre arbre de dépendances, exige que Node.js soit disponible, et peut comporter des vulnérabilités de sécurité dans sa chaîne de dépendances. Les API cloud exigent une authentification, ont des limites de débit et introduisent de la latence. Un outil de navigateur est instantané, sans dépendance, et fonctionne de la même façon sur chaque machine.
      </div>

      <h2>Formateur &amp; validateur JSON</h2>

      <p>
        JSON est la lingua franca des API modernes. Quand vous fixez un bloc minifié de 3 Ko renvoyé par un point de terminaison, le <Link href="/tools/json-formatter">formateur JSON</Link> le rend instantanément lisible.
      </p>

      <h3>Ce qu&apos;il fait</h3>
      <ul>
        <li><strong>Formater &amp; mettre en forme :</strong> prend du JSON compact et ajoute indentation et sauts de ligne</li>
        <li><strong>Valider :</strong> signale les erreurs de syntaxe avec la ligne et la position de caractère exactes</li>
        <li><strong>Minifier :</strong> retire tous les espaces pour produire du JSON compact pour les charges utiles</li>
        <li><strong>Vue arborescente :</strong> explorez les objets et tableaux imbriqués dans un arbre repliable</li>
      </ul>

      <h3>Scénarios courants</h3>
      <p>Collez une réponse d&apos;API depuis votre terminal pour comprendre sa structure :</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le formateur JSON →</Link>

      <h2>Encodeur / décodeur Base64</h2>

      <p>
        L&apos;encodage Base64 apparaît partout : pièces jointes d&apos;e-mails (MIME), intégration d&apos;images dans le CSS, encodage de données binaires pour les API, et stockage d&apos;identifiants dans des fichiers de configuration. L&apos;<Link href="/tools/base64">outil Base64</Link> gère à la fois l&apos;encodage et le décodage avec prise en charge des variantes Base64 standard et Base64 sûres pour les URL.
      </p>

      <h3>Quand vous en avez besoin</h3>
      <ul>
        <li>Décoder un en-tête <code>Authorization: Basic ...</code> pour voir le nom d&apos;utilisateur:mot de passe</li>
        <li>Encoder une image pour l&apos;intégrer directement dans un <code>url()</code> CSS ou un attribut <code>src</code> HTML</li>
        <li>Inspecter des valeurs de configuration encodées en Base64 dans des secrets Kubernetes</li>
        <li>Encoder des charges utiles binaires pour des API REST qui n&apos;acceptent pas les octets bruts</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir l&apos;encodeur/décodeur Base64 →</Link>

      <h2>Décodeur JWT</h2>

      <p>
        Les jetons JSON Web Token sont utilisés pour l&apos;authentification dans pratiquement toutes les applications web modernes. Quand quelque chose tourne mal avec l&apos;authentification — un jeton expiré, une revendication manquante, une audience inattendue — vous devez inspecter le jeton <em>tout de suite</em>, et non écrire un script pour le faire.
      </p>

      <p>
        Le <Link href="/tools/jwt-decoder">décodeur JWT</Link> accepte une chaîne JWT et affiche immédiatement l&apos;en-tête décodé, la charge utile et l&apos;état de vérification de la signature. Il met en évidence l&apos;heure d&apos;expiration (revendication <code>exp</code>), l&apos;heure d&apos;émission (<code>iat</code>), et vous indique si le jeton est actuellement valide, expiré ou pas encore valide.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Note de sécurité :</strong> ne collez jamais de jetons JWT de production dans un décodeur tiers inconnu — ces jetons représentent des sessions utilisateur actives. BrowseryTools décode les JWT entièrement dans votre navigateur à l&apos;aide d&apos;opérations sur les chaînes Base64. Le jeton ne quitte jamais votre appareil, ce qui en fait le seul choix sûr pour inspecter des jetons issus d&apos;environnements en production.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le décodeur JWT →</Link>

      <h2>Générateur d&apos;UUID</h2>

      <p>
        Les identifiants universellement uniques (UUID) sont essentiels pour les clés primaires de base de données, les clés d&apos;idempotence, les identifiants de corrélation et la conception de systèmes distribués. Le <Link href="/tools/uuid-generator">générateur d&apos;UUID</Link> produit des UUID v4 cryptographiquement aléatoires à l&apos;aide de <code>crypto.randomUUID()</code> — l&apos;API native du navigateur qui produit des identifiants réellement aléatoires, pas pseudo-aléatoires.
      </p>

      <h3>Cas d&apos;usage</h3>
      <ul>
        <li>Générer des ID de base de données de test pendant le développement sans solliciter votre base de données</li>
        <li>Créer des clés d&apos;idempotence pour les requêtes d&apos;API de paiement</li>
        <li>Générer en masse des UUID pour des données de départ ou des fichiers de fixtures</li>
        <li>Créer des identifiants de corrélation pour le traçage distribué lors du débogage</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le générateur d&apos;UUID →</Link>

      <h2>Générateur de hachage</h2>

      <p>
        Le hachage cryptographique sert aux sommes de contrôle, au stockage des mots de passe (jamais en clair&nbsp;!), au stockage adressable par contenu et à la vérification de l&apos;intégrité des données. Le <Link href="/tools/hash-generator">générateur de hachage</Link> calcule les hachages MD5, SHA-1, SHA-256 et SHA-512 à l&apos;aide de l&apos;API native du navigateur <code>crypto.subtle.digest()</code> — la même implémentation sous-jacente que celle de votre système d&apos;exploitation.
      </p>

      <h3>Quand les développeurs y font appel</h3>
      <ul>
        <li>Vérifier la somme de contrôle d&apos;un fichier téléchargé par rapport au hachage publié</li>
        <li>Calculer le SHA-256 du corps d&apos;une requête d&apos;API pour AWS Signature Version 4</li>
        <li>Générer une valeur ETag pour une ressource statique</li>
        <li>Créer un hachage de contenu pour le cache-busting dans les pipelines de build</li>
        <li>Vérifier si deux gros blocs de texte sont identiques sans les comparer caractère par caractère</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le générateur de hachage →</Link>

      <h2>Testeur de regex</h2>

      <p>
        Les expressions régulières sont puissantes et notoirement difficiles à écrire correctement sous pression. Le <Link href="/tools/regex-tester">testeur de regex</Link> vous offre un environnement en temps réel : à mesure que vous tapez votre motif et votre chaîne de test, les correspondances sont mises en évidence instantanément. Il prend en charge tous les drapeaux de regex JavaScript (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) et affiche les groupes capturés dans une vue structurée.
      </p>

      <h3>Exemples pratiques</h3>
      <ul>
        <li>Valider des adresses e-mail, des numéros de téléphone ou des codes postaux pour l&apos;assainissement des saisies de formulaire</li>
        <li>Écrire des motifs d&apos;analyse de journaux pour l&apos;extraction de journaux structurés</li>
        <li>Tester des motifs de routage d&apos;URL avant de les valider dans la configuration d&apos;Express ou Next.js</li>
        <li>Concevoir des motifs compatibles sed/awk sans terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le testeur de regex →</Link>

      <h2>Encodeur / décodeur d&apos;URL</h2>

      <p>
        Les URL ne peuvent contenir qu&apos;un ensemble limité de caractères ASCII. Les caractères spéciaux — espaces, esperluettes, signes égal, texte non ASCII — doivent être encodés en pourcentage. L&apos;<Link href="/tools/url-encoder">encodeur/décodeur d&apos;URL</Link> gère les deux sens et distingue <code>encodeURI</code> (encode une URL complète en préservant les caractères de structure) de <code>encodeURIComponent</code> (encode une valeur de paramètre d&apos;URL, en encodant tout).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir l&apos;encodeur/décodeur d&apos;URL →</Link>

      <h2>Convertisseur YAML ↔ JSON</h2>

      <p>
        Les fichiers de configuration arrivent souvent en YAML (manifestes Kubernetes, workflows GitHub Actions, charts Helm, Docker Compose), tandis que les API et le code travaillent avec JSON. Le <Link href="/tools/yaml-json">convertisseur YAML ↔ JSON</Link> traduit instantanément entre les deux formats, en préservant les types, les structures imbriquées et l&apos;ordre des tableaux.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le convertisseur YAML ↔ JSON →</Link>

      <h2>Analyseur d&apos;expressions cron</h2>

      <p>
        Les expressions cron sont concises mais cryptiques. Une seule erreur dans une planification cron peut signifier qu&apos;une tâche s&apos;exécute chaque minute au lieu d&apos;une fois par mois. L&apos;<Link href="/tools/cron-parser">analyseur cron</Link> traduit n&apos;importe quelle expression cron en langage clair, vous montre les 10 prochaines heures d&apos;exécution planifiées, et valide l&apos;expression par rapport aux formats cron standard et étendus.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir l&apos;analyseur cron →</Link>

      <h2>Convertisseur de bases numériques</h2>

      <p>
        Les programmeurs système, les développeurs embarqués et quiconque travaille proche du matériel ont régulièrement besoin de convertir entre binaire, octal, décimal et hexadécimal. Le <Link href="/tools/number-base-converter">convertisseur de bases numériques</Link> convertit simultanément entre les quatre bases et gère aussi bien les entiers que les grands nombres en entrée.
      </p>

      <h3>Scénarios courants</h3>
      <ul>
        <li>Convertir des adresses mémoire de l&apos;hexadécimal au décimal pour comparaison</li>
        <li>Comprendre des valeurs de masque de bits en les voyant en binaire</li>
        <li>Décoder des permissions de fichier Unix écrites en octal (<code>chmod 755</code> → binaire <code>111 101 101</code>)</li>
        <li>Travailler avec des valeurs de couleur : hex HTML <code>#FF6B35</code> → composantes RVB décimales</li>
        <li>Déboguer des séquences d&apos;octets de protocole en réseau ou en firmware embarqué</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Ouvrir le convertisseur de bases numériques →</Link>

      {/* Summary table */}
      <h2>Référence rapide : tous les outils pour développeurs en un coup d&apos;œil</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Outil</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Cas d&apos;usage principal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Technologie clé</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Formateur JSON", "Formater, valider, minifier le JSON", "JSON.parse / JSON.stringify"],
              ["Encodeur/décodeur Base64", "Encoder/décoder des chaînes Base64", "btoa() / atob()"],
              ["Décodeur JWT", "Inspecter l'en-tête, la charge utile et l'expiration d'un JWT", "Analyse de chaînes Base64"],
              ["Générateur d'UUID", "Générer des UUID v4", "crypto.randomUUID()"],
              ["Générateur de hachage", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Testeur de regex", "Tester et déboguer des motifs regex", "Moteur RegExp de JavaScript"],
              ["Encodeur/décodeur d'URL", "Encoder/décoder des composants d'URL", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Convertir entre YAML et JSON", "bibliothèque js-yaml (locale)"],
              ["Analyseur cron", "Expliquer et valider des expressions cron", "cron-parser (local)"],
              ["Convertisseur de bases numériques", "Binaire, octal, décimal, hex", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Pourquoi BrowseryTools plutôt que des paquets npm ou des API cloud ?</h2>

      <p>
        La comparaison honnête : quand devriez-vous utiliser BrowseryTools plutôt que d&apos;installer un paquet ou d&apos;appeler une API ?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Paquet npm</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Nécessite Node.js installé</li>
            <li>Alourdit l&apos;arbre de dépendances</li>
            <li>Risque potentiel de chaîne d&apos;approvisionnement</li>
            <li>Idéal pour : le code de production</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>API cloud</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Nécessite la configuration d&apos;une clé d&apos;API</li>
            <li>Des limites de débit s&apos;appliquent</li>
            <li>Les données quittent votre appareil</li>
            <li>Idéal pour : les pipelines automatisés</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Zéro configuration, fonctionne instantanément</li>
            <li>Aucune dépendance</li>
            <li>Les données restent locales</li>
            <li>Idéal pour : les tâches de dev manuelles</li>
          </ul>
        </div>
      </div>

      <p>
        La réponse est : utilisez BrowseryTools pour les <em>tâches manuelles, exploratoires et ponctuelles</em> qu&apos;il serait excessif de scripter. Décoder un JWT pour déboguer un problème d&apos;authentification, formater une réponse d&apos;API pour comprendre sa forme, générer un UUID pour un test unique — ce sont exactement les moments où un outil de navigateur rapide et sans friction vous épargne 10 minutes de configuration pour un travail de 10 secondes.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Astuce pour les développeurs :</strong> ajoutez <code>browserytools.com</code> à vos favoris à côté des outils de développement de votre navigateur. Quand vous êtes en plein débogage et que vous devez rapidement décoder, hacher, formater ou convertir quelque chose, avoir ces outils à un onglet de distance vous permet de rester dans le flux au lieu de changer de contexte pour écrire un script jetable.
      </div>

      <h2>Au-delà des outils pour développeurs : d&apos;autres utilitaires BrowseryTools</h2>

      <p>
        BrowseryTools couvre bien plus que les utilitaires pour développeurs. La même approche axée sur la confidentialité, sans téléversement, s&apos;applique à :
      </p>

      <ul>
        <li><strong>Outils d&apos;images :</strong> <Link href="/tools/image-compression">compression d&apos;images</Link>, <Link href="/tools/bg-removal">suppression d&apos;arrière-plan par IA</Link>, <Link href="/tools/image-resizer">redimensionnement</Link>, <Link href="/tools/image-converter">conversion de format</Link></li>
        <li><strong>Outils de texte :</strong> <Link href="/tools/markdown-editor">éditeur Markdown</Link>, <Link href="/tools/text-diff">comparaison de texte</Link>, <Link href="/tools/text-case">convertisseur de casse</Link>, <Link href="/tools/lorem-ipsum">générateur de Lorem ipsum</Link></li>
        <li><strong>Outils de sécurité :</strong> <Link href="/tools/password-generator">générateur de mots de passe</Link>, <Link href="/tools/password-strength">vérificateur de robustesse des mots de passe</Link>, <Link href="/tools/text-encryption">chiffrement de texte</Link></li>
        <li><strong>Productivité :</strong> <Link href="/tools/pomodoro">minuteur Pomodoro</Link>, <Link href="/tools/todo">liste de tâches</Link>, <Link href="/tools/notepad">bloc-notes</Link>, <Link href="/tools/world-clock">horloge mondiale</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Tout s&apos;exécute localement dans votre navigateur</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Commencez à utiliser BrowseryTools — aucune configuration requise</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Les 10 outils pour développeurs ci-dessus — ainsi que des dizaines d&apos;autres — sont gratuits, instantanés et n&apos;exigent aucun compte, aucune installation et aucune configuration. Ouvrez un outil et commencez à travailler en moins de 3 secondes.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Ouvrir le formateur JSON →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Parcourir tous les outils
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Outils connexes : <Link href="/tools/json-formatter">Formateur JSON</Link> · <Link href="/tools/jwt-decoder">Décodeur JWT</Link> · <Link href="/tools/hash-generator">Générateur de hachage</Link> · <Link href="/tools/regex-tester">Testeur de regex</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">Générateur d&apos;UUID</Link> · <Link href="/tools/cron-parser">Analyseur cron</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
