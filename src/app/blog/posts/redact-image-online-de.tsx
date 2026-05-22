export default function Content() {
  return (
    <div>
      <p>
        Bevor Sie einen Screenshot veröffentlichen, ein Dokumentfoto teilen oder ein Bild in einem
        öffentlichen Forum hochladen, ist fast immer etwas im Bild, das nicht öffentlich sein
        sollte: ein Gesicht, ein Kennzeichen, eine Hausadresse, eine Kontonummer, eine E-Mail-Adresse,
        ein Name auf einem Ausweis. Zuschneiden hilft, aber das Sensible befindet sich oft mitten im
        Bild. Was Sie tatsächlich brauchen, ist das Bild zu{" "}
        <strong>schwärzen oder zensieren</strong> — weichzeichnen, verpixeln oder schwärzen — ohne
        das Original einer Website zu übergeben.
      </p>
      <p>
        Das <a href="/tools/photo-censor">BrowseryTools Photo Censor</a>-Tool erledigt genau das,
        vollständig in Ihrem Browser. Sie malen über die Bereiche, die Sie verbergen möchten, wählen
        Weichzeichnen, Verpixeln oder solide Blockierung und exportieren eine saubere Kopie. Nichts
        wird hochgeladen. Dieser Leitfaden erklärt, wie man ein Bild korrekt schwärzt — und den einen
        Fehler, der die Daten, die Sie glaubten versteckt zu haben, still preisgibt.
      </p>

      <h2>So schwärzen oder weichzeichnen Sie ein Bild (Schritt für Schritt)</h2>
      <p>
        <strong>1. Tool öffnen.</strong> Rufen Sie die{" "}
        <a href="/tools/photo-censor">Photo Censor</a>-Seite auf und fügen Sie Ihr Bild hinzu, indem
        Sie es hineinziehen oder zum Durchsuchen klicken. Die Datei wird lokal gelesen.
        <br />
        <strong>2. Zensur-Stil wählen.</strong> Weichzeichnen verwischt einen Bereich, Verpixeln
        macht ihn zu groben Quadraten, und solide Blockierung übermalt ihn vollständig.
        <br />
        <strong>3. Über sensible Bereiche malen.</strong> Streichen Sie über jedes Gesicht,
        Kennzeichen, jeden Namen oder jede Zahl, die Sie verbergen möchten. Sie können mehrere
        Bereiche in einem Durchgang abdecken.
        <br />
        <strong>4. Stärke anpassen.</strong> Für echte Schwärzung: stark auftragen — ein leichtes
        Weichzeichnen kann rückgängig gemacht werden. Starkes Verpixeln oder solide Blockierung ist
        am sichersten.
        <br />
        <strong>5. Exportieren.</strong> Laden Sie das zensierte Bild herunter. Das Original auf
        Ihrer Festplatte wird nie verändert.
      </p>

      <h2>Weichzeichnen vs. Verpixeln vs. Solide Blockierung — Was verwenden?</h2>
      <p>
        <strong>Solide Blockierung</strong> ist die einzige wirklich irreversible Option. Die
        darunter liegenden Pixel werden durch eine einheitliche Farbe ersetzt, sodass nichts
        wiederhergestellt werden kann. Verwenden Sie sie für alles, das wirklich nie lesbar sein
        darf: Ausweise, Finanzdaten, Passwörter, medizinische Informationen.
      </p>
      <p>
        <strong>Starkes Verpixeln</strong> ist das richtige Gleichgewicht für die meisten Situationen
        — es verbirgt den Inhalt und zeigt dennoch, dass da etwas war (ein Gesicht, ein Bildschirm,
        ein Schild). Halten Sie die Blockgröße groß; eine feine Verpixelung von Text kann manchmal
        teilweise rekonstruiert werden.
      </p>
      <p>
        <strong>Weichzeichnen</strong> sieht am saubersten aus und ist in Ordnung, um ein
        Hintergrundgesicht oder ein Logo zu verblassen, aber ein <em>leichtes</em> Weichzeichnen ist
        die schwächste Form der Zensur. Gesichter und kurze Texte unter einem leichten
        Gaußschen Weichzeichnen wurden in dokumentierten Fällen rekonstruiert. Wenn die Daten
        wichtig sind, verlassen Sie sich nicht auf ein sanftes Weichzeichnen — wählen Sie stark oder
        verwenden Sie solide Blockierung.
      </p>

      <h2>Der Fehler, der geschwärzte Daten preisgibt</h2>
      <p>
        Das häufigste Schwärzungsversagen hat nichts mit der Stärke Ihres Weichzeichners zu tun.
        Es sind <strong>Metadaten</strong>. Ein Foto kann EXIF-Daten enthalten — GPS-Koordinaten,
        das Gerät, das es aufgenommen hat, den ursprünglichen Zeitstempel — eingebettet in die Datei
        selbst. Sie können die Adresse im Bild schwärzen und trotzdem den genauen GPS-Standort in
        den Metadaten mitschicken. Erwägen Sie nach dem Schwärzen, diese Daten zu entfernen; unser
        <a href="/tools/image-converter"> Bildkonverter</a> und der{" "}
        <a href="/blog/exif-data-guide">EXIF-Metadaten-Leitfaden</a> erklären, was in Ihren Fotos
        verborgen ist und wie Sie es entfernen können.
      </p>
      <p>
        Der zweite klassische Fehler ist das Schwärzen auf eine Art, die rückgängig gemacht werden
        kann: Zeichnen eines schwarzen Rechtecks als separater Ebene in einer PDF oder einem
        Vektoreditor, wo der Text darunter noch existiert und ausgewählt oder verschoben werden kann.
        Da das Photo Censor-Tool ein geflachtes Rasterbild exportiert, sind die zensierten Pixel
        wirklich weg — es gibt keine versteckte Ebene, die abgeblättert werden könnte.
      </p>

      <h2>Warum im Browser schwärzen statt auf einer Website?</h2>
      <p>
        Es ist eine auffällige Ironie: Menschen schwärzen ein Bild genau deshalb, weil es etwas
        Sensibles enthält, laden dann dieses ungeschwärzte Original auf die Server eines Online-
        Editors hoch, um die Schwärzung vorzunehmen. Der gesamte Zweck ist Datenschutz, und der
        Workflow widerspricht ihm.
      </p>
      <p>
        Browser-basiertes Schwärzen hält das Original die ganze Zeit auf Ihrem Gerät. Das Bild wird
        in die Seite eingelesen, mit Ihrem eigenen Browser bearbeitet und lokal exportiert. Die
        ungeschwärzte Version reist nie durch das Internet, landet nie in einem Protokoll und liegt
        nie im Speicher von jemand anderem. Für eine ausführlichere Erklärung, warum dieses Modell
        wichtig ist, lesen Sie{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          warum browser-basierte Tools Ihre Daten privat halten
        </a>
        .
      </p>

      <h2>Häufig gestellte Fragen</h2>
      <p>
        <strong>Ist das Weichzeichnen eines Gesichts wirklich sicher?</strong> Nur wenn der
        Weichzeichner stark ist. Ein leichtes Weichzeichnen kann manchmal rückgängig gemacht werden.
        Für echte Anonymität verwenden Sie starkes Verpixeln oder solide Blockierung.
      </p>
      <p>
        <strong>Kann ein geschwärztes Bild un-geschwärzt werden?</strong> Nicht wenn Sie solide
        Blockierung oder starkes Verpixeln verwendet und ein geflachtes Bild exportiert haben — die
        darunter liegenden Pixel werden ersetzt. Das Risiko besteht nur bei schwachem Weichzeichnen
        oder bei Editoren, die das Original auf einer versteckten Ebene behalten.
      </p>
      <p>
        <strong>Lädt das Tool mein Foto hoch?</strong> Nein. Alles geschieht in Ihrem Browser. Das
        Bild wird nie an einen Server gesendet.
      </p>
      <p>
        <strong>Was ist mit Standortdaten im Foto?</strong> Das Schwärzen des sichtbaren Bildes
        entfernt keine EXIF-GPS-Daten. Streifen Sie Metadaten separat vor dem Teilen.
      </p>
      <p>
        <strong>Ist es kostenlos?</strong> Ja — kein Konto, kein Wasserzeichen, keine Limits.
      </p>

      <h2>Jetzt ausprobieren</h2>
      <p>
        Öffnen Sie das <a href="/tools/photo-censor">Photo Censor-Tool</a>, malen Sie über alles
        Sensible und exportieren Sie eine saubere Kopie, die Ihr Gerät nie verlassen hat. Um den Job
        abzuschließen, entfernen Sie Standort-Metadaten mit dem{" "}
        <a href="/tools/image-converter">Bildkonverter</a>, und wenn Sie das Ergebnis außerdem
        zuschneiden oder mit einem Wasserzeichen versehen müssen, lesen Sie unseren Leitfaden zum{" "}
        <a href="/blog/crop-and-watermark-images-online">Zuschneiden und Wasserzeichnen von Bildern online</a>.
      </p>
    </div>
  );
}
