import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Wenn Sie jemals eine Webanwendung bereitgestellt, eine CI/CD-Pipeline konfiguriert oder einen Linux-Server
        verwaltet haben, sind Sie mit ziemlicher Sicherheit auf einen Cron-Ausdruck gestoßen. Fünf Sternchen, die Sie
        aus einer Konfigurationsdatei anstarren. Eine kryptische Zeichenkette wie <code>0 2 * * 0</code>, vergraben in
        einem GitHub-Actions-Workflow. Ein AWS-EventBridge-Zeitplan, den niemand im Team mehr vollständig versteht.
        Cron-Ausdrücke sind überall — und sie sind wirklich verwirrend, wenn Sie sich nicht die Zeit genommen haben, das
        System dahinter zu lernen.
      </p>
      <ToolCTA slug="cron-parser" variant="inline" />
      <p>
        Dieser Leitfaden ist die Referenz, die Sie als Lesezeichen speichern sollten. Er behandelt alles von der
        Geschichte von Cron und seinem Auftreten in der modernen Infrastruktur über jedes Sonderzeichen, 10 annotierte
        Praxisbeispiele und häufige Fehler bis hin zu einer vollständigen Referenztabelle. Am Ende werden Sie jeden
        Cron-Ausdruck auf einen Blick lesen und neue mit Zuversicht schreiben können.
      </p>

      <h2>Was ist Cron?</h2>
      <p>
        Cron ist ein Unix-basierter Job-Scheduler, der Befehle oder Skripte automatisch zu festgelegten Zeiten und in
        festgelegten Intervallen ausführt. Der Name stammt von <strong>Chronos</strong>, der griechischen
        Personifikation der Zeit — eine treffende Wahl für ein Werkzeug, dessen einziger Zweck die zeitbasierte
        Automatisierung ist. Das ursprüngliche Cron wurde in{" "}
        <strong>Unix Version 7 im Jahr 1979</strong> eingeführt, geschrieben von Ken Thompson bei den Bell Labs, und es
        ist seitdem ein fester Bestandteil unixähnlicher Betriebssysteme.
      </p>
      <p>
        Der Scheduler funktioniert, indem er Konfigurationsdateien namens <strong>crontabs</strong> (Cron-Tabellen)
        liest — einfache Textdateien, in denen jede Zeile eine geplante Aufgabe definiert. Ein
        Hintergrund-Daemon-Prozess (<code>crond</code>) wacht jede Minute auf, prüft alle aktiven Crontabs und führt
        alle Jobs aus, deren Zeitplan mit der aktuellen Zeit übereinstimmt. Es ist ein wunderbar einfaches Design, das
        seit über vier Jahrzehnten grundlegend unverändert geblieben ist.
      </p>

      <h2>Wo Ihnen Cron heute begegnet</h2>
      <p>
        Cron ist nicht nur ein Relikt der Unix-Vergangenheit. Die Cron-Ausdruck-Syntax ist der De-facto-Standard für die
        Ausdrucksweise wiederkehrender Zeitpläne im gesamten modernen Software-Stack:
      </p>
      <ul>
        <li><strong>Linux- und macOS-Crontab:</strong> Der ursprüngliche Anwendungsfall. Führen Sie <code>crontab -e</code> auf einem beliebigen
        Linux- oder macOS-Rechner aus, um Ihren persönlichen Cron-Zeitplan zu bearbeiten.</li>
        <li><strong>GitHub Actions:</strong> Workflow-Dateien verwenden Cron-Syntax unter dem <code>schedule:</code>-Trigger,
        um CI/CD-Pipelines wiederkehrend auszuführen.</li>
        <li><strong>AWS EventBridge (ehemals CloudWatch Events):</strong> Löst Lambda-Funktionen, ECS-Aufgaben und
        andere AWS-Dienste anhand eines Zeitplans mit einer 6-Feld-Cron-Variante aus.</li>
        <li><strong>Kubernetes CronJobs:</strong> Die <code>CronJob</code>-Ressource führt Batch-Workloads innerhalb eines
        Clusters anhand eines Cron-Zeitplans aus.</li>
        <li><strong>CI/CD-Pipelines:</strong> GitLab CI, CircleCI, Jenkins und Bitbucket Pipelines unterstützen alle
        geplante Ausführungen mithilfe von Cron-Ausdrücken.</li>
        <li><strong>Vercel und Netlify:</strong> Beide Plattformen unterstützen cron-getriggerte Serverless-Funktionen für
        Aufgaben wie Cache-Invalidierung, Datenabruf und nächtliche Builds.</li>
        <li><strong>Datenbankwartung:</strong> PostgreSQLs <code>pg_cron</code>-Erweiterung, der MySQL Event Scheduler
        und verwaltete Datenbankdienste verwenden Cron-Syntax für Vacuuming-, Indizierungs- und Backup-Jobs.</li>
        <li><strong>Scheduler auf Anwendungsebene:</strong> Bibliotheken wie node-cron, APScheduler (Python), Quartz
        (Java) und Sidekiq (Ruby) verwenden alle Cron-Ausdrücke, um wiederkehrende Hintergrund-Jobs zu definieren.</li>
      </ul>
      <p>
        Kurz gesagt: Wenn Sie in irgendeinem Bereich der Softwareentwicklung oder Systemadministration arbeiten, sind
        Cron-Ausdrücke etwas, dem Sie regelmäßig begegnen werden. Sie einmal zu lernen, zahlt sich überall aus.
      </p>

      <h2>Die Fünf-Feld-Struktur</h2>
      <p>
        Ein standardmäßiger Cron-Ausdruck besteht aus genau fünf durch Leerzeichen getrennten Feldern, von denen jedes
        eine Zeiteinheit repräsentiert. Zusammen definieren sie, wann ein Job laufen soll. Hier ist die kanonische
        visuelle Darstellung:
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        Von links nach rechts gelesen: Minute, Stunde, Tag des Monats, Monat, Wochentag. Ein Sternchen (<code>*</code>) in
        einem beliebigen Feld bedeutet „jeder mögliche Wert für dieses Feld". So bedeutet <code>* * * * *</code> „jede
        Minute jeder Stunde jedes Tages" — der freizügigste mögliche Zeitplan.
      </p>

      <h3>Feld 1: Minute (0–59)</h3>
      <p>
        Das Minutenfeld steuert, in welcher/welchen Minute(n) innerhalb einer Stunde ein Job ausgelöst wird. Ein Wert
        von <code>0</code> bedeutet zur vollen Stunde, <code>30</code> bedeutet zur halben Stunde, und <code>*</code> bedeutet
        jede Minute. Das ist das granularste Feld im Standard-Cron — die kleinste Planungseinheit ist eine Minute.
      </p>

      <h3>Feld 2: Stunde (0–23)</h3>
      <p>
        Das Stundenfeld verwendet die 24-Stunden-Zeit. <code>0</code> ist Mitternacht, <code>9</code> ist 9 Uhr, <code>17</code> ist
        17 Uhr, und <code>23</code> ist 23 Uhr. Es gibt kein AM/PM — alles ist im 24-Stunden-Format. Denken Sie daran, dass Cron
        immer in der Zeitzone des Servers läuft, sofern nicht ausdrücklich anders konfiguriert.
      </p>

      <h3>Feld 3: Tag des Monats (1–31)</h3>
      <p>
        Steuert, an welchem/welchen Tag(en) des Monats ein Job läuft. <code>1</code> ist der erste, <code>15</code> ist der
        fünfzehnte, <code>31</code> ist der einunddreißigste. Seien Sie vorsichtig mit Werten wie <code>31</code> — in Monaten
        mit weniger Tagen (Februar, April, Juni usw.) läuft ein für den 31. geplanter Job in diesem Monat einfach nicht.
        Manche Implementierungen unterstützen das Sonderzeichen <code>L</code> im Sinne von „letzter Tag des Monats",
        unabhängig davon, wie viele Tage der Monat hat.
      </p>

      <h3>Feld 4: Monat (1–12)</h3>
      <p>
        Das Monatsfeld verwendet numerische Werte (1 für Januar bis 12 für Dezember) oder dreibuchstabige Abkürzungen
        (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>, <code>JUN</code>,
        <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>, <code>NOV</code>, <code>DEC</code>)
        in den meisten Implementierungen. Ein Sternchen bedeutet „jeden Monat".
      </p>

      <h3>Feld 5: Wochentag (0–7)</h3>
      <p>
        Dieses Feld gibt an, an welchem/welchen Wochentag(en) der Job laufen soll. Die Nummerierung hier ist eine
        häufige Quelle der Verwirrung: <strong>Sowohl 0 als auch 7 stehen für Sonntag</strong> in den meisten
        Cron-Implementierungen (eine Altlast aus dem ursprünglichen Unix-Design). Montag ist 1, Dienstag ist 2 und
        Samstag ist 6. Dreibuchstabige Abkürzungen
        (<code>SUN</code>, <code>MON</code>, <code>TUE</code>, <code>WED</code>, <code>THU</code>, <code>FRI</code>,
        <code>SAT</code>) werden in den meisten modernen Cron-Tools unterstützt.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wichtig:</strong> Wenn sowohl Tag-des-Monats als auch Wochentag angegeben sind (nicht <code>*</code>),
        behandeln die meisten Cron-Implementierungen sie als ODER-Bedingung — der Job läuft, wenn eine der beiden
        Bedingungen zutrifft. Das ist ein subtiles, aber entscheidendes Verhalten, das viele Entwickler überrascht.
      </div>

      <h2>Sonderzeichen</h2>
      <p>
        Die wahre Stärke von Cron-Ausdrücken kommt von sechs Sonderzeichen, mit denen Sie komplexe Zeitpläne knapp
        ausdrücken können. Diese zu verstehen, ist der Schlüssel zur Geläufigkeit.
      </p>

      <h3>* — Platzhalter (jeder Wert)</h3>
      <p>
        Ein Sternchen bedeutet „jeden möglichen Wert in diesem Feld treffen". Im Minutenfeld bedeutet <code>*</code> jede
        Minute (0 bis 59). Im Monatsfeld bedeutet es jeden Monat. Es ist der standardmäßige „Dieses Feld ist mir
        egal"-Wert.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — Liste (mehrere Werte)</h3>
      <p>
        Ein Komma trennt eine Liste bestimmter Werte. Das Feld trifft zu, wenn die aktuelle Zeit mit einem beliebigen
        Wert in der Liste übereinstimmt. So planen Sie einen Job, der zu mehreren diskreten Zeiten läuft, ohne einen
        Bereich zu verwenden.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Bereich (von bis)</h3>
      <p>
        Ein Bindestrich definiert einen inklusiven Wertebereich. Das Feld trifft auf jeden Wert zwischen Anfang und
        Ende, inklusive, zu. Das ist ideal, um Dinge wie „während der Geschäftszeiten" oder „an Werktagen"
        auszudrücken.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Schritt (alle N Einheiten)</h3>
      <p>
        Ein Schrägstrich definiert einen Schrittwert. <code>*/5</code> bedeutet „alle 5 Einheiten, beginnend beim
        Minimum". Sie können ihn auch mit einem Bereich kombinieren: <code>0-30/10</code> bedeutet „alle 10 Einheiten zwischen 0 und 30"
        (also 0, 10, 20, 30). Schritte sind eines der am häufigsten verwendeten Sonderzeichen.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Letzter (nur manche Implementierungen)</h3>
      <p>
        Das Zeichen <code>L</code> wird in manchen Cron-Implementierungen (insbesondere Quartz Scheduler in Java und
        manchen Linux-Cron-Varianten) im Sinne von „letzter" unterstützt. Im Tag-des-Monats-Feld bedeutet <code>L</code> den letzten
        Tag des aktuellen Monats — sei es der 28., 29., 30. oder 31. Es löst das Problem, „Monatsende"-Aufgaben zu
        planen, ohne die Länge des Monats im Voraus zu kennen.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — Kein bestimmter Wert (Quartz/Java-Cron)</h3>
      <p>
        Das Fragezeichen wird im Quartz Scheduler (Java) und manchen anderen Tools verwendet, wenn Sie einen Wochentag
        angeben möchten, ohne auch einen Tag des Monats anzugeben, oder umgekehrt. Da es logisch keinen Sinn ergibt,
        beides anzugeben (etwa „den 15. UND einen Mittwoch"), sollte eines davon auf <code>?</code> gesetzt werden, um „ist
        mir egal" anzuzeigen. Das standardmäßige Unix-Cron verwendet dieses Zeichen nicht — Sie verwenden stattdessen <code>*</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 Praxisbeispiele für Cron</h2>
      <p>
        Der beste Weg, Ihr Verständnis zu festigen, ist das Studium echter Beispiele mit Kontext dazu, warum jeder
        Zeitplan gewählt wurde. Hier sind zehn Muster, denen Sie regelmäßig begegnen (und die Sie verwenden) werden.
      </p>

      <h3>1. Jeden Werktag um 9:00 Uhr</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        Die Minute ist <code>0</code> (zur vollen Stunde), die Stunde ist <code>9</code> (9 Uhr), Tag des Monats und Monat
        sind Platzhalter, und der Wochentag ist <code>1-5</code> (Montag bis Freitag). Verwendet für tägliche
        Standup-Erinnerungen, Berichts-E-Mails, die zu Beginn des Geschäftstages versendet werden, und morgendliche
        Datensynchronisierungs-Jobs, die nicht am Wochenende laufen sollen.
      </p>

      <h3>2. Alle 15 Minuten</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        Die Schritt-Syntax <code>*/15</code> im Minutenfeld liefert Ihnen Ausführungen bei 0, 15, 30 und 45 Minuten nach
        jeder Stunde, rund um die Uhr. Üblich für Health-Check-Pings, Cache-Warming, Webhook-Wiederholungen und jede
        nahezu echtzeitnahe Polling-Aufgabe, bei der Sie Aktualität brauchen, echte Echtzeit aber überdimensioniert oder
        nicht verfügbar ist.
      </p>

      <h3>3. Jeden Tag um Mitternacht</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Minute 0, Stunde 0, alles andere Platzhalter. Das ist eines der häufigsten Cron-Muster überhaupt. Verwendet für
        die tägliche Berichtserstellung, Log-Rotation, Datenbankarchivierung, das Löschen temporärer Dateien, das Senden
        täglicher Digest-E-Mails und jede „einmal am Tag"-Aufgabe, die außerhalb der Geschäftszeiten laufen soll.
      </p>

      <h3>4. Erster Tag jedes Monats um Mitternacht</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        Tag des Monats ist <code>1</code>, alles andere ist Platzhalter (außer fester Minute/Stunde). Dies läuft am
        1. Januar, 1. Februar, 1. März usw. Der Standardzeitplan für die monatliche Rechnungserstellung,
        Abrechnungszyklus-Trigger, Verlängerungen von SaaS-Abonnements und monatliche Analytics-Zusammenfassungen.
      </p>

      <h3>5. Jeden Sonntag um 2:00 Uhr</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        Der Wochentag <code>0</code> ist Sonntag, und die Stunde <code>2</code> ist 2 Uhr — eine Zeit, zu der der Verkehr
        typischerweise am geringsten ist. Verwendet für wöchentliche vollständige Datenbank-Backups, Sitemap-Neuerzeugung,
        Inhaltsneuindizierung für die Suche und schwere Batch-Verarbeitungs-Jobs, die unter der Woche die Leistung
        beeinträchtigen würden.
      </p>

      <h3>6. Werktags um 8:30, 12:30 und 17:30 Uhr</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        Dies kombiniert eine Liste im Stundenfeld mit einem Bereich im Wochentagsfeld. Die Minute <code>30</code> bedeutet, dass es
        zur halben Stunde ausgelöst wird. Verwendet für geplante Benachrichtigungsstapel (Push-Benachrichtigungen,
        E-Mail-Digests), dreimal tägliche Datensynchronisierungs-Jobs und jeden Arbeitsablauf, bei dem Sie regelmäßige
        Berührungspunkte über den Geschäftstag hinweg möchten, ohne jede Stunde zuzuschlagen.
      </p>

      <h3>7. 1. Januar um Mitternacht</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        Tag des Monats <code>1</code> und Monat <code>1</code> (Januar) zusammen fixieren dies auf Neujahr.
        Verwendet für jährliche Aufgaben wie jährliche Abonnementverlängerungen, die Archivierung der Daten des
        Vorjahres, die Erstellung jährlicher Compliance-Berichte und das Zurücksetzen jährlicher Kontingente oder Zähler
        in Anwendungen.
      </p>

      <h3>8. Alle 5 Minuten während der Geschäftszeiten an Werktagen</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        Ein zusammengesetzter Ausdruck, der einen Schritt (<code>*/5</code>), einen Bereich in Stunden (<code>9-17</code>) und einen
        Bereich im Wochentag (<code>1-5</code>) kombiniert. Das liefert Ihnen aggressives Monitoring oder Polling — alle 5 Minuten
        von 9 bis 17 Uhr von Montag bis Freitag — und wird über Nacht und am Wochenende ruhig, um Ressourcen zu sparen
        und Alarmmüdigkeit zu vermeiden.
      </p>

      <h3>9. Alle 6 Stunden</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        Der Schritt im Stundenfeld (<code>*/6</code>) liefert vier gleichmäßig verteilte Ausführungen pro Tag: Mitternacht, 6 Uhr,
        Mittag und 18 Uhr. Verwendet für die Datensynchronisierung zwischen Systemen, das Auffrischen langlebiger
        API-Tokens oder OAuth-Zugangsdaten vor deren Ablauf und periodische Cache-Invalidierung für Inhalte, die sich
        einige Male am Tag ändern, aber keine minutengenaue Aktualität benötigen.
      </p>

      <h3>10. 15. und letzter Tag jedes Monats</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        Eine Kommaliste im Tag-des-Monats-Feld, die ein festes Datum (<code>15</code>) und das
        Letzter-Tag-Kürzel (<code>L</code>) kombiniert. Das ist der klassische halbmonatliche Gehaltsabrechnungszeitplan —
        Abrechnungsperioden, die am 15. und am letzten Tag des Monats enden. Beachten Sie, dass <code>L</code> eine Implementierung
        erfordert, die es unterstützt (Quartz, manche Linux-Crons); das Standard-Crontab unterstützt <code>L</code> nicht.
      </p>

      <h2>Häufige Fehler und Stolperfallen</h2>
      <p>
        Cron-Ausdrücke haben mehrere bekannte Fallstricke, die Produktionsvorfälle verursachen. Sie im Voraus zu
        verstehen, erspart Ihnen eine schmerzhafte Debugging-Sitzung um 2 Uhr morgens.
      </p>

      <h3>Die Wochentag-Nummerierung ist nicht universell</h3>
      <p>
        Die meisten Unix-Cron-Implementierungen behandeln sowohl <code>0</code> als auch <code>7</code> als Sonntag. Aber manche Tools
        (darunter bestimmte Bibliotheken auf Anwendungsebene) beginnen die Woche am Montag, wodurch <code>1</code> = Montag
        und <code>7</code> = Sonntag ist. Überprüfen Sie stets die Nummerierungskonvention des konkreten Tools, das Sie verwenden,
        und bevorzugen Sie dreibuchstabige Abkürzungen (<code>MON</code>, <code>TUE</code> usw.), wenn die
        Implementierung sie unterstützt, um Mehrdeutigkeit zu beseitigen.
      </p>

      <h3>Cron läuft in der Zeitzone des Servers</h3>
      <p>
        Das ist wahrscheinlich die häufigste Quelle von Cron-Fehlern in der Produktion. <code>0 9 * * *</code> bedeutet 9 Uhr
        in <em>der Zeitzone des Rechners, der den Job ausführt</em> — die UTC, US/Eastern oder etwas ganz anderes sein kann.
        Dokumentieren Sie die Zeitzonenannahme stets in einem Kommentar neben dem Cron-Ausdruck. Konfigurieren Sie bei
        cloudbasierten Schedulern die Zeitzone ausdrücklich, wenn die Plattform es unterstützt.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>GitHub-Actions-Cron läuft immer in UTC</h3>
      <p>
        GitHub Actions verwendet standardmäßige 5-Feld-Cron-Syntax unter dem <code>on: schedule:</code>-Schlüssel, aber der
        Scheduler arbeitet immer in UTC — es gibt keine Zeitzonen-Konfigurationsoption. Wenn Sie möchten, dass ein Job
        um 9 Uhr Eastern Time läuft, müssen Sie ihn auf <code>0 14 * * *</code> (UTC) planen. Beachten Sie außerdem, dass geplante
        GitHub-Actions-Workflows in Zeiten hoher Nachfrage bis zu 15 Minuten verspätet laufen können.
      </p>

      <h3>Die Schritt-Syntax gilt für ihr Feld, nicht für Minuten</h3>
      <p>
        Ein häufiges Missverständnis: <code>*/5</code> im <em>Stundenfeld</em> bedeutet alle 5 Stunden — nicht alle 5
        Minuten. Der Schritt gilt stets für die Einheit des Feldes, in dem er steht. <code>*/5</code> im Minutenfeld
        bedeutet alle 5 Minuten; im Stundenfeld alle 5 Stunden; im Monatsfeld alle 5 Monate.
      </p>

      <h3>Jobs, die länger als ihr Intervall laufen, können sich überlappen</h3>
      <p>
        Cron ist ein Fire-and-Forget-Scheduler. Wenn Sie einen Job alle 5 Minuten planen und eine Job-Instanz 7 Minuten
        bis zum Abschluss benötigt, startet eine zweite Instanz, während die erste noch läuft. Das kann
        Race Conditions, doppelte Verarbeitung und Datenbeschädigung verursachen. Verwenden Sie eine Dateisperre oder
        eine Advisory Lock in Ihrer Datenbank, um die gleichzeitige Ausführung desselben Jobs zu verhindern.
      </p>

      <h3>Fehlende Felder vs. Platzhalter sind nicht immer gleichwertig</h3>
      <p>
        In manchen erweiterten Cron-Implementierungen (insbesondere Quartz) werden das Weglassen eines Feldes und die
        Verwendung von <code>*</code> unterschiedlich behandelt. Verwenden Sie stets alle erforderlichen Felder
        ausdrücklich und verlassen Sie sich für kritische Produktionszeitpläne niemals auf Standardwerte.
      </p>

      <h2>Nicht standardmäßige Erweiterungen: 6-Feld-Cron</h2>
      <p>
        Das standardmäßige Unix-Cron hat fünf Felder, wobei die Minute die feinste Granularität ist. Mehrere Systeme
        erweitern dies um zusätzliche Felder:
      </p>

      <h3>Sekundenfeld (vorangestellt)</h3>
      <p>
        Viele Scheduler auf Anwendungsebene (node-cron, Quartz, Spring Scheduler) fügen <strong>am Anfang ein
        Sekundenfeld</strong> hinzu und geben Ihnen so 6 Felder. Das ermöglicht eine sub-minütliche Planung bis hinab zur
        Sekunde. Die Felder sind: <code>second minute hour day-of-month month day-of-week</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 Felder mit Jahr)</h3>
      <p>
        AWS EventBridge verwendet ein 6-Feld-Format, bei dem <strong>am Ende ein Jahresfeld angehängt</strong> wird:
        <code>minute hour day-of-month month day-of-week year</code>. Es erfordert außerdem die Verwendung von <code>?</code>
        für entweder Tag-des-Monats oder Wochentag (niemals beide gleichzeitig als Platzhalter). AWS EventBridge
        unterstützt die <code>*/</code>-Schritt-Syntax nicht auf dieselbe Weise wie Unix-Cron.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Schneller Tipp:</strong> Wenn Sie einen Cron-Ausdruck zwischen Plattformen kopieren, überprüfen Sie stets
        die Anzahl der Felder und etwaige plattformspezifische Syntaxunterschiede. Ein gültiger Unix-Cron-Ausdruck kann
        in AWS EventBridge, Quartz oder einem node-cron-Kontext ungültig sein (oder etwas anderes bedeuten).
      </div>

      <h2>So nutzen Sie den BrowseryTools Cron-Parser</h2>
      <p>
        Einen Cron-Ausdruck von Grund auf zu schreiben, ist die eine Fähigkeit — zu validieren, dass Sie ihn korrekt
        geschrieben haben, ist eine andere. Der <a href="/tools/cron-parser">BrowseryTools Cron-Parser</a> macht es
        trivial, jeden Ausdruck zu überprüfen, bevor er auch nur in die Nähe der Produktion kommt.
      </p>
      <p>Fügen Sie einen beliebigen 5-Feld- (oder 6-Feld-) Cron-Ausdruck in das Tool ein und erhalten Sie sofort:</p>
      <ul>
        <li>Eine <strong>menschenlesbare Beschreibung</strong> des Zeitplans („Jeden Werktag um 9:00 Uhr"), sodass Sie
        auf einen Blick überprüfen können, dass Ihre Absicht mit Ihrem Ausdruck übereinstimmt.</li>
        <li>Die <strong>nächsten 5–10 geplanten Ausführungszeiten</strong>, explizit aufgelistet, sodass Sie genau sehen, wann
        der Job ausgelöst wird, und bestätigen können, dass es keine Überraschungen gibt.</li>
        <li>Sofortiges Feedback bei <strong>ungültiger Syntax</strong> — hilfreich, wenn Sie einen Tippfehler haben oder mit
        einem Ausdruck arbeiten, den jemand anderes geschrieben hat.</li>
      </ul>
      <p>
        Alles läuft vollständig in Ihrem Browser — kein Ausdruck wird an einen Server gesendet. Es ist der schnellste
        Weg, einen Zeitplan auf Plausibilität zu prüfen, bevor Sie ihn auf GitHub Actions, Kubernetes oder einer anderen
        Plattform bereitstellen.
      </p>

      <h2>Cron-Ausdruck-Referenztabelle</h2>
      <p>
        Verwenden Sie diese Tabelle als schnelle Referenz. Setzen Sie ein Lesezeichen auf diese Seite und kommen Sie
        immer dann darauf zurück, wenn Sie ein Muster nachschlagen oder überprüfen müssen, was ein Ausdruck bedeutet.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Ausdruck</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Menschenlesbare Bedeutung</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Typischer Anwendungsfall</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Jede Minute</td>
              <td style={{padding: "12px 16px"}}>Hochfrequentes Polling, Tests</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Alle 5 Minuten</td>
              <td style={{padding: "12px 16px"}}>Health-Checks, Cache-Warming</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Alle 15 Minuten</td>
              <td style={{padding: "12px 16px"}}>Datensynchronisierung, Webhook-Wiederholungen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Jede Stunde zur vollen Stunde</td>
              <td style={{padding: "12px 16px"}}>Stündliche Aggregationen, API-Aufrufe</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Alle 6 Stunden</td>
              <td style={{padding: "12px 16px"}}>Token-Auffrischung, Datensynchronisierung</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Jeden Tag um Mitternacht</td>
              <td style={{padding: "12px 16px"}}>Tägliche Berichte, Log-Rotation</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Werktags um 9:00 Uhr</td>
              <td style={{padding: "12px 16px"}}>Jobs zu Geschäftszeiten, Erinnerungen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Jeden Sonntag um 2:00 Uhr</td>
              <td style={{padding: "12px 16px"}}>Wöchentliche Backups, Wartung</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>Erster jedes Monats um Mitternacht</td>
              <td style={{padding: "12px 16px"}}>Monatliche Rechnungen, Abrechnung</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>1. und 15. jedes Monats</td>
              <td style={{padding: "12px 16px"}}>Halbmonatliche Gehaltsabrechnung</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>1. Januar um Mitternacht</td>
              <td style={{padding: "12px 16px"}}>Jährliche Aufgaben, jährliches Zurücksetzen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Werktags um 8:30, 12:30, 17:30 Uhr</td>
              <td style={{padding: "12px 16px"}}>Benachrichtigungsstapel</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Alle 5 Min. während der Geschäftszeiten (Werktags)</td>
              <td style={{padding: "12px 16px"}}>Aktives Monitoring, Polling</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Validieren Sie Ihre Cron-Ausdrücke vor dem Bereitstellen</h2>
      <p>
        Cron-Ausdrücke sind kompakt und mächtig, aber ihre Knappheit bedeutet, dass ein einziger Tippfehler stillschweigend
        einen völlig anderen Zeitplan erzeugen kann. Ein Job, den Sie monatlich ausführen wollten, könnte täglich laufen.
        Ein Backup, das Sie jeden Sonntag auslösen wollten, könnte überhaupt nie laufen. Die Kosten eines falschen
        Zeitplans in der Produktion können von einem verpassten Bericht bis zu einem Abrechnungs-Job reichen, der
        Hunderte Male auslöst.
      </p>
      <p>
        Die zweiminütige Gewohnheit, Ihren Ausdruck in einen Validator einzufügen und die nächsten paar geplanten
        Ausführungszeiten vor dem Bereitstellen zu prüfen, ist eine der wertvollsten Praktiken in DevOps und
        Backend-Engineering. Sie fängt Fehler ab, bevor sie zu Vorfällen werden.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Validieren Sie jeden Cron-Ausdruck sofort — kostenlos, privat, im Browser
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Fügen Sie Ihren Ausdruck ein, erhalten Sie eine menschenlesbare Beschreibung und sehen Sie die nächsten
          geplanten Ausführungszeiten. Nichts verlässt Ihren Browser.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Den Cron-Parser öffnen →
        </a>
      </div>
      <ToolCTA slug="cron-parser" variant="card" />
    </div>
  );
}
