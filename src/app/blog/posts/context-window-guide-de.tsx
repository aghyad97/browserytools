import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Eine der häufigsten Frustrationsquellen für Entwickler, die mit LLMs bauen, ist das
        Aufprallen auf eine unsichtbare Wand – eine Anfrage, die ohne Erklärung scheitert, ein
        Gespräch, das plötzlich den Kontext verliert, oder ein Dokument, das unvollständig
        verarbeitet wird. In fast jedem Fall ist das Kontextfenster der Schuldige. Zu verstehen,
        was ein Kontextfenster ist, was seine Grenzen in der Praxis bedeuten und wie man
        geschickt damit umgeht, ist grundlegend für den Aufbau zuverlässiger KI-Anwendungen.
      </p>
      <ToolCTA slug="context-window" variant="inline" />
      <p>
        Mit dem{" "}
        <a href="/tools/context-window">BrowseryTools Kontextfenster-Tool</a> – kostenlos, keine
        Anmeldung, alles bleibt im Browser – kann man visualisieren, wie viel vom Kontextfenster
        eines Modells der eigene Inhalt belegt, bevor er an eine API gesendet wird.
      </p>

      <h2>Was ist ein Kontextfenster?</h2>
      <p>
        Ein Kontextfenster ist die maximale Textmenge – in Token gemessen –, die ein Sprachmodell
        in einer einzigen Anfrage „sehen" und darüber nachdenken kann. Es ist das Arbeitsgedächtnis
        des Modells. Alles, was für die Generierung des nächsten Tokens relevant ist, muss in
        dieses Fenster passen: die System-Eingabeaufforderung, der vollständige Gesprächsverlauf,
        alle eingeschlossenen Dokumente und die Token, die das Modell gerade generiert.
      </p>
      <p>
        Anders als das menschliche Arbeitsgedächtnis, das bei Überlastung schrittweise nachlässt,
        haben Kontextfenster eine harte Grenze. Wird sie überschritten, gibt die API einen Fehler
        zurück. Es gibt keinen Teilerfolg – die Anfrage scheitert einfach, und die Anwendung
        muss damit umgehen.
      </p>
      <p>
        Das Kontextfenster ist ein gemeinsamer Pool für Eingabe und Ausgabe. Hat ein Modell ein
        128K-Token-Kontextfenster und die Eingabe beträgt 120K Token, verbleiben nur 8K Token
        für die Antwort des Modells. Das ist eine wichtige Einschränkung beim Entwerfen von
        Aufgaben, die lange Ausgaben erfordern.
      </p>

      <h2>Aktuelle Kontextfenster-Limits nach Modell</h2>
      <p>
        Kontextfenster sind in den letzten Jahren dramatisch gewachsen, und die Zahlen steigen
        weiter mit der Verbesserung der Modelle:
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> – 128.000 Token (~96.000 Wörter). Genug für einen vollständigen
          Roman oder eine große Codebasis.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> – 200.000 Token (~150.000 Wörter).
          Anthropic hat diese Grenze konsequent weiter verschoben als OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> – 1.000.000 Token (~750.000 Wörter). Ein wirklich
          beispielloses Kontextfenster, das ganze Codebasen oder stundenlange Meeting-Transkripte
          aufnehmen kann.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> – 1.000.000 Token, für Geschwindigkeit und niedrigere
          Kosten optimiert.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> – 128.000 Token, verfügbar über verschiedene
          Anbieter wie together.ai und Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> – 128.000 Token.
        </li>
      </ul>
      <p>
        Zum Vergleich: Dieser gesamte Blog-Beitrag hat etwa 1.200 Token. Selbst das „kleine"
        128K-Fenster von GPT-4o ist groß genug, um die meisten praktischen Dokumente vollständig
        zu verarbeiten. Die Frage lautet nicht nur, ob der Inhalt hineinpasst – sondern wie das
        Modell mit Inhalten an verschiedenen Positionen innerhalb dieses Fensters umgeht.
      </p>

      <h2>Was passiert, wenn man das Kontextfenster überschreitet</h2>
      <p>
        Wenn die Eingabe die maximale Kontextlänge des Modells überschreitet, gibt die API einen
        Fehler zurück. Häufige Fehlermeldungen sind:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// OpenAI
{
  "error": {
    "type": "invalid_request_error",
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 128000 tokens. However, your messages resulted in 134291 tokens."
  }
}

