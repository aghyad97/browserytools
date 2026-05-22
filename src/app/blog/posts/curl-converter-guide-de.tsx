export default function Content() {
  return (
    <div>
      <p>
        Jede API hat Dokumentation. Fast ausnahmslos enthält diese Dokumentation Code-Beispiele
        in cURL – dem Befehlszeilen-HTTP-Client, der auf jedem Unix-ähnlichen System mitgeliefert
        wird und seit Jahrzehnten die Lingua Franca der API-Dokumentation ist. Das Problem ist, dass
        man keine Shell-Skripte schreibt. Man schreibt JavaScript, Python, Go oder Ruby und muss
        diesen cURL-Befehl in funktionierenden Code übersetzen, bevor man ihn verwenden kann.
      </p>
      <p>
        Diese Übersetzung ist mühsam und fehleranfällig. Header, Authentifizierungsschemata,
        Request-Bodies und URL-Kodierung müssen alle auf die richtigen Methodenaufrufe in der
        richtigen Sprache abgebildet werden. Der{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL-Konverter</a> macht das automatisch –
        einen cURL-Befehl einfügen und äquivalenten Code in JavaScript fetch, Python requests,
        Node.js axios und mehr erhalten. Kostenlos, keine Anmeldung, alles bleibt im Browser.
      </p>

      <h2>Was ist cURL?</h2>
      <p>
        cURL (Client URL) ist ein Befehlszeilen-Tool für die Datenübertragung über URLs. Es
        unterstützt HTTP, HTTPS, FTP, WebSockets und Dutzende anderer Protokolle. Für Entwickler
        wird es am häufigsten verwendet, um HTTP-Anfragen vom Terminal aus zu stellen – einen
        API-Endpunkt zu testen, eine Datei herunterzuladen oder Authentifizierung zu debuggen.
      </p>
      <p>
        cURL ist standardmäßig auf macOS und den meisten Linux-Distributionen installiert. Unter
        Windows ist es seit Windows 10 im Betriebssystem enthalten. Diese Allgegenwart ist genau
        der Grund, warum API-Dokumentationsteams standardmäßig cURL für Beispiele verwenden –
        sie können sicher sein, dass jeder Entwickler, der die Dokumentation liest, das Beispiel
        sofort ausführen kann, ohne etwas zu installieren.
      </p>

      <h2>Anatomie eines cURL-Befehls</h2>
      <p>
        Ein cURL-Befehl besteht aus einer Basis-URL und einer Reihe von Flags. Hier ist ein
        vollständiges Beispiel, das die wichtigsten Flags abdeckt:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Aufschlüsselung jedes Flags:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> – setzt die HTTP-Methode. Gültige Werte sind GET, POST, PUT, PATCH, DELETE usw. Wenn weggelassen und <code>-d</code> vorhanden ist, setzt cURL standardmäßig POST.</li>
        <li><strong><code>-H "Header: Wert"</code></strong> – fügt einen Request-Header hinzu. Kann für mehrere Header mehrfach wiederholt werden.</li>
        <li><strong><code>-d '...'</code></strong> – der Request-Body. Für JSON mit <code>-H "Content-Type: application/json"</code> kombinieren. cURL URL-kodiert den Body standardmäßig, außer man verwendet <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> – sendet den Body genau wie angegeben, ohne URL-Kodierung. Erforderlich, wenn der Body Zeichen wie <code>@</code> enthält, die <code>-d</code> besonders interpretieren würde.</li>
        <li><strong><code>-u benutzername:passwort</code></strong> – Abkürzung für Basic Authentication. cURL kodiert es als Base64-Authorization-Header.</li>
        <li><strong><code>-s</code></strong> – Stiller Modus; unterdrückt die Fortschrittsanzeige. Fast immer in Skripten verwendet.</li>
        <li><strong><code>-v</code></strong> – Ausführlicher Modus; druckt Request- und Response-Header. Unschätzbar für das Debuggen von Authentifizierungsfehlern.</li>
        <li><strong><code>-o dateiname</code></strong> – Ausgabe in eine Datei schreiben statt auf stdout.</li>
      </ul>

      <h2>Häufige cURL-Muster für REST-APIs</h2>

      <h3>GET-Anfrage mit Query-Parametern</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Query-Parameter kommen direkt in die URL. Die gesamte URL in Anführungszeichen setzen,
        damit die Shell das <code>&</code> nicht als Hintergrundprozess-Operator interpretiert.
      </p>

      <h3>POST mit JSON-Body</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>Datei-Upload (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        Das <code>-F</code>-Flag sendet multipart/form-data. Das <code>@</code>-Präfix bedeutet
        „aus Datei lesen". Das ist das Format für Bild-Uploads, Dokumentverarbeitungs-APIs und
        alle Endpunkte, die binäre Daten akzeptieren.
      </p>

      <h2>cURL zu JavaScript fetch konvertieren</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Original cURL:
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

      <h2>cURL zu Python requests konvertieren</h2>
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
        Der Parameter <code>json=</code> der <code>requests</code>-Bibliothek übernimmt sowohl
        die Serialisierung als auch das automatische Setzen des Headers{" "}
        <code>Content-Type: application/json</code> – kein manuelles Setzen erforderlich.
      </p>

      <h2>cURL zu Node.js mit axios konvertieren</h2>
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

      <h2>Wie „Als cURL kopieren" in den Browser-DevTools funktioniert</h2>
      <p>
        Eine der nützlichsten Funktionen in den Browser-DevTools ist „Als cURL kopieren". In
        Chrome, Firefox oder Safari: DevTools öffnen, zum Netzwerk-Tab wechseln, eine Anfrage
        stellen (einloggen, auf eine Schaltfläche klicken, eine Seite laden), die Anfrage in der
        Netzwerkliste rechtsklicken und „Als cURL kopieren" auswählen.
      </p>
      <p>
        Der Browser generiert einen vollständigen cURL-Befehl, der jeden Header enthält, den der
        Browser gesendet hat – einschließlich Cookies, Session-Tokens, CSRF-Tokens und anderen
        Authentifizierungsdaten. Das bedeutet, man kann genau die Anfrage, die der Browser gestellt
        hat, einschließlich ihres gesamten Authentifizierungskontexts, vom Terminal oder aus Code
        wiederholen.
      </p>
      <p>
        Das ist unschätzbar für Debugging: Wenn die Browser-Anfrage funktioniert, aber die
        Code-Anfrage scheitert, beide in ein Diff einfügen und den Header- oder Body-Unterschied
        finden. Man kann das kopierte cURL auch direkt in den{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL-Konverter</a> einfügen, um äquivalenten
        Code in der bevorzugten Sprache zu erhalten – der Konverter übernimmt automatisch das
        gesamte Escaping, Quoting und die Flag-Übersetzung.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        cURL ist die universelle Sprache von HTTP. API-Dokumentationen verwenden es, weil jeder es
        ausführen kann. DevTools kopiert es, weil es jedes Detail einer Anfrage erfasst. cURL
        fließend lesen zu können – und es präzise in die jeweilige Arbeitssprache übersetzen zu
        können – ist eine praktische Fähigkeit, die sich jedes Mal auszahlt, wenn man eine neue
        API integriert. Die mühsame manuelle Übersetzung überspringen und den{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL-Konverter</a> verwenden, um in Sekunden
        sauberen, ausführbaren Code zu erhalten.
      </p>
    </div>
  );
}
