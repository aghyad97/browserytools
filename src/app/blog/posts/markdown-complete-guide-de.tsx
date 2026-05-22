export default function Content() {
  return (
    <div>
      <p>
        Markdown ist überall. Es ist das Standard-Schreibformat auf GitHub, das Rückgrat der meisten
        Static-Site-Generatoren, die native Sprache von Tools wie Obsidian und Notion und das Format,
        zu dem Entwickler greifen, wenn sie READMEs, Dokumentationen und technische Notizen schreiben.
        Obwohl allgegenwärtig, lernen viele Autoren und Entwickler nur die Grundlagen — Fett, Kursiv
        und ein paar Überschriftsebenen — und verpassen die Funktionen, die Markdown für strukturiertes
        Schreiben wirklich leistungsfähig machen.
      </p>
      <p>
        Sie können Markdown sofort schreiben und in der Vorschau anzeigen mit dem{" "}
        <a href="/tools/markdown-editor">BrowseryTools Markdown-Editor</a> — kostenlos, ohne Anmeldung,
        alles läuft in Ihrem Browser.
      </p>

      <h2>Wer Markdown erstellt hat und warum</h2>
      <p>
        Markdown wurde von John Gruber in Zusammenarbeit mit Aaron Swartz erstellt und 2004
        veröffentlicht. Grubers erklärtes Ziel war es, ein Klartext-Schreibformat zu schaffen, das
        vor jeder Darstellung lesbar ist — also im Rohformat — und das sauber in gültiges HTML
        konvertiert. Der Name ist ein Wortspiel auf „Markup Language" (HTML ist HyperText Markup
        Language), das Konzept umkehrend: Statt Syntax hinzuzufügen, um Formatierung zu steuern,
        verwendet Markdown die natürlichen Interpunktionsgewohnheiten, die Menschen bereits in
        Klartext-E-Mails entwickelt hatten.
      </p>
      <p>
        Die Motivation war praktisch. HTML ist ausführlich und beim Schreiben ablenkend. Ein Satz wie
        <code> &lt;p&gt;Das ist &lt;strong&gt;wichtig&lt;/strong&gt;er Text.&lt;/p&gt;</code> erfordert
        erheblichen mentalen Aufwand im Vergleich zu <code>Das ist **wichtiger** Text.</code> Gruber
        wollte, dass Blogger und Autoren sich auf Wörter konzentrieren, nicht auf Tags. Die
        ursprüngliche Markdown-Spezifikation war ein Perl-Skript, das Klartext-Markdown-Dateien in
        HTML umwandelte.
      </p>

      <h2>Grundlegende Syntax</h2>
      <p>
        Die Kern-Markdown-Syntax deckt alles ab, was die meisten Autoren für strukturierte Dokumente
        benötigen.
      </p>

      <h3>Überschriften</h3>
      <p>
        Verwenden Sie Rautezeichen, um Überschriften zu erstellen. Ein Rautezeichen für H1, zwei für
        H2, bis zu sechs für H6. Die meisten Stilhandbücher empfehlen nur ein H1 pro Dokument
        (typischerweise der Titel) und die Verwendung von H2–H4 für die Inhaltshierarchie.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4`}
      </pre>

      <h3>Betonung und Hervorhebung</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*italic* or _italic_
**bold** or __bold__
***bold and italic***
~~strikethrough~~`}
      </pre>

      <h3>Links und Bilder</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Link text](https://example.com)
[Link with title](https://example.com "Page title")
![Alt text](image.png)
![Alt text](image.png "Image title")`}
      </pre>

      <h3>Listen</h3>
      <p>
        Ungeordnete Listen verwenden Bindestriche, Sternchen oder Pluszeichen. Geordnete Listen
        verwenden Zahlen gefolgt von Punkten. Eingerückte Elemente (2 oder 4 Leerzeichen) erzeugen
        verschachtelte Listen.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Unordered item
- Another item
  - Nested item

1. First
2. Second
3. Third`}
      </pre>

      <h3>Code</h3>
      <p>
        Inline-Code verwendet einfache Backticks. Code-Blöcke mit Begrenzern verwenden dreifache
        Backticks mit einem optionalen Sprachbezeichner für Syntax-Hervorhebung.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Use \`console.log()\` for debugging.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Blockzitate</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too.`}
      </pre>

      <h3>Horizontale Trennlinien</h3>
      <p>
        Drei oder mehr Bindestriche, Sternchen oder Unterstriche allein auf einer Zeile erzeugen eine
        horizontale Trennlinie. <code>---</code> ist die gebräuchlichste Konvention.
      </p>

      <h2>Erweiterte Syntax</h2>
      <p>
        Die ursprüngliche Markdown-Spezifikation ließ einige Funktionen aus, die Autoren häufig
        benötigen. Die erweiterte Syntax, die von den meisten modernen Prozessoren unterstützt wird,
        fügt diese Möglichkeiten hinzu.
      </p>

      <h3>Tabellen</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Column 1  | Column 2  | Column 3  |
|-----------|:---------:|----------:|
| Left      | Center    | Right     |
| aligned   | aligned   | aligned   |`}
      </pre>
      <p>
        Die Doppelpunkt-Position in der Trennzeile steuert die Ausrichtung: links (Standard), mittig
        (Doppelpunkte auf beiden Seiten) oder rechts (Doppelpunkt rechts).
      </p>

      <h3>Aufgabenlisten</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Write first draft
- [x] Peer review
- [ ] Final edits
- [ ] Publish`}
      </pre>

      <h3>Fußnoten</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Here is a claim that needs a citation.[^1]

