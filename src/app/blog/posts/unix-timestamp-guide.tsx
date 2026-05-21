export default function Content() {
  return (
    <div>
      <p>
        Open any log file. Look at a JWT token's expiry claim. Check the <code>created_at</code>{" "}
        field in an API response. Chances are, you will encounter a number like{" "}
        <code>1711065600</code> or <code>1711065600000</code>. That is a Unix timestamp — a
        simple integer that represents a point in time. Understanding how Unix time works, where
        it comes from, and how to handle its common pitfalls will save you from a class of bugs
        that are subtle, hard to reproduce, and occasionally embarrassing in production.
      </p>
      <p>
        You can convert any Unix timestamp to a human-readable date (and back) using the{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix Timestamp Converter</a> — free,
        no sign-up, everything stays in your browser.
      </p>

      <h2>What Is a Unix Timestamp?</h2>
      <p>
        A Unix timestamp is the number of seconds that have elapsed since the Unix Epoch: midnight
        on January 1, 1970, Coordinated Universal Time (UTC). This moment — 00:00:00 UTC on
        1970-01-01 — was chosen as the reference point when the Unix operating system was being
        developed in the early 1970s. It was a recent, round date that made calculations
        straightforward on the hardware of the era.
      </p>
      <p>
        The elegance of Unix time is that any moment in time is represented as a single integer.
        Comparing two timestamps is a subtraction. Checking if something has expired is a
        comparison. Adding an interval is addition. No timezones, no calendar math, no daylight
        saving time — just a number.
      </p>
      <p>
        As of 2026, the current Unix timestamp is approximately <code>1,774,000,000</code>.
        Every second, that number increases by 1.
      </p>

      <h2>The Y2K38 Problem</h2>
      <p>
        If Unix time is stored as a 32-bit signed integer — which it was in many early
        implementations — the maximum value is <code>2,147,483,647</code>. That number corresponds
        to 03:14:07 UTC on January 19, 2038. After that moment, a 32-bit signed integer overflows
        back to a large negative number, and systems that have not been updated will interpret
        timestamps incorrectly.
      </p>
      <p>
        This is the Year 2038 problem (Y2K38), and it is the Unix-era equivalent of the Y2K bug.
        Modern systems use 64-bit integers for timestamps, which extends the representable range
        to roughly 292 billion years in either direction — effectively forever for any practical
        purpose. But embedded systems, legacy databases with 32-bit timestamp columns, and older
        C code that uses <code>time_t</code> as a 32-bit type are still at risk.
      </p>

      <h2>Getting the Current Timestamp</h2>
      <p>
        Here is how to get the current Unix timestamp in the most common languages:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — returns milliseconds, divide by 1000 for seconds
const nowMs = Date.now();           // e.g. 1711065600000
const nowSec = Math.floor(Date.now() / 1000);  // e.g. 1711065600

// Python
import time
now = int(time.time())  # seconds since epoch

# Using datetime module
from datetime import datetime, timezone
now = int(datetime.now(timezone.utc).timestamp())

// Go
import "time"
now := time.Now().Unix()         // seconds
nowNano := time.Now().UnixNano() // nanoseconds

-- SQL (PostgreSQL)
SELECT EXTRACT(EPOCH FROM NOW())::BIGINT;

-- SQL (MySQL)
SELECT UNIX_TIMESTAMP();`}
      </pre>

      <h2>Converting Timestamps to Human Dates</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// JavaScript — from seconds
const ts = 1711065600;
const date = new Date(ts * 1000);          // multiply by 1000 for ms
console.log(date.toISOString());            // "2024-03-22T00:00:00.000Z"
console.log(date.toLocaleDateString());    // locale-formatted date

// Python
import datetime
ts = 1711065600
dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2024-03-22T00:00:00+00:00

-- PostgreSQL: timestamp from integer
SELECT to_timestamp(1711065600);
-- Result: 2024-03-22 00:00:00+00

-- MySQL
SELECT FROM_UNIXTIME(1711065600);
-- Result: 2024-03-22 00:00:00`}
      </pre>

      <h2>The #1 Timestamp Bug: Milliseconds vs Seconds</h2>
      <p>
        JavaScript's <code>Date.now()</code> returns milliseconds. The Unix standard — and
        virtually every other language, database, and API — uses seconds. This mismatch is the
        single most common source of timestamp bugs.
      </p>
      <p>
        The symptoms are unmistakable: dates show up as 1970 (timestamp divided by 1000
        accidentally, or treated as seconds when it is actually milliseconds), or dates show up
        in the year 56,000+ (seconds treated as milliseconds and then divided again). A value
        around <code>1,700,000,000</code> is almost certainly seconds. A value around{" "}
        <code>1,700,000,000,000</code> is almost certainly milliseconds.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Bug: treating seconds as milliseconds — lands in 1970
new Date(1711065600)        // Mon Jan 20 1970 11:24:25 UTC 🚫

// Correct: multiply seconds by 1000
new Date(1711065600 * 1000) // Fri Mar 22 2024 00:00:00 UTC ✓

// Defensive helper — handles both seconds and milliseconds
function toDate(ts) {
  // If it's under 10^12, it's seconds; multiply
  return new Date(ts < 1e12 ? ts * 1000 : ts);
}`}
      </pre>

      <h2>Timezone Issues with Timestamps</h2>
      <p>
        Unix timestamps are always in UTC — they represent a single absolute moment in time,
        with no timezone attached. The timezone question only arises at the display layer, when
        you convert a timestamp to a human-readable format.
      </p>
      <p>
        The most common mistake is using local timezone methods without realizing it.
        <code>new Date(ts).toLocaleDateString()</code> in JavaScript returns the date in the
        browser's local timezone. If your server generates a timestamp at 23:00 UTC and a user
        in UTC+0 and a user in UTC+1 both display it, they will see different calendar dates.
        Whether that is correct depends on the product requirement — but it must be a deliberate
        choice, not an accidental one.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Always explicit about timezone — use toISOString() for UTC
const date = new Date(1711065600 * 1000);
date.toISOString()        // "2024-03-22T00:00:00.000Z"  ← always UTC

// Or use Intl.DateTimeFormat for locale/timezone display
new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  dateStyle: "full",
}).format(date);  // "Friday, March 22, 2024"`}
      </pre>

      <h2>Timestamps in Databases</h2>
      <p>
        Databases offer two main options for storing dates: a <code>TIMESTAMP</code> column type
        (which stores an absolute moment in time) and a <code>DATE</code> or <code>DATETIME</code>{" "}
        column type (which stores a calendar representation without an inherent timezone).
      </p>
      <p>
        For fields like <code>created_at</code>, <code>updated_at</code>, and event timestamps,
        always use a <code>TIMESTAMP WITH TIME ZONE</code> column (or the database equivalent)
        rather than a plain integer. This lets the database handle timezone conversion and
        comparison correctly, and it makes queries like "events in the last 24 hours" accurate
        regardless of server timezone settings.
      </p>
      <p>
        When you do need to store a Unix timestamp as a raw integer (for compatibility with
        external systems or for maximum portability), document clearly whether it is seconds or
        milliseconds, and be consistent across the entire schema.
      </p>

      <h2>Timestamps in JWTs and APIs</h2>
      <p>
        JSON Web Tokens (JWTs) use Unix timestamps (in seconds) for their time claims:
      </p>
      <ul>
        <li><strong><code>iat</code></strong> — issued at: the time the token was created</li>
        <li><strong><code>exp</code></strong> — expiry: the time after which the token should not be accepted</li>
        <li><strong><code>nbf</code></strong> — not before: the token should not be used before this time</li>
      </ul>
      <p>
        Checking JWT expiry is a simple comparison: <code>exp &gt; Math.floor(Date.now() / 1000)</code>.
        If the current time in seconds is greater than <code>exp</code>, the token has expired.
        Always validate <code>exp</code> on the server — never trust client-side expiry checks alone.
      </p>

      <h2>Quick Reference: Timestamp Conversions</h2>
      <p>
        For fast, accurate conversions between Unix timestamps and human-readable dates, use the{" "}
        <a href="/tools/unix-timestamp">BrowseryTools Unix Timestamp Converter</a>. Paste a
        timestamp to see the corresponding UTC and local date, or enter a date to get its
        timestamp. Everything runs in the browser — no server, no tracking.
      </p>

      <h2>Summary</h2>
      <p>
        Unix timestamps are a universal, unambiguous way to represent moments in time. The key
        rules: they are always UTC, always in seconds (unless you are in JavaScript, where{" "}
        <code>Date.now()</code> uses milliseconds), and always a positive integer for any date
        after 1970. Handle the milliseconds/seconds distinction explicitly, use UTC for storage
        and transmission, and convert to local time only at the display layer.
      </p>
    </div>
  );
}
