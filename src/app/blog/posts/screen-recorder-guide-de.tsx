import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Software zur Bildschirmaufnahme war historisch eines jener Werkzeuge, bei denen man einen Aufpreis für etwas
        zahlt, das sich anfühlt, als sollte es ein grundlegendes Hilfsprogramm sein. Camtasia kostet rund 300 $ als
        Einmalkauf oder 170 $/Jahr im Abonnement. ScreenFlow für Mac kostet 150 $. Loom — das sich als die
        leichtgewichtige Option positioniert — beschränkt kostenlose Nutzer auf 5-minütige Aufnahmen und drängt alle zu
        einem kostenpflichtigen Plan. Und jedes einzelne dieser Werkzeuge erfordert Installation, Kontoerstellung und
        das Vertrauen in eine Drittanbieteranwendung mit Zugriff auf Ihren gesamten Bildschirm.
      </p>
      <p>
        Hier ist, was die meisten Menschen nicht wissen: Ihr Browser weiß bereits, wie er Ihren Bildschirm aufnimmt. Die
        <strong>Screen Capture API</strong> (<code>getDisplayMedia</code>) ist ein W3C-Standard, der seit Jahren in
        jedem großen Browser ausgeliefert wird. Der{" "}
        <Link href="/tools/screen-recorder">BrowseryTools Bildschirmrekorder</Link> setzt eine aufgeräumte, praktische
        Oberfläche darauf — sodass Sie Ihren Bildschirm, ein bestimmtes Fenster oder einen einzelnen Browser-Tab
        aufnehmen können, ohne etwas zu installieren, ein Konto zu erstellen oder einen Cent zu bezahlen.
      </p>

      <h2>Browser-Kompatibilität: Das funktioniert für 98 %+ Ihrer Nutzer</h2>
      <p>
        Die Screen Capture API wird von allen modernen Browsern breit unterstützt. Sie müssen sich für kein realistisches
        Publikum um die Kompatibilität sorgen:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Browser</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Mindestversion</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Erscheinungsjahr</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Hinweise</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Chrome", "72+", "2019", "Volle Unterstützung inkl. Tab-Aufnahme"],
              ["Edge", "79+", "2020", "Chromium-basiert; gleiche Unterstützung wie Chrome"],
              ["Firefox", "66+", "2019", "Volle Unterstützung; großartige Audio-Aufnahme"],
              ["Safari", "13+", "2019", "Unterstützt; Tab-Aufnahme in Safari 15.4 ergänzt"],
            ].map(([browser, version, year, notes], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{browser}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace"}}>{version}</td>
                <td style={{padding: "11px 16px"}}>{year}</td>
                <td style={{padding: "11px 16px", opacity: 0.8}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Der kombinierte Browser-Marktanteil dieser Versionen deckt weltweit weit über 98 % der Desktop-Nutzer ab. In der
        Praxis funktioniert die Screen Capture API einfach, wenn Ihr Publikum einen modernen Browser verwendet — was es
        mit ziemlicher Sicherheit tut.
      </p>

      <h2>Was Sie aufnehmen können</h2>
      <p>
        Wenn Sie auf „Aufnahme starten" klicken, zeigt der Browser seine native Bildschirmauswahl an. Sie erhalten drei
        Aufnahmemodi, und die Wahl ist je nach Anwendungsfall von Bedeutung:
      </p>
      <ul>
        <li>
          <strong>Gesamter Bildschirm:</strong> Nimmt alles auf, was auf einem Ihrer Monitore sichtbar ist. Am besten
          für Demos, bei denen Sie zwischen mehreren Anwendungen wechseln, oder wenn Sie systemweites Verhalten zeigen
          möchten. Beachten Sie, dass dies alles zeigt — einschließlich Benachrichtigungen, Taskleiste und aller
          anderen Fenster —, schließen Sie also sensible Inhalte vor der Aufnahme.
        </li>
        <li>
          <strong>Ein bestimmtes Anwendungsfenster:</strong> Nimmt nur ein Fenster auf, selbst wenn andere Fenster es
          überlappen. Die Aufnahme bleibt auf diese Anwendung fokussiert. Gut für Software-Demos, bei denen Sie in einer
          einzigen App bleiben möchten, ohne Ihre anderen offenen Fenster preiszugeben.
        </li>
        <li>
          <strong>Ein einzelner Browser-Tab:</strong> Das ist die datenschutzbewussteste Option. Nur der Inhalt eines
          Browser-Tabs wird aufgenommen — andere Tabs, Ihre Adressleiste, andere Anwendungen und Ihr Desktop sind
          vollständig von der Aufnahme ausgeschlossen. Ideal, um Web-App-Durchläufe oder browserbasierte Demos
          aufzunehmen, ohne irgendetwas anderes zu zeigen.
        </li>
      </ul>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Tab-Aufnahme für maximalen Datenschutz:</strong> Wenn Sie eine Demo einer Webanwendung aufnehmen und
        keine anderen Browser-Tabs, anderen Anwendungen oder System-UI zeigen möchten, verwenden Sie die Option
        „Browser-Tab" in der Bildschirmauswahl. Nur der Pixelinhalt dieses einen Tabs wird aufgenommen. Nichts anderes
        auf Ihrem Rechner ist in der Aufnahme sichtbar.
      </div>

      <h2>Schritt für Schritt: So nutzen Sie den BrowseryTools Bildschirmrekorder</h2>
      <p>
        Der gesamte Vorgang bis zu Ihrer ersten Aufnahme dauert weniger als eine Minute. So funktioniert es genau:
      </p>
      <ol>
        <li>
          <strong>Öffnen Sie das Tool:</strong> Gehen Sie zu <Link href="/tools/screen-recorder">/tools/screen-recorder</Link>.
          Keine Anmeldung, kein Setup, nichts zu installieren. Das Tool ist bereit, sobald die Seite lädt.
        </li>
        <li>
          <strong>Klicken Sie auf „Aufnahme starten":</strong> Der Browser zeigt sofort seinen nativen
          Bildschirmauswahl-Dialog. Das ist eine UI auf Browser-Ebene — die Website kann nicht sehen oder beeinflussen,
          was in diesem Dialog angezeigt wird, und sie kann die Aufnahme nicht starten, bis Sie Ihre Auswahl
          ausdrücklich bestätigen.
        </li>
        <li>
          <strong>Wählen Sie, was aufgenommen werden soll:</strong> Wählen Sie „Gesamter Bildschirm", „Fenster" oder
          „Browser-Tab" aus den Registerkarten der Auswahl. Klicken Sie auf das Vorschaubild des
          Bildschirms/Fensters/Tabs, den Sie aufnehmen möchten, und klicken Sie dann auf die Schaltfläche „Teilen", um
          zu beginnen.
        </li>
        <li>
          <strong>Nehmen Sie auf:</strong> Das Tool zeigt einen Live-Zähler der verstrichenen Zeit an, sodass Sie stets
          wissen, wie lange Sie bereits aufnehmen. Wechseln Sie zu der Anwendung oder dem Inhalt, den Sie vorführen — der
          Browser-Tab, in dem der Rekorder läuft, bleibt im Hintergrund aktiv. Sie können den Timer mit einem Blick auf
          den Tab prüfen.
        </li>
        <li>
          <strong>Klicken Sie auf „Aufnahme stoppen":</strong> Wenn Sie fertig sind, klicken Sie auf Stopp. Die Aufnahme
          ist sofort als Videovorschau innerhalb des Tools verfügbar. Keine Verarbeitung, kein Warten — sie erscheint
          umgehend, weil alles lokal im Arbeitsspeicher aufgenommen wurde.
        </li>
        <li>
          <strong>Vorschau und Download:</strong> Schauen Sie sich die Vorschau an, um zu bestätigen, dass die Aufnahme
          das festgehalten hat, was Sie beabsichtigt haben. Klicken Sie auf „Download", um die Datei als <code>.webm</code>-Video auf Ihrem
          lokalen Rechner zu speichern. Die Aufnahme wird niemals irgendwohin hochgeladen.
        </li>
      </ol>

      <h2>Das Ausgabeformat: WebM</h2>
      <p>
        Die Screen Capture API gibt Video im <strong>WebM</strong>-Format mit dem VP8- oder VP9-Codec aus (je nachdem,
        welchen Ihr Browser auswählt). WebM ist ein offenes, lizenzgebührenfreies Format, das von Google entwickelt und
        für die Webnutzung standardisiert wurde. Speziell für Screencasts hat es mehrere Vorteile gegenüber MP4:
      </p>
      <ul>
        <li>
          <strong>Kleinere Dateigröße:</strong> Die VP9-Komprimierung ist für Bildschirminhalte mit großen flachen
          Farbflächen, Text und UI-Elementen hocheffizient — genau das, was Screencasts enthalten. Ein 5-minütiger
          Screencast in WebM ist typischerweise 30–50 % kleiner als dieselbe Aufnahme in H.264-MP4.
        </li>
        <li>
          <strong>Offener Standard:</strong> Keine Lizenzgebühren, keine Tantiemenzahlungen, keine Patentbelastungen.
          WebM ist das native Videoformat für das Web.
        </li>
        <li>
          <strong>Direkte Browser-Wiedergabe:</strong> WebM wird in Chrome, Firefox und Edge nativ ohne jegliches
          Plugin abgespielt. Sie können eine WebM-Datei teilen, und jeder mit einem dieser Browser kann sie direkt
          ansehen.
        </li>
      </ul>
      <p>
        <strong>WebM in MP4 konvertieren:</strong> Wenn Sie die Aufnahme mit jemandem teilen müssen, der QuickTime unter
        macOS oder Windows Media Player verwendet — oder sie auf eine Plattform hochladen müssen, die WebM nicht
        akzeptiert —, können Sie sie kostenlos mit einem lokalen Tool wie{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer">HandBrake</a> (quelloffen, lokale
        Verarbeitung) oder über die FFmpeg-Kommandozeile konvertieren. Die Konvertierung dauert ein paar Sekunden, und
        das resultierende MP4 ist universell kompatibel.
      </p>

      <div style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6", margin: "16px 0"}}>
        <pre style={{margin: 0}}><code>{`# FFmpeg one-liner to convert WebM to MP4 (free, local, no upload needed):
ffmpeg -i recording.webm -c:v libx264 -c:a aac output.mp4`}</code></pre>
      </div>

      <h2>Anwendungsfälle: Wann ein Browser-Rekorder genau das ist, was Sie brauchen</h2>

      <h3>Fehlerberichte</h3>
      <p>
        Einen Fehler in Worten zu beschreiben, ist eines der frustrierendsten Erlebnisse in der Softwareentwicklung.
        „Es funktioniert nicht, wenn ich auf die Schaltfläche klicke" ist fast nutzlos. Eine 30-sekündige
        Bildschirmaufnahme der genauen Schritte zur Reproduktion — die zeigt, worauf Sie geklickt haben, was passiert
        ist, was hätte passieren sollen — gibt einem Entwickler alles, was er braucht, um das Problem sofort zu
        diagnostizieren. Nehmen Sie den Fehler auf, während er auftritt, laden Sie das WebM herunter und hängen Sie es
        an das Ticket an. Kein Upload zu einem Drittanbieterdienst, keine Größenbeschränkungen bei Jira oder Linear und
        keine Datenschutzbedenken darüber, was während der Aufnahme auf Ihrem Bildschirm sichtbar war.
      </p>

      <h3>Tutorial-Erstellung ohne schwergewichtige Software</h3>
      <p>
        Nicht jedes Tutorial braucht eine professionelle Produktion. Wenn Sie einen Prozess für Ihr Team dokumentieren —
        wie man ein Tool konfiguriert, wie man durch einen komplexen Arbeitsablauf navigiert, wie man eine Umgebung
        einrichtet —, erfasst eine Bildschirmaufnahme mit Erzählung dies in Minuten. Mit dem BrowseryTools-Rekorder
        können Sie Mikrofon-Audio einbeziehen (erteilen Sie dem Browser die Berechtigung, wenn Sie dazu aufgefordert
        werden), sodass Sie kommentieren können, während Sie arbeiten. Das Ergebnis ist ein vollständiges,
        eigenständiges Tutorial, das in einer einzigen herunterladbaren Datei lebt.
      </p>

      <h3>Code-Reviews</h3>
      <p>
        Textkommentare zu einem Pull-Request reichen für nuanciertes Feedback oft nicht aus. Eine Bildschirmaufnahme, in
        der Sie ein Diff verbal durchgehen — „hier in Zeile 42 mache ich mir Sorgen darüber, weil ..." — ist dramatisch
        effizienter als das Schreiben eines fünf Absätze langen Kommentars. Nehmen Sie einen 3-minütigen Durchlauf des
        PR auf, laden Sie ihn herunter und posten Sie ihn als Anhang oder teilen Sie die Datei. Ihr Prüfer erhält den
        vollen Kontext Ihrer Überlegungen ohne ein Meeting.
      </p>

      <h3>Remote-Demos und asynchrone Kommunikation</h3>
      <p>
        Anstatt ein Meeting anzusetzen, um eine Funktion vorzuführen, nehmen Sie sie auf. Eine 2-minütige Aufnahme, die
        die funktionierende Funktion zeigt, ist oft überzeugender und effizienter als eine Live-Demo, weil sie jederzeit
        angesehen, nach Bedarf erneut abgespielt und mit jedem in der Organisation geteilt werden kann. Nehmen Sie Ihre
        Demo im Voraus auf, prüfen Sie sie und senden Sie sie, wenn sie fertig ist. Keine Terminplanung, keine
        Zeitzonenkonflikte, keine „Kannst du deinen Bildschirm teilen"-Reibung.
      </p>

      <h3>Support-Tickets</h3>
      <p>
        Für Support-Teams oder interne Helpdesks reduziert eine Bildschirmaufnahme, die mit einem Support-Ticket
        eingereicht wird, das Hin und Her dramatisch. Anstatt dem Nutzer zehn klärende Fragen darüber zu stellen, was er
        tat, als das Problem auftrat, nimmt er genau auf, was passiert ist. Der Support-Mitarbeiter sieht das Problem aus
        erster Hand, löst es oft sofort, und der Nutzer erhält eine schnellere Antwort.
      </p>

      <h2>Audio: Mikrofon in Ihre Aufnahme einbeziehen</h2>
      <p>
        Wenn Sie die Aufnahme starten, fragt der Browser, ob Audio einbezogen werden soll. Wenn Sie Ihre Aufnahme
        kommentieren möchten, erlauben Sie den Mikrofonzugriff, wenn Sie dazu aufgefordert werden. Ihre Stimme wird
        zusammen mit der Bildschirmaufnahme in derselben WebM-Datei aufgenommen — keine separate Audiospur zu
        synchronisieren, keine zusätzliche Software nötig.
      </p>
      <p>
        Wenn Sie System-Audio aufnehmen möchten (die Klänge, die von Ihrem Computer kommen — Musik,
        Benachrichtigungstöne, Anwendungs-Audio), wird dies in den Browsern unterschiedlich gehandhabt. Chrome unter
        Windows erlaubt die Aufnahme von System-Audio, wenn ein Browser-Tab aufgenommen wird. Unter macOS erfordert die
        Aufnahme von System-Audio ein virtuelles Audiogerät wie BlackHole oder Loopback, da das Betriebssystem keine
        API zur System-Audio-Aufnahme bereitstellt. Für die meisten Screencast-Anwendungsfälle — bei denen die
        Erzählung das primäre Audio ist — reicht die Mikrofonaufnahme aus und funktioniert plattformübergreifend
        konsistent.
      </p>

      <h2>Datenschutz: Die Aufnahme verlässt niemals Ihren Browser</h2>
      <p>
        Das ist kein nebensächliches Detail. Die Aufnahme wird im Arbeitsspeicher als <code>Blob</code>-Objekt
        innerhalb Ihres Browser-Tabs gespeichert. Wenn Sie auf „Download" klicken, schreibt der Browser dieses Blob in
        Ihr lokales Dateisystem. Nichts wird an einen Server hochgeladen — nicht an BrowseryTools-Server, nicht an
        irgendeinen Cloud-Dienst. Die Aufnahme durchläuft zu keinem Zeitpunkt das Netzwerk.
      </p>
      <p>
        Das ist am wichtigsten, wenn Sie sensible Inhalte aufnehmen: interne Unternehmensabläufe, Kundendaten,
        unveröffentlichte Produktfunktionen oder alles, was Ihren Rechner nicht verlassen sollte. Bei cloudbasierten
        Bildschirmrekordern müssen Sie darauf vertrauen, dass die Upload-, Speicher- und Zugriffskontrollinfrastruktur
        des Anbieters sicher ist. Bei einem browserbasierten lokalen Rekorder gibt es keinen Upload, um den man sich
        sorgen muss.
      </p>

      <h2>Einschränkungen: Was der Browser-Rekorder nicht kann</h2>
      <p>
        Der browserbasierte Ansatz ist ideal für die oben beschriebenen Anwendungsfälle, aber er hat echte
        Einschränkungen, die Sie kennen sollten, bevor Sie in Kontexten danach greifen, in denen er zu kurz greift:
      </p>
      <ul>
        <li>
          <strong>Kein integrierter Videoeditor:</strong> Der Rekorder nimmt das Rohvideo auf und lädt es herunter.
          Wenn Sie Anfang und Ende kürzen, Abschnitte herausschneiden, Hervorhebungen hinzufügen, hineinzoomen oder Text
          überlagern müssen, benötigen Sie einen separaten Videoeditor. Für schnelle Bearbeitungen bewältigen sowohl{" "}
          <a href="https://www.veed.io" target="_blank" rel="noopener noreferrer">VEED.io</a> als auch die kostenlose
          Version von DaVinci Resolve grundlegendes Zuschneiden gut.
        </li>
        <li>
          <strong>Keine Webcam-Überlagerung:</strong> Es gibt keinen Bild-in-Bild-Webcam-Feed. Wenn Sie eine
          „Talking-Head"-Überlagerung in der Ecke der Aufnahme benötigen, brauchen Sie Desktop-Software wie OBS oder
          Camtasia.
        </li>
        <li>
          <strong>Speicherbeschränkungen bei sehr langen Aufnahmen:</strong> Da die Aufnahme bis zum Download im
          Browser-Arbeitsspeicher gehalten wird, können sehr lange Aufnahmen (45+ Minuten) erheblichen RAM verbrauchen.
          Für Langform-Aufnahmen ist Desktop-Software, die während der Aufnahme direkt auf die Festplatte schreibt,
          angemessener.
        </li>
        <li>
          <strong>Kein automatisches Cloud-Teilen:</strong> Der Download ist eine lokale Datei. Wenn Ihr Arbeitsablauf
          sofortiges Cloud-Hosting und einen teilbaren Link erfordert, müssen Sie die Datei anschließend manuell
          hochladen oder einen Dienst wie Loom verwenden, der das Hosting automatisch übernimmt.
        </li>
      </ul>

      <h2>Wann Sie stattdessen Desktop-Software verwenden sollten</h2>
      <p>
        Der Browser-Rekorder ist das richtige Werkzeug für kurze bis mittlere Aufnahmen, bei denen Einfachheit und
        Datenschutz zählen. Aber Desktop-Software ist wirklich besser, wenn:
      </p>
      <ul>
        <li>Sie länger als 30 Minuten am Stück aufnehmen müssen</li>
        <li>Sie eine Webcam-Überlagerung oder eine Komposition aus mehreren Quellen benötigen</li>
        <li>Sie bearbeiten, Untertitel hinzufügen, Zoom-Effekte oder Anmerkungen einfügen müssen</li>
        <li>Sie Spielaufnahmen oder Inhalte mit hoher Bildrate aufnehmen müssen</li>
        <li>Sie unmittelbar nach der Aufnahme einen automatischen Cloud-Upload und teilbare Links benötigen</li>
      </ul>
      <p>
        Für diese Fälle ist OBS Studio (kostenlos, quelloffen) die leistungsfähigste Option. Zum Bearbeiten bietet
        DaVinci Resolve eine großzügige kostenlose Stufe. Beide erfordern eine Installation, bieten aber Fähigkeiten,
        die weit über das hinausgehen, was ein browserbasiertes Tool erreichen kann.
      </p>

      <h2>Vergleich: BrowseryTools vs. gängige Optionen zur Bildschirmaufnahme</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(239,68,68,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Merkmal</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Loom (kostenlos)</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>OBS Studio</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(239,68,68,0.25)", fontWeight: "700"}}>Camtasia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Kosten", "Kostenlos", "Kostenlos / 12,50 $/Mon.", "Kostenlos", "~300 $ einmalig"],
              ["Installation erforderlich", "Nein", "Erweiterung erforderlich", "Ja", "Ja"],
              ["Konto erforderlich", "Nein", "Ja", "Nein", "Ja"],
              ["Video in Cloud hochgeladen", "Niemals", "Immer", "Nein", "Nein"],
              ["Begrenzung der Aufnahmelänge", "Keine*", "5 Min. (kostenlos)", "Keine", "Keine"],
              ["Integrierter Videoeditor", "Nein", "Einfaches Zuschneiden", "Nein", "Ja (fortgeschritten)"],
              ["Webcam-Überlagerung", "Nein", "Ja", "Ja", "Ja"],
              ["Nur-Tab-Aufnahme", "Ja", "Ja", "Nein", "Nein"],
              ["Ausgabeformat", "WebM", "MP4 (Cloud)", "MP4/MKV", "MP4"],
            ].map(([feature, bt, loom, obs, cam], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{feature}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{loom}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{obs}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{cam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize: "13px", opacity: 0.7}}>
        * Sehr lange Aufnahmen (&gt;45 Min.) können durch den verfügbaren Browser-Arbeitsspeicher begrenzt sein.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Datenschutzhinweis:</strong> Wenn Sie Loom verwenden, wird jede Aufnahme auf Looms Server hochgeladen
        und dort standardmäßig gespeichert. Ihr Bildschirminhalt — der interne Tools, sensible Kundendaten oder
        unveröffentlichte Funktionen enthalten kann — liegt auf einem Drittanbieterserver. BrowseryTools-Aufnahmen
        werden niemals hochgeladen. Die Datei wandert von Ihrem Browser direkt auf Ihre Festplatte.
      </div>

      <h2>Beginnen Sie jetzt mit der Aufnahme</h2>
      <p>
        Für die überwiegende Mehrheit der Bildschirmaufnahmeaufgaben — ein schneller Fehlerbericht, ein Team-Tutorial,
        eine Funktionsdemo, ein Code-Review-Durchlauf — ist der Browser alles, was Sie brauchen. Keine Installation,
        kein Abonnement, keine Datenschutzkompromisse.
      </p>
      <p>
        Öffnen Sie den <Link href="/tools/screen-recorder">BrowseryTools Bildschirmrekorder</Link>, klicken Sie auf
        Start, nehmen Sie auf, was Sie brauchen, und laden Sie es herunter. Der gesamte Vorgang vom Öffnen des Tools bis
        zur fertigen WebM-Datei auf Ihrem Desktop dauert unter zwei Minuten.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎬</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Nehmen Sie jetzt Ihren Bildschirm auf — kostenlos, keine Installation</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Nehmen Sie Ihren Bildschirm, ein Fenster oder einen Browser-Tab auf. Laden Sie es als WebM herunter. Nichts
          wird irgendwohin hochgeladen. Kein Konto, keine Erweiterung, keine Kosten.
        </p>
        <Link
          href="/tools/screen-recorder"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(239,68,68)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Bildschirmrekorder öffnen →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Verwandte Tools:{" "}
        <Link href="/tools/image-compression">Bildkomprimierung</Link> ·{" "}
        <Link href="/tools/bg-removal">Hintergrundentfernung</Link> ·{" "}
        <Link href="/tools/image-converter">Bildkonverter</Link> ·{" "}
        <Link href="/">Alle BrowseryTools</Link>
      </p>
    </div>
  );
}