[^1]: The supporting source or explanation goes here.`}
      </pre>

      <h2>Markdown-Varianten: CommonMark, GFM und MDX</h2>
      <p>
        Die ursprüngliche Markdown-Spezifikation enthielt Mehrdeutigkeiten — Stellen, an denen
        Prozessoren unterschiedliche Entscheidungen über Grenzfälle trafen. Das führte zu
        inkompatiblen Implementierungen in verschiedenen Tools. Es entstanden mehrere
        Standardisierungsbemühungen, um dies zu lösen.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — eine strenge Spezifikation, die jede Mehrdeutigkeit in der
          ursprünglichen Markdown-Spezifikation mit einer formalen Test-Suite auflöst. Von Discourse,
          Reddit, Stack Overflow und vielen anderen übernommen. Die interoperabelste Variante.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — GitHubs Erweiterung von CommonMark, die
          Tabellen, Aufgabenlisten, Durchstreichen, Autolinks und wörtliche URLs hinzufügt. Wenn Sie
          README-Dateien oder GitHub-Kommentare schreiben, verwenden Sie GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown erweitert um JSX-Komponenten-Unterstützung, intensiv
          verwendet in React-basierten Dokumentationsseiten (Next.js Docs, Docusaurus, Astro).
          Ermöglicht das direkte Importieren und Einbetten von React-Komponenten in
          Markdown-Dateien.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — funktionsreiche Erweiterungen für
          akademisches Schreiben mit Unterstützung für Zitate, mathematische Formeln (LaTeX) und
          komplexe Tabellenformatierung.
        </li>
      </ul>

      <h2>Wo Markdown verwendet wird</h2>
      <ul>
        <li><strong>GitHub und GitLab</strong> — README-Dateien, Issues, Pull Requests, Wikis und Kommentare rendern alle Markdown</li>
        <li><strong>Notion</strong> — unterstützt Markdown-Import/-Export und eine Teilmenge von Markdown-Shortcuts für Inline-Formatierung</li>
        <li><strong>Obsidian</strong> — eine Wissensmanagement-App, die vollständig auf Markdown-Dateien mit Wikilink-Erweiterungen aufgebaut ist</li>
        <li><strong>Static-Site-Generatoren</strong> — Jekyll, Hugo, Gatsby, Astro und Next.js verwenden alle Markdown oder MDX als Standard-Inhaltsformat</li>
        <li><strong>Dokumentationsplattformen</strong> — ReadTheDocs, GitBook und Docusaurus sind um Markdown herum aufgebaut</li>
        <li><strong>Chat-Plattformen</strong> — Slack, Discord und Teams unterstützen Teilmengen von Markdown für die Nachrichtenformatierung</li>
        <li><strong>E-Mail-Clients</strong> — einige Clients (Superhuman, HEY) unterstützen Markdown-Eingabe</li>
      </ul>

      <h2>Markdown vs. Rich-Text-Editoren</h2>
      <p>
        Rich-Text-Editoren (WYSIWYG — What You See Is What You Get) wie Google Docs, Microsoft Word
        oder der eingebaute Editor von Contentful zeigen formatierte Ausgabe beim Tippen. Markdown
        zeigt den Rohtext. Die Kompromisse sind real.
      </p>
      <ul>
        <li><strong>Markdown-Vorteile</strong> — Klartextdateien, funktioniert in jedem Editor, mit Git versionierbar, keine Anbieterabhängigkeit, schneller tastaturzentrierter Workflow</li>
        <li><strong>Rich-Text-Vorteile</strong> — sofort visuell, keine Syntax zu lernen, einfacher für nicht-technische Mitarbeiter, besser für komplexe Formatierung (Fußnoten, Kommentare, Änderungsverfolgung)</li>
      </ul>
      <p>
        Für technisches Schreiben, Entwickler-Dokumentation und persönliches Wissensmanagement macht
        Markdowns Portabilität und Versionskontroll-Kompatibilität es zur besseren Wahl. Für
        kollaborative Geschäftsdokumente oder Inhalte mit komplexen Formatierungsanforderungen ist
        ein Rich-Text-Editor oft praktischer.
      </p>

      <h2>Häufige Markdown-Fehler</h2>
      <ul>
        <li><strong>Fehlende Leerzeilen</strong> — die meisten Block-Elemente (Überschriften, Listen, Code-Blöcke) benötigen eine Leerzeile davor und danach, um korrekt gerendert zu werden</li>
        <li><strong>Leerzeichen nach Rautezeichen</strong> — <code>##Überschrift</code> ohne Leerzeichen nach den Rautezeichen ist bei den meisten Prozessoren keine Überschrift</li>
        <li><strong>Inkonsistente Listenmarkierungen</strong> — das Mischen von <code>-</code> und <code>*</code> in derselben Liste kann bei einigen Prozessoren unerwartete Ergebnisse erzeugen</li>
        <li><strong>Vergessen, Sonderzeichen zu maskieren</strong> — Sternchen, Unterstriche und Backticks innerhalb von Text benötigen einen Backslash-Escape, wenn sie wörtlich dargestellt werden sollen</li>
        <li><strong>Annahme, dass erweiterte Syntax universell ist</strong> — Tabellen und Aufgabenlisten sind GFM-Funktionen, die nicht von allen Prozessoren unterstützt werden; prüfen Sie Ihre Zielumgebung</li>
      </ul>
      <p>
        Der <a href="/tools/markdown-editor">BrowseryTools Markdown-Editor</a> bietet eine
        Live-Vorschau, damit Sie Darstellungsprobleme sofort beim Schreiben erkennen können, ohne
        Text in ein anderes Tool kopieren zu müssen. Fügen Sie Ihr Markdown ein und sehen Sie die
        gerenderte HTML-Ausgabe nebeneinander.
      </p>
    </div>
  );
}
