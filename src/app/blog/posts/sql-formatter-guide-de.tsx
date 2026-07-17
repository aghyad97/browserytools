import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jeder Entwickler kennt die Situation. Man zieht eine langsame Abfrage aus den
        Anwendungsprotokollen, kopiert sie in den Editor und starrt auf eine 300 Zeichen
        lange Wand aus Kleinbuchstaben ohne Leerzeichen, ohne Zeilenumbrüche und ohne
        Erbarmen. Oder man findet eine Stack-Overflow-Antwort mit genau der gesuchten
        Abfrage – aber als Einzeiler. Oder das ORM protokolliert hilfreicherweise das
        generierte SQL – als einzelnen verketteten String. In all diesen Fällen ist die
        rohe Abfrage technisch korrekt, aber praktisch unleserlich.
      </p>
      <ToolCTA slug="sql-formatter" variant="inline" />
      <p>
        SQL zu formatieren geht nicht um Ästhetik. Es geht darum, auf einen Blick zu
        verstehen, was eine Abfrage tut – aus welchen Tabellen sie liest, nach welchen
        Bedingungen sie filtert und welche Spalten sie zurückgibt. Eine gut formatierte
        Abfrage lässt sich in Minuten prüfen, debuggen und optimieren. Eine unformatierte
        kann Stunden verschwenden.
      </p>
      <p>
        Der <a href="/tools/sql-formatter">BrowseryTools SQL-Formatierer</a> ermöglicht es,
        jede SQL-Abfrage einzufügen und sie sofort mit korrekter Einrückung, Großbuchstaben
        für Schlüsselwörter und Klausel-Trennung zu formatieren – alles lokal im Browser
        verarbeitet, keine Abfrage wird jemals an einen Server gesendet.
      </p>

      <h2>Warum unformatiertes SQL so schmerzhaft ist</h2>
      <p>
        SQL ist eine der wenigen Sprachen, in denen Entwickler routinemäßig mit Code
        arbeiten, den sie nicht selbst geschrieben haben und nicht an der Quelle neu
        formatieren können. Die drei häufigsten Quellen für unübersichtliches SQL:
      </p>
      <ul>
        <li>
          <strong>ORM-generierte Abfragen.</strong> Hibernate, SQLAlchemy, ActiveRecord und
          verwandte Frameworks generieren SQL dynamisch. Wenn man die Abfrageprotokollierung
          zur Fehlersuche bei Performance-Problemen aktiviert, erhält man das rohe generierte
          SQL – in der Regel eine einzige Zeile mit dynamischen Parameterwerten, Aliasen wie
          <code>t0_</code> und Join-Bedingungen, die mehrere Lesedurchgänge erfordern.
        </li>
        <li>
          <strong>Abfrageprotokolle aus Produktionsdatenbanken.</strong> MySQLs Slow Query Log
          und PostgreSQLs <code>pg_stat_statements</code> speichern Abfragen so, wie sie
          eingereicht wurden – ohne Formatierung. Unersetzlich für Performance-Analysen, aber
          ohne Neuformatierung kaum lesbar.
        </li>
        <li>
          <strong>Stack Overflow und Dokumentations-Einzeiler.</strong> In Antworten und
          Dokumentationen geteilter Code wird oft auf eine einzige Zeile komprimiert, um
          vertikalen Platz zu sparen. Die Logik stimmt, aber das Layout erschwert die Anpassung
          an das eigene Schema.
        </li>
      </ul>

      <h2>Vorher und nachher: Dieselbe Abfrage, formatiert</h2>
      <p>
        Hier ist eine realistische Abfrage, wie sie in einem Slow Query Log oder ORM-Output
        erscheinen könnte – alles in einer Zeile mit Kleinbuchstaben-Schlüsselwörtern:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>='2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>0 order by total_spent desc limit 20;`}
      </pre>
      <p>
        Nach der Formatierung mit konsistenten SQL-Konventionen wird dieselbe Abfrage sofort
        lesbar:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id)  AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY
    u.id,
    u.name,
    u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 20;`}
      </pre>
      <p>
        Die Struktur ist jetzt sofort erkennbar: Man sieht, dass es sich um einen
        Nutzerbericht handelt, der Bestellanzahl und Gesamtumsatz abruft, auf aktive Nutzer
        ab 2024 gefiltert, nach Nutzer gruppiert und auf die Top 20 Ausgeber begrenzt ist.
        Das hat fünf Sekunden gedauert – statt fünf Minuten.
      </p>

      <h2>SQL-Formatierungskonventionen</h2>
      <p>
        Es gibt keinen einzigen offiziellen SQL-Styleguide, aber eine Reihe weitverbreiteter
        Konventionen hat sich in der Branche durchgesetzt. Diese Konventionen machen SQL für
        jeden Entwickler lesbar, der die Sprache kennt.
      </p>

      <h3>Schlüsselwörter in Großbuchstaben</h3>
      <p>
        SQL-Schlüsselwörter – <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>,{" "}
        <code>JOIN</code>, <code>ON</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,{" "}
        <code>HAVING</code>, <code>LIMIT</code>, <code>INSERT</code>, <code>UPDATE</code>,{" "}
        <code>DELETE</code>, <code>WITH</code>, <code>AS</code>, <code>AND</code>, <code>OR</code>,{" "}
        <code>NOT</code>, <code>IN</code>, <code>LIKE</code>, <code>BETWEEN</code>,{" "}
        <code>IS NULL</code> – sollten in Großbuchstaben geschrieben werden. Tabellen-, Spalten-
        und Aliasnamen sowie Stringliterale bleiben in ihrer natürlichen Schreibweise. Dieser
        visuelle Kontrast zwischen SCHLÜSSELWÖRTERN und Bezeichnern macht Abfragen auf einen
        Blick scanbar.
      </p>

      <h3>Jede Hauptklausel in einer eigenen Zeile</h3>
      <p>
        Jede übergeordnete Klausel beginnt in einer neuen Zeile:{" "}
        <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>GROUP BY</code>,{" "}
        <code>HAVING</code>, <code>ORDER BY</code>, <code>LIMIT</code>. Das verleiht der
        Abfrage ein klares visuelles Gerüst. Beim Öffnen einer formatierten Abfrage findet
        das Auge jede Klausel sofort, da alle am linken Rand (oder auf einem konsistenten
        Einrückungsniveau) beginnen.
      </p>

      <h3>Eingerückte Spaltenlisten und Bedingungen</h3>
      <p>
        Spaltennamen in der <code>SELECT</code>-Liste und Bedingungen in <code>WHERE</code>
        werden um vier Leerzeichen (oder einen Tabulator) eingerückt. Jedes <code>AND</code>{" "}
        und <code>OR</code> in einer <code>WHERE</code>-Klausel beginnt in einer eigenen Zeile
        auf demselben Einrückungsniveau wie die erste Bedingung, sodass einzelne Bedingungen
        einfach hinzugefügt, entfernt oder auskommentiert werden können:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
  AND u.country IN ('US', 'CA', 'GB')`}
      </pre>

      <h3>Kommaposition: Zwei Denkschulen</h3>
      <p>
        Die Debatte über Kommaposition in SQL ähnelt der Diskussion über abschließende Kommas
        in JavaScript. Es gibt zwei zulässige Stile:
      </p>
      <ul>
        <li>
          <strong>Nachgestellte Kommas</strong> (Komma am Ende jeder Zeile): der verbreitetste
          Stil, entspricht der Art und Weise, wie die meisten Entwickler Listen in anderen
          Sprachen schreiben. Nachteil: Das Auskommentieren des letzten Elements erfordert auch
          das Entfernen des nachgestellten Kommas der vorherigen Zeile.
        </li>
        <li>
          <strong>Komma voran</strong> (Komma am Anfang jeder Zeile nach der ersten): erleichtert
          das Auskommentieren einzelner Zeilen ohne Anpassung benachbarter Zeilen. Bevorzugt von
          Teams, die Spaltenlisten während der Entwicklung häufig ändern.
        </li>
      </ul>
      <p>
        Beide sind gültig. Man sollte sich für einen entscheiden und ihn innerhalb eines Projekts
        konsequent anwenden. Der BrowseryTools SQL-Formatierer verwendet standardmäßig
        nachgestellte Kommas, was den meisten Styleguides entspricht und die von den meisten
        Lesern erwartete Konvention ist.
      </p>

      <h3>Ausgerichtete Aliase mit AS</h3>
      <p>
        Aliase sollten immer explizit mit <code>AS</code> vergeben werden – nicht im impliziten
        Stil ohne Schlüsselwort, den manche Dialekte erlauben (<code>COUNT(o.id) order_count</code>).
        Wenn mehrere Aliase in einer <code>SELECT</code>-Liste erscheinen, macht das Ausrichten
        des Schlüsselworts <code>AS</code> in derselben Spalte die Liste scanbar:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    COUNT(o.id)      AS order_count,
    SUM(o.total)     AS total_spent,
    AVG(o.total)     AS average_order,
    MAX(o.created_at) AS last_order_date`}
      </pre>

      <h2>Komplexe Abfragen mit mehreren JOINs lesen</h2>
      <p>
        Bei einer Abfrage mit drei, vier oder fünf JOINs sollte man nicht oben anfangen.
        Man beginnt bei der <code>FROM</code>-Klausel. Diese nennt die primäre Tabelle –
        den Anker der Abfrage. Jedes nachfolgende <code>JOIN</code> fügt eine weitere Tabelle
        zum Ergebnissatz hinzu, und die <code>ON</code>-Bedingung zeigt, wie die Zeilen dieser
        Tabelle zu den bereits gesammelten Zeilen in Beziehung stehen. Erst nach dem Verstehen
        des Datenmodells aus <code>FROM</code> und <code>JOIN</code> geht man zurück zu{" "}
        <code>SELECT</code>, um zu sehen, welche Spalten zurückgegeben werden, dann zu{" "}
        <code>WHERE</code> für die Filterung und zu <code>GROUP BY</code> für die Aggregation.
      </p>
      <p>
        Lesefolge für jede SELECT-Abfrage: <strong>FROM → JOIN(s) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</strong>.
        Diese entspricht der Reihenfolge, in der die Datenbank die Klauseln tatsächlich verarbeitet,
        und spiegelt wider, wie man über den Datenfluss durch jeden Schritt nachdenken sollte.
      </p>

      <h2>Unterabfragen formatieren</h2>
      <p>
        Unterabfragen – in eine andere Abfrage eingebettete Abfragen – verdienen eine eigene
        Einrückungsebene. Jede Verschachtelungsebene fügt eine weitere Einrückungsebene hinzu,
        sodass die Struktur auch bei zwei oder drei Ebenen klar bleibt:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`SELECT
    u.id,
    u.name,
    u.email
