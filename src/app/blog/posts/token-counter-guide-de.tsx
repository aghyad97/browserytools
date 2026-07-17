import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Wenn Entwickler zum ersten Mal mit großen Sprachmodell-APIs arbeiten, taucht fast sofort
        eine Frage auf: „Wie lang ist zu lang?" Sie denken in Wörtern, Absätzen oder Zeichen –
        aber das Modell denkt in Token. Zu verstehen, was Token sind, wie sie gezählt werden und
        warum die Anzahl wichtig ist, gehört zu den praktisch nützlichsten Dingen, die man lernen
        kann, bevor man ernsthaft auf einem LLM aufbaut.
      </p>
      <ToolCTA slug="token-counter" variant="inline" />
      <p>
        Mit dem{" "}
        <a href="/tools/token-counter">BrowseryTools Token-Zähler</a> – kostenlos, keine Anmeldung,
        alles bleibt im Browser – kann die Token-Anzahl für beliebigen Text bestimmt werden, bevor
        er an eine API gesendet wird.
      </p>

      <h2>Was ist ein Token? (Kein Wort, kein Zeichen)</h2>
      <p>
        Ein Token ist die grundlegende Texteinheit, die ein Sprachmodell verarbeitet. Es ist kein
        Wort. Es ist kein Zeichen. Es ist ein Textabschnitt, den der Tokenizer des Modells gelernt
        hat, als einzelne Einheit zu behandeln – und dieser Abschnitt kann von einem einzelnen
        Zeichen bis zu einem mehrzeichigen Wortfragment oder einem vollständigen gebräuchlichen
        Wort reichen.
      </p>
      <p>
        Hier sind einige Beispiele, wie ein Satz von einem GPT-Tokenizer in Token aufgeteilt
        werden könnte:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 Token

