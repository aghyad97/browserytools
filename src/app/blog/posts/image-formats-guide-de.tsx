export default function Content() {
  return (
    <div>
      <p>
        Das falsche Bildformat zu wählen ist einer der häufigsten und teuersten Fehler in der
        Web-Performance. Ein JPEG, wo ein WebP ausreichen würde, ein PNG, wo ein JPEG genügt, oder
        ein Format, das Ihr Browser nicht unterstützt — jeder dieser Fehler fügt jeder Seitenladung
        unnötiges Gewicht hinzu und schadet direkt Ihren Core Web Vitals und der Nutzererfahrung.
        Dieser Leitfaden erklärt, wie JPEG, PNG, WebP und AVIF jeweils intern komprimieren, wann Sie
        welches Format einsetzen und wie Sie eine fundierte Entscheidung für Ihren Anwendungsfall
        treffen.
      </p>
      <p>
        Zwischen diesen Formaten können Sie mit dem{" "}
        <a href="/tools/image-converter">BrowseryTools Bildkonverter</a> konvertieren — kostenlos,
        ohne Anmeldung, alles läuft lokal in Ihrem Browser.
      </p>

      <h2>JPEG: Der Standard für Fotografie</h2>
      <p>
        JPEG (Joint Photographic Experts Group) wurde 1992 eingeführt und ist nach wie vor das
        dominante Format für Fotografien. Sein Kompressionsalgorithmus basiert auf der Diskreten
        Kosinustransformation (DCT): Jedes Bild wird in 8×8-Pixel-Blöcke aufgeteilt, und jeder
        Block wird vom Ortsbereich (Pixelfarben) in den Frequenzbereich (wie schnell sich Farben über
        den Block ändern) transformiert. Der Encoder quantisiert dann diese Frequenzdaten — er behält
        die Niederfrequenzkomponenten, die breite Farbregionen beschreiben, und verwirft oder gröbert
        die Hochfrequenzkomponenten, die feine Details und scharfe Kanten beschreiben.
      </p>
      <p>
        Deshalb erzeugt JPEG-Komprimierung bei aggressiven Einstellungen charakteristische Artefakte:
        blockige 8×8-Patches (Macroblocking), Verschmieren um scharfe Kanten und Farbbanding in
        Farbverläufen. Diese Artefakte treten in Bereichen mit feinen Details und hohem Kontrast auf —
        genau dort, wo die verworfenen Hochfrequenzkomponenten am meisten gefehlt hätten.
      </p>
      <p>
        JPEG ist verlustbehaftet — jedes Speichern verwirft dauerhaft Informationen. Bei Qualität
        85–90 (auf einer Skala von 0–100) sehen Fotografien beim Betrachten im Web typischerweise
        vom Original nicht zu unterscheiden aus, sind dabei aber 5–20× kleiner als ein PNG desselben
        Bildes. JPEG unterstützt keine Transparenz (Alphakanal) und keine Animationen.
      </p>

      <h2>PNG: Verlustfreie Präzision</h2>
      <p>
        PNG (Portable Network Graphics) verwendet verlustfreie Komprimierung auf Basis des
        DEFLATE-Algorithmus, der LZ77-Wörterbuch-Komprimierung (Suchen und Ersetzen wiederholter
        Bytefolgen) mit Huffman-Kodierung (kürzere Bitcodes für häufigere Werte) kombiniert. Es werden
        niemals Bilddaten verworfen. Jeder Pixel wird exakt gespeichert.
      </p>
      <p>
        Das macht PNG hervorragend für Bilder, die pixelgenau reproduziert werden müssen:
        Screenshots, Logos, Icons, Illustrationen mit scharfen Kanten, Text über Bildern und alles
        mit Transparenz. PNG unterstützt vollständige 8-Bit-Alphakanäle, was weiche halbtransparente
        Farbverläufe ermöglicht.
      </p>
      <p>
        Der Nachteil ist die Dateigröße. Bei fotografischen Inhalten mit durchgehenden Farbverläufen
        sind PNG-Dateien im Vergleich zu JPEG bei ähnlicher wahrgenommener Qualität enorm. Ein
        Foto als PNG gespeichert kann 10–20× größer sein als dasselbe Bild als gut komprimiertes
        JPEG. PNG glänzt, wenn Inhalte große gleichmäßige Bereiche, harte Kanten oder verhältnismäßig
        wenige verschiedene Farben haben — die Muster, die LZ77 effizient komprimiert. Fotografie
        mit ihren Millionen subtil verschiedener Farbwerte ist der schlechteste Fall für PNG.
      </p>

      <h2>WebP: Das moderne Web-Format</h2>
      <p>
        WebP wurde 2010 von Google eingeführt und basiert auf dem VP8-Video-Codec. Es unterstützt
        sowohl verlustbehaftete als auch verlustfreie Kompressionsmodi sowie Animationen und
        Transparenz in beiden Modi. Der verlustbehaftete Modus verwendet einen ähnlichen
        DCT-basierten Block-Ansatz wie JPEG, aber mit ausgefeilteren Vorhersagetechniken und
        Entropiekodierung und erreicht typischerweise 25–35 % kleinere Dateien als JPEG bei
        gleichwertiger visueller Qualität. Der verlustfreie Modus ist für die meisten Inhalte
        15–25 % effizienter als PNG.
      </p>
      <p>
        Die Browser-Unterstützung ist heute praktisch universell — alle großen Browser unterstützen
        WebP seit 2020. Die verbleibende Lücke sind ältere Software: einige ältere
        Bildbearbeitungsanwendungen und Betriebssystem-Bildbetrachter unterstützen WebP nicht nativ.
        Für die Web-Auslieferung ist WebP die unkomplizierte moderne Standardwahl, die in den meisten
        Fällen sowohl JPEG als auch PNG ersetzt.
      </p>

      <h2>AVIF: Die nächste Generation</h2>
      <p>
        AVIF (AV1 Image File Format) basiert auf Keyframes des AV1-Video-Codecs, der von der Alliance
        for Open Media entwickelt und 2018 veröffentlicht wurde. AV1s Kompressionstechniken sind
        deutlich ausgefeilter als die JPEG oder WebP zugrundeliegenden: größere, variabel große
        Vorhersageblöcke, ausgefeiltere Intra-Frame-Vorhersage, bessere Behandlung von Filmkorn und
        Rauschen sowie überlegene Entropiekodierung. Das Ergebnis sind typischerweise 40–50 % kleinere
        Dateien als JPEG bei gleichwertiger Qualität — oft schlägt es WebP um weitere 20–30 %.
      </p>
      <p>
        AVIF unterstützt volles HDR, breite Farbräume, Transparenz, Animationen und sowohl 8-Bit- als
        auch 10-Bit-Farbtiefe. Die Browser-Unterstützung hat schnell aufgeholt: Chrome (85+),
        Firefox (93+) und Safari (16+) unterstützen alle AVIF. Der Hauptnachteil ist die
        Kodierungsgeschwindigkeit — AVIF ist deutlich langsamer zu kodieren als JPEG oder WebP, was
        bei Echtzeit-Bildverarbeitungs-Pipelines wichtig ist, für vorab komprimierte statische Assets
        aber irrelevant ist.
      </p>

      <h2>Dateigrößenvergleich für dasselbe Bild</h2>
      <p>
        Um die Unterschiede konkret zu machen, hier ein repräsentativer Vergleich für ein
        1920×1080-Foto bei vergleichbarer wahrgenommener visueller Qualität:
      </p>
      <ul>
        <li>
          <strong>PNG (verlustfrei)</strong> — 4,2 MB. Perfekte Reproduktion, keine Artefakte.
          Geeignet als Quell-Master oder wenn Pixelgenauigkeit erforderlich ist.
        </li>
        <li>
          <strong>JPEG (Qualität 85)</strong> — 380 KB. Minimale sichtbare Artefakte bei
          Bildschirmgröße. Der Standard für fotografische Web-Auslieferung seit drei Jahrzehnten.
        </li>
        <li>
          <strong>WebP (verlustbehaftet, gleichwertige Qualität)</strong> — 270 KB. Etwa 30 %
          kleiner als JPEG, visuell vergleichbar. Ein unkompliziertes Upgrade für die meisten
          Web-Projekte.
        </li>
        <li>
          <strong>AVIF (gleichwertige Qualität)</strong> — 180 KB. Etwa 50 % kleiner als JPEG,
          visuell vergleichbar oder besser. Die beste heute verfügbare Dateigröße für
          fotografische Inhalte.
        </li>
      </ul>
      <p>
        Das sind repräsentative Werte; die tatsächlichen Verhältnisse variieren je nach Bildinhalt.
        Hochdetaillierte, rauschreiche Fotografie profitiert weniger von neueren Codecs als glatte,
        rauscharme Bilder.
      </p>

      <h2>Wann welches Format verwenden</h2>
      <ul>
        <li>
          <strong>Fotos im Web</strong> — Verwenden Sie WebP mit einem JPEG-Fallback über das HTML-{" "}
          <code>&lt;picture&gt;</code>-Element. Wenn Ihre Build-Pipeline AVIF-Kodierung unterstützt,
          liefern Sie AVIF mit WebP- und JPEG-Fallbacks.
        </li>
        <li>
          <strong>Logos, Icons, UI-Elemente mit Transparenz</strong> — WebP (verlustfrei) oder PNG.
          JPEG kann überhaupt keine Transparenz darstellen.
        </li>
        <li>
          <strong>Screenshots und Bildschirmaufnahmen</strong> — PNG für alles, das exakte
          Pixelreproduktion erfordert. WebP verlustfrei als kleinere Alternative, wenn exakte
          Treue nicht kritisch ist.
        </li>
        <li>
          <strong>Illustrationen mit flachen Farben und scharfen Kanten</strong> — PNG oder WebP
          verlustfrei. JPEG führt selbst bei hohen Qualitätseinstellungen sichtbare
          Ringing-Artefakte um harte Kanten ein.
        </li>
        <li>
          <strong>Druck und Archivierung</strong> — PNG (verlustfrei) oder TIFF. Verlustbehaftete
          Formate sind für Quell-Assets, die erneut bearbeitet werden sollen, ungeeignet.
        </li>
        <li>
          <strong>E-Mail</strong> — JPEG oder PNG. E-Mail-Clients haben inkonsistente Unterstützung
          für WebP und praktisch keine für AVIF. Hier gilt: Kompatibilität vor Optimierung.
        </li>
      </ul>

      <h2>Auswirkung auf Core Web Vitals und Seitenleistung</h2>
      <p>
        Largest Contentful Paint (LCP) — einer von Googles Core Web Vitals — misst, wie lange es
        dauert, bis das größte sichtbare Inhaltselement (oft ein Hero-Bild) geladen ist. Die Wahl
        des Bildformats wirkt sich direkt auf den LCP aus: Ein AVIF-Hero-Bild lädt schneller als
        das äquivalente JPEG, und ein schnellerer LCP verbessert sowohl die Nutzererfahrung als auch
        das Suchmaschinen-Ranking.
      </p>
      <p>
        Der kumulative Effekt ist ebenfalls bedeutsam. Eine Seite mit 20 Produktbildern, die
        unnötigerweise alle als PNG statt als WebP gespeichert sind, kann 5–10 MB schwerer sein als
        nötig. Bei mobilen Verbindungen ist das der Unterschied zwischen einer Seite, die in 2 Sekunden
        lädt, und einer, die 8 Sekunden braucht.
      </p>

      <h2>Verschiedene Formate an verschiedene Browser ausliefern</h2>
      <p>
        Das HTML-Element <code>&lt;picture&gt;</code> und seine <code>&lt;source&gt;</code>-Kinder
        ermöglichen es Ihnen, das beste Format für jeden Browser ohne JavaScript auszuliefern:
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
{`<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" />
</picture>`}
      </pre>
      <p>
        Der Browser wählt das erste unterstützte <code>&lt;source&gt;</code>-Element. Browser mit
        AVIF-Unterstützung laden die kleinste Datei; Browser ohne fallen auf WebP oder JPEG zurück.
        Das <code>&lt;img&gt;</code>-Tag am Ende dient als universeller Fallback und ist das einzige
        Element, das das <code>alt</code>-Attribut erfordert.
      </p>
      <p>
        Um Ihre vorhandenen Bilder für dieses Multi-Format-Setup in WebP oder AVIF zu konvertieren,
        verarbeitet der{" "}
        <a href="/tools/image-converter">BrowseryTools Bildkonverter</a> Stapelkonvertierungen, ohne
        etwas auf einen Server hochzuladen — Ihre Quelldateien bleiben auf Ihrem Gerät.
      </p>

      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Kurzentscheidungshilfe:</strong> Wenn Sie maximale Kompatibilität benötigen,
        verwenden Sie JPEG für Fotos und PNG für Grafiken. Wenn Sie für Web-Performance optimieren,
        verwenden Sie WebP als Basis und fügen Sie AVIF als Erweiterung hinzu. Wenn Sie ein neues
        Projekt von Grund auf mit einem modernen Stack aufbauen, liefern Sie AVIF mit WebP-Fallback
        und hören Sie auf, sich überhaupt noch Gedanken über JPEG zu machen.
      </div>
    </div>
  );
}
