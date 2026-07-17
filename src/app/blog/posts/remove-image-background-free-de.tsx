import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Den Hintergrund aus einem Bild zu entfernen, war früher eine lästige Aufgabe, die professionellen Designern
        vorbehalten war. Heute dauert es etwa 5 Sekunden — und Sie können es vollständig in Ihrem Browser erledigen,
        ohne Uploads, ohne Konto, ohne Wasserzeichen und kostenlos. Dieser Leitfaden erklärt, wie die Technologie
        funktioniert, warum die beliebten Alternativen erhebliche Nachteile haben und wie Sie mit BrowseryTools jedes
        Mal perfekte Ergebnisse erzielen.
      </p>

      <ToolCTA slug="bg-removal" variant="inline" />
      <h2>Der alte Weg: Photoshop und GIMP</h2>
      <p>
        Jahrzehntelang bedeutete das Entfernen von Bildhintergründen eines von zwei Dingen: für Adobe Photoshop zu
        bezahlen (derzeit 21,99 $/Monat im Rahmen von Creative Cloud) und Zeit zu investieren, um dessen
        Auswahlwerkzeuge zu erlernen, oder das kostenlose, aber notorisch komplexe GIMP mit seiner steilen Lernkurve zu
        verwenden.
      </p>
      <p>
        Selbst erfahrene Photoshop-Nutzer wissen, dass eine saubere Hintergrundentfernung bei einem detailreichen Motiv
        — Haare, Fell, transparente Objekte — 10 bis 30 Minuten sorgfältiges Maskieren erfordern kann. Das Werkzeug
        „Motiv auswählen" hat die Lage verbessert, doch die manuelle Nachbearbeitung blieb. Für alle, die nicht ohnehin
        schon Designer waren, war dies für schnelle Aufgaben schlicht keine praktikable Option.
      </p>
      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Die wahren Kosten von Photoshop:</strong> 21,99 $/Monat bedeuten, dass Sie 264 $/Jahr bezahlen, nur um
        gelegentlich einen Hintergrund aus einem Produktfoto oder Profilbild zu entfernen. Für die meisten Menschen ist
        das kein vernünftiger Kompromiss.
      </div>

      <h2>Die „einfachen" Online-Tools — und ihre versteckten Kosten</h2>
      <p>
        Eine Welle von Online-Tools zur Hintergrundentfernung entstand, um diese Lücke zu füllen. Remove.bg startete
        2018 und wurde extrem beliebt. Canva fügte die Hintergrundentfernung als Funktion hinzu. Dutzende ähnlicher
        Dienste folgten. Sie lösen das Komplexitätsproblem — bringen aber andere Probleme mit sich.
      </p>

      <h3>Remove.bg</h3>
      <p>
        Remove.bg ist bei dem, was es tut, wirklich beeindruckend. Doch die kostenlose Stufe liefert nur Vorschauen in
        niedriger Auflösung — Downloads in voller Auflösung erfordern Credits, die je nach Volumen zwischen 0,20 $ und
        1,99 $ pro Bild kosten. Noch wichtiger: Jedes Bild, das Sie verarbeiten, wird auf deren Server hochgeladen. Ihre
        Datenschutzrichtlinie erlaubt es ihnen, Ihre Bilder zu speichern und zu verarbeiten. Für persönliche Fotos,
        Produktbilder mit geschützten Informationen oder alles Sensible ist dies ein erhebliches Bedenken.
      </p>

      <h3>Canva</h3>
      <p>
        Canvas Hintergrundentfernung ist hinter Canva Pro eingeschlossen, das 12,99 $/Monat oder 119,99 $/Jahr kostet.
        Die kostenlose Stufe enthält sie nicht. Wie Remove.bg verarbeitet Canva Ihre Bilder auf seinen Servern, das
        heißt, Ihre Dateien werden hochgeladen, aus der Ferne verarbeitet und in dessen Cloud-Infrastruktur
        gespeichert.
      </p>

      <h3>Das Muster</h3>
      <p>
        Nahezu jedes beliebte Online-Tool zur Hintergrundentfernung folgt demselben Modell: Bild hochladen, aus der
        Ferne verarbeiten, für hochwertige Ergebnisse bezahlen. Selbst die „kostenlosen" Versionen kommen mit
        Auflösungsbeschränkungen, Wasserzeichen, Verarbeitungslimits oder allen drei. Und Ihre Bilder reisen jedes
        einzelne Mal zu den Servern von jemand anderem.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Wichtige Erkenntnis:</strong> Jedes Mal, wenn Sie ein Bild zur Verarbeitung an einen Online-Dienst
        hochladen, vertrauen Sie diesem Dienst Ihre Daten an. Für persönliche Fotos, Kundenarbeiten oder geschützte
        Produktbilder ist das ein erhebliches und oft unnötiges Risiko.
      </div>

      <h2>Der BrowseryTools-Ansatz: KI, die auf Ihrem Gerät läuft</h2>
      <p>
        Die Hintergrundentfernung von BrowseryTools funktioniert grundlegend anders als jeder oben beschriebene Dienst.
        Das KI-Modell läuft vollständig in Ihrem Browser und nutzt die Rechenleistung Ihres eigenen Computers. Ihre
        Bilder verlassen niemals Ihr Gerät.
      </p>
      <p>
        Möglich wird dies durch zwei Technologien, die zusammenarbeiten:
      </p>
      <ul>
        <li>
          <strong>@imgly/background-removal:</strong> Eine quelloffene JavaScript-Bibliothek, die ein neuronales
          Netzwerkmodell implementiert, das speziell für die Hintergrundsegmentierung trainiert wurde. Das Modell
          basiert auf der RMBG-Architektur, die eine hochwertige Kantenerkennung insbesondere rund um Haare, Fell und
          komplexe Formen liefert.
        </li>
        <li>
          <strong>ONNX Runtime Web:</strong> Die Open-Neural-Network-Exchange-Laufzeitumgebung ermöglicht es
          Machine-Learning-Modellen, mithilfe von WebAssembly und optional WebGPU für Hardwarebeschleunigung effizient
          im Browser zu laufen. Das macht echte KI-Inferenz im Browser praktikabel — es ist dieselbe Technologie, die
          von Tools wie Whisper Web und Web-Implementierungen von Stable Diffusion verwendet wird.
        </li>
      </ul>
      <p>
        Die Modellgewichte werden bei der ersten Nutzung einmal in den Cache Ihres Browsers heruntergeladen und dann
        für jedes weitere Bild lokal verwendet. Nach diesem ersten Download funktioniert das Tool sogar offline.
      </p>

      <h2>Vorher und nachher: So sieht die Hintergrundentfernung aus</h2>

      <div style={{display: "flex", gap: "16px", margin: "28px 0", flexWrap: "wrap" as const}}>
        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "8px", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem"}}>
              🧑
            </div>
            <div style={{width: "100%", height: "60px", background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)", borderRadius: "0 0 12px 12px", position: "relative" as const, marginBottom: "-1px"}} />
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#64748b", fontWeight: 500}}>
            VORHER — Originalfoto mit unruhigem Hintergrund
          </p>
        </div>

        <div style={{display: "flex", alignItems: "center", fontSize: "2rem", fontWeight: 700, color: "#6366f1", padding: "0 8px"}}>
          →
        </div>

        <div style={{flex: 1, minWidth: "220px"}}>
          <div style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, white 0% 50%) 0 0 / 20px 20px", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.1)"}}>
            <div style={{width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"}}>
              🧑
            </div>
          </div>
          <p style={{textAlign: "center" as const, marginTop: "8px", fontSize: "0.85rem", color: "#16a34a", fontWeight: 500}}>
            NACHHER — Sauberer transparenter Hintergrund
          </p>
        </div>
      </div>

      <h2>So entfernen Sie einen Hintergrund mit BrowseryTools</h2>
      <p>
        Das <a href="/tools/bg-removal">BrowseryTools Tool zur Hintergrundentfernung</a> ist so unkompliziert wie
        möglich gestaltet. Hier der vollständige Schritt-für-Schritt-Ablauf:
      </p>
      <ol>
        <li>
          <strong>Öffnen Sie das Tool.</strong> Navigieren Sie zu <a href="/tools/bg-removal">/tools/bg-removal</a>. Bei
          Ihrem ersten Besuch werden die KI-Modellgewichte in den Cache Ihres Browsers heruntergeladen. Das dauert je
          nach Verbindung 10–20 Sekunden und geschieht nur einmal.
        </li>
        <li>
          <strong>Laden Sie Ihr Bild hoch.</strong> Klicken Sie auf den Upload-Bereich oder ziehen Sie Ihre Bilddatei
          per Drag-and-drop hinein. Zu den unterstützten Formaten gehören JPEG, PNG, WebP und die meisten gängigen
          Bildtypen. Die Datei bleibt auf Ihrem Gerät.
        </li>
        <li>
          <strong>Warten Sie auf die Verarbeitung.</strong> Die KI analysiert Ihr Bild lokal. Die Verarbeitung dauert
          je nach Bildauflösung und der Rechenleistung Ihres Geräts typischerweise 2–8 Sekunden. Eine Fortschrittsanzeige
          zeigt Ihnen den Stand der Dinge.
        </li>
        <li>
          <strong>Prüfen und herunterladen.</strong> Das Ergebnis erscheint neben Ihrem Original. Wenn Sie zufrieden
          sind, laden Sie das PNG mit transparentem Hintergrund herunter. Möchten Sie ein weiteres Bild ausprobieren,
          laden Sie einfach erneut hoch.
        </li>
      </ol>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Keine Uploads, keine Konten:</strong> BrowseryTools verarbeitet Ihre Bilder vollständig auf Ihrem
        eigenen Gerät. Zu keinem Zeitpunkt werden Bilddaten an einen Server gesendet. Sie müssen kein Konto erstellen,
        keine E-Mail-Adresse bestätigen und keine persönlichen Informationen angeben. Öffnen Sie einfach das Tool und
        nutzen Sie es.
      </div>

      <h2>Welche Bildtypen am besten funktionieren</h2>
      <p>
        Das KI-Modell ist auf einem breiten Datensatz trainiert, aber wie jedes Modell schneidet es bei bestimmten
        Bildtypen am besten ab. Dies zu verstehen, hilft Ihnen, durchweg hervorragende Ergebnisse zu erzielen.
      </p>

      <h3>Hervorragende Ergebnisse</h3>
      <ul>
        <li><strong>Personen und Porträts:</strong> Das Modell ist besonders gut auf menschliche Motive trainiert. Porträts, Headshots und Ganzkörperfotos mit klarer Abgrenzung des Motivs liefern nahezu perfekte Ergebnisse.</li>
        <li><strong>Produktfotografie:</strong> Gegenstände auf einfachen Hintergründen — weiß, grau oder studiobeleuchtet — werden sehr sauber verarbeitet. E-Commerce-Produktbilder sind ein idealer Anwendungsfall.</li>
        <li><strong>Tiere:</strong> Haustiere und Tiere funktionieren im Allgemeinen gut, wobei stark texturiertes Fell mit einem ähnlich getönten Hintergrund mitunter Kantenprobleme verursachen kann.</li>
        <li><strong>Fahrzeuge und Objekte:</strong> Autos, Möbel und andere feste Objekte mit klaren Silhouetten werden zuverlässig verarbeitet.</li>
      </ul>

      <h3>Schwierige Szenarien</h3>
      <ul>
        <li><strong>Glas und transparente Objekte:</strong> Weingläser, Wasserflaschen und andere transparente Gegenstände sind für jedes Modell zur Hintergrundentfernung schwierig, weil der Hintergrund durch das Motiv selbst hindurchscheint.</li>
        <li><strong>Sehr feine Details:</strong> Extrem feiner Maschenstoff, Spitze oder dünnes Haar vor einem komplexen Hintergrund können einen leichten Saum aufweisen. Für kritische Arbeiten erledigt eine schnelle manuelle Nachbearbeitung in einem beliebigen Bildeditor die Kanten.</li>
        <li><strong>Kontrastarme Motive:</strong> Ein weißes Hemd vor einer weißen Wand ist wirklich schwer zu segmentieren — selbst für Menschen. Sorgen Sie nach Möglichkeit für etwas Kontrast zwischen Motiv und Hintergrund.</li>
        <li><strong>Bilder mit sehr niedriger Auflösung:</strong> Bilder kleiner als 200x200 Pixel bieten möglicherweise nicht genügend Details für eine genaue Segmentierung.</li>
      </ul>

      <h2>Tipps für die besten Ergebnisse</h2>
      <ul>
        <li><strong>Beginnen Sie mit der höchstauflösenden Version, die Sie haben.</strong> Mehr Pixel geben der KI mehr Informationen zum Arbeiten, besonders an den Kanten. Das Ergebnis können Sie anschließend jederzeit verkleinern.</li>
        <li><strong>Sorgen Sie für eine gute Beleuchtung des Motivs.</strong> Gleichmäßiges Licht mit minimalen Schatten erleichtert dem Modell die Arbeit. Harte Schatten können mitunter als Teil des Hintergrunds interpretiert werden.</li>
        <li><strong>Verwenden Sie beim Fotografieren einen sauberen Hintergrund.</strong> Wenn Sie die Aufnahmeumgebung kontrollieren, liefert ein einfarbiger Hintergrund selbst mit KI-Verarbeitung stets sauberere Ergebnisse als eine komplexe Szene.</li>
        <li><strong>Verwenden Sie PNG-Ausgabe für Transparenz.</strong> Das heruntergeladene Ergebnis ist stets ein PNG mit transparentem Hintergrund, das in jedem Designtool über jeden neuen Hintergrund platziert werden kann.</li>
      </ul>

      <h2>Anwendungsfälle: Wo hintergrundfreie Bilder wirklich zählen</h2>

      <h3>E-Commerce-Produktfotos</h3>
      <p>
        Amazon, Shopify und die meisten Marktplätze verlangen oder empfehlen dringend Produktbilder mit weißem
        Hintergrund. Anstatt einen Fotografen mit Studioausstattung zu engagieren oder einen Retuschierdienst zu
        bezahlen, können Sie Produkte auf jeder neutralen Oberfläche fotografieren und den Hintergrund mit BrowseryTools
        in Sekunden entfernen. Verarbeiten Sie einen ganzen Produktkatalog, ohne ein einziges Bild an einen
        Drittanbieterdienst hochzuladen.
      </p>

      <h3>Profilbilder und Avatare</h3>
      <p>
        LinkedIn-Headshots, GitHub-Avatare, Slack-Profile und professionelle Biografien profitieren alle von einem
        sauberen Hintergrund. Anstatt eine Studiositzung nur für einen Headshot zu buchen, machen Sie ein gutes Foto bei
        ordentlichem Licht und entfernen den Hintergrund in Ihrem Browser. Fügen Sie anschließend in einem beliebigen
        Editor einen einfarbigen oder Verlaufshintergrund hinzu.
      </p>

      <h3>Präsentationen und Marketingmaterialien</h3>
      <p>
        Freigestellte Bilder lassen sich sauber in Folienhintergründe, Infografik-Layouts und Banner-Designs einfügen.
        Anstatt nach PNG-Dateien zu suchen, die bereits transparente Hintergründe haben, erstellen Sie Ihre eigenen aus
        jedem Foto, das Sie besitzen. Das ist besonders nützlich für Fotos von Teammitgliedern in
        Unternehmenspräsentationen.
      </p>

      <h3>Social-Media-Inhalte</h3>
      <p>
        Instagram-Posts, YouTube-Thumbnails, Twitter-Header und ähnliche Inhalte profitieren oft von freigestellten
        Motiven, die auf gebrandete oder thematische Hintergründe gesetzt werden. Eine hintergrundfreie Version eines
        Motivs gibt Ihnen völlige Flexibilität für kreative Kompositionen.
      </p>

      <h3>Kundenarbeit und Vertraulichkeit</h3>
      <p>
        Wenn Sie mit Kundenbildern arbeiten — Produktfotos, Porträts, geschützte Materialien —, ist das Letzte, was Sie
        wollen, diese Dateien auf einen Drittanbieterserver hochzuladen. Mit BrowseryTools bleiben Kundenbilder auf
        Ihrem Rechner. Punkt.
      </p>

      <h2>Direktvergleich: BrowseryTools vs. die Alternativen</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Merkmal</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Remove.bg</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Canva Pro</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Photoshop</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Kosten</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Kostenlos</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>Ab 0,20 $/Bild</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>12,99 $/Monat</td>
              <td style={{padding: "12px 16px", textAlign: "center"}}>21,99 $/Monat</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Bild-Uploads</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Keine — nur lokal</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ja, auf deren Server</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ja, auf deren Server</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Lokal (Desktop-App)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Konto erforderlich</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Nein</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Für Credits ja</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ja</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Ja (Adobe ID)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Ausgabe in voller Auflösung</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ja</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Nur kostenpflichtig</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ja</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ja</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Wasserzeichen</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Keine</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Nur kostenlose Stufe</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Keine</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Keine</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px", fontWeight: 500}}>Funktioniert offline</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a", fontWeight: 600}}>Ja (nach erstem Laden)</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Nein</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#dc2626"}}>Nein</td>
              <td style={{padding: "12px 16px", textAlign: "center", color: "#16a34a"}}>Ja</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Hintergrundentfernung im Stapel</h2>
      <p>
        Wenn Sie einen Stapel von Produktbildern verarbeiten müssen, unterstützt BrowseryTools auch die
        Hintergrundentfernung im Stapel. Sie können mehrere Bilder gleichzeitig hochladen und sie nacheinander
        verarbeiten, ohne das Tool zu verlassen oder irgendwelche Stapelskripte einzurichten. Für E-Commerce-Verkäufer
        oder Content-Ersteller mit großen Bibliotheken macht das das Tool für echte Arbeitsabläufe wirklich praktikabel —
        nicht nur für einmalige Aufgaben.
      </p>

      <h2>Was passiert mit Ihren Bildern?</h2>
      <p>
        Nichts verlässt Ihr Gerät. Wenn Sie ein Bild in das BrowseryTools Tool zur Hintergrundentfernung hochladen,
        liest das JavaScript auf der Seite die Datei mithilfe der File API des Browsers und übergibt sie direkt an die
        ONNX-Laufzeitumgebung, die in einem Web Worker läuft. Das Segmentierungsmodell läuft lokal, das Ausgabe-PNG wird
        im Arbeitsspeicher erzeugt, und Sie laden es herunter. Zu keinem Zeitpunkt reisen Bilddaten über eine
        Netzwerkverbindung.
      </p>
      <p>
        Sie können das selbst überprüfen, indem Sie während der Nutzung des Tools den Netzwerk-Tab in den
        Entwicklertools Ihres Browsers öffnen. Nach dem anfänglichen Modell-Download sehen Sie bei der Verarbeitung
        eines Bildes null Netzwerkanfragen.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Transparenz by Design:</strong> BrowseryTools beruht auf dem Grundsatz, dass Ihre Daten Ihnen gehören.
        Browserbasierte KI-Verarbeitung ist kein Workaround — sie ist die richtige architektonische Entscheidung für
        Tools, die persönliche oder sensible Inhalte verarbeiten.
      </div>

      <h2>Probieren Sie es jetzt aus</h2>
      <p>
        Kein Konto. Keine Kreditkarte. Keine Wasserzeichen. Keine Größenbeschränkungen in der kostenlosen Stufe — denn
        es gibt keine kostenpflichtige Stufe. Öffnen Sie einfach das Tool, ziehen Sie ein Bild hinein und laden Sie in
        Sekunden ein sauberes transparentes PNG herunter.
      </p>
      <div style={{background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Bildhintergründe entfernen — kostenlos, privat, sofort
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.9rem", color: "#64748b"}}>
          KI-gestützt. Läuft lokal. Keine Uploads. Keine Wasserzeichen.
        </p>
        <a
          href="/tools/bg-removal"
          style={{background: "linear-gradient(135deg, #ec4899, #be185d)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Tool zur Hintergrundentfernung öffnen →
        </a>
      </div>
      <ToolCTA slug="bg-removal" variant="card" />
    </div>
  );
}