"unbelievable"
→ ["un", "believ", "able"]  — 3 Token

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 Token

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 Token`}
</pre>
      <p>
        Man beachte, wie häufige kurze Wörter wie „Hello" auf ein einzelnes Token abgebildet
        werden, während längere oder ungewöhnliche Wörter über mehrere Token aufgeteilt werden.
        Satzzeichen, Zahlen und Sonderzeichen sind oft eigene Token. Der Tokenizer teilt nicht
        einfach an Leerzeichen oder Satzzeichen auf – er verwendet ein erlerntes Vokabular von
        Teilwort-Einheiten, um das beste Gleichgewicht zwischen Vokabulargröße und
        Darstellungseffizienz zu erreichen.
      </p>

      <h2>Wie Tokenizer funktionieren: Byte-Pair Encoding</h2>
      <p>
        Die meisten modernen LLMs – GPT-4, Claude, Gemini, Llama – verwenden eine Variante von{" "}
        <strong>Byte-Pair Encoding (BPE)</strong> oder einen eng verwandten Algorithmus namens
        SentencePiece. BPE wurde ursprünglich für die Datenkompression entwickelt; es wurde für
        NLP adaptiert, weil es das Problem des offenen Vokabulars elegant löst.
      </p>
      <p>
        Der BPE-Trainingsprozess beginnt mit einzelnen Zeichen (oder Bytes) als Basisvokabular.
        Dann wird wiederholt das am häufigsten gemeinsam vorkommende Symbolpaar im Trainingskorpus
        gefunden und zu einem neuen Einzelsymbol zusammengeführt. Nach Tausenden solcher
        Zusammenführungen enthält das resultierende Vokabular häufige Wörter als einzelne Token,
        häufige Präfixe und Suffixe als Token sowie seltene Wörter als Sequenzen kleinerer Token.
        Die endgültige Vokabulargröße beträgt typischerweise 32.000 bis 100.000 Token.
      </p>
      <p>
        Das bedeutet, dass die Tokenisierung eines bestimmten Textes vollständig von dem
        spezifischen Vokabular abhängt, mit dem das Modell trainiert wurde. <strong>GPT-4,
        Claude und Gemini verwenden alle unterschiedliche Tokenizer</strong> – derselbe Text kann
        bei jedem Modell zu einer anderen Token-Anzahl führen. Niemals sollte man davon ausgehen,
        dass eine für ein Modell gemessene Token-Anzahl auf ein anderes zutrifft.
      </p>

      <h2>Die Faustregel „750 Wörter pro 1.000 Token"</h2>
      <p>
        Oft wird die Näherung „1.000 Token ≈ 750 Wörter" für englischen Text zitiert. Das ist
        eine vernünftige Heuristik für typische Prosa – Blog-Beiträge, Artikel, Dokumentation.
        Sie ergibt sich aus der Beobachtung, dass in einem ausgewogenen englischen Korpus die
        durchschnittliche Token-Länge bei 4–5 Zeichen liegt und das durchschnittliche englische
        Wort etwa 5 Zeichen plus ein Leerzeichen hat. Ein Wort entspricht also im Durchschnitt
        ungefähr 1,3 Token.
      </p>
      <p>
        Aber „Faustregel" ist die richtige Einordnung – in der Praxis bricht sie schnell zusammen:
      </p>
      <ul>
        <li>
          <strong>Code tokenisiert kompakter</strong> – Programmiersprachen verwenden viele kurze
          Schlüsselwörter, Operatoren und Bezeichner, die oft einzelne Token sind. Ein Block
          Python-Code kann pro Zeichen weniger Token ergeben als englische Prosa.
        </li>
        <li>
          <strong>URLs und technische Strings sind teuer</strong> – Eine lange URL wie
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code>
          kann trotz kurzen Erscheinungsbildes zu 20 oder mehr Token werden.
        </li>
        <li>
          <strong>Zahlen sind überraschend kostspielig</strong> – Jede Ziffer in einer langen
          Zahl ist oft ein separates Token. Die Zahl „1738371600" kann 5–7 Token werden.
        </li>
        <li>
          <strong>Wiederholte Leerzeichen und Formatierung</strong> – JSON mit hübscher Einrückung,
          Markdown-Tabellen und Code mit tiefer Verschachtelung fügen alle Token durch Leerzeichen
          hinzu.
        </li>
      </ul>

      <h2>Nicht-englische Sprachen: Arabisch, Chinesisch und der Token-Kostenunterschied</h2>
      <p>
        Die Faustregel von 750 Wörtern pro 1.000 Token ist eine <em>englische</em> Faustregel.
        Für andere Sprachen kann das Verhältnis drastisch abweichen – und das hat echte
        Kostenauswirkungen für mehrsprachige Anwendungen.
      </p>
      <p>
        <strong>Arabisch und Hebräisch</strong> verwenden Wurzel-und-Muster-Morphologie, bei der
        eine einzelne Wurzel durch Präfixe, Suffixe und interne Vokalveränderungen Dutzende von
        abgeleiteten Formen generiert. Wörter wie „وسيستخدمونها" (sie werden es benutzen) sind
        einzelne orthografische Wörter, können aber zu 5–8 Token werden, da das BPE-Vokabular
        überwiegend mit englischen Daten trainiert wurde und diese arabischen Formen nicht als
        einzelne Token enthält.
      </p>
      <p>
        <strong>Chinesisch und Japanisch</strong> haben eine andere Herausforderung. Schriftzeichen
        sind logografisch – jedes Zeichen ist eine bedeutungsvolle Einheit –, aber das Token-Vokabular
        umfasst häufige Einzelzeichen und einige häufige mehrzeichige Wörter. Chinesischer Text
        erfordert typischerweise 1,5–2-mal mehr Token pro „Wortäquivalent" als Englisch. Japanisch
        mit seiner Mischung aus Hiragana, Katakana und Kanji kann noch höher liegen.
      </p>
      <p>
        Eine praktische Konsequenz: Wer eine Anwendung für Arabisch, Chinesisch oder andere
        nicht-lateinische Schriften baut, wird feststellen, dass Kostenschätzungen aus englischen
        Tests die tatsächlichen API-Kosten erheblich unterschätzen. Immer Token-Anzahlen mit
        dem tatsächlichen Inhalt über den{" "}
        <a href="/tools/token-counter">BrowseryTools Token-Zähler</a> oder eine Tokenizer-Bibliothek
        messen, bevor man Budgetprojektionen erstellt.
      </p>

      <h2>Kontextfenster-Limits: Warum das Überschreiten alles bricht</h2>
      <p>
        Jedes LLM hat ein <strong>Kontextfenster</strong> – die maximale Anzahl von Token, die es
        in einer einzigen Anfrage verarbeiten kann, sowohl Eingabe als auch Ausgabe eingerechnet.
        Stand Anfang 2026:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> – 128.000 Token</li>
        <li><strong>Claude 3.5 Sonnet</strong> – 200.000 Token</li>
        <li><strong>Gemini 1.5 Pro</strong> – 1.000.000 Token</li>
        <li><strong>Llama 3.1 70B</strong> – 128.000 Token</li>
      </ul>
      <p>
        Wenn die Eingabe das Kontextfenster-Limit überschreitet, gibt die API einen Fehler zurück –
        die Anfrage schlägt einfach fehl. Es gibt keine schrittweise Verschlechterung standardmäßig;
        das muss in der Anwendungslogik behandelt werden. Subtiler ist, dass es selbst innerhalb
        des Kontextfensters ein Phänomen namens „Lost in the Middle"-Problem gibt: Modelle erinnern
        sich tendenziell besser an Informationen am Anfang und Ende ihres Kontexts als an Informationen,
        die in der Mitte vergraben sind. Ein 200K-Kontextfenster bedeutet nicht, dass jedes Token
        darin gleich gut beachtet wird.
      </p>
      <p>
        In Chat-Anwendungen füllt sich das Kontextfenster mit wachsenden Gesprächen. Nach genug
        Turns muss man entweder alte Nachrichten kürzen, zusammenfassen oder auf das Limit stoßen
        und scheitern. Die Token-Anzahl bei jedem Schritt zu kennen ist das, was proaktive
        Entscheidungen ermöglicht.
      </p>

      <h2>Auswirkungen auf das Prompt-Design</h2>
      <p>
        Token-Bewusstsein verändert die Art und Weise, wie man Eingabeaufforderungen schreibt.
        Einige konkrete Auswirkungen:
      </p>
      <ul>
        <li>
          <strong>System-Eingabeaufforderungen kumulieren über jede Anfrage</strong> – Eine
          500-Token-System-Eingabeaufforderung kostet 500 × Anfragen × Eingabepreis. Bei
          10.000 täglichen Anfragen spart das Kürzen von 500 auf 300 Token jeden Monat echtes
          Geld.
        </li>
        <li>
          <strong>Few-Shot-Beispiele sind teuer, aber wirksam</strong> – Drei Beispiele in die
          Eingabeaufforderung aufzunehmen kann 300–500 Token hinzufügen. Messen, ob diese
          Qualitätsverbesserung die Kosten gegenüber einer einmaligen Modell-Feinabstimmung
          rechtfertigt.
        </li>
        <li>
          <strong>Ausgabelänge ist steuerbar</strong> – <code>max_tokens</code> verwenden, um
          die Modellausgabe zu begrenzen. Explizite Anweisungen in der Eingabeaufforderung
          hinzufügen: „Antworten Sie in weniger als 100 Wörtern." Modelle folgen generell gut
          Anweisungen zur Ausgabelänge, was die Ausgabe-Token-Kosten direkt senkt.
        </li>
        <li>
          <strong>JSON-Formatierung fügt Overhead hinzu</strong> – Bei strukturierter Ausgabe
          (JSON-Modus) fügen die Anführungszeichen, Klammern und Schlüsselnamen Token zusätzlich
          zu den eigentlichen Datenwerten hinzu. Eine Antwort mit 5 kurzen Feldern kann leicht
          40 % Formatierungs-Token-Overhead haben.
        </li>
      </ul>

      <h2>Token zählen, bevor man sendet</h2>
      <p>
        Die beste Gewohnheit beim Arbeiten mit LLM-APIs ist es, Token zu zählen, bevor man sich
        auf eine Architektur festlegt oder in Produktion geht. Die System-Eingabeaufforderung,
        eine repräsentative Nutzernachricht und jeden Kontext, den man einzuschließen plant, in
        den{" "}
        <a href="/tools/token-counter">BrowseryTools Token-Zähler</a> einfügen. Man sieht sofort,
        ob das Design gut im Kontextfenster liegt oder gefährlich nahe an dessen Grenze – und
        hat die Zahlen, die für eine genaue Kostenschätzung benötigt werden.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser Token-Zähler – Läuft im Browser, Keine Anmeldung
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Token-Zähler öffnen →
        </a>
      </div>
      <ToolCTA slug="token-counter" variant="card" />
    </div>
  );
}
