export default function Content() {
  return (
    <div>
      <p>
        Ein Meeting über Zeitzonen hinweg zu planen klingt einfach — bis man es ein paarmal gemacht
        hat. Die Person, die sagte „treffen wir uns um 9 Uhr bei mir", hat ihre Zeitzone nicht
        erwähnt. Jemand verschob ein Meeting „eine Stunde früher" in der Woche vor einer
        Sommerzeit-Umstellung, und es endete für die halbe Gruppe zur falschen Zeit. Ein Entwickler
        speicherte Zeitstempel in Ortszeit, und jetzt ist die Datenbank ein Durcheinander
        mehrdeutiger Einträge.
      </p>
      <p>
        Zeitzonen sind eines jener Systeme, die intuitiv erscheinen — bis sie es nicht mehr sind, und
        die Sonderfälle verursachen echte Probleme. Dieser Leitfaden erklärt, wie das System
        funktioniert, wo es versagt, wie Remote-Teams die häufigsten Planungsfehler vermeiden können
        und die Standards, die das Arbeiten über Zeitzonen hinweg handhabbar machen.
      </p>
      <p>
        Sie können den{" "}
        <a href="/tools/timezone-converter">BrowseryTools Zeitzonenrechner</a> verwenden — kostenlos,
        ohne Anmeldung, alles bleibt in Ihrem Browser.
      </p>

      <h2>Wie Zeitzonen funktionieren: UTC-Offsets erklärt</h2>
      <p>
        Zeitzonen werden als Abweichungen von der Koordinierten Weltzeit (UTC) definiert — dem
        modernen Nachfolger der Greenwich Mean Time (GMT). UTC selbst hat keinen Offset: UTC+0. Jede
        andere Zeitzone ist als UTC plus oder minus eine bestimmte Anzahl von Stunden (und manchmal
        Minuten) definiert.
      </p>
      <p>
        New York ist im Winter UTC-5 (Eastern Standard Time) und im Sommer UTC-4 (Eastern Daylight
        Time). London ist im Winter UTC+0 und im Sommer UTC+1 (British Summer Time). Tokio ist
        ganzjährig UTC+9. Sydney wechselt zwischen UTC+10 und UTC+11, je nachdem ob die Sommerzeit
        gilt — die auf der Südhalbkugel von Oktober bis April läuft, entgegengesetzt zur
        Nordhalbkugel.
      </p>
      <p>
        Erschwerend kommt hinzu: Nicht alle Zeitzonenoffsets sind ganzzahlige Stunden. Indien ist
        UTC+5:30. Nepal ist UTC+5:45. Iran ist UTC+3:30. Australiens Central Standard Time ist
        UTC+9:30. Diese Bruchoffsets existieren aus historischen, politischen oder geographischen
        Gründen und überraschen Menschen, die davon ausgehen, alle Zonen liegen auf der vollen
        Stunde.
      </p>

      <h2>Sommerzeit: Warum sie alles schwieriger macht</h2>
      <p>
        Die Sommerzeit (Daylight Saving Time, DST) ist die Praxis, Uhren im Frühling eine Stunde
        vorzustellen und im Herbst eine Stunde zurückzustellen, um Tageslicht in die Abendstunden
        zu verlagern. Sie wird von etwa 70 Ländern eingehalten, vom Rest ignoriert, und die
        Umstellungen erfolgen nicht am selben Datum weltweit.
      </p>
      <p>
        Die USA und Kanada stellen am zweiten Sonntag im März und am ersten Sonntag im November um.
        Der Großteil Europas stellt am letzten Sonntag im März und am letzten Sonntag im Oktober um.
        Dadurch entsteht ein dreiwöchiges Fenster im März und ein einwöchiges Fenster im November,
        in dem der Offset zwischen New York und London anders ist als den Rest des Jahres. Ein
        regelmäßiger wöchentlicher Anruf „um 14 Uhr New Yorker Zeit" kann 48 Wochen um 20 Uhr
        Londoner Zeit stattfinden und 4 Wochen um 21 Uhr — immer wieder überraschend.
      </p>
      <p>
        Manche Orte beachten die Sommerzeit überhaupt nicht: Arizona (außer der Navajo Nation),
        Hawaii, der größte Teil Afrikas, Japan, China, Indien und weite Teile Südostasiens. Die EU
        stimmte 2019 für die Abschaffung der Sommerzeit, die Umsetzung wurde jedoch auf unbestimmte
        Zeit verschoben. Bis es eine dauerhafte Lösung gibt, bleibt die Komplexität bestehen.
      </p>

      <h2>Warum die Planung über Zeitzonen hinweg fehleranfällig ist</h2>
      <p>
        Die Fehlerarten sind gut dokumentiert:
      </p>
      <ul>
        <li>
          <strong>Annahme, der UTC-Offset sei das ganze Jahr stabil</strong> — DST-Umstellungen
          bedeuten, dass sich der Offset in den meisten Ländern zweimal jährlich ändert. Eine im
          Januar erstellte Kalendereinladung mit fest codiertem UTC-Offset ist nach der März-DST-
          Umstellung falsch.
        </li>
        <li>
          <strong>„9 Uhr bei Ihnen"</strong> — Diese Formulierung ist mehrdeutig, es sei denn, der
          Sprecher gibt die Zeitzone explizit an. Seine Zeitzone oder Ihre? Es ist nicht immer klar,
          wer spricht.
        </li>
        <li>
          <strong>Inkonsistenz bei Kalender-Software</strong> — Google Calendar, Outlook und Apple
          Calendar zeigen Zeitzonen unterschiedlich an. Ein in einer Kalender-App erstelltes
          Ereignis, das per E-Mail geteilt wird, wird nicht immer sauber in der App des Empfängers
          konvertiert, besonders bei verschiedenen Besprechungseinladungsformaten.
        </li>
        <li>
          <strong>Länder mit nicht ganzzahligen Offsets</strong> — Jemanden in Kathmandu (UTC+5:45)
          oder Teheran (UTC+3:30) zu einem Meeting einzuladen, das in ganzen UTC-Stunden angegeben
          ist, erzeugt einen Bruchoffset, den viele einfache Tools nicht korrekt handhaben.
        </li>
        <li>
          <strong>Datumslinienkreuzungen</strong> — Ein Meeting um 21 Uhr UTC an einem Dienstag ist
          in Tokio (UTC+9) bereits Mittwoch. Das Datum falsch anzugeben bei Meetings nahe
          Mitternacht UTC ist ein häufiger Fehler.
        </li>
      </ul>

      <h2>Best Practices für die Planung im Remote-Team</h2>
      <p>
        Teams, die über Zeitzonen hinweg arbeiten, haben sich auf mehrere Praktiken geeinigt, die
        Planungsfehler drastisch reduzieren:
      </p>
      <ul>
        <li>
          <strong>Immer die Zeitzone explizit angeben.</strong> Sagen Sie niemals „15 Uhr" ohne
          Zeitzone. „15 Uhr UTC" ist eindeutig. „15 Uhr ET" ist teilweise mehrdeutig (EST oder EDT?).
          „15 Uhr Eastern" ist besser, aber in Umstellungswochen noch mehrdeutig. „15:00 UTC" ist
          für jeden, der seinen UTC-Offset kennt, völlig eindeutig.
        </li>
        <li>
          <strong>UTC als Referenzzeit des Teams für die interne Kommunikation verwenden.</strong>{" "}
          Wenn interne Zeitpläne besprochen werden, alles an UTC ausrichten. „Der Deploy ist um
          14:00 UTC" ist etwas, das jedes Teammitglied unabhängig und korrekt in seine Ortszeit
          umrechnen kann.
        </li>
        <li>
          <strong>Tools verwenden, die mehrere Zeitzonen gleichzeitig anzeigen.</strong> Eine
          Weltzeituhr, die UTC, die aktuelle Ortszeit jedes Teammitglieds und den Offset anzeigt,
          ermöglicht eine schnelle Überprüfung ohne Kopfrechnen. Der{" "}
          <a href="/tools/timezone-converter">BrowseryTools Zeitzonenrechner</a> ermöglicht den
          sofortigen Vergleich mehrerer Städte.
        </li>
        <li>
          <strong>Rotierende „ungünstige" Meetings einplanen.</strong> Für global verteilte Teams,
          bei denen keine Zeit für alle günstig ist, sollte der ungünstige Zeitblock rotiert werden,
          anstatt immer dieselben Teammitglieder um 7 Uhr oder 22 Uhr beizutreten. Dokumentieren
          Sie die Rotation, damit sie transparent ist.
        </li>
        <li>
          <strong>Meetings nahe den DST-Umstellungsterminen vermeiden.</strong> In den zwei Wochen
          rund um Ende Oktober und Ende März sollten Sie Offset-Annahmen doppelt prüfen, bevor Sie
          Einladungen an internationale Teilnehmer versenden.
        </li>
      </ul>

      <h2>ISO 8601: Das Datum-/Zeitformat, das Mehrdeutigkeiten beseitigt</h2>
      <p>
        ISO 8601 ist ein internationaler Standard zur Darstellung von Datum und Uhrzeit auf eine
        Weise, die eindeutig ist und als Text korrekt sortiert. Das Format ist:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        YYYY-MM-DDTHH:MM:SSZ (oder +HH:MM für Offset)
      </p>
      <ul>
        <li><code>2026-03-15T14:30:00Z</code> — 15. März 2026, 14:30 Uhr UTC</li>
        <li><code>2026-03-15T14:30:00+05:30</code> — 15. März 2026, 14:30 Uhr India Standard Time</li>
        <li><code>2026-03-15T14:30:00-07:00</code> — 15. März 2026, 14:30 Uhr Mountain Daylight Time</li>
      </ul>
      <p>
        Das „T" trennt Datum und Uhrzeit. Das abschließende „Z" bedeutet UTC (Zulu-Zeit). Ein
        +/--Offset gibt die Ortszeit an und wie weit sie von UTC entfernt ist.
      </p>
      <p>
        ISO 8601 wird in allen modernen APIs, Web-Standards (HTML-Datumsattribute, HTTP-Header) und
        den meisten Programmiersprachdatumsbibliotheken verwendet. Für die menschliche Kommunikation
        ist das „JJJJ-MM-TT"-Datumsformat — selbst ohne Zeitangabe — nützlich, weil es korrekt
        sortiert und international eindeutig ist. „03/04/2026" ist der 3. April in den USA und der
        4. März in Großbritannien. „2026-03-04" ist eindeutig.
      </p>

      <h2>Zeitzonenbehandlung im Code: Immer UTC speichern</h2>
      <p>
        Die wichtigste Regel für Entwickler, die mit Zeitstempeln arbeiten:
        <strong> Speichern Sie alle Zeitstempel in UTC in Ihrer Datenbank.</strong> Immer. Ohne
        Ausnahme.
      </p>
      <p>
        Das Speichern von Zeitstempeln in Ortszeit erzeugt eine Klasse von Fehlern, die schwer zu
        reproduzieren, schwer zu diagnostizieren und teuer zu beheben sind:
      </p>
      <ul>
        <li>Wenn Ihr Server die Zeitzone wechselt (wie es bei Cloud-Provider-Migrationen vorkommt), sind plötzlich alle historischen Zeitstempel falsch</li>
        <li>DST-Umstellungen erzeugen mehrdeutige Zeitstempel — 1:30 Uhr tritt zweimal am Tag auf, an dem die Uhren zurückgestellt werden</li>
        <li>Die chronologische Sortierung von Ereignissen wird unzuverlässig, wenn Zeitstempel verschiedene Offsets mischen</li>
        <li>Zeitzonen-übergreifende Abfragen (alle Ereignisse zwischen Mitternacht und Mitternacht finden) werden zu komplexen Joins statt einfachen Bereichsabfragen</li>
      </ul>
      <p>
        Das korrekte Muster: UTC speichern, Ortszeit anzeigen. Benutzereingaben in ihrer Ortszeit
        entgegennehmen, sofort in UTC umrechnen, UTC speichern und für die Anzeige wieder in die
        Ortszeit des Benutzers umrechnen. Die Datenbankschicht muss nie etwas über Zeitzonen wissen.
      </p>
      <p>
        Verwenden Sie für Zeitzonendaten im Code die IANA-Zeitzonendatenbank (die „tz-Datenbank"
        oder „Olson-Datenbank") anstatt UTC-Offsets manuell zu pflegen. Die IANA-Datenbank wird
        aktualisiert, wenn Länder ihre DST-Regeln oder Offsets ändern — was häufiger vorkommt, als
        man erwarten würde. Referenzieren Sie Zeitzonen mit IANA-Bezeichnern (z. B.
        „America/New_York", „Asia/Kolkata") statt mit Offsets (z. B. „UTC-5"), weil Bezeichner
        DST-Umstellungen korrekt handhaben, feste Offsets jedoch nicht.
      </p>

      <div style={{background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser Zeitzonenrechner — Städte vergleichen, Überschneidungen finden
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Zeiten in mehreren Städten sofort umrechnen, Sommerzeit automatisch berücksichtigen und
          die richtige Besprechungszeit für Ihr Remote-Team finden.
        </p>
        <a
          href="/tools/timezone-converter"
          style={{background: "rgba(139,92,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Zeitzonenrechner öffnen →
        </a>
      </div>
    </div>
  );
}
