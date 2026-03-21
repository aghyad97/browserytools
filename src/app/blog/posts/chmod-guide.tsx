export default function Content() {
  return (
    <div>
      <p>
        Every file and directory on a Linux or macOS system carries a set of permissions that controls who
        can read it, write to it, or execute it. Getting these permissions right is the difference between
        a secure server and one that leaks data or gets compromised. Yet the notation — <code>chmod 755</code>,{" "}
        <code>ls -la</code> output showing <code>-rwxr-xr--</code> — can feel opaque until you understand
        the model underneath. This guide explains Unix file permissions from first principles.
      </p>
      <p>
        You can calculate permission values and convert between octal and symbolic notation instantly with the{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> — free, no sign-up, everything runs in
        your browser.
      </p>

      <h2>The Unix Permissions Model: Owner, Group, Other</h2>
      <p>
        Unix assigns every file and directory three permission sets, each covering a different audience:
      </p>
      <ul>
        <li><strong>Owner (user)</strong> — the user account that owns the file. Typically the user who created it.</li>
        <li><strong>Group</strong> — a named group of users. The file belongs to one group; all members of that group share the group permissions.</li>
        <li><strong>Other (world)</strong> — everyone else on the system who is neither the owner nor in the group.</li>
      </ul>
      <p>
        Within each of these three sets, there are three permission bits: read (<code>r</code>), write (<code>w</code>),
        and execute (<code>x</code>). That gives nine permission bits in total, which map directly to the
        nine characters you see after the file type indicator in <code>ls -la</code> output.
      </p>

      <h2>Reading ls -la Output</h2>
      <p>
        When you run <code>ls -la</code>, each line starts with a 10-character string like{" "}
        <code>-rwxr-xr--</code>. Here is how to read it:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`-  rwx  r-x  r--
^  ^^^  ^^^  ^^^
|  |    |    └── other:  read only
|  |    └─────── group:  read + execute
|  └──────────── owner:  read + write + execute
└─────────────── file type: - = file, d = directory, l = symlink`}
      </pre>
      <p>
        A dash <code>-</code> in a permission position means that permission is not granted. So <code>r-x</code>{" "}
        means read and execute are allowed, but write is not.
      </p>

      <h2>What Read, Write, Execute Mean for Files vs Directories</h2>
      <p>
        The three permission bits mean different things depending on whether they apply to a file or a directory:
      </p>
      <ul>
        <li><strong>File read (r)</strong> — can read the file contents (<code>cat</code>, <code>less</code>, open in an editor).</li>
        <li><strong>File write (w)</strong> — can modify or truncate the file. Note: deleting a file is controlled by the parent directory's write permission, not the file's own write bit.</li>
        <li><strong>File execute (x)</strong> — can run the file as a program or script. Without this bit, <code>./script.sh</code> returns "Permission denied" even if you can read it.</li>
        <li><strong>Directory read (r)</strong> — can list the directory contents (<code>ls</code>). Without it, you know the directory exists but cannot see what is inside.</li>
        <li><strong>Directory write (w)</strong> — can create, rename, or delete files inside the directory. This is why you can delete a file you do not own if you have write access to its parent directory.</li>
        <li><strong>Directory execute (x)</strong> — can enter the directory (<code>cd</code>) and access files inside it if you know their names. This is sometimes called the "search bit." A directory with <code>r--</code> lets you list filenames but not access them; a directory with <code>--x</code> lets you access files by name but not list them.</li>
      </ul>

      <h2>Octal Notation: 755, 644, 777</h2>
      <p>
        Each permission set (owner, group, other) is three bits. Three bits can represent values from 0 to 7
        — exactly one octal digit. This is why permissions are written as three octal digits, one per audience:
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
        You never need to memorize every combination — use the{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> to check what any octal value means or to
        build the right value for your situation.
      </p>

      <h2>Symbolic Notation: u+x, g-w, o=r</h2>
      <p>
        Symbolic mode lets you modify permissions relative to their current state, without specifying all
        three sets at once. The format is <code>[who][operator][permissions]</code>:
      </p>
      <ul>
        <li><strong>Who</strong>: <code>u</code> (owner/user), <code>g</code> (group), <code>o</code> (other), <code>a</code> (all three)</li>
        <li><strong>Operator</strong>: <code>+</code> (add), <code>-</code> (remove), <code>=</code> (set exactly)</li>
        <li><strong>Permissions</strong>: <code>r</code>, <code>w</code>, <code>x</code></li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`chmod u+x script.sh       # add execute for owner only
chmod g-w config.txt      # remove write from group
chmod o=r public.html     # set other to read-only exactly
chmod a+r file.txt        # add read for everyone
chmod u=rwx,g=rx,o=       # equivalent to chmod 750`}
      </pre>

      <h2>Common Permission Patterns Explained</h2>
      <ul>
        <li><strong>755</strong> (<code>rwxr-xr-x</code>) — Standard for executables and directories. Owner can do everything; everyone else can read and execute (or enter a directory) but not write. The default for web server document root directories and public scripts.</li>
        <li><strong>644</strong> (<code>rw-r--r--</code>) — Standard for regular files. Owner can read/write; everyone else can only read. Good for web assets, configuration files that do not contain secrets, and most static content.</li>
        <li><strong>600</strong> (<code>rw-------</code>) — Owner can read/write; nobody else can do anything. Required for SSH private keys (<code>~/.ssh/id_rsa</code>). SSH will refuse to use a key file that has looser permissions.</li>
        <li><strong>700</strong> (<code>rwx------</code>) — Owner can do everything; nobody else has any access. Good for private scripts and directories containing sensitive data.</li>
        <li><strong>400</strong> (<code>r--------</code>) — Read-only for the owner; completely locked for everyone else. Used for immutable configuration files and certificates where accidental writes would be harmful.</li>
      </ul>

      <h2>Why 777 Is Dangerous</h2>
      <p>
        <code>chmod 777</code> gives read, write, and execute permission to every user on the system. This
        means any process running as any user — including a compromised web application, a malicious script
        in a shared hosting environment, or any other user on the machine — can modify or execute the file.
        In a web server context, a PHP file with 777 permissions allows any other process to overwrite it
        with malicious code. Never use 777 in production. If you are using it to "fix a permissions error,"
        the real fix is to give the right user or group ownership of the file instead.
      </p>

      <h2>Setuid, Setgid, and Sticky Bit</h2>
      <p>
        Beyond the nine standard bits, there are three special bits that appear as a fourth leading digit
        in four-digit octal notation:
      </p>
      <ul>
        <li><strong>Setuid (4xxx)</strong> — when set on an executable, the program runs with the file owner's privileges, not the caller's. <code>/usr/bin/passwd</code> uses this to let regular users write to <code>/etc/shadow</code>, which is owned by root.</li>
        <li><strong>Setgid (2xxx)</strong> — on an executable, runs with the file's group privileges. On a directory, new files created inside inherit the directory's group rather than the creator's primary group — useful for shared project directories.</li>
        <li><strong>Sticky bit (1xxx)</strong> — on a directory, prevents users from deleting files they do not own, even if they have write access to the directory. <code>/tmp</code> has the sticky bit set (<code>chmod 1777</code>) so users can create their own temp files but cannot delete each other's.</li>
      </ul>

      <h2>chmod Recursive (-R) and Real-World Examples</h2>
      <p>
        The <code>-R</code> flag applies a permission change recursively to a directory and all its contents.
        Use it with care — applying the same permissions to both files and directories is often wrong because
        directories need the execute bit to be enterable, while regular files usually should not have execute:
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
        When you are unsure what octal value to use, the{" "}
        <a href="/tools/chmod">BrowseryTools chmod Calculator</a> lets you click checkboxes for owner, group,
        and other permissions and immediately see the resulting octal value and symbolic notation.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free chmod Calculator — Octal ↔ Symbolic ↔ Human Readable
        </p>
        <a
          href="/tools/chmod"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open chmod Calculator →
        </a>
      </div>
    </div>
  );
}
