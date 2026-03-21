export default function Content() {
  return (
    <div>
      <p>
        JSON is everywhere. It powers REST APIs, configuration files, database outputs, webhook
        payloads, and log aggregators. You encounter it dozens of times a day whether you are
        building a backend service, debugging a frontend app, or reading documentation. Understanding
        JSON deeply — not just how to parse it, but how to read it, validate it, and troubleshoot
        it — is one of the highest-leverage skills a developer can have.
      </p>
      <p>
        This guide covers everything from JSON syntax fundamentals to debugging common parse errors,
        formatting strategies, and working with deeply nested structures. Paste any JSON into the{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> to validate and pretty-print
        it instantly — free, no sign-up, everything stays in your browser.
      </p>

      <h2>Why JSON Won (and XML Lost)</h2>
      <p>
        Before JSON became the default data interchange format, XML was the standard. SOAP APIs,
        RSS feeds, and configuration files all used XML. JSON emerged as a simpler alternative and
        gradually took over for most use cases. The reasons are straightforward:
      </p>
      <ul>
        <li><strong>Less verbose</strong> — JSON does not require closing tags. The same data takes 30–50% fewer characters to represent.</li>
        <li><strong>Native to JavaScript</strong> — JSON stands for JavaScript Object Notation. It maps directly to JavaScript objects and arrays, making it trivial to parse and serialize in the browser.</li>
        <li><strong>Human-readable</strong> — a properly formatted JSON payload is easier to read than the equivalent XML with its angle brackets and namespace declarations.</li>
        <li><strong>Widely supported</strong> — every major language has a built-in JSON parser. There is no need to install a library just to deserialize an API response.</li>
      </ul>
      <p>
        XML still has legitimate use cases — document formats (DOCX, SVG), configurations that
        need comments (which JSON does not support), and protocols like SOAP where it is required.
        But for API communication and data storage, JSON is the unambiguous winner.
      </p>

      <h2>JSON Syntax Rules</h2>
      <p>
        JSON has a small, strict syntax. These are the rules that catch most developers off-guard:
      </p>
      <ul>
        <li><strong>Keys must be double-quoted strings</strong> — <code>{"{"}"name": "Alice"{"}"}</code> is valid; <code>{"{"}name: "Alice"{"}"}</code> is not. Unlike JavaScript object literals, JSON does not allow unquoted keys.</li>
        <li><strong>No trailing commas</strong> — <code>[1, 2, 3,]</code> is invalid JSON. The trailing comma after the last element is accepted by JavaScript and many parsers but is not part of the JSON spec.</li>
        <li><strong>No comments</strong> — JSON has no comment syntax. This surprises developers who want to annotate configuration files. If you need comments in a config file, consider JSONC (JSON with Comments) or YAML instead.</li>
        <li><strong>Strings use double quotes only</strong> — single-quoted strings like <code>'hello'</code> are not valid JSON.</li>
        <li><strong>Numbers cannot have leading zeros</strong> — <code>007</code> is invalid; use <code>7</code> instead.</li>
        <li><strong>Only six value types</strong> — strings, numbers, booleans (<code>true</code> / <code>false</code>), null, objects, and arrays. No dates, no functions, no undefined.</li>
      </ul>

      <h2>Common JSON Errors and What They Mean</h2>
      <p>
        JSON parse errors can be cryptic. Here are the most common ones and how to fix them.
      </p>

      <h3>Unexpected token</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token ' in JSON at position 9
{ "name": 'Alice' }`}
      </pre>
      <p>
        Single quotes are not valid JSON. Replace them with double quotes:{" "}
        <code>{"{"}"name": "Alice"{"}"}</code>.
      </p>

      <h3>{"Unexpected token } / ]"}</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Error: Unexpected token } in JSON at position 23
{
  "items": [1, 2, 3,]
}`}
      </pre>
      <p>
        A trailing comma before the closing bracket. Remove the comma after the last element.
        This is the most common JSON error for developers coming from JavaScript, where trailing
        commas are perfectly fine.
      </p>

      <h3>Unexpected end of JSON input</h3>
      <p>
        This means the JSON is truncated — the string ends before all opened objects and arrays
        are closed. Count your opening and closing braces and brackets. They must match.
      </p>

      <h3>Property names must be strings</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Invalid — unquoted key
{ name: "Alice" }

// Valid
{ "name": "Alice" }`}
      </pre>

      <h2>Pretty-Printing vs Minification</h2>
      <p>
        JSON can be represented in two ways: pretty-printed (with indentation and newlines) or
        minified (all whitespace stripped). The choice depends on the context.
      </p>
      <p>
        <strong>Pretty-print</strong> when you are reading, debugging, reviewing, or storing JSON
        in version control. Indented JSON is immediately readable and diffs cleanly in Git because
        each value is on its own line.
      </p>
      <p>
        <strong>Minify</strong> when you are transmitting JSON over a network. Whitespace is pure
        overhead in HTTP responses. A 100KB pretty-printed JSON payload might compress to 60KB
        when minified, then further to 15KB with gzip. Most APIs serve minified JSON over the
        wire and let the client pretty-print it as needed.
      </p>
      <p>
        In JavaScript: <code>JSON.stringify(data, null, 2)</code> pretty-prints with 2-space
        indentation. <code>JSON.stringify(data)</code> minifies. The{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> does both — paste your
        JSON and toggle between pretty and minified views instantly.
      </p>

      <h2>Navigating Deeply Nested JSON</h2>
      <p>
        Real-world API responses are often deeply nested. A Stripe webhook payload, a GitHub API
        response, or a Kubernetes config can have objects five or six levels deep. Here are
        strategies for working with them:
      </p>

      <h3>Use optional chaining in JavaScript</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Without optional chaining — crashes if any level is undefined
const city = user.address.location.city;

// With optional chaining — returns undefined instead of throwing
const city = user?.address?.location?.city;

// With nullish coalescing for a default value
const city = user?.address?.location?.city ?? "Unknown";`}
      </pre>

      <h3>Use jq for command-line JSON querying</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Pretty-print the entire response
curl https://api.example.com/users | jq .

# Extract a specific field
curl https://api.example.com/users | jq '.[0].email'

# Filter an array
curl https://api.example.com/users | jq '.[] | select(.active == true) | .name'`}
      </pre>

      <h2>JSON in APIs vs Config Files</h2>
      <p>
        JSON serves two very different roles depending on context, and the best practices differ
        between them.
      </p>
      <p>
        In <strong>API responses</strong>, JSON is generated by code and consumed by code. You
        rarely write it by hand. The priority is correctness and consistency — use a serialization
        library and let it handle escaping. Minify for production, include a Content-Type header
        of <code>application/json</code>, and version your API so changes to the JSON structure
        are not breaking.
      </p>
      <p>
        In <strong>config files</strong> (package.json, tsconfig.json, .eslintrc.json), JSON is
        written by humans. Here, readability matters more. Use 2-space indentation, keep the
        structure shallow where possible, and add comments using a JSONC-compatible parser if your
        tooling supports it. Never minify config files that live in version control.
      </p>

      <h2>JSON Schema Validation</h2>
      <p>
        JSON Schema is a specification for defining the structure, types, and constraints of a
        JSON document. It lets you validate that a JSON payload conforms to an expected shape
        before you try to use it.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 }
  },
  "additionalProperties": false
}`}
      </pre>
      <p>
        Libraries like <code>ajv</code> (JavaScript), <code>jsonschema</code> (Python), and{" "}
        <code>JSON.NET Schema</code> (.NET) can validate a JSON document against a schema at
        runtime — catching malformed payloads at the API boundary before they cause unexpected
        errors deeper in the application.
      </p>

      <h2>Summary</h2>
      <p>
        JSON's simplicity is its greatest strength. Six value types, strict quoting rules, no
        comments, no trailing commas — the constraints are small and the format is unambiguous.
        When something goes wrong, it is almost always one of a handful of predictable syntax
        errors. Paste your broken JSON into the{" "}
        <a href="/tools/json-formatter">BrowseryTools JSON Formatter</a> and the error will be
        immediately visible with the exact position highlighted.
      </p>
    </div>
  );
}
