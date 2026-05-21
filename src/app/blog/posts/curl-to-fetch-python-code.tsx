export default function Content() {
  return (
    <div>
      <p>
        You found the API call you need — but it is written in cURL, and you are working in
        JavaScript or Python. Or you opened your browser&rsquo;s DevTools, right-clicked a request,
        and chose &ldquo;Copy as cURL,&rdquo; and now you have a wall of flags you need to turn into
        real code. Translating cURL by hand is fiddly: every <code>-H</code>, <code>-d</code>,{" "}
        <code>-u</code>, and <code>-X</code> has to map to the right argument in your language, and a
        single missed header breaks the request.
      </p>
      <p>
        The <a href="/tools/curl-converter">BrowseryTools cURL Converter</a> does it instantly —
        paste a cURL command and get clean code in JavaScript <code>fetch</code>, Python{" "}
        <code>requests</code>, Node.js, and more, all in your browser with nothing uploaded. This
        guide shows the flag-to-code mapping so you can read and trust the output.
      </p>

      <h2>The &ldquo;Copy as cURL&rdquo; Workflow</h2>
      <p>
        The fastest way to get a working request is to let the browser write it for you. Open DevTools
        (F12), go to the <strong>Network</strong> tab, perform the action you want to replicate, then
        right-click the request and choose <strong>Copy &rarr; Copy as cURL</strong>. You now have a
        cURL command with the exact headers, cookies, and body the real site sent. Paste it into the{" "}
        <a href="/tools/curl-converter">converter</a> and you get the same request as code you can drop
        into your project.
      </p>

      <h2>How cURL Flags Map to Code</h2>
      <p>
        Once you know the handful of flags that matter, you can read any cURL command at a glance:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.8}}>
{`-X POST          ->  the HTTP method
-H "Key: Value"  ->  a request header
-d '{...}'       ->  the request body (implies POST)
-u user:pass     ->  HTTP Basic auth
-F field=value   ->  multipart/form-data upload
-b "name=value"  ->  a cookie
-L               ->  follow redirects`}
      </pre>
      <p>
        A header like <code>-H &quot;Authorization: Bearer abc123&quot;</code> becomes an entry in the{" "}
        <code>headers</code> object. A body passed with <code>-d</code> becomes the request body, and
        if the content type is JSON it gets serialized accordingly. <code>-u user:pass</code> becomes
        a Basic auth header. Knowing this mapping is what lets you sanity-check generated code instead
        of blindly trusting it.
      </p>

      <h2>The Same Request in Three Languages</h2>
      <p>
        Take a simple authenticated POST. In cURL:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada"}'`}
      </pre>
      <p>As JavaScript <code>fetch</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Ada" }),
});`}
      </pre>
      <p>As Python <code>requests</code>:</p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`import requests

requests.post(
    "https://api.example.com/users",
    headers={"Authorization": "Bearer TOKEN"},
    json={"name": "Ada"},
)`}
      </pre>
      <p>
        Notice how Python&rsquo;s <code>json=</code> argument sets the body <em>and</em> the
        Content-Type header automatically — a small idiomatic difference the converter handles for you.
      </p>

      <h2>Common Gotchas</h2>
      <p>
        <strong>Quoting and escaping.</strong> cURL bodies are wrapped in single quotes in the shell;
        when those contain JSON with double quotes, manual translation is where bugs creep in. Letting
        a converter parse it removes that risk.
      </p>
      <p>
        <strong>Implicit POST.</strong> Using <code>-d</code> makes a request POST even without{" "}
        <code>-X POST</code>. If you only translate the visible flags you might wrongly produce a GET.
      </p>
      <p>
        <strong>Secrets in the command.</strong> A copied cURL request often contains live tokens and
        cookies. Because the converter runs entirely in your browser, those secrets are never sent to
        a server — but you should still scrub them before pasting code into a shared repo or ticket.
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>Which languages can I convert to?</strong> JavaScript fetch, Python requests, Node.js,
        and other common targets.
      </p>
      <p>
        <strong>Does the converter send my command anywhere?</strong> No. Parsing and conversion happen
        locally in your browser, so any tokens in the command stay on your device.
      </p>
      <p>
        <strong>Can I paste a &ldquo;Copy as cURL&rdquo; from DevTools?</strong> Yes — that is one of
        the best uses. It captures the exact headers and body of a real request.
      </p>
      <p>
        <strong>Is it free?</strong> Yes — no account, no limits.
      </p>

      <h2>Convert Now</h2>
      <p>
        Open the <a href="/tools/curl-converter">cURL Converter</a>, paste your command, and copy the
        equivalent code. For a deeper look at cURL syntax and REST patterns, read our{" "}
        <a href="/blog/curl-converter-guide">guide to converting API requests between languages</a>,
        and to make sense of the responses you get back see the{" "}
        <a href="/blog/http-status-codes-guide">HTTP status codes guide</a>.
      </p>
    </div>
  );
}
