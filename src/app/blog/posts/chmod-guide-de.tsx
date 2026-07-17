import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Jede Datei und jedes Verzeichnis auf einem Linux- oder macOS-System trägt einen Satz von
        Berechtigungen, der steuert, wer sie lesen, beschreiben oder ausführen darf. Diese Berechtigungen
        richtig zu setzen entscheidet darüber, ob ein Server sicher ist oder Daten preisgibt und
        kompromittiert wird. Dennoch kann die Schreibweise — <code>chmod 755</code>,{" "}
        <code>ls -la</code>-Ausgabe mit <code>-rwxr-xr--</code> — undurchsichtig wirken, bis man das
        zugrundeliegende Modell versteht. Dieser Leitfaden erklärt Unix-Dateiberechtigungen von Grund auf.
      </p>
      <ToolCTA slug="chmod" variant="inline" />
      <p>
        Berechtigungswerte können Sie sofort berechnen und zwischen oktaler und symbolischer Notation
        umrechnen mit dem{" "}
        <a href="/tools/chmod">BrowseryTools chmod-Rechner</a> — kostenlos, ohne Anmeldung, alles läuft
        in Ihrem Browser.
      </p>

      <h2>Das Unix-Berechtigungsmodell: Eigentümer, Gruppe, Andere</h2>
      <p>
        Unix weist jeder Datei und jedem Verzeichnis drei Berechtigungssätze zu, die jeweils eine
        unterschiedliche Zielgruppe abdecken:
      </p>
      <ul>
        <li><strong>Eigentümer (user)</strong> — das Benutzerkonto, dem die Datei gehört. In der Regel der Benutzer, der sie erstellt hat.</li>
        <li><strong>Gruppe</strong> — eine benannte Gruppe von Benutzern. Die Datei gehört zu einer Gruppe; alle Mitglieder dieser Gruppe teilen die Gruppenberechtigungen.</li>
        <li><strong>Andere (world)</strong> — alle anderen auf dem System, die weder Eigentümer noch Mitglied der Gruppe sind.</li>
      </ul>
      <p>
        Innerhalb dieser drei Sätze gibt es jeweils drei Berechtigungsbits: Lesen (<code>r</code>),
        Schreiben (<code>w</code>) und Ausführen (<code>x</code>). Das ergibt insgesamt neun
        Berechtigungsbits, die direkt den neun Zeichen nach dem Dateityp-Indikator in der{" "}
        <code>ls -la</code>-Ausgabe entsprechen.
      </p>

      <h2>ls -la-Ausgabe lesen</h2>
      <p>
        Wenn Sie <code>ls -la</code> ausführen, beginnt jede Zeile mit einer 10-Zeichen-Zeichenkette
        wie <code>-rwxr-xr--</code>. So liest man sie:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── Andere:    nur Lesen
