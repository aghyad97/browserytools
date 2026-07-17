import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Reguläre Ausdrücke sind eines jener Werkzeuge, die Entwickler entweder lieben oder ganz
        meiden. Sie wirken einschüchternd – eine dichte Zeichenkette aus Sonderzeichen, die jede
        Lesbarkeit zu trotzen scheint –, aber das zugrunde liegende Modell ist einfach. Hat man
        erst verstanden, wie sie funktionieren, wird ein gut entworfener regulärer Ausdruck zu
        einem der mächtigsten Einzeiler-Werkzeuge im gesamten eigenen Werkzeugkasten.
      </p>
      <ToolCTA slug="regex-tester" variant="inline" />
      <p>
        Dieser Leitfaden bricht das Wesentliche herunter. Statt jeden Regex-Feature zu katalogisieren,
        konzentriert er sich auf die 20 % der Syntax, die 80 % der realen Anwendungsfälle abdecken:
        Zeichenklassen, Quantoren, Anker, Gruppen und Flags. Jedes Beispiel kann unterwegs im{" "}
        <a href="/tools/regex-tester">BrowseryTools Regex-Tester</a> getestet werden – kostenlos,
        keine Anmeldung, alles bleibt im Browser.
      </p>

      <h2>Was ist ein regulärer Ausdruck?</h2>
      <p>
        Ein regulärer Ausdruck ist ein Muster, das eine Menge von Zeichenketten beschreibt. Wenn
        man einen Regex auf einen Text anwendet, fragt man: „Entspricht diese Zeichenkette meinem
        Muster?" – oder praktischer: „Finde alle Teilzeichenketten, die meinem Muster entsprechen."
        Das Muster selbst ist in einer kompakten Mini-Sprache geschrieben, die von den meisten
        Programmiersprachen nativ unterstützt wird.
      </p>
      <p>
        Reguläre Ausdrücke sind nützlich, wenn man Eingaben validieren (ist das eine gültige
        E-Mail-Adresse?), Daten extrahieren (alle URLs aus einem Textblock herausziehen), Text
        transformieren (alle Vorkommen eines Musters ersetzen) oder eine Zeichenkette an einem
        komplexen Trennzeichen aufteilen möchte. Sie laufen im Browser, auf dem Server, im
        Terminal – überall.
      </p>

      <h2>Die Kernsyntax: 20 % für 80 % der Fälle</h2>

      <h3>Literale Zeichen und der Punkt</h3>
      <p>
        Die meisten Zeichen in einem Regex entsprechen sich selbst. Das Muster <code>hello</code>
        entspricht der Zeichenkette „hello" buchstäblich. Der Punkt <code>.</code> ist der
        universelle Platzhalter – er entspricht jedem einzelnen Zeichen außer einem Zeilenumbruch.
        Also entspricht <code>h.llo</code> „hello", „hallo", „hxllo" und so weiter.
      </p>

      <h3>Zeichenklassen</h3>
      <p>
        Eckige Klammern definieren eine Zeichenklasse – eine Menge von Zeichen, von denen eines
        an dieser Position übereinstimmen kann.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> – entspricht jedem einzelnen Vokal</li>
        <li><strong><code>[a-z]</code></strong> – entspricht jedem Kleinbuchstaben (Bereichssyntax)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> – entspricht jedem alphanumerischen Zeichen</li>
        <li><strong><code>[^0-9]</code></strong> – das <code>^</code> innerhalb von Klammern negiert die Klasse; entspricht allem, was KEINE Ziffer ist</li>
      </ul>
      <p>
        Kurzform-Klassen decken die häufigsten Fälle ab: <code>\d</code> entspricht jeder Ziffer
        (wie <code>[0-9]</code>), <code>\w</code> entspricht jedem Wortzeichen (Buchstaben, Ziffern,
        Unterstrich) und <code>\s</code> entspricht jedem Leerzeichen. Ihre Großbuchstaben-Gegenstücke –{" "}
        <code>\D</code>, <code>\W</code>, <code>\S</code> – entsprechen dem Gegenteil.
      </p>

      <h3>Quantoren</h3>
      <p>
        Quantoren steuern, wie oft das vorangehende Element erscheinen muss.
      </p>
      <ul>
        <li><strong><code>*</code></strong> – null oder mehrmals</li>
        <li><strong><code>+</code></strong> – einmal oder mehrmals</li>
        <li><strong><code>?</code></strong> – null oder einmal (macht etwas optional)</li>
        <li><strong><code>{"{3}"}</code></strong> – genau 3-mal</li>
        <li><strong><code>{"{2,5}"}</code></strong> – zwischen 2 und 5-mal (einschließlich)</li>
        <li><strong><code>{"{3,}"}</code></strong> – 3 oder mehrmals</li>
      </ul>
      <p>
        Standardmäßig sind Quantoren gierig – sie entsprechen so viel wie möglich. Ein{" "}
        <code>?</code> nach dem Quantor macht ihn faul: <code>.*?</code> entspricht so wenig
        wie möglich. Diese Unterscheidung ist wichtig, wenn man Inhalte zwischen Trennzeichen
        extrahiert.
      </p>

      <h3>Anker</h3>
      <p>
        Anker entsprechen keinen Zeichen; sie entsprechen Positionen in der Zeichenkette.
      </p>
      <ul>
        <li><strong><code>^</code></strong> – der Anfang der Zeichenkette (oder Zeilenanfang im Mehrzeilen-Modus)</li>
        <li><strong><code>$</code></strong> – das Ende der Zeichenkette (oder Zeilenende im Mehrzeilen-Modus)</li>
        <li><strong><code>\b</code></strong> – eine Wortgrenze – die Position zwischen einem Wortzeichen und einem Nicht-Wortzeichen</li>
      </ul>
      <p>
        Anker sind unerlässlich für die Validierung. Ohne sie würde das Muster <code>\d+</code>
        die Ziffern in „abc123xyz" erkennen. Mit Ankern – <code>^\d+$</code> – entspricht es nur
        Zeichenketten, die ausschließlich aus Ziffern bestehen.
      </p>

      <h3>Gruppen und Alternation</h3>
      <p>
        Klammern erzeugen einfangende Gruppen. Sie dienen zwei Zwecken: ein Teilausdruck zu
        gruppieren, damit ein Quantor auf die gesamte Gruppe angewendet wird, und die
        übereinstimmende Teilzeichenkette zur Extraktion zu erfassen.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Gruppe mit Quantor: ein oder mehrere "ab"-Wiederholungen erkennen
