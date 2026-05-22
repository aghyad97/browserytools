export default function Content() {
  return (
    <div>
      <p>
        Jedes Mal, wenn Sie auf einer Website die Augen zusammenkneifen müssen, weil der Text zu
        hell ist, oder sich abmühen, ein Schaltflächen-Label zu lesen, das im Hintergrund verschwimmt,
        erleben Sie ein Kontrastversagen. Für die meisten Menschen ist das ein kleines Ärgernis.
        Für einen erheblichen Teil der Bevölkerung – Menschen mit Farbsehschwächen, Sehbehinderungen,
        nachlassender Sehkraft im Alter oder alle, die ein Gerät in hellem Sonnenlicht verwenden –
        macht es Inhalte tatsächlich unzugänglich. Farbkontrast ist einer der wirkungsvollsten und
        am häufigsten verletzten Aspekte der Web-Zugänglichkeit, und er gehört auch zu den einfachsten
        zu behebenden, sobald man die Regeln versteht. Dieser Leitfaden erklärt den Standard, die
        Mathematik, die häufigen Fehler und wie man den{" "}
        <a href="/tools/contrast-checker">BrowseryTools Farbkontrast-Prüfer</a> verwendet, um jedes
        Farbpaar sofort im Browser zu überprüfen.
      </p>

      <h2>Warum Kontrast wichtig ist</h2>
      <p>
        Die betroffene Bevölkerungsgruppe ist größer, als die meisten Designer annehmen. Laut der
        Weltgesundheitsorganisation haben weltweit rund 2,2 Milliarden Menschen irgendeine Form
        von Seh- oder Sehkraftbeeinträchtigung. Farbsehschwäche – umgangssprachlich Farbenblindheit
        genannt – betrifft etwa 8 % der Männer und 0,5 % der Frauen nordeuropäischer Abstammung,
        was bedeutet, dass rund 300 Millionen Menschen weltweit Schwierigkeiten haben, bestimmte
        Farben zu unterscheiden.
      </p>
      <p>
        Über dauerhafte Beeinträchtigungen hinaus betrifft Kontrast jeden Menschen situationsbedingt:
      </p>
      <ul>
        <li>Das Lesen eines Smartphones in hellem Sonnenlicht lässt kontrastarmen Text vollständig verschwinden.</li>
        <li>Ältere oder günstigere Monitore haben reduzierte Helligkeit und schlechtere Farbgenauigkeit.</li>
        <li>Migräne-Betroffene und Menschen mit Lichtempfindlichkeit verwenden oft Displays mit reduzierter Helligkeit.</li>
        <li>Blendung durch Fenster oder Deckenlampen verringert den wahrgenommenen Kontrast erheblich.</li>
        <li>Gestresste Nutzer – also eigentlich alle – verarbeiten hochkontrastigen Inhalt schneller.</li>
      </ul>
      <p>
        Guter Kontrast ist keine Nischenlösung. Er verbessert die Erfahrung für jeden Nutzer, auf
        jedem Gerät und unter jeder Beleuchtungsbedingung.
      </p>

      <h2>Was ist ein Kontrastverhältnis?</h2>
      <p>
        Das Kontrastverhältnis ist eine standardisierte Kennzahl, die ausdrückt, wie unterschiedlich
        zwei Farben hinsichtlich ihrer relativen Helligkeit (Leuchtdichte) sind. Es wird stets als
        Verhältnis ausgedrückt: die hellere Farbe dividiert durch die dunklere, wobei jeder Wert
        um 0,05 erhöht wird, um die Division durch null zu vermeiden und das Umgebungslicht realer
        Displays zu berücksichtigen.
      </p>
      <p>
        Der Bereich reicht von <strong>1:1</strong> (zwei identische Farben – kein Kontrast, völlig
        unlesbar) bis <strong>21:1</strong> (reines Schwarz auf reinem Weiß – der maximal mögliche
        Kontrast). Je höher das Verhältnis, desto besser sind die beiden Farben zu unterscheiden.
      </p>

      <h2>Wie das Kontrastverhältnis berechnet wird</h2>
      <p>
        Die von WCAG (und dem gesamten Web-Standards-Ökosystem) verwendete Formel beruht auf dem
        Konzept der relativen Leuchtdichte – einem Maß dafür, wie viel Licht eine Farbe scheinbar
        aussendet, angepasst an die menschliche Wahrnehmung. Die Berechnung erfolgt in zwei Schritten.
      </p>
      <p>
        <strong>Schritt 1: Relative Leuchtdichte (L) für jede Farbe berechnen.</strong>
      </p>
      <p>
        Zunächst wird jeder RGB-Kanal vom Bereich 0–255 auf eine lineare Skala von 0–1 umgerechnet,
        anschließend wird eine Gamma-Expansionsformel angewendet, die berücksichtigt, wie Displays
        die Helligkeit kodieren:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// Für jeden Kanalwert c in [0, 1]:
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        Die Koeffizienten 0,2126, 0,7152 und 0,0722 spiegeln die menschliche Farbempfindlichkeit
        wider: Unsere Augen reagieren am stärksten auf Grün, mäßig auf Rot und am schwächsten auf Blau.
      </p>
      <p>
        <strong>Schritt 2: Das Kontrastverhältnis berechnen.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Kontrastverhältnis = (L_heller + 0.05) / (L_dunkler + 0.05)`}
      </pre>
      <p>
        Dabei ist <code>L_heller</code> die relative Leuchtdichte der helleren Farbe und{" "}
        <code>L_dunkler</code> die relative Leuchtdichte der dunkleren Farbe.
      </p>

      <h3>Berechnungsbeispiele</h3>
      <ul>
        <li>
          <strong>Schwarz (#000000) auf Weiß (#FFFFFF):</strong> L(Weiß) = 1,0, L(Schwarz) = 0,0.
          Verhältnis = (1,0 + 0,05) / (0,0 + 0,05) = 1,05 / 0,05 = <strong>21:1</strong>. Maximal möglicher Kontrast.
        </li>
        <li>
          <strong>Grau #767676 auf Weiß (#FFFFFF):</strong> L(#767676) ≈ 0,216.
          Verhältnis = (1,0 + 0,05) / (0,216 + 0,05) ≈ 1,05 / 0,266 ≈ <strong>4,54:1</strong>.
          Dies besteht WCAG AA für normalen Text gerade noch.
        </li>
        <li>
          <strong>Grau #999999 auf Weiß (#FFFFFF):</strong> L(#999999) ≈ 0,319.
          Verhältnis = (1,0 + 0,05) / (0,319 + 0,05) ≈ 1,05 / 0,369 ≈ <strong>2,85:1</strong>.
          Dies besteht WCAG AA für keinen Textgröße.
        </li>
      </ul>

      <h2>WCAG: Der Standard, der Anforderungen an die Barrierefreiheit definiert</h2>
      <p>
        Die Web Content Accessibility Guidelines (WCAG) werden vom World Wide Web Consortium (W3C)
        veröffentlicht und definieren den international anerkannten Standard für Web-Zugänglichkeit.
        Die aktuelle, weitverbreitete Version ist WCAG 2.1 aus dem Jahr 2018. WCAG 3.0 befindet
        sich in der Entwicklung und wird sie schließlich durch ein differenzierteres Messsystem
        ersetzen, doch WCAG 2.1 ist nach wie vor der maßgebliche Standard für Compliance-Zwecke.
      </p>
      <p>
        WCAG gliedert Anforderungen in drei Konformitätsstufen: A (Minimum), AA (Standard) und
        AAA (erhöht). Stufe AA ist das, was die meisten rechtlichen Rahmenbedingungen verlangen.
        Stufe AAA ist ein angestrebtes Ziel und wird nicht für ganze Websites vorgeschrieben,
        sondern nur für bestimmte Kontexte.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          WCAG 2.1 Kontrastanforderungen auf einen Blick
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Stufe AA – Normaler Text:</strong> Mindestkontrastverhältnis von <strong>4,5:1</strong>
          </li>
          <li>
            <strong>Stufe AA – Großer Text:</strong> Mindestkontrastverhältnis von <strong>3:1</strong>
            (großer Text = 18 pt / 24 px reguläre Schriftstärke oder 14 pt / ca. 18,67 px fett)
          </li>
          <li>
            <strong>Stufe AA – UI-Komponenten und grafische Objekte:</strong> Mindestkontrastverhältnis von <strong>3:1</strong>
            (gilt für Schaltflächenränder, Eingabefeldumrisse, bedeutungstragende Symbole)
          </li>
          <li>
            <strong>Stufe AAA – Normaler Text:</strong> Mindestkontrastverhältnis von <strong>7:1</strong>
          </li>
          <li>
            <strong>Stufe AAA – Großer Text:</strong> Mindestkontrastverhältnis von <strong>4,5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        Es ist wichtig zu beachten, worauf die Kontrastanforderungen <em>nicht</em> zutreffen:
        Dekorative Bilder ohne informativen Inhalt, Logos und Marken-Wortmarken sowie Text, der
        Teil einer inaktiven UI-Komponente ist (zum Beispiel ein deaktivierter Button), sind von
        den Kontrastanforderungen unter WCAG 2.1 ausgenommen. Die Absicht ist der Schutz
        informativer Inhalte, nicht rein dekorativer Elemente.
      </p>

      <h2>Farbpaare: Bestanden- und Nicht-bestanden-Beispiele</h2>
      <p>
        Das Kontrastverhältnis eines Farbpaares hängt ausschließlich von der relativen Leuchtdichte
        der beiden Farben ab – nicht davon, welche Farbe „schöner" ist oder welche ähnlich wirken.
        Hier sind repräsentative Beispiele aus dem gesamten Bestanden/Nicht-bestanden-Spektrum:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Textfarbe</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hintergrundfarbe</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kontrastverhältnis</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (Schwarz)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (Dunkelblau)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><strong>18,1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (Dunkelgrau)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><strong>7,0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (Mittelgrau)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><strong>4,54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (Indigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5,9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (Hellgrau)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><strong>2,85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (Weiß)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (Gelb)</td>
              <td style={{padding: "12px 16px"}}><strong>1,29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (Blauer Link)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (Lila)</td>
              <td style={{padding: "12px 16px"}}><strong>1,7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Nicht bestanden</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Häufige Kontrastfehler</h2>
      <p>
        Dieselben Fehler tauchen immer wieder in Zugänglichkeitsprüfungen im gesamten Web auf.
        Sie zu kennen, erleichtert es, sie in der eigenen Arbeit zu erkennen.
      </p>

      <h3>Hellgrauer Text auf Weiß</h3>
      <p>
        Dies ist das häufigste einzelne Kontrastversagen im modernen Web. Designtrends in Richtung
        Minimalismus haben eine Generation von Oberflächen hervorgebracht, in denen Fließtext,
        Bildunterschriften, Metadaten und Platzhaltertext in Tönen wie <code>#aaaaaa</code>,{" "}
        <code>#bbbbbb</code> oder <code>#cccccc</code> auf weißem Hintergrund dargestellt werden.
        Diese Kombinationen ergeben typischerweise Kontrastverhältnisse zwischen 1,5:1 und 2,5:1 –
        weit unter dem Minimum von 4,5:1. Der Designer kann es auf einem kalibrierten Studio-Monitor
        in einem abgedunkelten Raum lesen; der Endnutzer auf einem Smartphone im Nachmittagssonnenlicht
        hingegen nicht.
      </p>

      <h3>Weißer Text auf farbigen Schaltflächen</h3>
      <p>
        Weißer Text auf Gelb (<code>#ffdd00</code>), Limonengrün (<code>#84cc16</code>) oder
        hellem Orange (<code>#fb923c</code>) besteht WCAG AA bei keiner Textgröße. Diese
        Farbkombinationen sind visuell auffällig, aber der Kontrast ist zu gering. Dunkler Text
        (Schwarz oder sehr dunkles Grau) auf diesen hellen Hintergründen ist die barrierefreie
        Lösung – er erreicht in der Regel Verhältnisse über 10:1.
      </p>

      <h3>Platzhaltertext in Formularfeldern</h3>
      <p>
        Browser-Standard-Platzhaltertext – der Hinweistext in leeren Eingabefeldern vor der
        Eingabe – wird typischerweise mit rund 40 % Deckkraft der Textfarbe oder als Mittelgrau
        wie <code>#aaaaaa</code> dargestellt. Dies besteht WCAG AA fast nie. Platzhaltertext
        unterliegt denselben Kontrastanforderungen von 4,5:1 wie normaler Text, da er Informationen
        darüber vermittelt, was einzugeben ist.
      </p>

      <h3>Blaue Links auf farbigen oder dunklen Hintergründen</h3>
      <p>
        Die traditionelle blaue Hyperlink-Farbe (<code>#0000ee</code>) hat auf Weiß einen
        hervorragenden Kontrast (8,6:1), versagt aber auf farbigen Hintergründen. Auf einem
        mittellila Hintergrund erreicht derselbe blaue Link nur etwa 1,7:1. Link-Farben müssen
        nicht nur gegen den Seitenhintergrund geprüft werden, sondern auch gegen farbige
        Abschnitte oder Karten, in denen sie erscheinen.
      </p>

      <h3>Deaktivierte Zustände und Fokusindikatoren</h3>
      <p>
        Obwohl WCAG 2.1 deaktivierte UI-Komponenten von den Kontrastanforderungen ausnimmt, müssen
        Fokusindikatoren – der sichtbare Ring oder Rahmen, der beim Tabben auf ein fokussierbares
        Element erscheint – unter WCAG 2.2 einen Kontrast von 3:1 gegenüber den angrenzenden Farben
        aufweisen. Viele Websites unterdrücken den Browser-Standard-Fokusring mit{" "}
        <code>outline: none</code> und bieten keinen Ersatz, was für Tastatur-Nutzer ein
        Zugänglichkeitsproblem darstellt.
      </p>

      <h2>Techniken zur Wahl barrierefreier Farben</h2>

      <h3>Dunkel auf Hell als Standard</h3>
      <p>
        Die einfachste Standardeinstellung für Text ist nahezu schwarzer Text auf weißem oder sehr
        hellgrauem Hintergrund. Verhältnisse über 10:1 sind leicht erreichbar und geben enorme
        Flexibilität bei Schriftgröße und -stärke. Helle-auf-dunkel-Farbschemata (Dark Mode) sollte
        man sekundären Flächen vorbehalten und den Kontrast in beiden Designs sorgfältig prüfen.
      </p>

      <h3>Alle interaktiven Zustände prüfen</h3>
      <p>
        Der Standard-Zustand einer Schaltfläche besteht möglicherweise AA, während ihr Hover-Zustand –
        der den Hintergrund aufhellt – unter 4,5:1 fällt. Standard-, Hover-, Fokus-, Aktiv- und
        deaktivierten Zustand separat prüfen. Der deaktivierte Zustand ist von der Anforderung
        ausgenommen, alle anderen müssen bestehen.
      </p>

      <h3>Die 60-30-10-Regel barrierefrei anwenden</h3>
      <p>
        Die 60-30-10-Farbregeln (60 % Hauptfarbe, 30 % Sekundärfarbe, 10 % Akzentfarbe) ist
        hilfreich für die visuelle Hierarchie. Sie barrierefrei anzuwenden bedeutet: Text in jeder
        dieser drei Farbzonen einzeln auf den Kontrastschwellenwert prüfen. Die Akzentfarbe bei
        10 % ist oft die problematischste – kräftige Akzentfarben in Kombination mit entweder weißem
        oder dunklem Text können bei bestimmten Farbton- und Sättigungskombinationen versagen.
      </p>

      <h3>Den Farbkontrast-Prüfer nutzen, bevor man sich festlegt</h3>
      <p>
        Der günstigste Zeitpunkt, ein Kontrastproblem zu beheben, ist noch vor dem Programmieren.
        Wenn man in einem Design-Tool Farben auswählt, sollte man die geplanten Text-/Hintergrundpaare
        sofort prüfen. Eine Anpassung der Helligkeit einer Farbe um 10–15 % bringt oft eine nicht
        bestandene Kombination in die Compliance, ohne den visuellen Charakter des Designs wesentlich
        zu verändern.
      </p>

      <h2>Rechtliche Anforderungen</h2>
      <p>
        WCAG-Konformität ist in vielen Jurisdiktionen nicht rein freiwillig. Rechtliche Rahmenbedingungen,
        die auf WCAG AA verweisen, umfassen:
      </p>
      <ul>
        <li>
          <strong>Vereinigte Staaten – Americans with Disabilities Act (ADA):</strong> Das ADA
          verbietet Diskriminierung aufgrund von Behinderungen an öffentlich zugänglichen Stätten.
          Bundesgerichte und das Justizministerium haben dies auf gewerbliche Websites ausgeweitet.
          Tausende von ADA-Klagen werden jährlich bei US-Bundesgerichten eingereicht, wobei
          Farbkontrastverstöße häufig in Abmahnungen zitiert werden.
        </li>
        <li>
          <strong>Europäische Union – EN 301 549:</strong> Die EU-Richtlinie zur Web-Zugänglichkeit
          schreibt WCAG 2.1 Stufe AA für öffentliche Websites und mobile Apps vor. EN 301 549 ist
          der für die Beschaffung verwendete technische Standard. Auch privatwirtschaftliche
          Organisationen in regulierten Branchen sehen sich zunehmenden Anforderungen gegenüber.
        </li>
        <li>
          <strong>Kanada – AODA (Accessibility for Ontarians with Disabilities Act):</strong> Ontario
          schreibt WCAG 2.0 Stufe AA für privatwirtschaftliche Organisationen mit 50 oder mehr
          Mitarbeitenden sowie für alle Organisationen des öffentlichen Sektors vor.
        </li>
        <li>
          <strong>Vereinigtes Königreich – Equality Act 2010:</strong> Dienstleister sind verpflichtet,
          für Menschen mit Behinderungen angemessene Anpassungen vorzunehmen, was die britische
          Regierung auf die Zugänglichkeit von Websites anwendet.
        </li>
      </ul>
      <p>
        Jenseits rechtlicher Risiken fordern viele Unternehmenskunden und Ausschreibungsverfahren
        der öffentlichen Hand inzwischen WCAG-AA-Konformität in Lieferantenverträgen. Barrierefreiheits-
        Compliance ist zunehmend eine kommerzielle Anforderung, nicht nur eine ethische.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Wichtige Anforderung zum Merken
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          WCAG 2.1 Stufe AA erfordert ein <strong>Kontrastverhältnis von 4,5:1 für normalen Text</strong>{" "}
          und <strong>3:1 für großen Text</strong> (18 pt+ oder 14 pt+ fett). UI-Komponentenrahmen und
          bedeutungstragende Symbole erfordern ebenfalls 3:1. Diese Schwellenwerte zu unterschreiten
          bedeutet, den am weitesten verbreiteten Zugänglichkeitsstandard im Web zu verfehlen.
        </p>
      </div>

      <h2>Wer profitiert – über Menschen mit Behinderungen hinaus</h2>
      <p>
        Barrierefreier Kontrast ist gutes Design für alle. UX-Forschung zeigt konsistent, dass
        hochkontrastiger Text von allen Nutzergruppen schneller und mit weniger Fehlern gelesen
        wird. Diejenigen, die nachweislich am meisten profitieren:
      </p>
      <ul>
        <li>Menschen mit Farbsehschwäche (Rot-Grün-Schwäche, Blau-Gelb-Schwäche oder Achromatopsie)</li>
        <li>Ältere Erwachsene, bei denen die Kontrastempfindlichkeit mit dem Alter natürlich abnimmt</li>
        <li>Menschen mit Sehbehinderungen, die keine Bildschirmvergrößerung verwenden</li>
        <li>Nutzer in lichtstarken Umgebungen (im Freien, in der Nähe von Fenstern)</li>
        <li>Nutzer mit minderwertigen, veralteten oder günstigen Displays</li>
        <li>Alle unter kognitiver Belastung – bei Müdigkeit oder Ablenkung reduziert hoher Kontrast Lesefehler</li>
      </ul>

      <h2>So verwendet man den BrowseryTools Farbkontrast-Prüfer</h2>
      <p>
        Der <a href="/tools/contrast-checker">BrowseryTools Farbkontrast-Prüfer</a> macht es
        kinderleicht, jede Farbkombination gegen WCAG-Standards zu prüfen:
      </p>
      <ul>
        <li>
          <strong>Hex-Codes eingeben:</strong> Einen gültigen Hex-Farbcode (3 oder 6 Ziffern, mit
          oder ohne <code>#</code>-Präfix) in die Vordergrund- und Hintergrundfelder eingeben oder
          einfügen.
        </li>
        <li>
          <strong>Das Verhältnis sofort ablesen:</strong> Das Kontrastverhältnis wird in Echtzeit
          berechnet und angezeigt, während man tippt – kein Klicken erforderlich.
        </li>
        <li>
          <strong>AA- und AAA-Badges:</strong> Klare Bestanden/Nicht-bestanden-Badges für Stufe AA
          Normal, Stufe AA Groß, Stufe AAA Normal und Stufe AAA Groß werden angezeigt, damit man
          genau erkennt, welche Schwellenwerte das Farbpaar erfüllt.
        </li>
        <li>
          <strong>Live-Vorschau:</strong> Das Tool zeigt eine Textprobe auf dem gewählten Hintergrund,
          sodass man die Kombination so sehen kann, wie sie für einen Nutzer aussehen würde.
        </li>
        <li>
          <strong>Farbauswahl nutzen:</strong> Wer keinen bestimmten Hex-Wert im Kopf hat, kann
          mit dem integrierten Farbwähler Farben visuell auswählen und sofort sehen, wie sich das
          Verhältnis beim Navigieren durch den Farbraum verändert.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Alles läuft lokal in Ihrem Browser.</strong> Der Farbkontrast-Prüfer führt alle
        Leuchtdichte-Berechnungen mit JavaScript in Ihrem Browser-Tab durch. Keine Farbwerte werden
        an einen Server übertragen. Es gibt keine Konten, keine Verlaufsprotokolle und keine
        Drittanbieter-Analysen, die in die Berechnung einbezogen werden. Tab schließen – alles weg.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Jede Farbkombination sofort gegen WCAG AA und AAA prüfen
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Zwei Hex-Codes eingeben und Kontrastverhältnis, Bestanden/Nicht-bestanden-Status und
          eine Live-Textvorschau anzeigen. Keine Anmeldung erforderlich. Nichts wird hochgeladen.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Farbkontrast-Prüfer öffnen →
        </a>
      </div>
    </div>
  );
}
