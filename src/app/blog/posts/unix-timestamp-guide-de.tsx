import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Öffnen Sie eine beliebige Log-Datei. Schauen Sie sich den Ablaufzeitpunkt in einem JWT-Token an.
        Prüfen Sie das Feld <code>created_at</code>{" "}
        in einer API-Antwort. Mit hoher Wahrscheinlichkeit begegnet Ihnen dabei eine Zahl wie{" "}
        <code>1711065600</code> oder <code>1711065600000</code>. Das ist ein Unix-Timestamp — eine
        einfache Ganzzahl, die einen Zeitpunkt repräsentiert. Zu verstehen, wie Unix-Zeit funktioniert,
        woher sie stammt und wie man typische Fallstricke vermeidet, bewahrt Sie vor einer Klasse von
        Fehlern, die schwer zu reproduzieren und gelegentlich in der Produktion peinlich sind.
      </p>
      <ToolCTA slug="unix-timestamp" variant="inline" />
      <p>
        Jeden Unix-Timestamp können Sie mit dem{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix-Timestamp-Konverter</a> in ein
        menschenlesbares Datum umwandeln (und zurück) — kostenlos, ohne Anmeldung, alles läuft in
        Ihrem Browser.
      </p>

      <h2>Was ist ein Unix-Timestamp?</h2>
      <p>
        Ein Unix-Timestamp ist die Anzahl der Sekunden, die seit der Unix-Epoche vergangen sind:
        Mitternacht am 1. Januar 1970, Koordinierte Weltzeit (UTC). Dieser Moment — 00:00:00 UTC am
        1970-01-01 — wurde als Referenzpunkt gewählt, als das Unix-Betriebssystem Anfang der 1970er
        Jahre entwickelt wurde. Es war ein aktuelles, rundes Datum, das Berechnungen auf der damaligen
        Hardware unkompliziert machte.
      </p>
      <p>
        Die Eleganz der Unix-Zeit liegt darin, dass jeder Zeitpunkt als einzelne Ganzzahl dargestellt
        wird. Zwei Timestamps zu vergleichen ist eine Subtraktion. Zu prüfen, ob etwas abgelaufen ist,
        ist ein Vergleich. Ein Intervall hinzuzufügen ist eine Addition. Keine Zeitzonen, keine
        Kalenderarithmetik, keine Sommerzeit — nur eine Zahl.
      </p>
      <p>
        Stand 2026 beträgt der aktuelle Unix-Timestamp ungefähr <code>1.774.000.000</code>.
        Jede Sekunde erhöht sich dieser Wert um 1.
      </p>

      <h2>Das Y2K38-Problem</h2>
      <p>
        Wird Unix-Zeit als vorzeichenbehaftete 32-Bit-Ganzzahl gespeichert — was in vielen frühen
        Implementierungen der Fall war — beträgt der Maximalwert <code>2.147.483.647</code>. Diese Zahl
        entspricht dem 19. Januar 2038 um 03:14:07 UTC. Nach diesem Moment läuft eine vorzeichenbehaftete
        32-Bit-Ganzzahl auf eine große negative Zahl über, und nicht aktualisierte Systeme interpretieren
        Timestamps falsch.
      </p>
      <p>
        Dies ist das Jahr-2038-Problem (Y2K38) — das Unix-Äquivalent des Y2K-Fehlers. Moderne Systeme
        verwenden 64-Bit-Ganzzahlen für Timestamps, was den darstellbaren Bereich auf rund 292 Milliarden
        Jahre in beide Richtungen ausdehnt — für alle praktischen Zwecke unbegrenzt. Eingebettete Systeme,
        Legacy-Datenbanken mit 32-Bit-Timestamp-Spalten und älterer C-Code, der <code>time_t</code> als
        32-Bit-Typ verwendet, sind jedoch nach wie vor gefährdet.
      </p>

      <h2>Den aktuellen Timestamp ermitteln</h2>
      <p>
        So ermitteln Sie den aktuellen Unix-Timestamp in den gängigsten Programmiersprachen:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — returns milliseconds, divide by 1000 for seconds
const nowMs = Date.now();           // e.g. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // e.g. 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Timestamps in menschenlesbare Datumsangaben umwandeln</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — from seconds
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>Fehler Nr. 1: Millisekunden vs. Sekunden</h2>
      <p>
        JavaScripts <code>Date.now()</code> gibt Millisekunden zurück. Der Unix-Standard — und praktisch
        jede andere Sprache, Datenbank und API — verwendet Sekunden. Diese Diskrepanz ist die bei weitem
        häufigste Quelle von Timestamp-Fehlern.
      </p>
      <p>
        Die Symptome sind unverkennbar: Datumsangaben erscheinen als 1970 (Timestamp versehentlich durch
        1000 geteilt oder als Sekunden behandelt, obwohl es Millisekunden sind), oder Datumsangaben
        erscheinen im Jahr 56.000+ (Sekunden als Millisekunden behandelt und dann erneut geteilt). Ein
        Wert um <code>1.700.000.000</code> sind mit großer Sicherheit Sekunden. Ein Wert um{" "}
        <code>1.700.000.000.000</code> sind mit großer Sicherheit Millisekunden.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Zeitzonenproblem bei Timestamps</h2>
      <p>
        Unix-Timestamps sind immer in UTC — sie stellen einen einzelnen absoluten Zeitpunkt dar, ohne
        angehängte Zeitzone. Die Zeitzonenfrage stellt sich erst auf der Darstellungsebene, wenn Sie
        einen Timestamp in ein menschenlesbares Format umwandeln.
      </p>
      <p>
        Der häufigste Fehler ist die unbewusste Verwendung lokaler Zeitzonen-Methoden.{" "}
        <code>new Date(ts).toLocaleDateString()</code> in JavaScript gibt das Datum in der lokalen
        Zeitzone des Browsers zurück. Wenn Ihr Server einen Timestamp um 23:00 UTC generiert und ein
        Nutzer in UTC+0 sowie ein Nutzer in UTC+1 ihn beide anzeigen, sehen sie unterschiedliche
        Kalenderdaten. Ob das korrekt ist, hängt von der Produktanforderung ab — aber es muss eine
        bewusste Entscheidung sein, keine versehentliche.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
}).format(date);  // "Friday, March 22, 2024"`}
      </pre>

      <h2>Timestamps in Datenbanken</h2>
      <p>
        Datenbanken bieten zwei Hauptoptionen zur Speicherung von Datumsangaben: einen{" "}
        <code>TIMESTAMP</code>-Spaltentyp (der einen absoluten Zeitpunkt speichert) und einen{" "}
        <code>DATE</code>- oder <code>DATETIME</code>-Spaltentyp (der eine Kalendardarstellung ohne
        inhärente Zeitzone speichert).
      </p>
      <p>
        Für Felder wie <code>created_at</code>, <code>updated_at</code> und Ereignis-Timestamps
        verwenden Sie stets eine <code>TIMESTAMP WITH TIME ZONE</code>-Spalte (oder das
        datenbankspezifische Äquivalent) anstelle einer einfachen Ganzzahl. Dadurch kann die Datenbank
        Zeitzonenkonvertierung und -vergleiche korrekt handhaben, und Abfragen wie „Ereignisse der
        letzten 24 Stunden" sind unabhängig von den Zeitzoneneinstellungen des Servers korrekt.
      </p>
      <p>
        Wenn Sie einen Unix-Timestamp als rohe Ganzzahl speichern müssen (aus Kompatibilitätsgründen
        oder für maximale Portabilität), dokumentieren Sie klar, ob es sich um Sekunden oder
        Millisekunden handelt, und halten Sie dies im gesamten Schema konsequent durch.
      </p>

      <h2>Timestamps in JWTs und APIs</h2>
      <p>
        JSON Web Tokens (JWTs) verwenden Unix-Timestamps (in Sekunden) für ihre Zeitangaben:
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — Ausstellungszeitpunkt: der Zeitpunkt, zu dem das Token erstellt wurde</li>
        <li><strong><code>exp</code></strong> — Ablaufzeit: der Zeitpunkt, nach dem das Token nicht mehr akzeptiert werden sollte</li>
        <li><strong><code>nbf</code></strong> — Nicht vor: das Token sollte vor diesem Zeitpunkt nicht verwendet werden</li>
      </ul>
      <p>
        Die Überprüfung des JWT-Ablaufs ist ein einfacher Vergleich:{" "}
        <code>exp &gt; Math.floor(Date.now() / 1000)</code>. Wenn die aktuelle Zeit in Sekunden größer
        als <code>exp</code> ist, ist das Token abgelaufen. Validieren Sie <code>exp</code> stets
        serverseitig — verlassen Sie sich niemals allein auf clientseitige Ablaufprüfungen.
      </p>

      <h2>Schnellreferenz: Timestamp-Konvertierungen</h2>
      <p>
        Für schnelle und präzise Konvertierungen zwischen Unix-Timestamps und menschenlesbaren Daten
        verwenden Sie den{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix-Timestamp-Konverter</a>. Fügen Sie einen
        Timestamp ein, um das entsprechende UTC- und lokale Datum zu sehen, oder geben Sie ein Datum
        ein, um seinen Timestamp zu erhalten. Alles läuft im Browser — kein Server, kein Tracking.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        Unix-Timestamps sind eine universelle, eindeutige Methode zur Darstellung von Zeitpunkten. Die
        wichtigsten Regeln: Sie sind immer UTC, immer in Sekunden (außer in JavaScript, wo{" "}
        <code>Date.now()</code> Millisekunden zurückgibt), und immer eine positive Ganzzahl für jedes
        Datum nach 1970. Behandeln Sie die Unterscheidung zwischen Millisekunden und Sekunden explizit,
        verwenden Sie UTC für Speicherung und Übertragung, und konvertieren Sie in Ortszeit nur auf der
        Darstellungsebene.
      </p>
      <ToolCTA slug="unix-timestamp" variant="card" />
    </div>
  );
}
