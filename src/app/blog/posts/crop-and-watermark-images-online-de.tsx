import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Zwei der häufigsten Dinge, die man mit einem Bild tun muss, haben nichts mit aufwändigem
        Bearbeiten zu tun: es <strong>zuschneiden</strong> auf die richtige Form und Größe und ein{" "}
        <strong>Wasserzeichen</strong> hinzufügen, damit es nicht ohne Quellenangabe weiterverwendet
        werden kann. Durch Zuschneiden passt ein Foto in ein Thumbnail, ein Banner, ein quadratisches
        Avatar oder ein bestimmtes Seitenverhältnis. Ein Wasserzeichen schützt Ihre Arbeit und
        kennzeichnet Ihre Screenshots. Dafür braucht man weder Photoshop noch ein Abonnement —
        und man sollte das Bild definitiv nicht auf den Server einer unbekannten Person hochladen.
      </p>
      <ToolCTA slug="image-resizer" variant="inline" />
      <p>
        Der <a href="/tools/image-resizer">BrowseryTools Bildbearbeitungs-Tool</a> übernimmt
        Zuschneiden, Skalieren und Wasserzeichnen vollständig in Ihrem Browser. Kein Upload, kein
        Konto, kein vom Tool aufgezwungenes Wasserzeichen. Dieser Leitfaden erklärt, wie man auf ein
        genaues Seitenverhältnis zuschneidet, ohne Verzerrung skaliert und ein Wasserzeichen
        hinzufügt, das Weiterverwendung tatsächlich abschreckt.
      </p>

      <h2>So schneiden Sie ein Bild zu und ändern die Größe (Schritt für Schritt)</h2>
      <p>
        <strong>1. Tool öffnen.</strong> Rufen Sie den <a href="/tools/image-resizer">Bildbearbeiter</a>{" "}
        auf und fügen Sie Ihr Bild hinzu. Es wird lokal gelesen — nie hochgeladen.
        <br />
        <strong>2. Seitenverhältnis oder freies Zuschneiden wählen.</strong> Wählen Sie ein Preset
        wie 1:1 (quadratisch), 16:9 (Banner) oder 4:5 (Hochformat) oder ziehen Sie frei. Presets
        halten die Proportionen für das Ziel korrekt.
        <br />
        <strong>3. Auf die genauen benötigten Pixel skalieren.</strong> Breite und Höhe festlegen.
        Das Seitenverhältnis gesperrt lassen, es sei denn, Sie möchten das Bild strecken.
        <br />
        <strong>4. Wasserzeichen hinzufügen (optional).</strong> Überlagern Sie Ihren Namen, Ihr
        Logo oder eine URL, und legen Sie Position und Deckkraft fest.
        <br />
        <strong>5. Exportieren.</strong> Laden Sie das Ergebnis herunter. Das Original auf Ihrer
        Festplatte bleibt unverändert.
      </p>

      <h2>Auf das richtige Seitenverhältnis zuschneiden</h2>
      <p>
        Der Fehler, der mehr Bilder ruiniert als jeder andere, ist das unvorsichtige Ändern des
        Seitenverhältnisses, das das Bild streckt oder staucht. Gesichter werden breit, Kreise
        werden zu Ovalen. Um das zu vermeiden, entscheiden Sie zuerst die <em>Form</em> und
        schneiden darauf zu, statt das vorhandene Bild in eine neue Breite und Höhe zu zwingen.
        Häufige Ziele:
      </p>
      <p>
        <strong>1:1 quadratisch</strong> — Profilfotos, Produkt-Thumbnails, Instagram-Rasterbeiträge.
        <br />
        <strong>16:9 Breitbild</strong> — Video-Thumbnails, Präsentationsfolien, Hero-Banner.
        <br />
        <strong>4:5 Hochformat</strong> — Das höchste Seitenverhältnis, das Instagram im Feed
        erlaubt, optimal zur Maximierung des Bildschirmplatzes auf Mobilgeräten.
        <br />
        <strong>3:2 / 4:3</strong> — Klassische Fotoverhältnisse für Drucke und Galerien.
      </p>
      <p>
        Zuerst auf das Verhältnis zuschneiden, <em>dann</em> auf die Pixelabmessungen herunterskalieren,
        die die Plattform möchte. Diese Reihenfolge hält alles proportional.
      </p>

      <h2>Größe ändern ohne Schärfeverlust</h2>
      <p>
        Ein Bild <em>verkleinern</em> ist sicher und schärft sogar das Ergebnis. Ein Bild{" "}
        <em>vergrößern</em> ist es nicht — man kann keine Details erfinden, die nie aufgenommen
        wurden, sodass ein vergrößertes Bild weich oder blockig aussieht. Beginnen Sie immer mit
        dem hochauflösendsten Original, das Sie haben, und reduzieren Sie von dort. Wenn Sie nur
        eine kleinere Datei brauchen (nicht kleinere Abmessungen), ist das Komprimierung, nicht
        Größenänderung — lesen Sie unseren{" "}
        <a href="/blog/free-image-tools-guide">Leitfaden zu kostenlosen Bildtools</a> für den
        Unterschied.
      </p>

      <h2>Ein Wasserzeichen hinzufügen, das wirklich funktioniert</h2>
      <p>
        Ein gutes Wasserzeichen balanciert Sichtbarkeit gegenüber dem Nicht-Ruinieren des Bildes.
        Ein paar Grundsätze:
      </p>
      <p>
        <strong>Platzieren Sie es so, dass es nicht weggecroppt werden kann.</strong> Ein kleines
        Logo in einer Ecke lässt sich leicht wegschneiden. Eine halbtransparente Markierung über
        der Mitte oder wiederholt über das Bild ist viel schwieriger zu entfernen.
        <br />
        <strong>Moderate Deckkraft verwenden.</strong> Etwa 30&ndash;50 % lässt das Bild
        durchscheinen, während die Markierung lesbar bleibt. Vollständig deckend wirkt schwer;
        kaum sichtbar bietet keinen Schutz.
        <br />
        <strong>Einfach halten.</strong> Ihr Name, Handle oder Ihre Domain reicht aus. Das Ziel ist
        Zuordnung und Abschreckung, keine Dekoration.
      </p>
      <p>
        Denken Sie daran: Kein sichtbares Wasserzeichen ist unknackbar — eine entschlossene Person
        kann es herausklonen. Der Zweck ist, beiläufige Weiterverwendung unbequem zu machen und
        sicherzustellen, dass Ihr Name mitreist, wenn Ihr Bild sich verbreitet.
      </p>

      <h2>Warum im Browser bearbeiten?</h2>
      <p>
        Zuschneiden und Wasserzeichnen geht um Kontrolle über Ihre eigenen Bilder — doch die meisten
        Online-Editoren laden das Original zuerst auf ihre Server hoch. Browser-basierte Bearbeitung
        hält die Datei die ganze Zeit auf Ihrem Gerät: Sie wird in die Seite eingelesen, mit Ihrem
        eigenen Browser bearbeitet und lokal exportiert. Nichts wird hochgeladen, das Tool fügt
        kein eigenes Wasserzeichen hinzu, und es gibt keine Größenbeschränkung hinter einer
        Zahlungsschranke. Es ist dasselbe Local-First-Modell, das jedem BrowseryTools-Tool zugrunde
        liegt, wie erklärt in{" "}
        <a href="/blog/why-browser-tools-keep-your-data-private">
          warum browser-basierte Tools Ihre Daten privat halten
        </a>
        .
      </p>

      <h2>Häufig gestellte Fragen</h2>
      <p>
        <strong>Warum sieht mein Bild nach der Größenänderung gestreckt aus?</strong> Das
        Seitenverhältnis hat sich geändert. Sperren Sie das Verhältnis, oder schneiden Sie vor der
        Größenänderung auf die Zielform zu.
      </p>
      <p>
        <strong>Kann ich ein kleines Bild ohne Qualitätsverlust vergrößern?</strong> Nicht wirklich.
        Hochskalieren kann keine Details hinzufügen, die nie vorhanden waren. Beginnen Sie vom
        größten Original.
      </p>
      <p>
        <strong>Fügt das Tool sein eigenes Wasserzeichen hinzu?</strong> Nein. Nur das Wasserzeichen,
        das Sie hinzufügen, erscheint.
      </p>
      <p>
        <strong>Wird mein Bild hochgeladen?</strong> Nein. Alles wird lokal in Ihrem Browser
        verarbeitet.
      </p>
      <p>
        <strong>Ist es kostenlos?</strong> Ja — kein Konto, keine Limits, kein erzwungenes
        Wasserzeichen.
      </p>

      <h2>Jetzt ausprobieren</h2>
      <p>
        Öffnen Sie den <a href="/tools/image-resizer">Bildbearbeiter</a>, um an einem Ort zuzuschneiden,
        zu skalieren und Wasserzeichen hinzuzufügen — alles ohne Hochladen. Wenn Sie auch sensible
        Details im Foto verbergen müssen, lesen Sie unseren Leitfaden zum{" "}
        <a href="/blog/redact-image-online">Schwärzen von Bildern online</a>, und um die endgültige
        Dateigröße zu verkleinern, lesen Sie unseren{" "}
        <a href="/blog/free-image-tools-guide">Leitfaden zu kostenlosen Bildtools</a>.
      </p>
      <ToolCTA slug="image-resizer" variant="card" />
    </div>
  );
}
