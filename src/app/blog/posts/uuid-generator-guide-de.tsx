import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jeder Datenbankdatensatz, jede API-Ressource, jedes verteilte Ereignis und jedes Session-Token
        benötigt einen eindeutigen Bezeichner. Die Wahl des ID-Formats ist wichtiger, als es zunächst
        scheint — sie beeinflusst Sicherheit, Datenbankleistung, URL-Lesbarkeit und das Verhalten Ihres
        Systems, wenn Sie später mehrere Server betreiben oder Daten aus verschiedenen Quellen
        zusammenführen. Dieser Leitfaden behandelt die wichtigsten Optionen: UUIDs (v1, v4, v7),
        NanoIDs und CUIDs sowie den richtigen Einsatzzeitpunkt für jede Variante.
      </p>
      <ToolCTA slug="uuid-generator" variant="inline" />
      <p>
        UUIDs und andere eindeutige IDs können Sie sofort mit dem{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID-Generator</a> erzeugen — kostenlos, ohne
        Anmeldung, alles wird lokal in Ihrem Browser generiert.
      </p>

      <h2>Warum Auto-Increment-IDs an Grenzen stoßen</h2>
      <p>
        Sequentielle Ganzzahl-IDs (<code>1, 2, 3, ...</code>) sind in den meisten relationalen
        Datenbanken der Standard und funktionieren gut für einfache Einzelserver-Anwendungen. Bei
        größeren Systemen oder verteilten Architekturen entstehen jedoch Probleme:
      </p>
      <ul>
        <li><strong>Vorhersehbarkeit</strong> — wer eine ID kennt, kann andere erraten. <code>/orders/1042</code> macht deutlich, dass Bestellung 1041 existiert und dass Ihr Unternehmen nicht besonders groß ist. Das ist eine IDOR-Schwachstelle (Insecure Direct Object Reference), wenn keine Autorisierung auf Anwendungsebene durchgesetzt wird.</li>
        <li><strong>Merge-Konflikte</strong> — müssen Sie Daten aus zwei Datenbanken zusammenführen, kollidieren zwei separate Auto-Increment-Sequenzen. Multi-Tenant-Systeme, Offline-First-Apps und Migrationen stoßen alle auf dieses Problem.</li>
        <li><strong>Verteilte Generierung</strong> — wenn mehrere Server oder Worker Datensätze einfügen, benötigen Sie einen Koordinationsmechanismus (eine einzelne Sequenz oder eine datenbankweite Sequenz), um doppelte IDs zu vermeiden. Das schafft einen Engpass.</li>
        <li><strong>Offenlegung von Geschäftskennzahlen</strong> — sequentielle IDs verraten Bestellvolumen, Nutzerzahl und Wachstumsrate an Mitbewerber oder Forscher, die öffentliche IDs über die Zeit beobachten.</li>
      </ul>

      <h2>Was ist eine UUID?</h2>
      <p>
        Eine UUID (Universally Unique Identifier, auch GUID genannt) ist eine 128-Bit-Zahl, die
        üblicherweise als 32 hexadezimale Ziffern in fünf durch Bindestriche getrennte Gruppen
        dargestellt wird:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Example: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 hex digits (48 bits)
          |        |    |    variant bits (N)
          |        |    version digit (M)
          |        4 hex digits
          8 hex digits`}
      </pre>
      <p>
        Die Versionsziffer (M) gibt Auskunft über den verwendeten UUID-Generierungsalgorithmus. Die
        Variantenbits (N) sind in Standard-UUIDs immer <code>8</code>, <code>9</code>, <code>a</code>{" "}
        oder <code>b</code>. Die verbleibenden 122 Bits stehen für die eigentlichen Bezeichnerdaten
        zur Verfügung.
      </p>

      <h2>UUID v1: MAC-Adresse + Zeitstempel</h2>
      <p>
        UUID v1 kombiniert den aktuellen Zeitstempel (in 100-Nanosekunden-Intervallen seit dem
        15. Oktober 1582) mit der MAC-Adresse des generierenden Rechners und einer Taktsequenz für die
        schnelle Generierung. Das Ergebnis ist theoretisch auf allen Rechnern und zu allen Zeiten
        eindeutig.
      </p>
      <p>
        Das Problem: v1-UUIDs verraten sowohl den Zeitpunkt als auch den Ort ihrer Generierung — die
        MAC-Adresse ist im Klartext eingebettet. Das ist ein Datenschutzproblem und wurde beim
        Melissa-Wurm (1999) ausgenutzt, um infizierte Dokumente bis zu bestimmten Rechnern
        zurückzuverfolgen. Aus diesem Grund wird v1 in neuen Anwendungen kaum noch verwendet. Wer
        zeitgeordnete IDs möchte, greift heute stattdessen auf v7 zurück.
      </p>

      <h2>UUID v4: Zufällig</h2>
      <p>
        UUID v4 ist die am weitesten verbreitete Variante. Sie besteht aus 122 Bits kryptografisch
        zufälliger Daten (die verbleibenden 6 Bits kodieren Version und Variante). Kein Zeitstempel,
        keine MAC-Adresse, keine sequentielle Komponente — nur Entropie.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Node.js 14.17+
const { randomUUID } = require('crypto');
randomUUID(); // → "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

// Browser
crypto.randomUUID(); // → "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

// Python
import uuid
str(uuid.uuid4()) # → "3d6f4580-2b3e-44e4-9d40-2d0ab12b4e7e"`}
      </pre>

      <h2>Wie unwahrscheinlich sind UUID-v4-Kollisionen?</h2>
      <p>
        Mit 122 Bits Zufälligkeit ist die Kollisionswahrscheinlichkeit außerordentlich gering. Um eine
        50-prozentige Wahrscheinlichkeit für mindestens eine Kollision zu erreichen, müssten Sie
        ungefähr 2,7 × 10<sup>18</sup> UUIDs generieren — das sind 2,7 Quintillionen. Wenn Sie eine
        Milliarde UUIDs pro Sekunde generieren würden, würde es etwa 85 Jahre dauern, diesen Schwellenwert
        zu erreichen. Für jede reale Anwendung sind Kollisionen kein praktisches Problem. Die
        wahrscheinlichere Quelle doppelter IDs sind Anwendungsfehler (Copy-Paste-Fehler, Cache-Treffer
        mit alten IDs usw.), nicht der Generator selbst.
      </p>

      <h2>UUID v7: Zeitgeordnet und zufällig</h2>
      <p>
        UUID v7 wurde in RFC 9562 (2024) standardisiert, um den wichtigsten praktischen Nachteil von
        v4 zu beheben: Zufällige UUIDs sind schlechte Datenbankprimärschlüssel, weil sie die
        Indexlokalität zerstören. Werden Datensätze mit zufälligen IDs eingefügt, landet jede Einfügung
        an einer zufälligen Position in einem B-Baum-Index, was bei größeren Datenmengen zu
        Seitenaufteilungen, Cache-Fehltreffern und Fragmentierung führt.
      </p>
      <p>
        UUID v7 bettet einen Unix-Zeitstempel mit Millisekunden-Genauigkeit in die signifikantesten
        Bits ein, gefolgt von Zufallsdaten. Dadurch sind v7-UUIDs sortierbar — chronologisch eingefügte
        Datensätze haben lexikografisch steigende IDs — und gleichzeitig global eindeutig und über die
        Millisekundengrenze hinaus unvorhersehbar:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v7 structure:
