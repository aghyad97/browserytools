import Link from 'next/link';

export default function Content() {
  return (
    <div>

      <p>
        Every developer accumulates a mental list of go-to sites for quick tasks: decode that Base64 string, validate this JSON blob, check what that JWT actually contains. The problem is that list usually includes a dozen different sites — each with their own cookie banners, sign-up prompts, and privacy questions.
      </p>

      <p>
        <strong>BrowseryTools</strong> consolidates the most essential developer utilities into a single, fast, privacy-first suite. Everything runs locally in your browser. No uploads. No API keys. No rate limits. This guide walks through each tool and shows you exactly when and why you'd reach for it.
      </p>

      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Why browser tools beat npm packages and cloud APIs:</strong> Installing an npm package takes time, adds to your dependency tree, requires Node.js to be available, and may have security vulnerabilities in its dependency chain. Cloud APIs require authentication, have rate limits, and introduce latency. A browser tool is instant, zero-dependency, and works the same on every machine.
      </div>

      <h2>JSON Formatter &amp; Validator</h2>

      <p>
        JSON is the lingua franca of modern APIs. When you're staring at a minified 3KB blob returned by an endpoint, the <Link href="/tools/json-formatter">JSON Formatter</Link> makes it instantly readable.
      </p>

      <h3>What it does</h3>
      <ul>
        <li><strong>Format &amp; pretty-print:</strong> Takes compact JSON and adds indentation and line breaks</li>
        <li><strong>Validate:</strong> Flags syntax errors with the exact line and character position</li>
        <li><strong>Minify:</strong> Strips all whitespace to produce compact JSON for payloads</li>
        <li><strong>Tree view:</strong> Explore nested objects and arrays in a collapsible tree</li>
      </ul>

      <h3>Common scenarios</h3>
      <p>Paste an API response from your terminal to understand its structure:</p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Raw curl output
curl -s https://api.example.com/user/42

# Minified response that's hard to read:
{"id":42,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}

# Paste into BrowseryTools JSON Formatter → instantly readable:
{
  "id": 42,
  "name": "Alice",
  "roles": ["admin", "editor"],
  "meta": {
    "created": "2024-01-01",
    "active": true
  }
}`}</code></pre>

      <Link href="/tools/json-formatter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open JSON Formatter →</Link>

      <h2>Base64 Encoder / Decoder</h2>

      <p>
        Base64 encoding appears everywhere: email attachments (MIME), embedding images in CSS, encoding binary data for APIs, and storing credentials in config files. The <Link href="/tools/base64">Base64 tool</Link> handles both encoding and decoding with support for standard Base64 and URL-safe Base64 variants.
      </p>

      <h3>When you need it</h3>
      <ul>
        <li>Decoding a <code>Authorization: Basic ...</code> header to see the username:password</li>
        <li>Encoding an image to embed directly in a CSS <code>url()</code> or HTML <code>src</code> attribute</li>
        <li>Inspecting Base64-encoded configuration values in Kubernetes secrets</li>
        <li>Encoding binary payloads for REST APIs that don't accept raw bytes</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# Decoding a Kubernetes secret value
echo "dXNlcjpwYXNzd29yZA==" | base64 -d
# Output: user:password

# Same thing — paste into BrowseryTools Base64 Decoder, no terminal needed`}</code></pre>

      <Link href="/tools/base64" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open Base64 Encoder/Decoder →</Link>

      <h2>JWT Decoder</h2>

      <p>
        JSON Web Tokens are used for authentication in virtually every modern web application. When something goes wrong with auth — an expired token, a missing claim, an unexpected audience — you need to inspect the token <em>right now</em>, not write a script to do it.
      </p>

      <p>
        The <Link href="/tools/jwt-decoder">JWT Decoder</Link> accepts a JWT string and immediately displays the decoded header, payload, and signature verification status. It highlights the expiry time (<code>exp</code> claim), issued-at time (<code>iat</code>), and tells you whether the token is currently valid, expired, or not-yet-valid.
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Security note:</strong> Never paste production JWT tokens into an unknown third-party decoder — those tokens represent active user sessions. BrowseryTools decodes JWTs entirely in your browser using Base64 string operations. The token never leaves your device, making it the only safe choice for inspecting tokens from live environments.
      </div>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// A typical JWT has three Base64-encoded parts separated by dots:
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzQyIiwiZXhwIjoxNzA5MDAwMDAwfQ.sig

// BrowseryTools JWT Decoder shows:
// Header:  { "alg": "HS256" }
// Payload: { "sub": "user_42", "exp": 1709000000 }
// Status:  ⚠ Expired (expired 3 days ago)`}</code></pre>

      <Link href="/tools/jwt-decoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open JWT Decoder →</Link>

      <h2>UUID Generator</h2>

      <p>
        Universally Unique Identifiers (UUIDs) are essential for database primary keys, idempotency keys, correlation IDs, and distributed system design. The <Link href="/tools/uuid-generator">UUID Generator</Link> produces cryptographically random v4 UUIDs using <code>crypto.randomUUID()</code> — the browser-native API that produces properly random identifiers, not pseudo-random ones.
      </p>

      <h3>Use cases</h3>
      <ul>
        <li>Generating test database IDs during development without hitting your database</li>
        <li>Creating idempotency keys for payment API requests</li>
        <li>Bulk-generating UUIDs for seed data or fixture files</li>
        <li>Creating correlation IDs for distributed tracing during debugging</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Generated v4 UUIDs:
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8`}</code></pre>

      <Link href="/tools/uuid-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open UUID Generator →</Link>

      <h2>Hash Generator</h2>

      <p>
        Cryptographic hashing is used for checksums, password storage (never raw!), content-addressable storage, and data integrity verification. The <Link href="/tools/hash-generator">Hash Generator</Link> computes MD5, SHA-1, SHA-256, and SHA-512 hashes using the browser's native <code>crypto.subtle.digest()</code> API — the same underlying implementation your OS uses.
      </p>

      <h3>When developers reach for this</h3>
      <ul>
        <li>Verifying a downloaded file's checksum against the published hash</li>
        <li>Computing the SHA-256 of an API request body for AWS Signature Version 4</li>
        <li>Generating an ETag value for a static resource</li>
        <li>Creating a content hash for cache-busting in build pipelines</li>
        <li>Checking whether two large text blobs are identical without diffing them character by character</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: "Hello, BrowseryTools!"

MD5:    a4e1c5f0e8d2b3c7a1f6e9d4b2c8a0f3
SHA-1:  3f4a7b2e1c9d5f0a8b3e6c4d2a1f7e9b5c0d8a2
SHA-256: 9b2e4f1a7c3d6e0b8f5a2c4d7e1b3f6a9c2e5d0b8f3a6c1e4d7b0f9a2c5e8
SHA-512: 2c4a6e8f0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d...`}</code></pre>

      <Link href="/tools/hash-generator" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open Hash Generator →</Link>

      <h2>Regex Tester</h2>

      <p>
        Regular expressions are powerful and notoriously difficult to write correctly under pressure. The <Link href="/tools/regex-tester">Regex Tester</Link> gives you a real-time environment: as you type your pattern and test string, matches are highlighted instantly. It supports all JavaScript regex flags (<code>g</code>, <code>i</code>, <code>m</code>, <code>s</code>, <code>u</code>) and shows captured groups in a structured view.
      </p>

      <h3>Practical examples</h3>
      <ul>
        <li>Validating email addresses, phone numbers, or postal codes for form input sanitization</li>
        <li>Writing log-parsing patterns for structured log extraction</li>
        <li>Testing URL routing patterns before committing them to Express or Next.js config</li>
        <li>Crafting sed/awk-compatible patterns without a terminal</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// Pattern to extract IP addresses from log lines:
Pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g

Test string:
"Request from 192.168.1.42 at 2024-01-15 — origin: 10.0.0.1"

Matches:  [192.168.1.42]  [10.0.0.1]`}</code></pre>

      <Link href="/tools/regex-tester" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open Regex Tester →</Link>

      <h2>URL Encoder / Decoder</h2>

      <p>
        URLs can only contain a limited set of ASCII characters. Special characters — spaces, ampersands, equals signs, non-ASCII text — must be percent-encoded. The <Link href="/tools/url-encoder">URL Encoder/Decoder</Link> handles both directions and distinguishes between <code>encodeURI</code> (encodes a full URL, preserving structure characters) and <code>encodeURIComponent</code> (encodes a URL parameter value, encoding everything).
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input:   "search query with spaces & symbols=true"
Encoded: search%20query%20with%20spaces%20%26%20symbols%3Dtrue

// Useful when constructing query parameters manually or debugging
// 400/422 errors caused by unencoded special characters in API requests`}</code></pre>

      <Link href="/tools/url-encoder" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open URL Encoder/Decoder →</Link>

      <h2>YAML ↔ JSON Converter</h2>

      <p>
        Configuration files often come in YAML (Kubernetes manifests, GitHub Actions workflows, Helm charts, Docker Compose), while APIs and code work with JSON. The <Link href="/tools/yaml-json">YAML ↔ JSON Converter</Link> translates between both formats instantly, preserving types, nested structures, and array ordering.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`# YAML input (Kubernetes deployment snippet):
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api

// JSON output:
{
  "spec": {
    "replicas": 3,
    "selector": { "matchLabels": { "app": "api" } },
    "template": { "metadata": { "labels": { "app": "api" } } }
  }
}`}</code></pre>

      <Link href="/tools/yaml-json" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open YAML ↔ JSON Converter →</Link>

      <h2>Cron Expression Parser</h2>

      <p>
        Cron expressions are concise but cryptic. A single mistake in a cron schedule can mean a job runs every minute instead of once a month. The <Link href="/tools/cron-parser">Cron Parser</Link> translates any cron expression into plain English, shows you the next 10 scheduled run times, and validates the expression against standard and extended cron formats.
      </p>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Expression: 0 2 * * 1
