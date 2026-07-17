import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jeder Entwickler hat diese Situation erlebt: zwei Versionen einer Datei, die identisch sein
        sollten, aber irgendetwas hat sich geändert. Vielleicht ist es eine Konfigurationsdatei, die
        auf einem Server manuell bearbeitet wurde. Vielleicht ist es ein Vertrag, der von einem
        Anwalt mit nicht offenbarten Änderungen zurückgekommen ist. Vielleicht ist es eine
        Übersetzungsdatei, die ein Dienstleister zurückgegeben hat und die Sie darauf prüfen müssen,
        ob nichts versehentlich gelöscht wurde. In allen diesen Fällen lautet die Antwort dieselbe:
        einen Diff ausführen.
      </p>
      <ToolCTA slug="text-diff" variant="inline" />
      <p>
        Sie können zwei Textblöcke sofort mit dem{" "}
        <a href="/tools/text-diff">BrowseryTools Text-Diff-Tool</a> vergleichen — kostenlos, ohne
        Anmeldung, alles läuft in Ihrem Browser.
      </p>

      <h2>Warum Text-Diffing wichtig ist</h2>
      <p>
        Text-Diffing ist nicht nur ein Entwickler-Tool. Jede Situation, in der zwei Versionen eines
        Dokuments existieren und Unterschiede sichtbar gemacht werden müssen, ist ein
        Diffing-Problem:
      </p>
      <ul>
        <li><strong>Code-Review</strong> — verstehen, was sich zwischen zwei Versionen von Quellcode geändert hat, bevor ein Merge genehmigt wird</li>
        <li><strong>Vertrags- und Rechtsdokument-Vergleich</strong> — genau feststellen, welche Klauseln zwischen Entwürfen hinzugefügt, entfernt oder geändert wurden</li>
        <li><strong>Konfigurationsmanagement</strong> — bestätigen, dass eine eingesetzte Konfigurationsdatei mit der Version in der Versionskontrolle übereinstimmt</li>
        <li><strong>Übersetzte Inhaltsprüfung</strong> — prüfen, ob ein übersetztes Dokument dieselben Abschnitte wie das Original abdeckt</li>
        <li><strong>Datenvalidierung</strong> — CSV-Exporte aus zwei Systemen vergleichen, um Diskrepanzen zu finden</li>
        <li><strong>Korrekturlesen</strong> — unbeabsichtigte Änderungen zwischen einem Dokumententwurf und seiner veröffentlichten Version erkennen</li>
      </ul>

      <h2>Wie Diff-Algorithmen funktionieren</h2>
      <p>
        Das Kernproblem, das ein Diff-Algorithmus löst, lautet: Gegeben zwei Sequenzen A und B, finde
        den minimalen Satz von Bearbeitungen (Einfügungen und Löschungen), der erforderlich ist, um A
        in B umzuwandeln. Das ist formal das Longest-Common-Subsequence-Problem (LCS). Der Diff
        meldet dann, was nicht im LCS war — die Zeilen, die nur in A vorhanden sind (Löschungen),
        und die Zeilen, die nur in B vorhanden sind (Einfügungen).
      </p>
      <p>
        Zwei Algorithmen dominieren praktische Implementierungen:
      </p>
      <ul>
        <li>
          <strong>Myers-Diff (1986)</strong> — der Algorithmus hinter dem ursprünglichen Unix-{" "}
          <code>diff</code>-Befehl und Git. Eugene Myers entwickelte ihn, um das kürzeste
          Bearbeitungsskript (den Diff mit den wenigsten Einfügungen und Löschungen insgesamt) in
          O(ND)-Zeit zu finden, wobei N die Gesamtgröße beider Eingaben und D die Anzahl der
          Unterschiede ist. Er ist schnell und erzeugt minimale Diffs, kann aber bei großen
          verschobenen Code-Blöcken unintuitive Ausgaben erzeugen.
        </li>
        <li>
          <strong>Patience-Diff</strong> — entwickelt von Bram Cohen (Schöpfer von BitTorrent) und
          von Bazaar verwendet, später von Kaleidoscope populär gemacht. Statt zeilenweise
          vorzugehen, gleicht Patience-Diff zunächst eindeutige Zeilen ab, die in beiden Dateien
          genau einmal vorkommen. Das erzeugt Ausgaben, die Funktions- und Block-Grenzen bei
          Quellcode viel besser bewahren als Myers-Diff. Git unterstützt ihn via{" "}
          <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Unified-Diff-Ausgabe lesen</h2>
      <p>
        Das Unified-Diff-Format ist die Standardausgabe von <code>git diff</code> und den meisten
        Diff-Tools. Sobald Sie die Notation verstehen, wird sie sofort lesbar.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (original file)
