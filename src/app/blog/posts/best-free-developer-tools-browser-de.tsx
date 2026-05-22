import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Jeder Entwickler sammelt eine mentale Liste von Lieblingsseiten für schnelle Aufgaben an: diesen
        Base64-String dekodieren, dieses JSON-Objekt validieren, prüfen, was dieses JWT eigentlich enthält.
        Das Problem ist, dass diese Liste meist ein Dutzend verschiedener Seiten umfasst – jede mit ihren
        eigenen Cookie-Bannern, Anmeldeaufforderungen und Datenschutzfragen.
      </p>

      <p>
        <strong>BrowseryTools</strong> konsolidiert die wichtigsten Entwickler-Werkzeuge in einer einzigen,
        schnellen, datenschutzorientierten Suite. Alles läuft lokal in Ihrem Browser. Keine Uploads. Keine
        API-Schlüssel. Keine Ratenbegrenzungen. Dieser Leitfaden geht jedes Tool durch und zeigt Ihnen genau,
        wann und warum Sie danach greifen würden.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Warum Browser-Tools npm-Pakete und Cloud-APIs schlagen:</strong> Die Installation eines
        npm-Pakets kostet Zeit, vergrößert Ihren Abhängigkeitsbaum, setzt voraus, dass Node.js verfügbar ist,
        und kann Sicherheitslücken in seiner Abhängigkeitskette aufweisen. Cloud-APIs erfordern
        Authentifizierung, haben Ratenbegrenzungen und bringen Latenz mit sich. Ein Browser-Tool ist sofort
        einsatzbereit, abhängigkeitsfrei und funktioniert auf jeder Maschine gleich.
      </div>

      <h2>JSON-Formatierer &amp; -Validator</h2>

      <p>
        JSON ist die Lingua franca moderner APIs. Wenn Sie auf ein minifiziertes 3-KB-Objekt starren, das
        ein Endpunkt zurückgegeben hat, macht der <Link href="/tools/json-formatter">JSON-Formatierer</Link>
        {" "}es sofort lesbar.
      </p>

      <h3>Was es macht</h3>
      <ul>
        <li><strong>Formatieren &amp; schön ausgeben:</strong> Nimmt kompaktes JSON und fügt Einrückung und Zeilenumbrüche hinzu</li>
        <li><strong>Validieren:</strong> Markiert Syntaxfehler mit der genauen Zeilen- und Zeichenposition</li>
        <li><strong>Minifizieren:</strong> Entfernt alle Leerzeichen, um kompaktes JSON für Payloads zu erzeugen</li>
        <li><strong>Baumansicht:</strong> Erkunden Sie verschachtelte Objekte und Arrays in einem zusammenklappbaren Baum</li>
      </ul>

      <h3>Häufige Szenarien</h3>
      <p>Fügen Sie eine API-Antwort aus Ihrem Terminal ein, um ihre Struktur zu verstehen:</p>

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

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>JSON-Formatierer öffnen →</Link>

      <h2>Base64-Encoder / -Decoder</h2>

      <p>
        Base64-Kodierung taucht überall auf: E-Mail-Anhänge (MIME), das Einbetten von Bildern in CSS, das
        Kodieren von Binärdaten für APIs und das Speichern von Anmeldedaten in Konfigurationsdateien. Das{" "}
        <Link href="/tools/base64">Base64-Tool</Link> erledigt sowohl das Kodieren als auch das Dekodieren mit
        Unterstützung für Standard-Base64 und URL-sichere Base64-Varianten.
      </p>

      <h3>Wann Sie es brauchen</h3>
      <ul>
        <li>Dekodieren eines <code>Authorization: Basic ...</code>-Headers, um den Benutzernamen:Passwort zu sehen</li>
        <li>Kodieren eines Bildes, um es direkt in ein CSS-<code>url()</code> oder ein HTML-<code>src</code>-Attribut einzubetten</li>
        <li>Untersuchen von Base64-kodierten Konfigurationswerten in Kubernetes-Secrets</li>
        <li>Kodieren von Binär-Payloads für REST-APIs, die keine rohen Bytes akzeptieren</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Base64-Encoder/Decoder öffnen →</Link>

      <h2>JWT-Decoder</h2>

      <p>
        JSON Web Tokens werden in praktisch jeder modernen Webanwendung zur Authentifizierung verwendet. Wenn
        bei der Authentifizierung etwas schiefgeht – ein abgelaufenes Token, eine fehlende Angabe, eine
        unerwartete Zielgruppe – müssen Sie das Token <em>genau jetzt</em> untersuchen und nicht erst ein
        Skript dafür schreiben.
      </p>

      <p>
        Der <Link href="/tools/jwt-decoder">JWT-Decoder</Link> akzeptiert einen JWT-String und zeigt sofort
        den dekodierten Header, die Payload und den Signaturverifizierungsstatus an. Er hebt die Ablaufzeit
        (<code>exp</code>-Angabe) und die Ausstellungszeit (<code>iat</code>) hervor und teilt Ihnen mit, ob
        das Token derzeit gültig, abgelaufen oder noch nicht gültig ist.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Sicherheitshinweis:</strong> Fügen Sie niemals produktive JWT-Tokens in einen unbekannten
        Drittanbieter-Decoder ein – diese Tokens repräsentieren aktive Benutzersitzungen. BrowseryTools
        dekodiert JWTs vollständig in Ihrem Browser mithilfe von Base64-Stringoperationen. Das Token verlässt
        niemals Ihr Gerät, was es zur einzigen sicheren Wahl für die Untersuchung von Tokens aus
        Live-Umgebungen macht.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>JWT-Decoder öffnen →</Link>

      <h2>UUID-Generator</h2>

      <p>
        Universally Unique Identifiers (UUIDs) sind unverzichtbar für Datenbank-Primärschlüssel,
        Idempotenz-Schlüssel, Korrelations-IDs und das Design verteilter Systeme. Der{" "}
        <Link href="/tools/uuid-generator">UUID-Generator</Link> erzeugt kryptografisch zufällige v4-UUIDs
        mithilfe von <code>crypto.randomUUID()</code> – der browsereigenen API, die echte zufällige
        Bezeichner erzeugt, keine pseudozufälligen.
      </p>

      <h3>Anwendungsfälle</h3>
      <ul>
        <li>Generieren von Test-Datenbank-IDs während der Entwicklung, ohne Ihre Datenbank anzusprechen</li>
        <li>Erstellen von Idempotenz-Schlüsseln für Zahlungs-API-Anfragen</li>
        <li>Massenerzeugung von UUIDs für Seed-Daten oder Fixture-Dateien</li>
        <li>Erstellen von Korrelations-IDs für verteiltes Tracing beim Debugging</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>UUID-Generator öffnen →</Link>

      <h2>Hash-Generator</h2>

      <p>
        Kryptografisches Hashing wird für Prüfsummen, Passwortspeicherung (niemals im Klartext!),
        inhaltsadressierbaren Speicher und die Überprüfung der Datenintegrität verwendet. Der{" "}
        <Link href="/tools/hash-generator">Hash-Generator</Link> berechnet MD5-, SHA-1-, SHA-256- und
        SHA-512-Hashes mithilfe der browsereigenen API <code>crypto.subtle.digest()</code> – derselben
        zugrunde liegenden Implementierung, die Ihr Betriebssystem verwendet.
      </p>

      <h3>Wann Entwickler danach greifen</h3>
      <ul>
        <li>Überprüfen der Prüfsumme einer heruntergeladenen Datei gegen den veröffentlichten Hash</li>
        <li>Berechnen des SHA-256 eines API-Anfragetexts für AWS Signature Version 4</li>
        <li>Generieren eines ETag-Werts für eine statische Ressource</li>
        <li>Erstellen eines Inhalts-Hashes zum Cache-Busting in Build-Pipelines</li>
        <li>Prüfen, ob zwei große Textblöcke identisch sind, ohne sie Zeichen für Zeichen zu vergleichen</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Hash-Generator öffnen →</Link>

      <h2>Regex-Tester</h2>

      <p>
        Reguläre Ausdrücke sind mächtig und notorisch schwer unter Druck korrekt zu schreiben. Der{" "}
        <Link href="/tools/regex-tester">Regex-Tester</Link> gibt Ihnen eine Echtzeitumgebung: Während Sie
        Ihr Muster und Ihren Teststring tippen, werden Treffer sofort hervorgehoben. Er unterstützt alle
        JavaScript-Regex-Flags (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>,{" "}
        <code>u</code>) und zeigt erfasste Gruppen in einer strukturierten Ansicht.
      </p>

      <h3>Praktische Beispiele</h3>
      <ul>
        <li>Validieren von E-Mail-Adressen, Telefonnummern oder Postleitzahlen zur Bereinigung von Formulareingaben</li>
        <li>Schreiben von Log-Parsing-Mustern zur strukturierten Log-Extraktion</li>
        <li>Testen von URL-Routing-Mustern, bevor Sie sie in die Express- oder Next.js-Konfiguration übernehmen</li>
        <li>Erstellen von sed/awk-kompatiblen Mustern ohne ein Terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Regex-Tester öffnen →</Link>

      <h2>URL-Encoder / -Decoder</h2>

      <p>
        URLs dürfen nur eine begrenzte Menge an ASCII-Zeichen enthalten. Sonderzeichen – Leerzeichen,
        Kaufmanns-Und, Gleichheitszeichen, Nicht-ASCII-Text – müssen prozentkodiert werden. Der{" "}
        <Link href="/tools/url-encoder">URL-Encoder/Decoder</Link> erledigt beide Richtungen und unterscheidet
        zwischen <code>encodeURI</code> (kodiert eine vollständige URL und bewahrt Strukturzeichen) und{" "}
        <code>encodeURIComponent</code> (kodiert einen URL-Parameterwert und kodiert alles).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>URL-Encoder/Decoder öffnen →</Link>

      <h2>YAML ↔ JSON-Konverter</h2>

      <p>
        Konfigurationsdateien liegen oft in YAML vor (Kubernetes-Manifeste, GitHub-Actions-Workflows,
        Helm-Charts, Docker Compose), während APIs und Code mit JSON arbeiten. Der{" "}
        <Link href="/tools/yaml-json">YAML ↔ JSON-Konverter</Link> übersetzt sofort zwischen beiden Formaten
        und bewahrt dabei Typen, verschachtelte Strukturen und die Array-Reihenfolge.
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

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>YAML ↔ JSON-Konverter öffnen →</Link>

      <h2>Cron-Ausdruck-Parser</h2>

      <p>
        Cron-Ausdrücke sind knapp, aber kryptisch. Ein einziger Fehler in einem Cron-Zeitplan kann bedeuten,
        dass ein Job jede Minute statt einmal im Monat läuft. Der <Link href="/tools/cron-parser">Cron-Parser</Link>
        {" "}übersetzt jeden Cron-Ausdruck in verständliches Deutsch, zeigt Ihnen die nächsten 10 geplanten
        Ausführungszeiten und validiert den Ausdruck gegen standardmäßige und erweiterte Cron-Formate.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Cron-Parser öffnen →</Link>

      <h2>Zahlenbasis-Konverter</h2>

      <p>
        Systemprogrammierer, Embedded-Entwickler und alle, die hardwarenah arbeiten, müssen regelmäßig
        zwischen Binär-, Oktal-, Dezimal- und Hexadezimalzahlen konvertieren. Der{" "}
        <Link href="/tools/number-base-converter">Zahlenbasis-Konverter</Link> konvertiert gleichzeitig
        zwischen allen vier Basen und verarbeitet sowohl Ganzzahl- als auch große Zahleneingaben.
      </p>

      <h3>Häufige Szenarien</h3>
      <ul>
        <li>Konvertieren von Speicheradressen von Hex nach Dezimal zum Vergleich</li>
        <li>Verstehen von Bitmaskenwerten durch deren Darstellung im Binärformat</li>
        <li>Dekodieren von Unix-Dateiberechtigungen in Oktal (<code>chmod 755</code> → binär <code>111 101 101</code>)</li>
        <li>Arbeiten mit Farbwerten: HTML-Hex <code>#FF6B35</code> → RGB-Dezimalkomponenten</li>
        <li>Debuggen von Protokoll-Byte-Sequenzen in Netzwerken oder Embedded-Firmware</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Zahlenbasis-Konverter öffnen →</Link>

      {/* Summary table */}
      <h2>Schnellreferenz: Alle Entwickler-Tools auf einen Blick</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Tool</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Hauptanwendungsfall</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Schlüsseltechnologie</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["JSON-Formatierer", "JSON formatieren, validieren, minifizieren", "JSON.parse / JSON.stringify"],
              ["Base64-Encoder/Decoder", "Base64-Strings kodieren/dekodieren", "btoa() / atob()"],
              ["JWT-Decoder", "JWT-Header, -Payload, -Ablauf untersuchen", "Base64-String-Parsing"],
              ["UUID-Generator", "v4-UUIDs generieren", "crypto.randomUUID()"],
              ["Hash-Generator", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Regex-Tester", "Regex-Muster testen und debuggen", "JavaScript RegExp engine"],
              ["URL-Encoder/Decoder", "URL-Komponenten kodieren/dekodieren", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Zwischen YAML und JSON konvertieren", "js-yaml library (local)"],
              ["Cron-Parser", "Cron-Ausdrücke erklären und validieren", "cron-parser (local)"],
              ["Zahlenbasis-Konverter", "Binär, oktal, dezimal, hex", "parseInt() / toString()"],
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

      <h2>Warum BrowseryTools statt npm-Pakete oder Cloud-APIs?</h2>

      <p>
        Der ehrliche Vergleich: Wann sollten Sie BrowseryTools verwenden und wann ein Paket installieren oder
        eine API aufrufen?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>npm-Paket</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Erfordert installiertes Node.js</li>
            <li>Vergrößert den Abhängigkeitsbaum</li>
            <li>Potenzielles Supply-Chain-Risiko</li>
            <li>Am besten für: Produktionscode</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Cloud-API</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Erfordert API-Schlüssel-Einrichtung</li>
            <li>Ratenbegrenzungen gelten</li>
            <li>Daten verlassen Ihr Gerät</li>
            <li>Am besten für: automatisierte Pipelines</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Keine Einrichtung, sofort einsatzbereit</li>
            <li>Keine Abhängigkeiten</li>
            <li>Daten bleiben lokal</li>
            <li>Am besten für: manuelle Dev-Aufgaben</li>
          </ul>
        </div>
      </div>

      <p>
        Die Antwort lautet: Verwenden Sie BrowseryTools für die <em>manuellen, explorativen, einmaligen
        Aufgaben</em>, für die ein Skript überzogen wäre. Ein JWT dekodieren, um ein Auth-Problem zu debuggen,
        eine API-Antwort formatieren, um ihre Form zu verstehen, eine UUID für einen einmaligen Test
        generieren – das sind genau die Momente, in denen ein schnelles, reibungsloses Browser-Tool 10 Minuten
        Einrichtung für eine 10-Sekunden-Aufgabe spart.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tipp für Entwickler:</strong> Speichern Sie <code>browserytools.com</code> als Lesezeichen
        neben den Entwicklertools Ihres Browsers. Wenn Sie mitten im Debugging stecken und schnell etwas
        dekodieren, hashen, formatieren oder konvertieren müssen, bedeutet diese Tools nur einen Tab entfernt
        zu haben, dass Sie im Flow bleiben können, statt den Kontext zu wechseln, um ein Wegwerf-Skript zu
        schreiben.
      </div>

      <h2>Über Entwickler-Tools hinaus: weitere BrowseryTools-Werkzeuge</h2>

      <p>
        BrowseryTools deckt weit mehr ab als Entwickler-Werkzeuge. Derselbe datenschutzorientierte,
        upload-freie Ansatz gilt für:
      </p>

      <ul>
        <li><strong>Bild-Tools:</strong> <Link href="/tools/image-compression">Bildkomprimierung</Link>, <Link href="/tools/bg-removal">KI-Hintergrundentfernung</Link>, <Link href="/tools/image-resizer">Größenänderung</Link>, <Link href="/tools/image-converter">Formatkonvertierung</Link></li>
        <li><strong>Text-Tools:</strong> <Link href="/tools/markdown-editor">Markdown-Editor</Link>, <Link href="/tools/text-diff">Text-Diff</Link>, <Link href="/tools/text-case">Groß-/Kleinschreibungs-Konverter</Link>, <Link href="/tools/lorem-ipsum">Lorem-Ipsum-Generator</Link></li>
        <li><strong>Sicherheits-Tools:</strong> <Link href="/tools/password-generator">Passwortgenerator</Link>, <Link href="/tools/password-strength">Passwortstärke-Prüfer</Link>, <Link href="/tools/text-encryption">Textverschlüsselung</Link></li>
        <li><strong>Produktivität:</strong> <Link href="/tools/pomodoro">Pomodoro-Timer</Link>, <Link href="/tools/todo">To-do-Liste</Link>, <Link href="/tools/notepad">Notizblock</Link>, <Link href="/tools/world-clock">Weltzeituhr</Link></li>
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
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">Alles läuft lokal in Ihrem Browser</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Beginnen Sie, BrowseryTools zu nutzen – keine Einrichtung erforderlich</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          Alle 10 Entwickler-Tools oben – plus Dutzende mehr – sind kostenlos, sofort einsatzbereit und
          erfordern kein Konto, keine Installation und keine Konfiguration. Öffnen Sie ein Tool und legen Sie
          in unter 3 Sekunden los.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            JSON-Formatierer öffnen →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Alle Tools durchsuchen
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Verwandte Tools: <Link href="/tools/json-formatter">JSON-Formatierer</Link> · <Link href="/tools/jwt-decoder">JWT-Decoder</Link> · <Link href="/tools/hash-generator">Hash-Generator</Link> · <Link href="/tools/regex-tester">Regex-Tester</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">UUID-Generator</Link> · <Link href="/tools/cron-parser">Cron-Parser</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