FROM users AS u
WHERE u.id IN (
    SELECT DISTINCT o.user_id
    FROM orders AS o
    WHERE o.total > 500
      AND o.created_at >= '2024-01-01'
)
ORDER BY u.name;`}
      </pre>
      <p>
        Die innere Abfrage ist der äußeren klar untergeordnet. Die schließende Klammer wird
        an dem Schlüsselwort ausgerichtet, das die Unterabfrage eingeleitet hat (<code>WHERE</code>).
        Bei tief verschachtelten oder komplexen Unterabfragen sind CTEs (Common Table Expressions)
        fast immer vorzuziehen, da sie benannt werden und an den Anfang der Abfrage gestellt werden
        können, wo sie leicht zu lesen sind.
      </p>

      <h2>Häufige Abfragemuster und ihre formatierten Formen</h2>

      <h3>INSERT INTO ... SELECT</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`INSERT INTO order_archive (
    id,
    user_id,
    total,
    created_at
)
SELECT
    id,
    user_id,
    total,
    created_at
FROM orders
WHERE created_at < '2023-01-01';`}
      </pre>

      <h3>UPDATE mit JOIN (MySQL / SQL Server Syntax)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`UPDATE users AS u
JOIN subscriptions AS s
    ON u.id = s.user_id
SET u.plan = s.plan_name,
    u.plan_updated_at = NOW()
