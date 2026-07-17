import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Die meisten Menschen leihen sich im Laufe ihres Lebens bedeutende Geldbeträge — eine
        Hypothek, ein Autokredit, ein Studienkredit, ein Privatkredit für Heimverbesserungen. Doch
        die meisten haben nur ein vages Verständnis davon, wie diese Kredite tatsächlich
        funktionieren. Sie kennen ihre monatliche Rate und den ungefähren Zinssatz — und das war's
        meist schon. Die Details — wie viel jeder Zahlung tatsächlich das Kapital tilgt, wie viele
        Zinsen sie insgesamt zahlen werden, was passiert, wenn sie Sonderzahlungen leisten — bleiben
        undurchsichtig.
      </p>
      <ToolCTA slug="loan-calculator" variant="inline" />
      <p>
        Dieser Leitfaden erklärt die Mechanik der Kreditrückzahlung klar, einschließlich der
        tatsächlichen Mathematik hinter monatlichen Raten, was Tilgungsplan (Amortisation) bedeutet
        und warum es wichtig ist, den wichtigen Unterschied zwischen effektivem Jahreszins (APR)
        und Nominalzinssatz sowie wie man Kreditangebote intelligent vergleicht.
      </p>
      <p>
        Sie können den{" "}
        <a href="/tools/loan-calculator">BrowseryTools Kreditrechner</a> verwenden — kostenlos, ohne
        Anmeldung, alles bleibt in Ihrem Browser.
      </p>

      <h2>Die Kreditratenformel</h2>
      <p>
        Die monatliche Rate für einen Festzinskredit wird mit einer Formel berechnet, die das
        Kapital (den geliehenen Betrag), den Zinssatz und die Laufzeit berücksichtigt:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Dabei gilt:
      </p>
      <ul>
        <li><strong>M</strong> ist die monatliche Rate</li>
        <li><strong>P</strong> ist das Kapital (der Kreditbetrag)</li>
        <li><strong>r</strong> ist der monatliche Zinssatz (Jahreszinssatz geteilt durch 12)</li>
        <li><strong>n</strong> ist die Anzahl der Zahlungen (Kreditlaufzeit in Monaten)</li>
      </ul>
      <p>
        Als konkretes Beispiel: Ein Autokredit über 20.000 € mit 6 % Jahreszins über 48 Monate hat
        einen monatlichen Zinssatz von 0,5 % (6 % / 12). Eingesetzt: M = 20.000 × [0,005 ×
        (1,005)^48] / [(1,005)^48 - 1] = ca. 470 € pro Monat. Über 48 Monate zahlen Sie 22.560 €
        insgesamt, das heißt 2.560 € Zinsen zusätzlich zum Kapital von 20.000 €.
      </p>
      <p>
        Sie müssen das nicht von Hand berechnen. Der{" "}
        <a href="/tools/loan-calculator">BrowseryTools Kreditrechner</a> erledigt die Formel sofort
        — aber das Verständnis, was die Formel tut, hilft Ihnen, die Ergebnisse intelligent zu
        interpretieren.
      </p>

      <h2>Was Kapital, Zinssatz und Laufzeit tatsächlich bedeuten</h2>
      <p>
        Diese drei Variablen sind die vollständige Beschreibung eines jeden Festzinskredits, und sie
        interagieren auf Weisen, die nicht immer intuitiv sind:
      </p>
      <ul>
        <li>
          <strong>Kapital</strong> ist der Betrag, den Sie leihen. Dies ist der Anfangssaldo, auf
          den Zinsen anfallen. Je größer das Kapital, desto mehr Zinsen zahlen Sie bei gleichem
          Zinssatz und gleicher Laufzeit — proportional.
        </li>
        <li>
          <strong>Zinssatz</strong> ist die jährliche Kreditkosten, ausgedrückt als Prozentsatz des
          ausstehenden Kapitals. Ein Unterschied von 1 % beim Zinssatz klingt gering, hat aber über
          eine lange Laufzeit erhebliche Auswirkungen. Bei einer 30-jährigen Hypothek über 400.000 €
          entspricht der Unterschied zwischen 6 % und 7 % etwa 85.000 € an insgesamt gezahlten
          Zinsen.
        </li>
        <li>
          <strong>Laufzeit</strong> ist die Zeit, die Sie zur Rückzahlung des Kredits haben,
          ausgedrückt in Monaten oder Jahren. Eine längere Laufzeit senkt die monatliche Rate,
          erhöht aber die insgesamt gezahlten Zinsen erheblich. Eine kürzere Laufzeit erhöht die
          monatliche Rate, lässt Sie aber schneller schuldenfrei werden und spart einen erheblichen
          Betrag an Zinsen.
        </li>
      </ul>

      <h2>Amortisation: Warum frühe Zahlungen hauptsächlich Zinsen sind</h2>
      <p>
        Amortisation ist der Prozess der Tilgung einer Schuld durch regelmäßige geplante Zahlungen.
        Bei einem Standard-Amortisationskredit deckt jede monatliche Rate zwei Dinge: die auf den
        ausstehenden Saldo aufgelaufenen Zinsen und einen Teil des Kapitals.
      </p>
      <p>
        Die wichtigste Erkenntnis — die die meisten Menschen überrascht — ist, dass in den frühen
        Jahren eines Kredits der weitaus größte Teil jeder Zahlung auf Zinsen und nicht auf
        Kapitaltilgung entfällt. Das liegt daran, dass die Zinsen auf den ausstehenden Saldo
        berechnet werden, der zu Beginn des Kredits am höchsten ist.
      </p>
      <p>
        Betrachten Sie eine 30-jährige Hypothek über 300.000 € mit 7 %. Die monatliche Rate beträgt
        ca. 1.996 €. Im allerersten Monat sind etwa 1.750 € dieser Rate Zinsen und nur 246 € sind
        Kapital. Nach einem Jahr Zahlungen — 23.952 € gezahlt — hat sich Ihr Darlehenssaldo nur um
        etwa 3.000 € verringert. Im 15. Jahr dreht sich das Verhältnis: mehr von jeder Zahlung geht
        auf das Kapital als auf Zinsen. In den letzten Jahren ist fast die gesamte Rate Kapital.
      </p>
      <p>
        Deshalb sind Sonderzahlungen am Anfang eines Kredits so wirkungsvoll — jeder zusätzliche
        Euro Kapital, der getilgt wird, reduziert den Saldo, auf den zukünftige Zinsen berechnet
        werden, und erzeugt einen Zinseszinseffekt, der Monate oder Jahre an Zahlungen eliminiert.
      </p>

      <h2>Effektiver Jahreszins vs. Nominalzinssatz: Der Unterschied, der Sie Tausende kostet</h2>
      <p>
        Der Nominalzinssatz und der effektive Jahreszins (APR) sind verwandt, aber nicht identisch,
        und ihre Verwechslung ist einer der häufigsten Fehler beim Kreditvergleich.
      </p>
      <ul>
        <li>
          <strong>Nominalzinssatz</strong> ist die Kreditkosten für das Kapital allein, ausgedrückt
          als Prozentsatz. Er bestimmt Ihre monatliche Ratenhöhe.
        </li>
        <li>
          <strong>Effektiver Jahreszins (APR)</strong> umfasst den Nominalzinssatz plus alle mit dem
          Kredit verbundenen Gebühren — Bearbeitungsgebühren, Vermittlungsgebühren, Disagio,
          Hypothekenversicherung und andere Kosten. Der APR stellt die wahren Gesamtkosten der
          Kreditaufnahme über die Laufzeit dar.
        </li>
      </ul>
      <p>
        Ein Kredit mit 6,5 % Nominalzinssatz und 5.000 € Gebühren könnte einen APR von 6,9 %
        haben. Ein konkurrierender Kredit mit 6,75 % Nominalzinssatz und ohne Gebühren könnte einen
        APR von 6,75 % haben. Der erste Kredit hat einen niedrigeren Nominalzinssatz, aber höhere
        wahre Kosten — besonders wenn Sie den Kredit vor Ende der Laufzeit ablösen oder refinanzieren
        (was viele tun). Der APR ist es, den Sie beim Kreditvergleich vergleichen sollten, nicht den
        beworbenen Nominalzinssatz.
      </p>
      <p>
        In den USA sind Kreditgeber gesetzlich verpflichtet, den APR offenzulegen. In Deutschland
        ist der effektive Jahreszins die Standardvergleichsgröße. Wenn ein Kreditgeber einen
        auffällig niedrigen Nominalzinssatz bewirbt, schauen Sie sofort auf den APR — die Lücke
        zwischen beiden enthüllt oft, wo die Gebühren versteckt sind.
      </p>

      <h2>Wie Sonderzahlungen die Gesamtzinsen beeinflussen</h2>
      <p>
        Sonderzahlungen — selbst bescheidene — gegen das Kreditkapital haben einen
        unverhältnismäßig großen Effekt auf die insgesamt gezahlten Zinsen. Weil jede Sonderzahlung
        das Kapital reduziert, werden alle zukünftigen Zinsberechnungen gegen einen niedrigeren
        Saldo durchgeführt. Die Einsparungen summieren sich mit der Zeit.
      </p>
      <p>
        Bei einer 30-jährigen Hypothek über 300.000 € mit 7 % reduziert eine monatliche Sonderzahlung
        von 200 € die Kreditlaufzeit um etwa 5 Jahre und spart etwa 80.000 € an Zinsen. Diese 200 €
        pro Monat — 2.400 € pro Jahr — erbringen einen Einsparungsertrag von rund 80.000 €. Kaum
        eine Investition erzielt zuverlässig eine solche garantierte, risikofreie Rendite.
      </p>
      <p>
        Der wichtige Vorbehalt: Stellen Sie vor Sonderzahlungen sicher, dass Ihr Kredit keine
        Vorfälligkeitsentschädigung hat (die meisten modernen Kredite haben keine, aber einige
        ältere schon), und bestätigen Sie, dass die Sonderzahlung auf das Kapital und nicht auf
        eine zukünftige Rate angerechnet wird — einige Kreditgeber verrechnen Sonderzahlungen
        standardmäßig als vorgezogene Raten, was nicht den gleichen Zinseinsparungseffekt hat.
      </p>

      <h2>Kreditangebote vergleichen: Schauen Sie nicht nur auf die monatliche Rate</h2>
      <p>
        Kreditgeber wissen, dass die monatliche Rate die Zahl ist, auf die sich die meisten
        Kreditnehmer fixieren, und strukturieren ihre Angebote entsprechend. Eine niedrigere
        monatliche Rate klingt verlockend, kann aber viel höhere Gesamtkosten verbergen, wenn sie
        durch eine längere Laufzeit oder höhere Gebühren erreicht wird.
      </p>
      <p>
        Beim Vergleich von Kreditangeboten sollten Sie immer berechnen und vergleichen:
      </p>
      <ul>
        <li><strong>Insgesamt gezahlte Zinsen</strong> über die gesamte Kreditlaufzeit</li>
        <li><strong>Effektiver Jahreszins (APR)</strong> — die wahren Gesamtkosten einschließlich Gebühren</li>
        <li><strong>Insgesamt zurückgezahlter Betrag</strong> (Kapital + alle Zinsen + alle Gebühren)</li>
        <li><strong>Vorfälligkeitsentschädigung</strong> — ob Kosten für eine vorzeitige Tilgung anfallen</li>
        <li><strong>Fester vs. variabler Zinssatz</strong> — variable Kredite können zunächst niedriger sein, tragen aber Zinsrisiken</li>
      </ul>
      <p>
        Zwei Kreditgeber könnten dasselbe Kapital zum gleichen Zinssatz, aber mit sehr
        unterschiedlichen Gebührenstrukturen anbieten. Ein Kredit mit 3.000 € Bearbeitungsgebühren
        gegenüber einem mit 0 € Gebühren und leicht höherem Zinssatz — die richtige Wahl hängt
        davon ab, wie lange Sie den Kredit behalten möchten. Bei kurzen Haltedauern schlagen
        niedrigere Gebühren niedrigere Zinsen. Bei langen Laufzeiten gewinnen niedrigere Zinsen.
      </p>

      <h2>Die versteckten Kosten der Verlängerung von Kreditlaufzeiten</h2>
      <p>
        Wenn monatliche Raten belastend werden, ist die übliche Reaktion, auf eine längere Laufzeit
        umzuschulden. Das senkt zwar die monatliche Rate, aber die Kosten sind erheblich.
      </p>
      <p>
        Eine verbleibende 20-jährige Hypothek auf 30 Jahre zu verlängern, um die monatliche Rate
        um 200 € zu senken, kann Zehntausende Euro an zusätzlichen Zinsen kosten und ein Jahrzehnt
        Schulden hinzufügen. Das kann die richtige Entscheidung in einer echten finanziellen Notlage
        sein — sollte aber mit offenen Augen für die Gesamtkosten getroffen werden, nicht nur wegen
        der monatlichen Erleichterung.
      </p>
      <p>
        Rechnen Sie durch, bevor Sie refinanzieren. Der{" "}
        <a href="/tools/loan-calculator">BrowseryTools Kreditrechner</a> ermöglicht es Ihnen, Szenarien
        nebeneinander zu vergleichen — passen Sie die Laufzeit an und sehen Sie die genauen
        Auswirkungen auf die insgesamt gezahlten Zinsen, bevor Sie eine Entscheidung treffen.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser Kreditrechner — Sofortige Amortisation, kein Konto erforderlich
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Monatliche Raten, Gesamtzinsen und vollständige Tilgungspläne für jeden Kredit berechnen.
          Szenarien vergleichen und Ihre Schulden verstehen.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Kreditrechner öffnen →
        </a>
      </div>
      <ToolCTA slug="loan-calculator" variant="card" />
    </div>
  );
}
