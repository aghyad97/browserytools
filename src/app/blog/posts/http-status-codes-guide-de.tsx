export default function Content() {
  return (
    <div>
      <p>
        HTTP-Statuscodes sind die Sprache, mit der Server ihren Clients mitteilen, was mit einer
        Anfrage passiert ist. Jeder Entwickler begegnet ihnen ständig — in den DevTools, in
        API-Antworten, in Fehler-Logs, in Slack-Alerts um 3 Uhr morgens. Zu wissen, was ein Code
        tatsächlich bedeutet, wann man welchen Code in eigenen APIs verwendet und was häufige Codes
        über einen Fehler aussagen, macht Sie beim Debuggen deutlich schneller und hilft beim Aufbau
        besserer Dienste.
      </p>
      <p>
        Jeden HTTP-Statuscode können Sie mit der{" "}
        <a href="/tools/http-status">BrowseryTools HTTP-Statuscode-Referenz</a> nachschlagen —
        kostenlos, ohne Anmeldung, alles läuft in Ihrem Browser.
      </p>

      <h2>Die fünf Kategorien</h2>
      <p>
        Statuscodes sind dreistellige Zahlen. Die erste Ziffer definiert die Kategorie:
      </p>
      <ul>
        <li><strong>1xx — Informational</strong>: Die Anfrage wurde empfangen; die Verarbeitung läuft. Diese Codes sind in den meisten Anwendungen selten.</li>
        <li><strong>2xx — Erfolg</strong>: Die Anfrage wurde empfangen, verstanden und akzeptiert.</li>
        <li><strong>3xx — Weiterleitung</strong>: Zum Abschluss der Anfrage ist eine weitere Aktion erforderlich. Der Client sollte einer Weiterleitung folgen.</li>
        <li><strong>4xx — Client-Fehler</strong>: Die Anfrage war fehlerhaft oder nicht autorisiert. Der Client hat einen Fehler gemacht.</li>
        <li><strong>5xx — Server-Fehler</strong>: Der Server konnte eine gültige Anfrage nicht erfüllen. Der Server hat einen Fehler gemacht.</li>
      </ul>
      <p>
        Diese Erstziffer-Regel ist wichtig: Wenn Sie einen Statuscode nicht kennen (z. B. <code>429</code>{" "}
        oder <code>451</code>), wissen Sie zumindest, ob das Problem auf der Client- oder Serverseite
        liegt und ob die Anfrage letztendlich erfolgreich war.
      </p>

      <h2>2xx: Erfolgscodes</h2>
      <p>
        Diese Codes teilen dem Client mit, dass die Anfrage funktioniert hat. Der spezifische Code
        kommuniziert, wie sie funktioniert hat:
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — der universelle Erfolg. Der Response-Body enthält die angeforderten Daten. Wird für GET-Anfragen und die meisten Antworten verwendet, die Inhalte zurückgeben.
        </li>
        <li>
          <strong>201 Created</strong> — eine neue Ressource wurde erstellt. Sollte einen <code>Location</code>-Header enthalten, der auf die URL der neuen Ressource zeigt. Verwenden Sie diesen Code für POST-Anfragen, die Datensätze erstellen, nicht 200.
        </li>
        <li>
          <strong>204 No Content</strong> — die Anfrage war erfolgreich, aber es gibt keinen Response-Body. Üblich für DELETE-Anfragen und PATCH/PUT-Operationen, bei denen der Client keine aktualisierten Daten zurückbenötigt. Die Antwort darf keinen Body enthalten.
        </li>
        <li>
          <strong>206 Partial Content</strong> — wird bei Range-Anfragen verwendet (dem <code>Range</code>-Header). Videoplayer verwenden dies, um bestimmte Byte-Bereiche einer Mediendatei anzufordern, ohne die gesamte Datei herunterzuladen.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# REST API design pattern
POST   /api/users        → 201 Created  (body: new user object, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (body: user object)
PATCH  /api/users/123    → 200 OK       (body: updated user) or 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx: Weiterleitungscodes</h2>
      <p>
        Weiterleitungen teilen dem Client mit, woanders nachzusehen. Der <code>Location</code>-Header
        enthält die neue URL. Der wichtigste Unterschied liegt zwischen dauerhaften und temporären
        Weiterleitungen sowie zwischen Weiterleitungen, die die HTTP-Methode beibehalten, und solchen,
        die sie ändern.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — die Ressource hat eine neue dauerhafte URL. Browser und Suchmaschinen speichern dies im Cache. Der Browser verwendet GET für die Weiterleitung, unabhängig von der ursprünglichen Methode (eine historische Eigenheit). Verwenden Sie diesen Code, wenn Sie eine URL dauerhaft umbenennen oder HTTP zu HTTPS umleiten.
        </li>
        <li>
          <strong>302 Found</strong> — temporäre Weiterleitung. Wie 301 ändert der Browser POST bei der Weiterleitung in GET (gemäß Spezifikation, auch wenn die Spezifikation hier „falsch" war — siehe 307). Verwenden Sie 302 nur, wenn die Weiterleitung wirklich temporär ist.
        </li>
        <li>
          <strong>304 Not Modified</strong> — die zwischengespeicherte Version ist noch aktuell; kein Body. Der Server sendet dies als Antwort auf einen bedingten GET-Request (mit <code>If-None-Match</code> oder <code>If-Modified-Since</code>). Der Browser verwendet seine zwischengespeicherte Kopie. Wichtig für CDN-Effizienz und Bandbreitenreduzierung.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — wie 302, aber die Spezifikation garantiert, dass die ursprüngliche HTTP-Methode beibehalten wird. Wenn ein POST zu einem 307 führt, sendet der Browser einen POST an die neue URL. Verwenden Sie 307 statt 302 für temporäre Nicht-GET-Weiterleitungen.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — wie 301, garantiert aber auch die Methodenbeibehaltung. Der moderne Standard für dauerhafte Weiterleitungen.
        </li>
      </ul>

      <h2>Häufiges Missverständnis: 301 vs. 302 für SEO</h2>
      <p>
        Suchmaschinen behandeln 301 als Signal, „Link-Equity" (PageRank) von der alten URL auf die
        neue zu übertragen und ihren Index zu aktualisieren. Ein 302 signalisiert dem Crawler, dass
        die Weiterleitung temporär ist, sodass er die ursprüngliche URL weiterhin indexiert. 302
        statt 301 zu verwenden, wenn Sie eine dauerhafte Weiterleitung meinen, kann den SEO-Vorteil
        von Weiterleitungen zunichte machen. Umgekehrt veranlasst das Verwenden von 301 bei einer
        temporären Weiterleitung Suchmaschinen, diese zu cachen, was die Rückgängigmachung erschwert.
      </p>

      <h2>4xx: Client-Fehlercodes</h2>
      <p>
        Diese Codes zeigen an, dass der Client eine fehlerhafte Anfrage gesendet hat. Geben Sie keine
        5xx-Codes für Client-Fehler zurück — das macht das Monitoring irreführend und erschwert die
        Unterscheidung, ob ein Problem ein Serverfehler oder eine fehlerhafte Client-Eingabe ist.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — die Anfrage ist fehlerhaft. Fehlende Pflichtfelder, ungültiges JSON, falsche Datentypen. Der allgemeinste 4xx; verwenden Sie spezifischere Codes, wenn verfügbar.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — trotz des Namens bedeutet dies „nicht authentifiziert". Der Client hat keine Anmeldedaten angegeben, oder die Anmeldedaten waren ungültig. Die Antwort sollte einen <code>WWW-Authenticate</code>-Header enthalten, der angibt, wie man sich authentifiziert. Der Name ist ein historischer Fehler — „nicht authentifiziert" wäre treffender.
        </li>
        <li>
          <strong>403 Forbidden</strong> — authentifiziert, aber nicht autorisiert. Der Server weiß, wer Sie sind (oder es ist irrelevant), und Sie haben keine Berechtigung. Anders als bei 401 hilft eine erneute Authentifizierung nicht. Verwenden Sie 403, wenn ein Benutzer versucht, auf eine Ressource zuzugreifen, für die er keine Berechtigung hat.
        </li>
        <li>
          <strong>404 Not Found</strong> — die Ressource existiert unter dieser URL nicht. Wird auch zurückgegeben, wenn ein Server die Existenz einer Ressource vor nicht autorisierten Benutzern verbergen möchte (403 würde bestätigen, dass die Ressource existiert; 404 verbirgt diese Tatsache).
        </li>
        <li>
          <strong>409 Conflict</strong> — die Anfrage steht im Widerspruch zum aktuellen Zustand der Ressource. Klassisches Beispiel: Versuch, einen Benutzer mit einer bereits vorhandenen E-Mail-Adresse zu erstellen, oder eine Ressource mit einer veralteten Version zu aktualisieren (Optimistic-Locking-Konflikt).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — die Anfrage ist syntaktisch korrekt (gültiges JSON, richtiger Content-Type), aber semantisch ungültig (ein Pflichtfeld ist vorhanden, enthält aber einen ungültigen Wert oder verstößt gegen eine Geschäftsregel). Rails hat die Verwendung von 422 für Validierungsfehler populär gemacht. Spezifischer als 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — Rate-Limit überschritten. Sollte einen <code>Retry-After</code>-Header enthalten, der dem Client mitteilt, wie lange er warten soll. Unverzichtbar für jede öffentliche API.
        </li>
      </ul>

      <h2>401 vs. 403: Der entscheidende Unterschied</h2>
      <p>
        Dies ist eines der am häufigsten verwechselten Paare:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (none)
→ 401 Unauthorized
   "You haven't told me who you are. Log in first."

GET /api/admin/users
Authorization: Bearer <valid-regular-user-token>
→ 403 Forbidden
   "I know who you are. You're not an admin. Access denied."`}
      </pre>

      <h2>5xx: Server-Fehlercodes</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — ein allgemeiner Auffang-Code für unerwartete serverseitige Fehler. Eine unbehandelte Ausnahme, eine Null-Referenz, eine Datenbankabfrage, die einen Fehler geworfen hat. Geben Sie dem Client keine Stack-Traces preis; protokollieren Sie sie serverseitig.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — der als Proxy oder Gateway fungierende Server hat eine ungültige Antwort von einem vorgelagerten Server erhalten. Häufig wenn Ihr Load-Balancer oder Reverse-Proxy die dahinterliegenden Anwendungsserver nicht erreichen kann — die App ist abgestürzt oder hört nicht auf dem richtigen Port.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — der Server kann vorübergehend keine Anfragen bearbeiten. Möglicherweise überlastet, mitten in einem Deployment oder in der Wartung. Sollte einen <code>Retry-After</code>-Header enthalten, wenn die Ausfalldauer bekannt ist.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — der Proxy oder Gateway hat keine rechtzeitige Antwort vom vorgelagerten Server erhalten. Der vorgelagerte Server ist erreichbar und antwortet, aber zu langsam. Häufiges Symptom bei Datenbankabfragen, die zu lange dauern, oder externen API-Aufrufen, die hängen bleiben.
        </li>
      </ul>

      <h2>Statuscodes im REST-API-Design</h2>
      <p>
        Die richtigen Statuscodes machen Ihre API selbstdokumentierend und leichter integrierbar.
        Einige Richtlinien:
      </p>
      <ul>
        <li>Geben Sie niemals 200 mit einem Fehlerobjekt im Body zurück. Wenn eine Anfrage fehlgeschlagen ist, sollte der Statuscode das widerspiegeln. Clients sollten allein anhand des Statuscodes erkennen können, ob sie einen Fehler behandeln müssen.</li>
        <li>Verwenden Sie 201 und einen <code>Location</code>-Header beim Erstellen von Ressourcen via POST. Damit können Clients die URL der neuen Ressource entdecken, ohne den Body zu parsen.</li>
        <li>Geben Sie 422 (nicht 400) für Validierungsfehler zurück und fügen Sie einen strukturierten Fehler-Body hinzu, der angibt, welche Felder fehlgeschlagen sind und warum.</li>
        <li>Verwenden Sie 409 für Konflikte, die eine Auflösung auf Anwendungsebene erfordern, nicht nur für fehlerhafte Eingaben.</li>
        <li>Implementieren Sie 429 mit Rate-Limiting von Anfang an bei jedem öffentlichen Endpunkt — es ist viel schwieriger, es nachträglich hinzuzufügen.</li>
      </ul>

      <h2>Statuscodes in den DevTools debuggen</h2>
      <p>
        Öffnen Sie die Registerkarte „Netzwerk" in den Browser-DevTools und suchen Sie nach roten
        Anfragen — das sind 4xx- oder 5xx-Antworten. Klicken Sie auf eine Anfrage, um den genauen
        Statuscode, die Antwort-Header (nützlich für <code>WWW-Authenticate</code>,{" "}
        <code>Location</code>, <code>Retry-After</code>) und den Antwort-Body zu sehen (der oft eine
        Fehlermeldung vom Server enthält). Aktivieren Sie bei Weiterleitungen „Log aufbewahren", damit
        das DevTools-Panel beim Seitennavigieren nicht geleert wird — sonst verpassen Sie die
        Weiterleitungskette.
      </p>
      <p>
        Wenn Sie einem unbekannten Statuscode begegnen, gibt Ihnen die{" "}
        <a href="/tools/http-status">BrowseryTools HTTP-Statuscode-Referenz</a> die offizielle
        Beschreibung, den zugehörigen RFC und Hinweise zur gängigen Verwendung — ohne Ihren
        Browser-Tab verlassen zu müssen.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenlose HTTP-Statuscode-Referenz — Alle Codes, RFC-Quellen, Verwendungshinweise
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          HTTP-Statuscode-Referenz öffnen →
        </a>
      </div>
    </div>
  );
}
