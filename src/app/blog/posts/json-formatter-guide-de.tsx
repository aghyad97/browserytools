import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        JSON ist allgegenwärtig. Es treibt REST-APIs, Konfigurationsdateien, Datenbankausgaben,
        Webhook-Payloads und Log-Aggregatoren an. Man begegnet ihm Dutzende Male am Tag, egal ob
        man einen Backend-Dienst baut, eine Frontend-App debuggt oder Dokumentation liest. JSON
        gründlich zu verstehen – nicht nur das Parsen, sondern auch das Lesen, Validieren und
        Fehlersuchen – ist eine der wirkungsvollsten Fähigkeiten, die ein Entwickler haben kann.
      </p>
      <ToolCTA slug="json-formatter" variant="inline" />
      <p>
        Dieser Leitfaden deckt alles von JSON-Syntax-Grundlagen bis zum Debuggen häufiger
        Parse-Fehler, Formatierungsstrategien und dem Arbeiten mit tief verschachtelten Strukturen
        ab. Beliebiges JSON in den{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON-Formatierer</a> einfügen, um es sofort
        zu validieren und hübsch zu drucken – kostenlos, keine Anmeldung, alles bleibt im Browser.
      </p>

      <h2>Warum JSON gewann (und XML verlor)</h2>
      <p>
        Bevor JSON zum Standard-Datenaustauschformat wurde, war XML der Standard. SOAP-APIs,
        RSS-Feeds und Konfigurationsdateien verwendeten alle XML. JSON entstand als einfachere
        Alternative und übernahm nach und nach die meisten Anwendungsfälle. Die Gründe sind
        unkompliziert:
      </p>
      <ul>
        <li><strong>Weniger ausführlich</strong> – JSON erfordert keine schließenden Tags. Dieselben Daten brauchen 30–50 % weniger Zeichen.</li>
        <li><strong>Native zu JavaScript</strong> – JSON steht für JavaScript Object Notation. Es bildet sich direkt auf JavaScript-Objekte und -Arrays ab, was das Parsen und Serialisieren im Browser trivial macht.</li>
        <li><strong>Menschenlesbar</strong> – Ein korrekt formatierter JSON-Payload ist einfacher zu lesen als das äquivalente XML mit seinen spitzen Klammern und Namespace-Deklarationen.</li>
        <li><strong>Weitverbreitet unterstützt</strong> – Jede wichtige Sprache hat einen eingebauten JSON-Parser. Es ist keine Bibliothek nötig, nur um eine API-Antwort zu deserialisieren.</li>
      </ul>
      <p>
        XML hat noch legitime Anwendungsfälle – Dokumentformate (DOCX, SVG), Konfigurationen,
        die Kommentare erfordern (was JSON nicht unterstützt), und Protokolle wie SOAP, wo es
        erforderlich ist. Aber für API-Kommunikation und Datenspeicherung ist JSON der eindeutige
        Gewinner.
      </p>

      <h2>JSON-Syntaxregeln</h2>
      <p>
        JSON hat eine kleine, strenge Syntax. Das sind die Regeln, die die meisten Entwickler
        überraschend treffen:
      </p>
      <ul>
        <li><strong>Schlüssel müssen doppelt gequotete Zeichenketten sein</strong> – <code>{"{"}"name": "Alice"{"}"}</code> ist gültig; <code>{"{"}name: "Alice"{"}"}</code> ist es nicht. Anders als JavaScript-Objektliterale erlaubt JSON keine unquotierten Schlüssel.</li>
        <li><strong>Keine nachgestellten Kommas</strong> – <code>[1, 2, 3,]</code> ist ungültiges JSON. Das nachgestellte Komma nach dem letzten Element wird von JavaScript und vielen Parsern akzeptiert, ist aber nicht Teil der JSON-Spezifikation.</li>
        <li><strong>Keine Kommentare</strong> – JSON hat keine Kommentarsyntax. Das überrascht Entwickler, die Konfigurationsdateien annotieren möchten. Wenn Kommentare in einer Konfigurationsdatei benötigt werden, sollte man JSONC (JSON with Comments) oder YAML in Betracht ziehen.</li>
        <li><strong>Zeichenketten verwenden nur doppelte Anführungszeichen</strong> – Einfach gequotete Zeichenketten wie <code>'hello'</code> sind kein gültiges JSON.</li>
        <li><strong>Zahlen dürfen keine führenden Nullen haben</strong> – <code>007</code> ist ungültig; stattdessen <code>7</code> verwenden.</li>
        <li><strong>Nur sechs Werttypen</strong> – Zeichenketten, Zahlen, Boolesche Werte (<code>true</code> / <code>false</code>), null, Objekte und Arrays. Keine Datumswerte, keine Funktionen, kein undefined.</li>
      </ul>

      <h2>Häufige JSON-Fehler und ihre Bedeutung</h2>
      <p>
        JSON-Parse-Fehler können kryptisch sein. Hier sind die häufigsten und wie man sie behebt.
      </p>

      <h3>Unerwartetes Token</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Fehler: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Einfache Anführungszeichen sind kein gültiges JSON. Durch doppelte ersetzen:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Unerwartetes Token } / ]"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Fehler: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        Ein nachgestelltes Komma vor der schließenden Klammer. Das Komma nach dem letzten Element
        entfernen. Dies ist der häufigste JSON-Fehler bei Entwicklern, die aus JavaScript kommen,
        wo nachgestellte Kommas völlig in Ordnung sind.
      </p>

      <h3>Unerwartetes Ende der JSON-Eingabe</h3>
      <p>
        Das bedeutet, JSON ist abgeschnitten – die Zeichenkette endet, bevor alle geöffneten
        Objekte und Arrays geschlossen sind. Die öffnenden und schließenden Klammern und eckigen
        Klammern zählen. Sie müssen übereinstimmen.
      </p>

      <h3>Eigenschaftsnamen müssen Zeichenketten sein</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Ungültig — unquotierter Schlüssel
{ name: "Alice" }