WHERE s.status = 'active'
  AND s.updated_at >= '2024-01-01';`}
      </pre>

      <h3>WITH (CTE) Abfrage</h3>
      <p>
        Common Table Expressions sind das mächtigste Formatierungswerkzeug in SQL. Sie erlauben
        es, Zwischenergebnismengen zu benennen und eine tief verschachtelte Abfrage in eine
        Reihe klar benannter Schritte zu verwandeln:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
      AND created_at >= '2024-01-01'
),
user_orders AS (
    SELECT
        user_id,
        COUNT(id)  AS order_count,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
)
SELECT
    au.id,
    au.name,
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users AS au
LEFT JOIN user_orders AS uo
    ON au.id = uo.user_id
ORDER BY uo.total_spent DESC
LIMIT 20;`}
      </pre>

      <h2>Warum Formatierung für Performance-Analysen wichtig ist</h2>
      <p>
        Formatierung dient nicht nur der Lesbarkeit für Menschen – sie macht auch
        Performance-Probleme sichtbar. Sobald eine Abfrage ordentlich aufgebaut ist, werden
        bestimmte Problemklassen leicht erkennbar:
      </p>
      <ul>
        <li>
          <strong>Fehlende Indizes.</strong> Eine formatierte <code>WHERE</code>-Klausel mit
          allen Bedingungen in eigenen Zeilen erleichtert es, zu prüfen, ob jede Bedingungsspalte
          einen Index hat. In einem unkomprimierten Einzeiler sind vergrabene Bedingungen leicht
          zu übersehen.
        </li>
        <li>
          <strong>Kartesische Produkte.</strong> Ein <code>JOIN</code> ohne <code>ON</code>-Klausel
          (oder mit einer immer wahren Bedingung) erzeugt einen Cross Join, der die Zeilenanzahl
          multipliziert. Wenn jeder <code>JOIN</code> in einer eigenen Zeile mit der eingerückten
          <code>ON</code>-Bedingung steht, ist eine fehlende Bedingung sofort offensichtlich.
        </li>
        <li>
          <strong>N+1-Abfragemuster.</strong> Zu sehen, dass eine Abfrage eine Liste von IDs in
          einer Unterabfrage auswählt und dann zurück zu derselben Tabelle joined, ist ein Signal,
          dass die Abfrage mit einem direkten Join umgeschrieben werden könnte.
        </li>
        <li>
          <strong>Funktionen auf indizierten Spalten.</strong>{" "}
          <code>WHERE DATE(created_at) = '2024-01-01'</code> verhindert, dass die Datenbank
          einen Index auf <code>created_at</code> verwendet. In einer formatierten Abfrage
          fällt dieses Muster auf; in einem minimierten Einzeiler ist es unsichtbar.
        </li>
      </ul>

      <h2>SQL-Dialekte: Syntaxunterschiede, die man kennen sollte</h2>
      <p>
        SQL ist ein Standard (ISO/IEC 9075), aber jede große Datenbank erweitert ihn mit
        dialektspezifischer Syntax. Für die Formatierung ist Folgendes relevant:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Datenbank</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Bezeichner-Quotierung</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Wesentliche Unterschiede</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>PostgreSQL</strong></td>
              <td style={{padding: "10px 16px"}}><code>"doppelte_anführungszeichen"</code></td>
              <td style={{padding: "10px 16px"}}>Groß-/Kleinschreibungs-sensitiv bei doppelten Anführungszeichen; <code>ILIKE</code> für Suche ohne Groß-/Kleinschreibung; <code>RETURNING</code>-Klausel bei INSERT/UPDATE/DELETE</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><strong>MySQL / MariaDB</strong></td>
              <td style={{padding: "10px 16px"}}><code>`backticks`</code></td>
              <td style={{padding: "10px 16px"}}>Standardmäßig ohne Groß-/Kleinschreibung; <code>LIMIT offset, count</code>-Syntax; <code>GROUP BY</code> erlaubte historisch nicht-aggregierte Spalten</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><strong>SQLite</strong></td>
              <td style={{padding: "10px 16px"}}><code>"doppelte_anführungszeichen"</code> oder <code>[eckige Klammern]</code></td>
              <td style={{padding: "10px 16px"}}>Flexibles Typsystem; kein <code>RIGHT JOIN</code> oder <code>FULL OUTER JOIN</code> in älteren Versionen; <code>PRAGMA</code>-Anweisungen für Schema-Informationen</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><strong>SQL Server (T-SQL)</strong></td>
              <td style={{padding: "10px 16px"}}><code>[eckige_klammern]</code></td>
              <td style={{padding: "10px 16px"}}><code>TOP n</code> statt <code>LIMIT</code>; <code>NOLOCK</code>-Hinweise; <code>GETDATE()</code> statt <code>NOW()</code>; <code>ISNULL()</code> statt <code>COALESCE()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>PostgreSQL: Doppelte Anführungszeichen und Groß-/Kleinschreibung</h3>
      <p>
        In PostgreSQL werden Bezeichner ohne Anführungszeichen in Kleinbuchstaben umgewandelt.
        Wurde eine Tabelle als <code>CREATE TABLE "UserProfiles"</code> (mit doppelten
        Anführungszeichen) angelegt, muss sie immer als <code>"UserProfiles"</code> mit
        Anführungszeichen referenziert werden. Ohne Anführungszeichen sucht PostgreSQL nach{" "}
        <code>userprofiles</code> und schlägt fehl. Dies ist eine häufige Fehlerquelle beim
        Migrieren von MySQL oder wenn ORMs Schemas mit gemischter Groß-/Kleinschreibung generieren.
      </p>

      <h3>MySQL: Backtick-Quotierung</h3>
      <p>
        MySQL verwendet Backticks zur Quotierung von Bezeichnern, keine doppelten Anführungszeichen
        (obwohl MySQL im <code>ANSI_QUOTES</code>-Modus doppelte Anführungszeichen akzeptiert).
        Backticks sind in MySQL-generiertem DDL und in von Tools wie phpMyAdmin exportierten
        Abfragen zu sehen. Der SQL-Formatierer verarbeitet backtick-quotierte Bezeichner und
        bewahrt sie, sodass die Ausgabe für die jeweilige Datenbank gültig bleibt.
      </p>

      <div style={{background: "#dbeafe", borderLeft: "4px solid #3b82f6", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tipp – immer den richtigen Dialekt angeben:</strong> Beim Einfügen einer Abfrage
        in einen Formatierer sollte man den richtigen SQL-Dialekt auswählen. MySQL und PostgreSQL
        haben subtil unterschiedliche Syntax, die beeinflusst, wie der Formatierer bestimmte
        Konstrukte behandelt – insbesondere bei <code>GROUP BY</code>, Window-Funktionen und
        String-Funktionen.
      </div>

      <h2>So verwendet man den BrowseryTools SQL-Formatierer</h2>
      <p>
        Die Verwendung des Formatierers erfordert drei Schritte:
      </p>
      <ul>
        <li>
          <strong>Abfrage einfügen.</strong> Das rohe SQL aus der Protokolldatei, dem ORM-Output
          oder dem Editor kopieren und in den Eingabebereich einfügen. Der Formatierer akzeptiert
          beliebig viel SQL – einzelne Anweisungen, mehrere Anweisungen oder vollständige Skripte.
        </li>
        <li>
          <strong>„Formatieren" klicken.</strong> Der Formatierer wendet Großbuchstaben für
          Schlüsselwörter, Klauseltrennung, Einrückung und konsistente Abstände an. Das Ergebnis
          erscheint sofort im Ausgabebereich – keine Netzwerkanfrage, keine Verzögerung.
        </li>
        <li>
          <strong>Ergebnis kopieren.</strong> Mit der Schaltfläche „Kopieren" wird das formatierte
          SQL in die Zwischenablage übernommen, bereit zum Einfügen in den Editor, den Datenbank-
          Client oder den Pull Request.
        </li>
      </ul>
      <p>
        Da der Formatierer vollständig im Browser läuft, können bedenkenlos Abfragen mit
        sensiblen Daten eingefügt werden – Produktionstabellennamen, Kunden-IDs, interne
        Schemadetails – ohne dass diese das eigene Gerät verlassen. Es gibt kein Backend,
        das Abfragen protokolliert.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Ihre Abfragen bleiben privat:</strong> SQL-Abfragen enthalten häufig Schema-Details,
        Geschäftslogik und Daten, die die eigene Umgebung nicht verlassen sollten. Der BrowseryTools
        SQL-Formatierer läuft zu 100 % im Browser – Ihre Abfragen werden nie an einen Server
        gesendet, nie protokolliert und nie gespeichert. Produktionsabfragen können bedenkenlos
        eingefügt werden.
      </div>

      <h2>SQL-Abfragen jetzt formatieren</h2>
      <p>
        Ob man eine ORM-generierte Riesenabfrage entwirren, den Pull Request eines Kollegen
        prüfen, eine langsame Abfrage debuggen oder einfach verstehen möchte, was eine
        Stack-Overflow-Antwort eigentlich tut – formatiertes SQL macht jede dieser Aufgaben
        schneller und weniger fehleranfällig. Gute Formatierung ist die günstigste
        Performance-Optimierung, die man vornehmen kann, bevor man zu EXPLAIN greift.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser SQL-Formatierer – Sofort, Privat, Keine Anmeldung
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Beliebige SQL-Abfrage einfügen und mit einem Klick mit korrekter Einrückung und
          Großbuchstaben-Schlüsselwörtern formatieren. Nichts verlässt Ihren Browser.
        </p>
        <a
          href="/tools/sql-formatter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          SQL-Formatierer öffnen →
        </a>
      </div>
      <ToolCTA slug="sql-formatter" variant="card" />
    </div>
  );
}
