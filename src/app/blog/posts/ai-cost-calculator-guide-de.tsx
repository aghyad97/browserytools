import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        KI-APIs haben die Integration großer Sprachmodelle in Anwendungen bemerkenswert einfach
        gemacht – aber sie haben es auch bemerkenswert einfach gemacht, ein Budget zu überschreiten,
        ohne es zu merken. Tokenbasierte Preisgestaltung ist zunächst nicht intuitiv, und die
        Unterschiede zwischen Eingabe- und Ausgabekosten, Modellebenen und Anfragevolumen können
        Rechnungen erzeugen, die um Größenordnungen höher sind als erwartet. Ein paar Minuten
        Planung im Voraus können eine Menge unangenehmer Überraschungsrechnungen ersparen.
      </p>
      <ToolCTA slug="ai-cost-calculator" variant="inline" />
      <p>
        Mit dem{" "}
        <a href="/tools/ai-cost-calculator">BrowseryTools KI-Kostenkalkulator</a> – kostenlos,
        keine Anmeldung, alles bleibt im Browser – können Kosten für GPT-4, Claude, Gemini und
        andere wichtige Modelle modelliert werden, bevor man eine einzige Zeile Code schreibt.
      </p>

      <h2>Wie tokenbasierte Preisgestaltung funktioniert</h2>
      <p>
        Jede große KI-API – OpenAI, Anthropic, Google – berechnet nach Token, nicht nach Anfrage
        oder Sekunde. Ein Token entspricht ungefähr 3–4 englischen Zeichen oder etwa 0,75 Wörtern.
        Wenn man eine Eingabeaufforderung an eine API sendet, zählt der Anbieter die Token in der
        Eingabe, generiert eine Antwort, zählt diese Ausgabe-Token und berechnet für beides – zu
        unterschiedlichen Sätzen.
      </p>
      <p>
        Die Preise werden pro 1.000 Token angegeben (manchmal pro 1 Million Token für neuere
        Hochvolumen-Preisstufen). Stand Anfang 2026 sehen grobe Richtwerte so aus:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> – ca. 2,50 $ pro 1 Mio. Eingabe-Token, ca. 10,00 $ pro 1 Mio. Ausgabe-Token</li>
        <li><strong>Claude 3.5 Sonnet</strong> – ca. 3,00 $ pro 1 Mio. Eingabe-Token, ca. 15,00 $ pro 1 Mio. Ausgabe-Token</li>
        <li><strong>Gemini 1.5 Pro</strong> – ca. 1,25 $ pro 1 Mio. Eingabe-Token, ca. 5,00 $ pro 1 Mio. Ausgabe-Token</li>
        <li><strong>GPT-4o mini</strong> – ca. 0,15 $ pro 1 Mio. Eingabe-Token, ca. 0,60 $ pro 1 Mio. Ausgabe-Token</li>
        <li><strong>Claude 3 Haiku</strong> – ca. 0,25 $ pro 1 Mio. Eingabe-Token, ca. 1,25 $ pro 1 Mio. Ausgabe-Token</li>
      </ul>
      <p>
        Diese Zahlen verschieben sich mit der Aktualisierung der Modelle, also immer die aktuelle
        Preisseite des Anbieters prüfen. Die wichtigste Erkenntnis ist der Unterschied zwischen
        Eingabe- und Ausgabepreisen: Ausgabe-Token kosten typischerweise 3–5-mal mehr als
        Eingabe-Token desselben Modells.
      </p>

      <h2>Warum Ausgabe-Token mehr kosten</h2>
      <p>
        Die Asymmetrie zwischen Eingabe- und Ausgabepreisen spiegelt echte rechnerische Unterschiede
        wider. Die Verarbeitung eines Eingabe-Tokens (während der „Prefill"-Phase) erfordert einen
        einzigen Vorwärtsdurchlauf durch die Aufmerksamkeitsschichten des Modells. Die Generierung
        jedes Ausgabe-Tokens (während der „Dekodierung") erfordert einen separaten Vorwärtsdurchlauf –
        seriell, ein Token nach dem anderen –, was im Maßstab weitaus rechenintensiver ist.
      </p>
      <p>
        Das hat direkte Auswirkungen auf die Kostenschätzung: Die Anzahl der Ausgabe-Token ist
        wichtiger als die Anzahl der Eingabe-Token. Eine System-Eingabeaufforderung mit 500 Token,
        die eine Antwort mit 1.500 Token erzeugt, kostet mehr in der Ausgabe als die gesamte Eingabe.
        Wer ein Feature plant, das lange Dokumente, Berichte oder Code-Dateien generiert, sollte
        die Ausgabelänge sorgfältig modellieren – sie dominiert die Rechnung.
      </p>

      <h2>Monatliche Kosten schätzen: Ein Rahmenwerk</h2>
      <p>
        Zur Schätzung der monatlichen KI-API-Ausgaben werden vier Zahlen benötigt:
      </p>
      <ul>
        <li><strong>Durchschnittliche Eingabe-Token pro Anfrage</strong> – System-Eingabeaufforderung + Nutzernachricht + beliebiger Kontext</li>
        <li><strong>Durchschnittliche Ausgabe-Token pro Anfrage</strong> – typische Länge der Modellantwort</li>
        <li><strong>Anfragen pro Tag</strong> – erwartetes tägliches Anfragevolumen im Betrieb</li>
        <li><strong>Modellpreisgestaltung</strong> – Eingabe- und Ausgabekosten pro 1 Mio. Token für das geplante Modell</li>
      </ul>
      <p>
        Die Formel: <code>(durchschn._eingabe_token × eingabe_preis + durchschn._ausgabe_token × ausgabe_preis) × anfragen_pro_tag × 30</code>.
        Es klingt einfach, aber die Schätzung der Token-Anzahl vor dem Vorliegen echter Daten ist
        der Punkt, an dem die meisten Menschen falsch liegen. Eine „kurze" System-Eingabeaufforderung,
        die wie 50 Wörter klingt, kann leicht 80–100 Token ergeben. Eine Nutzerfrage plus
        Gesprächsverlauf in einer Chat-App kann ohne sorgfältige Verwaltung auf Tausende von
        Token pro Anfrage anwachsen.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Beispiel: Kundensupport-Bot
avg_input_tokens  = 800   // System-Eingabeaufforderung + Nutzernachricht + Verlauf
avg_output_tokens = 300   // typische Support-Antwort
requests_per_day  = 5000  // moderates Produktionsvolumen
model             = Claude 3.5 Sonnet

daily_cost = (800 × $0.003 + 300 × $0.015) pro 1K Token × 5000
           = ($2.40 + $4.50) × 5
           = ~$34.50/Tag → ~$1.035/Monat`}
      </pre>
      <p>
        Dieselbe Arbeitslast auf GPT-4o mini zu 0,15 $ / 0,60 $ pro 1 Mio. Token würde
        rund 15 $/Monat kosten. Allein die Modellwahl ergibt einen 70-fachen Kostenunterschied
        für diese Arbeitslast.
      </p>

      <h2>Praktische Strategien zur Senkung der KI-API-Kosten</h2>
      <p>
        Hat man eine Kostenschätzung, ist der nächste Schritt die Identifizierung von
        Einsparpotenzialen. Das sind die Techniken mit dem größten Hebel:
      </p>
      <ul>
        <li>
          <strong>Die richtige Modellebene wählen</strong> – Leistungsstarke Modelle (GPT-4, Claude
          Sonnet, Gemini Pro) nur für Aufgaben einsetzen, die tiefes Denkvermögen erfordern. Für
          Klassifizierung, einfache Extraktion oder kurze Q&amp;A liefern kleinere Modelle wie
          GPT-4o mini oder Claude Haiku vergleichbare Ergebnisse bei 10–50-fach geringeren Kosten.
        </li>
        <li>
          <strong>Wiederholte Eingaben zwischenspeichern</strong> – Wenn die System-Eingabeaufforderung
          bei Tausenden von Anfragen gleich ist, ermöglicht Prompt-Caching (unterstützt von Anthropic
          und OpenAI), das erneute Tokenisieren zu vermeiden. Bei hochvolumigen Anwendungen kann
          dies allein die Kosten um 30–50 % senken.
        </li>
        <li>
          <strong>Kontext aggressiv kürzen</strong> – Jedes Token im Kontextfenster kostet Geld.
          In Chat-Anwendungen nicht den gesamten Gesprächsverlauf einbeziehen – ein gleitendes
          Fenster der letzten 5–10 Turns oder eine Zusammenfassung älterer Turns verwenden. In
          RAG-Pipelines nur die relevantesten Chunks abrufen statt Dokumente massenhaft einzufügen.
        </li>
        <li>
          <strong>Maximale Ausgabe-Token begrenzen</strong> – <code>max_tokens</code> aufgabengerecht
          setzen. Bei der Generierung eines Produkttitels auf 30 Token begrenzen. Wenn das Modell
          innerhalb des Limits nicht antworten kann, fängt man diesen Grenzfall ab, statt
          stillschweigend für ein 2.000-Token-Geschwafel zu zahlen.
        </li>
        <li>
          <strong>Batch-Verarbeitung, wo möglich</strong> – Sowohl OpenAI als auch Anthropic bieten
          Batch-APIs mit 50 % Rabatt für Arbeitslasten, die keine Echtzeitantworten erfordern.
          Nächtliche Verarbeitungsjobs, Dokumentenklassifizierung und Content-Generierungspipelines
          sind gute Kandidaten.
        </li>
        <li>
          <strong>Überwachen und alarmieren</strong> – Ausgabenlimits und Nutzungsalarme im
          Anbieter-Dashboard einrichten, bevor man in Produktion geht. Fehler in der Wiederholungslogik
          oder Endlosschleifen können aus einer 50 $/Monat-Schätzung eine 5.000 $-Überraschung
          machen, bevor man es bemerkt.
        </li>
      </ul>

      <h2>Budgetplanung für verschiedene Anwendungsfälle</h2>
      <p>
        Verschiedene Anwendungstypen haben sehr unterschiedliche Kostenprofile. Ein schnelles
        mentales Modell:
      </p>
      <ul>
        <li>
          <strong>Prototypen und persönliche Projekte</strong> – 5–20 $/Monat. Mini/Haiku-Modelle
          verwenden, Kontext kurz halten, wo möglich auf dem kostenlosen Kontingent aufbauen.
        </li>
        <li>
          <strong>Interne Unternehmenstools (niedriges Volumen)</strong> – 50–300 $/Monat. Einige
          hundert Mitarbeitende nutzen ein KI-gestütztes Such- oder Dokumenten-Tool einige Male pro Tag.
        </li>
        <li>
          <strong>Consumer-Apps mit KI-Features (mittlere Größe)</strong> – 500–5.000 $/Monat.
          Zehntausende aktive Nutzer interagieren täglich mit KI-Features. Die Modellwahl ist
          hier entscheidend.
        </li>
        <li>
          <strong>KI als Kernprodukt (hohes Volumen)</strong> – 10.000 $/Monat und mehr. KI ist
          das primäre Wertversprechen und wird ständig genutzt. In diesem Maßstab empfehlen sich
          Enterprise-Preise und Investitionen in Caching- und Kontextverwaltungsinfrastruktur.
        </li>
      </ul>

      <h2>Mit einer Kostenschätzung beginnen</h2>
      <p>
        Bevor man sich auf ein Modell, eine Architektur oder eine Preisstufe festlegt, sollte man
        die Kosten mit echten Zahlen modellieren. Der{" "}
        <a href="/tools/ai-cost-calculator">BrowseryTools KI-Kostenkalkulator</a> ermöglicht es,
        Token-Anzahlen, Anfragevolumen und Modellauswahl einzugeben und die prognostizierten
        monatlichen Ausgaben nebeneinander bei verschiedenen Anbietern zu sehen. Das dauert zwei
        Minuten und kann Monate schmerzhafter Abrechnungsüberraschungen ersparen.
      </p>

      <div style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser KI-Kostenkalkulator – GPT-4, Claude, Gemini vergleichen
        </p>
        <a
          href="/tools/ai-cost-calculator"
          style={{background: "rgba(16,185,129,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          KI-Kostenkalkulator öffnen →
        </a>
      </div>
      <ToolCTA slug="ai-cost-calculator" variant="card" />
    </div>
  );
}
