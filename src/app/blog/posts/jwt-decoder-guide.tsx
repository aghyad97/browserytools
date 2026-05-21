export default function Content() {
  return (
    <div>
      <p>
        If you have worked with any modern web authentication system — OAuth 2.0, OpenID Connect, or a
        custom API — you have almost certainly encountered JWT tokens. They show up in Authorization headers,
        in cookies, in local storage, and in debugging sessions at 2 AM when a login flow is mysteriously
        failing. Understanding what a JWT actually contains, how to read it, and how to spot common problems
        makes authentication debugging dramatically faster.
      </p>
      <p>
        The <a href="/tools/jwt-decoder">BrowseryTools JWT Decoder</a> lets you paste any JWT token and
        instantly see its decoded header, payload, and expiry status — all in your browser, with the token
        never leaving your device.
      </p>

      <h2>What Is a JWT?</h2>
      <p>
        JWT stands for JSON Web Token, defined in RFC 7519. A JWT is a compact, URL-safe token that encodes
        a set of claims — assertions about a subject, typically a user — in a format that can be verified
        and trusted. The key property of a JWT is that it is <em>self-contained</em>: the token itself
        carries all the information a server needs to authenticate a request, without a database lookup.
      </p>
      <p>
        A JWT looks like this:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.7, wordBreak: "break-all" as const}}>
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfODQyMTkiLCJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmUuZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImVkaXRvciJdLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImlhdCI6MTczODM2ODAwMCwiZXhwIjoxNzM4MzcxNjAwLCJqdGkiOiI3ZjNhOWI0Yy0xZDJlLTQ1NmYtYWJjZC04OTAxMjM0NTY3ODkifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
      </pre>
      <p>
        At first glance it looks like gibberish. But it has a very precise structure: three Base64URL-encoded
        sections separated by dots. Each section has a specific purpose.
      </p>

      <h2>The Three-Part Structure: Header.Payload.Signature</h2>

      <h3>Part 1: The Header</h3>
      <p>
        The first segment, before the first dot, is the <strong>header</strong>. It is a Base64URL-encoded
        JSON object describing the token's type and the signing algorithm. Decoded, the header from the
        example above looks like:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
      </pre>
      <p>
        The <code>alg</code> field specifies the signing algorithm. Common values you will encounter are:
      </p>
      <ul>
        <li>
          <strong>HS256</strong> — HMAC with SHA-256. Uses a shared secret key. Both the issuer and verifier
          must have the same secret. Common in monolithic applications.
        </li>
        <li>
          <strong>RS256</strong> — RSA signature with SHA-256. Uses a public/private key pair. The issuer
          signs with the private key; verifiers check with the public key. Common in distributed systems
          and OAuth providers.
        </li>
        <li>
          <strong>ES256</strong> — ECDSA with P-256 and SHA-256. Like RS256 but using elliptic curves —
          shorter keys, same security level. Preferred in modern high-performance systems.
        </li>
        <li>
          <strong>none</strong> — No signature. Never accept this in production. A notorious security
          vulnerability arises when servers accept unsigned tokens because the client changed <code>alg</code>{" "}
          to <code>"none"</code>.
        </li>
      </ul>

      <h3>Part 2: The Payload</h3>
      <p>
        The second segment is the <strong>payload</strong> — the actual data the token carries. It is also
        a Base64URL-encoded JSON object. The decoded payload from our example:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "sub": "usr_84219",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "roles": ["user", "editor"],
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "iat": 1738368000,
  "exp": 1738371600,
  "jti": "7f3a9b4c-1d2e-456f-abcd-890123456789"
}`}
      </pre>
      <p>
        The payload contains two types of claims: <strong>registered claims</strong> defined by the JWT
        specification, and <strong>private/custom claims</strong> added by your application (like
        <code>name</code>, <code>email</code>, and <code>roles</code> above).
      </p>

      <h3>Part 3: The Signature</h3>
      <p>
        The third segment is the <strong>signature</strong>. It is computed by taking the Base64URL-encoded
        header, a dot, the Base64URL-encoded payload, and signing the result with the algorithm and key
        specified in the header. For HS256:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.7}}>
{`HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)`}
      </pre>
      <p>
        The signature ensures integrity: if anyone modifies even a single character in the header or payload
        after the token is issued, the signature becomes invalid and verification fails. Without knowing the
        signing secret (or the issuer's private key for RS256/ES256), an attacker cannot forge a valid token.
      </p>

      <h2>Standard JWT Claims Reference</h2>
      <div style={{overflowX: "auto", margin: "1.5rem 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Claim</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Full name</th>
              <th style={{padding: "10px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iss</code></td>
              <td style={{padding: "10px 16px"}}>Issuer</td>
              <td style={{padding: "10px 16px"}}>Who issued the token (e.g., your auth server URL)</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>sub</code></td>
              <td style={{padding: "10px 16px"}}>Subject</td>
              <td style={{padding: "10px 16px"}}>Who the token is about — typically the user's unique ID</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>aud</code></td>
              <td style={{padding: "10px 16px"}}>Audience</td>
              <td style={{padding: "10px 16px"}}>Which service(s) the token is intended for</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>exp</code></td>
              <td style={{padding: "10px 16px"}}>Expiration Time</td>
              <td style={{padding: "10px 16px"}}>Unix timestamp after which the token must be rejected</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "10px 16px"}}><code>iat</code></td>
              <td style={{padding: "10px 16px"}}>Issued At</td>
              <td style={{padding: "10px 16px"}}>Unix timestamp of when the token was created</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "10px 16px"}}><code>nbf</code></td>
              <td style={{padding: "10px 16px"}}>Not Before</td>
              <td style={{padding: "10px 16px"}}>Token is not valid before this Unix timestamp</td>
            </tr>
            <tr>
              <td style={{padding: "10px 16px"}}><code>jti</code></td>
              <td style={{padding: "10px 16px"}}>JWT ID</td>
              <td style={{padding: "10px 16px"}}>Unique identifier for the token — used to prevent replay attacks</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Why the exp Claim Is Critical</h2>
      <p>
        The <code>exp</code> claim is a Unix timestamp — the number of seconds since January 1, 1970 (UTC).
        In our example, <code>"exp": 1738371600</code>. To convert this to a human-readable date, you can use
        JavaScript:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`new Date(1738371600 * 1000).toUTCString()
