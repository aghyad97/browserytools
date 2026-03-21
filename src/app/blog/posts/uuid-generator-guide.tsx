export default function Content() {
  return (
    <div>
      <p>
        Every database record, API resource, distributed event, and session token needs a unique identifier.
        The choice of ID format matters more than it might seem — it affects security, database performance,
        URL readability, and how well your system behaves when you eventually run multiple servers or merge
        data from different sources. This guide covers the main options: UUIDs (v1, v4, v7), NanoIDs, and
        CUIDs, and when to reach for each one.
      </p>
      <p>
        You can generate UUIDs and other unique IDs instantly with the{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID Generator</a> — free, no sign-up, everything
        generated locally in your browser.
      </p>

      <h2>Why Auto-Increment IDs Fall Short</h2>
      <p>
        Sequential integer IDs (<code>1, 2, 3, ...</code>) are the default in most relational databases, and
        they work well for simple single-server applications. But they create problems at scale or in
        distributed systems:
      </p>
      <ul>
        <li><strong>Predictability</strong> — anyone who knows one ID can guess others. <code>/orders/1042</code> makes it obvious that order 1041 exists and that your business is not large. This is an IDOR (Insecure Direct Object Reference) vulnerability if you do not enforce authorization at the application layer.</li>
        <li><strong>Merge conflicts</strong> — when you need to combine data from two databases, two separate auto-increment sequences will have colliding IDs. Multi-tenant systems, offline-first apps, and migrations all hit this problem.</li>
        <li><strong>Distributed generation</strong> — if multiple servers or workers are inserting records, you need a coordination mechanism (a single sequence, or a database-level sequence) to avoid duplicate IDs. This creates a bottleneck.</li>
        <li><strong>Leaking business metrics</strong> — sequential IDs leak order volume, user count, and growth rate to competitors or researchers watching public IDs over time.</li>
      </ul>

      <h2>What Is a UUID?</h2>
      <p>
        A UUID (Universally Unique Identifier, also called a GUID) is a 128-bit number, conventionally
        displayed as 32 hexadecimal digits in five hyphen-separated groups:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx

Example: 550e8400-e29b-41d4-a716-446655440000
          ^        ^    ^    ^    ^
          |        |    |    |    12 hex digits (48 bits)
          |        |    |    variant bits (N)
          |        |    version digit (M)
          |        4 hex digits
          8 hex digits`}
      </pre>
      <p>
        The version digit (M) tells you which UUID generation algorithm was used. The variant bits (N) are
        always <code>8</code>, <code>9</code>, <code>a</code>, or <code>b</code> in standard UUIDs. The
        remaining 122 bits are available for actual identifier data.
      </p>

      <h2>UUID v1: MAC Address + Timestamp</h2>
      <p>
        UUID v1 combines the current timestamp (in 100-nanosecond intervals since October 15, 1582) with
        the MAC address of the generating machine and a clock sequence to handle rapid generation. The result
        is theoretically unique across all machines and time.
      </p>
      <p>
        The problem is that v1 UUIDs reveal both when and where they were generated — the MAC address is
        embedded in plain sight. This is a privacy concern, and it was exploited in the Melissa worm (1999)
        to trace infected documents back to specific machines. For this reason, v1 is rarely used in new
        applications. Most developers who want time-ordered IDs reach for v7 instead.
      </p>

      <h2>UUID v4: Random</h2>
      <p>
        UUID v4 is the most widely used variant. It is 122 bits of cryptographically random data (the
        remaining 6 bits encode the version and variant). There is no timestamp, no MAC address, no
        sequential component — just entropy.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Node.js 14.17+
const { randomUUID } = require('crypto');
randomUUID(); // → "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

// Browser
crypto.randomUUID(); // → "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"

// Python
import uuid
str(uuid.uuid4()) # → "3d6f4580-2b3e-44e4-9d40-2d0ab12b4e7e"`}
      </pre>

      <h2>How Unlikely Are UUID v4 Collisions?</h2>
      <p>
        With 122 bits of randomness, the probability of a collision is extraordinarily small. To have a
        50% probability of at least one collision, you would need to generate approximately
        2.7 × 10<sup>18</sup> UUIDs — that is 2.7 quintillion. If you generated one billion UUIDs per second,
        it would take about 85 years to reach that threshold. For any real application, collisions are not
        a practical concern. The far more likely source of duplicate IDs is application bugs (copy-paste
        errors, cache hits returning old IDs, etc.), not the generator itself.
      </p>

      <h2>UUID v7: Time-Ordered Random</h2>
      <p>
        UUID v7 was standardized in RFC 9562 (2024) to address the main practical drawback of v4: random
        UUIDs make terrible database primary keys because they destroy index locality. When records are
        inserted with random IDs, each insert lands in a random position in a B-tree index, causing page
        splits, cache misses, and fragmentation at scale.
      </p>
      <p>
        UUID v7 embeds a millisecond-precision Unix timestamp in the most significant bits, followed by
        random data. This means v7 UUIDs are sortable — records inserted chronologically have lexicographically
        increasing IDs — while still being globally unique and unpredictable beyond the millisecond boundary:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v7 structure:
[48 bits: Unix ms timestamp][4 bits: version=7][12 bits: random][2 bits: variant][62 bits: random]

Three v7 UUIDs generated in sequence:
  0192fe2c-4b3a-7000-8000-0a1b2c3d4e5f  ← earliest
  0192fe2c-4b3b-7001-8000-0a1b2c3d4e60  ← slightly later
  0192fe2c-4b3c-7002-8000-0a1b2c3d4e61  ← latest
  ^^^^^^^^^^ timestamp prefix increases monotonically`}
      </pre>
      <p>
        If you are building a new application that uses UUIDs as primary keys in a relational database,
        v7 is the right default in 2024 and beyond.
      </p>

      <h2>NanoID: Shorter, URL-Safe</h2>
      <p>
        NanoID is not a UUID — it is a different ID format entirely, but it solves the same problem. By
        default it generates a 21-character string using an alphabet of URL-safe characters
        (<code>A-Za-z0-9_-</code>). This gives 126 bits of entropy — comparable to UUID v4 — in a string
        that is 21 characters instead of 36. NanoID strings are URL-friendly without encoding and look
        cleaner in logs and user-facing URLs:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`UUID v4:  9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d  (36 chars)
NanoID:   V1StGXR8_Z5jdHi6B-myT                  (21 chars)

import { nanoid } from 'nanoid';
nanoid();      // → "V1StGXR8_Z5jdHi6B-myT"
nanoid(10);    // → "IRFa-VaY2b"  (custom length)`}
      </pre>
      <p>
        NanoID is popular for short link IDs, session tokens, invite codes, and any use case where the ID
        appears in a URL and you want it to be compact.
      </p>

      <h2>CUID2: Sortable, Fingerprint-Free</h2>
      <p>
        CUID2 (the successor to CUID) is designed specifically for use as database primary keys. It generates
        a 24-character string that is sortable by creation time, uses no MAC address or fingerprint, and is
        harder to predict than timestamp-based IDs. CUID2 uses SHA-3 internally to mix the timestamp with
        random data, making the output unpredictable even when generated at the same millisecond.
      </p>
      <p>
        CUID2 is a good choice when you want sortable IDs, want to avoid the UUID format entirely, and care
        about the ID being opaque (not leaking timestamp information directly).
      </p>

      <h2>Choosing the Right Format</h2>
      <ul>
        <li><strong>Database primary key, new project</strong> — UUID v7 or CUID2. Both are sortable, which keeps index performance healthy as data grows.</li>
        <li><strong>General-purpose unique ID, interoperability</strong> — UUID v4. Every language and framework understands the UUID format natively.</li>
        <li><strong>Short links, invite codes, URL tokens</strong> — NanoID. Compact, URL-safe, configurable length.</li>
        <li><strong>Distributed systems where IDs are generated client-side</strong> — UUID v4 or v7. No coordination needed; clients generate their own IDs before committing to the server.</li>
        <li><strong>Avoid v1</strong> — it leaks your MAC address. No new project should use it.</li>
      </ul>

      <h2>Performance of UUID as a Primary Key</h2>
      <p>
        The classic warning about "don't use UUIDs as primary keys" is specifically about random UUIDs (v4)
        in MySQL with InnoDB or in any database that clusters data by primary key. Random insertion order
        fragments the clustered index. In PostgreSQL with a non-clustered UUID index, the penalty is less
        severe but still real at large scale. The practical solution: use UUID v7 or CUID2 (which are
        monotonically increasing) and the fragmentation problem largely disappears. Use the{" "}
        <a href="/tools/uuid-generator">BrowseryTools UUID Generator</a> to generate v7 UUIDs for testing
        your schema before committing to a format.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free UUID Generator — v1, v4, v7, NanoID, CUID2
        </p>
        <a
          href="/tools/uuid-generator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open UUID Generator →
        </a>
      </div>
    </div>
  );
}