// Anthropic
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is too long: 201483 tokens > 200000 maximum"
  }
}`}
      </pre>
      <p>
        In einer Chat-Anwendung tritt das häufig nach genug Turns in einem langen Gespräch auf.
        Da jede Nutzernachricht und jede Assistentenantwort an den Verlauf angehängt wird, wächst
        die Gesamt-Token-Anzahl, bis sie das Limit erreicht. Ohne proaktives Management stürzt die
        Anwendung beim nächsten Turn ab. Nutzer erleben das als plötzliche Verweigerung des KI
        zu antworten oder als Fehler mitten im Gespräch – eine zutiefst frustrierende Erfahrung.
      </p>

      <h2>Das „Lost in the Middle"-Problem</h2>
      <p>
        Ein großes Kontextfenster zu haben bedeutet nicht, dass das Modell allem darin gleich
        aufmerksam folgt. Forschungen haben konsistent gezeigt, dass transformerbasierte Modelle
        bei Informationen am Anfang oder Ende des Kontexts besser abschneiden – ein Phänomen
        bekannt als das <strong>Lost in the Middle</strong>-Problem.
      </p>
      <p>
        In der Praxis bedeutet das: Wenn man RAG (Retrieval Augmented Generation) verwendet und
        20 abgerufene Dokument-Chunks in die Mitte eines langen Kontexts einfügt, kann das Modell
        die Chunks in den Positionen 8–14 möglicherweise nicht berücksichtigen, selbst wenn sie
        am relevantesten sind. Die für die Aufgabe wichtigsten Informationen sollten entweder
        ganz am Anfang (nahe der System-Eingabeaufforderung) oder ganz am Ende (unmittelbar vor
        der Frage des Nutzers) des Kontexts platziert werden.
      </p>
      <p>
        Das bedeutet auch, dass es nicht immer die richtige Strategie ist, dem Modell ein
        1-Million-Token-Kontextfenster zu geben und alles hineinzuschütten. Ein fokussierter
        10K-Kontext mit genau den richtigen Informationen übertrifft oft einen 500K-Kontext,
        der mit lose relevantem Material gefüllt ist.
      </p>

      <h2>Strategien für den Umgang mit Kontextgrenzen</h2>

      <h3>Chunking</h3>
      <p>
        Bei Dokumenten, die das Kontextfenster überschreiten, diese in überlappende Chunks
        aufteilen und jeden Chunk unabhängig verarbeiten. Eine kleine Überlappung (z. B. 20 %
        der Chunk-Größe) verwenden, um Kontinuität an Chunk-Grenzen zu erhalten. Das funktioniert
        gut für Aufgaben wie Zusammenfassung, Extraktion und Klassifizierung, bei denen jeder
        Chunk relativ in sich geschlossen ist.
      </p>

      <h3>Zusammenfassung / Komprimierung</h3>
      <p>
        Bei langen Gesprächen oder Dokumentenverläufen ältere Inhalte periodisch zusammenfassen
        und durch die Zusammenfassung ersetzen. Ein Gespräch mit 50 Turns lässt sich oft zu einer
        300-Token-Zusammenfassung komprimieren, die den Schlüsselkontext beibehält, ohne den
        vollständigen Verlauf zu konsumieren. Das ist besonders effektiv in Chat-Anwendungen, wo
        die frühen Turns des Gesprächs mit dessen Fortschritt weniger relevant werden.
      </p>

      <h3>Retrieval-Augmented Generation (RAG)</h3>
      <p>
        Statt ganze Dokumente in den Kontext zu legen, diese in eine Vektordatenbank einbetten
        und nur die relevantesten Passagen zur Abfragezeit abrufen. Ein gut gestaltetes RAG-System
        kann ein Modell mit einem 128K-Kontextfenster effektiv auf Millionen von Token Dokumentation
        „wissend" machen – es ruft nur das pro Abfrage Benötigte ab. Das senkt auch die Kosten
        erheblich gegenüber dem Einsatz eines vollständigen Langkontext-Modells bei jeder Anfrage.
      </p>

      <h3>Selektive Kontext-Einbeziehung</h3>
      <p>
        Bewusst auswählen, was einbezogen wird. In einem Coding-Assistenten müssen nicht alle
        Dateien des Projekts einbezogen werden – nur die für die aktuelle Aufgabe relevanten.
        In einem Dokument-Q&amp;A-System muss das gesamte Dokument nicht einbezogen werden,
        außer die Frage betrifft etwas, das das gesamte Dokument umspannt. Logik aufbauen, die
        den Kontext intelligent auswählt, statt standardmäßig alles einzubeziehen.
      </p>

      <h2>So überwacht man die Kontextnutzung</h2>
      <p>
        Die meisten KI-Anbieter-APIs geben die Token-Nutzung in ihren Antworten zurück. Das
        Antwortobjekt von OpenAI enthält ein <code>usage</code>-Feld mit <code>prompt_tokens</code>,{" "}
        <code>completion_tokens</code> und <code>total_tokens</code>. Anthropic gibt{" "}
        <code>input_tokens</code> und <code>output_tokens</code> zurück. Das Protokollieren dieser
        Zählungen für jede Anfrage gibt Einblick in Wachstumstrends, bevor man das Limit erreicht.
      </p>
      <p>
        Für Vor-Anfrage-Prüfungen, bevor eine Anfrage gesendet wird, verwendet man das{" "}
        <a href="/tools/context-window">BrowseryTools Kontextfenster-Tool</a>, um die
        Eingabeaufforderung einzufügen und genau zu sehen, wie viele Token sie belegt und welchen
        Prozentsatz des Kontextfensters jedes Modells das ausmacht. Das ist besonders nützlich
        beim Aufbau von System-Eingabeaufforderungen oder beim Entwerfen von RAG-Abrufstrategien –
        man kann die Auswirkungen seiner Entscheidungen sehen, bevor auch nur ein API-Aufruf
        getätigt wird.
      </p>

      <h2>Größer ist nicht immer besser</h2>
      <p>
        Die Erweiterung der Kontextfenster ist eine echte technische Leistung, und Millionen-Token-
        Kontexte eröffnen wirklich neue Anwendungsfälle. Aber für die meisten Anwendungen ist die
        gewinnende Strategie nicht, das Kontextfenster so weit wie möglich zu füllen – sondern
        die richtigen Informationen an der richtigen Position in einem gut abgegrenzten Kontext zu
        platzieren. Kombiniert mit dem Verständnis, wie viel Kontext man zu einem beliebigen
        Zeitpunkt verwendet, baut man Anwendungen, die schneller, günstiger und zuverlässiger sind
        als solche, die das Kontextfenster als Sammelsurium behandeln.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloses Kontextfenster-Tool – Prompt-Größe sofort visualisieren
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Kontextfenster-Tool öffnen →
        </a>
      </div>
      <ToolCTA slug="context-window" variant="card" />
    </div>
  );
}