|  |    └─────── Gruppe:    Lesen + Ausführen
|  └──────────── Eigentümer: Lesen + Schreiben + Ausführen
└─────────────── Dateityp: - = Datei, d = Verzeichnis, l = Symlink`}
      </pre>
      <p>
        Ein Bindestrich <code>-</code> an einer Berechtigungsposition bedeutet, dass diese Berechtigung
        nicht gewährt wird. <code>r-x</code> bedeutet also: Lesen und Ausführen sind erlaubt, Schreiben
        nicht.
      </p>

      <h2>Was Lesen, Schreiben, Ausführen für Dateien vs. Verzeichnisse bedeutet</h2>
      <p>
        Die drei Berechtigungsbits haben unterschiedliche Bedeutungen, je nachdem ob sie für eine Datei
        oder ein Verzeichnis gelten:
      </p>
      <ul>
        <li><strong>Datei lesen (r)</strong> — Dateiinhalt lesen (<code>cat</code>, <code>less</code>, in einem Editor öffnen).</li>
        <li><strong>Datei schreiben (w)</strong> — Datei ändern oder kürzen. Hinweis: Das Löschen einer Datei wird durch die Schreibberechtigung des übergeordneten Verzeichnisses gesteuert, nicht durch das eigene Schreib-Bit der Datei.</li>
        <li><strong>Datei ausführen (x)</strong> — Datei als Programm oder Skript ausführen. Ohne dieses Bit gibt <code>./script.sh</code> „Zugriff verweigert" zurück, auch wenn Sie die Datei lesen können.</li>
        <li><strong>Verzeichnis lesen (r)</strong> — Verzeichnisinhalt auflisten (<code>ls</code>). Ohne diese Berechtigung wissen Sie, dass das Verzeichnis existiert, können aber nicht sehen, was darin ist.</li>
        <li><strong>Verzeichnis schreiben (w)</strong> — Dateien im Verzeichnis erstellen, umbenennen oder löschen. Deshalb können Sie eine Datei löschen, die Ihnen nicht gehört, wenn Sie Schreibzugriff auf das übergeordnete Verzeichnis haben.</li>
        <li><strong>Verzeichnis ausführen (x)</strong> — in das Verzeichnis wechseln (<code>cd</code>) und auf Dateien darin zugreifen, wenn Sie deren Namen kennen. Dieses Bit wird manchmal als „Such-Bit" bezeichnet. Ein Verzeichnis mit <code>r--</code> erlaubt das Auflisten von Dateinamen, aber keinen Zugriff; eines mit <code>--x</code> erlaubt den Zugriff auf Dateien nach Namen, aber kein Auflisten.</li>
      </ul>

      <h2>Oktalnotation: 755, 644, 777</h2>
      <p>
        Jeder Berechtigungssatz (Eigentümer, Gruppe, Andere) besteht aus drei Bits. Drei Bits können
        Werte von 0 bis 7 darstellen — genau eine Oktalziffer. Deshalb werden Berechtigungen als drei
        Oktalziffern geschrieben, eine pro Zielgruppe:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Bit values:  r = 4,  w = 2,  x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0

chmod 755 → owner: 7 (rwx), group: 5 (r-x), other: 5 (r-x)
chmod 644 → owner: 6 (rw-), group: 4 (r--), other: 4 (r--)
chmod 600 → owner: 6 (rw-), group: 0 (---), other: 0 (---)`}
      </pre>
      <p>
        Sie müssen keine Kombinationen auswendig lernen — nutzen Sie den{" "}
        <a href="/tools/chmod">BrowseryTools chmod-Rechner</a>, um nachzusehen, was ein Oktalwert
        bedeutet, oder um den richtigen Wert für Ihre Situation zu ermitteln.
      </p>

      <h2>Symbolische Notation: u+x, g-w, o=r</h2>
      <p>
        Im symbolischen Modus können Sie Berechtigungen relativ zum aktuellen Zustand ändern, ohne alle
        drei Sätze auf einmal anzugeben. Das Format ist <code>[Wer][Operator][Berechtigungen]</code>:
      </p>
      <ul>
        <li><strong>Wer</strong>: <code>u</code> (Eigentümer/user), <code>g</code> (Gruppe), <code>o</code> (Andere), <code>a</code> (alle drei)</li>
        <li><strong>Operator</strong>: <code>+</code> (hinzufügen), <code>-</code> (entfernen), <code>=</code> (genau setzen)</li>
        <li><strong>Berechtigungen</strong>: <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # add execute for owner only