[48 bits: Unix ms timestamp][4 bits: version=7][12 bits: random][2 bits: variant][62 bits: random]

Three v7 UUIDs generated in sequence:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← earliest
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← slightly later
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← latest
  ^^^^^^^^^^ timestamp prefix increases monotonically`}
      </pre>
      <p>
        Wenn Sie eine neue Anwendung entwickeln, die UUIDs als Primärschlüssel in einer relationalen
        Datenbank verwendet, ist v7 ab 2024 die richtige Standardwahl.
      </p>

      <h2>NanoID: Kürzer und URL-sicher</h2>
      <p>
        NanoID ist keine UUID — es ist ein anderes ID-Format, das jedoch dasselbe Problem löst.
        Standardmäßig erzeugt es eine 21-Zeichen-Zeichenkette mit einem Alphabet aus URL-sicheren
        Zeichen (<code>A-Za-z0-9_-</code>). Das ergibt 126 Bits Entropie — vergleichbar mit UUID v4 —
        in einer Zeichenkette mit 21 statt 36 Zeichen. NanoID-Strings sind URL-freundlich ohne weitere
        Kodierung und sehen in Logs und nutzersichtigen URLs sauberer aus:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 chars)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 chars)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (custom length)`}
      </pre>
      <p>
        NanoID ist beliebt für Kurzlink-IDs, Session-Tokens, Einladungscodes und alle Anwendungsfälle,
        bei denen die ID in einer URL erscheint und kompakt sein soll.
      </p>

      <h2>CUID2: Sortierbar und ohne Fingerabdruck</h2>
      <p>
        CUID2 (der Nachfolger von CUID) wurde speziell für den Einsatz als Datenbankprimärschlüssel
        entwickelt. Es erzeugt eine 24-Zeichen-Zeichenkette, die nach Erstellungszeit sortierbar ist,
        keine MAC-Adresse oder Fingerabdruck verwendet und schwieriger vorherzusagen ist als zeitbasierte
        IDs. CUID2 verwendet SHA-3 intern, um den Zeitstempel mit Zufallsdaten zu vermischen, was die
        Ausgabe auch bei gleichzeitiger Generierung im selben Millisekunden-Intervall unvorhersehbar
        macht.
      </p>
      <p>
        CUID2 ist eine gute Wahl, wenn Sie sortierbare IDs möchten, das UUID-Format vollständig
        vermeiden wollen und Wert darauf legen, dass die ID undurchsichtig ist (keine
        Zeitstempelinformationen direkt preisgibt).
      </p>

      <h2>Das richtige Format wählen</h2>
      <ul>
        <li><strong>Datenbankprimärschlüssel, neues Projekt</strong> — UUID v7 oder CUID2. Beide sind sortierbar, was die Indexleistung beim Datenwachstum gesund hält.</li>
        <li><strong>Allzweck-Eindeutigkeit, Interoperabilität</strong> — UUID v4. Jede Sprache und jedes Framework versteht das UUID-Format nativ.</li>
        <li><strong>Kurzlinks, Einladungscodes, URL-Tokens</strong> — NanoID. Kompakt, URL-sicher, konfigurierbare Länge.</li>
        <li><strong>Verteilte Systeme mit clientseitig generierten IDs</strong> — UUID v4 oder v7. Keine Koordination notwendig; Clients generieren ihre eigenen IDs vor dem Server-Commit.</li>
        <li><strong>v1 vermeiden</strong> — es gibt Ihre MAC-Adresse preis. Kein neues Projekt sollte es verwenden.</li>
      </ul>

      <h2>UUID als Primärschlüssel: Leistungsaspekte</h2>
      <p>
        Die klassische Warnung „Verwenden Sie keine UUIDs als Primärschlüssel" bezieht sich speziell
        auf zufällige UUIDs (v4) in MySQL mit InnoDB oder in jeder Datenbank, die Daten nach
        Primärschlüssel clustert. Zufällige Einfügereihenfolge fragmentiert den geclusterten Index.
        In PostgreSQL mit einem nicht-geclusterten UUID-Index ist die Einbuße weniger schwerwiegend,
        aber bei großem Datenvolumen dennoch real. Die praktische Lösung: Verwenden Sie UUID v7 oder
        CUID2 (die monoton ansteigen), und das Fragmentierungsproblem verschwindet weitgehend.
        Nutzen Sie den{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID-Generator</a>, um v7-UUIDs zum Testen
        Ihres Schemas zu generieren, bevor Sie sich auf ein Format festlegen.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser UUID-Generator — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          UUID-Generator öffnen →
        </a>
      </div>
      <ToolCTA slug="uuid-generator" variant="card" />
    </div>
  );
}