// → "Sat, 01 Feb 2026 01:00:00 GMT"`}
      </pre>
      <p>
        JWT expiry is the first thing to check when a token is being rejected. A token that was valid yesterday
        will fail today if its <code>exp</code> is in the past — this is by design. Short-lived tokens (15
        minutes to 1 hour) limit the window of damage if a token is stolen. Longer-lived tokens (days or
        weeks) are more convenient but more dangerous if compromised.
      </p>
      <p>
        The <a href="/tools/jwt-decoder">BrowseryTools JWT Decoder</a> automatically reads the <code>exp</code>{" "}
        and <code>iat</code> claims and displays them as human-readable dates alongside the raw Unix timestamps,
        so you never have to do the mental math manually.
      </p>

      <h2>Common JWT Debugging Scenarios</h2>

      <h3>Token Expired (401 Unauthorized)</h3>
      <p>
        The most common JWT error. The server rejected the token because the current time is past the
        <code>exp</code> value. Fix: implement a token refresh flow using a longer-lived refresh token,
        or simply re-authenticate. Paste the token into the decoder to confirm exactly when it expired.
      </p>

      <h3>Wrong Audience</h3>
      <p>
        If your API validates the <code>aud</code> claim and the token was issued for a different audience
        (e.g., a token issued for <code>https://api-staging.example.com</code> being sent to{" "}
        <code>https://api.example.com</code>), the server will reject it. Decode the token and inspect the
        <code>aud</code> field to confirm it matches what the receiving service expects.
      </p>

      <h3>Algorithm Mismatch</h3>
      <p>
        If your server expects RS256 but receives a token signed with HS256 (or vice versa), validation
        fails. This can happen during key rotation or when switching auth providers. Check the <code>alg</code>{" "}
        field in the decoded header against what your server is configured to accept.
      </p>

      <h3>Signature Invalid</h3>
      <p>
        If the payload has been tampered with — even a single character changed — the signature will not
        match. This also happens if you are using the wrong secret or the wrong public key to verify.
        Decoding the header and payload (which requires no secret) lets you at least inspect what the token
        claims, even if you cannot verify its authenticity client-side.
      </p>

      <div style={{background: "#fef3c7", borderLeft: "4px solid #f59e0b", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Security warning — payload is not encrypted:</strong> The JWT payload is Base64URL-encoded,
        not encrypted. Anyone who has the token string can decode the header and payload without any key
        or secret. Never store sensitive information in a JWT payload — no passwords, payment card data,
        social security numbers, or private keys. Treat the payload as public-readable data that is merely
        tamper-evident, not confidential.
      </div>

      <h2>JWT vs Session Tokens: When to Use Each</h2>
      <p>
        JWTs and traditional session tokens solve the same problem — identifying an authenticated user across
        multiple requests — but they do it differently, and neither is universally better.
      </p>
      <p>
        <strong>Traditional session tokens</strong> are opaque random strings (e.g., a UUID) stored server-side
        in a session store (Redis, database). On each request the server looks up the token in the store and
        retrieves the user data. The server has full control: invalidating a session immediately revokes access.
      </p>
      <p>
        <strong>JWTs</strong> are stateless. The server issues a signed token and does not keep a record of it.
        On each request the server verifies the signature and trusts the claims without any database lookup.
        This scales horizontally without shared state — any server with the verification key can authenticate
        the request. The tradeoff: you cannot immediately revoke a JWT before it expires (unless you implement
        a token blocklist, which reintroduces state).
      </p>
      <ul>
        <li>Use <strong>JWTs</strong> for stateless microservices, distributed systems, mobile APIs, and
        cross-domain authentication (OAuth/OIDC flows). Keep expiry times short.</li>
        <li>Use <strong>session tokens</strong> when you need immediate revocation capability (logout,
        account suspension, security incidents), or when all your services share a fast session store.</li>
      </ul>

      <div style={{background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Critical security rule:</strong> Always verify JWT signatures server-side using a trusted
        key. Never rely on client-side verification alone. A client can decode the payload of any JWT without
        a secret — but only the server, holding the correct key, can determine whether the signature is
        genuine and the token can be trusted. Client-side decoding is only useful for <em>reading</em>{" "}
        claims (like showing the user's name in a UI), never for making authorization decisions.
      </div>

      <h2>How to Use the BrowseryTools JWT Decoder</h2>
      <p>
        Open the <a href="/tools/jwt-decoder">JWT Decoder</a> and paste your token into the input field.
        The tool immediately splits the token at the two dots and displays:
      </p>
      <ul>
        <li>
          <strong>Header panel:</strong> The decoded JSON showing <code>alg</code>, <code>typ</code>, and
          any other header fields. Useful for identifying the signing algorithm at a glance.
        </li>
        <li>
          <strong>Payload panel:</strong> The full decoded JSON with all claims. Timestamps are displayed
          in both raw Unix format and human-readable UTC dates so you can immediately see expiry without
          mental conversion.
        </li>
        <li>
          <strong>Expiry status:</strong> A clear indicator showing whether the token is currently valid,
          already expired, or not yet active (based on <code>nbf</code>). If expired, you see exactly how
          long ago it expired.
        </li>
        <li>
          <strong>Signature segment:</strong> The raw Base64URL-encoded signature, displayed for reference.
          The tool does not verify the signature (that requires the secret or public key), but it decodes
          and displays all the information you need for debugging.
        </li>
      </ul>
      <p>
        There is no form submission, no server request, no clipboard access beyond what you explicitly paste.
        The token parsing happens entirely in JavaScript running in your browser tab.
      </p>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Your tokens stay private:</strong> JWT tokens frequently contain user IDs, email addresses,
        roles, and other personal data. The BrowseryTools JWT Decoder processes your token entirely in your
        browser — it is never sent to any server, never logged, and never stored. You can safely paste
        production tokens to inspect them without worrying about exposure. Once you close the tab, it is gone.
      </div>

      <h2>Decode Your JWT Token Now</h2>
      <p>
        Whether you are debugging an expired token, inspecting claims from an OAuth provider, checking what
        roles a user has been granted, or simply trying to understand what your authentication system is
        actually issuing — the <a href="/tools/jwt-decoder">BrowseryTools JWT Decoder</a> gives you the
        answers instantly. No registration, no extensions to install, no data sent anywhere.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free JWT Decoder — Instant, Private, No Sign-Up
        </p>
        <a
          href="/tools/jwt-decoder"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open JWT Decoder →
        </a>
      </div>
    </div>
  );
}
