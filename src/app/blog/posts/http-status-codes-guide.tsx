export default function Content() {
  return (
    <div>
      <p>
        HTTP status codes are the language servers use to tell clients what happened with a request. Every
        developer encounters them constantly — in DevTools, in API responses, in error logs, in Slack alerts
        at 3am. Knowing what each code actually means, when to use which code in your own APIs, and what
        common ones signal about a bug makes you significantly faster at debugging and building better
        services.
      </p>
      <p>
        You can look up any HTTP status code with the{" "}
        <a href="/tools/http-status">BrowseryTools HTTP Status Code Reference</a> — free, no sign-up,
        everything runs in your browser.
      </p>

      <h2>The Five Categories</h2>
      <p>
        Status codes are three-digit numbers. The first digit defines the category:
      </p>
      <ul>
        <li><strong>1xx — Informational</strong>: The request was received; processing continues. These are rare in most applications.</li>
        <li><strong>2xx — Success</strong>: The request was received, understood, and accepted.</li>
        <li><strong>3xx — Redirection</strong>: Further action is needed to complete the request. The client should follow a redirect.</li>
        <li><strong>4xx — Client Error</strong>: The request was malformed or unauthorized. The client made a mistake.</li>
        <li><strong>5xx — Server Error</strong>: The server failed to fulfill a valid request. The server made a mistake.</li>
      </ul>
      <p>
        This first-digit rule is important: if you see a status code you do not recognize (like <code>429</code>{" "}
        or <code>451</code>), you can at least know whether the problem is on the client or server side, and
        whether the request ultimately succeeded.
      </p>

      <h2>2xx: Success Codes</h2>
      <p>
        These tell the client the request worked. The specific code communicates how it worked:
      </p>
      <ul>
        <li>
          <strong>200 OK</strong> — the universal success. The response body contains the requested data. Used for GET requests and most responses that return content.
        </li>
        <li>
          <strong>201 Created</strong> — a new resource was created. Should include a <code>Location</code> header pointing to the new resource's URL. Use this for POST requests that create records, not 200.
        </li>
        <li>
          <strong>204 No Content</strong> — the request succeeded but there is no body to return. Common for DELETE requests and PATCH/PUT operations where the client does not need updated data back. The response must not include a body.
        </li>
        <li>
          <strong>206 Partial Content</strong> — used with range requests (the <code>Range</code> header). Video players use this to request specific byte ranges of a media file without downloading the whole thing.
        </li>
      </ul>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# REST API design pattern
POST   /api/users        → 201 Created  (body: new user object, Location: /api/users/123)
GET    /api/users/123    → 200 OK       (body: user object)
PATCH  /api/users/123    → 200 OK       (body: updated user) or 204 No Content
DELETE /api/users/123    → 204 No Content`}
      </pre>

      <h2>3xx: Redirect Codes</h2>
      <p>
        Redirects tell the client to look somewhere else. The <code>Location</code> header contains the
        new URL. The key distinction is between permanent and temporary redirects, and between redirects
        that preserve the HTTP method and those that change it.
      </p>
      <ul>
        <li>
          <strong>301 Moved Permanently</strong> — the resource has a new permanent URL. Browsers and search engines cache this. The browser will use GET for the redirect regardless of the original method (a historical quirk). Use this when permanently renaming a URL or redirecting HTTP to HTTPS in an older setup.
        </li>
        <li>
          <strong>302 Found</strong> — temporary redirect. Like 301, browsers change POST to GET on the redirect (per the spec, though the spec was "wrong" — see 307). Use 302 only when the redirect is genuinely temporary.
        </li>
        <li>
          <strong>304 Not Modified</strong> — the cached version is still fresh; there is no body. The server sends this in response to a conditional GET (with <code>If-None-Match</code> or <code>If-Modified-Since</code>). The browser uses its cached copy. Important for CDN efficiency and reducing bandwidth.
        </li>
        <li>
          <strong>307 Temporary Redirect</strong> — like 302, but the spec guarantees the original HTTP method is preserved. If a POST results in a 307, the browser will POST to the new URL. Use 307 instead of 302 for non-GET temporary redirects.
        </li>
        <li>
          <strong>308 Permanent Redirect</strong> — like 301, but also guarantees method preservation. The modern standard for permanent redirects.
        </li>
      </ul>

      <h2>Common Misconception: 301 vs 302 for SEO</h2>
      <p>
        Search engines treat 301 as a signal to transfer "link equity" (PageRank) from the old URL to the
        new one and update their index. A 302 tells the crawler the redirect is temporary, so it keeps
        indexing the original URL. Using 302 when you mean 301 can suppress the SEO benefit of redirects.
        Conversely, using 301 when the redirect is temporary causes search engines to cache the redirect,
        making it harder to undo.
      </p>

      <h2>4xx: Client Error Codes</h2>
      <p>
        These codes indicate the client sent a bad request. Do not return 5xx for client mistakes — that
        misleads monitoring and makes it harder to identify whether a problem is a bug in your server or
        bad input from a client.
      </p>
      <ul>
        <li>
          <strong>400 Bad Request</strong> — the request is malformed. Missing required fields, invalid JSON, wrong data types. The most generic 4xx; use more specific codes when available.
        </li>
        <li>
          <strong>401 Unauthorized</strong> — despite the name, this means "not authenticated." The client provided no credentials, or the credentials were invalid. The response should include a <code>WWW-Authenticate</code> header indicating how to authenticate. The name is a historical mistake — "unauthenticated" would be more accurate.
        </li>
        <li>
          <strong>403 Forbidden</strong> — authenticated but not authorized. The server knows who you are (or it does not matter who you are) and you do not have permission. Unlike 401, re-authenticating will not help. Use 403 when a user tries to access a resource they are not permitted to see.
        </li>
        <li>
          <strong>404 Not Found</strong> — the resource does not exist at this URL. Also returned when a server wants to hide the existence of a resource from unauthorized users (returning 403 would confirm the resource exists; returning 404 hides that fact).
        </li>
        <li>
          <strong>409 Conflict</strong> — the request conflicts with the current state of the resource. Classic example: trying to create a user with an email that already exists, or trying to update a resource using a stale version (optimistic locking conflict).
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> — the request is syntactically correct (valid JSON, right Content-Type) but semantically invalid (a required field is present but contains an invalid value, business rule violation). Rails popularized using 422 for validation errors. More specific than 400.
        </li>
        <li>
          <strong>429 Too Many Requests</strong> — rate limit exceeded. Should include a <code>Retry-After</code> header telling the client how long to wait. Essential for any public API.
        </li>
      </ul>

      <h2>401 vs 403: The Distinction That Matters</h2>
      <p>
        This is one of the most commonly confused pairs:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`GET /api/admin/users
Authorization: (none)
→ 401 Unauthorized
   "You haven't told me who you are. Log in first."

GET /api/admin/users
Authorization: Bearer <valid-regular-user-token>
→ 403 Forbidden
   "I know who you are. You're not an admin. Access denied."`}
      </pre>

      <h2>5xx: Server Error Codes</h2>
      <ul>
        <li>
          <strong>500 Internal Server Error</strong> — a generic catch-all for unexpected server-side failures. An unhandled exception, a null reference, a database query that threw an error. Do not expose stack traces to clients; log them server-side.
        </li>
        <li>
          <strong>502 Bad Gateway</strong> — the server acting as a proxy or gateway received an invalid response from an upstream server. Common when your load balancer or reverse proxy cannot reach the application servers behind it — the app crashed or is not listening on the right port.
        </li>
        <li>
          <strong>503 Service Unavailable</strong> — the server is temporarily unable to handle requests. Could be overloaded, in the middle of a deployment, or doing maintenance. Should include a <code>Retry-After</code> header when the outage duration is known.
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> — the proxy or gateway did not receive a timely response from the upstream server. The upstream is up and responding, but too slowly. Common symptom of database queries that are taking too long or external API calls that are hanging.
        </li>
      </ul>

      <h2>Status Codes in REST API Design</h2>
      <p>
        Using the right status codes makes your API self-documenting and easier to integrate against. A few
        guidelines:
      </p>
      <ul>
        <li>Never return 200 with an error object in the body. If a request failed, the status code should reflect that. Clients should be able to check the status code alone to know if they need to handle an error.</li>
        <li>Use 201 and a <code>Location</code> header when creating resources via POST. This allows clients to discover the new resource's URL without parsing the body.</li>
        <li>Return 422 (not 400) for validation errors, and include a structured error body that identifies which fields failed and why.</li>
        <li>Use 409 for conflicts that require application-level resolution, not just bad input.</li>
        <li>Implement 429 with rate limiting from the start on any public-facing endpoint — it is much harder to add retroactively.</li>
      </ul>

      <h2>Debugging Status Codes in DevTools</h2>
      <p>
        Open the Network tab in browser DevTools and look for requests in red — those are 4xx or 5xx
        responses. Click a request to see the exact status code, the response headers (useful for{" "}
        <code>WWW-Authenticate</code>, <code>Location</code>, <code>Retry-After</code>), and the response
        body (which often contains an error message from the server). For redirects, check "Preserve log"
        so the DevTools panel does not clear when the page navigates — otherwise you miss the redirect chain.
      </p>
      <p>
        When you encounter an unfamiliar status code, the{" "}
        <a href="/tools/http-status">BrowseryTools HTTP Status Code Reference</a> gives you the official
        description, the RFC it comes from, and notes on common usage — without having to leave your
        browser tab.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free HTTP Status Code Reference — All Codes, RFC Sources, Usage Notes
        </p>
        <a
          href="/tools/http-status"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open HTTP Status Reference →
        </a>
      </div>
    </div>
  );
}
