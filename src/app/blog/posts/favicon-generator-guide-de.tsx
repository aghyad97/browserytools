import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Ein Favicon ist das winzige Symbol, das in Ihrem Browser-Tab, in Ihrer Lesezeichenleiste, auf dem
        Startbildschirm Ihres Telefons, wenn jemand Ihre Website speichert, und zunehmend in den
        Suchergebnissen neben Ihrer Domain sitzt. Es ist eines der kleinsten Assets einer Website und eines
        der unverhältnismäßig wichtigsten: Eine Website ohne Favicon wirkt unfertig, während ein scharfes,
        wiedererkennbares Favicon eine Marke schon ab dem allerersten Pixel ausgefeilt erscheinen lässt. Das
        Problem ist, dass es früher unnötig mühsam war, Favicons richtig hinzubekommen – und genau das löst
        ein guter <a href="/tools/favicon-generator">Favicon-Generator online</a>.
      </p>

      <ToolCTA slug="favicon-generator" variant="inline" />
      <h2>Warum ein Favicon niemals ausreicht</h2>
      <p>
        Im frühen Web legten Sie eine einzige <code>favicon.ico</code> in Ihr Stammverzeichnis und waren
        fertig. Heute wollen Browser, Betriebssysteme und App-Launcher alle unterschiedliche Größen für
        unterschiedliche Kontexte. Ein 16×16-Symbol wird im Browser-Tab dargestellt. Ein 32×32 wird für
        höher auflösende Displays und die Windows-Taskleiste verwendet. Apple-Geräte wollen ein 180×180-
        <code>apple-touch-icon.png</code> für den Startbildschirm. Android und Progressive Web Apps
        referenzieren 192×192- und 512×512-PNGs aus einem Web-Manifest. Verpassen Sie eines, und Ihr Symbol
        sieht in diesem Kontext verschwommen, verpixelt oder schlicht abwesend aus.
      </p>
      <p>
        All diese von Hand in einem Bildbearbeitungsprogramm zu erstellen, ist mühsam und fehleranfällig. Sie
        müssen jedes einzelne skalieren, es in den richtigen Pixelmaßen exportieren, die Dateien exakt richtig
        benennen und dann das HTML schreiben, das sie alle verknüpft. Unser Tool erledigt das Ganze mit einem
        Klick, vollständig in Ihrem Browser.
      </p>

      <h2>Ein Favicon aus einem Bild erstellen</h2>
      <p>
        Der häufigste Arbeitsablauf besteht darin, ein <strong>Favicon aus einem Bild zu erstellen</strong> –
        normalerweise einem Logo oder App-Symbol. Ziehen Sie ein PNG, JPG, WebP, SVG oder GIF in den
        Upload-Bereich. Das Tool zeichnet Ihr Bild auf eine quadratische Canvas mit einer Cover-Anpassung (so
        werden nicht quadratische Bilder zentriert und beschnitten statt verzerrt) und skaliert es dann auf
        jede Größe im Standardset herunter. Da Favicons so klein angezeigt werden, liefert ein sauberes,
        kontrastreiches, idealerweise quadratisches Quellbild die besten Ergebnisse. Feine Details und kleiner
        Text neigen dazu, bei 16×16 zu verschwinden, weshalb einfachere Marken weitaus besser lesbar sind.
      </p>

      <h2>Oder ein Favicon aus einem Buchstaben oder Emoji generieren</h2>
      <p>
        Nicht jeder hat ein Logo parat – und Sie brauchen auch keines. Wechseln Sie in den
        Buchstaben-/Emoji-Modus, tippen Sie ein einzelnes Zeichen (eine Markeninitiale wie &quot;B&quot; oder
        ein Emoji wie 🚀), wählen Sie eine Hintergrundfarbe und eine Textfarbe, und das Tool rendert ein
        sauberes, zentriertes Glyph in jeder Größe. Das ist perfekt für Nebenprojekte, interne Tools,
        Dokumentationsseiten und schnelle Prototypen. Sie erhalten ein markantes, markengerechtes Favicon,
        ohne überhaupt eine Design-App zu öffnen.
      </p>

      <h2>Was Sie tatsächlich herunterladen</h2>
      <p>
        Wenn Sie auf Herunterladen klicken, bündelt das Tool ein vollständiges, produktionsreifes Paket in
        einer einzigen ZIP-Datei:
      </p>
      <p>
        <strong>PNG-Symbole</strong> in 16×16, 32×32, 48×48, 180×180 (das Apple-Touch-Icon), 192×192 und
        512×512.
        <br />
        <strong>favicon.ico</strong> – eine echte Multi-Resolution-ICO-Datei, die sowohl 16×16- als auch
        32×32-Bilder enthält, direkt in Ihrem Browser kodiert, damit ältere Browser und Windows weiterhin ein
        ordentliches Symbol erhalten.
        <br />
        <strong>site.webmanifest</strong> – ein bearbeitungsbereites Web-App-Manifest, das die 192er- und
        512er-PNGs für Android- und PWA-Installationen referenziert.
        <br />
        <strong>Das HTML-Snippet</strong> – die genauen <code>&lt;link&gt;</code>-Tags, die Sie in Ihren{" "}
        <code>&lt;head&gt;</code> einfügen, ebenfalls mit einem Klick direkt aus dem Tool kopierbar.
      </p>

      <h2>So fügen Sie Favicons zu Ihrer Website hinzu</h2>
      <p>
        Das Hinzufügen von Favicons ist ein zweistufiger Vorgang. Entpacken Sie zuerst die
        heruntergeladenen Dateien in das Stamm- oder Public-Verzeichnis Ihrer Website (an denselben Ort, an
        dem Ihre <code>index.html</code> oder der Public-Ordner Ihres Frameworks liegt). Fügen Sie zweitens
        die generierten Link-Tags in den <code>&lt;head&gt;</code> Ihres HTML ein:
      </p>
      <pre dir="ltr">
        <code>{`<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`}</code>
      </pre>
      <p>
        Wenn Sie Next.js verwenden, legen Sie die Dateien in das <code>public/</code>-Verzeichnis und fügen
        die Tags entweder zu Ihrem Root-Layout hinzu oder verlassen sich auf die Metadata-API des Frameworks.
        Bei WordPress haben die meisten Themes eine Website-Symbol-Einstellung, die ein einzelnes
        quadratisches PNG akzeptiert – laden Sie dort das 512×512 hoch. Für statische Seiten und Frameworks
        wie Astro, Vite oder reines HTML funktioniert das obige Snippet unverändert.
      </p>

      <h2>Alles läuft in Ihrem Browser</h2>
      <p>
        Viele Favicon-Generatoren laden Ihr Logo auf einen Server hoch, verarbeiten es aus der Ferne und
        senden es Ihnen per E-Mail oder leiten Sie zu einem Download weiter. Unserer tut das niemals. Die
        gesamte Pipeline – das Dekodieren Ihres Bildes, das Zeichnen auf Canvas, das Skalieren, das Kodieren
        der ICO und PNGs sowie das Zippen des Ergebnisses – geschieht lokal mit der HTML-Canvas und der in
        Ihrem Tab laufenden <code>jszip</code>-Bibliothek. Ihr Logo verlässt niemals Ihr Gerät, es gibt kein
        Konto zu erstellen, kein Wasserzeichen und kein Upload-Limit. Es ist wirklich kostenlos und wirklich
        privat.
      </p>

      <h2>Tipps für scharfe Favicons</h2>
      <p>
        Beginnen Sie mit einer quadratischen Quelle, damit nichts unerwartet beschnitten wird. Verwenden Sie
        kräftige Formen und hohen Kontrast, damit das Symbol bei 16 Pixeln lesbar bleibt. Vermeiden Sie dünne
        Linien und kleinen Text – sie verschwinden bei kleinen Größen. Wenn Sie den Buchstabenmodus verwenden,
        liest sich eine kräftige Hintergrundfarbe mit weißem Text in hellen und dunklen Browser-Themes sauber.
        Und prüfen Sie Ihr Favicon nach dem Deployment immer in einem echten Browser-Tab, denn nichts geht
        über das Sehen in echter Größe.
      </p>

      <h2>Probieren Sie es jetzt aus</h2>
      <p>
        Öffnen Sie den <a href="/tools/favicon-generator">Favicon-Generator</a>, laden Sie ein Logo hoch oder
        tippen Sie einen Buchstaben, und laden Sie Ihr komplettes Favicon-Set in Sekunden herunter. Während
        Sie hier sind, könnten Ihnen auch der{" "}
        <a href="/tools/image-resizer">Bildgrößen-Ändern</a>, der{" "}
        <a href="/tools/image-converter">Bildformat-Konverter</a> und der{" "}
        <a href="/tools/meta-tags">Meta-Tags-Generator</a> gefallen – alle kostenlos, alle privat, alle
        vollständig in Ihrem Browser laufend.
      </p>
      <ToolCTA slug="favicon-generator" variant="card" />
    </div>
  );
}
