export default function Content() {
  return (
    <div>
      <p>
        Videodateien sind von Natur aus enorm. Eine einzelne Minute unkomprimiertes 1080p-Videomaterial
        bei 30 Bildern pro Sekunde belegt etwa 1,5 GB Speicherplatz. Komprimierung ist kein nettes
        Zusatzfeature — sie ist der einzige Grund, warum Video im Internet überhaupt machbar ist. Aber
        nicht alle Komprimierung ist gleich, und die falschen Einstellungen können eine Datei erzeugen,
        die immer noch zu groß ist, sichtbar schlechter aussieht oder beides.
      </p>
      <p>
        Sie können jede Videodatei sofort mit dem{" "}
        <a href="/tools/compress-video">BrowseryTools Video-Kompressor</a> komprimieren — kostenlos,
        ohne Anmeldung, der gesamte Vorgang läuft lokal in Ihrem Browser. Ihr Videomaterial verlässt
        niemals Ihr Gerät.
      </p>

      <h2>Warum rohe Videodateien so groß sind</h2>
      <p>
        Um zu verstehen, was Komprimierung bewirkt, müssen Sie verstehen, womit Sie beginnen. Digitales
        Video ist eine Sequenz einzelner Frames — Standbilder, die in schneller Abfolge angezeigt werden,
        um die Illusion von Bewegung zu erzeugen. Bei 1080p-Auflösung enthält jeder Frame
        1.920 × 1.080 = 2.073.600 Pixel. Wenn jeder Pixel die Farbe als drei 8-Bit-Kanäle (Rot, Grün,
        Blau) speichert, sind das etwa 6 MB pro Frame. Bei 30 fps belegt eine Sekunde unkomprimiertes
        Video etwa 180 MB. Eine Minute über 10 GB.
      </p>
      <p>
        Rohformate wie RAW, BRAW oder Apple ProRes erfassen Video nahezu unkomprimiert, um maximale
        Qualität für die Nachbearbeitung zu bewahren. Consumer-Formate, Social-Media-Uploads und
        Streaming-Plattformen verwenden komprimierte Formate, bei denen ein Großteil dieser Daten
        verworfen oder rekonstruiert wurde — auf eine Weise, die das menschliche Auge kaum bemerkt,
        wenn es richtig gemacht wird.
      </p>

      <h2>Wie Video-Codecs funktionieren</h2>
      <p>
        Ein Codec (Coder-Decoder) ist ein Algorithmus, der Videodaten komprimiert und dekomprimiert.
        Die meisten modernen Codecs verwenden zwei ergänzende Techniken: räumliche Komprimierung
        innerhalb jedes Frames und zeitliche Komprimierung über Frames hinweg.
      </p>
      <p>
        <strong>Räumliche Komprimierung</strong> funktioniert wie JPEG-Komprimierung für Standbilder.
        Sie analysiert jeden Frame und verwirft visuelle Informationen, die das menschliche Auge schwer
        wahrnehmen kann — subtile Farbverläufe, feine Texturen in gleichmäßigen Bereichen,
        hochfrequente Details in peripheren Zonen. Das reduziert die Größe jedes einzelnen Frames
        erheblich.
      </p>
      <p>
        <strong>Zeitliche Komprimierung</strong> nutzt aus, dass aufeinanderfolgende Video-Frames
        einander meist sehr ähnlich sind. Statt jeden Pixel in jedem Frame zu speichern, speichert
        der Codec in regelmäßigen Abständen einen vollständigen Referenz-Frame (I-Frame oder Keyframe)
        und danach nur die Unterschiede — Bewegungsvektoren und geänderte Bereiche — für die
        dazwischenliegenden Frames (P-Frames und B-Frames). Ein Clip einer sprechenden Person vor
        einem statischen Hintergrund ändert sich von Frame zu Frame kaum, daher ist die komprimierte
        Darstellung dieser Zwischenframes winzig.
      </p>

      <h2>Die wichtigsten Codecs im Vergleich</h2>
      <ul>
        <li>
          <strong>H.264 (AVC)</strong> — das Arbeitstier des Internets. Eingeführt 2003 und heute
          universell auf Browsern, Geräten und Plattformen unterstützt. Liefert gute Qualität bei
          vernünftiger Dateigröße und läuft auf praktisch jedem in den letzten 15 Jahren hergestellten
          Gerät. Bei maximaler Kompatibilität ist H.264 die sichere Standardwahl.
        </li>
        <li>
          <strong>H.265 (HEVC)</strong> — der Nachfolger von H.264, der bei etwa gleichwertiger
          visueller Qualität die halbe Dateigröße erreicht. Das Problem sind Lizenzgebühren, die die
          Verbreitung verlangsamt haben. Nativ unterstützt auf Apple-Geräten und neuerer
          Windows-Hardware, aber Browser-Unterstützung ist lückenhaft. Ausgezeichnete Wahl für
          Archivierung oder Apple-zentrierte Workflows.
        </li>
        <li>
          <strong>VP9</strong> — Googles Antwort auf H.265 und der Codec hinter YouTube. Lizenzfrei
          und in Chrome und Firefox unterstützt. Kompressionswirksamkeit vergleichbar mit H.265.
          Wird häufig für Web-Auslieferung zusammen mit WebM-Containern verwendet.
        </li>
        <li>
          <strong>AV1</strong> — der neueste Generation-Codec, entwickelt von der Alliance for Open
          Media (Google, Netflix, Apple und andere). AV1 erreicht 30–50 % bessere Komprimierung als
          H.264 bei gleicher Qualität. Lizenzfrei, in modernen Browsern und Geräten zunehmend
          unterstützt. Der Nachteil ist sehr langsame Kodierung — AV1 kann 10–20× länger dauern als
          H.264. Geeignet für die finale Auslieferung von Inhalten, die viele Male angesehen werden;
          überdimensioniert für schnelles Teilen.
        </li>
      </ul>

      <h2>Bitrate, Auflösung und Framerate: Was die Dateigröße wirklich bestimmt</h2>
      <p>
        Drei Variablen bestimmen, wie groß eine komprimierte Videodatei wird:
      </p>
      <ul>
        <li>
          <strong>Bitrate</strong> — die Anzahl der Bits, die pro Sekunde Video gespeichert werden.
          Höhere Bitrate bedeutet mehr Daten, bessere Qualität, größere Datei. Ein 4K-YouTube-Upload
          könnte 35–68 Mbps verwenden; ein komprimierter Web-Clip könnte 2–5 Mbps verwenden. Die
          Bitrate ist der direkteste Hebel zur Steuerung der Dateigröße.
        </li>
        <li>
          <strong>Auflösung</strong> — die Pixelabmessungen des Frames. Der Wechsel von 4K
          (3840×2160) auf 1080p (1920×1080) reduziert die Pixelanzahl um 75 %, was bei gleicher
          Bitrate eine viel kleinere Datei ermöglicht oder bei deutlich niedrigerer Bitrate ähnliche
          Qualität. Für die meisten Web-Inhalte ist 1080p bei typischen Betrachtungsabständen und
          Bildschirmgrößen von 4K nicht zu unterscheiden.
        </li>
        <li>
          <strong>Framerate</strong> — Standard-Inhalte laufen mit 24, 25 oder 30 fps. Höhere
          Frameraten (60 fps, 120 fps) erfordern proportional mehr Daten bei gleicher Qualität. Der
          Wechsel von 60 fps auf 30 fps halbiert ungefähr die benötigte Bitrate bei gleichwertiger
          Qualität — eine erhebliche Einsparung bei Videos, bei denen flüssige Bewegung nicht die
          Hauptattraktion ist.
        </li>
      </ul>

      <h2>Verlustfreie vs. verlustbehaftete Komprimierung</h2>
      <p>
        Verlustfreie Komprimierung reduziert die Dateigröße, ohne Daten zu verwerfen. Das Original
        kann aus der komprimierten Datei perfekt rekonstruiert werden. Formate wie Apple ProRes 4444,
        FFV1 oder Huffyuv verwenden verlustfreie Komprimierung. Sie sind deutlich kleiner als
        Rohformate, aber im Vergleich zu Distributionsformaten immer noch sehr groß. Verlustfreie
        Komprimierung ist die richtige Wahl für Archiv-Master und Bearbeitungs-Workflows — nicht
        zum Teilen oder Streamen.
      </p>
      <p>
        Verlustbehaftete Komprimierung erreicht viel höhere Kompressionsraten, indem sie dauerhaft
        Daten verwirft, die der Encoder als nicht wahrnehmbar einstuft. H.264, H.265, VP9 und AV1
        sind alle verlustbehaftet. Sobald Sie in ein verlustbehaftetes Format komprimiert haben, sind
        die verworfenen Informationen weg. Das ist für die Distribution in Ordnung — der Zuschauer
        weiß nie, was entfernt wurde — aber es spielt eine große Rolle bei Workflows, wie im nächsten
        Abschnitt erläutert.
      </p>

      <h2>Generationsverlust: Warum Re-Komprimierung die Qualität verschlechtert</h2>
      <p>
        Jedes Mal, wenn Sie ein bereits komprimiertes verlustbehaftetes Video transcodieren
        (re-komprimieren), verschlechtert sich die Qualität. Der erste Komprimierungsdurchgang verwirft
        einige Informationen. Der zweite Durchgang arbeitet mit der bereits verschlechterten Version und
        verwirft mehr. Beim fünften oder sechsten Transcode häufen sich sichtbare Komprimierungsartefakte
        — Blockigkeit, Banding, Verschmieren — merklich an. Das nennt man Generationsverlust, in
        Analogie zur Qualitätsverschlechterung beim Kopieren von VHS-Kassetten.
      </p>
      <p>
        Die praktische Konsequenz: Komprimieren Sie immer vom originalen Quellmaterial aus. Bearbeiten
        Sie in einem verlustfreien oder hochbitraten Format und komprimieren Sie dann den fertigen
        Export einmal für die Auslieferung. Laden Sie niemals ein Video aus sozialen Medien herunter
        und re-komprimieren Sie es — Sie beginnen mit einer bereits verschlechterten Kopie und machen
        es noch schlechter.
      </p>

      <h2>Kompressionsziele für häufige Anwendungsfälle</h2>
      <ul>
        <li>
          <strong>E-Mail-Anhang</strong> — unter 25 MB halten (die meisten E-Mail-Clients haben dieses
          Limit). H.264 bei 720p, 1–2 Mbps. Für alles länger als 2–3 Minuten lieber auf einen
          Dateifreigabe-Dienst hochladen und einen Link senden.
        </li>
        <li>
          <strong>Web-Einbettung</strong> — unter 5 MB für kurze Clips anstreben, 10–20 Mbps für
          längere. H.264 bei 1080p ist eine sichere universelle Wahl. AV1 oder VP9 im WebM-Format
          wird für Browser, die es unterstützen, kleiner sein.
        </li>
        <li>
          <strong>Soziale Medien</strong> — Plattformen re-komprimieren alles auf ihrer Seite,
          daher laden Sie in der höchsten Qualität hoch, die Ihr Workflow innerhalb ihrer Größenlimits
          unterstützt. Instagrams Limit ist 4 GB; TikToks sind 287 MB für die meisten Formate. Da
          die Plattform einen eigenen Kompressionsdurchgang hinzufügt, erzeugt ein saubereres,
          höherbitraten Ausgangsmaterial ein merklich besseres Ergebnis nach deren Transcode.
        </li>
        <li>
          <strong>Archiv-Master</strong> — verlustfrei (ProRes 4444, FFV1) oder nahezu verlustfrei
          (ProRes 422 HQ) bei voller Auflösung. Speicherplatz ist günstig; Original-Aufnahmen
          wiederherzustellen ist unmöglich.
        </li>
      </ul>

      <h2>Praktische Tipps zur Wahl der Kompressions-Einstellungen</h2>
      <p>
        Einige Faustregeln, die konsistent gute Ergebnisse liefern:
      </p>
      <ul>
        <li>
          <strong>CRF-Modus verwenden, wenn die Dateigröße flexibel ist.</strong> Constant Rate Factor
          lässt den Encoder die Bitrate dynamisch variieren — mehr Bits für komplexe Szenen, weniger
          für einfache. Das erzeugt bessere Qualität pro Dateigröße als eine feste Bitrate. Für H.264
          deckt CRF 18–23 den Bereich von nahezu verlustfrei bis gut genug für das Web ab.
        </li>
        <li>
          <strong>Ausgabeauflösung an die Lieferplattform anpassen.</strong> Eine 4K-Quelle vor der
          Komprimierung auf 1080p herunterzuskalieren gibt dem Encoder weniger zu tun und erzeugt
          sauberere Ausgabe als bei 4K zu komprimieren und die Plattform herunterzuskalieren zu lassen.
        </li>
        <li>
          <strong>Audio ist ebenfalls wichtig.</strong> AAC mit 128–192 kbps deckt die meisten
          Stereo-Inhalte ab. Es gibt selten einen wahrnehmbaren Unterschied zwischen 192 kbps und
          320 kbps für Dialoge und Musik bei typischer Lautstärke, aber der Dateigrößenunterschied
          ist real.
        </li>
        <li>
          <strong>Vor dem Festlegen testen.</strong> Kodieren Sie einen 30-Sekunden-Clip mit Ihren
          Zieleinstellungen und prüfen Sie ihn auf derselben Art von Bildschirm und Verbindung, die
          Ihr Publikum verwenden wird. Eine Datei, die auf Ihrem Schnittmonitor bei voller Auflösung
          gut aussieht, kann auf einem Smartphone-Bildschirm Artefakte zeigen oder bei einer
          langsamen Verbindung puffern.
        </li>
      </ul>
      <p>
        Für schnelle Komprimierung ohne vollständige Bearbeitungsumgebung übernimmt der{" "}
        <a href="/tools/compress-video">BrowseryTools Video-Kompressor</a> die Einstellungen für Sie
        und verarbeitet alles in Ihrem Browser — keine Uploads, keine Wartezeiten, kein Drittanbieter-Zugriff
        auf Ihr Videomaterial.
      </p>

      <div
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "12px",
          padding: "16px 20px",
          margin: "24px 0",
        }}
      >
        <strong>Wichtigste Erkenntnis:</strong> Der beste Komprimierungs-Workflow ist: in einem
        hochwertigen Format bearbeiten, einmal in das Zielformat komprimieren und die Ausgabe nie
        re-komprimieren. Den richtigen Codec für Ihre Lieferplattform wählen, die Auflösung an die
        vorgesehene Bildschirmgröße anpassen und den CRF-Modus für qualitätsgesteuerte Komprimierung
        verwenden, statt eine willkürliche Bitrate anzustreben.
      </div>
    </div>
  );
}