chmod g-w config.txt      # remove write from group
chmod o=r public.html     # set other to read-only exactly
chmod a+r file.txt        # add read for everyone
chmod u=rwx,g=rx,o=       # equivalent to chmod 750`}
      </pre>

      <h2>Häufige Berechtigungsmuster erklärt</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Standard für ausführbare Dateien und Verzeichnisse. Der Eigentümer darf alles; alle anderen können lesen und ausführen (oder ein Verzeichnis betreten), aber nicht schreiben. Der Standard für Dokumentenstamm-Verzeichnisse von Webservern und öffentliche Skripte.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Standard für reguläre Dateien. Der Eigentümer kann lesen und schreiben; alle anderen können nur lesen. Geeignet für Web-Assets, Konfigurationsdateien ohne Geheimnisse und die meisten statischen Inhalte.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — Der Eigentümer kann lesen und schreiben; niemand sonst hat Zugriff. Erforderlich für private SSH-Schlüssel (<code>~/.ssh/id_rsa</code>). SSH verweigert die Verwendung einer Schlüsseldatei mit lockeren Berechtigungen.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — Der Eigentümer darf alles; niemand sonst hat Zugriff. Geeignet für private Skripte und Verzeichnisse mit sensiblen Daten.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Nur-Lesen für den Eigentümer; für alle anderen komplett gesperrt. Für unveränderliche Konfigurationsdateien und Zertifikate, bei denen versehentliches Schreiben schädlich wäre.</li>
      </ul>

      <h2>Warum 777 gefährlich ist</h2>
      <p>
        <code>chmod 777</code> gibt jedem Benutzer auf dem System Lese-, Schreib- und Ausführungsrechte.
        Das bedeutet: jeder Prozess, der als beliebiger Benutzer läuft — einschließlich einer
        kompromittierten Webanwendung, eines bösartigen Skripts in einer Shared-Hosting-Umgebung oder
        eines anderen Benutzers auf dem Rechner — kann die Datei ändern oder ausführen. In einem
        Webserver-Kontext ermöglicht eine PHP-Datei mit 777-Berechtigungen jedem anderen Prozess,
        sie mit bösartigem Code zu überschreiben. Verwenden Sie 777 nie in der Produktion. Wenn Sie
        damit einen Berechtigungsfehler beheben, ist die richtige Lösung, dem richtigen Benutzer oder
        der richtigen Gruppe die Eigentümerschaft an der Datei zu geben.
      </p>

      <h2>Setuid, Setgid und Sticky Bit</h2>
      <p>
        Neben den neun Standard-Bits gibt es drei Sonderbits, die als vierte führende Ziffer in der
        vierstelligen Oktalnotation erscheinen:
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — wenn auf einer ausführbaren Datei gesetzt, läuft das Programm mit den Rechten des Datei-Eigentümers, nicht des Aufrufers. <code>/usr/bin/passwd</code> verwendet dies, damit normale Benutzer in <code>/etc/shadow</code> schreiben können, das root gehört.</li>
        <li><strong>Setgid (2xxx)</strong> — bei einer ausführbaren Datei: läuft mit den Gruppenrechten der Datei. Bei einem Verzeichnis: neu erstellte Dateien darin erben die Gruppe des Verzeichnisses statt der primären Gruppe des Erstellers — nützlich für gemeinsame Projektverzeichnisse.</li>
        <li><strong>Sticky Bit (1xxx)</strong> — bei einem Verzeichnis: verhindert, dass Benutzer Dateien löschen, die ihnen nicht gehören, auch wenn sie Schreibzugriff auf das Verzeichnis haben. <code>/tmp</code> hat das Sticky Bit gesetzt (<code>chmod 1777</code>), damit Benutzer eigene temporäre Dateien erstellen, aber nicht die der anderen löschen können.</li>
      </ul>

      <h2>chmod rekursiv (-R) und Praxisbeispiele</h2>
      <p>
        Das Flag <code>-R</code> wendet eine Berechtigungsänderung rekursiv auf ein Verzeichnis und
        alle seine Inhalte an. Verwenden Sie es mit Bedacht — dieselben Berechtigungen auf Dateien und
        Verzeichnisse anzuwenden ist oft falsch, weil Verzeichnisse das Ausführen-Bit zum Betreten
        benötigen, reguläre Dateien aber normalerweise kein Ausführen-Bit haben sollten:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Web server: directories need 755, files need 644
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Fix SSH key permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/authorized_keys

# Make a deploy script executable
chmod +x deploy.sh`}
      </pre>
      <p>
        Wenn Sie unsicher sind, welchen Oktalwert Sie verwenden sollen, ermöglicht der{" "}
        <a href="/tools/chmod">BrowseryTools chmod-Rechner</a> das Anklicken von Checkboxen für
        Eigentümer-, Gruppen- und andere Berechtigungen und zeigt sofort den resultierenden Oktalwert
        und die symbolische Notation an.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Kostenloser chmod-Rechner — Oktal ↔ Symbolisch ↔ Klartext
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          chmod-Rechner öffnen →
        </a>
      </div>
      <ToolCTA slug="chmod" variant="card" />
    </div>
  );
}
