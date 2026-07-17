import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jedes Mal, wenn Sie eine Software-Version herunterladen, die Echtheit einer Datei überprüfen, ein JWT-Token
        signieren oder das Passwort eines Benutzers speichern, arbeitet im Hintergrund eine kryptografische
        Hash-Funktion. Hash-Funktionen sind eine der grundlegenden Primitiven der modernen Computersicherheit — und
        dennoch werden die Unterschiede zwischen MD5, SHA-1, SHA-256 und SHA-512 weithin missverstanden, was zu echten
        Sicherheitsfehlern in produktiven Systemen führt.
      </p>
      <ToolCTA slug="hash-generator" variant="inline" />
      <p>
        Dieser Leitfaden erklärt, was Hash-Funktionen sind, wie jeder wichtige Algorithmus funktioniert, wann welcher
        angemessen ist (und wann er gefährlich unangemessen ist) und wie Sie den{" "}
        <a href="/tools/hash-generator">BrowseryTools Hash-Generator</a> nutzen, um Hashes sofort und mit voller
        Privatsphäre in Ihrem Browser zu berechnen.
      </p>

      <h2>Was ist eine kryptografische Hash-Funktion?</h2>
      <p>
        Eine kryptografische Hash-Funktion nimmt eine Eingabe beliebiger Länge und erzeugt eine Ausgabe fester Länge,
        die als Digest oder Hash bezeichnet wird. Vier Eigenschaften definieren eine gute kryptografische
        Hash-Funktion:
      </p>
      <ul>
        <li>
          <strong>Deterministisch:</strong> Dieselbe Eingabe erzeugt stets exakt dieselbe Ausgabe. Hash-Funktionen
          haben keinen internen Zustand — bei denselben Bytes erhalten Sie stets denselben Digest.
        </li>
        <li>
          <strong>Einwegfunktion (Urbildresistenz):</strong> Aus einer Hash-Ausgabe sollte es rechnerisch undurchführbar
          sein, die ursprüngliche Eingabe wiederherzustellen. Hash-Funktionen sind so gestaltet, dass sie in eine
          Richtung leicht zu berechnen und praktisch unmöglich umzukehren sind.
        </li>
        <li>
          <strong>Feste Ausgabelänge:</strong> Unabhängig davon, ob die Eingabe ein Byte oder ein Gigabyte beträgt, ist
          die Ausgabe stets gleich lang. SHA-256 erzeugt immer einen 256-Bit-Digest (32 Byte).
        </li>
        <li>
          <strong>Lawineneffekt:</strong> Eine Ein-Bit-Änderung in der Eingabe verändert die Ausgabe vollständig. Der
          Hash von <code>hello</code> sieht völlig anders aus als der Hash von <code>hello!</code> — sie teilen keine
          vorhersagbare Struktur. Das macht Hashes als Fingerabdrücke nützlich.
        </li>
      </ul>
      <p>
        Eine fünfte Eigenschaft — Kollisionsresistenz — trennt kryptografisch starke Hashes von gebrochenen: Es sollte
        rechnerisch undurchführbar sein, zwei verschiedene Eingaben zu finden, die dieselbe Ausgabe erzeugen. Hier sind
        MD5 und SHA-1 gescheitert.
      </p>

      <h2>MD5: schnell, allgegenwärtig und für die Sicherheit gebrochen</h2>
      <p>
        MD5 (Message Digest 5) wurde von Ron Rivest entworfen und 1991 veröffentlicht. Es erzeugt einen 128-Bit-Digest
        (16 Byte), typischerweise als 32-stellige Hexadezimal-Zeichenkette wie{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code> dargestellt. Über ein Jahrzehnt lang war es der dominierende
        Hash-Algorithmus für alles, von Dateiprüfsummen bis zur Passwortspeicherung.
      </p>
      <p>
        2004 demonstrierten Kryptografen praktische Kollisionsangriffe gegen MD5. Bis 2008 hatten Forscher
        Kollisionsangriffe genutzt, um ein gefälschtes Zertifikat einer von allen großen Browsern als vertrauenswürdig
        eingestuften Zertifizierungsstelle zu erzeugen. MD5 ist nun definitiv gebrochen für jeden Sicherheitszweck, bei
        dem Kollisionsresistenz von Bedeutung ist.
      </p>
      <p>
        Wo MD5 noch akzeptabel ist:
      </p>
      <ul>
        <li>Nicht sicherheitsrelevante Dateiintegritätsprüfungen, bei denen Sie sowohl die Erzeugung als auch die Überprüfung kontrollieren (zur Bestätigung, dass eine Datei beim Transport nicht beschädigt wurde, nicht aber, dass sie nicht manipuliert wurde).</li>
        <li>Prüfsummen in internen Systemen, bei denen ein böswilliger Akteur nicht Teil des Bedrohungsmodells ist.</li>
        <li>Kompatibilität mit Altsystemen, bei denen Ihnen keine Wahl bleibt, als eine bestehende Implementierung nachzubilden.</li>
        <li>Cache-Schlüssel und Hash-Maps, bei denen Sicherheit irrelevant ist und Geschwindigkeit zählt.</li>
      </ul>
      <p>
        Wo MD5 niemals verwendet werden darf: TLS-Zertifikate, digitale Signaturen, Code-Signierung oder alles, wobei
        ein Angreifer davon profitieren könnte, eine Kollision zu finden.
      </p>

      <h2>SHA-1: 160-Bit, veraltet, immer noch überall</h2>
      <p>
        SHA-1 (Secure Hash Algorithm 1) wurde 1995 von der NIST veröffentlicht und erzeugt einen 160-Bit-Digest. Es war
        in den 2000er-Jahren der Standard für TLS-Zertifikate, digitale Signaturen und Softwaresignierung. Googles
        Project Zero demonstrierte 2017 eine praktische SHA-1-Kollision (der SHAttered-Angriff) und erzeugte zwei
        verschiedene PDF-Dateien mit identischen SHA-1-Hashes. Das beendete die Verwendung von SHA-1 in TLS — alle
        großen Browserhersteller hörten noch im selben Jahr auf, SHA-1-Zertifikate zu akzeptieren.
      </p>
      <p>
        SHA-1 findet sich noch an einigen bemerkenswerten Stellen:
      </p>
      <ul>
        <li>
          <strong>Git:</strong> Git hat historisch SHA-1 verwendet, um jedes Objekt in einem Repository zu
          identifizieren — Commits, Blobs, Trees und Tags. Git migriert aktiv zu SHA-256 (siehe unten), aber
          SHA-1-Git-Repositorys bleiben äußerst verbreitet. Für diesen Anwendungsfall ist Kollisionsresistenz weniger
          wichtig, weil ein Angreifer Dateisystemzugriff benötigen würde, um eine Kollision auszunutzen.
        </li>
        <li>Veraltete Authentifizierungssysteme und ältere HMAC-Implementierungen.</li>
        <li>Manche ältere Unternehmenssoftware, die nicht aktualisiert wurde.</li>
      </ul>
      <p>
        Für jede neue Arbeit: Meiden Sie SHA-1. Verwenden Sie SHA-256 oder SHA-512.
      </p>

      <h2>SHA-256: Der aktuelle Standard</h2>
      <p>
        SHA-256 gehört zur SHA-2-Familie, die 2001 von der NIST veröffentlicht wurde. Es erzeugt einen 256-Bit-Digest
        (32 Byte) — doppelt so lang wie die Ausgabe von MD5 und 60 % größer als SHA-1. Es wurden keine praktischen
        Kollisions- oder Urbildangriffe gegen SHA-256 demonstriert. Es bleibt 2026 der Standard für
        sicherheitsrelevantes Hashing.
      </p>
      <p>
        SHA-256 wird überall verwendet:
      </p>
      <ul>
        <li><strong>TLS-Zertifikate:</strong> Das CA/Browser Forum schrieb SHA-256 als Mindeststandard für Zertifikatssignaturen vor. Jede HTTPS-Verbindung, die Sie herstellen, ist durch SHA-256 verankert.</li>
        <li><strong>Code-Signierung:</strong> macOS, Windows Authenticode und Linux-Paketmanager (APT, RPM) verwenden SHA-256, um die Softwareintegrität zu überprüfen.</li>
        <li><strong>JWT-Tokens:</strong> Der Algorithmus <code>HS256</code> in JSON Web Tokens ist HMAC-SHA-256. Es ist mit Abstand der häufigste JWT-Signaturalgorithmus in eingesetzten Systemen.</li>
        <li><strong>Bitcoin:</strong> Bitcoins Proof-of-Work-Algorithmus ist doppeltes SHA-256 (SHA-256 zweimal angewendet).</li>
        <li><strong>Git (nächste Generation):</strong> Gits SHA-256-Objektformat (aktiviert mit <code>--object-format=sha256</code>) verwendet SHA-256 für alle Objekt-IDs.</li>
        <li>Dateiintegritätsprüfung, die zusammen mit Software-Downloads veröffentlicht wird.</li>
      </ul>
      <p>
        Wenn Sie eine Hash-Funktion wählen müssen und keine besonderen Einschränkungen haben, ist SHA-256 2026 die
        korrekte Standardwahl.
      </p>

      <h2>SHA-512: größere Ausgabe, manchmal schneller</h2>
      <p>
        SHA-512 gehört ebenfalls zur SHA-2-Familie und erzeugt einen 512-Bit-Digest (64 Byte). Es bietet einen größeren
        Sicherheitsspielraum als SHA-256 — 512 Bit Ausgabe bedeuten, dass der theoretische Brute-Force-Angriffsraum 2<sup>256</sup> mal größer ist. In der Praxis ist dieser zusätzliche Spielraum für die meisten Anwendungen
        irrelevant, da SHA-256 bereits rechnerisch undurchführbar zu brechen ist.
      </p>
      <p>
        Die kontraintuitive Leistungseigenschaft: SHA-512 ist auf modernen 64-Bit-CPUs beim Hashen großer Daten{" "}
        <em>schneller</em> als SHA-256. SHA-512 verarbeitet Daten in 1024-Bit-Blöcken mit 64-Bit-Wortoperationen,
        während SHA-256 512-Bit-Blöcke mit 32-Bit-Operationen verwendet. Auf einem 64-Bit-Prozessor bilden die
        64-Bit-Operationen effizienter auf die Hardware ab. Das macht SHA-512 zur bevorzugten Wahl für Anwendungen, die
        große Dateien auf 64-Bit-Servern hashen.
      </p>
      <p>
        Verwenden Sie SHA-512, wenn:
      </p>
      <ul>
        <li>Sie große Datenmengen auf 64-Bit-Hardware hashen und maximalen Durchsatz wünschen.</li>
        <li>Ihr System aus regulatorischen oder Compliance-Gründen den zusätzlichen Sicherheitsspielraum erfordert.</li>
        <li>Sie HMAC-SHA-512 implementieren (in manchen JWT-Implementierungen mit <code>HS512</code> verwendet).</li>
      </ul>

      <h2>Vergleichstabelle der Algorithmen</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algorithmus</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Ausgabelänge</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Geschwindigkeit (relativ)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Sicherheitsstatus</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Häufige Anwendungsfälle</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128-Bit (32 Hex-Zeichen)</td>
              <td style={{padding: "12px 16px"}}>Am schnellsten</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Gebrochen</strong> — Kollisionen demonstriert</td>
              <td style={{padding: "12px 16px"}}>Nicht sicherheitsrelevante Prüfsummen, Cache-Schlüssel, Altsysteme</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160-Bit (40 Hex-Zeichen)</td>
              <td style={{padding: "12px 16px"}}>Schnell</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Veraltet</strong> — praktische Kollisionen existieren</td>
              <td style={{padding: "12px 16px"}}>Altes Git, altes TLS (veraltet), manche veraltete Auth</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256-Bit (64 Hex-Zeichen)</td>
              <td style={{padding: "12px 16px"}}>Schnell</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Sicher</strong> — aktueller Standard</td>
              <td style={{padding: "12px 16px"}}>TLS-Zertifikate, JWT (HS256), Code-Signierung, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512-Bit (128 Hex-Zeichen)</td>
              <td style={{padding: "12px 16px"}}>Am schnellsten auf 64-Bit bei großen Daten</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Sicher</strong> — größerer Sicherheitsspielraum</td>
              <td style={{padding: "12px 16px"}}>Hashen großer Dateien, JWT (HS512), Hochsicherheitsanwendungen</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Dateiintegritätsprüfung: Ein praktisches Beispiel</h2>
      <p>
        Einer der häufigsten und legitimsten Einsätze kryptografischer Hashes ist die Überprüfung, dass eine
        heruntergeladene Datei genau das ist, was der Herausgeber beabsichtigt hat — nicht beim Transport beschädigt und
        nicht von einem Dritten manipuliert. Die meisten großen Softwareprojekte veröffentlichen SHA-256-Prüfsummen
        zusammen mit ihren Downloads.
      </p>
      <p>
        Der Arbeitsablauf sieht so aus:
      </p>
      <ul>
        <li>Laden Sie die Datei von der offiziellen Quelle herunter.</li>
        <li>Laden Sie die veröffentlichte Prüfsumme von derselben offiziellen Quelle herunter (idealerweise mit PGP signiert).</li>
        <li>Berechnen Sie den SHA-256-Hash der heruntergeladenen Datei.</li>
        <li>Vergleichen Sie Ihren berechneten Hash Zeichen für Zeichen mit dem veröffentlichten Hash. Jeder Unterschied bedeutet, dass die Datei nicht das ist, was der Herausgeber verteilt hat.</li>
      </ul>
      <p>
        Der <a href="/tools/hash-generator">BrowseryTools Hash-Generator</a> unterstützt das Hashen von Dateien — ziehen
        Sie eine Datei hinein, und er berechnet den Hash lokal in Ihrem Browser, ohne etwas hochzuladen. Vergleichen Sie
        das Ergebnis direkt mit der veröffentlichten Prüfsumme.
      </p>

      <h2>Passwortspeicherung: Das eine, das Hashes nicht sicher leisten können</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Kritische Warnung: Speichern Sie Passwörter niemals mit einfachen Hash-Funktionen
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Passwörter als MD5-, SHA-256- oder SHA-512-Hashes zu speichern — selbst mit einem Salt — ist unsicher und eine
          ernsthafte Schwachstelle in jedem produktiven System. Hier ist der Grund:
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>Allzweck-Hash-Funktionen sind darauf ausgelegt, <em>schnell</em> zu sein. Eine moderne GPU kann Milliarden von SHA-256-Hashes pro Sekunde berechnen. Wird Ihre Datenbank kompromittiert, kann ein Angreifer jedes gängige Passwort in Minuten per Brute Force knacken.</li>
          <li>Rainbow-Tables — vorberechnete Nachschlagetabellen, die Hashes auf Eingaben abbilden — können ungesalzene Hashes gängiger Passwörter in Millisekunden knacken.</li>
          <li>Selbst mit einem eindeutigen Salt pro Benutzer macht die schiere Geschwindigkeit von SHA-256 es leicht, schwache oder mittelstarke Passwörter in großem Umfang anzugreifen.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Verwenden Sie stattdessen eine Passwort-Hash-Funktion:</strong> <code>bcrypt</code>, <code>scrypt</code>
          oder <code>Argon2</code> (der Sieger des Password Hashing Competition). Diese sind absichtlich langsam und
          speicherintensiv, was Brute-Force-Angriffe um Größenordnungen teurer macht. Die meisten modernen Frameworks
          enthalten sie von Haus aus. Argon2id ist die aktuelle Empfehlung für neue Systeme.
        </p>
      </div>

      <h2>Wie Git SHA-1 verwendet (und zu SHA-256 wechselt)</h2>
      <p>
        Git verwendet eine Hash-Funktion, um jedes Objekt in einem Repository zu identifizieren. Jeder Commit, jede
        Datei (Blob), jedes Verzeichnislisting (Tree) und jedes Tag wird in der Objektdatenbank unter seinem
        SHA-1-Hash gespeichert. Wenn Sie{" "}
        <code>git log</code> ausführen, sind die langen Hex-Zeichenketten, die Sie sehen — wie{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — SHA-1-Hashes von Commit-Objekten.
      </p>
      <p>
        Git wählte 2005 SHA-1 wegen der Geschwindigkeit und weil SHA-1 damals nicht gebrochen war. Die Rolle von Hashes
        in Git unterscheidet sich leicht von der traditionellen Sicherheitsnutzung: Git verwendet sie als
        inhaltsadressierbare Speicherschlüssel, nicht als Authentifizierungsnachweise. Dem Inhalt selbst vertrauen Sie —
        der Hash ist nur eine effiziente Möglichkeit, ihn nachzuschlagen und versehentliche Beschädigung zu erkennen.
      </p>
      <p>
        Nach der SHAttered-SHA-1-Kollision 2017 begann das Git-Projekt mit der Arbeit am Übergang zu SHA-256. Das neue
        Objektformat (<code>--object-format=sha256</code>) ist in Git 2.29+ verfügbar und wird bei einigen neuen
        Repository-Hosts standardmäßig verwendet. Bestehende Repositorys können migriert werden, wobei der Übergang
        komplex ist, weil sich jede Objekt-ID ändert.
      </p>

      <h2>HMAC: Hash-basierte Nachrichtenauthentifizierung</h2>
      <p>
        Ein einfacher Hash überprüft die Datenintegrität (die Daten haben sich nicht geändert), nicht aber die
        Authentizität (die Daten stammen von dem, von dem Sie es annehmen). Wenn ein Angreifer eine Nachricht abfangen
        und den Hash nach der Änderung neu berechnen kann, bietet ein einfacher Hash keinen Schutz.
      </p>
      <p>
        HMAC (Hash-based Message Authentication Code) löst dies, indem es einen geheimen Schlüssel in die
        Hash-Berechnung einbezieht. Das Ergebnis kann nur von jemandem erzeugt werden, der den Schlüssel kennt. Die
        Verifizierung eines HMAC beweist sowohl, dass die Daten intakt sind, als auch, dass sie von einer Partei mit
        Zugriff auf das gemeinsame Secret erzeugt wurden.
      </p>
      <p>
        HMAC-SHA256 ist überall:
      </p>
      <ul>
        <li><strong>JWT-Tokens (HS256):</strong> Der Server signiert Token-Header und -Nutzlast mit HMAC-SHA256 unter Verwendung eines geheimen Schlüssels. Clients können ohne den Schlüssel keine gültigen Tokens fälschen.</li>
        <li><strong>Signierung von API-Anfragen:</strong> AWS Signature Version 4 verwendet HMAC-SHA256, um API-Anfragen zu authentifizieren. Die Anfragedetails und ein abgeleiteter Signaturschlüssel werden zusammen gehasht, sodass keines davon ohne Ungültigmachen der Signatur geändert werden kann.</li>
        <li><strong>Cookie-Integrität:</strong> Viele Web-Frameworks verwenden HMAC, um Session-Cookies zu signieren, was Benutzer daran hindert, ihre eigenen Sitzungsdaten zu manipulieren.</li>
      </ul>

      <h2>So nutzen Sie den BrowseryTools Hash-Generator</h2>
      <p>
        Der <a href="/tools/hash-generator">Hash-Generator</a> unterstützt das Hashen sowohl von Texteingaben als auch
        von Datei-Uploads vollständig in Ihrem Browser. So funktioniert es:
      </p>
      <ul>
        <li>
          <strong>Text-Hashing:</strong> Fügen Sie beliebigen Text in das Eingabefeld ein. Das Tool berechnet und zeigt
          sofort den Hash für jeden unterstützten Algorithmus gleichzeitig an — MD5, SHA-1, SHA-256 und SHA-512 —,
          sodass Sie sie nebeneinander vergleichen und den benötigten auswählen können.
        </li>
        <li>
          <strong>Datei-Hashing:</strong> Klicken Sie auf die Dateieingabe oder ziehen Sie eine beliebige Datei per
          Drag-and-drop hinein. Die Datei wird von der File API Ihres Browsers gelesen und lokal gehasht. Große Dateien
          werden in Blöcken verarbeitet, um Speicherdruck zu vermeiden. Kein Byte Ihrer Datei verlässt Ihr Gerät.
        </li>
        <li>
          <strong>Algorithmus wählen:</strong> Wählen Sie den spezifischen Algorithmus aus, auf den Sie sich für Ihren
          Anwendungsfall konzentrieren möchten. Der vollständige Hex-Digest wird angezeigt und kann mit einem Klick
          kopiert werden.
        </li>
        <li>
          <strong>Als Datei herunterladen:</strong> Zu Dokumentations- oder Verteilungszwecken exportieren Sie den
          Hash-Digest als Textdatei — nützlich, um Prüfsummen zusammen mit Ihren eigenen Software-Versionen zu
          veröffentlichen.
        </li>
      </ul>

      <h2>Datenschutz: Die Web Crypto API</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Alles bleibt auf Ihrem Gerät.</strong> Der BrowseryTools Hash-Generator verwendet die im Browser
        integrierte <code>window.crypto.subtle</code>-API (die Web Crypto API), um Hashes der SHA-Familie zu berechnen.
        Das ist native Kryptografie, die von der C++-Engine Ihres Browsers implementiert wird — keine JavaScript-Mathematik.
        Für MD5 läuft eine reine JavaScript-Implementierung lokal. In beiden Fällen werden keine Daten — kein einziges
        Byte Ihres Text- oder Dateiinhalts — jemals an BrowseryTools-Server oder einen Drittanbieterdienst übertragen.
        Die Hash-Berechnung erfolgt vollständig innerhalb Ihres Browserprozesses.
      </div>

      <h2>Den richtigen Algorithmus wählen: Ein Entscheidungsleitfaden</h2>
      <ul>
        <li><strong>Dateiintegrität / Prüfsummen (nicht sicherheitsrelevant):</strong> MD5 oder SHA-256. SHA-256 wird für alles Öffentliche bevorzugt, selbst wenn das Bedrohungsmodell nur versehentliche Beschädigung ist, da die bewusste Verwendung eines gebrochenen Algorithmus gegenüber Auditoren schwer zu rechtfertigen ist.</li>
        <li><strong>TLS, Code-Signierung, Zertifikatsoperationen:</strong> SHA-256 (verpflichtend — SHA-1 wird abgelehnt).</li>
        <li><strong>JWT-Signierung:</strong> HMAC-SHA-256 (HS256) für symmetrisch oder RS256/ES256 für asymmetrisch. Niemals MD5 oder SHA-1.</li>
        <li><strong>Passwortspeicherung:</strong> Argon2id, bcrypt oder scrypt. Kein SHA-irgendetwas.</li>
        <li><strong>Hashen großer Dateien auf 64-Bit-Servern:</strong> SHA-512 für besten Durchsatz.</li>
        <li><strong>Maximaler Sicherheitsspielraum:</strong> SHA-512 oder SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Kompatibilität mit Altsystemen:</strong> Was auch immer das Altsystem erfordert — aber planen Sie die Migration weg von MD5 und SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Erzeugen Sie MD5-, SHA-1-, SHA-256- und SHA-512-Hashes sofort
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Fügen Sie Text ein oder ziehen Sie eine Datei hinein. Sämtliches Hashing erfolgt in Ihrem Browser mithilfe der
          Web Crypto API. Nichts wird hochgeladen. Nichts wird protokolliert.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Hash-Generator öffnen →
        </a>
      </div>
      <ToolCTA slug="hash-generator" variant="card" />
    </div>
  );
}
