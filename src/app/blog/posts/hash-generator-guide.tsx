export default function Content() {
  return (
    <div>
      <p>
        Every time you download a software release, verify a file's authenticity, sign a JWT token, or store a
        user's password, a cryptographic hash function is working in the background. Hash functions are one of
        the foundational primitives of modern computing security — and yet the differences between MD5, SHA-1,
        SHA-256, and SHA-512 are widely misunderstood, leading to real security mistakes in production systems.
      </p>
      <p>
        This guide explains what hash functions are, how each major algorithm works, when each is appropriate
        (and when it is dangerously inappropriate), and how to use the{" "}
        <a href="/tools/hash-generator">BrowseryTools Hash Generator</a> to compute hashes instantly in your
        browser with full privacy.
      </p>

      <h2>What Is a Cryptographic Hash Function?</h2>
      <p>
        A cryptographic hash function takes an input of arbitrary length and produces a fixed-length output
        called a digest or hash. Four properties define a good cryptographic hash function:
      </p>
      <ul>
        <li>
          <strong>Deterministic:</strong> The same input always produces exactly the same output. Hash
          functions have no internal state — given the same bytes, you always get the same digest.
        </li>
        <li>
          <strong>One-way (preimage resistance):</strong> Given a hash output, it should be computationally
          infeasible to recover the original input. Hash functions are designed to be easy to compute in one
          direction and effectively impossible to reverse.
        </li>
        <li>
          <strong>Fixed output length:</strong> Regardless of whether the input is one byte or one gigabyte,
          the output is always the same length. SHA-256 always produces a 256-bit (32-byte) digest.
        </li>
        <li>
          <strong>Avalanche effect:</strong> A single-bit change in the input completely transforms the output.
          The hash of <code>hello</code> looks nothing like the hash of <code>hello!</code> — they share zero
          predictable structure. This makes hashes useful as fingerprints.
        </li>
      </ul>
      <p>
        A fifth property — collision resistance — separates cryptographically strong hashes from broken ones:
        it should be computationally infeasible to find two different inputs that produce the same output.
        This is where MD5 and SHA-1 have failed.
      </p>

      <h2>MD5: Fast, Ubiquitous, and Broken for Security</h2>
      <p>
        MD5 (Message Digest 5) was designed by Ron Rivest and published in 1991. It produces a 128-bit (16-byte)
        digest, typically represented as a 32-character hexadecimal string like{" "}
        <code>5d41402abc4b2a76b9719d911017c592</code>. For over a decade it was the dominant hash algorithm
        for everything from file checksums to password storage.
      </p>
      <p>
        In 2004, cryptographers demonstrated practical collision attacks against MD5. By 2008, researchers had
        used collision attacks to forge a rogue certificate authority certificate trusted by all major browsers.
        MD5 is now definitively broken for any security purpose where collision resistance matters.
      </p>
      <p>
        Where MD5 is still acceptable:
      </p>
      <ul>
        <li>Non-security file integrity checks where you control both the generation and verification (confirming a file wasn't corrupted in transit, not that it wasn't tampered with).</li>
        <li>Checksums in internal systems where a bad actor is not in the threat model.</li>
        <li>Legacy system compatibility where you have no choice but to match an existing implementation.</li>
        <li>Cache keys and hash maps where security is irrelevant and speed matters.</li>
      </ul>
      <p>
        Where MD5 must never be used: TLS certificates, digital signatures, code signing, or anything where
        an attacker might benefit from finding a collision.
      </p>

      <h2>SHA-1: 160-Bit, Deprecated, Still Everywhere</h2>
      <p>
        SHA-1 (Secure Hash Algorithm 1) was published by NIST in 1995 and produces a 160-bit digest. It was
        the standard for TLS certificates, digital signatures, and software signing throughout the 2000s.
        Google's Project Zero demonstrated a practical SHA-1 collision in 2017 (the SHAttered attack), producing
        two different PDF files with identical SHA-1 hashes. This ended SHA-1's use in TLS — all major browser
        vendors stopped accepting SHA-1 certificates that same year.
      </p>
      <p>
        SHA-1 is still found in some notable places:
      </p>
      <ul>
        <li>
          <strong>Git:</strong> Git has historically used SHA-1 to identify every object in a repository —
          commits, blobs, trees, and tags. Git is actively migrating to SHA-256 (see below), but SHA-1 Git
          repositories remain extremely common. For this use case, collision resistance matters less because
          an attacker would need filesystem access to exploit a collision.
        </li>
        <li>Legacy authentication systems and older HMAC implementations.</li>
        <li>Some older enterprise software that has not been updated.</li>
      </ul>
      <p>
        For any new work: avoid SHA-1. Use SHA-256 or SHA-512.
      </p>

      <h2>SHA-256: The Current Standard</h2>
      <p>
        SHA-256 is part of the SHA-2 family, published by NIST in 2001. It produces a 256-bit (32-byte) digest
        — twice the output length of MD5 and 60% larger than SHA-1. No practical collision or preimage attacks
        against SHA-256 have been demonstrated. It remains the standard for security-sensitive hashing in 2026.
      </p>
      <p>
        SHA-256 is used everywhere:
      </p>
      <ul>
        <li><strong>TLS certificates:</strong> The CA/Browser Forum mandated SHA-256 as the minimum for certificate signatures. Every HTTPS connection you make is anchored by SHA-256.</li>
        <li><strong>Code signing:</strong> macOS, Windows Authenticode, and Linux package managers (APT, RPM) use SHA-256 to verify software integrity.</li>
        <li><strong>JWT tokens:</strong> The <code>HS256</code> algorithm in JSON Web Tokens is HMAC-SHA-256. It is by far the most common JWT signing algorithm in deployed systems.</li>
        <li><strong>Bitcoin:</strong> Bitcoin's proof-of-work algorithm is double-SHA-256 (SHA-256 applied twice).</li>
        <li><strong>Git (next generation):</strong> Git's SHA-256 object format (enabled with <code>--object-format=sha256</code>) uses SHA-256 for all object IDs.</li>
        <li>File integrity verification published alongside software downloads.</li>
      </ul>
      <p>
        If you need to pick a hash function and have no specific constraints, SHA-256 is the correct default
        choice in 2026.
      </p>

      <h2>SHA-512: Larger Output, Sometimes Faster</h2>
      <p>
        SHA-512 is also part of the SHA-2 family and produces a 512-bit (64-byte) digest. It provides a
        larger security margin than SHA-256 — 512 bits of output means the theoretical brute-force attack
        space is 2<sup>256</sup> times larger. In practice, this additional margin is irrelevant for most
        applications since SHA-256 is already computationally infeasible to break.
      </p>
      <p>
        The counterintuitive performance characteristic: SHA-512 is <em>faster</em> than SHA-256 on modern
        64-bit CPUs when hashing large data. SHA-512 processes data in 1024-bit blocks with 64-bit word
        operations, while SHA-256 uses 512-bit blocks with 32-bit operations. On a 64-bit processor, the
        64-bit operations map more efficiently to hardware. This makes SHA-512 the preferred choice for
        applications that hash large files on 64-bit servers.
      </p>
      <p>
        Use SHA-512 when:
      </p>
      <ul>
        <li>You are hashing large amounts of data on 64-bit hardware and want maximum throughput.</li>
        <li>Your system requires the additional security margin for regulatory or compliance reasons.</li>
        <li>You are implementing HMAC-SHA-512 (used in some JWT implementations with <code>HS512</code>).</li>
      </ul>

      <h2>Algorithm Comparison Table</h2>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Algorithm</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Output Length</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Speed (relative)</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Security Status</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Common Use Cases</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>MD5</strong></td>
              <td style={{padding: "12px 16px"}}>128-bit (32 hex chars)</td>
              <td style={{padding: "12px 16px"}}>Fastest</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Broken</strong> — collisions demonstrated</td>
              <td style={{padding: "12px 16px"}}>Non-security checksums, cache keys, legacy systems</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-1</strong></td>
              <td style={{padding: "12px 16px"}}>160-bit (40 hex chars)</td>
              <td style={{padding: "12px 16px"}}>Fast</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Deprecated</strong> — practical collisions exist</td>
              <td style={{padding: "12px 16px"}}>Legacy Git, old TLS (deprecated), some legacy auth</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-256</strong></td>
              <td style={{padding: "12px 16px"}}>256-bit (64 hex chars)</td>
              <td style={{padding: "12px 16px"}}>Fast</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Secure</strong> — current standard</td>
              <td style={{padding: "12px 16px"}}>TLS certificates, JWT (HS256), code signing, Bitcoin</td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong>SHA-512</strong></td>
              <td style={{padding: "12px 16px"}}>512-bit (128 hex chars)</td>
              <td style={{padding: "12px 16px"}}>Fastest on 64-bit for large data</td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Secure</strong> — larger safety margin</td>
              <td style={{padding: "12px 16px"}}>Large file hashing, JWT (HS512), high-security applications</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>File Integrity Verification: A Practical Example</h2>
      <p>
        One of the most common and legitimate uses of cryptographic hashes is verifying that a downloaded file
        is exactly what the publisher intended — not corrupted in transit and not tampered with by a third party.
        Most major software projects publish SHA-256 checksums alongside their downloads.
      </p>
      <p>
        The workflow looks like this:
      </p>
      <ul>
        <li>Download the file from the official source.</li>
        <li>Download the published checksum from the same official source (ideally signed with PGP).</li>
        <li>Compute the SHA-256 hash of the downloaded file.</li>
        <li>Compare your computed hash to the published hash character by character. Any difference means the file is not what the publisher distributed.</li>
      </ul>
      <p>
        The <a href="/tools/hash-generator">BrowseryTools Hash Generator</a> supports file hashing — drag in
        a file and it will compute the hash locally in your browser without uploading anything. Compare the
        result directly to the published checksum.
      </p>

      <h2>Password Storage: The One Thing Hashes Cannot Do Safely</h2>
      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem", color: "#dc2626"}}>
          Critical Warning: Never Store Passwords Using Plain Hash Functions
        </p>
        <p style={{marginTop: 0, marginBottom: "12px"}}>
          Storing passwords as MD5, SHA-256, or SHA-512 hashes — even with a salt — is insecure and a
          serious vulnerability in any production system. Here is why:
        </p>
        <ul style={{marginTop: 0, marginBottom: "12px"}}>
          <li>General-purpose hash functions are designed to be <em>fast</em>. A modern GPU can compute billions of SHA-256 hashes per second. If your database is breached, an attacker can brute-force every common password in minutes.</li>
          <li>Rainbow tables — precomputed lookup tables mapping hashes to inputs — can crack unsalted hashes of common passwords in milliseconds.</li>
          <li>Even with a unique salt per user, the raw speed of SHA-256 makes it easy to attack weak or medium-strength passwords at scale.</li>
        </ul>
        <p style={{marginTop: 0, marginBottom: 0}}>
          <strong>Use a password hashing function instead:</strong> <code>bcrypt</code>, <code>scrypt</code>,
          or <code>Argon2</code> (the winner of the Password Hashing Competition). These are deliberately slow
          and memory-intensive, making brute-force attacks orders of magnitude more expensive. Most modern
          frameworks include them out of the box. Argon2id is the current recommendation for new systems.
        </p>
      </div>

      <h2>How Git Uses SHA-1 (and Is Moving to SHA-256)</h2>
      <p>
        Git uses a hash function to identify every object in a repository. Every commit, file (blob), directory
        listing (tree), and tag is stored in the object database under its SHA-1 hash. When you run{" "}
        <code>git log</code>, the long hex strings you see — like{" "}
        <code>c206f4b3a9d72bc0e53a0e1a6e4bdf8c7f9d2e51</code> — are SHA-1 hashes of commit objects.
      </p>
      <p>
        Git chose SHA-1 in 2005 for speed and because at the time SHA-1 was not broken. The role of hashes
        in Git is slightly different from traditional security use: Git uses them as content-addressable
        storage keys, not authentication proofs. The content itself is what you trust — the hash is just an
        efficient way to look it up and detect accidental corruption.
      </p>
      <p>
        After the SHAttered SHA-1 collision in 2017, the Git project began work on transitioning to SHA-256.
        The new object format (<code>--object-format=sha256</code>) is available in Git 2.29+ and is used by
        default in some new repository hosts. Existing repositories can be migrated, though the transition is
        complex because every object ID changes.
      </p>

      <h2>HMAC: Hash-Based Message Authentication</h2>
      <p>
        A plain hash verifies data integrity (the data has not changed) but not authenticity (the data came
        from who you think it came from). If an attacker can intercept a message and recompute the hash after
        modifying it, a plain hash provides no protection.
      </p>
      <p>
        HMAC (Hash-based Message Authentication Code) solves this by incorporating a secret key into the
        hash computation. The result can only be produced by someone who knows the key. Verifying an HMAC
        proves both that the data is intact and that it was produced by a party with access to the shared
        secret.
      </p>
      <p>
        HMAC-SHA256 is everywhere:
      </p>
      <ul>
        <li><strong>JWT tokens (HS256):</strong> The server signs the token header and payload with HMAC-SHA256 using a secret key. Clients cannot forge valid tokens without the key.</li>
        <li><strong>API request signing:</strong> AWS Signature Version 4 uses HMAC-SHA256 to authenticate API requests. The request details and a derived signing key are hashed together so neither can be modified without invalidating the signature.</li>
        <li><strong>Cookie integrity:</strong> Many web frameworks use HMAC to sign session cookies, preventing users from tampering with their own session data.</li>
      </ul>

      <h2>How to Use the BrowseryTools Hash Generator</h2>
      <p>
        The <a href="/tools/hash-generator">Hash Generator</a> supports hashing both text input and file
        uploads entirely in your browser. Here is how it works:
      </p>
      <ul>
        <li>
          <strong>Text hashing:</strong> Paste any text into the input field. The tool immediately computes
          and displays the hash for every supported algorithm simultaneously — MD5, SHA-1, SHA-256, and
          SHA-512 — so you can compare them side by side and choose the one you need.
        </li>
        <li>
          <strong>File hashing:</strong> Click the file input or drag and drop any file. The file is read
          by your browser's File API and hashed locally. Large files are processed in chunks to avoid memory
          pressure. No bytes of your file leave your device.
        </li>
        <li>
          <strong>Choose algorithm:</strong> Select the specific algorithm to focus on for your use case.
          The full hex digest is displayed and can be copied with one click.
        </li>
        <li>
          <strong>Download as file:</strong> For documentation or distribution purposes, export the hash
          digest as a text file — useful for publishing checksums alongside your own software releases.
        </li>
      </ul>

      <h2>Privacy: The Web Crypto API</h2>
      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Everything stays on your device.</strong> The BrowseryTools Hash Generator uses the browser's
        built-in <code>window.crypto.subtle</code> API (the Web Crypto API) to compute SHA-family hashes.
        This is native cryptography implemented by your browser's C++ engine — not JavaScript math. For MD5,
        a pure JavaScript implementation runs locally. In both cases, no data — not a single byte of your
        text or file content — is ever transmitted to BrowseryTools servers or any third-party service.
        Hash computation happens entirely within your browser process.
      </div>

      <h2>Choosing the Right Algorithm: A Decision Guide</h2>
      <ul>
        <li><strong>File integrity / checksums (non-security):</strong> MD5 or SHA-256. SHA-256 is preferred for anything public-facing even if the threat model is only accidental corruption, since using a broken algorithm by choice is hard to justify to auditors.</li>
        <li><strong>TLS, code signing, certificate operations:</strong> SHA-256 (mandatory — SHA-1 is rejected).</li>
        <li><strong>JWT signing:</strong> HMAC-SHA-256 (HS256) for symmetric, or RS256/ES256 for asymmetric. Never MD5 or SHA-1.</li>
        <li><strong>Password storage:</strong> Argon2id, bcrypt, or scrypt. Not SHA-anything.</li>
        <li><strong>Large file hashing on 64-bit servers:</strong> SHA-512 for best throughput.</li>
        <li><strong>Maximum security margin:</strong> SHA-512 or SHA-3 (SHA3-256, SHA3-512).</li>
        <li><strong>Legacy compatibility:</strong> Whatever the legacy system requires — but plan the migration away from MD5 and SHA-1.</li>
      </ul>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Generate MD5, SHA-1, SHA-256 and SHA-512 hashes instantly
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Paste text or drop a file. All hashing happens in your browser using the Web Crypto API.
          Nothing is uploaded. Nothing is logged.
        </p>
        <a
          href="/tools/hash-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Open Hash Generator →
        </a>
      </div>
    </div>
  );
}