+++ b/config.yml       (modified file)
@@ -10,7 +10,8 @@     (hunk header)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        Die wichtigsten Elemente:
      </p>
      <ul>
        <li><strong>Zeilen mit <code>-</code> am Anfang</strong> — im Original vorhanden, in der neuen Version entfernt (rot dargestellt)</li>
        <li><strong>Zeilen mit <code>+</code> am Anfang</strong> — nicht im Original, in der neuen Version hinzugefügt (grün dargestellt)</li>
        <li><strong>Zeilen ohne Präfix (Leerzeichen)</strong> — unveränderte Kontextzeilen zur Orientierung</li>
        <li>
          <strong>Der <code>@@</code>-Abschnitts-Header</strong> — lautet: „ab Zeile 10, zeigt 7 Zeilen aus dem Original; ab Zeile 10, zeigt 8 Zeilen aus der neuen Version." Das Format ist{" "}
          <code>@@ -start,count +start,count @@</code>.
        </li>
      </ul>

      <h2>Wort-, Zeilen- und Zeichenebene-Diff</h2>
      <p>
        Die Granularität eines Diffs bestimmt, wie nützlich er für eine gegebene Aufgabe ist.
      </p>
      <ul>
        <li>
          <strong>Zeilenebene-Diff</strong> — der Standard für Quellcode. Jede Zeile wird als
          atomare Einheit behandelt. Schnell und für Code geeignet, wo Zeilen kurz und bedeutsam
          sind. Wenn sich ein einzelnes Wort in einem langen Absatz ändert, wird die gesamte Zeile
          als geändert angezeigt.
        </li>
        <li>
          <strong>Wortebene-Diff</strong> — geeignet für Prosa und Dokumentation. Geänderte Wörter
          innerhalb einer Zeile werden einzeln hervorgehoben, was bei textlastigen Dokumenten ein
          viel klareres Signal gibt. Die meisten Dokumentenvergleichs-Tools (Microsoft Word
          Änderungsverfolgung, Google Docs Versionsverlauf) arbeiten auf Wortebene.
        </li>
        <li>
          <strong>Zeichenebene-Diff</strong> — hebt einzelne Zeichenänderungen innerhalb von Wörtern
          hervor. Am nützlichsten zur Erkennung subtiler Tippfehler, Leerraumänderungen, unsichtbarer
          Zeichen (Null-Breite-Leerzeichen, geschützte Leerzeichen) oder Kodierungsunterschiede.
          Unverzichtbar für den Vergleich von Daten, die visuell identisch aussehen, sich aber auf
          Byte-Ebene unterscheiden.
        </li>
      </ul>
      <p>
        Das <a href="/tools/text-diff">BrowseryTools Text-Diff-Tool</a> hebt Unterschiede inline
        hervor und macht es einfach, Änderungen auf einen Blick zu erkennen, ohne das
        Unified-Diff-Format manuell lesen zu müssen.
      </p>

      <h2>Git-Diff unter der Haube</h2>
      <p>
        Wenn Sie <code>git diff</code> ausführen, berechnet Git den Myers-Diff zwischen den in seiner
        Objektdatenbank gespeicherten Objektversionen. Einige nützliche Flags ändern das Verhalten:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git diff HEAD~3               # current state vs 3 commits ago
