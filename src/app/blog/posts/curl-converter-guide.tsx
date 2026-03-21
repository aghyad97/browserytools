export default function Content() {
  return (
    <div>
      <p>
        Every API has documentation. Almost universally, that documentation includes code examples
        in cURL — the command-line HTTP client that ships on every Unix-like system and has been
        the lingua franca of API documentation for decades. The problem is that you are not writing
        shell scripts. You are writing JavaScript, Python, Go, or Ruby, and you need to translate
        that cURL command into working code before you can use it.
      </p>
      <p>
        That translation is tedious and error-prone. Headers, authentication schemes, request
        bodies, and URL encoding all have to be mapped to the right method calls in the right
        language. The{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> does this automatically —
        paste a cURL command and get equivalent code in JavaScript fetch, Python requests, Node.js
        axios, and more. Free, no sign-up, everything stays in your browser.
      </p>

      <h2>What Is cURL?</h2>
      <p>
        cURL (Client URL) is a command-line tool for transferring data using URLs. It supports
        HTTP, HTTPS, FTP, WebSockets, and dozens of other protocols. For developers, it is most
        commonly used as a way to make HTTP requests from the terminal — testing an API endpoint,
        downloading a file, or debugging authentication.
      </p>
      <p>
        cURL is installed by default on macOS and most Linux distributions. On Windows, it has
        been bundled with the OS since Windows 10. This ubiquity is exactly why API documentation
        teams default to cURL for examples — they can be confident that any developer reading
        the docs can run the example immediately, without installing anything.
      </p>

      <h2>Anatomy of a cURL Command</h2>
      <p>
        A cURL command is built from a base URL and a set of flags. Here is a complete example
        that covers the most important flags:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \\
  -d '{"name": "Alice", "email": "alice@example.com"}'`}
      </pre>
      <p>
        Breaking down each flag:
      </p>
      <ul>
        <li><strong><code>-X POST</code></strong> — sets the HTTP method. Valid values are GET, POST, PUT, PATCH, DELETE, etc. If omitted and <code>-d</code> is present, cURL defaults to POST.</li>
        <li><strong><code>-H "Header: Value"</code></strong> — adds a request header. Can be repeated multiple times for multiple headers.</li>
        <li><strong><code>-d '...'</code></strong> — the request body. For JSON, combine with <code>-H "Content-Type: application/json"</code>. cURL URL-encodes the body by default unless you use <code>--data-raw</code>.</li>
        <li><strong><code>--data-raw '...'</code></strong> — sends the body exactly as-is without any URL encoding. Required when the body contains characters like <code>@</code> that <code>-d</code> would interpret specially.</li>
        <li><strong><code>-u username:password</code></strong> — basic authentication shorthand. cURL encodes it as a Base64 Authorization header for you.</li>
        <li><strong><code>-s</code></strong> — silent mode; suppresses the progress bar. Nearly always used in scripts.</li>
        <li><strong><code>-v</code></strong> — verbose mode; prints request and response headers. Invaluable for debugging authentication failures.</li>
        <li><strong><code>-o filename</code></strong> — write output to a file instead of stdout.</li>
      </ul>

      <h2>Common cURL Patterns for REST APIs</h2>

      <h3>GET Request with Query Parameters</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl "https://api.example.com/users?page=2&limit=20" \\
  -H "Authorization: Bearer TOKEN"`}
      </pre>
      <p>
        Query parameters go directly in the URL. Quote the entire URL to prevent the shell from
        interpreting the <code>&</code> as a background process operator.
      </p>

      <h3>POST with JSON Body</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  --data-raw '{"product_id": 42, "quantity": 3}'`}
      </pre>

      <h3>File Upload (multipart/form-data)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/upload \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@/path/to/document.pdf" \\
  -F "description=Q4 Report"`}
      </pre>
      <p>
        The <code>-F</code> flag sends multipart/form-data. The <code>@</code> prefix means
        "read from file". This is the format used for image uploads, document processing APIs,
        and any endpoint that accepts binary data.
      </p>

      <h2>Converting cURL to JavaScript fetch</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Original cURL:
// curl -X POST https://api.example.com/v1/users \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"name": "Alice", "email": "alice@example.com"}'

const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN",
  },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
  }),
});

const data = await response.json();`}
      </pre>

      <h2>Converting cURL to Python requests</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`import requests

response = requests.post(
    "https://api.example.com/v1/users",
    headers={
        "Authorization": "Bearer TOKEN",
    },
    json={
        "name": "Alice",
        "email": "alice@example.com",
    },
)

data = response.json()`}
      </pre>
      <p>
        The <code>requests</code> library's <code>json=</code> parameter handles both serialization
        and setting the <code>Content-Type: application/json</code> header automatically —
        no need to set it manually.
      </p>

      <h2>Converting cURL to Node.js with axios</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`const axios = require("axios");

const response = await axios.post(
  "https://api.example.com/v1/users",
  {
    name: "Alice",
    email: "alice@example.com",
  },
  {
    headers: {
      Authorization: "Bearer TOKEN",
    },
  }
);

const data = response.data;`}
      </pre>

      <h2>How "Copy as cURL" Works in Browser DevTools</h2>
      <p>
        One of the most useful features in browser DevTools is "Copy as cURL." In Chrome, Firefox,
        or Safari: open DevTools, go to the Network tab, make a request (log in, click a button,
        load a page), right-click the request in the network list, and select "Copy as cURL."
      </p>
      <p>
        The browser generates a complete cURL command that includes every header the browser sent
        — including cookies, session tokens, CSRF tokens, and any other authentication material.
        This means you can replay the exact request that the browser made, including all its
        authentication context, from the terminal or from code.
      </p>
      <p>
        This is invaluable for debugging: if the browser request works but your code's request
        fails, paste both into a diff and find the header or body difference. You can also paste
        the copied cURL directly into the{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> to get equivalent
        code in your preferred language — the converter handles all the escaping, quoting, and
        flag translation automatically.
      </p>

      <h2>Summary</h2>
      <p>
        cURL is the universal language of HTTP. API docs use it because everyone can run it.
        DevTools copies it because it captures every detail of a request. Learning to read cURL
        fluently — and to translate it accurately to whatever language you are working in — is a
        practical skill that pays dividends every time you integrate a new API. Skip the tedious
        manual translation and use the{" "}
        <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> to get clean, runnable
        code in seconds.
      </p>
    </div>
  );
}
