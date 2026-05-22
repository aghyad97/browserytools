export default function Content() {
  return (
    <div>
      <p>
        Jeder Text ist ein Fingerabdruck. Die Wörter, zu denen ein Autor am häufigsten greift, die
        Begriffe, die sich in einem Dokument häufen, die Phrasen, die sich wiederholen, ohne dass
        der Schreiber es bemerkt — diese Muster enthüllen Struktur, Schwerpunkte und Gewohnheiten
        auf eine Weise, die ein einfaches Lesen vollständig verpasst. Wortfrequenzanalyse ist die
        Technik, die diese Muster sichtbar macht, und sie ist in einem überraschend breiten Spektrum
        von Bereichen nützlich: Schreibhandwerk, SEO, akademische Forschung und sogar Forensik.
      </p>
      <p>
        Sie können die Wortfrequenz jedes Textes sofort mit dem{" "}
        <a href="/tools/word-frequency">BrowseryTools Wortfrequenz-Analysator</a> analysieren —
        kostenlos, ohne Anmeldung, alles läuft in Ihrem Browser.
      </p>

      <h2>Was Wortfrequenzanalyse aufdeckt</h2>
      <p>
        Im Kern zählt Wortfrequenzanalyse, wie oft jedes Wort in einem Text vorkommt, und ordnet die
        Ergebnisse. Die dadurch gewonnenen Erkenntnisse sind jedoch reicher als diese Beschreibung
        vermuten lässt:
      </p>
      <ul>
        <li><strong>Themenidentifikation</strong> — die häufigsten inhaltlichen Wörter (nach dem Entfernen häufiger Funktionswörter) verraten, worum es in einem Dokument hauptsächlich geht</li>
        <li><strong>Schreibmuster</strong> — Frequenzanalyse deckt Wörter auf, die ein Autor gewohnheitsmäßig übermäßig verwendet, oft unbewusst</li>
        <li><strong>Schlüsselwortdichte</strong> — im SEO-Bereich ist die Häufigkeit von Zielschlüsselwörtern relativ zur Gesamtwortanzahl ein aussagekräftiges Signal</li>
        <li><strong>Vokabularreichtum</strong> — das Verhältnis von einzigartigen Wörtern zu Gesamtwörtern (Type-Token-Verhältnis) ist ein grober Maßstab für lexikalische Vielfalt</li>
        <li><strong>Autorschaftssignale</strong> — Funktionswortfrequenzen (wie oft ein Autor „der/die/das" vs. „ein/eine" oder „jedoch" vs. „aber" verwendet) sind überraschend individuell und konsistent</li>
      </ul>

      <h2>Stoppwörter und warum sie gefiltert werden</h2>
      <p>
        Wenn Sie eine rohe Wortfrequenzanalyse bei fast jedem englischen Text durchführen, werden die
        Top-Ergebnisse nahezu identisch sein: „the", „a", „and", „of", „to", „in", „is", „that".
        Das sind Stoppwörter — hochfrequente Funktionswörter, die grammatische Struktur tragen, aber
        wenig semantische Bedeutung. Ihre Häufigkeit sagt kaum etwas darüber aus, worum es in einem
        Dokument geht.
      </p>
      <p>
        Stoppwort-Filterung entfernt diese Begriffe vor der Analyse und hinterlässt nur die
        inhaltlichen Wörter, die tatsächlich Bedeutung vermitteln. Die Stoppwortliste für Englisch
        umfasst typischerweise:
      </p>
      <ul>
        <li>Artikel: a, an, the</li>
        <li>Präpositionen: of, in, at, by, for, with, about, against, between, through</li>
        <li>Konjunktionen: and, but, or, nor, so, yet, for</li>
        <li>Pronomen: I, you, he, she, it, we, they, them, their</li>
        <li>Hilfsverben: is, are, was, were, be, been, have, has, had, do, does, did, will, would, can, could</li>
      </ul>
      <p>
        Verschiedene Anwendungen benötigen unterschiedliche Stoppwortlisten. Für SEO-Analysen
        möchten Sie möglicherweise „how", „what", „best" und „top" als Stoppwörter aufnehmen, da
        sie in fast jedem Artikel vorkommen. Für die Autorschaftsanalyse möchten Sie genau die
        Funktionswörter — die konventionellen Stoppwörter — weil das die stabilen stilistischen
        Fingerabdrücke sind.
      </p>

      <h2>TF-IDF: Wenn rohe Frequenz nicht ausreicht</h2>
      <p>
        Rohe Termfrequenz hat ein Problem: Einige Wörter erscheinen häufig in einem Dokument,
        einfach weil sie häufig in allen Dokumenten dieses Typs erscheinen. Wenn Sie
        Technologieartikel analysieren, erscheinen Wörter wie „Software", „Daten" und „System" in
        jedem Artikel mit hoher Frequenz — sie sind nicht nützlich, um zu unterscheiden, was einen
        bestimmten Artikel einzigartig macht.
      </p>
      <p>
        TF-IDF (Term Frequency — Inverse Document Frequency) behebt dies, indem die Häufigkeit
        jedes Begriffs gegen seine Häufigkeit in einer Dokumentensammlung gewichtet wird. Die Formel
        lautet:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`TF-IDF(term, document) = TF(term, document) × IDF(term, corpus)

TF = count(term in document) / total words in document
IDF = log(total documents / documents containing term)`}
      </pre>
      <p>
        Ein Begriff, der häufig in einem Dokument, aber selten in anderen erscheint, erhält einen
        hohen TF-IDF-Wert — er ist ein charakteristischer Begriff für dieses Dokument. Ein Begriff,
        der überall häufig vorkommt, erhält einen niedrigen TF-IDF-Wert. Deshalb verwenden
        Suchmaschinen TF-IDF als Kernsignal für Relevanz: Eine Seite, die „Mykorrhiza-Pilze" häufig
        verwendet, handelt wirklich von Mykorrhiza-Pilzen, während eine Seite, die häufig „der/die/das"
        verwendet, nichts Spezifisches beschreibt.
      </p>

      <h2>Anwendungsfälle für Autoren</h2>
      <p>
        Wortfrequenzanalyse ist eines der praktischsten Selbstlektorats-Tools für Autoren. Sie
        externalisiert Muster, die beim Schreiben nahezu unsichtbar sind:
      </p>
      <ul>
        <li>
          <strong>Überbenutzte Wörter aufdecken</strong> — die meisten Autoren haben unbewusste
          Lieblingswörter. Das Ausführen einer Frequenzanalyse bei einem ersten Entwurf zeigt oft,
          dass ein Wort wie „bedeutsam", „eindeutig" oder „wichtig" unverhältnismäßig oft erscheint.
          Die Zahl zu sehen ist ein stärkerer Anreiz, den Wortschatz zu variieren als jeder
          allgemeine Rat über Wortwiederholung.
        </li>
        <li>
          <strong>Sprachliche Tics finden</strong> — Übergangsphrasen wie „mit anderen Worten",
          „wie wir sehen können" oder „es sei darauf hingewiesen" erscheinen oft viel häufiger, als
          der Autor merkt. Die Frequenzanalyse macht sie für gezielte Überarbeitung sichtbar.
        </li>
        <li>
          <strong>Fokus prüfen</strong> — wenn die häufigsten Wörter in Ihrem Artikel nicht dem
          Thema entsprechen, über das Sie schreiben wollten, ist der Entwurf möglicherweise
          abgedriftet.
        </li>
        <li>
          <strong>Vokabularniveau bewerten</strong> — der Vergleich der Frequenzverteilung einfacher
          vs. komplexer Wörter gibt ein grob Signal über das Leseniveau.
        </li>
      </ul>
      <p>
        Versuchen Sie, einen eigenen Textentwurf in den{" "}
        <a href="/tools/word-frequency">BrowseryTools Wortfrequenz-Analysator</a> einzufügen. Die
        20 häufigsten inhaltlichen Wörter nach Stoppwort-Filterung sollten die Kernkonzepte des
        Textes genau widerspiegeln. Wenn nicht, braucht der Entwurf wahrscheinlich strukturelle Arbeit.
      </p>

      <h2>SEO-Anwendungen</h2>
      <p>
        Für Content-Marketer und SEO-Experten erfüllt Wortfrequenzanalyse mehrere Funktionen:
      </p>
      <ul>
        <li>
          <strong>Schlüsselwortdichte-Analyse</strong> — prüfen, dass Zielschlüsselwörter mit einer
          bedeutsamen, aber natürlichen Häufigkeit erscheinen. Es gibt keinen magischen Prozentsatz,
          aber extremes Keyword-Stuffing (dieselbe Phrase 50 Mal in einem 1.000-Wörter-Artikel) ist
          sowohl unleserlich als auch von Suchmaschinen abgestraft, während ein Zielschlüsselwort,
          das nie erscheint, ein verpasstes Signal ist.
        </li>
        <li>
          <strong>Wettbewerbsinhaltsanalyse</strong> — die Wortfrequenz von Top-Ranking-Seiten für
          ein bestimmtes Schlüsselwort zu analysieren zeigt, welche verwandten Begriffe und Konzepte
          konsistent in gut rankenden Inhalten erscheinen. Das ist die Basis des Topic-Modelings
          für SEO.
        </li>
        <li>
          <strong>Content-Gap-Identifikation</strong> — der Vergleich der Wortfrequenz Ihrer Seite
          mit der eines Wettbewerbers zeigt, welche semantischen Bereiche dieser abdeckt, die Sie
          nicht abdecken.
        </li>
        <li>
          <strong>Titel- und Überschriften-Optimierung</strong> — die Analyse, welche Wörter in
          den Überschriften (H1, H2, H3) von Top-Ranking-Seiten erscheinen, gibt direkte Einblicke,
          wie Suchmaschinen die Dokumentstruktur interpretieren.
        </li>
      </ul>

      <h2>Akademische und Forschungsanwendungen</h2>
      <p>
        Wortfrequenzanalyse hat eine lange Geschichte in der akademischen Forschung, insbesondere in
        der Linguistik, Literaturwissenschaft und den Digital Humanities:
      </p>
      <ul>
        <li>
          <strong>Autorschaftsattribution</strong> — Funktionswortfrequenzen sind so stabil und
          individuell, dass sie den Schreibstil eines Autors über verschiedene Werke hinweg zuverlässig
          identifizieren können. Diese Technik wurde verwendet, um umstrittene historische Texte
          zuzuordnen und in Gerichtsverfahren mit anonymen Dokumenten.
        </li>
        <li>
          <strong>Plagiatserkennung</strong> — Frequenzanalyse ungewöhnlicher Wortwahlen und seltener
          Phrasen kann Passagen identifizieren, die eine gemeinsame Quelle haben, auch wenn der
          Oberflächentext umformuliert wurde.
        </li>
        <li>
          <strong>Korpuslinguistik</strong> — die Analyse von Wortfrequenzen über Millionen von
          Dokumenten hinweg zeigt, wie sich Sprache im Laufe der Zeit verändert, welche Begriffe
          im Aufschwung oder Rückgang sind und wie verschiedene Gemeinschaften Sprache unterschiedlich
          verwenden. Googles Ngram-Viewer wendet diese Technik auf Millionen digitalisierter Bücher an.
        </li>
        <li>
          <strong>Sentiment- und Themen-Modellierung</strong> — Frequenzanalyse emotional wertender
          Wörter (positive/negative Sentiment-Lexika) bietet einen einfachen, aber nützlichen
          Näherungswert für Sentiment in großen Textmengen wie Kundenbewertungen oder
          Social-Media-Posts.
        </li>
      </ul>

      <h2>Wie man mit Frequenzdaten umgeht</h2>
      <p>
        Frequenzdaten sind nur nützlich, wenn sie zu Maßnahmen führen. Ein praktischer Workflow:
      </p>
      <ul>
        <li><strong>Beim Schreiben</strong> — identifizieren Sie die fünf meistüberbenutzen Wörter, dann suchen und ersetzen Sie jede Instanz mit Suchen-und-Ersetzen und entscheiden Sie bewusst, ob Sie sie behalten, variieren oder entfernen</li>
        <li><strong>Für SEO</strong> — vergleichen Sie die Top-20-Inhaltswörter Ihrer Seite mit denen der drei am höchsten rankenden Wettbewerber; ergänzen Sie Abdeckung für Konzepte, die bei diesen erscheinen, aber nicht bei Ihnen</li>
        <li><strong>Für Forschung</strong> — exportieren Sie Frequenzdaten in eine Tabelle und sortieren Sie nach Häufigkeit, um sowohl die häufigsten Begriffe (die Kernthemen des Dokuments) als auch die seltensten einzigartigen Begriffe (den charakteristischen Wortschatz des Dokuments) zu finden</li>
        <li><strong>Beim Lektorat</strong> — achten Sie besonders auf Abschwächungssprache („etwas", „ziemlich", „relativ", „recht") und leere Verstärker („sehr", „wirklich", „äußerst") — eine hohe Frequenz dieser ist ein zuverlässiges Signal, dass der Text gestrafft werden muss</li>
      </ul>
    </div>
  );
}
