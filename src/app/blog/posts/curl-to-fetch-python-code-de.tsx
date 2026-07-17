import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Sie haben den API-Aufruf gefunden, den Sie brauchen — aber er ist in cURL geschrieben, und
        Sie arbeiten in JavaScript oder Python. Oder Sie haben in den DevTools Ihres Browsers einen
        Request rechts angeklickt und &ldquo;Als cURL kopieren&rdquo; gewählt, und jetzt haben Sie
        eine Wand von Flags, die Sie in echten Code umwandeln müssen. cURL manuell zu übersetzen
        ist mühsam: Jedes <code>-H</code>, <code>-d</code>,{" "}
        <code>-u</code> und <code>-X</code> muss dem richtigen Argument in Ihrer Sprache zugeordnet
        werden, und ein einziger vergessener Header bricht den Request.
      </p>
      <ToolCTA slug="curl-converter" variant="inline" />
      <p>
        Der <a href="/tools/curl-converter">BrowseryTools cURL-Konverter</a> erledigt das sofort —
        fügen Sie einen cURL-Befehl ein und erhalten Sie sauberen Code in JavaScript <code>fetch</code>,
        Python <code>requests</code>, Node.js und mehr, alles in Ihrem Browser ohne Upload. Dieser
        Leitfaden zeigt die Flag-zu-Code-Zuordnung, damit Sie die Ausgabe lesen und ihr vertrauen
        können.
      </p>

      <h2>Der &ldquo;Als cURL kopieren&rdquo;-Workflow</h2>
      <p>
        Der schnellste Weg zu einem funktionierenden Request ist, den Browser ihn für Sie schreiben
        zu lassen. Öffnen Sie DevTools (F12), gehen Sie zum Tab <strong>Netzwerk</strong>, führen
        Sie die Aktion aus, die Sie replizieren möchten, dann rechtsklicken Sie auf den Request und
        wählen Sie <strong>Kopieren &rarr; Als cURL kopieren</strong>. Sie haben jetzt einen
        cURL-Befehl mit den genauen Headern, Cookies und dem Body, den die echte Seite gesendet hat.
        Fügen Sie ihn in den{" "}
        <a href="/tools/curl-converter">Konverter</a> ein und erhalten Sie denselben Request als
        Code, den Sie in Ihr Projekt einfügen können.
      </p>

      <h2>Wie cURL-Flags auf Code abgebildet werden</h2>
      <p>
        Sobald Sie die wenigen Flags kennen, die wichtig sind, können Sie jeden cURL-Befehl auf
        einen Blick lesen:
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
        Ein Header wie <code>-H &quot;Authorization: Bearer abc123&quot;</code> wird zu einem Eintrag
        im <code>headers</code>-Objekt. Ein mit <code>-d</code> übergebener Body wird zum
        Request-Body, und wenn der Content-Type JSON ist, wird er entsprechend serialisiert.{" "}
        <code>-u user:pass</code> wird zu einem Basic-Auth-Header. Diese Zuordnung zu kennen ist das,
        was Sie generierten Code überprüfen lässt, statt ihm blind zu vertrauen.
      </p>

      <h2>Derselbe Request in drei Sprachen</h2>
      <p>
        Nehmen Sie einen einfachen authentifizierten POST. In cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>Als JavaScript <code>fetch</code>:</p>
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
      <p>Als Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Beachten Sie, wie Pythons <code>json=</code>-Argument den Body <em>und</em> den
        Content-Type-Header automatisch setzt — ein kleiner idiomatischer Unterschied, den der
        Konverter für Sie übernimmt.
      </p>

      <h2>Häufige Stolperfallen</h2>
      <p>
        <strong>Quoting und Escaping.</strong> cURL-Bodies sind in der Shell in einfache
        Anführungszeichen eingeschlossen; wenn diese JSON mit doppelten Anführungszeichen enthalten,
        schleichen sich bei der manuellen Übersetzung Fehler ein. Einen Konverter das Parsing
        übernehmen zu lassen, beseitigt dieses Risiko.
      </p>
      <p>
        <strong>Implizites POST.</strong> Die Verwendung von <code>-d</code> macht einen Request
        POST, auch ohne <code>-X POST</code>. Wenn Sie nur die sichtbaren Flags übersetzen, erzeugen
        Sie möglicherweise fälschlicherweise ein GET.
      </p>
      <p>
        <strong>Geheimnisse im Befehl.</strong> Ein kopierter cURL-Request enthält oft Live-Tokens
        und Cookies. Da der Konverter vollständig in Ihrem Browser läuft, werden diese Geheimnisse
        nie an einen Server gesendet — aber Sie sollten sie trotzdem bereinigen, bevor Sie Code in
        ein geteiltes Repository oder ein Ticket einfügen.
      </p>

      <h2>Häufig gestellte Fragen</h2>
      <p>
        <strong>In welche Sprachen kann ich konvertieren?</strong> JavaScript fetch, Python requests,
        Node.js und andere gängige Ziele.
      </p>
      <p>
        <strong>Sendet der Konverter meinen Befehl irgendwohin?</strong> Nein. Parsing und
        Konvertierung erfolgen lokal in Ihrem Browser, sodass alle Tokens im Befehl auf Ihrem
        Gerät bleiben.
      </p>
      <p>
        <strong>Kann ich einen &ldquo;Als cURL kopieren&rdquo;-Befehl aus DevTools einfügen?</strong>{" "}
        Ja — das ist eine der besten Anwendungen. Es erfasst die genauen Header und den Body eines
        echten Requests.
      </p>
      <p>
        <strong>Ist es kostenlos?</strong> Ja — kein Konto, keine Limits.
      </p>

      <h2>Jetzt konvertieren</h2>
      <p>
        Öffnen Sie den <a href="/tools/curl-converter">cURL-Konverter</a>, fügen Sie Ihren Befehl
        ein und kopieren Sie den äquivalenten Code. Für einen tieferen Einblick in cURL-Syntax und
        REST-Muster lesen Sie unseren{" "}
        <a href="/blog/curl-converter-guide">Leitfaden zur Konvertierung von API-Requests zwischen Sprachen</a>,
        und um die Antworten zu verstehen, die Sie zurückbekommen, lesen Sie den{" "}
        <a href="/blog/http-status-codes-guide">HTTP-Statuscodes-Leitfaden</a>.
      </p>
      <ToolCTA slug="curl-converter" variant="card" />
    </div>
  );
}
