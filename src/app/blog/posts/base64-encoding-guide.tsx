export default function Content() {
  return (
    <div>
      <p>
        Open any modern web application, inspect an HTTP request, glance at a Kubernetes manifest, or peek
        inside a JWT token — Base64 is everywhere. It is one of those foundational encoding schemes that
        developers encounter constantly yet rarely stop to fully understand. This guide explains what Base64
        is, how it works at the byte level, where it is used in real-world systems, and when you should
        (and should not) reach for it.
      </p>
      <p>
        You can encode and decode any Base64 string instantly using the{" "}
        <a href="/tools/base64">BrowseryTools Base64 Encoder/Decoder</a> — free, no sign-up, and nothing
        ever leaves your browser.
      </p>

      <h2>Why Does Base64 Exist?</h2>
      <p>
        To understand Base64, you need to understand the problem it solves. In the early days of the internet,
        many communication protocols — particularly email — were designed around 7-bit ASCII text. ASCII defines
        128 characters using 7 bits per character. Binary data (images, documents, executables) uses all 8 bits
        per byte, producing byte values that had no ASCII representation and that older systems would discard,
        mangle, or interpret as control commands.
      </p>
      <p>
        The MIME (Multipurpose Internet Mail Extensions) standard, introduced in 1991 to allow email to carry
        attachments, needed a way to transmit arbitrary binary data through these 7-bit-clean channels. The
        solution was to re-encode binary data using only a safe subset of printable ASCII characters — one that
        every system agreed on and would transmit faithfully. Base64 became the standard encoding for this
        purpose, and the name describes the approach: use a set of 64 safe characters to represent any binary
        data.
      </p>

      <h2>The 64-Character Alphabet</h2>
      <p>
        Base64 uses exactly 64 characters, which is why 6 bits of input can always be represented by one
        Base64 character (2<sup>6</sup> = 64). The standard alphabet defined in RFC 4648 is:
      </p>
      <ul>
        <li>Uppercase letters <code>A</code> through <code>Z</code> — values 0 to 25</li>
        <li>Lowercase letters <code>a</code> through <code>z</code> — values 26 to 51</li>
        <li>Digits <code>0</code> through <code>9</code> — values 52 to 61</li>
        <li><code>+</code> — value 62</li>
        <li><code>/</code> — value 63</li>
      </ul>
      <p>
        A 65th character — the equals sign <code>=</code> — is used as padding but does not represent data.
        Padding ensures that the encoded output length is always a multiple of 4 characters, which simplifies
        decoding.
      </p>

      <h2>How Base64 Encoding Works: 3 Bytes → 4 Characters</h2>
      <p>
        Base64 works by taking 3 bytes of input (24 bits) and splitting them into four 6-bit groups. Each
        6-bit group maps to one character in the Base64 alphabet. Because 3 bytes become 4 characters, Base64
        encoding increases the size of the data by exactly one third (33%).
      </p>
      <p>
        Let us walk through a concrete example: encoding the ASCII string <code>"Man"</code>.
      </p>
      <p>
        Step 1 — Convert each character to its ASCII byte value and then to binary:
      </p>
      <ul>
        <li><code>M</code> = ASCII 77 = <code>01001101</code></li>
        <li><code>a</code> = ASCII 97 = <code>01100001</code></li>
        <li><code>n</code> = ASCII 110 = <code>01101110</code></li>
      </ul>
      <p>
        Step 2 — Concatenate the 24 bits into one stream:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`01001101 01100001 01101110
↓ (concatenate all 24 bits)
010011 010110 000101 101110`}
      </pre>
      <p>
        Step 3 — Map each 6-bit group to the Base64 alphabet:
      </p>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>6-bit group</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Decimal value</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64 character</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>010011</code></td>
              <td style={{padding: "10px 16px"}}>19</td>
              <td style={{padding: "10px 16px"}}><strong>T</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>010110</code></td>
              <td style={{padding: "10px 16px"}}>22</td>
              <td style={{padding: "10px 16px"}}><strong>W</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>000101</code></td>
              <td style={{padding: "10px 16px"}}>5</td>
              <td style={{padding: "10px 16px"}}><strong>F</strong></td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>101110</code></td>
              <td style={{padding: "10px 16px"}}>46</td>
              <td style={{padding: "10px 16px"}}><strong>u</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The Base64 encoding of <code>"Man"</code> is <code>TWFu</code>. You can verify this using the{" "}
        <a href="/tools/base64">BrowseryTools Base64 tool</a>. When the input length is not a multiple of 3,
        padding characters (<code>=</code> or <code>==</code>) are appended to bring the output to a multiple
        of 4 characters. For example, <code>"Ma"</code> encodes to <code>TWE=</code> and <code>"M"</code>{" "}
        encodes to <code>TQ==</code>.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Common misconception:</strong> Base64 is encoding, not encryption. The process is completely
        reversible by anyone without any key or password. Seeing Base64-encoded data in a URL, header, or
        file does not mean that data is protected in any way — it is simply a different representation of
        the same bytes. Anyone who can copy the string can decode it instantly.
      </div>

      <h2>Common Use Cases</h2>

      <h3>Embedding Images in HTML and CSS</h3>
      <p>
        Rather than making a separate HTTP request for a small image or icon, you can embed it directly
        in your HTML or CSS as a data URI. The browser decodes the Base64 string and renders the image
        without a network round-trip. This is useful for small assets like favicons, loading spinners,
        or inline icons in email templates where external URL loading may be blocked.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`/* CSS example — embedding a small PNG icon */
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}`}
      </pre>

      <h3>Binary Data in JSON APIs</h3>
      <p>
        JSON is a text format. If an API needs to transmit binary data — a file, a cryptographic key, a
        signature, an image — inside a JSON payload, it cannot include raw bytes. Base64-encoding the binary
        data turns it into a plain string that JSON can carry without issue. Many APIs that return file
        content, audio samples, or images in JSON responses use this approach.
      </p>

      <h3>HTTP Basic Authentication</h3>
      <p>
        The HTTP Basic Auth scheme sends credentials in the <code>Authorization</code> header as a Base64
        encoding of <code>username:password</code>. For example, the credentials <code>admin:secret</code>{" "}
        become the string <code>YWRtaW46c2VjcmV0</code>, and the full header looks like:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem"}}>
{`Authorization: Basic YWRtaW46c2VjcmV0`}
      </pre>
      <p>
        This is not encrypted — it is just encoded. Basic Auth must always be used over HTTPS, never over
        plain HTTP, because the credentials can be decoded trivially by anyone who intercepts the request.
      </p>

      <h3>JWT Payloads</h3>
      <p>
        JSON Web Tokens encode their header and payload using Base64URL (a URL-safe variant described below).
        The token's claims — user ID, expiry time, roles — are stored in the payload as a Base64URL-encoded
        JSON object. Again, this is not encryption: the payload is fully readable by anyone who has the token.
      </p>

      <h3>Kubernetes Secrets</h3>
      <p>
        Kubernetes stores Secret values as Base64-encoded strings in YAML manifests. Here is a real example
        of a Kubernetes Secret:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=`}
      </pre>
      <p>
        To find out what those values actually are, paste <code>YWRtaW4=</code> into the{" "}
        <a href="/tools/base64">BrowseryTools Base64 Decoder</a>. The result is <code>admin</code>. Paste{" "}
        <code>cGFzc3dvcmQxMjM=</code> and you get <code>password123</code>. Kubernetes Base64-encodes secret
        values for safe YAML formatting, not for security — the actual security comes from Kubernetes RBAC
        and at-rest encryption, not from the encoding itself.
      </p>

      <h2>The Base64URL Variant</h2>
      <p>
        Standard Base64 uses two characters that are special in URLs: <code>+</code> (which means space in
        form encoding) and <code>/</code> (which is a path separator). When Base64-encoded data needs to
        appear in a URL, query parameter, or filename, these characters cause problems.
      </p>
      <p>
        Base64URL solves this by substituting:
      </p>
      <ul>
        <li><code>+</code> is replaced with <code>-</code> (hyphen)</li>
        <li><code>/</code> is replaced with <code>_</code> (underscore)</li>
        <li>Trailing <code>=</code> padding is often omitted</li>
      </ul>
      <p>
        Base64URL is used in JWTs, OAuth tokens, and any context where the encoded string must survive URL
        transmission without percent-encoding. The{" "}
        <a href="/tools/base64">BrowseryTools Base64 tool</a> supports both standard and URL-safe variants.
      </p>

      <h2>When NOT to Use Base64</h2>
      <p>
        Base64 is the right tool in specific situations, but it is frequently misused. Here is when you should
        avoid it:
      </p>
      <ul>
        <li>
          <strong>Large files:</strong> Base64 increases data size by ~33%. A 10 MB image becomes roughly
          13.3 MB when Base64-encoded. Embedding large files as data URIs or Base64 strings in JSON slows
          down parsing, increases memory usage, and wastes bandwidth. Use direct file transfers or object
          storage URLs for anything non-trivial in size.
        </li>
        <li>
          <strong>Security:</strong> Never use Base64 as a security measure. It provides zero confidentiality.
          If data is sensitive, use actual encryption (AES-GCM, RSA, etc.).
        </li>
        <li>
          <strong>Storage:</strong> Storing binary data as Base64 in a database column wastes 33% more
          space compared to storing the raw bytes in a binary column. Use database-native binary types
          (BYTEA in PostgreSQL, BLOB in MySQL) when storing binary data at scale.
        </li>
      </ul>

      <h2>Base64 vs Hex Encoding: A Comparison</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Property</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Base64</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Hex (Base16)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Character set</strong></td>
              <td style={{padding: "12px 16px"}}>A–Z, a–z, 0–9, +, / (64 chars)</td>
              <td style={{padding: "12px 16px"}}>0–9, a–f (16 chars)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Size overhead</strong></td>
              <td style={{padding: "12px 16px"}}>~33% larger</td>
              <td style={{padding: "12px 16px"}}>~100% larger (2 chars per byte)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>Human readability</strong></td>
              <td style={{padding: "12px 16px"}}>Low — not recognizable</td>
              <td style={{padding: "12px 16px"}}>Moderate — byte-level legible</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>Common use cases</strong></td>
              <td style={{padding: "12px 16px"}}>Email attachments, JWT, data URIs, API payloads</td>
              <td style={{padding: "12px 16px"}}>Cryptographic hashes, checksums, color codes, MAC addresses</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><strong>URL-safe?</strong></td>
              <td style={{padding: "12px 16px"}}>Only with Base64URL variant</td>
              <td style={{padding: "12px 16px"}}>Yes — all characters are URL-safe</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong>Bits per character</strong></td>
              <td style={{padding: "12px 16px"}}>6 bits</td>
              <td style={{padding: "12px 16px"}}>4 bits</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Use Base64 when you need compact binary-to-text encoding and character set breadth does not create
        problems. Use hex when human inspection of individual byte values matters — hash digests, checksums,
        and cryptographic outputs are traditionally displayed in hex precisely because each hex character maps
        directly to 4 bits, making byte boundaries trivially visible.
      </p>

      <h2>Encoding and Decoding Base64 in Code</h2>
      <p>
        Most languages provide built-in Base64 support. Here are quick one-liners for common environments:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.8}}>
{`// JavaScript (browser or Node.js)
btoa("Hello, World!")         // → "SGVsbG8sIFdvcmxkIQ=="
atob("SGVsbG8sIFdvcmxkIQ==") // → "Hello, World!"

