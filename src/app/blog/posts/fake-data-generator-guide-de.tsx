import Link from 'next/link';
import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jeder Entwickler stößt irgendwann an dieselbe Wand: Sie brauchen Daten zum Testen, aber echte Nutzerdaten zu
        verwenden ist ein Risiko, Lorem Ipsum ist für alles jenseits von Absatzfüllung nutzlos, und 500 Testdatensätze
        in JSON von Hand zu erstellen, ist eine Methode, einen Nachmittag zu ruinieren. Generatoren für Fake-Daten gibt
        es, um genau dieses Problem zu lösen — und der{" "}
        <Link href="/tools/fake-data">BrowseryTools Fake-Daten-Generator</Link> tut es kostenlos, lokal, ohne Konto,
        ohne Zeilenbegrenzung und ohne Abonnement.
      </p>
      <ToolCTA slug="fake-data" variant="inline" />
      <p>
        Dieser Leitfaden behandelt, warum realistische Fake-Daten wichtig sind, was der Generator erzeugt, wie Sie ihn
        in verschiedenen Arbeitsabläufen wirksam einsetzen und wie Sie die Ausgabe in jede gängige Datenbank und
        Toolchain importieren.
      </p>

      <h2>Warum Sie keine echten Nutzerdaten zum Testen verwenden können</h2>
      <p>
        Produktionsdaten in Entwicklungs- oder Testumgebungen zu verwenden, ist unter mehreren regulatorischen Rahmen
        ein Compliance- und Rechtsrisiko:
      </p>
      <ul>
        <li>
          <strong>DSGVO (Europa):</strong> Artikel 25 verlangt Datenminimierung durch Technikgestaltung. Echte
          Nutzerdatensätze — Namen, E-Mails, Adressen — in eine Staging-Datenbank zu kopieren, verstößt gegen dieses
          Prinzip, sofern die Daten nicht ordnungsgemäß anonymisiert wurden. Eine Verletzung dieser Staging-Umgebung
          legt die Daten echter Personen offen.
        </li>
        <li>
          <strong>HIPAA (US-Gesundheitswesen):</strong> Geschützte Gesundheitsinformationen (PHI) dürfen in
          Testumgebungen nicht verwendet werden, ohne entweder ein Business Associate Agreement oder eine
          ordnungsgemäße De-Identifikation nach der Safe-Harbor- oder Expert-Determination-Methode. Echte
          Patientendatensätze in einer Dev-Datenbank zu verwenden, ist ein direkter HIPAA-Verstoß.
        </li>
        <li>
          <strong>CCPA (Kalifornien):</strong> Personenbezogene Informationen von Einwohnern Kaliforniens unterliegen
          spezifischen Rechten und Beschränkungen. Echte Kundendatensätze in einem nicht-produktiven Kontext ohne
          angemessene Kontrollen zu verwenden, schafft eine unnötige Risikoexposition.
        </li>
      </ul>
      <p>
        Über die Compliance hinaus gibt es praktische technische Gründe, echte Daten in Tests zu meiden: Echte Daten
        sind auf unvorhersehbare Weise unordentlich (sie haben Null-Felder, Sonderzeichen und Unicode, für deren
        Handhabung Tests möglicherweise nicht geschrieben wurden), sie ändern sich im Laufe der Zeit (was Tests
        nicht-deterministisch macht), und sie enthalten Werte, die versehentlich echte Nebenwirkungen auslösen können
        (E-Mails an echte Adressen senden, echte Zahlungsmethoden belasten).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Die sicherere Standardwahl:</strong> Erzeugen Sie realistische Fake-Daten für jede nicht-produktive
        Umgebung. Sie sind strukturell gültig, niemals identifizierbar, sicher in die Versionskontrolle einzuchecken und
        reproduzierbar. Echte Daten in Dev-/Testumgebungen sind standardmäßig ein Risiko.
      </div>

      <h2>Warum Lorem Ipsum das falsche Werkzeug für Daten ist</h2>
      <p>
        Lorem Ipsum ist gut, um Textblöcke in einem Layout-Mockup zu füllen. Es ist völlig falsch zum Testen
        datengetriebener Benutzeroberflächen und APIs, weil:
      </p>
      <ul>
        <li>
          Es testet reale Feldlängen nicht unter Belastung. E-Mail-Adressen, Telefonnummern und Postleitzahlen haben
          alle spezifische Formate und Maximallängen. „Lorem ipsum dolor sit amet" in einem E-Mail-Feld wird nicht
          aufdecken, dass Ihre Eingabevalidierung falsch ist, aber{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> wird es.
        </li>
        <li>
          Es deckt keine Randfälle in Ihrer Benutzeroberfläche auf. Ein Name wie „José García-López" testet Ihre
          Zeichenkodierung. Ein Firmenname wie „O'Brien & Associates, LLC" testet Ihr SQL-Escaping. „Lorem ipsum" testet
          keines von beidem.
        </li>
        <li>
          Es lässt Ihre Mockups und Prototypen auf eine Weise unecht aussehen, die von Bedeutung ist. Stakeholder, die
          einen Prototyp mit realistischen Namen, realistischen Städten und realistischen E-Mail-Adressen begutachten,
          können das Design richtig beurteilen. Platzhaltertext zerstört die Illusion und erschwert es, tatsächliche
          Usability-Probleme zu erkennen.
        </li>
      </ul>

      <h2>Was der BrowseryTools Fake-Daten-Generator erzeugt</h2>
      <p>
        Der Generator unterstützt eine breite Palette von Feldtypen über mehrere Kategorien hinweg. Sie wählen aus,
        welche Felder einbezogen werden, und jeder erzeugte Datensatz enthält realistische, ordnungsgemäß formatierte
        Werte für jedes ausgewählte Feld:
      </p>

      <h3>Persönliche Informationen</h3>
      <ul>
        <li><strong>Vollständiger Name</strong> — kulturell realistische Kombinationen aus Vor- und Nachname</li>
        <li><strong>Vorname</strong> und <strong>Nachname</strong> getrennt (nützlich, wenn Ihr Schema sie in verschiedenen Spalten speichert)</li>
        <li><strong>E-Mail-Adresse</strong> — ordnungsgemäß formatiert, mit dem erzeugten Namen als lokalem Teil</li>
        <li><strong>Telefonnummer</strong> — US-Format mit Vorwahl</li>
        <li><strong>Geburtsdatum</strong> — erzeugt Erwachsene zwischen 18 und 80 Jahren</li>
        <li><strong>Geschlecht</strong> — männlich / weiblich / nicht-binär</li>
      </ul>

      <h3>Adresse</h3>
      <ul>
        <li><strong>Straßenanschrift</strong> — realistische Hausnummer und Straßenname</li>
        <li><strong>Stadt</strong> — echte US-amerikanische und internationale Städtenamen</li>
        <li><strong>Bundesland/Region</strong> — US-Bundesstaaten und internationale Entsprechungen</li>
        <li><strong>Land</strong></li>
        <li><strong>PLZ / Postleitzahl</strong> — das Format entspricht dem ausgewählten Land</li>
      </ul>

      <h3>Internet &amp; Identität</h3>
      <ul>
        <li><strong>Benutzername</strong> — aus dem Namen erzeugt, mit angehängten Zahlen für Realismus</li>
        <li><strong>URL</strong> — realistische persönliche oder Unternehmens-Website-URLs</li>
        <li><strong>IP-Adresse</strong> — gültige IPv4-Adressen in öffentlichen Bereichen</li>
        <li><strong>User-Agent</strong> — echte Browser-User-Agent-Zeichenketten gängiger Browser</li>
      </ul>

      <h3>Finanzen</h3>
      <ul>
        <li>
          <strong>Kreditkartennummer</strong> — besteht die Luhn-Algorithmus-Validierung, sodass sie von
          Formatprüfern nicht abgelehnt wird; verwendet realistische Kartennummer-Präfixe (Visa 4xxx, Mastercard 5xxx),
          ist aber keine echte Kartennummer
        </li>
        <li><strong>IBAN</strong> — gültiges Format für europäische Bankkontonummern</li>
      </ul>

      <h3>Kennungen &amp; Systemfelder</h3>
      <ul>
        <li><strong>UUID</strong> — v4-UUID für Datenbank-Primärschlüssel und Korrelations-IDs</li>
        <li><strong>SSN</strong> — Format der US-Sozialversicherungsnummer (XXX-XX-XXXX)</li>
        <li><strong>Daten</strong> und <strong>Zufallszahlen</strong> innerhalb konfigurierbarer Bereiche</li>
      </ul>

      <h2>So nutzen Sie den Generator</h2>
      <p>
        Öffnen Sie <Link href="/tools/fake-data">/tools/fake-data</Link>. Die Oberfläche bietet Ihnen drei Steuerelemente:
      </p>
      <ol>
        <li>
          <strong>Wählen Sie Ihre Felder:</strong> Aktivieren Sie die Kontrollkästchen für jeden Feldtyp, den Sie in der
          Ausgabe haben möchten. Sie können so wenig wie ein Feld auswählen (zum Beispiel nur E-Mail-Adressen) oder den
          vollständigen Satz für umfassende Nutzerdatensätze.
        </li>
        <li>
          <strong>Legen Sie die Datensatzanzahl fest:</strong> Geben Sie eine Zahl zwischen 1 und 1.000 ein. Für
          Seed-Daten zum Lasttest verwenden Sie 1.000. Für eine Storybook-Story oder ein Design-Mockup reichen 5–10
          Datensätze in der Regel aus.
        </li>
        <li>
          <strong>Wählen Sie das Ausgabeformat:</strong> Wählen Sie JSON oder CSV. JSON eignet sich besser für
          API-Tests und JavaScript-Toolchains. CSV eignet sich besser für Datenbankimporte, die Tabellenprüfung oder
          Tools wie Postman.
        </li>
      </ol>
      <p>
        Klicken Sie auf „Generieren". Die Ausgabe erscheint im Textbereich darunter. Verwenden Sie die Schaltfläche
        „Kopieren", um sie in Ihre Zwischenablage zu kopieren, oder „Download", um die Datei lokal zu speichern. Die
        Erzeugung ist für bis zu 1.000 Datensätze augenblicklich — die gesamte Berechnung erfolgt in Ihrem Browser.
      </p>

      <h2>JSON-Ausgabebeispiel</h2>
      <p>
        Hier ist ein repräsentatives Snippet mit 3 Datensätzen JSON-Ausgabe, bei dem persönliche, Adress- und
        Internet-Felder ausgewählt sind:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`[
  {
    "id": "a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e",
    "firstName": "Meredith",
    "lastName": "Okafor",
    "email": "meredith.okafor47@mailbox.net",
    "phone": "(312) 554-8821",
    "dateOfBirth": "1988-03-14",
    "gender": "female",
    "street": "2841 Birchwood Drive",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "United States",
    "username": "meredith_okafor88",
    "ipAddress": "74.125.224.18"
  },
  {
    "id": "b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f",
    "firstName": "Derek",
    "lastName": "Nascimento",
    "email": "d.nascimento@webfrontier.io",
    "phone": "(415) 703-2294",
    "dateOfBirth": "1995-11-02",
    "gender": "male",
    "street": "509 Elmwood Court",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "United States",
    "username": "derek_n95",
    "ipAddress": "192.0.2.147"
  },
  {
    "id": "c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a",
    "firstName": "Simone",
    "lastName": "Bertrand",
    "email": "simone.bertrand@alphamail.com",
    "phone": "(617) 889-4471",
    "dateOfBirth": "1979-07-28",
    "gender": "female",
    "street": "77 Harborview Terrace",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "United States",
    "username": "simone_b79",
    "ipAddress": "203.0.113.42"
  }
]`}</code></pre>

      <h2>CSV-Ausgabebeispiel</h2>
      <p>
        Dieselben Daten im CSV-Format, bereit zum Import in eine Tabellenkalkulation, eine Datenbank oder jedes Tool,
        das getrennte Dateien akzeptiert:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Praxisbeispiel 1: Befüllen einer Nutzerdatenbank für Lasttests</h2>
      <p>
        Das Lasttesten einer nutzerseitigen API erfordert eine befüllte Datenbank. Sie benötigen genügend Datensätze, um
        realistische Abfrageleistung, Paginierungsverhalten und Suchindizierung zu simulieren — aber Sie können keine
        echten Nutzerdaten verwenden, und Tausende von SQL-Inserts von Hand zu erstellen, ist nicht praktikabel.
      </p>
      <p>
        Erzeugen Sie mit dem Fake-Daten-Generator 1.000 Datensätze mit allen nutzerrelevanten Feldern, laden Sie sie als
        CSV herunter und importieren Sie sie dann direkt in Ihre Datenbank:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: import CSV directly into users table
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- MySQL equivalent:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (using mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Praxisbeispiel 2: Befüllen einer Storybook-Story oder eines Design-Mockups</h2>
      <p>
        Beim Erstellen einer UI-Komponente — einer Nutzertabelle, einer Kontaktkarte, einer Suchergebnisliste — prägen
        die Daten, gegen die Sie testen, ob Sie echte Probleme erkennen. Eine Tabelle mit 10 Nutzern, bei der einer einen
        sehr langen Namen hat, einer ein internationales Zeichen in seiner E-Mail und einer eine Stadt, die auf zwei
        Zeilen umbricht, deckt Layout-Fehler auf, die eine Tabelle mit identischen Platzhalterzeilen niemals zeigen
        würde.
      </p>
      <p>
        Erzeugen Sie 10–20 Datensätze als JSON und fügen Sie die Ausgabe direkt in Ihre Storybook-Story oder
        Komponenten-Fixture-Datei ein:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Paste generated JSON directly from BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... more records
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Praxisbeispiel 3: Fixtures für API-Integrationstests</h2>
      <p>
        Integrationstests für einen API-Endpunkt, der Nutzerdatensätze erstellt oder aktualisiert, benötigen einen
        zuverlässigen, deterministischen Satz von Eingabedaten. Anstatt Fixture-Objekte von Hand zu schreiben, erzeugen
        Sie einmal einen Satz von Datensätzen, speichern die JSON-Datei in Ihrem Test-Fixtures-Verzeichnis und
        importieren sie in Ihren Tests:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — generated by BrowseryTools, committed to version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('creates user with valid data (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Import in Postman-Collections</h2>
      <p>
        Für API-Tests mit Postman erzeugen Sie Ihre Testdatensätze als JSON und verwenden die Datendatei-Funktion von
        Postman, um eine Anfrage einmal pro Datensatz auszuführen. Speichern Sie die JSON-Ausgabe als Datei, dann in
        Postman: Öffnen Sie den Collection Runner, wählen Sie die Anfrage und hängen Sie die JSON-Datei als „Data"-Quelle
        an. Postman iteriert durch jeden Datensatz und setzt die Werte mithilfe von{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code> und ähnlicher Variablensyntax in Ihren Anfragerumpf
        ein.
      </p>
      <p>
        Das verwandelt eine von Hand geschriebene POST-Anfrage in einen automatisierten Test, der in Sekunden gegen 100
        verschiedene realistische Nutzerdatensätze läuft — ohne dass irgendein Test-Framework eingerichtet werden muss.
      </p>

      <h2>BrowseryTools vs. Mockaroo</h2>
      <p>
        Mockaroo ist der bekannteste Online-Generator für Fake-Daten. Es ist ein solides Werkzeug, hat aber Reibung,
        die BrowseryTools vollständig beseitigt:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimension</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (kostenlos)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Konto erforderlich", "Nein", "Ja"],
              ["Zeilenbegrenzung (kostenlos)", "1.000 pro Erzeugung", "1.000/Tag insgesamt"],
              ["Abonnement für mehr nötig", "Nein", "Ja (50 $/Jahr)"],
              ["Daten auf einen Server hochgeladen", "Niemals", "Ja (Schema + Daten)"],
              ["API-Zugriff", "Nicht zutreffend", "Nur kostenpflichtige Pläne"],
              ["Funktioniert offline", "Ja (nach Seitenladen)", "Nein"],
              ["Ausgabeformate", "JSON, CSV", "JSON, CSV, SQL, Excel und mehr"],
              ["Vielfalt der Feldtypen", "Gängige Typen abgedeckt", "Sehr umfangreich"],
            ].map(([dim, bt, moc], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{dim}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{moc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Wenn Sie hochspezialisierte Feldtypen oder SQL-Ausgabe benötigen, bleibt Mockaroo wertvoll. Für den häufigen
        Fall — die Erzeugung realistischer JSON- oder CSV-Daten für Nutzerdatensätze — erfordert BrowseryTools keine
        Kontoeinrichtung, keine Verwaltung von Tageslimits und keine Sorge darüber, dass Ihr Datenschema an einen
        Drittanbieterserver gesendet wird.
      </p>

      <h2>Datenschutz: Die gesamte Erzeugung erfolgt lokal</h2>
      <p>
        Jeder Name, jede E-Mail, jede Adresse und jede UUID, die der Generator erzeugt, wird von JavaScript erstellt,
        das in Ihrem Browser-Tab läuft. Die von Ihnen ausgewählten Feldtypen, die Anzahl der angeforderten Datensätze
        und die Ausgabedaten selbst werden niemals an einen Server übertragen. BrowseryTools hat keine
        Backend-Komponente, die an der Datenerzeugung beteiligt ist.
      </p>
      <p>
        Das ist weniger wichtig, wenn man speziell Fake-Daten erzeugt (da diese per Definition allesamt fiktiv sind),
        aber es ist wichtig für das Schema, gegen das Sie sie testen. Wenn Ihre Feldauswahl die Struktur eines sensiblen
        internen Systems offenbart, bleibt auch diese Information lokal.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Fake-Daten vs. Datenanonymisierung:</strong> Das sind getrennte Werkzeuge für getrennte Zwecke. Ein
        Fake-Daten-Generator erstellt fiktive Datensätze von Grund auf — nichts basiert auf echten Personen. Ein
        Datenanonymisierungs-Tool nimmt echte Datensätze und transformiert sie, um identifizierende Informationen zu
        entfernen, während statistische Eigenschaften erhalten bleiben. Wenn Sie echte Nutzerdaten haben, die Sie in
        einer Testumgebung verwenden müssen, ist Anonymisierung das geeignete Werkzeug (sehen Sie sich Tools wie ARX,
        Amnesia oder PostgreSQLs pg_anonymizer an). Wenn Sie Testdaten von Grund auf benötigen und keine echten Daten
        haben, auf denen Sie aufbauen können, ist ein Fake-Daten-Generator wie dieser genau richtig.
      </div>

      <h2>Erzeugen Sie jetzt Ihren ersten Datensatz</h2>
      <p>
        Ob Sie eine Lasttest-Datenbank befüllen, eine Storybook-Story bestücken, API-Test-Fixtures schreiben oder einfach
        eine Funktion mit etwas vorführen, das echt aussieht — realistische Fake-Daten sind die richtige Grundlage, und
        sie zu erzeugen sollte 30 Sekunden dauern.
      </p>
      <p>
        Öffnen Sie den <Link href="/tools/fake-data">BrowseryTools Fake-Daten-Generator</Link>, wählen Sie Ihre Felder,
        legen Sie Ihre Datensatzanzahl fest, wählen Sie JSON oder CSV und klicken Sie auf Generieren. Kein Konto, keine
        Zeilenbegrenzung, keine Kosten, nichts irgendwohin hochgeladen.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Erzeugen Sie realistische Testdaten in Sekunden</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Bis zu 1.000 Datensätze. JSON oder CSV. Namen, E-Mails, Adressen, UUIDs, Kreditkarten und mehr.
          Kostenlos, lokal, kein Konto erforderlich.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Fake-Daten-Generator öffnen →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Verwandte Tools:{" "}
        <Link href="/tools/json-formatter">JSON-Formatierer</Link> ·{" "}
        <Link href="/tools/uuid-generator">UUID-Generator</Link> ·{" "}
        <Link href="/tools/regex-tester">Regex-Tester</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV zu JSON</Link> ·{" "}
        <Link href="/">Alle BrowseryTools</Link>
      </p>
      <ToolCTA slug="fake-data" variant="card" />
    </div>
  );
}
