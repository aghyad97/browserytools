import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        URLs sehen von außen einfach aus — eine Zeichenkette, die auf eine Ressource verweist. Darunter
        folgen sie jedoch einer strikten Grammatik, die nur eine bestimmte Menge von Zeichen erlaubt.
        Sobald Sie ein Leerzeichen, ein kaufmännisches Und oder ein Nicht-ASCII-Zeichen ohne Kodierung
        in eine URL einbetten, entstehen Fehler, die schwer zu debuggen sind. Die Prozent-Kodierung
        (allgemein URL-Kodierung genannt) ist der Mechanismus, der beliebige Daten sicher in einer URL
        unterbringbar macht.
      </p>
      <ToolCTA slug="url-encoder" variant="inline" />
      <p>
        URLs können Sie sofort mit dem{" "}
        <a href="/tools/url-encoder">BrowseryTools URL-Encoder/Decoder</a> kodieren und dekodieren —
        kostenlos, ohne Anmeldung, alles läuft in Ihrem Browser.
      </p>

      <h2>Warum Sonderzeichen URLs beschädigen</h2>
      <p>
        Die URL-Spezifikation (RFC 3986) reserviert bestimmte Zeichen für strukturelle Zwecke. Das{" "}
        <code>?</code>{" "}
        trennt den Pfad vom Query-String. Das <code>&amp;</code> trennt Query-Parameter voneinander.
        Das <code>#</code> markiert einen Fragment-Bezeichner. Der <code>/</code> trennt Pfadsegmente.
        Enthält Ihre Datenpayload eines dieser Zeichen, kann ein URL-Parser nicht unterscheiden, ob es
        sich um Ihre Daten oder die URL-Struktur selbst handelt.
      </p>
      <p>
        Betrachten Sie eine Suchanfrage nach <code>rock &amp; roll</code>. Die naive Konstruktion der
        URL ergibt:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── looks like a new parameter begins here
          └── this & splits q from a phantom second parameter`}
      </pre>
      <p>
        Der Parser liest <code>q=rock </code> (mit nachfolgendem Leerzeichen) als ersten Parameter und
        stößt dann auf den Beginn eines zweiten Parameters namens <code> roll</code>. Beide Werte sind
        falsch. Die korrekte URL lautet <code>/search?q=rock%20%26%20roll</code> — das Leerzeichen wird
        zu <code>%20</code> und das kaufmännische Und zu <code>%26</code>.
      </p>

      <h2>Was Prozent-Kodierung tatsächlich bewirkt</h2>
      <p>
        Die Prozent-Kodierung wandelt ein Byte in eine dreistellige Zeichenfolge um: ein Prozentzeichen
        gefolgt von zwei großgeschriebenen Hexadezimalziffern, die den Bytewert darstellen. Das
        Leerzeichen (ASCII-Byte 32, Hex <code>0x20</code>) wird zu <code>%20</code>. Das At-Zeichen
        (<code>@</code>, ASCII 64, Hex{" "}
        <code>0x40</code>) wird zu <code>%40</code>. Die Regel lautet:
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
        Bei Multi-Byte-Unicode-Zeichen (alles außerhalb von ASCII) wird das Zeichen zunächst in
        UTF-8-Bytes kodiert, und jedes Byte wird anschließend prozent-kodiert. Das Eurozeichen{" "}
        <code>€</code> besteht aus drei UTF-8-Bytes und wird daher zu drei Prozent-kodierten Sequenzen:{" "}
        <code>%E2%82%AC</code>.
      </p>

      <h2>Sichere Zeichen vs. reservierte Zeichen</h2>
      <p>
        Nicht jedes Zeichen muss kodiert werden. RFC 3986 definiert zwei Gruppen, die unverändert
        verwendet werden dürfen:
      </p>
      <ul>
        <li><strong>Nicht reservierte Zeichen</strong> — A–Z, a–z, 0–9, Bindestrich, Unterstrich, Punkt, Tilde. Diese haben keine besondere Bedeutung und müssen nie kodiert werden.</li>
        <li><strong>Reservierte Zeichen</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. Diese sind in ihrer strukturellen Position sicher, müssen aber kodiert werden, wenn sie als Datenwerte auftreten.</li>
      </ul>
      <p>
        Alles andere — Leerzeichen, Unicode, Steuerzeichen, die meisten Sonderzeichen — muss immer
        kodiert werden.
      </p>

      <h2>encodeURI vs. encodeURIComponent: Der entscheidende Unterschied</h2>
      <p>
        JavaScript verfügt über zwei eingebaute Kodierungsfunktionen, und ihre Verwechslung ist einer
        der häufigsten URL-Kodierungsfehler in Webanwendungen.
      </p>
      <p>
        <code>encodeURI()</code> ist dafür ausgelegt, eine vollständige URL zu kodieren. Reservierte
        Zeichen werden unverändert gelassen, da sie in einer vollständigen URL strukturell bedeutsam
        sind. Sie würden diese Funktion verwenden, wenn Sie eine vollständige URL haben, die
        Leerzeichen oder Unicode enthält, aber eine gültige Struktur aufweist:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> ist dafür ausgelegt, einen einzelnen Wert zu kodieren — einen
        Query-Parameter-Wert, ein Pfadsegment, alles, was als reine Datenpayload behandelt werden muss.
        Auch reservierte Zeichen werden kodiert, einschließlich <code>&amp;</code>, <code>=</code>,{" "}
        <code>?</code> und <code>/</code>:
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
        Die Faustregel: Beim Aufbau einer URL verwenden Sie <code>encodeURIComponent()</code> für jeden
        einzelnen Parameterwert, niemals für die gesamte URL. Verwenden Sie <code>encodeURI()</code>{" "}
        nur auf einer vollständigen URL, die Sie normalisieren möchten. In modernem Code bevorzugen Sie
        die <code>URL</code>- und <code>URLSearchParams</code>-APIs gegenüber manueller Kodierung —
        diese übernehmen die Kodierung automatisch und korrekt.
      </p>

      <h2>Fallstricke bei der Query-String-Kodierung</h2>
      <p>
        Beim Kodieren von Query-Strings treten wiederholt subtile Fehler auf. Das Pluszeichen{" "}
        <code>+</code> verdient besondere Erwähnung: Im Format{" "}
        <code>application/x-www-form-urlencoded</code> (dem Format, mit dem HTML-Formulare übermittelt
        werden) wird ein Leerzeichen als <code>+</code> statt als <code>%20</code> kodiert. Dies ist
        eine veraltete Konvention, die älter als RFC 3986 ist. Wenn Ihr Backend URL-Dekodierung gemäß
        Form-Kodierungsregeln durchführt und das Frontend <code>%20</code> sendet, funktioniert es.
        Sendet das Frontend jedoch <code>+</code> und das Backend dekodiert nach RFC 3986, bleibt das{" "}
        <code>+</code> als wörtliches Pluszeichen erhalten — kein Leerzeichen.
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

      <h2>Wie Formulardaten URL-kodiert werden</h2>
      <p>
        Wenn ein HTML-Formular mit <code>method="GET"</code> abgesendet wird, serialisiert der Browser
        die Formularfelder mithilfe von <code>application/x-www-form-urlencoded</code> in einen
        Query-String. Jeder Feldname und -wert wird kodiert (Leerzeichen als <code>+</code>,
        Sonderzeichen als <code>%XX</code>), und Felder werden mit <code>&amp;</code> verknüpft. Bei{" "}
        <code>method="POST"</code>-Formularen ohne <code>enctype</code>-Attribut wird dieselbe Kodierung
        verwendet, die Daten landen jedoch im Request-Body statt in der URL.
      </p>
      <p>
        Dies ist auch das Format, das <code>fetch()</code> verwendet, wenn Sie ein{" "}
        <code>URLSearchParams</code>-Objekt als Body übergeben, und es wird von den meisten
        serverseitigen Frameworks beim Lesen von Formularübermittlungen automatisch dekodiert.
      </p>

      <h2>Base64 in URLs</h2>
      <p>
        Standard-Base64 verwendet <code>+</code> und <code>/</code> — beide haben in URLs eine besondere
        Bedeutung. Wenn Base64-kodierte Daten in einer URL erscheinen müssen (ein gängiges Muster für
        Tokens, Bilddaten oder kryptografische Signaturen), verwenden Sie stattdessen die
        Base64URL-Variante. Sie ersetzt <code>+</code> durch{" "}
        <code>-</code> und <code>/</code> durch <code>_</code> und erzeugt so eine Zeichenkette, die
        in jeder URL-Position ohne weitere Kodierung sicher ist. JWTs verwenden dieses Format für ihre
        Header- und Payload-Segmente.
      </p>

      <h2>Reale Kodierungsfehler</h2>
      <p>
        Einige Fehlermuster, die in Produktionsanwendungen immer wieder auftreten:
      </p>
      <ul>
        <li><strong>Doppelte Kodierung</strong> — eine bereits kodierte URL erneut kodieren. <code>%20</code> wird zu <code>%2520</code>, weil <code>%</code> selbst zu <code>%25</code> kodiert wird. Prüfen Sie immer, ob ein Wert bereits kodiert ist, bevor Sie ihn erneut kodieren.</li>
        <li><strong>Fehlende encodeURIComponent bei redirect_uri</strong> — OAuth-Flows übergeben eine <code>redirect_uri</code> als Query-Parameter. Enthält diese ein <code>?</code> oder <code>&amp;</code> und ist nicht kodiert, parst der Auth-Server diese Zeichen als Teil der äußeren URL-Struktur und bricht die Weiterleitung.</li>
        <li><strong>Nicht-UTF-8-Kodierung</strong> — ältere Systeme oder falsch konfigurierte Server kodieren Zeichenketten manchmal mit ISO-8859-1 statt UTF-8. Die Bytefolge für <code>é</code> unterscheidet sich zwischen beiden. Setzen Sie UTF-8 auf beiden Seiten konsequent durch.</li>
        <li><strong>Rohe URLs protokollieren</strong> — das Protokollieren einer URL mit kodierten Nutzerdaten kann irreführende Logs erzeugen, wenn Ihr Log-Viewer Prozentsequenzen automatisch dekodiert und so verbirgt, was tatsächlich auf der Leitung gesendet wurde.</li>
      </ul>

      <h2>URLs sofort kodieren und dekodieren</h2>
      <p>
        Ob Sie einen OAuth-Redirect debuggen, einen Query-String manuell aufbauen, eine fehlerhafte
        API-Anfrage untersuchen oder einfach verstehen möchten, was eine prozent-kodierte URL enthält —
        der{" "}
        <a href="/tools/url-encoder">BrowseryTools URL-Encoder/Decoder</a> erledigt das sofort. Fügen
        Sie Ihre Zeichenkette ein, wählen Sie Kodieren oder Dekodieren, und sehen Sie das Ergebnis
        unmittelbar. Keine Serveraufrufe, keine Anmeldung.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser URL-Encoder / Decoder — läuft 100 % in Ihrem Browser
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          URL-Encoder öffnen →
        </a>
      </div>
      <ToolCTA slug="url-encoder" variant="card" />
    </div>
  );
}
