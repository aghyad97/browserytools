import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Wenn Sie eine Nachricht in eine Notizen-App oder ein Webformular eingeben, wo geht sie hin?
        In den meisten Fällen gelangt der Text zu einem Server, wird in einer Datenbank gespeichert
        und kann potenziell von jedem mit Datenbankzugriff gelesen werden — von Mitarbeitern des
        Unternehmens, einem Datenpanne-Angreifer oder einer behördlichen Anfrage. Clientseitige
        Verschlüsselung ist der technische Ansatz, der diese Gleichung verändert: Ihre Daten werden
        verschlüsselt, bevor sie Ihr Gerät verlassen, sodass selbst der Server, der sie speichert,
        sie nicht lesen kann.
      </p>
      <ToolCTA slug="text-encryption" variant="inline" />
      <p>
        Sie können jeden Text direkt in Ihrem Browser mit dem{" "}
        <a href="/tools/text-encryption">BrowseryTools Text-Verschlüsselungs-Tool</a> verschlüsseln
        und entschlüsseln — kostenlos, ohne Anmeldung, Ihre Daten verlassen niemals Ihr Gerät.
      </p>

      <h2>Was clientseitige Verschlüsselung wirklich bedeutet</h2>
      <p>
        Clientseitige Verschlüsselung bedeutet, dass die kryptografischen Operationen (Verschlüsseln
        und Entschlüsseln von Daten) auf dem Gerät des Nutzers stattfinden — im Browser, in einer
        mobilen App oder in einer Desktop-Anwendung — bevor Daten übertragen oder gespeichert werden.
        Der Server erhält nur Chiffretext: eine unleserliche, verschlüsselte Bytefolge, die
        mathematisch wertlos ist ohne den Entschlüsselungsschlüssel.
      </p>
      <p>
        Das unterscheidet sich wesentlich von serverseitiger Verschlüsselung (auch „Encryption at
        Rest" genannt), bei der der Server Ihre Klartextdaten empfängt und sie dann zur Speicherung
        mit Schlüsseln verschlüsselt, die der Server selbst kontrolliert. In diesem Modell kann der
        Dienstanbieter Ihre Daten jederzeit entschlüsseln. Bei clientseitiger Verschlüsselung kann
        nur jemand, der den Schlüssel besitzt — der niemals Ihr Gerät verlässt — die Daten lesen.
      </p>
      <p>
        Die praktische Konsequenz: Wenn jemand in den Server einbricht und die verschlüsselten Daten
        stiehlt, hat er nichts Verwendbares. Der Chiffretext erfordert den Schlüssel zur
        Entschlüsselung, und der Schlüssel war nie auf dem Server.
      </p>

      <h2>Symmetrische vs. asymmetrische Verschlüsselung</h2>
      <p>
        Es gibt zwei grundlegende Ansätze zur Verschlüsselung, die unterschiedlichen Zwecken dienen.
      </p>
      <ul>
        <li>
          <strong>Symmetrische Verschlüsselung (AES)</strong> — ein Schlüssel verschlüsselt die
          Daten, und derselbe Schlüssel entschlüsselt sie. Schnell, effizient und geeignet für
          die Verschlüsselung großer Datenmengen. Die Herausforderung ist die Schlüsselverteilung:
          Wie teilen Sie den Schlüssel sicher mit demjenigen, der die Daten entschlüsseln muss?
          Für den persönlichen Gebrauch (eigene Notizen verschlüsseln) ist symmetrische
          Verschlüsselung ideal — Sie halten den einzigen Schlüssel. AES (Advanced Encryption
          Standard) ist der dominante symmetrische Algorithmus.
        </li>
        <li>
          <strong>Asymmetrische Verschlüsselung (RSA, ECDH)</strong> — zwei mathematisch verbundene
          Schlüssel: ein öffentlicher Schlüssel, den jeder zur Datenverschlüsselung verwenden kann,
          und ein privater Schlüssel, den nur der Inhaber besitzt und zur Entschlüsselung verwendet.
          Löst das Problem der Schlüsselverteilung — Sie können Ihren öffentlichen Schlüssel offen
          teilen. Viel langsamer als symmetrische Verschlüsselung für große Daten. Die meisten
          Systeme in der Praxis verwenden asymmetrische Verschlüsselung nur zum Austausch eines
          symmetrischen Schlüssels und wechseln dann für die Massendaten zu AES. So funktioniert
          TLS (HTTPS).
        </li>
      </ul>

      <h2>Warum AES-256 der Standard ist</h2>
      <p>
        AES-256 bedeutet AES mit einem 256-Bit-Schlüssel. Die 256-Bit-Schlüsselgröße bedeutet, es
        gibt 2<sup>256</sup> mögliche Schlüssel — eine Zahl so groß, dass Brute-Force-Angriffe mit
        keiner existierenden oder theoretisch möglichen Technologie mit klassischen Computern
        machbar sind. Zum Vergleich: Wenn jedes Atom im beobachtbaren Universum ein Computer wäre,
        der eine Milliarde Schlüssel pro Sekunde prüft, würde es länger als das Alter des Universums
        dauern, alle 2<sup>256</sup> Schlüssel zu erschöpfen.
      </p>
      <p>
        AES ist auch ein NIST-Standard (US National Institute of Standards and Technology), wurde
        jahrzehntelang intensiv kryptoanalysiert, ohne dass praktische Schwächen im Algorithmus
        selbst gefunden wurden, und verfügt über Hardware-Beschleunigung (AES-NI-Anweisungen) in
        praktisch jeder modernen CPU — was ihn sowohl zur sichersten als auch zur schnellsten
        verfügbaren Option macht. AES-GCM (Galois/Counter-Modus) ist die empfohlene Variante, da
        sie sowohl Verschlüsselung als auch Authentifizierung bietet (erkennt, ob der Chiffretext
        manipuliert wurde).
      </p>

      <h2>Schlüsselableitung aus Passwörtern</h2>
      <p>
        AES-256 benötigt einen 256-Bit-(32-Byte-)Schlüssel. Vom Menschen gewählte Passwörter sind
        keine 32 zufälligen Bytes — sie sind kurze Zeichenketten mit Mustern und begrenzten
        Zeichensätzen. Ein Passwort direkt als AES-Schlüssel zu verwenden wäre katastrophal unsicher.
        Schlüsselableitungsfunktionen (KDFs) überbrücken diese Lücke.
      </p>
      <p>
        Eine KDF nimmt ein Passwort und erzeugt einen kryptografisch starken Schlüssel beliebiger
        gewünschter Länge. Die drei wichtigsten KDFs sind:
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong> — wendet eine
          HMAC-Funktion tausende oder hunderttausende Male (Iterationen) auf das Passwort an. Mehr
          Iterationen bedeuten mehr Rechenaufwand für einen Angreifer, der das Passwort per
          Brute-Force knacken will. PBKDF2 ist die am weitesten unterstützte KDF und wird in
          WPA2-WLAN-Sicherheit, iOS-Geräteverschlüsselung und vielen Web-Authentifizierungssystemen
          verwendet.
        </li>
        <li>
          <strong>bcrypt</strong> — speziell für Passwort-Hashing mit bewusst langsamer Berechnung
          entwickelt. Hat einen „Kostenfaktor", der steuert, wie langsam sie ist. Weit verbreitet zur
          Speicherung von Benutzerpasswörtern in Datenbanken, aber typischerweise nicht zur Ableitung
          von AES-Schlüsseln verwendet.
        </li>
        <li>
          <strong>scrypt</strong> — fügt zu den Rechenkosten Memory-Hardness hinzu. Ein Angreifer
          mit spezieller Hardware (ASICs oder GPUs) kann PBKDF2 günstig parallel laufen lassen;
          scrypt erfordert so viel Speicher pro Berechnung, dass parallele Angriffe teuer werden.
          In einigen Kryptowährungssystemen und neueren Sicherheitsanwendungen verwendet.
        </li>
      </ul>
      <p>
        Alle guten Verschlüsselungssysteme verwenden auch einen <strong>Salt</strong> — einen
        Zufallswert, der mit dem Passwort vor der Schlüsselableitung kombiniert wird, sodass zwei
        Benutzer mit demselben Passwort unterschiedliche Schlüssel erzeugen und vorberechnete
        „Rainbow-Table"-Angriffe vereitelt werden.
      </p>

      <h2>Was „kein Server sieht Ihre Daten" wirklich bedeutet</h2>
      <p>
        Wenn ein Tool behauptet „kein Server sieht Ihre Daten", bedeutet das, dass der Klartext
        niemals Ihren Browser verlässt. Das in Ihrem Browser laufende JavaScript führt die
        Verschlüsselung lokal durch, und nur der Chiffretext (die verschlüsselte Ausgabe) würde
        jemals übertragen — und nur, wenn Sie sich dafür entscheiden.
      </p>
      <p>
        Das <a href="/tools/text-encryption">BrowseryTools Text-Verschlüsselungs-Tool</a> geht
        weiter: Es wird überhaupt nichts übertragen. Die gesamte Operation ist lokal. Sie können
        das überprüfen, indem Sie die Developer Tools Ihres Browsers öffnen, zur
        Netzwerk-Registerkarte wechseln und beobachten, dass beim Verschlüsseln oder Entschlüsseln
        keine Anfragen gestellt werden. Das Tool verwendet die Web Crypto API — eine
        browsereigene kryptografische Bibliothek, die in jeden modernen Browser eingebaut ist —
        was bedeutet, die Kryptografie ist kein benutzerdefinierter JavaScript-Code; es ist dieselbe
        vertrauenswürdige Implementierung, die Ihr Browser für HTTPS-Verbindungen verwendet.
      </p>

      <h2>Häufige Missverständnisse über Browser-Verschlüsselung</h2>
      <ul>
        <li>
          <strong>„HTTPS verschlüsselt bereits alles"</strong> — HTTPS verschlüsselt Daten bei der
          Übertragung zwischen Ihrem Browser und dem Server. Sobald die Daten den Server erreichen,
          werden sie entschlüsselt und als Klartext gespeichert (oder mit serverseitig kontrollierten
          Schlüsseln neu verschlüsselt). Clientseitige Verschlüsselung schützt die Daten vor dem
          Server selbst, nicht nur vor Netzwerk-Abfangen.
        </li>
        <li>
          <strong>„Das JavaScript könnte verändert werden, um meine Daten zu stehlen"</strong> — das
          gilt für jede Webanwendung. Deshalb sind quelloffene, geprüfte Tools für sensible
          Anwendungsfälle gegenüber undurchsichtigen vorzuziehen. Für maximale Sicherheit: das Tool
          herunterladen und offline ausführen.
        </li>
        <li>
          <strong>„Browser-Verschlüsselung ist schwach"</strong> — Browser-Verschlüsselung mit der
          Web Crypto API und AES-256-GCM ist derselbe Algorithmus, der von
          Unternehmenssicherheitssoftware und Betriebssystem-Vollplatten-Verschlüsselung verwendet
          wird. Der Algorithmus ist nicht schwächer, weil er im Browser läuft.
        </li>
        <li>
          <strong>„Wenn ich das Passwort vergesse, sind die Daten wiederherstellbar"</strong> — das
          sind sie nicht. Clientseitige Verschlüsselung bietet keinen Wiederherstellungsmechanismus.
          Die Daten sind ohne den Schlüssel mathematisch nicht wiederherstellbar. Das ist ein Feature,
          kein Bug — erfordert aber sorgfältiges Schlüsselmanagement.
        </li>
      </ul>

      <h2>Praktische Anwendungsfälle</h2>
      <ul>
        <li><strong>Sensible Notizen verschlüsseln</strong> — medizinische Informationen, Finanzkontodaten oder persönliche Tagebucheinträge, die Sie in einer Cloud-Notizen-App speichern möchten, ohne dem Anbieter zu vertrauen</li>
        <li><strong>Sensiblen Text in Dokumenten schützen</strong> — verschlüsselte Anmeldedaten oder Geheimnisse in ein Dokument einbetten, das geteilt wird, wobei nur der Empfänger mit dem Passwort sie lesen kann</li>
        <li><strong>Private Nachrichten über öffentliche Kanäle senden</strong> — eine Nachricht verschlüsseln, den Chiffretext in einem öffentlichen Kanal teilen und das Passwort über einen separaten privaten Kanal weitergeben</li>
        <li><strong>Sichere Sicherungskopien</strong> — exportierte Daten verschlüsseln, bevor sie auf einem nicht vertrauenswürdigen Backup-Dienst gespeichert werden</li>
      </ul>

      <h2>Einschränkungen clientseitiger Verschlüsselung</h2>
      <p>
        Clientseitige Verschlüsselung ist leistungsfähig, aber keine vollständige Sicherheitslösung:
      </p>
      <ul>
        <li><strong>Schwache Passwörter umgehen starke Verschlüsselung</strong> — AES-256 mit dem Passwort „hallo123" bietet einem entschlossenen Angreifer, der Wörterbuchangriffe durchführen kann, praktisch keinen Schutz</li>
        <li><strong>Gerätekompromittierung</strong> — wenn ein Angreifer Ihr Gerät kontrolliert (Malware, Keylogger), kann er Daten vor der Verschlüsselung erfassen oder den Schlüssel abfangen</li>
        <li><strong>Kein Teilen ohne Schlüsselaustausch</strong> — verschlüsselte Daten mit jemandem zu teilen erfordert das sichere Weitergeben des Schlüssels, was ein separates Problem darstellt</li>
        <li><strong>Keine Suche oder Indizierung</strong> — verschlüsselte Daten können ohne vorherige Entschlüsselung nicht durchsucht, sortiert oder verarbeitet werden</li>
      </ul>
      <ToolCTA slug="text-encryption" variant="card" />
    </div>
  );
}
