export default function Content() {
  return (
    <div>
      <p>
        Für den größten Teil der kurzen Geschichte der KI bedeutete das Verbinden eines
        Sprachmodells mit einem externen Tool, für jedes einzelne Tool benutzerdefinierten
        Integrationscode zu schreiben. Das Modell soll eine Datei lesen? Eine Funktion schreiben.
        Eine Datenbank abfragen? Eine andere Funktion schreiben, in einem anderen Format, für jedes
        Modell, das man unterstützen möchte. Das Ergebnis war ein fragmentiertes Ökosystem, in dem
        jede KI-Anwendung dieselbe Infrastruktur von Grund auf neu erfand.
      </p>
      <p>
        Model Context Protocol (MCP) ist Anthropics Antwort auf dieses Problem: ein offener Standard,
        der KI-Modellen eine einheitliche, konsistente Schnittstelle zu Tools, Dateien, Datenbanken
        und Diensten gibt. Mit dem{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP-Konfigurations-Generator</a> – kostenlos,
        keine Anmeldung, alles bleibt im Browser – können MCP-Konfigurationsdateien erstellt und
        validiert werden, ohne JSON von Hand zu schreiben.
      </p>

      <h2>Was ist MCP und warum gibt es es?</h2>
      <p>
        MCP steht für Model Context Protocol. Es ist ein offenes Protokoll – Ende 2024 von
        Anthropic veröffentlicht und unter modelcontextprotocol.io verfügbar –, das standardisiert,
        wie KI-Modelle mit externen Datenquellen und Tools kommunizieren. Man kann es sich als
        universellen Adapter vorstellen: Statt dass ein Modell ein benutzerdefiniertes Plugin für
        GitHub, ein anderes für das Dateisystem und noch ein anderes für die Datenbank benötigt,
        bietet MCP eine einzige Schnittstelle, die jeder konforme Client und Server sprechen kann.
      </p>
      <p>
        Die Analogie, die Anthropic verwendet, ist USB-C: Vor USB-C brauchte man für jedes Gerät
        ein anderes Kabel. MCP möchte dieser universelle Stecker für KI-Tool-Nutzung sein. Ein
        Tool, das einmal als MCP-Server gebaut wurde, funktioniert mit jedem MCP-kompatiblen
        Client – Claude Desktop, Claude Code und jedem anderen Host, der das Protokoll implementiert.
      </p>

      <h2>MCP-Architektur: Clients, Hosts und Server</h2>
      <p>
        MCP hat drei Komponenten, die zusammenarbeiten:
      </p>
      <ul>
        <li><strong>Host</strong> – Die KI-Anwendung, die auf dem Gerät des Nutzers läuft (z. B. Claude Desktop,
        eine IDE-Erweiterung). Der Host verwaltet Verbindungen zu einem oder mehreren MCP-Servern
        und injiziert ihre Fähigkeiten in den KI-Kontext.</li>
        <li><strong>Client</strong> – Ein Protokoll-Client, der im Host eingebettet ist und eine 1:1-Verbindung
        mit einem einzelnen MCP-Server aufrechterhält. Der Host erstellt einen Client pro Server.</li>
        <li><strong>Server</strong> – Ein leichtgewichtiges Programm, das Fähigkeiten (Tools, Ressourcen,
        Prompts) über das MCP-Protokoll exponiert. Server können lokale Prozesse (auf dem eigenen
        Gerät) oder entfernte Dienste, die über HTTP erreichbar sind, sein.</li>
      </ul>
      <p>
        Wenn man Claude bittet, „die README in meinem Projekt zu lesen", sendet der MCP-Client des
        Hosts eine Anfrage an den Dateisystem-MCP-Server, der die Datei liest und den Inhalt
        zurückgibt. Claude berührt das Dateisystem nie direkt – der Server tut es und meldet
        über das Protokoll zurück.
      </p>

      <h2>Was MCP-Server exponieren können</h2>
      <p>
        MCP-Server können drei Arten von Fähigkeiten exponieren:
      </p>
      <ul>
        <li><strong>Tools</strong> – Funktionen, die das Modell aufrufen kann. Beispiele: Datenbank durchsuchen,
        ein GitHub-Issue erstellen, einen Terminal-Befehl ausführen, eine URL abrufen.</li>
        <li><strong>Ressourcen</strong> – Daten, die das Modell lesen kann. Beispiele: Dateien, Datenbankzeilen,
        API-Antworten, Dokumentationsseiten. Ressourcen sind wie schreibgeschützte Kontextquellen.</li>
        <li><strong>Prompts</strong> – Vorgefertigte Prompt-Vorlagen, die Nutzer namentlich aufrufen können.
        Nützlich für das Exponieren standardisierter Workflows.</li>
      </ul>

      <h2>Bekannte MCP-Server im Überblick</h2>
      <ul>
        <li><strong>filesystem</strong> – Liest und schreibt Dateien auf dem lokalen Gerät innerhalb eines
        angegebenen Verzeichnisses. Der am häufigsten verwendete Server. Erforderlich für Claude Code,
        um die Codebasis zu lesen.</li>
        <li><strong>github</strong> – Durchsucht Repositories, liest Dateien, erstellt Issues und Pull Requests,
        ruft den Commit-Verlauf ab. Verwendet die GitHub-API mit einem persönlichen Access-Token.</li>
        <li><strong>postgres / sqlite</strong> – Führt SQL-Abfragen gegen eine Datenbank aus. Standardmäßig
        in den meisten Implementierungen schreibgeschützt.</li>
        <li><strong>brave-search / fetch</strong> – Ruft URLs ab oder führt Web-Suchanfragen durch, wodurch
        das Modell Zugang zu aktuellen Informationen jenseits seines Trainings erhält.</li>
        <li><strong>memory</strong> – Dauerhafter Key-Value-Speicher, der zwischen Sitzungen erhalten bleibt.
        Gibt dem Modell eine Speicherschicht, auf die es schreiben und aus der es lesen kann.</li>
        <li><strong>puppeteer / playwright</strong> – Steuert einen Headless-Browser. Ermöglicht dem Modell,
        durch Webseiten zu navigieren, Formulare auszufüllen und Inhalte von JavaScript-gerenderten
        Seiten zu extrahieren.</li>
      </ul>

      <h2>Eine einfache MCP-Konfigurations-JSON schreiben</h2>
      <p>
        Die MCP-Konfiguration liegt in einer JSON-Datei, die die Host-Anwendung beim Start liest.
        Für Claude Desktop auf macOS befindet sich diese Datei unter{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. Die Struktur
        ist konsistent, unabhängig davon, welche Server hinzugefügt werden:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
      </pre>
      <p>
        Jeder Schlüssel innerhalb von <code>mcpServers</code> ist der Name, den man dem Server gibt –
        das ist das Label, das in der Claude-UI erscheint. Die Felder <code>command</code> und{" "}
        <code>args</code> definieren, wie der Server-Prozess gestartet wird. Die meisten offiziellen
        Server sind npm-Pakete, daher lädt <code>npx -y</code> sie beim ersten Einsatz herunter
        und führt sie aus, ohne einen separaten Installationsschritt.
      </p>

      <h2>Mehrere Server hinzufügen</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}`}
      </pre>
      <p>
        Das Feld <code>env</code> übergibt Umgebungsvariablen an den Server-Prozess. Sensible Werte
        wie API-Schlüssel und Datenbank-Anmeldedaten gehören hierher, nicht hartcodiert in{" "}
        <code>args</code>, damit sie separat verwaltet werden können und ein versehentliches
        Committen in die Versionskontrolle vermieden wird.
      </p>

      <h2>MCP in Claude Code konfigurieren</h2>
      <p>
        Claude Code (das CLI-Tool) verwendet einen leicht anderen Konfigurationsmechanismus.
        MCP-Server werden mit dem Befehl <code>claude mcp add</code> hinzugefügt:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Lokalen stdio-Server hinzufügen
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Entfernten HTTP-Server hinzufügen
claude mcp add my-server --transport http http://localhost:8080/mcp

# Mit Umgebungsvariablen hinzufügen
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# Alle konfigurierten Server auflisten
claude mcp list`}
      </pre>
      <p>
        Claude Code speichert Server-Konfigurationen standardmäßig in <code>~/.claude/</code>
        (Nutzerbereich) oder in <code>.mcp.json</code> im Projektstamm (Projektbereich).
        Projektbezogene Konfigurationen sind nützlich für Team-Repositories – die{" "}
        <code>.mcp.json</code> committen und jeder im Team erhält automatisch dieselbe
        Server-Konfiguration.
      </p>

      <h2>Häufige Konfigurationsfehler</h2>
      <ul>
        <li><strong>Falsches Pfadtrennzeichen</strong> – Windows verwendet Backslashes, aber JSON-Strings
        erfordern Forward-Slashes oder escaped Backslashes. In MCP-Konfigurationen immer Forward-Slashes
        verwenden, auch unter Windows.</li>
        <li><strong>Fehlende Verzeichnisberechtigungen</strong> – Der Dateisystem-Server kann nur auf
        Verzeichnisse zugreifen, die explizit in seinen Args aufgelistet sind. Wenn Claude sagt, es kann
        eine Datei nicht finden, prüfen, ob das übergeordnete Verzeichnis der Datei in der erlaubten
        Liste steht.</li>
        <li><strong>Veralteter Server-Prozess</strong> – Wenn ein Server abstürzt, startet der Host ihn
        möglicherweise nicht automatisch neu. Claude Desktop neu starten oder{" "}
        <code>claude mcp restart &lt;name&gt;</code> in Claude Code ausführen, um eine neue
        Verbindung herzustellen.</li>
        <li><strong>Versionsunverträglichkeiten</strong> – MCP wird aktiv entwickelt. Wenn sich ein Server
        unerwartet verhält, prüfen, ob die neueste Version mit{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code> ausgeführt wird.</li>
      </ul>

      <h2>Konfiguration mit BrowseryTools generieren</h2>
      <p>
        MCP-JSON von Hand zu schreiben ist mühsam und leicht fehleranfällig – ein fehlendes Komma
        oder ein falsch quoted Pfad lässt die gesamte Konfiguration stillschweigend scheitern.
        Der{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP-Konfigurations-Generator</a> ermöglicht es,
        Server auszuwählen, die erforderlichen Parameter auszufüllen und eine gültige, formatierte
        JSON-Konfiguration zu erhalten, die in die Claude-Desktop-Konfigurationsdatei oder{" "}
        <code>.mcp.json</code> eingefügt werden kann. Alles läuft im Browser und keine
        Zugangsdaten werden gespeichert.
      </p>

      <h2>Zusammenfassung</h2>
      <p>
        MCP ist die Infrastrukturschicht, die ein eigenständiges Chat-Modell in einen vernetzten
        Agenten mit Zugang zu den eigenen tatsächlichen Dateien, Code, Datenbanken und Diensten
        verwandelt. Das Protokoll ist offen, die Server sind modular und das Konfigurationsformat
        ist unkompliziertes JSON. Ist die MCP-Konfiguration eingerichtet, erhält man einen
        dramatisch fähigeren KI-Assistenten, ohne die Art der Interaktion zu ändern – die Tools
        sind einfach da, bereit zur Verwendung.
      </p>
    </div>
  );
}
