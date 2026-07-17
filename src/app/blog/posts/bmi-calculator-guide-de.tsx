import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Der Body-Mass-Index — BMI — ist eine der am weitesten verbreiteten Kennzahlen in der Präventivmedizin. Ärzte
        erwähnen ihn bei Vorsorgeuntersuchungen. Versicherungsformulare fragen danach. Fitness-Apps berechnen ihn
        automatisch. Und dennoch haben die meisten Menschen, die ihren BMI-Wert kennen, nur eine vage Vorstellung davon,
        was er eigentlich misst, wie er berechnet wird und — entscheidend — was er Ihnen nicht sagen kann. Dieser
        Leitfaden behandelt all das: die Formel, die Kategorien, die Geschichte, die echten Grenzen und wie Sie den{" "}
        <a href="/tools/bmi-calculator">BrowseryTools BMI-Rechner</a> nutzen, um Ihr Ergebnis sofort und privat in Ihrem
        Browser zu erhalten.
      </p>

      <ToolCTA slug="bmi-calculator" variant="inline" />
      <h2>Was ist der BMI?</h2>
      <p>
        Der BMI ist ein einfaches Verhältnis von Gewicht zu Körpergröße im Quadrat. Er wurde in den 1830er-Jahren von
        dem belgischen Mathematiker und Statistiker Adolphe Quetelet entwickelt, der die Merkmale eines
        „Durchschnittsmenschen" über große Bevölkerungsgruppen hinweg untersuchte. Quetelet war kein Mediziner und hatte
        niemals beabsichtigt, dass sein Index als individuelles Gesundheitsdiagnostikum verwendet wird — es war ein
        Werkzeug zur Untersuchung von Mustern auf Bevölkerungsebene. Die von ihm entwickelte Formel wurde später im
        zwanzigsten Jahrhundert von der medizinischen Fachwelt übernommen, weil sie etwas im klinischen Umfeld Seltenes
        bot: eine schnelle, kostenlose, nicht-invasive Möglichkeit, große Personenzahlen auf ein potenzielles
        gewichtsbedingtes Gesundheitsrisiko zu screenen.
      </p>
      <p>
        Der Index verfestigte sich in den 1970er-Jahren, nachdem der Physiologe Ancel Keys mehrere konkurrierende
        Gewichts-für-Größe-Indizes überprüft und festgestellt hatte, dass Quetelets ursprüngliche Formel in
        Bevölkerungsstudien am zuverlässigsten mit dem Körperfettanteil korrelierte. Keys prägte zu diesem Zeitpunkt den
        Begriff „Body-Mass-Index". Seitdem ist er weltweit die standardmäßige Screening-Kennzahl für Übergewicht und
        Adipositas in klinischen und öffentlichen Gesundheitskontexten.
      </p>

      <h2>Die BMI-Formel</h2>
      <p>
        Die Formel ist unkompliziert. In metrischen Einheiten:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = Gewicht (kg) ÷ Größe² (m²)
      </pre>
      <p>
        In imperialen Einheiten ist ein Umrechnungsfaktor erforderlich, weil Pfund und Zoll nicht dieselbe mathematische
        Beziehung wie Kilogramm und Meter teilen:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = 703 × Gewicht (lbs) ÷ Größe² (Zoll²)
      </pre>
      <p>
        Die Konstante 703 leitet sich aus der Einheitenumrechnung zwischen dem metrischen und dem imperialen System ab
        (konkret 1 kg/m² ≈ 703 × lb/in²). Beide Formeln erzeugen für dieselbe Person genau dieselbe dimensionslose Zahl.
      </p>

      <h2>Ein konkretes Beispiel</h2>
      <p>
        Betrachten Sie eine Person, die 70 kg wiegt und 1,75 m groß ist. Ihr BMI beträgt:
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`BMI = 70 ÷ (1.75²)
    = 70 ÷ 3.0625
    = 22.9`}
      </pre>
      <p>
        Ein Ergebnis von 22,9 fällt genau in den Bereich Normalgewicht (18,5–24,9). In imperialen Begriffen würde eine
        Person, die 5 ft 9 in (69 Zoll) groß ist und 154 lbs wiegt, Folgendes erhalten: 703 × 154 ÷ 69² = 108.262 ÷ 4.761 ≈
        22,7 — im Wesentlichen dieselbe Zahl, wie zu erwarten.
      </p>

      <h2>BMI-Kategorien</h2>
      <p>
        Die Weltgesundheitsorganisation (WHO) definiert die folgenden standardmäßigen BMI-Klassifikationen für
        Erwachsene ab 18 Jahren:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Kategorie</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BMI-Bereich</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Verbundenes Gesundheitsrisiko</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Untergewicht</strong></td>
              <td style={{padding: "12px 16px"}}>Unter 18,5</td>
              <td style={{padding: "12px 16px"}}>Mangelernährung, Osteoporose, Anämie, Immunschwäche</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Normalgewicht</strong></td>
              <td style={{padding: "12px 16px"}}>18,5 – 24,9</td>
              <td style={{padding: "12px 16px"}}>Geringstes Risiko im BMI-basierten Rahmen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Übergewicht</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29,9</td>
              <td style={{padding: "12px 16px"}}>Erhöhtes Risiko für Typ-2-Diabetes, Bluthochdruck, Herz-Kreislauf-Erkrankungen</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Adipositas Grad I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34,9</td>
              <td style={{padding: "12px 16px"}}>Mäßiges Risiko; metabolisches Syndrom, Schlafapnoe</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Adipositas Grad II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39,9</td>
              <td style={{padding: "12px 16px"}}>Hohes Risiko; erhöhtes Operationsrisiko, Gelenkerkrankungen</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Adipositas Grad III (schwer)</strong></td>
              <td style={{padding: "12px 16px"}}>40 und darüber</td>
              <td style={{padding: "12px 16px"}}>Sehr hohes Risiko; deutlich verringerte Lebenserwartung</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Diese Schwellenwerte gelten nur für Erwachsene. Kinder und Jugendliche werden anhand alters- und
        geschlechtsspezifischer Wachstumskurven beurteilt, bei denen die BMI-Perzentile — nicht eine feste Zahl — die
        Kategorie bestimmt.
      </p>

      <h2>Was der BMI nicht misst</h2>
      <p>
        Hier wird der BMI wirklich kompliziert. Die Formel ist so einfach, dass sie zwangsläufig wichtige Aspekte der
        Körperzusammensetzung übersieht. Diese Grenzen zu verstehen, ist nicht nur akademisch — sie beeinflussen direkt,
        wie Sie Ihre eigene Zahl interpretieren sollten.
      </p>

      <h3>Muskelmasse</h3>
      <p>
        Der BMI misst das Gesamtkörpergewicht im Verhältnis zur Körpergröße. Er kann nicht zwischen magerem
        Muskelgewebe und Fettgewebe (Adipozyten) unterscheiden. Ein Profisportler oder Wettkampf-Bodybuilder, der
        erhebliche Muskelmasse trägt, wird per BMI oft als übergewichtig oder sogar adipös eingestuft, obwohl er einen
        sehr niedrigen Körperfettanteil hat. Umgekehrt kann eine bewegungsarme Person mit geringer Muskelmasse und hohem
        Körperfett — manchmal „skinny fat" genannt oder mit Normalgewicht-Adipositas — einen völlig normalen BMI haben,
        während sie metabolisch schädliche Fettmengen trägt. Das ist wohl der bedeutendste Schwachpunkt der
        routinemäßigen BMI-Nutzung.
      </p>

      <h3>Alter</h3>
      <p>
        Mit zunehmendem Alter nimmt die Muskelmasse typischerweise ab und wird durch Fettgewebe ersetzt, selbst wenn das
        Körpergewicht konstant bleibt — ein Vorgang, der als sarkopenische Adipositas bezeichnet wird. Ein älterer
        Erwachsener mit einem normalen BMI von 23 kann tatsächlich einen höheren Körperfettanteil tragen als eine
        jüngere Person mit derselben Zahl. Manche Altersforscher argumentieren, dass etwas höhere BMI-Bereiche (bis zu
        27 oder sogar 28) bei älteren Erwachsenen schützend sein könnten, da ein niedriges Körpergewicht bei älteren
        Menschen mit Gebrechlichkeit und erhöhter Sterblichkeit verbunden ist.
      </p>

      <h3>Geschlecht</h3>
      <p>
        Frauen tragen bei gleichem BMI von Natur aus einen höheren Körperfettanteil als Männer. Im Durchschnitt haben
        Frauen bei identischen BMI-Werten etwa 10–12 Prozentpunkte mehr Körperfett als Männer. Das ist physiologisch
        normal — es hängt mit der Hormonfunktion und der Reproduktionsbiologie zusammen —, bedeutet aber, dass dieselbe
        BMI-Zahl je nach biologischem Geschlecht deutlich unterschiedliche Körperzusammensetzungen darstellt.
      </p>

      <h3>Ethnische Herkunft</h3>
      <p>
        Bevölkerungsforschung hat durchweg gezeigt, dass Menschen asiatischer Herkunft bei niedrigeren BMI-Werten ein
        höheres Risiko für kardiometabolische Erkrankungen (Typ-2-Diabetes, Bluthochdruck,
        Herz-Kreislauf-Erkrankungen) haben als Bevölkerungen europäischer Herkunft. Die WHO-Expertenkonsultation zum
        BMI in asiatischen Bevölkerungen empfahl, die Aktionsschwellen für asiatische Erwachsene zu senken — mit
        Übergewicht ab einem BMI von 23 und Adipositas ab einem BMI von 27,5 —, um das tatsächliche Gesundheitsrisiko
        in diesen Bevölkerungen besser abzubilden. Die WHO-Standardkategorien wurden überwiegend aus Daten zu
        europäischen Bevölkerungen entwickelt und lassen sich nicht sauber auf alle ethnischen Gruppen übertragen.
      </p>

      <h3>Fettverteilung</h3>
      <p>
        Wo Fett im Körper gespeichert wird, ist enorm wichtig — wohl wichtiger als die Gesamtfettmasse. Viszerales Fett,
        das sich um die Bauchorgane (Leber, Bauchspeicheldrüse, Darm) ansammelt, ist metabolisch aktiv und stark mit
        Insulinresistenz, Entzündung und Herz-Kreislauf-Erkrankungen verbunden. Subkutanes Fett, das unter der Haut
        besonders an Hüften und Oberschenkeln gespeichert wird, ist weniger schädlich und mag sogar etwas schützend
        sein. Der BMI erfasst keine dieser Unterscheidungen. Zwei Personen mit identischen BMI-Werten können je nach
        Speicherort ihres Fetts radikal unterschiedliche Gesundheitsprofile haben.
      </p>

      <h2>Warum der BMI trotzdem zum Standard wurde</h2>
      <p>
        Angesichts dieser gut dokumentierten Grenzen ist es berechtigt zu fragen, warum der BMI in der klinischen Praxis
        so dominant geblieben ist. Die Antwort ist praktisch: Er erfordert nur eine Waage und ein Maßband. Ihn zu
        berechnen dauert etwa zehn Sekunden. Er ist kostenlos, reproduzierbar und universell verstanden. Ausgefeiltere
        Methoden der Körperzusammensetzungsanalyse — DEXA-Scans, hydrostatisches Wiegen,
        Luftverdrängungsplethysmographie (Bod Pod), MRT-basierte Fettquantifizierung — sind genau, aber teuer,
        zeitaufwendig und in den meisten routinemäßigen klinischen Umgebungen nicht verfügbar.
      </p>
      <p>
        Der BMI erfüllt einen bestimmten Zweck gut: Er ist ein günstiges Screening-Werkzeug auf Bevölkerungsebene, das
        schnell Personen markieren kann, die eine weitere Untersuchung rechtfertigen könnten. Er wurde nie als
        Diagnosewerkzeug für Einzelpersonen konzipiert, und die meisten Forschenden und Ärzte, die mit ihm arbeiten,
        verstehen diese Unterscheidung. Das Problem entsteht, wenn er so verwendet wird, als wäre er endgültiger, als er
        ist.
      </p>

      <h2>Ergänzende Messwerte</h2>
      <p>
        Wenn Sie ein vollständigeres Bild Ihrer Körperzusammensetzung und Ihres Gesundheitsrisikos wünschen, ziehen Sie
        diese Messwerte zusätzlich zum BMI in Betracht:
      </p>
      <ul>
        <li>
          <strong>Taillenumfang:</strong> Gemessen an der schmalsten Stelle des Rumpfes (oder am Bauchnabel).
          Hochrisiko-Schwellenwerte liegen im Allgemeinen bei 94 cm (37 in) für Männer und 80 cm (31,5 in) für Frauen,
          mit sehr hohem Risiko über 102 cm (40 in) für Männer und 88 cm (34,5 in) für Frauen. Das erfasst direkt die
          zentrale Adipositas — Bauchfett —, was der BMI nicht kann.
        </li>
        <li>
          <strong>Taille-Hüft-Verhältnis (WHR):</strong> Taillenumfang geteilt durch Hüftumfang. Ein WHR über 0,90 bei
          Männern oder 0,85 bei Frauen weist gemäß den WHO-Richtlinien auf eine abdominale Adipositas hin.
        </li>
        <li>
          <strong>Taille-Größe-Verhältnis (WHtR):</strong> Taillenumfang geteilt durch Körpergröße. Ein Verhältnis
          unter 0,5 gilt über die meisten Bevölkerungen und Altersgruppen hinweg im Allgemeinen als gesund und macht es
          zu einem der einfachsten Einzahl-Indikatoren für zentrales Fett.
        </li>
        <li>
          <strong>Körperfettanteil:</strong> Direkte Messung des Anteils Ihres Gewichts, der aus Fett besteht. Gesunde
          Bereiche liegen bei etwa 10–20 % für Männer und 18–28 % für Frauen, wobei die optimalen Bereiche je nach Alter
          variieren. Der Körperfettanteil erfordert spezialisiertere Messmethoden.
        </li>
      </ul>

      <h2>Gesunder Gewichtsbereich für Ihre Körpergröße</h2>
      <p>
        Die BMI-Formel kann umgestellt werden, um zu berechnen, welche Gewichte Ihnen einen BMI im Normalbereich
        (18,5–24,9) geben würden. Um Ihren gesunden Gewichtsbereich zu finden, multiplizieren Sie Ihre Körpergröße in
        Metern zum Quadrat mit 18,5 und 24,9:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Gesunder Gewichtsbereich = 18.5 × Größe² bis 24.9 × Größe²

