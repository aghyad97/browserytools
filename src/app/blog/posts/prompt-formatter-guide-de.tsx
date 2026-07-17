import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Der Unterschied zwischen einer mittelmäßigen KI-Antwort und einer wirklich nützlichen liegt
        selten an den Fähigkeiten des Modells – er liegt fast immer daran, wie der Prompt formuliert
        wurde. Struktur, Klarheit und die richtigen Formatierungshinweise können aus einer vagen,
        weitschweifigen Ausgabe eine präzise, handlungsorientierte Antwort machen. Wenn man das
        Gefühl hat, ein KI-Tool schöpfe sein Potenzial nicht aus, ist das Prompt-Format der erste
        untersuchenswerte Ansatzpunkt.
      </p>
      <ToolCTA slug="prompt-formatter" variant="inline" />
      <p>
        Mit dem{" "}
        <a href="/tools/prompt-formatter">BrowseryTools Prompt-Formatierer</a> – kostenlos, keine
        Anmeldung, alles bleibt im Browser – können Prompts bereinigt, umstrukturiert und verfeinert
        werden, bevor sie an ein KI-Modell gesendet werden.
      </p>

      <h2>Warum Formatierung wichtiger ist, als man denkt</h2>
      <p>
        Sprachmodelle lesen Prompts nicht so, wie ein Mensch eine Nachricht überfliegt. Sie
        verarbeiten Token sequenziell und reagieren empfindlich auf die Formulierung, Reihenfolge
        und Trennung von Anweisungen. Ein als langer, ununterbrochener Absatz geschriebener Prompt
        vergräbt die wichtigsten Anweisungen in der Mitte – genau dort, wo sie am wenigsten Einfluss
        auf die Ausgabe haben. Ein gut formatierter Prompt stellt Einschränkungen und Ziele voran,
        verwendet klare Trennzeichen zwischen Abschnitten und gibt das erwartete Ausgabeformat
        explizit an.
      </p>
      <p>
        Man kann sich Prompt-Formatierung wie das Schreiben eines Briefings für einen Auftragnehmer
        vorstellen. Je präziser die Lieferung, die Einschränkungen und der Kontext angegeben sind,
        desto näher wird der erste Entwurf dem sein, was man tatsächlich braucht.
      </p>

      <h2>Technik 1: Rollenzuweisung</h2>
      <p>
        Eine der effektivsten Formatierungstechniken ist, dem Modell vor der eigentlichen Aufgabe
        eine Rolle zu geben. Das aktiviert ein spezifisches Register und eine Reihe von
        Konventionen, die das Modell mit dieser Rolle assoziiert, und produziert konsistentere
        Ausgaben.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Ohne Rolle:
"Erkläre, wie man eine gute README schreibt."

✅ Mit Rolle:
"Du bist ein erfahrener Open-Source-Maintainer, der Hunderte von Repositories
rezensiert. Erkläre, wie man eine README schreibt, die den Wert eines Projekts
sowohl für technische als auch nicht-technische Leser klar kommuniziert."`}
      </pre>
      <p>
        Die Rollenvorgabe schränkt das Modell nicht ein – sie fokussiert es. Man erhält Texte,
        die den Standards und dem Vokabular der Persona entsprechen, statt einer generischen
        Übersicht.
      </p>

      <h2>Technik 2: Klare Anweisungsblöcke</h2>
      <p>
        Aufgabenbeschreibung, Kontext und Einschränkungen in separate Abschnitte trennen.
        Markdown-Überschriften und dreifache Backtick-Trennzeichen funktionieren gut. Viele
        Modelle wurden auf Dokumenten mit dieser Struktur trainiert und reagieren gut darauf.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Aufgabe
Fasse das folgende Kundenfeedback in drei handlungsrelevante Produktprioritäten zusammen.

## Kontext
Dies ist Feedback von B2B-SaaS-Nutzern, gesammelt im vierten Quartal 2025. Die Zielgruppe
dieser Zusammenfassung ist ein Produktmanager, der eine Sprint-Planning-Session vorbereitet.