git diff main...feature       # what feature branch adds to main
git diff --word-diff          # word-level highlighting
git diff --patience           # use patience algorithm (better for code)
git diff --stat               # summary: files changed, insertions, deletions`}
      </pre>
      <p>
        Speziell zu <code>git diff main...feature</code>: Die Drei-Punkte-Notation zeigt, was der
        Feature-Branch seit seiner Abzweigung von main hinzugefügt hat, und schließt Änderungen aus,
        die auf main seit dem Branch-Punkt erfolgt sind. Das ist fast immer das, was Sie für einen
        Pull-Request-Review möchten, im Gegensatz zur Zwei-Punkte-Notation <code>main..feature</code>,
        die die aktuellen Spitzen beider Branches direkt vergleicht.
      </p>

      <h2>Praktische Anwendungsfälle</h2>

      <h3>Konfigurationsdateien vergleichen</h3>
      <p>
        Konfigurationsdateien (YAML, TOML, JSON, .env) sind häufige Quellen von Produktionsfehlern,
        wenn eingesetzte Versionen von versionskontrollierten Versionen abweichen. Bevor Sie ein
        mysteriöses Produktionsproblem debuggen, deckt das Vergleichen der Live-Konfiguration mit der
        erwarteten Konfiguration die Ursache oft sofort auf.
      </p>

      <h3>Vertrags- und Dokumentenvergleich</h3>
      <p>
        Wenn ein Vertragsentwurf von der Gegenseite zurückkommt, vertrauen Sie niemals einer
        Zusammenfassung der Änderungen. Exportieren Sie beide Versionen als Klartext und führen Sie
        einen Diff durch. Juristen sind dafür bekannt, definierte Begriffe zu ändern, Haftungsobergrenzen
        einzufügen oder Benachrichtigungsfristen zu ändern, was ein schnelles Lesen verpasst. Ein
        Wortebene-Diff macht jede Änderung sichtbar.
      </p>

      <h3>Übersetzte Dokumente prüfen</h3>
      <p>
        Beim Arbeiten mit übersetzten Inhalten vergleichen Sie die Struktur des übersetzten Dokuments
        mit der Quelle. Ein struktureller Diff von Abschnittsüberschriften und Absatzzahlen zeigt,
        ob Abschnitte bei der Übersetzung versehentlich ausgelassen oder zusammengeführt wurden.
      </p>

      <h2>Diff-Tools im Vergleich</h2>
      <ul>
        <li><strong>git diff</strong> — eingebaut, Zeilenebene, Unified-Diff-Format, keine GUI. Die Grundlage für alle Code-Arbeiten.</li>
        <li><strong>vimdiff</strong> — terminalbasierter Seite-an-Seite-Diff in Vim. Leistungsfähig für schnelle Vergleiche, ohne das Terminal zu verlassen; steile Lernkurve.</li>
        <li><strong>Beyond Compare</strong> — kommerzielles Desktop-Tool mit Ordner-Synchronisierung, Binär-Diff und Drei-Wege-Merge. Der Goldstandard für Dokumentenvergleiche ohne Entwicklerhintergrund.</li>
        <li><strong>Meld</strong> — kostenlose, plattformübergreifende GUI-Diff-Tool mit Drei-Wege-Merge-Unterstützung. Die beste kostenlose Alternative zu Beyond Compare.</li>
        <li><strong>BrowseryTools Text-Diff</strong> — sofort, browserbasiert, keine Installation. Am besten für schnelle einmalige Vergleiche, besonders bei Text, den Sie nicht in einen Online-Dienst einfügen möchten.</li>
      </ul>
      <ToolCTA slug="text-diff" variant="card" />
    </div>
  );
}