Für 1.75 m:
Untergrenze = 18.5 × 3.0625 = 56.7 kg
Obergrenze = 24.9 × 3.0625 = 76.3 kg`}
      </pre>
      <p>
        Für eine Person mit 1,75 m Körpergröße entspricht ein normaler BMI also einem Körpergewicht zwischen etwa
        56,7 kg und 76,3 kg — ein Bereich von nahezu 20 kg. Der <a href="/tools/bmi-calculator">BrowseryTools
        BMI-Rechner</a> zeigt diesen gesunden Bereich automatisch unterhalb Ihres Ergebnisses an, sodass Sie genau
        sehen, wo Sie relativ zur Normalkategorie für Ihre spezifische Körpergröße stehen.
      </p>

      <h2>Gesundheitsrisiken, die mit jeder Kategorie verbunden sind</h2>
      <p>
        Obwohl der BMI unvollkommen ist, korreliert er auf Bevölkerungsebene mit bedeutsamen Gesundheitsergebnissen.
        Deutliches Untergewicht ist mit Mangelernährung, geschwächter Immunfunktion, Verlust an Knochendichte und
        Herz-Kreislauf-Komplikationen verbunden. Am anderen Ende der Skala erhöhen anhaltendes Übergewicht und
        Adipositas das statistische Risiko für:
      </p>
      <ul>
        <li>Typ-2-Diabetes (das Risiko beginnt über einem BMI von 25 zu steigen und beschleunigt sich über 30)</li>
        <li>Bluthochdruck und Herz-Kreislauf-Erkrankungen</li>
        <li>Bestimmte Krebsarten, darunter Darm-, Brust-, Gebärmutterschleimhaut- und Nierenkrebs</li>
        <li>Obstruktive Schlafapnoe</li>
        <li>Nichtalkoholische Fettlebererkrankung (NAFLD)</li>
        <li>Arthrose der gewichttragenden Gelenke</li>
        <li>Erhöhtes Operations- und Narkoserisiko</li>
      </ul>
      <p>
        Das sind statistische Zusammenhänge über Bevölkerungen hinweg, keine individuellen Vorhersagen. Ein BMI von 28
        bedeutet nicht, dass Sie eine dieser Erkrankungen entwickeln werden — es bedeutet, dass in großen
        Studienpopulationen Menschen mit diesem BMI im Vergleich zu Menschen im Normalbereich erhöhte Raten dieser
        Ergebnisse aufwiesen.
      </p>

      <h2>So nutzen Sie den BrowseryTools BMI-Rechner</h2>
      <p>
        Der <a href="/tools/bmi-calculator">BrowseryTools BMI-Rechner</a> ist darauf ausgelegt, Ihnen ein sofortiges,
        klares Ergebnis mit nützlichem Kontext zu liefern:
      </p>
      <ul>
        <li>
          <strong>Metrisch oder imperial:</strong> Wechseln Sie zwischen kg/cm und lbs/Zoll. Der Rechner konvertiert
          automatisch — Sie müssen nie an Einheitenumrechnungen denken.
        </li>
        <li>
          <strong>Sofortige Ergebnisse:</strong> Ihr BMI wird in dem Moment angezeigt, in dem Sie Ihre Körpergröße und
          Ihr Gewicht eingeben. Keine Schaltfläche zum Klicken, kein Laden.
        </li>
        <li>
          <strong>Kategorieanzeige:</strong> Das Ergebnis zeigt nicht nur die Zahl, sondern auch die WHO-Kategorie, in
          die sie fällt — Untergewicht, Normal, Übergewicht oder Adipositas — mit Farbcodierung zur Klarheit.
        </li>
        <li>
          <strong>Gesunder Gewichtsbereich:</strong> Für Ihre eingegebene Körpergröße zeigt das Tool den Bereich der
          Körpergewichte an, die einem normalen BMI (18,5–24,9) in Ihrem gewählten Einheitensystem entsprechen.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Ihre Daten verlassen niemals Ihr Gerät.</strong> Der BMI-Rechner läuft vollständig in Ihrem Browser. Die
        von Ihnen eingegebenen Werte für Körpergröße und Gewicht werden nur für die Berechnung auf dem Bildschirm
        verwendet und niemals an BrowseryTools-Server übertragen, in einer Datenbank gespeichert oder an einen Dritten
        weitergegeben. Nichts wird protokolliert. Das Schließen des Tabs verwirft alles.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Medizinischer Haftungsausschluss
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          Der BrowseryTools BMI-Rechner ist ausschließlich ein Informationswerkzeug. Der BMI ist eine
          Screening-Kennzahl, kein Diagnosemaß. Das von ihm gelieferte Ergebnis ist keine medizinische Beratung und
          sollte nicht verwendet werden, um Entscheidungen über Ihre Gesundheit, Ernährung oder Behandlung zu treffen,
          ohne eine qualifizierte medizinische Fachkraft zu konsultieren. Wenn Sie Bedenken hinsichtlich Ihres
          Gewichts, Ihrer Körperzusammensetzung oder damit verbundener Gesundheitszustände haben, sprechen Sie bitte mit
          Ihrem Arzt oder einer eingetragenen Ernährungsberaterin.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Berechnen Sie Ihren BMI sofort — metrisch oder imperial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Sehen Sie Ihre Kategorie, Ihren gesunden Gewichtsbereich und was die Zahl tatsächlich bedeutet.
          Kein Konto erforderlich. Nichts wird hochgeladen oder gespeichert.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          BMI-Rechner öffnen →
        </a>
      </div>
      <ToolCTA slug="bmi-calculator" variant="card" />
    </div>
  );
}
