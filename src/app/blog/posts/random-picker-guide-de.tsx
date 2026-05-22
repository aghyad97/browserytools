export default function Content() {
  return (
    <div>
      <p>
        Ab und zu braucht man eine unparteiische Entscheidungsinstanz. Wer bezahlt das Mittagessen?
        Welcher Name gewinnt das Gewinnspiel? In welcher Reihenfolge präsentiert das Team? Wer fängt
        beim Brettspiel an? Ein Würfel, eine Münze aus der Tasche oder auf Zettel geschriebene Namen
        funktionieren — aber es ist langsam, leicht zu manipulieren und man hat selten eine Münze
        dabei. Ein{" "}
        <a href="/tools/random-picker">Zufalls-Picker</a> im Browser löst all das in einem Tab.
      </p>
      <p>
        Der BrowseryTools <strong>Zufalls-Picker</strong> bündelt vier klassische Zufallsgeneratoren
        auf einer Seite: einen <strong>Zufallszahlengenerator</strong>, einen{" "}
        <strong>Würfelwerfer</strong>, einen <strong>Münzwurf</strong> und einen{" "}
        <strong>zufälligen Namenspicker</strong> (Roulette-Stil) für Verlosungen und Gewinnspiele.
        Alles läuft lokal in Ihrem Browser — kein Server entscheidet das Ergebnis, kein Konto, keine
        Werbung. Dieser Leitfaden erklärt jeden Modus und die kleinen Details, die einen
        Zufalls-Picker tatsächlich fair machen.
      </p>

      <h2>Der Zufallszahlengenerator</h2>
      <p>
        Der häufigste Wunsch ist auch der einfachste: Gib mir eine Zahl zwischen X und Y. Der
        Zufallszahlengenerator lässt Sie ein <strong>Minimum</strong> und ein{" "}
        <strong>Maximum</strong> festlegen, wählen, <strong>wie viele</strong> Zahlen Sie auf einmal
        möchten, und entscheiden, ob Duplikate erlaubt sind. Dieser letzte Schalter ist wichtiger,
        als man erwartet. Wenn Sie drei Lotteriescheine aus hundert ziehen, möchten Sie fast
        sicher eindeutige Zahlen — Schein 47 soll nicht zweimal gewinnen. Wenn Sie Würfel simulieren
        oder Testdaten generieren, sind Duplikate in Ordnung und zu erwarten.
      </p>
      <p>
        Unter der Haube verwendet das Tool das <code>crypto.getRandomValues</code>-Primitiv des
        Browsers mit Rejection Sampling, das den subtilen Modulo-Bias vermeidet, den naiver{" "}
        <code>Math.random() * Bereich</code>-Code einführt. In einfachen Worten: Jede Zahl in Ihrem
        Bereich hat eine wirklich gleiche Chance aufzutauchen, nicht eine leicht verzerrte. Für eine
        gelegentliche Auswahl ist dieser Unterschied unsichtbar, aber für alles, bei dem Fairness in
        Frage gestellt wird — ein öffentliches Gewinnspiel, eine bezahlte Verlosung — ist es der
        Unterschied zwischen vertretbar und fragwürdig.
      </p>

      <h2>Der Würfelwerfer</h2>
      <p>
        Tisch- und Rollenspiele stehen und fallen mit Würfeln, und physische Würfel haben die
        Angewohnheit, genau dann vom Tisch zu rollen oder verloren zu gehen, wenn man sie braucht.
        Der Würfelwerfer unterstützt das vollständige polyedrische Set — W4, W6, W8, W10, W12 und
        W20 — und lässt Sie viele davon auf einmal werfen, die klassische <em>2W6</em>- oder{" "}
        <em>4W6</em>-Notation. Jeder Würfel wird einzeln angezeigt, damit Sie die Verteilung sehen
        können, und die Gesamtsumme wird automatisch addiert. Kein Kopfrechnen, kein Streit darüber,
        ob der Würfel auf einer 5 oder 6 gelandet ist.
      </p>
      <p>
        Da die Würfe dieselbe kryptografisch taugliche Zufälligkeit wie der Zahlengenerator
        verwenden, ist ein digitaler W20 genauso fair wie ein physischer — sogar fairer, da echte
        Würfel selten perfekt ausgewogen sind. Initiative würfeln, Schaden würfeln, eine schnelle
        W100-Prozentwürfung — alles aus demselben Tab.
      </p>

      <h2>Der Münzwurf</h2>
      <p>
        Manchmal braucht man nur ein Ja oder Nein, und nichts entscheidet eine binäre Wahl schneller
        als eine Münze. Der Münzwurf-Modus zeigt eine kurze Drehanimation und landet auf Kopf oder
        Zahl und führt dabei eine <strong>laufende Strichliste</strong> beider. Die Strichliste ist
        hier das unterschätzte Feature: wenn Sie ein Bestes-aus-Sieben austragen oder einfach
        beobachten möchten, wie das Gesetz der großen Zahlen langsam eine 50/50-Verteilung
        annähert, ist die Zählung sofort sichtbar. Zurücksetzen, wann immer Sie einen neuen Wettbewerb
        beginnen.
      </p>

      <h2>Der zufällige Namenspicker (Roulette)</h2>
      <p>
        Das ist der Modus, den die meisten teilen. Fügen Sie eine Namensliste ein — einen pro Zeile
        — und der Picker wählt mit einer kurzen Drehanimation zur Spannung einen zufälligen Gewinner
        aus. Er ist gebaut für{" "}
        <strong>Gewinnspiele, Kaltabfragen im Unterricht, Team-Standups und Verlosungen</strong>.
        Fügen Sie Ihre Instagram-Kommentatoren, Ihre Schüler, Ihre Verlosungsteilnehmer ein und
        lassen Sie das Tool die Wahl treffen, damit niemand Sie der Bevorzugung beschuldigen kann.
      </p>
      <p>
        Die wichtige Option für Verlosungen ist <strong>&quot;Gewinner nach der Auswahl entfernen.&quot;</strong>{" "}
        Schalten Sie es ein, und jeder gewählte Name wird aus der Liste entfernt, sodass Sie eine
        Mehrfachpreis-Verlosung durchführen können — erster Platz, zweiter Platz, dritter Platz —
        ohne dass dieselbe Person zweimal gewinnt. Schalten Sie es aus und die vollständige Liste
        bleibt für wiederholte Einzelauswahlen erhalten. Ein Zähler zeigt nach jeder Auswahl an,
        wie viele Einträge noch verbleiben.
      </p>

      <h2>Warum ein Browser-Tool besser ist als eine App</h2>
      <p>
        Dedizierte Randomizer-Apps und Roulette-Websites existieren, aber die meisten sind unter
        Werbung begraben, fordern eine Anmeldung oder führen die Zufälligkeit auf einem Server durch,
        den Sie nicht einsehen können. Der BrowseryTools Zufalls-Picker ist das Gegenteil: eine
        einzelne statische Seite, die ihre Arbeit vollständig auf Ihrem Gerät erledigt. Nichts, was
        Sie eintippen — nicht Ihre Gewinnspielteilnehmer, nicht die Namen Ihrer Schüler — verlässt
        je Ihren Browser. Sie können jedes Ergebnis in die Zwischenablage kopieren, die Seite als
        Lesezeichen speichern oder die URL mit einem Kollegen teilen, der denselben fairen Münzwurf
        benötigt.
      </p>

      <h2>Jetzt ausprobieren</h2>
      <p>
        Ob Sie eine schnelle Zufallszahl, einen fairen W20, eine Münze zur Streitbeilegung oder
        einen Namenspicker für Ihr nächstes Gewinnspiel brauchen — der{" "}
        <a href="/tools/random-picker">Zufalls-Picker</a> hat alles an einem Ort — kostenlos, privat
        und sofort. Keine Installation, keine Konten, kein Haken.
      </p>
    </div>
  );
}
