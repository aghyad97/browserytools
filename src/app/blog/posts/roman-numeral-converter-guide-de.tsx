export default function Content() {
  return (
    <div>
      <p>
        Römische Zahlen begegnen uns überall, sobald man Augen dafür hat: das Urheberrechtsjahr am
        Ende eines Films, die Kapitelnummern in einem Buch, Super-Bowl-Titel, Zifferblätter,
        das &ldquo;MMXXVI&rdquo; auf einem Grundstein. Sie sind elegant, aber lesen und schreiben ist
        nicht intuitiv — kurz: Was ist <strong>MCMXCIV</strong>? Dieser Leitfaden erklärt genau,
        wie römische Zahlen funktionieren, die Regeln, über die man stolpert, und wie man beliebige
        Zahlen in beide Richtungen sofort umrechnet.
      </p>
      <p>
        Wenn Sie nur die Antwort brauchen, wandelt der{" "}
        <a href="/tools/roman-numeral">BrowseryTools Römische-Zahlen-Umrechner</a> Zahlen in
        römische Zahlen und zurück in Ihrem Browser um — kostenlos, ohne Anmeldung, nichts wird
        hochgeladen. Lesen Sie weiter, um zu verstehen, wie das System tatsächlich funktioniert,
        damit Sie jedes Ergebnis selbst überprüfen können.
      </p>

      <h2>Die sieben Symbole</h2>
      <p>
        Das gesamte System besteht aus nur sieben Buchstaben, von denen jeder einen festen Wert hat:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Jede römische Zahl ist eine bestimmte Anordnung dieser sieben Symbole. Es gibt keine Null
        und kein Symbol für negative Zahlen — das System wurde zum Zählen und Beschriften entwickelt,
        nicht für Arithmetik.
      </p>

      <h2>Die zwei Regeln, die alles bestimmen</h2>
      <p>
        <strong>Regel 1 — Addieren, wenn Symbole absteigen.</strong> Wenn ein Symbol mit gleichem
        oder kleinerem Wert auf ein größeres folgt, werden sie addiert. Also ist <code>VI</code>
        5 + 1 = 6, <code>XV</code> ist 10 + 5 = 15, und <code>MDC</code> ist 1000 + 500 + 100 =
        1600. Sie lesen von links nach rechts und führen eine laufende Summe.
      </p>
      <p>
        <strong>Regel 2 — Subtrahieren, wenn ein kleineres Symbol einem größeren vorangeht.</strong>{" "}
        Einen kleineren Wert <em>vor</em> einen größeren zu stellen bedeutet Subtraktion.{" "}
        <code>IV</code> ist 5 &minus; 1 = 4, <code>IX</code> ist 10 &minus; 1 = 9, <code>XL</code>{" "}
        ist 50 &minus; 10 = 40, und <code>CM</code> ist 1000 &minus; 100 = 900. Diese subtraktive
        Notation ist der Grund, warum römische Zahlen die viermalige Wiederholung wie IIII vermeiden.
      </p>
      <p>
        Nur sechs subtraktive Paare sind gültig: <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400) und <code>CM</code> (900).
        Man subtrahiert nur Zehnerpotenzen (I, X, C), und nur von der nächsthöheren oder
        übernächsten Stufe.
      </p>

      <h2>So liest man MCMXCIV (die schwierige)</h2>
      <p>
        Zerlegen Sie sie von links nach rechts in subtraktive und additive Blöcke:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        Also: <strong>MCMXCIV = 1994</strong>. Sobald Sie die vier subtraktiven Blöcke erkennen
        können, lassen sich selbst lange Zahlen schnell entschlüsseln.
      </p>

      <h2>So schreibt man eine Zahl als römische Zahl</h2>
      <p>
        Bearbeiten Sie eine Stelle nach der anderen, von den Tausendern bis zu den Einern, und
        schreiben Sie jede Stelle mit ihren Symbolen:
      </p>
      <p>
        Nehmen Sie <strong>2026</strong>. Tausender: 2 &rarr; <code>MM</code>. Hunderter: 0 &rarr;
        nichts. Zehner: 2 &rarr; <code>XX</code>. Einer: 6 &rarr; <code>VI</code>. Zusammengesetzt:{" "}
        <strong>MMXXVI</strong>. Nehmen Sie <strong>49</strong>: Zehner 4 &rarr; <code>XL</code>,
        Einer 9 &rarr; <code>IX</code>, ergibt <strong>XLIX</strong> — eine gute Erinnerung, dass
        49 <em>nicht</em> IL ist, weil man nur von der nächsthöheren oder übernächsten Stufe
        subtrahieren darf.
      </p>

      <h2>Häufige Fehler</h2>
      <p>
        <strong>Ein Symbol viermal wiederholen.</strong> 4 ist <code>IV</code>, nicht{" "}
        <code>IIII</code>; 40 ist <code>XL</code>, nicht <code>XXXX</code>. (Zifferblätter sind
        eine kuriose Ausnahme, die oft IIII für die 4 aus optischen Gründen verwenden.)
      </p>
      <p>
        <strong>Unzulässige Subtraktionen.</strong> 99 ist <code>XCIX</code> (90 + 9), nicht{" "}
        <code>IC</code>. Man darf I nicht von C subtrahieren. Halten Sie sich an die sechs gültigen
        Paare.
      </p>
      <p>
        <strong>Zahlen über 3999.</strong> Standard-römische Zahlen enden bei 3999 (MMMCMXCIX).
        Größere Werte wurden historisch mit einem Balken über dem Buchstaben angegeben, um mit 1000
        zu multiplizieren, wird aber heute selten benötigt.
      </p>

      <h2>Wo man römische Zahlen heute noch sieht</h2>
      <p>
        Urheberrechtsjahre bei Film- und TV-Produktionen, Buchkapitel und Seitenpräfixe,
        Herrscher- und Papst-Namen (Elisabeth II., Benedikt XVI.), der Super Bowl, Olympische
        Spiele, Ziffernblätter von Uhren, Grundsteine von Gebäuden und Gliederungsnummerierungen.
        Die Regeln zu kennen verwandelt all das von einem Rätsel in eine sofortige Lesbarkeit.
      </p>

      <h2>Häufig gestellte Fragen</h2>
      <p>
        <strong>Wie schreibt man 0 in römischen Zahlen?</strong> Gar nicht — das System hat kein
        Symbol für null. Mittelalterliche Gelehrte verwendeten manchmal das Wort <em>nulla</em>
        stattdessen.
      </p>
      <p>
        <strong>Was ist die größte Standard-Römische Zahl?</strong> 3999, geschrieben MMMCMXCIX.
      </p>
      <p>
        <strong>Warum verwenden Uhren IIII statt IV?</strong> Aus Tradition und optischer Symmetrie;
        es balanciert die VIII auf der gegenüberliegenden Seite. Es ist eine stilistische Ausnahme,
        nicht die Standardregel.
      </p>
      <p>
        <strong>Kann ich in beide Richtungen umrechnen?</strong> Ja — der{" "}
        <a href="/tools/roman-numeral">Umrechner</a> konvertiert von Zahlen zu Zahlzeichen und von
        Zahlzeichen zurück zu Zahlen.
      </p>

      <h2>Sofort umrechnen</h2>
      <p>
        Öffnen Sie den <a href="/tools/roman-numeral">Römische-Zahlen-Umrechner</a>, um beliebige
        Zahlen in beide Richtungen zu übersetzen — praktisch zum Entschlüsseln eines Urheberrechtsjahrs
        oder zum Schreiben eines Tattoos, Titels oder Grundsteins. Auf BrowseryTools gibt es außerdem
        einen{" "}
        <a href="/tools/calculator">wissenschaftlichen Taschenrechner</a> und einen{" "}
        <a href="/tools/percentage-calculator">Prozentrechner</a> für die Mathematik, die die Römer
        nie entwickelt haben.
      </p>
    </div>
  );
}