Meaning: At 02:00 AM, every Monday

Expression: */15 9-17 * * 1-5
Meaning: Every 15 minutes between 9 AM and 5 PM, Monday through Friday

Expression: 0 0 1 * *
Meaning: At midnight on the 1st of every month`}</code></pre>

      <Link href="/tools/cron-parser" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open Cron Parser →</Link>

      <h2>Number Base Converter</h2>

      <p>
        Systems programmers, embedded developers, and anyone working close to hardware regularly need to convert between binary, octal, decimal, and hexadecimal. The <Link href="/tools/number-base-converter">Number Base Converter</Link> converts between all four bases simultaneously and handles both integer and large number inputs.
      </p>

      <h3>Common scenarios</h3>
      <ul>
        <li>Converting memory addresses from hex to decimal for comparison</li>
        <li>Understanding bitmask values by seeing them in binary</li>
        <li>Decoding Unix file permissions written in octal (<code>chmod 755</code> → binary <code>111 101 101</code>)</li>
        <li>Working with color values: HTML hex <code>#FF6B35</code> → RGB decimal components</li>
        <li>Debugging protocol byte sequences in networking or embedded firmware</li>
      </ul>

      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`Input: 255

Binary:      11111111
Octal:       377
Decimal:     255
Hexadecimal: FF