# Python
import base64
base64.b64encode(b"Hello, World!")         # → b'SGVsbG8sIFdvcmxkIQ=='
base64.b64decode(b"SGVsbG8sIFdvcmxkIQ==") # → b'Hello, World!'

# Bash
echo -n "Hello, World!" | base64
echo "SGVsbG8sIFdvcmxkIQ==" | base64 --decode`}
      </pre>
      <p>
        For quick ad-hoc encoding or decoding without writing any code, the{" "}
        <a href="/tools/base64">BrowseryTools Base64 tool</a> is the fastest option — paste your string,
        choose encode or decode, and the result appears instantly. Nothing is sent to a server.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Privacy guarantee:</strong> The BrowseryTools Base64 encoder and decoder processes everything
        locally in your browser using JavaScript. If you are encoding sensitive data — API keys, secrets,
        private configuration — it never touches a server. Your data stays on your device.
      </div>

      <h2>Encode and Decode Base64 Instantly</h2>
      <p>
        Whether you are decoding a Kubernetes secret, inspecting a JWT payload, creating a data URI for an
        inline image, or just curious what a Base64 string contains — the{" "}
        <a href="/tools/base64">BrowseryTools Base64 Encoder/Decoder</a> handles it in a single click.
        Paste your input, get your output. No ads, no sign-up, no data leaving your device.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free Base64 Encoder / Decoder — Runs 100% in Your Browser
        </p>
        <a
          href="/tools/base64"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open Base64 Tool →
        </a>
      </div>
    </div>
  );
}