/(ab)+/   →  entspricht "ab", "abab", "ababab"

// Alternation mit |: "cat" oder "dog" erkennen
/(cat|dog)/  →  entspricht "I have a cat" und "I have a dog"

// Benannte Einfangegruppe
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Nicht-einfangende Gruppen – <code>(?:...)</code> – gruppieren ohne Erfassung, was sauberer
        ist, wenn man nur das Gruppierungsverhalten benötigt und den übereinstimmenden Text nicht
        extrahieren muss.
      </p>

      <h2>Praktische Beispiele</h2>

      <h3>E-Mail-Validierung</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Aufgeschlüsselt: <code>^</code> ankert am Anfang. <code>[a-zA-Z0-9._%+-]+</code> entspricht
        dem lokalen Teil (ein oder mehrere erlaubte Zeichen). <code>@</code> ist ein literales
        At-Zeichen. <code>[a-zA-Z0-9.-]+</code> entspricht dem Domain-Namen. <code>\.</code> ist
        ein literaler Punkt (escaped, da nicht-escaped <code>.</code> „beliebiges Zeichen" bedeutet).{" "}
        <code>[a-zA-Z]{"{2,}"}</code> entspricht der TLD mit mindestens 2 Buchstaben. <code>$</code>
        ankert am Ende.
      </p>

      <h3>Telefonnummer (US-Format)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        Das entspricht Formaten wie <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code> und <code>5558675309</code>. Der Schlüsseltrick ist die
        Verwendung von <code>?</code>, um Trennzeichen optional zu machen, und die Gruppierung
        der Vorwahl mit optionalen Klammern.
      </p>

      <h3>URLs aus Text extrahieren</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> entspricht sowohl „http" als auch „https" (das <code>s</code> ist
        optional). <code>:\/\/</code> entspricht dem literalen „://" mit escaped Schrägstrichen.{" "}
        <code>[^\s"'&lt;&gt;]+</code> entspricht allem, was kein Leerzeichen oder häufige
        URL-terminierende Zeichen sind. Das <code>g</code>-Flag findet alle Übereinstimmungen,
        nicht nur die erste.
      </p>

      <h2>Regex-Flags</h2>
      <p>
        Flags verändern, wie das gesamte Muster angewendet wird.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> – alle Übereinstimmungen finden, nicht nur die erste</li>
        <li><strong><code>i</code> (Groß-/Kleinschreibung ignorieren)</strong> – Groß- und Kleinbuchstaben als gleichwertig behandeln; <code>/hello/i</code> entspricht „Hello", „HELLO" und „hello"</li>
        <li><strong><code>m</code> (mehrzeilig)</strong> – <code>^</code> und <code>$</code> entsprechen Anfang/Ende jeder Zeile statt der gesamten Zeichenkette</li>
        <li><strong><code>s</code> (dotAll)</strong> – <code>.</code> entspricht auch Zeilenumbrüchen, nützlich für zeilenübergreifende Übereinstimmungen</li>
      </ul>
      <p>
        In JavaScript stehen Flags nach dem schließenden Schrägstrich: <code>/muster/gi</code>.
        In Python werden sie als zweites Argument übergeben:{" "}
        <code>re.findall(pattern, text, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs. Python: Wesentliche Unterschiede</h2>
      <p>
        Die Regex-Syntax ist zwischen JavaScript und Python weitgehend dieselbe, aber es gibt
        einige wichtige Unterschiede.
      </p>
      <ul>
        <li><strong>Benannte Gruppen</strong>: JavaScript verwendet <code>(?&lt;name&gt;...)</code>, Python dasselbe. Beide geben benannte Gruppen zurück, greifen aber unterschiedlich darauf zu – <code>match.groups.name</code> in JS, <code>match.group('name')</code> in Python.</li>
        <li><strong>Lookahead / Lookbehind</strong>: Beide unterstützen <code>(?=...)</code> (positiver Lookahead) und <code>(?!...)</code> (negativer Lookahead). Python unterstützt auch variable Lookbehinds; ältere JavaScript-Engines tun das nicht.</li>
        <li><strong>Unicode</strong>: JavaScript erfordert das <code>u</code>-Flag für Unicode-Eigenschafts-Escapes wie <code>\p{"{Letter}"}</code>. Pythons <code>re</code>-Modul behandelt Unicode standardmäßig.</li>
        <li><strong>Raw Strings</strong>: In Python immer Raw Strings (<code>r"\d+"</code>) verwenden, um doppeltes Escaping von Backslashes zu vermeiden. In JavaScript verwendet man entweder die literale <code>/\d+/</code>-Syntax oder die Zeichenkette <code>"\\d+"</code> beim Konstruieren mit <code>new RegExp()</code>.</li>
      </ul>

      <h2>Häufige Regex-Fehler</h2>
      <ul>
        <li><strong>Katastrophales Backtracking</strong> – Muster wie <code>(a+)+</code> auf einer nicht übereinstimmenden Zeichenkette können zu exponentiellem Backtracking führen und die Engine einfrieren. Verschachtelte Quantoren auf überlappenden Mustern vermeiden.</li>
        <li><strong>Den Punkt nicht escapen</strong> – <code>3.14</code> als Muster entspricht „3X14", da <code>.</code> ein Platzhalter ist. <code>3\.14</code> verwenden, um den literalen Punkt zu erkennen.</li>
        <li><strong>Validierungsmuster nicht ankern</strong> – Ohne <code>^</code> und <code>$</code> wird ein zur Validierung der gesamten Zeichenkette gedachtes Muster jede Zeichenkette erkennen, die das Muster als Teilzeichenkette enthält.</li>
        <li><strong>Regex für HTML-Parsing verwenden</strong> – Regex kann beliebig verschachtelte Strukturen nicht verarbeiten. Einen echten HTML-Parser verwenden (DOMParser im Browser, BeautifulSoup in Python).</li>
      </ul>

      <h2>Muster sicher im Browser testen</h2>
      <p>
        Regex im Editor ohne Feedback-Schleife zu schreiben ist schmerzhaft. Ein Muster schreiben,
        Code ausführen, scheitern sehen, Muster anpassen, erneut ausführen. Ein Live-Regex-Tester
        verkürzt diese Schleife – Übereinstimmungen werden in Echtzeit hervorgehoben, während
        man tippt.
      </p>
      <p>
        Der{" "}
        <a href="/tools/regex-tester">BrowseryTools Regex-Tester</a> ermöglicht es, ein Muster
        zu schreiben, Testzeichenketten einzufügen und alle Übereinstimmungen sofort hervorgehoben
        zu sehen. Er läuft vollständig im Browser, sodass man gegen echte Daten – Logs,
        Nutzereingaben, Produktionszeichenketten – testen kann, ohne etwas an einen Server zu senden.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        Reguläre Ausdrücke belohnen die Zeit, die man in das Erlernen investiert. Das Kernvokabular –
        Zeichenklassen, Quantoren, Anker, Gruppen und Flags – ist klein. Die Muster, die man daraus
        aufbauen kann, sind vielfältig. Mit den Beispielen aus diesem Leitfaden beginnen, sie gegen
        eigene Zeichenketten testen, und die Syntax wird schneller intuitiv, als man erwartet.
      </p>
      <ToolCTA slug="regex-tester" variant="card" />
    </div>
  );
}