// chmod 644:
Octal 644 → Binary: 110 100 100
→ Owner: read+write, Group: read, Others: read`}</code></pre>

      <Link href="/tools/number-base-converter" style={{display: "inline-block", margin: "8px 0 24px", padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px"}}>Open Number Base Converter →</Link>

      {/* Summary table */}
      <h2>Quick Reference: All Developer Tools at a Glance</h2>

      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(245,158,11,0.1)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Tool</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Primary Use Case</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(245,158,11,0.3)", fontWeight: "700"}}>Key Technology</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["JSON Formatter", "Format, validate, minify JSON", "JSON.parse / JSON.stringify"],
              ["Base64 Encoder/Decoder", "Encode/decode Base64 strings", "btoa() / atob()"],
              ["JWT Decoder", "Inspect JWT header, payload, expiry", "Base64 string parsing"],
              ["UUID Generator", "Generate v4 UUIDs", "crypto.randomUUID()"],
              ["Hash Generator", "MD5, SHA-1, SHA-256, SHA-512", "crypto.subtle.digest()"],
              ["Regex Tester", "Test and debug regex patterns", "JavaScript RegExp engine"],
              ["URL Encoder/Decoder", "Encode/decode URL components", "encodeURIComponent()"],
              ["YAML ↔ JSON", "Convert between YAML and JSON", "js-yaml library (local)"],
              ["Cron Parser", "Explain and validate cron expressions", "cron-parser (local)"],
              ["Number Base Converter", "Binary, octal, decimal, hex", "parseInt() / toString()"],
            ].map(([tool, use, tech], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{tool}</td>
                <td style={{padding: "11px 16px"}}>{use}</td>
                <td style={{padding: "11px 16px", fontFamily: "monospace", fontSize: "12px", opacity: 0.75}}>{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Why BrowseryTools Instead of npm Packages or Cloud APIs?</h2>

      <p>
        The honest comparison: when should you use BrowseryTools vs. installing a package or calling an API?
      </p>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", margin: "24px 0"}}>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>npm package</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Requires Node.js installed</li>
            <li>Adds to dependency tree</li>
            <li>Potential supply chain risk</li>
            <li>Best for: production code</li>
          </ul>
        </div>
        <div style={{background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px"}}>Cloud API</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Requires API key setup</li>
            <li>Rate limits apply</li>
            <li>Data leaves your device</li>
            <li>Best for: automated pipelines</li>
          </ul>
        </div>
        <div style={{background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "16px"}}>
          <div style={{fontWeight: "700", marginBottom: "8px", fontSize: "14px", color: "#16a34a"}}>BrowseryTools</div>
          <ul style={{margin: 0, paddingLeft: "16px", fontSize: "13px", lineHeight: "1.7", opacity: 0.85}}>
            <li>Zero setup, works instantly</li>
            <li>No dependencies</li>
            <li>Data stays local</li>
            <li>Best for: manual dev tasks</li>
          </ul>
        </div>
      </div>

      <p>
        The answer is: use BrowseryTools for the <em>manual, exploratory, one-off tasks</em> that would be overkill to script. Decoding a JWT to debug an auth issue, formatting an API response to understand its shape, generating a UUID for a one-time test — these are exactly the moments where a fast, no-friction browser tool saves 10 minutes of setup for a 10-second job.
      </p>

      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Tip for developers:</strong> Bookmark <code>browserytools.com</code> alongside your browser's dev tools. When you're in the middle of debugging and need to quickly decode, hash, format, or convert something, having these tools a tab away means you can stay in flow instead of switching context to write a throwaway script.
      </div>

      <h2>Beyond Developer Tools: More BrowseryTools Utilities</h2>

      <p>
        BrowseryTools covers far more than developer utilities. The same privacy-first, no-upload approach applies to:
      </p>

      <ul>
        <li><strong>Image tools:</strong> <Link href="/tools/image-compression">Image compression</Link>, <Link href="/tools/bg-removal">AI background removal</Link>, <Link href="/tools/image-resizer">resizing</Link>, <Link href="/tools/image-converter">format conversion</Link></li>
        <li><strong>Text tools:</strong> <Link href="/tools/markdown-editor">Markdown editor</Link>, <Link href="/tools/text-diff">text diff</Link>, <Link href="/tools/text-case">case converter</Link>, <Link href="/tools/lorem-ipsum">Lorem ipsum generator</Link></li>
        <li><strong>Security tools:</strong> <Link href="/tools/password-generator">Password generator</Link>, <Link href="/tools/password-strength">password strength checker</Link>, <Link href="/tools/text-encryption">text encryption</Link></li>
        <li><strong>Productivity:</strong> <Link href="/tools/pomodoro">Pomodoro timer</Link>, <Link href="/tools/todo">todo list</Link>, <Link href="/tools/notepad">notepad</Link>, <Link href="/tools/world-clock">world clock</Link></li>
      </ul>

      {/* Inline SVG illustration */}
      <div style={{margin: "32px 0", textAlign: "center"}}>
        <svg width="320" height="80" viewBox="0 0 320 80" style={{maxWidth: "100%"}}>
          <rect x="0" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="30" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JSON</text>
          <rect x="65" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="95" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">JWT</text>
          <rect x="130" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="160" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Regex</text>
          <rect x="195" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="225" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">Hash</text>
          <rect x="260" y="20" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <text x="290" y="44" textAnchor="middle" fontSize="11" fill="rgb(99,102,241)" fontWeight="600">UUID</text>
          <text x="160" y="12" textAnchor="middle" fontSize="10" fill="rgba(128,128,128,0.7)">All running locally in your browser</text>
        </svg>
      </div>

      {/* CTA */}
      <div style={{background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>⚡</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Start Using BrowseryTools — No Setup Required</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "520px", marginLeft: "auto", marginRight: "auto"}}>
          All 10 developer tools above — plus dozens more — are free, instant, and require no account, no install, and no configuration. Open a tool and start working in under 3 seconds.
        </p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
          <Link
            href="/tools/json-formatter"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(245,158,11)", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Open JSON Formatter →
          </Link>
          <Link
            href="/"
            style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "inherit", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", textDecoration: "none", fontSize: "15px"}}
          >
            Browse All Tools
          </Link>
        </div>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Related tools: <Link href="/tools/json-formatter">JSON Formatter</Link> · <Link href="/tools/jwt-decoder">JWT Decoder</Link> · <Link href="/tools/hash-generator">Hash Generator</Link> · <Link href="/tools/regex-tester">Regex Tester</Link> · <Link href="/tools/base64">Base64</Link> · <Link href="/tools/uuid-generator">UUID Generator</Link> · <Link href="/tools/cron-parser">Cron Parser</Link> · <Link href="/tools/yaml-json">YAML ↔ JSON</Link>
      </p>

    </div>
  );
}