## Einschränkungen
- Maximal 150 Wörter insgesamt
- Stichpunkte verwenden
- Keine direkten Zitate aufnehmen

## Eingabe
"""
[Kundenfeedback hier einfügen]
"""`}
      </pre>
      <p>
        Die beschrifteten Abschnitte machen sofort klar, was wohin gehört. Kontext oder
        Einschränkungen können unabhängig angepasst werden, ohne den gesamten Prompt umzuschreiben.
      </p>

      <h2>Technik 3: Few-Shot-Beispiele</h2>
      <p>
        Wenn man eine Ausgabe in einem bestimmten Stil oder Format benötigt, ist die zuverlässigste
        einzelne Technik, ein oder zwei Beispiele des Gewünschten einzuschließen. Das nennt sich
        Few-Shot-Prompting und übertrifft konsistent lange verbale Beschreibungen des gewünschten
        Formats.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Wandle eine rohe Feature-Anfrage in eine User Story im folgenden Format um.

Beispiel-Eingabe: "Nutzer möchten Daten als CSV exportieren"
Beispiel-Ausgabe: "Als Datenanalyst möchte ich meine Dashboard-Daten als CSV exportieren,
damit ich benutzerdefinierte Analysen in Tabellenkalkulations-Tools durchführen kann."

Wandle jetzt um: "Nutzer möchten benachrichtigt werden, wenn ein Bericht fertig ist"`}
      </pre>
      <p>
        Man beachte, dass das Beispiel sowohl die Struktur definiert („Als … möchte ich … damit …")
        als auch das erwartete Spezifitätsniveau. Das Format muss nicht in Prosa erklärt werden –
        das Beispiel zeigt es.
      </p>

      <h2>Technik 4: Chain-of-Thought-Prompting</h2>
      <p>
        Für Denk-Aufgaben – Debugging, Analyse, Berechnungen, Entscheidungsfindung – verbessert
        das explizite Bitten des Modells, Schritt für Schritt zu denken, bevor es eine abschließende
        Antwort gibt, die Genauigkeit dramatisch. Das ist kein Trick: Es verändert, wie das Modell
        seine interne Berechnung während der Generierung zuweist.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Ohne Chain-of-Thought:
"Was ist die beste Datenbank für ein Echtzeit-Multiplayer-Spiel?"

✅ Mit Chain-of-Thought:
"Was ist die beste Datenbank für ein Echtzeit-Multiplayer-Spiel?
Denke die Anforderungen Schritt für Schritt durch – Latenz, Parallelitätsmodell,
Datenstruktur, Konsistenzgarantien – bevor du deine Empfehlung gibst."`}
      </pre>
      <p>
        Die Schritt-für-Schritt-Anweisung legt das Zwischendenken offen, das man bewerten kann.
        Fehler sind auch viel wahrscheinlicher zu erkennen, wenn man die Denkkette statt nur
        eine Schlussfolgerung sieht.
      </p>

      <h2>Technik 5: XML- und JSON-strukturierte Prompts</h2>
      <p>
        Wenn die Ausgabe selbst strukturiert sein soll – ein JSON-Objekt, eine Tabelle, ein
        bestimmtes Schema – das Ausgabeformat explizit machen und eine passende Struktur im
        Prompt verwenden. Claude und GPT-4 reagieren besonders gut auf XML-getaggte Abschnitte.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extrahiere die folgenden Felder aus der Stellenbeschreibung unten.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[Stellenbeschreibungstext hier]
</input>`}
      </pre>
      <p>
        Die XML-Tags fungieren als eindeutige Trennzeichen. Das Modell weiß genau, wo die
        Anweisungen enden und wo die einzugebenden Daten beginnen, was das Risiko reduziert,
        dass das Modell die Anweisungen als zu verarbeitenden Inhalt behandelt.
      </p>

      <h2>Häufige Prompt-Formatierungsfehler</h2>
      <ul>
        <li><strong>Die Hauptanweisung vergraben</strong> – Was man vom Modell möchte, sollte am Anfang stehen, nicht nach drei Absätzen Kontext. Modelle gewichten frühere Token stärker.</li>
        <li><strong>Widersprüchliche Einschränkungen</strong> – „Sei präzise, aber decke jedes Detail ab" zwingt das Modell zu einem willkürlichen Kompromiss. Angeben, was wichtiger ist.</li>
        <li><strong>Geteilten Kontext voraussetzen</strong> – Das Modell hat keine Erinnerung an frühere Sitzungen. Alle relevanten Kontexte im Prompt selbst einschließen.</li>
        <li><strong>Kein Ausgabeformat angegeben</strong> – Wenn man eine Liste benötigt: Liste sagen. Wenn JSON: JSON sagen. Wenn eine Antwort unter 200 Wörtern: das sagen. Nicht angegebenes Format = unvorhersehbare Ausgabe.</li>
        <li><strong>Überdetaillierte Stilregeln</strong> – Lange Listen negativer Anweisungen („mach nicht X, sag nie Y") verbrauchen Kontext und produzieren oft steife, unnatürliche Ausgaben. Ein oder zwei starke Einschränkungen übertreffen zehn schwache.</li>
      </ul>

      <h2>Vorher und nachher: Dieselbe Anfrage, neu formatiert</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Vorher:
"Kannst du mir helfen, eine E-Mail an meinen Chef wegen einer Projektverzögerung
zu schreiben? Wir sollten letzte Woche die neue Zahlungsintegration launchen, aber
die Drittanbieter-API hatte Probleme und jetzt schauen wir auf vielleicht
nächsten Mittwoch oder Donnerstag, kannst du es professionell machen?"

✅ Nachher:
Du bist ein erfahrener Geschäftskommunikator.

## Aufgabe
Schreibe eine professionelle Verzögerungsbenachrichtigungs-E-Mail von einem Entwickler an seinen Vorgesetzten.

## Kontext
- Projekt: Zahlungsgateway-Integration
- Ursprüngliche Frist: letzten Freitag
- Neue Schätzung: Mittwoch oder Donnerstag dieser Woche
- Ursache: Probleme mit einer Drittanbieter-API (nicht unser Team schuld)

## Ton
Professionell, direkt und lösungsorientiert – nicht defensiv oder entschuldigend

## Ausgabe
Betreffzeile + E-Mail-Text, unter 150 Wörtern`}
      </pre>
      <p>
        Die neu formatierte Version nimmt 20 zusätzliche Sekunden zu schreiben und produziert
        eine sofort verwendbare Ausgabe, statt zwei oder drei Korrekturrunden zu erfordern.
      </p>

      <h2>Den Prompt-Formatierer nutzen</h2>
      <p>
        Der{" "}
        <a href="/tools/prompt-formatter">BrowseryTools Prompt-Formatierer</a> hilft dabei, diese
        Techniken anzuwenden, ohne sich jede Regel merken zu müssen. Den rohen Prompt einfügen,
        die passende Struktur für den Anwendungsfall auswählen und eine saubere, gut organisierte
        Version erhalten, die an ChatGPT, Claude, Gemini oder ein anderes Modell gesendet werden
        kann. Kein Konto erforderlich, und die Prompts verlassen nie den Browser.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        Prompt-Formatierung ist eine erlernbare Fähigkeit mit messbarem Ertrag. Rollenzuweisung
        fokussiert das Modell, klare Abschnittsunterteilungen beseitigen Mehrdeutigkeiten, Few-Shot-
        Beispiele definieren das erwartete Format, und explizite Ausgabeeinschränkungen beseitigen
        das Rätselraten. Der beste Prompt ist nicht der ausgefeilteste – er ist derjenige, der
        die wenigsten unbeantworteten Fragen vor dem Generierungsbeginn hinterlässt.
      </p>
      <ToolCTA slug="prompt-formatter" variant="card" />
    </div>
  );
}
