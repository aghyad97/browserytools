export default function Content() {
  return (
    <div>
      <p>
        CSS-Farbverläufe gehören zu den leistungsstärksten und am wenigsten genutzten Werkzeugen im Werkzeugkasten des
        Frontend-Entwicklers. Mit ihnen können Sie weiche Farbübergänge, eindrucksvolle Hintergründe, subtilen
        UI-Feinschliff und sogar komplexe visuelle Muster erstellen — alles ohne eine einzige Bilddatei. Bevor
        CSS-Farbverläufe universell unterstützt wurden, mussten Designer Verlaufshintergründe als PNGs aus Photoshop
        exportieren, was zusätzliche HTTP-Anfragen, unflexible statische Assets und Layouts zur Folge hatte, die in dem
        Moment zerbrachen, in dem jemand die Markenfarben änderte. Heute ersetzt eine einzige Zeile CSS all das.
      </p>
      <p>
        Dieser Leitfaden behandelt alles, was Sie über CSS-Farbverläufe wissen müssen — die drei Typen, das
        Winkelsystem, praxisnahe Anwendungsfälle mit kopierfertigem Code, häufige Fehler und wie Sie den{" "}
        <a href="/tools/css-gradient">BrowseryTools CSS-Verlaufsgenerator</a> nutzen, um genau das zu erstellen, was Sie
        brauchen, ohne eine einzige Zeile von Grund auf zu schreiben.
      </p>

      <h2>Warum CSS-Farbverläufe bildbasierte Hintergründe abgelöst haben</h2>
      <p>
        Der alte Ansatz — das Exportieren eines 1×1000-px-Verlaufs-PNG und das horizontale Kacheln — hatte echte
        Kosten. Jeder Verlauf war ein Roundtrip zum Server, eine Bytes-auf-der-Leitung-Last und eine Wartungsbürde,
        wenn sich Farben änderten. Noch wichtiger: PNG-Verläufe konnten nicht dynamisch auf Bildschirmgrößen,
        Theme-Wechsel oder Hover-Zustände reagieren.
      </p>
      <p>
        CSS-Farbverläufe lösen all das. Sie werden in Echtzeit von der GPU gerendert, reagieren sofort auf
        JavaScript-Zustandsänderungen, skalieren bei jeder Auflösung perfekt, funktionieren mit CSS-Übergängen und
        -Animationen und fügen Ihrem Asset-Bundle null Bytes hinzu. Die Browserunterstützung liegt nun bei 100 % über
        alle modernen Browser hinweg und ist es seit 2014. Es gibt keinen Grund, in neuen Projekten bildbasierte
        Verläufe für einfache Farbübergänge zu verwenden.
      </p>

      <h2>Die drei Arten von CSS-Farbverläufen</h2>

      <h3>1. Linearer Verlauf</h3>
      <p>
        Ein linearer Verlauf lässt Farben entlang einer geraden Linie übergehen. Die Richtung kann ein beliebiger
        Winkel sein oder als Schlüsselwort wie <code>to right</code> oder <code>to bottom right</code> ausgedrückt
        werden. Das ist der am häufigsten verwendete Verlaufstyp und deckt den überwiegenden Großteil der Designbedürfnisse
        ab.
      </p>
      <pre><code>{`/* Classic diagonal purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Top to bottom (default direction) */
background: linear-gradient(#f8fafc, #e2e8f0);

/* Left to right with three color stops */
background: linear-gradient(to right, #f97316, #ec4899, #8b5cf6);`}</code></pre>

      <h3>2. Radialer Verlauf</h3>
      <p>
        Ein radialer Verlauf strahlt von einem Mittelpunkt nach außen. Standardmäßig bildet er eine Ellipse, die in das
        Begrenzungsrechteck des Elements passt, aber Sie können Form, Größe und Position steuern. Radiale Verläufe sind
        ideal für Spotlight-Effekte, leuchtende Schaltflächen und Simulationen von Umgebungslicht.
      </p>
      <pre><code>{`/* Circular glow from center */
background: radial-gradient(circle, #6366f1 0%, #1e1b4b 100%);

/* Ellipse glow at top-left corner */
background: radial-gradient(ellipse at top left, #fbbf24 0%, transparent 60%);

/* Positioned spotlight */
background: radial-gradient(circle at 30% 40%, #e0f2fe, #0284c7);`}</code></pre>

      <h3>3. Konischer Verlauf</h3>
      <p>
        Ein konischer Verlauf führt Farben rund um einen Mittelpunkt, wie die Zeiger einer Uhr. Das macht ihn auf
        einzigartige Weise geeignet für Kreisdiagramme, Farbräder und Animationen von Lade-Spinnern. Er war der letzte
        der drei Verlaufstypen, der universelle Unterstützung erhielt, und landete bis 2021 in allen großen Browsern.
      </p>
      <pre><code>{`/* Pie chart with three segments */
background: conic-gradient(
  #6366f1 0deg 120deg,
  #ec4899 120deg 240deg,
  #f97316 240deg 360deg
);

/* Color wheel */
background: conic-gradient(
  hsl(0, 100%, 50%),
  hsl(60, 100%, 50%),
  hsl(120, 100%, 50%),
  hsl(180, 100%, 50%),
  hsl(240, 100%, 50%),
  hsl(300, 100%, 50%),
  hsl(360, 100%, 50%)
);`}</code></pre>

      <h2>Das Winkelsystem für lineare Verläufe verstehen</h2>
      <p>
        Der Winkelparameter in <code>linear-gradient</code> folgt einer Konvention, die viele Entwickler überrascht,
        weil sie von standardmäßigen mathematischen Winkeln abweicht. Hier ist die Zuordnung:
      </p>
      <ul>
        <li><strong>0deg</strong> — von unten nach oben (der Verlauf fließt aufwärts)</li>
        <li><strong>90deg</strong> — von links nach rechts (der häufigste horizontale Verlauf)</li>
        <li><strong>135deg</strong> — diagonal, von oben links nach unten rechts</li>
        <li><strong>180deg</strong> — von oben nach unten (entspricht dem Standard ohne angegebenen Winkel)</li>
        <li><strong>225deg</strong> — diagonal, von unten rechts nach oben links</li>
        <li><strong>270deg</strong> — von rechts nach links</li>
      </ul>
      <p>
        Die Schlüsselwort-Entsprechungen — <code>to top</code>, <code>to right</code>, <code>to bottom left</code> —
        sind für gängige Richtungen oft besser lesbar als numerische Winkel. Für präzise Diagonaleffekte geben Ihnen
        numerische Gradzahlen exakte Kontrolle. Der beliebte diagonale Verlauf von Lila nach Indigo verwendet{" "}
        <code>135deg</code>:
      </p>
      <pre><code>{`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`}</code></pre>

      <h2>Formen radialer Verläufe: Kreis vs. Ellipse</h2>
      <p>
        Standardmäßig erzeugt <code>radial-gradient</code> eine Ellipse, die so dimensioniert ist, dass sie in das
        Element passt. Sie können dies mit zwei Form-Schlüsselwörtern überschreiben:
      </p>
      <ul>
        <li>
          <strong>circle</strong> — erzwingt einen perfekten Kreis unabhängig vom Seitenverhältnis des Elements.
          Verwenden Sie dies für Leuchteffekte und Spotlight-Hintergründe, bei denen Sie ein gleichmäßiges radiales
          Auslaufen in alle Richtungen wünschen.
        </li>
        <li>
          <strong>ellipse</strong> — der Standard, dehnt sich aus, um in den Container zu passen. Verwenden Sie dies
          für subtile Hintergrundfüllungen, die sich natürlich an jede Elementform anpassen müssen.
        </li>
      </ul>
      <p>
        Das Schlüsselwort <code>at</code> erlaubt es Ihnen, den Verlaufsmittelpunkt mithilfe jeder beliebigen
        CSS-Länge oder Prozentangabe an eine beliebige Stelle im Element zu verschieben. <code>at center</code>, <code>at top left</code>, <code>at 20% 80%</code> — alle
        sind gültig. Die Positionierung ist besonders mächtig, um außermittige Umgebungslichteffekte zu erzeugen:
      </p>
      <pre><code>{`/* Glow coming from upper-right corner */
background: radial-gradient(ellipse at top right, rgba(251,191,36,0.4), transparent 60%);

/* Multiple radial gradients layered */
background:
  radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%),
  #0f172a;`}</code></pre>

      <h2>Konische Verläufe für Kreisdiagramme und Lade-Spinner</h2>
      <p>
        Die Fähigkeit des konischen Verlaufs, im Kreis zu führen, macht ihn zur nativen CSS-Lösung für zwei klassische
        UI-Komponenten, die zuvor SVG oder JavaScript erforderten:
      </p>
      <p>
        Für einen <strong>Fortschrittsring</strong> kombinieren Sie einen konischen Verlauf mit einer kreisförmigen
        Maske. Für ein Kreisdiagramm entsprechen die Segmente des konischen Verlaufs direkt den Datenprozentsätzen. Ein
        Segment, das von <code>0deg</code> bis <code>72deg</code> reicht, repräsentiert genau 20 % eines vollen Kreises.
        Das macht die Übersetzung von Daten in CSS unkompliziert — multiplizieren Sie den Prozentsatz mit 3,6, um den
        Gradwert zu erhalten.
      </p>

      <h2>Verläufe mit mehreren Stopps und harte Stopps für Streifenmuster</h2>
      <p>
        Farbstopps müssen nicht weich ineinander übergehen. Wenn zwei benachbarte Stopps dieselbe Position teilen, wird
        der Übergang zwischen ihnen augenblicklich — ein harter Stopp. Mit dieser Technik erzeugen Sie Streifenmuster,
        Schachbrettmuster und linierte Hintergründe vollständig in CSS:
      </p>
      <pre><code>{`/* Candy stripe pattern using hard stops */
background: linear-gradient(
  45deg,
  #6366f1 25%,
  transparent 25%,
  transparent 50%,
  #6366f1 50%,
  #6366f1 75%,
  transparent 75%
);
background-size: 40px 40px;

/* Warning stripe — alternating color hard stops */
background: repeating-linear-gradient(
  -45deg,
  #fbbf24,
  #fbbf24 10px,
  #1e293b 10px,
  #1e293b 20px
);`}</code></pre>

      <h2>Praxisnahe Anwendungsfälle mit Beispielcode</h2>

      <h3>Hintergründe für Hero-Bereiche</h3>
      <p>
        Ein linearer Verlauf mit mehreren Stopps und einem Geflecht aus zwei radialen Highlights verleiht Hero-Bereichen
        die Tiefe einer maßgeschneiderten Illustration ohne jegliche Bilddateien:
      </p>
      <pre><code>{`.hero {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15), transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15), transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
}`}</code></pre>

      <h3>Hover-Effekte für Schaltflächen</h3>
      <p>
        Verläufe können beim Hover mit dem <code>background-position</code>-Trick animiert werden — dimensionieren Sie
        den Verlauf auf 200 % und verschieben Sie seine Position beim Hover:
      </p>
      <pre><code>{`.btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.4s ease;
}
.btn:hover {
  background-position: 100% 50%;
}`}</code></pre>

      <h3>Kartenränder mit border-image</h3>
      <p>
        Die Eigenschaft <code>border-image</code> akzeptiert einen Verlauf, was Verlaufsränder ohne Wrapper-Elemente
        oder Pseudoelement-Tricks ermöglicht (für einfarbige Hintergründe):
      </p>
      <pre><code>{`.card-gradient-border {
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #6366f1, #ec4899) border-box;
}`}</code></pre>

      <h3>Fortschrittsbalken</h3>
      <p>
        Ein Verlaufs-Fortschrittsbalken kommuniziert Wert und visuelle Energie zugleich. Paaren Sie ihn mit einem
        <code>width</code>-Übergang für eine weiche Animation:
      </p>
      <pre><code>{`.progress-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  width: 73%; /* Controlled by JS or CSS custom property */
  transition: width 0.6s ease;
}`}</code></pre>

      <h2>Vergleich der Verlaufstypen</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Verlaufstyp</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>CSS-Funktion</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Bester Anwendungsfall</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Hero-Hintergründe, Schaltflächen, Banner</td>
              <td style={{padding: "12px 16px"}}><code>135deg, #667eea, #764ba2</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Radial</strong></td>
              <td style={{padding: "12px 16px"}}><code>radial-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Leuchteffekte, Spotlights, Umgebungslicht</td>
              <td style={{padding: "12px 16px"}}><code>circle at center, #6366f1, #1e1b4b</code></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>Konisch</strong></td>
              <td style={{padding: "12px 16px"}}><code>conic-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Kreisdiagramme, Farbräder, Spinner</td>
              <td style={{padding: "12px 16px"}}><code>#6366f1 0deg 120deg, #ec4899 120deg 240deg</code></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Wiederholend linear</strong></td>
              <td style={{padding: "12px 16px"}}><code>repeating-linear-gradient()</code></td>
              <td style={{padding: "12px 16px"}}>Streifenmuster, linierte Linien</td>
              <td style={{padding: "12px 16px"}}><code>-45deg, #fbbf24 0 10px, #1e293b 10px 20px</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Tipps zur Auswahl guter Verlaufsfarben</h2>
      <p>
        Der häufigste Fehler bei der Auswahl von Verlaufsfarben ist das direkte Überspringen des Farbkreises — zum
        Beispiel der direkte Übergang von Rot zu Grün. Da der Mittelpunkt dieses Übergangs durch ein matschiges
        bräunliches Grau verläuft, sieht das Ergebnis unattraktiv aus, selbst wenn die Endpunktfarben einzeln
        ansprechend sind.
      </p>
      <p>
        Die Lösung besteht darin, über einen stärker gesättigten Zwischenton zu führen. Versuchen Sie statt Rot direkt
        zu Grün lieber Rot → Orange → Gelbgrün für einen lebendigen Übergang. Alternativ bleiben Sie innerhalb eines
        benachbarten Farbtonbereichs — der Lila-zu-Rosa-Familie, der Indigo-zu-Cyan-Familie —, was stets saubere
        Ergebnisse liefert, weil der Mittelpunkt gesättigt bleibt.
      </p>
      <p>
        Ein paar praktische Richtlinien:
      </p>
      <ul>
        <li>Halten Sie die Sättigung an beiden Enden hoch, wenn Sie einen lebendigen Verlauf wünschen. Eine gesättigte Farbe in eine ungesättigte zu überblenden, erzeugt eine unschöne tote Zone in der Mitte.</li>
        <li>Das Überblenden verschiedener Helligkeitswerte (hell zu dunkel) innerhalb derselben Farbtonfamilie sieht fast immer professionell aus und funktioniert gut in UI-Hintergründen.</li>
        <li>Fügen Sie bei 50 % einen Zwischenfarbstopp hinzu, um den Mittelpunkt-Farbton zu steuern — das ist die einzelne wirkungsvollste Korrektur für matschige Verläufe.</li>
        <li>Beschränken Sie Verläufe für die meiste UI-Arbeit auf zwei oder drei Stopps. Mehr als drei Stopps wirken meist chaotisch, es sei denn, Sie erstellen absichtlich einen Regenbogen oder eine Datenvisualisierung.</li>
      </ul>

      <h2>Barrierefreiheit: Text auf Verläufen</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Warnung zur Barrierefreiheit:</strong> Platzieren Sie niemals Text auf einem Verlaufshintergrund, ohne
        den Kontrast an jedem Punkt entlang des Verlaufs zu prüfen. Ein Verlauf, der am dunklen Ende einen Kontrast von
        7:1 bietet, kann am hellen Ende auf 1,5:1 abfallen, was Text für Nutzer mit Sehschwäche unleserlich macht. WCAG
        AA erfordert ein Mindestkontrastverhältnis von 4,5:1 für normalen Text. Verwenden Sie entweder eine dunkle
        Überlagerung, beschränken Sie Text auf den kontraststarken Teil des Verlaufs oder wählen Sie einen
        Verlaufsbereich, der über seine gesamte Spanne ausreichenden Kontrast bewahrt.
      </div>

      <h2>So nutzen Sie den BrowseryTools CSS-Verlaufsgenerator</h2>
      <p>
        Der <a href="/tools/css-gradient">CSS-Verlaufsgenerator</a> gibt Ihnen eine Live-Vorschau, während Sie jeden
        Parameter konfigurieren. So nutzen Sie ihn wirksam:
      </p>
      <ul>
        <li><strong>Verlaufstyp wählen:</strong> Wechseln Sie oben im Tool zwischen Linear, Radial und Konisch.</li>
        <li><strong>Farbstopps hinzufügen:</strong> Klicken Sie auf die Verlaufsleiste, um neue Stopps hinzuzufügen. Ziehen Sie Stopps nach links und rechts, um ihre Positionen anzupassen. Klicken Sie auf einen Stopp, um die Farbauswahl zu öffnen und seine Farbe und Deckkraft zu ändern.</li>
        <li><strong>Richtung oder Winkel anpassen:</strong> Bei linearen Verläufen ziehen Sie das Winkelrad oder geben einen präzisen Gradwert ein. Bei radialen Verläufen legen Sie Form und Position fest.</li>
        <li><strong>Im Kontext vorschauen:</strong> Die Live-Vorschau aktualisiert sich sofort. Sie sehen genau, wie Ihr Verlauf aussehen wird, bevor Sie eine einzige Zeile kopieren.</li>
        <li><strong>Das CSS kopieren:</strong> Klicken Sie auf die Schaltfläche „CSS kopieren", um produktionsreifes CSS für die <code>background</code>-Eigenschaft zu erhalten, bereit zum Einfügen in jedes Stylesheet oder Framework.</li>
      </ul>
      <p>
        Alles läuft in Ihrem Browser. Es werden keine Verlaufsdefinitionen irgendwohin gesendet — es ist ein reines
        clientseitiges Tool. Sie können es offline verwenden, sobald die Seite geladen ist.
      </p>

      <h2>Browserunterstützung</h2>
      <p>
        CSS-Farbverläufe werden seit 2014 in allen großen Browsern unterstützt, was sie in praktisch jeder
        Produktionsumgebung ohne jegliche Polyfills oder Fallbacks sicher verwendbar macht. Konische Verläufe kamen
        später, sind nun aber in Chrome 69+, Firefox 83+, Safari 12.1+ und Edge 79+ vollständig unterstützt — und decken
        damit Stand 2026 weit über 97 % der weltweiten Browsernutzung ab. Das einzige Szenario, in dem Sie einen
        Fallback benötigen könnten, ist die Unterstützung sehr alter Android-WebView-Versionen in
        Unternehmens-Mobil-Apps.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Erstellen Sie jeden Verlauf visuell — kein Code erforderlich
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Live-Vorschau, kopierfertiges CSS und volle Kontrolle über Stopps, Winkel und Positionen.
          Läuft vollständig in Ihrem Browser, ohne dass Daten an einen Server gesendet werden.
        </p>
        <a
          href="/tools/css-gradient"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          CSS-Verlaufsgenerator öffnen →
        </a>
      </div>
    </div>
  );
}
