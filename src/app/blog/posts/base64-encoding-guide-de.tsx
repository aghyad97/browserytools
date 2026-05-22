export default function Content() {
  return (
    <div>
      <p>
        Öffnen Sie eine beliebige moderne Webanwendung, untersuchen Sie eine HTTP-Anfrage, werfen Sie einen Blick auf
        ein Kubernetes-Manifest oder spähen Sie in ein JWT-Token — Base64 ist überall. Es ist eines jener grundlegenden
        Kodierungsverfahren, denen Entwickler ständig begegnen, das sie aber selten innehalten, um es vollständig zu
        verstehen. Dieser Leitfaden erklärt, was Base64 ist, wie es auf Byte-Ebene funktioniert, wo es in realen Systemen
        eingesetzt wird und wann Sie dazu greifen sollten (und wann nicht).
      </p>
      <p>
        Sie können jede Base64-Zeichenkette sofort mit dem{" "}
        <a href="/tools/base64">BrowseryTools Base64-Encoder/Decoder</a> kodieren und dekodieren — kostenlos, ohne
        Anmeldung, und nichts verlässt jemals Ihren Browser.
      </p>

      <h2>Warum gibt es Base64?</h2>
      <p>
        Um Base64 zu verstehen, müssen Sie das Problem verstehen, das es löst. In den Anfangstagen des Internets waren
        viele Kommunikationsprotokolle — insbesondere E-Mail — rund um 7-Bit-ASCII-Text konzipiert. ASCII definiert 128
        Zeichen mit 7 Bit pro Zeichen. Binärdaten (Bilder, Dokumente, ausführbare Dateien) verwenden alle 8 Bit pro
        Byte und erzeugen Byte-Werte, die keine ASCII-Darstellung hatten und die ältere Systeme verwerfen, verstümmeln
        oder als Steuerbefehle interpretieren würden.
      </p>
      <p>
        Der MIME-Standard (Multipurpose Internet Mail Extensions), 1991 eingeführt, um E-Mails das Mitführen von
        Anhängen zu ermöglichen, brauchte eine Möglichkeit, beliebige Binärdaten durch diese 7-Bit-sauberen Kanäle zu
        übertragen. Die Lösung bestand darin, Binärdaten unter ausschließlicher Verwendung einer sicheren Teilmenge
        druckbarer ASCII-Zeichen neu zu kodieren — einer, auf die sich jedes System einigte und die es originalgetreu
        übertragen würde. Base64 wurde zur Standardkodierung für diesen Zweck, und der Name beschreibt den Ansatz:
        Verwenden Sie einen Satz von 64 sicheren Zeichen, um beliebige Binärdaten darzustellen.
      </p>

      <h2>Das 64-Zeichen-Alphabet</h2>
      <p>
        Base64 verwendet genau 64 Zeichen, weshalb 6 Bit Eingabe stets durch ein Base64-Zeichen dargestellt werden
        können (2<sup>6</sup> = 64). Das in RFC 4648 definierte Standardalphabet lautet:
      </p>
      <ul>
        <li>Großbuchstaben <code>A</code> bis <code>Z</code> — Werte 0 bis 25</li>
        <li>Kleinbuchstaben <code>a</code> bis <code>z</code> — Werte 26 bis 51</li>
        <li>Ziffern <code>0</code> bis <code>9</code> — Werte 52 bis 61</li>
        <li><code>+</code> — Wert 62</li>
        <li><code>/</code> — Wert 63</li>
      </ul>
      <p>
        Ein 65. Zeichen — das Gleichheitszeichen <code>=</code> — wird als Auffüllung verwendet, repräsentiert aber
        keine Daten. Die Auffüllung stellt sicher, dass die Länge der kodierten Ausgabe stets ein Vielfaches von 4
        Zeichen ist, was das Dekodieren vereinfacht.
      </p>

      <h2>Wie die Base64-Kodierung funktioniert: 3 Bytes → 4 Zeichen</h2>
      <p>
        Base64 funktioniert, indem es 3 Bytes Eingabe (24 Bit) nimmt und sie in vier 6-Bit-Gruppen aufteilt. Jede
        6-Bit-Gruppe bildet auf ein Zeichen im Base64-Alphabet ab. Da aus 3 Bytes 4 Zeichen werden, vergrößert die
        Base64-Kodierung die Größe der Daten um genau ein Drittel (33 %).
      </p>
      <p>
        Gehen wir ein konkretes Beispiel durch: das Kodieren der ASCII-Zeichenkette <code>"Man"</code>.
      </p>
      <p>
        Schritt 1 — Wandeln Sie jedes Zeichen in seinen ASCII-Byte-Wert und dann in Binär um:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Schritt 2 — Verketten Sie die 24 Bit zu einem Strom:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Schritt 3 — Bilden Sie jede 6-Bit-Gruppe auf das Base64-Alphabet ab:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>6-Bit-Gruppe</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Dezimalwert</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64-Zeichen</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Die Base64-Kodierung von <code>"Man"</code> ist <code>TWFu</code>. Sie können das mit dem{" "}
        <a href="/tools/base64">BrowseryTools Base64-Tool</a> überprüfen. Wenn die Eingabelänge kein Vielfaches von 3
        ist, werden Auffüllzeichen (<code>=</code> oder <code>==</code>) angehängt, um die Ausgabe auf ein Vielfaches
        von 4 Zeichen zu bringen. Zum Beispiel kodiert <code>"Ma"</code> zu <code>TWE=</code> und <code>"M"</code>{" "}
        kodiert zu <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Häufiges Missverständnis:</strong> Base64 ist Kodierung, keine Verschlüsselung. Der Vorgang ist von
        jedem vollständig umkehrbar, ohne jeglichen Schlüssel oder Passwort. Base64-kodierte Daten in einer URL, einem
        Header oder einer Datei zu sehen bedeutet nicht, dass diese Daten in irgendeiner Weise geschützt sind — es ist
        lediglich eine andere Darstellung derselben Bytes. Jeder, der die Zeichenkette kopieren kann, kann sie sofort
        dekodieren.
      </div>

      <h2>Häufige Anwendungsfälle</h2>

      <h3>Bilder in HTML und CSS einbetten</h3>
      <p>
        Anstatt eine separate HTTP-Anfrage für ein kleines Bild oder Symbol zu stellen, können Sie es direkt in Ihr
        HTML oder CSS als Daten-URI einbetten. Der Browser dekodiert die Base64-Zeichenkette und rendert das Bild ohne
        einen Netzwerk-Roundtrip. Das ist nützlich für kleine Assets wie Favicons, Lade-Spinner oder Inline-Symbole in
        E-Mail-Vorlagen, bei denen das Laden externer URLs blockiert sein kann.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Binärdaten in JSON-APIs</h3>
      <p>
        JSON ist ein Textformat. Wenn eine API Binärdaten übertragen muss — eine Datei, einen kryptografischen
        Schlüssel, eine Signatur, ein Bild — innerhalb einer JSON-Nutzlast, kann sie keine Roh-Bytes einschließen. Die
        Base64-Kodierung der Binärdaten verwandelt sie in eine einfache Zeichenkette, die JSON ohne Probleme mitführen
        kann. Viele APIs, die Dateiinhalte, Audio-Samples oder Bilder in JSON-Antworten zurückgeben, verwenden diesen
        Ansatz.
      </p>

      <h3>HTTP-Basic-Authentifizierung</h3>
      <p>
        Das HTTP-Basic-Auth-Verfahren sendet Zugangsdaten im <code>Authorization</code>-Header als Base64-Kodierung von
        <code>username:password</code>. Zum Beispiel werden die Zugangsdaten <code>admin:secret</code>{" "}
        zur Zeichenkette <code>YWRtaW46c2VjcmV0</code>, und der vollständige Header sieht so aus:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        Das ist nicht verschlüsselt — es ist nur kodiert. Basic Auth muss stets über HTTPS verwendet werden, niemals
        über einfaches HTTP, weil die Zugangsdaten von jedem, der die Anfrage abfängt, trivial dekodiert werden können.
      </p>

      <h3>JWT-Nutzlasten</h3>
      <p>
        JSON Web Tokens kodieren ihren Header und ihre Nutzlast mit Base64URL (einer URL-sicheren Variante, die unten
        beschrieben wird). Die Claims des Tokens — Benutzer-ID, Ablaufzeit, Rollen — werden in der Nutzlast als
        Base64URL-kodiertes JSON-Objekt gespeichert. Auch hier handelt es sich nicht um Verschlüsselung: Die Nutzlast
        ist für jeden, der das Token besitzt, vollständig lesbar.
      </p>

      <h3>Kubernetes Secrets</h3>
      <p>
        Kubernetes speichert Secret-Werte als Base64-kodierte Zeichenketten in YAML-Manifesten. Hier ein echtes Beispiel
        eines Kubernetes Secret:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        Um herauszufinden, was diese Werte tatsächlich sind, fügen Sie <code>YWRtaW4=</code> in den{" "}
        <a href="/tools/base64">BrowseryTools Base64-Decoder</a> ein. Das Ergebnis ist <code>admin</code>. Fügen Sie{" "}
        <code>cGFzc3dvcmQxMjM=</code> ein und Sie erhalten <code>password123</code>. Kubernetes kodiert Secret-Werte
        mit Base64 zur sicheren YAML-Formatierung, nicht zur Sicherheit — die eigentliche Sicherheit kommt von
        Kubernetes RBAC und der Verschlüsselung im Ruhezustand, nicht von der Kodierung selbst.
      </p>

      <h2>Die Base64URL-Variante</h2>
      <p>
        Standard-Base64 verwendet zwei Zeichen, die in URLs eine Sonderbedeutung haben: <code>+</code> (das in der
        Formularkodierung ein Leerzeichen bedeutet) und <code>/</code> (das ein Pfadtrenner ist). Wenn
        Base64-kodierte Daten in einer URL, einem Abfrageparameter oder einem Dateinamen erscheinen müssen, verursachen
        diese Zeichen Probleme.
      </p>
      <p>
        Base64URL löst dies durch Ersetzung:
      </p>
      <ul>
        <li><code>+</code> wird durch <code>-</code> (Bindestrich) ersetzt</li>
        <li><code>/</code> wird durch <code>_</code> (Unterstrich) ersetzt</li>
        <li>Die nachfolgende <code>=</code>-Auffüllung wird oft weggelassen</li>
      </ul>
      <p>
        Base64URL wird in JWTs, OAuth-Tokens und jedem Kontext verwendet, in dem die kodierte Zeichenkette die
        URL-Übertragung ohne Prozentkodierung überstehen muss. Das{" "}
        <a href="/tools/base64">BrowseryTools Base64-Tool</a> unterstützt sowohl die Standard- als auch die
        URL-sichere Variante.
      </p>

      <h2>Wann Sie Base64 NICHT verwenden sollten</h2>
      <p>
        Base64 ist in bestimmten Situationen das richtige Werkzeug, wird aber häufig missbraucht. Hier ist, wann Sie es
        meiden sollten:
      </p>
      <ul>
        <li>
          <strong>Große Dateien:</strong> Base64 vergrößert die Datengröße um ~33 %. Ein 10-MB-Bild wird
          Base64-kodiert zu rund 13,3 MB. Das Einbetten großer Dateien als Daten-URIs oder Base64-Zeichenketten in JSON
          verlangsamt das Parsen, erhöht den Speicherverbrauch und verschwendet Bandbreite. Verwenden Sie für alles, was
          nicht trivial groß ist, direkte Dateiübertragungen oder Object-Storage-URLs.
        </li>
        <li>
          <strong>Sicherheit:</strong> Verwenden Sie Base64 niemals als Sicherheitsmaßnahme. Es bietet null
          Vertraulichkeit. Wenn Daten sensibel sind, verwenden Sie eine echte Verschlüsselung (AES-GCM, RSA usw.).
        </li>
        <li>
          <strong>Speicherung:</strong> Binärdaten als Base64 in einer Datenbankspalte zu speichern, verschwendet 33 %
          mehr Platz im Vergleich zur Speicherung der Roh-Bytes in einer Binärspalte. Verwenden Sie
          datenbank-native Binärtypen (BYTEA in PostgreSQL, BLOB in MySQL), wenn Sie Binärdaten in großem Umfang
          speichern.
        </li>
      </ul>

      <h2>Base64 vs. Hex-Kodierung: Ein Vergleich</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Eigenschaft</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Zeichensatz</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 Zeichen)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 Zeichen)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Größen-Overhead</strong></td>
              <td style={{padding: "12px 16px"}}>~33 % größer</td>
              <td style={{padding: "12px 16px"}}>~100 % größer (2 Zeichen pro Byte)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Menschliche Lesbarkeit</strong></td>
              <td style={{padding: "12px 16px"}}>Gering — nicht erkennbar</td>
              <td style={{padding: "12px 16px"}}>Mäßig — auf Byte-Ebene lesbar</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Häufige Anwendungsfälle</strong></td>
              <td style={{padding: "12px 16px"}}>E-Mail-Anhänge, JWT, Daten-URIs, API-Nutzlasten</td>
              <td style={{padding: "12px 16px"}}>Kryptografische Hashes, Prüfsummen, Farbcodes, MAC-Adressen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>URL-sicher?</strong></td>
              <td style={{padding: "12px 16px"}}>Nur mit der Base64URL-Variante</td>
              <td style={{padding: "12px 16px"}}>Ja — alle Zeichen sind URL-sicher</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bits pro Zeichen</strong></td>
              <td style={{padding: "12px 16px"}}>6 Bit</td>
              <td style={{padding: "12px 16px"}}>4 Bit</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Verwenden Sie Base64, wenn Sie eine kompakte Binär-zu-Text-Kodierung benötigen und die Breite des Zeichensatzes
        keine Probleme bereitet. Verwenden Sie Hex, wenn die menschliche Inspektion einzelner Byte-Werte wichtig ist —
        Hash-Digests, Prüfsummen und kryptografische Ausgaben werden traditionell in Hex angezeigt, gerade weil jedes
        Hex-Zeichen direkt auf 4 Bit abbildet, wodurch Byte-Grenzen trivial sichtbar werden.
      </p>

      <h2>Base64 in Code kodieren und dekodieren</h2>
      <p>
        Die meisten Sprachen bieten eine integrierte Base64-Unterstützung. Hier sind schnelle Einzeiler für gängige
        Umgebungen:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        Für schnelles Ad-hoc-Kodieren oder -Dekodieren, ohne Code zu schreiben, ist das{" "}
        <a href="/tools/base64">BrowseryTools Base64-Tool</a> die schnellste Option — fügen Sie Ihre Zeichenkette ein,
        wählen Sie Kodieren oder Dekodieren, und das Ergebnis erscheint sofort. Nichts wird an einen Server gesendet.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Datenschutzgarantie:</strong> Der BrowseryTools Base64-Encoder und -Decoder verarbeitet alles lokal in
        Ihrem Browser mithilfe von JavaScript. Wenn Sie sensible Daten kodieren — API-Schlüssel, Secrets, private
        Konfiguration —, berührt es niemals einen Server. Ihre Daten bleiben auf Ihrem Gerät.
      </div>

      <h2>Base64 sofort kodieren und dekodieren</h2>
      <p>
        Ob Sie ein Kubernetes-Secret dekodieren, eine JWT-Nutzlast untersuchen, einen Daten-URI für ein Inline-Bild
        erstellen oder einfach neugierig sind, was eine Base64-Zeichenkette enthält — der{" "}
        <a href="/tools/base64">BrowseryTools Base64-Encoder/Decoder</a> erledigt es mit einem einzigen Klick. Fügen
        Sie Ihre Eingabe ein, erhalten Sie Ihre Ausgabe. Keine Werbung, keine Anmeldung, keine Daten, die Ihr Gerät
        verlassen.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser Base64-Encoder/Decoder — läuft zu 100 % in Ihrem Browser
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Base64-Tool öffnen →
        </a>
      </div>
    </div>
  );
}
