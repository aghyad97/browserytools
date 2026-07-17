import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Wenn Sie mit einem modernen Web-Authentifizierungssystem gearbeitet haben — OAuth 2.0, OpenID Connect oder
        einer eigenen API —, sind Sie mit ziemlicher Sicherheit auf JWT-Tokens gestoßen. Sie tauchen in
        Authorization-Headern, in Cookies, im Local Storage und in Debugging-Sitzungen um 2 Uhr morgens auf, wenn ein
        Login-Ablauf auf mysteriöse Weise fehlschlägt. Zu verstehen, was ein JWT tatsächlich enthält, wie man es liest
        und wie man häufige Probleme erkennt, beschleunigt das Authentifizierungs-Debugging dramatisch.
      </p>
      <ToolCTA slug="jwt-decoder" variant="inline" />
      <p>
        Mit dem <a href="/tools/jwt-decoder">BrowseryTools JWT-Decoder</a> können Sie jedes JWT-Token einfügen und
        sofort dessen dekodierten Header, die Nutzlast und den Ablaufstatus sehen — alles in Ihrem Browser, wobei das
        Token niemals Ihr Gerät verlässt.
      </p>

      <h2>Was ist ein JWT?</h2>
      <p>
        JWT steht für JSON Web Token, definiert in RFC 7519. Ein JWT ist ein kompaktes, URL-sicheres Token, das einen
        Satz von Claims codiert — Aussagen über ein Subjekt, typischerweise einen Benutzer — in einem Format, das
        verifiziert und für vertrauenswürdig gehalten werden kann. Die zentrale Eigenschaft eines JWT ist, dass es
        <em>in sich geschlossen</em> ist: Das Token selbst trägt alle Informationen, die ein Server zur
        Authentifizierung einer Anfrage benötigt, ohne eine Datenbankabfrage.
      </p>
      <p>
        Ein JWT sieht so aus:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        Auf den ersten Blick sieht es wie Kauderwelsch aus. Doch es hat eine sehr präzise Struktur: drei
        Base64URL-kodierte Abschnitte, durch Punkte getrennt. Jeder Abschnitt hat einen bestimmten Zweck.
      </p>

      <h2>Die dreiteilige Struktur: Header.Nutzlast.Signatur</h2>

      <h3>Teil 1: Der Header</h3>
      <p>
        Das erste Segment, vor dem ersten Punkt, ist der <strong>Header</strong>. Es ist ein Base64URL-kodiertes
        JSON-Objekt, das den Typ des Tokens und den Signaturalgorithmus beschreibt. Dekodiert sieht der Header aus dem
        obigen Beispiel so aus:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        Das Feld <code>alg</code> gibt den Signaturalgorithmus an. Gängige Werte, denen Sie begegnen werden, sind:
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC mit SHA-256. Verwendet einen gemeinsamen geheimen Schlüssel. Sowohl Aussteller
          als auch Prüfer müssen dasselbe Secret besitzen. Verbreitet in monolithischen Anwendungen.
        </li>
        <li>
          <strong>RS256</strong> — RSA-Signatur mit SHA-256. Verwendet ein öffentliches/privates Schlüsselpaar. Der
          Aussteller signiert mit dem privaten Schlüssel; Prüfer kontrollieren mit dem öffentlichen Schlüssel.
          Verbreitet in verteilten Systemen und bei OAuth-Anbietern.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA mit P-256 und SHA-256. Wie RS256, aber unter Verwendung elliptischer Kurven —
          kürzere Schlüssel, gleiches Sicherheitsniveau. Bevorzugt in modernen Hochleistungssystemen.
        </li>
        <li>
          <strong>none</strong> — Keine Signatur. Akzeptieren Sie dies niemals in der Produktion. Eine notorische
          Sicherheitslücke entsteht, wenn Server unsignierte Tokens akzeptieren, weil der Client <code>alg</code>{" "}
          auf <code>"none"</code> geändert hat.
        </li>
      </ul>

      <h3>Teil 2: Die Nutzlast</h3>
      <p>
        Das zweite Segment ist die <strong>Nutzlast</strong> — die eigentlichen Daten, die das Token trägt. Auch sie ist
        ein Base64URL-kodiertes JSON-Objekt. Die dekodierte Nutzlast aus unserem Beispiel:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        Die Nutzlast enthält zwei Arten von Claims: <strong>registrierte Claims</strong>, die durch die
        JWT-Spezifikation definiert sind, und <strong>private/benutzerdefinierte Claims</strong>, die von Ihrer
        Anwendung hinzugefügt werden (wie <code>name</code>, <code>email</code> und <code>roles</code> oben).
      </p>

      <h3>Teil 3: Die Signatur</h3>
      <p>
        Das dritte Segment ist die <strong>Signatur</strong>. Sie wird berechnet, indem man den Base64URL-kodierten
        Header, einen Punkt, die Base64URL-kodierte Nutzlast nimmt und das Ergebnis mit dem im Header angegebenen
        Algorithmus und Schlüssel signiert. Für HS256:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        Die Signatur stellt die Integrität sicher: Wenn jemand auch nur ein einziges Zeichen im Header oder in der
        Nutzlast nach der Ausstellung des Tokens ändert, wird die Signatur ungültig und die Verifizierung schlägt fehl.
        Ohne Kenntnis des Signatur-Secrets (oder des privaten Schlüssels des Ausstellers bei RS256/ES256) kann ein
        Angreifer kein gültiges Token fälschen.
      </p>

      <h2>Referenz der Standard-JWT-Claims</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Claim</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Vollständiger Name</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Beschreibung</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Issuer (Aussteller)</td>
              <td style={{padding: "10px 16px"}}>Wer das Token ausgestellt hat (z. B. die URL Ihres Auth-Servers)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Subject (Subjekt)</td>
              <td style={{padding: "10px 16px"}}>Worum es im Token geht — typischerweise die eindeutige ID des Benutzers</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audience (Empfänger)</td>
              <td style={{padding: "10px 16px"}}>Für welche(n) Dienst(e) das Token bestimmt ist</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Expiration Time (Ablaufzeit)</td>
              <td style={{padding: "10px 16px"}}>Unix-Zeitstempel, nach dem das Token abgelehnt werden muss</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Issued At (Ausgestellt am)</td>
              <td style={{padding: "10px 16px"}}>Unix-Zeitstempel der Erstellung des Tokens</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>Not Before (Nicht vor)</td>
              <td style={{padding: "10px 16px"}}>Das Token ist vor diesem Unix-Zeitstempel nicht gültig</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>JWT ID</td>
              <td style={{padding: "10px 16px"}}>Eindeutige Kennung für das Token — dient der Verhinderung von Replay-Angriffen</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Warum der exp-Claim entscheidend ist</h2>
      <p>
        Der <code>exp</code>-Claim ist ein Unix-Zeitstempel — die Anzahl der Sekunden seit dem 1. Januar 1970 (UTC). In
        unserem Beispiel <code>"exp": 1738371600</code>. Um dies in ein menschenlesbares Datum umzuwandeln, können Sie
        JavaScript verwenden:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        Der JWT-Ablauf ist das Erste, das man prüfen sollte, wenn ein Token abgelehnt wird. Ein Token, das gestern
        gültig war, schlägt heute fehl, wenn sein <code>exp</code> in der Vergangenheit liegt — das ist so beabsichtigt.
        Kurzlebige Tokens (15 Minuten bis 1 Stunde) begrenzen das Schadensfenster, falls ein Token gestohlen wird.
        Längerlebige Tokens (Tage oder Wochen) sind bequemer, aber gefährlicher, wenn sie kompromittiert werden.
      </p>
      <p>
        Der <a href="/tools/jwt-decoder">BrowseryTools JWT-Decoder</a> liest automatisch die <code>exp</code>-{" "}
        und <code>iat</code>-Claims aus und zeigt sie neben den rohen Unix-Zeitstempeln als menschenlesbare Daten an,
        sodass Sie die Kopfrechnung niemals manuell durchführen müssen.
      </p>

      <h2>Häufige JWT-Debugging-Szenarien</h2>

      <h3>Token abgelaufen (401 Unauthorized)</h3>
      <p>
        Der häufigste JWT-Fehler. Der Server hat das Token abgelehnt, weil die aktuelle Zeit nach dem
        <code>exp</code>-Wert liegt. Lösung: Implementieren Sie einen Token-Refresh-Ablauf mit einem längerlebigen
        Refresh-Token oder authentifizieren Sie sich einfach neu. Fügen Sie das Token in den Decoder ein, um genau zu
        bestätigen, wann es abgelaufen ist.
      </p>

      <h3>Falscher Empfänger</h3>
      <p>
        Wenn Ihre API den <code>aud</code>-Claim validiert und das Token für einen anderen Empfänger ausgestellt wurde
        (z. B. ein für <code>https://api-staging.example.com</code> ausgestelltes Token wird an{" "}
        <code>https://api.example.com</code> gesendet), wird der Server es ablehnen. Dekodieren Sie das Token und prüfen
        Sie das <code>aud</code>-Feld, um zu bestätigen, dass es dem entspricht, was der empfangende Dienst erwartet.
      </p>

      <h3>Algorithmus-Diskrepanz</h3>
      <p>
        Wenn Ihr Server RS256 erwartet, aber ein mit HS256 signiertes Token empfängt (oder umgekehrt), schlägt die
        Validierung fehl. Das kann während einer Schlüsselrotation oder beim Wechsel von Auth-Anbietern geschehen.
        Prüfen Sie das <code>alg</code>-Feld im dekodierten Header gegen das, was Ihr Server zu akzeptieren konfiguriert
        ist.
      </p>

      <h3>Signatur ungültig</h3>
      <p>
        Wenn die Nutzlast manipuliert wurde — selbst ein einzelnes geändertes Zeichen —, stimmt die Signatur nicht
        überein. Das passiert auch, wenn Sie das falsche Secret oder den falschen öffentlichen Schlüssel zur
        Verifizierung verwenden. Das Dekodieren von Header und Nutzlast (was kein Secret erfordert) erlaubt es Ihnen
        zumindest zu prüfen, was das Token behauptet, selbst wenn Sie seine Echtheit clientseitig nicht verifizieren
        können.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Sicherheitswarnung — die Nutzlast ist nicht verschlüsselt:</strong> Die JWT-Nutzlast ist
        Base64URL-kodiert, nicht verschlüsselt. Jeder, der die Token-Zeichenkette besitzt, kann Header und Nutzlast ohne
        jeglichen Schlüssel oder Secret dekodieren. Speichern Sie niemals sensible Informationen in einer JWT-Nutzlast —
        keine Passwörter, keine Zahlungskartendaten, keine Sozialversicherungsnummern, keine privaten Schlüssel.
        Behandeln Sie die Nutzlast als öffentlich lesbare Daten, die lediglich manipulationssicher, nicht aber
        vertraulich sind.
      </div>

      <h2>JWT vs. Session-Tokens: Wann man welches verwendet</h2>
      <p>
        JWTs und herkömmliche Session-Tokens lösen dasselbe Problem — die Identifizierung eines authentifizierten
        Benutzers über mehrere Anfragen hinweg —, tun das aber unterschiedlich, und keines ist universell besser.
      </p>
      <p>
        <strong>Herkömmliche Session-Tokens</strong> sind undurchsichtige zufällige Zeichenketten (z. B. eine UUID), die
        serverseitig in einem Session-Speicher (Redis, Datenbank) abgelegt werden. Bei jeder Anfrage schlägt der Server
        das Token im Speicher nach und ruft die Benutzerdaten ab. Der Server hat volle Kontrolle: Das Ungültigmachen
        einer Sitzung entzieht den Zugriff sofort.
      </p>
      <p>
        <strong>JWTs</strong> sind zustandslos. Der Server stellt ein signiertes Token aus und führt keine
        Aufzeichnung darüber. Bei jeder Anfrage verifiziert der Server die Signatur und vertraut den Claims ohne jede
        Datenbankabfrage. Das skaliert horizontal ohne gemeinsamen Zustand — jeder Server mit dem Verifizierungsschlüssel
        kann die Anfrage authentifizieren. Der Kompromiss: Sie können ein JWT vor seinem Ablauf nicht sofort widerrufen
        (es sei denn, Sie implementieren eine Token-Sperrliste, die wieder Zustand einführt).
      </p>
      <ul>
        <li>Verwenden Sie <strong>JWTs</strong> für zustandslose Microservices, verteilte Systeme, mobile APIs und
        domänenübergreifende Authentifizierung (OAuth/OIDC-Abläufe). Halten Sie die Ablaufzeiten kurz.</li>
        <li>Verwenden Sie <strong>Session-Tokens</strong>, wenn Sie eine sofortige Widerrufsmöglichkeit benötigen
        (Abmeldung, Kontosperrung, Sicherheitsvorfälle), oder wenn alle Ihre Dienste einen schnellen Session-Speicher
        teilen.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Kritische Sicherheitsregel:</strong> Verifizieren Sie JWT-Signaturen stets serverseitig mit einem
        vertrauenswürdigen Schlüssel. Verlassen Sie sich niemals allein auf die clientseitige Verifizierung. Ein Client
        kann die Nutzlast jedes JWT ohne Secret dekodieren — aber nur der Server, der den korrekten Schlüssel besitzt,
        kann feststellen, ob die Signatur echt ist und dem Token vertraut werden kann. Die clientseitige Dekodierung ist
        nur zum <em>Lesen</em> von Claims nützlich (etwa zum Anzeigen des Namens des Benutzers in einer
        Benutzeroberfläche), niemals zum Treffen von Autorisierungsentscheidungen.
      </div>

      <h2>So nutzen Sie den BrowseryTools JWT-Decoder</h2>
      <p>
        Öffnen Sie den <a href="/tools/jwt-decoder">JWT-Decoder</a> und fügen Sie Ihr Token in das Eingabefeld ein. Das
        Tool teilt das Token sofort an den beiden Punkten auf und zeigt Folgendes an:
      </p>
      <ul>
        <li>
          <strong>Header-Bereich:</strong> Das dekodierte JSON, das <code>alg</code>, <code>typ</code> und alle anderen
          Header-Felder zeigt. Nützlich, um den Signaturalgorithmus auf einen Blick zu erkennen.
        </li>
        <li>
          <strong>Nutzlast-Bereich:</strong> Das vollständige dekodierte JSON mit allen Claims. Zeitstempel werden
          sowohl im rohen Unix-Format als auch als menschenlesbare UTC-Daten angezeigt, sodass Sie den Ablauf sofort
          ohne gedankliche Umrechnung sehen können.
        </li>
        <li>
          <strong>Ablaufstatus:</strong> Eine klare Anzeige, die zeigt, ob das Token derzeit gültig, bereits abgelaufen
          oder noch nicht aktiv ist (basierend auf <code>nbf</code>). Falls abgelaufen, sehen Sie genau, vor wie langer
          Zeit es abgelaufen ist.
        </li>
        <li>
          <strong>Signatur-Segment:</strong> Die rohe Base64URL-kodierte Signatur, zur Referenz angezeigt. Das Tool
          verifiziert die Signatur nicht (das erfordert das Secret oder den öffentlichen Schlüssel), aber es dekodiert
          und zeigt alle Informationen an, die Sie zum Debuggen benötigen.
        </li>
      </ul>
      <p>
        Es gibt keine Formularübermittlung, keine Serveranfrage, keinen Zwischenablagezugriff über das hinaus, was Sie
        ausdrücklich einfügen. Das Parsen des Tokens erfolgt vollständig in JavaScript, das in Ihrem Browser-Tab läuft.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Ihre Tokens bleiben privat:</strong> JWT-Tokens enthalten häufig Benutzer-IDs, E-Mail-Adressen, Rollen
        und andere persönliche Daten. Der BrowseryTools JWT-Decoder verarbeitet Ihr Token vollständig in Ihrem Browser —
        es wird niemals an einen Server gesendet, niemals protokolliert und niemals gespeichert. Sie können
        Produktions-Tokens gefahrlos einfügen, um sie zu untersuchen, ohne sich um Offenlegung sorgen zu müssen. Sobald
        Sie den Tab schließen, ist es weg.
      </div>

      <h2>Dekodieren Sie jetzt Ihr JWT-Token</h2>
      <p>
        Ob Sie ein abgelaufenes Token debuggen, Claims von einem OAuth-Anbieter untersuchen, prüfen, welche Rollen einem
        Benutzer gewährt wurden, oder einfach verstehen möchten, was Ihr Authentifizierungssystem tatsächlich
        ausstellt — der <a href="/tools/jwt-decoder">BrowseryTools JWT-Decoder</a> liefert Ihnen die Antworten sofort.
        Keine Registrierung, keine zu installierenden Erweiterungen, keine Daten, die irgendwohin gesendet werden.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser JWT-Decoder — sofort, privat, ohne Anmeldung
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          JWT-Decoder öffnen →
        </a>
      </div>
      <ToolCTA slug="jwt-decoder" variant="card" />
    </div>
  );
}