// Gültig
{ "name": "Alice" }`}
      </pre>

      <h2>Hübsch drucken vs. Minifizieren</h2>
      <p>
        JSON kann auf zwei Arten dargestellt werden: hübsch gedruckt (mit Einrückung und
        Zeilenumbrüchen) oder minifiziert (alle Leerzeichen entfernt). Die Wahl hängt vom
        Kontext ab.
      </p>
      <p>
        <strong>Hübsch drucken</strong>, wenn man JSON liest, debuggt, überprüft oder in
        der Versionskontrolle speichert. Eingerücktes JSON ist sofort lesbar und lässt sich
        sauber in Git differenzieren, da jeder Wert in einer eigenen Zeile steht.
      </p>
      <p>
        <strong>Minifizieren</strong>, wenn man JSON über ein Netzwerk überträgt. Leerzeichen
        sind reiner Overhead in HTTP-Antworten. Ein 100 KB hübsch gedruckter JSON-Payload
        könnte auf 60 KB minifiziert und weiter auf 15 KB mit gzip komprimiert werden. Die
        meisten APIs liefern minifiziertes JSON über das Netzwerk und lassen den Client es
        nach Bedarf hübsch drucken.
      </p>
      <p>
        In JavaScript: <code>JSON.stringify(data, null, 2)</code> druckt hübsch mit 2-Leerzeichen-
        Einrückung. <code>JSON.stringify(data)</code> minifiziert. Der{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON-Formatierer</a> macht beides – JSON
        einfügen und sofort zwischen hübscher und minifizierter Ansicht wechseln.
      </p>

      <h2>Tief verschachteltes JSON navigieren</h2>
      <p>
        Reale API-Antworten sind oft tief verschachtelt. Ein Stripe-Webhook-Payload, eine
        GitHub-API-Antwort oder eine Kubernetes-Konfiguration können Objekte fünf oder sechs
        Ebenen tief haben. Hier sind Strategien für die Arbeit damit:
      </p>

      <h3>Optionales Verketten in JavaScript verwenden</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Ohne optionales Verketten — stürzt ab, wenn eine Ebene undefined ist
const city = user.address.location.city;

// Mit optionalem Verketten — gibt undefined zurück statt zu werfen
const city = user?.address?.location?.city;

// Mit Nullish-Koalescing für einen Standardwert
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>jq für Befehlszeilen-JSON-Abfragen verwenden</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Die gesamte Antwort hübsch drucken
curl https://api.example.com/users | jq .

# Ein bestimmtes Feld extrahieren
curl https://api.example.com/users | jq '.[0].email'

# Ein Array filtern
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON in APIs vs. Konfigurationsdateien</h2>
      <p>
        JSON dient je nach Kontext zwei sehr unterschiedlichen Rollen, und die Best Practices
        unterscheiden sich zwischen ihnen.
      </p>
      <p>
        In <strong>API-Antworten</strong> wird JSON von Code generiert und von Code konsumiert.
        Man schreibt es selten von Hand. Priorität haben Korrektheit und Konsistenz – eine
        Serialisierungsbibliothek verwenden und das Escaping erledigen lassen. Für Produktion
        minifizieren, einen Content-Type-Header von <code>application/json</code> einschließen
        und die API versionieren, damit Änderungen an der JSON-Struktur keine Brüche verursachen.
      </p>
      <p>
        In <strong>Konfigurationsdateien</strong> (package.json, tsconfig.json, .eslintrc.json)
        wird JSON von Menschen geschrieben. Hier ist Lesbarkeit wichtiger. 2-Leerzeichen-Einrückung
        verwenden, die Struktur wo möglich flach halten und mit einem JSONC-kompatiblen Parser
        Kommentare hinzufügen, wenn das Tooling das unterstützt. Niemals Konfigurationsdateien
        minifizieren, die in der Versionskontrolle liegen.
      </p>

      <h2>JSON-Schema-Validierung</h2>
      <p>
        JSON Schema ist eine Spezifikation zur Definition der Struktur, Typen und Einschränkungen
        eines JSON-Dokuments. Es ermöglicht zu validieren, dass ein JSON-Payload einer erwarteten
        Form entspricht, bevor man versucht, ihn zu verwenden.
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
        Bibliotheken wie <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python) und{" "}
        <code>JSON.NET Schema</code> (.NET) können ein JSON-Dokument zur Laufzeit gegen ein Schema
        validieren – falsch formatierte Payloads an der API-Grenze abfangen, bevor sie unerwartete
        Fehler tiefer in der Anwendung verursachen.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        JSONs Einfachheit ist seine größte Stärke. Sechs Werttypen, strenge Quotierungsregeln,
        keine Kommentare, keine nachgestellten Kommas – die Einschränkungen sind klein und das
        Format ist eindeutig. Wenn etwas schiefläuft, ist es fast immer einer von wenigen
        vorhersehbaren Syntaxfehlern. Das fehlerhafte JSON in den{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON-Formatierer</a> einfügen und der
        Fehler wird sofort mit der genauen hervorgehobenen Position sichtbar.
      </p>
      <ToolCTA slug="json-formatter" variant="card" />
    </div>
  );
}
