export default function Content() {
  return (
    <div>
      <p>
        URLs look simple from the outside — a string of text pointing to a resource. But under the hood,
        they follow a strict grammar that only allows a specific set of characters. The moment you try to
        pass a space, an ampersand, or a non-ASCII character in a URL without encoding it, things break in
        ways that can be difficult to debug. Percent-encoding (commonly called URL encoding) is the mechanism
        that makes arbitrary data safe to embed in a URL.
      </p>
      <p>
        You can encode and decode URLs instantly with the{" "}
        <a href="/tools/url-encoder">BrowseryTools URL Encoder/Decoder</a> — free, no sign-up, everything
        stays in your browser.
      </p>

      <h2>Why Special Characters Break URLs</h2>
      <p>
        The URL specification (RFC 3986) reserves certain characters for structural purposes. The <code>?</code>{" "}
        separates the path from the query string. The <code>&amp;</code> separates query parameters from each
        other. The <code>#</code> marks a fragment identifier. The <code>/</code> separates path segments.
        If your data contains any of these characters, a URL parser cannot tell the difference between your
        data and the URL structure itself.
      </p>
      <p>
        Consider a search query for <code>rock &amp; roll</code>. Naively constructing the URL gives:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/search?q=rock & roll
          ^     ^
          |     └── looks like a new parameter begins here
          └── this & splits q from a phantom second parameter`}
      </pre>
      <p>
        The parser reads <code>q=rock </code> (with a trailing space) as the first parameter, then encounters
        what looks like the start of a second parameter named <code> roll</code>. Both values are wrong. The
        correct URL is <code>/search?q=rock%20%26%20roll</code> — the space becomes <code>%20</code> and the
        ampersand becomes <code>%26</code>.
      </p>

      <h2>What Percent-Encoding Actually Does</h2>
      <p>
        Percent-encoding converts a byte to a three-character sequence: a literal percent sign followed by
        two uppercase hexadecimal digits representing the byte's value. The space character (ASCII byte 32,
        hex <code>0x20</code>) becomes <code>%20</code>. The at-sign (<code>@</code>, ASCII 64, hex{" "}
        <code>0x40</code>) becomes <code>%40</code>. The rule is:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`percent-encode(byte) = "%" + byte.toString(16).toUpperCase().padStart(2, "0")

Examples:
  space  (0x20) → %20
  @      (0x40) → %40
  [      (0x5B) → %5B
  €      (UTF-8: 0xE2 0x82 0xAC) → %E2%82%AC`}
      </pre>
      <p>
        For multi-byte Unicode characters (anything outside ASCII), the character is first encoded to UTF-8
        bytes, and then each byte is percent-encoded. The euro sign <code>€</code> is three UTF-8 bytes, so
        it becomes three percent-encoded sequences: <code>%E2%82%AC</code>.
      </p>

      <h2>Safe Characters vs Reserved Characters</h2>
      <p>
        Not every character needs encoding. RFC 3986 defines two sets that are safe to use as-is:
      </p>
      <ul>
        <li><strong>Unreserved characters</strong> — A–Z, a–z, 0–9, hyphen, underscore, period, tilde. These carry no special meaning and never need encoding.</li>
        <li><strong>Reserved characters</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>. These ARE safe in their structural positions but must be encoded when they appear as data values.</li>
      </ul>
      <p>
        Everything else — spaces, Unicode, control characters, most punctuation — must always be encoded.
      </p>

      <h2>encodeURI vs encodeURIComponent: The Critical Difference</h2>
      <p>
        JavaScript ships with two built-in encoding functions, and confusing them is one of the most common
        URL-encoding bugs in web applications.
      </p>
      <p>
        <code>encodeURI()</code> is designed to encode a complete URL. It leaves all reserved characters alone
        because they are structurally meaningful in a full URL. You would use it if you have a complete URL
        that might contain spaces or Unicode but has a valid structure:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURI("https://example.com/search?q=hello world&lang=en")
// → "https://example.com/search?q=hello%20world&lang=en"
//   ✓ space encoded, but & and ? left intact`}
      </pre>
      <p>
        <code>encodeURIComponent()</code> is designed to encode a single value — a query parameter value, a
        path segment, anything that needs to be treated as pure data. It encodes reserved characters too,
        including <code>&amp;</code>, <code>=</code>, <code>?</code>, and <code>/</code>:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`encodeURIComponent("rock & roll")
// → "rock%20%26%20roll"
//   ✓ & encoded — safe to use as a query parameter value

encodeURIComponent("https://example.com/page")
// → "https%3A%2F%2Fexample.com%2Fpage"
//   ✓ colons and slashes encoded — safe as a redirect_uri value`}
      </pre>
      <p>
        The rule of thumb: when constructing a URL, use <code>encodeURIComponent()</code> on each individual
        parameter value, never on the full URL. Use <code>encodeURI()</code> only on a complete URL that you
        want to normalize. In modern code, prefer the <code>URL</code> and <code>URLSearchParams</code> APIs
        over manual encoding — they handle encoding automatically and correctly.
      </p>

      <h2>Query String Encoding Pitfalls</h2>
      <p>
        Several subtle bugs come up repeatedly when encoding query strings. The <code>+</code> sign deserves
        special mention: in the <code>application/x-www-form-urlencoded</code> format (the format HTML forms
        submit in), a space is encoded as <code>+</code> rather than <code>%20</code>. This is a legacy
        convention that predates RFC 3986. If your backend URL-decodes using form-encoding rules and your
        frontend sends <code>%20</code>, it works fine. But if the frontend sends <code>+</code> and your
        backend decodes with RFC 3986 rules, the <code>+</code> is left as a literal plus sign — not a space.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// URLSearchParams uses application/x-www-form-urlencoded (+ for spaces)
new URLSearchParams({ q: "rock & roll" }).toString()
// → "q=rock+%26+roll"

// encodeURIComponent uses RFC 3986 (%20 for spaces)
"q=" + encodeURIComponent("rock & roll")
// → "q=rock%20%26%20roll"

// Both are valid — just be consistent on both ends`}
      </pre>

      <h2>How Form Data Gets URL-Encoded</h2>
      <p>
        When an HTML form submits with <code>method="GET"</code>, the browser serializes the form fields
        into a query string using <code>application/x-www-form-urlencoded</code>. Each field name and value
        is encoded (spaces as <code>+</code>, special characters as <code>%XX</code>), and fields are joined
        with <code>&amp;</code>. For <code>method="POST"</code> forms without a <code>enctype</code> attribute,
        the same encoding is used but the data goes in the request body instead of the URL.
      </p>
      <p>
        This is also the format <code>fetch()</code> uses when you pass a <code>URLSearchParams</code> object
        as the body, and it is what most server-side frameworks automatically decode when reading form submissions.
      </p>

      <h2>Base64 in URLs</h2>
      <p>
        Standard Base64 uses <code>+</code> and <code>/</code> — both of which have special meanings in URLs.
        When Base64-encoded data needs to appear in a URL (a common pattern for tokens, image data, or
        cryptographic signatures), use the Base64URL variant instead. It replaces <code>+</code> with{" "}
        <code>-</code> and <code>/</code> with <code>_</code>, producing a string that is safe in any URL
        position without further encoding. JWTs use this format for their header and payload segments.
      </p>

      <h2>Real-World Encoding Bugs</h2>
      <p>
        A few bug patterns that come up in production applications:
      </p>
      <ul>
        <li><strong>Double-encoding</strong> — encoding an already-encoded URL. <code>%20</code> becomes <code>%2520</code> because <code>%</code> itself gets encoded to <code>%25</code>. Always check whether a value is already encoded before encoding again.</li>
        <li><strong>Missing encodeURIComponent on redirect_uri</strong> — OAuth flows pass a <code>redirect_uri</code> as a query parameter. If it contains a <code>?</code> or <code>&amp;</code> and is not encoded, the auth server parses those characters as part of the outer URL structure, breaking the redirect.</li>
        <li><strong>Non-UTF-8 encoding</strong> — older systems or misconfigured servers sometimes percent-encode strings using ISO-8859-1 instead of UTF-8. The byte sequence for <code>é</code> differs between the two. Always enforce UTF-8 consistently on both sides.</li>
        <li><strong>Logging raw URLs</strong> — logging a URL that contains encoded user data may produce misleading logs if your log viewer decodes percent-sequences automatically, hiding what was actually sent on the wire.</li>
      </ul>

      <h2>Encode and Decode URLs Instantly</h2>
      <p>
        Whether you are debugging an OAuth redirect, constructing a query string by hand, inspecting a
        malformed API request, or just trying to understand what a percent-encoded URL actually contains —
        the{" "}
        <a href="/tools/url-encoder">BrowseryTools URL Encoder/Decoder</a> handles it instantly. Paste your
        string, choose encode or decode, and see the result immediately. No server calls, no sign-up.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free URL Encoder / Decoder — Runs 100% in Your Browser
        </p>
        <a
          href="/tools/url-encoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open URL Encoder →
        </a>
      </div>
    </div>
  );
}
