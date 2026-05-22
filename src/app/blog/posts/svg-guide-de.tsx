export default function Content() {
  return (
    <div>
      <p>
        SVG ist eine dieser Technologien, die von außen einfach wirkt — es ist doch nur ein
        Zeichenformat, oder? — die aber tieferes Studium stärker lohnt als fast jedes andere Format
        im Werkzeugkasten eines Entwicklers oder Designers. SVG-Dateien skalieren unendlich ohne
        Qualitätsverlust, wiegen für einfache Grafiken fast nichts, können mit CSS gestaltet, mit
        JavaScript oder CSS-Übergängen animiert und direkt in HTML eingebettet werden. SVG richtig
        zu verstehen verändert die Art, wie Sie über Grafiken im Web nachdenken.
      </p>
      <p>
        Jede SVG-Datei können Sie mit dem{" "}
        <a href="/tools/svg">BrowseryTools SVG-Tool</a> anzeigen, prüfen und optimieren — kostenlos,
        ohne Anmeldung, alles läuft in Ihrem Browser.
      </p>

      <h2>Was ist SVG?</h2>
      <p>
        SVG steht für Scalable Vector Graphics. Anders als JPEG, PNG oder WebP — die Bilder als
        Raster aus farbigen Pixeln speichern (Rastergrafiken) — speichert SVG Bilder als mathematische
        Beschreibungen von Formen. Ein Kreis wird als Mittelpunkt und Radius beschrieben. Ein Pfad
        wird als Folge von Zeichenbefehlen beschrieben: zu diesem Punkt bewegen, eine Linie zu jenem
        Punkt zeichnen, eine Kurve durch diese Kontrollpunkte ziehen, den Pfad schließen.
      </p>
      <p>
        SVG ist ein XML-basiertes Format, d. h. jede SVG-Datei ist reiner Text, menschenlesbar und
        als Baum verschachtelter Elemente strukturiert. Öffnen Sie eine SVG-Datei in einem Texteditor
        und Sie sehen lesbares Markup, keinen binären Blob. Das hat erhebliche praktische Folgen:
        SVG-Dateien können programmatisch generiert, mit Textverarbeitungstools modifiziert, in der
        Versionskontrolle verglichen und direkt in HTML eingebettet werden, ohne weitere Verarbeitung.
      </p>
      <p>
        Das Format ist ein W3C-Standard, der gemeinsam mit HTML und CSS gepflegt wird. Jeder moderne
        Browser hat eine vollständige SVG-Rendering-Engine eingebaut.
      </p>

      <h2>Warum SVG für Icons und Illustrationen Rastergrafiken überlegen ist</h2>
      <p>
        Der entscheidende Vorteil von SVG gegenüber Rastergrafiken für Icons, Logos und Illustrationen
        ist die Auflösungsunabhängigkeit. Ein mit 32×32 Pixeln erstelltes Raster-Icon wirkt auf einem
        Retina-Display unscharf, das mit 2× oder 3× physischen Pixeln pro CSS-Pixel rendert. Um das
        zu beheben, müssten Sie entweder mehrere Auflösungsvarianten exportieren (@1x, @2x, @3x), die
        Quellauflösung erhöhen (größere Dateien, mehr Speicher) oder image-set in CSS verwenden, um
        die richtige Auflösung auszuliefern. Mit SVG erstellen Sie die Grafik einmal und sie sieht
        bei jeder Größe, auf jedem Display, für immer perfekt aus.
      </p>
      <p>
        Dateigröße ist der andere große Vorteil bei einfachen Grafiken. Ein einfaches Icon — ein
        Häkchen, ein Pfeil, ein Hamburger-Menü — lässt sich in einer SVG-Datei mit 200–500 Bytes
        beschreiben. Das äquivalente PNG bei 2× Retina-Auflösung könnte 2–5 KB sein. Bei 3× noch
        größer. Wenn eine Benutzeroberfläche 50 Icons hat, ist der Unterschied zwischen 50
        optimierten SVGs (zusammen ~20 KB) und 50 PNG-Sets (zusammen ~300+ KB) bedeutsam.
      </p>
      <p>
        Rastergrafiken gewinnen bei fotografischen Inhalten und komplexen, sehr detaillierten
        Illustrationen mit glatten Farbverläufen und Texturen. Eine vektorielle SVG-Darstellung
        eines Fotos wäre enorm und würde stilisiert statt fotografisch wirken. Das richtige Format
        hängt vollständig von der Art des Inhalts ab.
      </p>

      <h2>SVG-Anatomie: Die Kernelemente</h2>
      <p>
        Eine minimale SVG-Datei hat diese Struktur:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
  <path d="M8 12 L12 16 L16 8" stroke="white" stroke-width="2" fill="none" />
</svg>`}
      </pre>
      <p>
        Die wichtigsten Elemente und Attribute:
      </p>
      <ul>
        <li>
          <strong>viewBox</strong> — definiert das interne Koordinatensystem.{" "}
          <code>viewBox="0 0 24 24"</code>{" "}
          bedeutet, der Zeichenraum reicht von (0,0) bis (24,24). Das SVG kann dann in jeder
          tatsächlichen Größe gerendert werden — 16×16, 32×32, 200×200 — und der Browser skaliert
          das Koordinatensystem entsprechend. Das ist der Mechanismus hinter der
          Auflösungsunabhängigkeit.
        </li>
        <li>
          <strong>path</strong> — das mächtigste SVG-Element. Ein <code>d</code>-Attribut enthält
          Zeichenbefehle: <code>M</code> (move to), <code>L</code> (line to), <code>C</code> (cubic
          bezier curve), <code>A</code> (arc), <code>Z</code> (close path). Fast jede Form lässt
          sich als Pfad ausdrücken.
        </li>
        <li>
          <strong>circle, rect, ellipse, line, polygon</strong> — Hilfs-Elemente für häufige Formen.
          Ein <code>&lt;circle&gt;</code> nimmt <code>cx</code>, <code>cy</code> und <code>r</code>.
          Ein{" "}
          <code>&lt;rect&gt;</code> nimmt <code>x</code>, <code>y</code>, <code>width</code> und{" "}
          <code>height</code>, plus optional <code>rx</code> für abgerundete Ecken.
        </li>
        <li>
          <strong>text</strong> — SVG kann typografischen Text rendern, der mit dem Bild skaliert
          und auswählbar sowie barrierefrei bleibt, anders als in ein Rasterbild gerenderter Text.
        </li>
        <li>
          <strong>g (Gruppe)</strong> — gruppiert Kindelemente zusammen, sodass Transformationen,
          Stile und Deckkraft auf die gesamte Gruppe auf einmal angewendet werden können.
        </li>
        <li>
          <strong>defs und use</strong> — wiederverwendbare Elemente einmalig definieren und mehrfach
          mit <code>&lt;use&gt;</code> referenzieren. Unverzichtbar für Icon-Systeme, die ein einzelnes
          SVG-Sprite verwenden.
        </li>
      </ul>

      <h2>SVG mit CSS gestalten und animieren</h2>
      <p>
        SVG-Elemente sind Teil des DOM, wenn SVG in HTML eingebettet ist. Das bedeutet, CSS kann sie
        direkt mit denselben Selektoren ansprechen, die für HTML-Elemente verwendet werden. Sie können
        Füllfarben, Strichbreiten und Deckkraft beim Hovern, im Dunkelmodus oder als Reaktion auf
        jede Zustandsänderung anpassen:
      </p>
      <pre
        style={{
          background: "rgba(0,0,0,0.06)",
          borderRadius: "0.5rem",
          padding: "1rem 1.25rem",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >
{`/* Target SVG elements with CSS */
.icon-check circle {
  fill: #22c55e;
  transition: fill 0.2s ease;
}

.icon-check:hover circle {
  fill: #16a34a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .icon-check circle { fill: #4ade80; }
}`}
      </pre>
      <p>
        CSS-Animationen und -Übergänge funktionieren bei SVG-Eigenschaften. Der{" "}
        <code>stroke-dasharray</code>- und{" "}
        <code>stroke-dashoffset</code>-Trick — einen Pfad durch Manipulation des sichtbaren Teils
        eines gestrichelten Strichs von unsichtbar zu sichtbar zu animieren — erzeugt den
        „Zeicheneffekt", der auf vielen Ladebalken und Onboarding-Illustrationen zu sehen ist. SVG
        hat auch eigene <code>&lt;animate&gt;</code>- und{" "}
        <code>&lt;animateTransform&gt;</code>-Elemente (SMIL-Animation), aber CSS- und
        JavaScript-Animationen sind für die Wartbarkeit generell vorzuziehen.
      </p>
      <p>
        Die Verwendung von <code>currentColor</code> als Füllwert lässt ein SVG-Icon automatisch die
        Textfarbe seines übergeordneten Elements übernehmen und ermöglicht so einem einzelnen Icon,
        sich ohne Modifikation an jeden Farbkontext anzupassen.
      </p>

      <h2>SVG-Optimierung mit SVGO</h2>
      <p>
        SVG-Dateien, die aus Design-Tools wie Figma oder Illustrator exportiert wurden, enthalten
        viel unnötigen Ballast: Editor-Metadaten, redundante Attribute, Gruppencontainer ohne Wirkung,
        Gleitkommakoordinaten mit acht Dezimalstellen, <code>id</code>-Attribute, die vom internen
        Node-System des Design-Tools generiert wurden. Bei einem einfachen Icon kann dieser Overhead
        die Dateigröße im Vergleich zu einer handoptimierten Version verdreifachen oder -vervierfachen.
      </p>
      <p>
        SVGO (SVG Optimizer) ist das Standardwerkzeug zum Entfernen dieses Overheads. Es wendet eine
        konfigurierbare Reihe von Transformationen an: verschachtelte Gruppen zusammenführen, unsichtbare
        Elemente entfernen, Koordinaten auf vernünftige Präzision runden, redundante Pfade
        zusammenführen, Metadaten und Kommentare entfernen und mehr. Ein typischer SVGO-Durchgang
        reduziert die SVG-Dateigröße bei Icons um 30–60 % ohne sichtbare Änderung.
      </p>
      <p>
        Das{" "}
        <a href="/tools/svg">BrowseryTools SVG-Tool</a> wendet SVG-Optimierung in Ihrem Browser an
        und liefert Ihnen das optimierte Ergebnis, ohne Befehlszeilen-Tools installieren zu müssen.
      </p>

      <h2>Inline-SVG vs. externe Datei vs. CSS-Hintergrundbild</h2>
      <p>
        Es gibt drei Hauptmethoden, ein SVG in eine Webseite einzubinden, jede mit anderen
        Kompromissen:
      </p>
      <ul>
        <li>
          <strong>Inline-SVG</strong> — das SVG-Markup ist direkt in den HTML-Code eingebettet. Gibt
          vollen CSS- und JavaScript-Zugriff auf jedes Element innerhalb des SVG. Am besten für Icons,
          die Hover-Effekte, Farbänderungen oder Animationen benötigen. Kann nicht separat vom Browser
          gecacht werden.
        </li>
        <li>
          <strong>Externe SVG-Datei via <code>&lt;img&gt;</code></strong> — das SVG ist eine separate
          Datei, die mit <code>&lt;img src="icon.svg"&gt;</code> referenziert wird. Der Browser kann
          die Datei cachen. Einfach zu verwenden. Aber CSS der übergeordneten Seite kann nicht ins
          SVG hineinreichen, und JavaScript kann seinen Inhalt nicht manipulieren.
        </li>
        <li>
          <strong>CSS background-image</strong> — das SVG wird als CSS-Hintergrundbild referenziert.
          Funktioniert für rein dekorative Grafiken. Das SVG kann auch als Data-URI in CSS eingebettet
          werden, nützlich für kleine Icons in Komponenten-Stylesheets. CSS kann Elemente innerhalb
          des SVG nicht neu gestalten.
        </li>
      </ul>
      <p>
        SVG-Sprite-Sheets — eine einzige SVG-Datei mit allen Icons, die in <code>&lt;defs&gt;</code>-Blöcken
        definiert und mit <code>&lt;use href="sprite.svg#icon-name"&gt;</code> referenziert werden —
        bieten eine gute Balance: eine cachefähige Netzwerkanfrage für alle Icons, mit
        DOM-Manipulation pro Icon in den meisten modernen Browsern möglich.
      </p>

      <h2>Häufige SVG-Fallstricke: XSS via SVG</h2>
      <p>
        SVG unterstützt eingebettete Skripte, Event-Handler und externe Ressourcenreferenzen, was es
        zu einem möglichen Angriffsvektor für Cross-Site-Scripting (XSS) macht, wenn vom Nutzer
        hochgeladene SVG-Dateien in einem Browser-Kontext angezeigt werden. Eine SVG-Datei mit{" "}
        <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code> führt dieses Skript aus,
        wenn der Browser das SVG als Teil einer Seite rendert.
      </p>
      <p>
        Die Regeln für den sicheren Umgang mit vom Nutzer hochgeladenen SVGs:
      </p>
      <ul>
        <li>
          Betten Sie vom Nutzer hochgeladene SVGs niemals direkt in Ihren HTML-Code ein. Betten Sie
          nur SVGs ein, die Sie selbst kontrollieren.
        </li>
        <li>
          Wenn Sie vom Nutzer hochgeladene SVGs anzeigen müssen, liefern Sie sie von einem separaten,
          sandgeboxten Ursprung und zeigen Sie sie in einem <code>&lt;img&gt;</code>-Tag oder einem
          sandgeboxten <code>&lt;iframe&gt;</code> an. Das{" "}
          <code>&lt;img&gt;</code>-Tag führt keine Skripte im SVG aus.
        </li>
        <li>
          Bereinigen Sie vom Nutzer hochgeladene SVGs, indem Sie sie durch einen Sanitizer laufen
          lassen (DOMPurify mit der SVG-Konfiguration), bevor Sie sie speichern oder anzeigen.
        </li>
        <li>
          Setzen Sie den Content-Security-Policy-Header, um Skriptquellen auf Seiten zu beschränken,
          die SVGs anzeigen.
        </li>
      </ul>

      <h2>SVG in PNG konvertieren</h2>
      <p>
        Einige Kontexte unterstützen kein SVG: ältere E-Mail-Clients, bestimmte CMS-Plattformen,
        manche Bildverarbeitungs-Pipelines, App-Icon-Anforderungen für iOS und Android und
        Open-Graph-Vorschaubilder. In diesen Fällen müssen Sie das SVG als gerasterte PNG-Datei
        exportieren.
      </p>
      <p>
        Da SVG verlustfrei skaliert, können Sie in jeder Größe in PNG exportieren. Für App-Icons
        bedeutet das, eine einzelne SVG-Quelle bei 1024×1024 zu exportieren und alle kleineren
        Größen davon abzuleiten. Für Retina-Webnutzung: bei 2× oder 3× der CSS-Anzeigegröße
        exportieren.
      </p>
      <p>
        Das{" "}
        <a href="/tools/svg">BrowseryTools SVG-Tool</a> kann SVG in der von Ihnen gewählten
        Auflösung in PNG rendern und die Konvertierung im Browser durchführen, ohne Dateien auf einen
        Server hochzuladen. Nützlich, wenn Sie ein SVG aus einem Design-Tool haben und ein PNG für
        einen Kontext benötigen, der kein SVG akzeptiert.
      </p>

      <div
        style={{
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Kurzreferenz:</strong> Verwenden Sie SVG für Icons, Logos, Illustrationen,
        UI-Elemente und alles, was skalieren muss. Verwenden Sie PNG (konvertiert aus SVG) für
        Kontexte, die Rastergrafiken erfordern. Führen Sie SVG-Dateien immer durch SVGO, bevor Sie
        sie ausliefern. Betten Sie vom Nutzer hochgeladene SVGs niemals direkt in Ihren HTML-Code
        ein. Verwenden Sie <code>currentColor</code> für Icons, die sich an ihren Texttfarb-Kontext
        anpassen müssen.
      </div>
    </div>
  );
}
