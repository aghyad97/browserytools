export default function Content() {
  return (
    <div>
      <p>
        Regular expressions are one of those tools that developers either love or avoid entirely.
        They look intimidating — a dense string of special characters that seems to defy all
        readability — but the underlying model is simple. Once you understand how they work, a
        well-crafted regex becomes one of the most powerful single-line tools in your entire
        toolkit.
      </p>
      <p>
        This guide cuts through the noise. Instead of cataloguing every regex feature, it focuses
        on the 20% of syntax that handles 80% of real-world use cases: character classes,
        quantifiers, anchors, groups, and flags. Along the way, you can test every example in the{" "}
        <a href="/tools/regex-tester">BrowseryTools Regex Tester</a> — free, no sign-up,
        everything stays in your browser.
      </p>

      <h2>What Is a Regular Expression?</h2>
      <p>
        A regular expression is a pattern that describes a set of strings. When you apply a regex
        to a piece of text, you are asking: "does this string match my pattern?" — or more
        practically: "find all substrings that match my pattern." The pattern itself is written
        in a compact mini-language that most programming languages support natively.
      </p>
      <p>
        Regular expressions are useful whenever you need to validate input (is this a valid email
        address?), extract data (pull all URLs from a block of text), transform text (replace all
        occurrences of a pattern), or split a string on a complex delimiter. They run in the
        browser, on the server, in the terminal — everywhere.
      </p>

      <h2>The Core Syntax: 20% That Covers 80% of Cases</h2>

      <h3>Literal Characters and the Dot</h3>
      <p>
        Most characters in a regex match themselves. The pattern <code>hello</code> matches the
        string "hello" literally. The dot <code>.</code> is the one universal wildcard — it matches
        any single character except a newline. So <code>h.llo</code> matches "hello", "hallo",
        "hxllo", and so on.
      </p>

      <h3>Character Classes</h3>
      <p>
        Square brackets define a character class — a set of characters where any one of them can
        match at that position.
      </p>
      <ul>
        <li><strong><code>[aeiou]</code></strong> — matches any single vowel</li>
        <li><strong><code>[a-z]</code></strong> — matches any lowercase letter (range syntax)</li>
        <li><strong><code>[A-Za-z0-9]</code></strong> — matches any alphanumeric character</li>
        <li><strong><code>[^0-9]</code></strong> — the <code>^</code> inside brackets negates the class; matches anything that is NOT a digit</li>
      </ul>
      <p>
        Shorthand classes cover the most common cases: <code>\d</code> matches any digit (same as{" "}
        <code>[0-9]</code>), <code>\w</code> matches any word character (letters, digits,
        underscore), and <code>\s</code> matches any whitespace. Their uppercase inverses —{" "}
        <code>\D</code>, <code>\W</code>, <code>\S</code> — match the opposite.
      </p>

      <h3>Quantifiers</h3>
      <p>
        Quantifiers control how many times the preceding element must appear.
      </p>
      <ul>
        <li><strong><code>*</code></strong> — zero or more times</li>
        <li><strong><code>+</code></strong> — one or more times</li>
        <li><strong><code>?</code></strong> — zero or one time (makes something optional)</li>
        <li><strong><code>{"{3}"}</code></strong> — exactly 3 times</li>
        <li><strong><code>{"{2,5}"}</code></strong> — between 2 and 5 times (inclusive)</li>
        <li><strong><code>{"{3,}"}</code></strong> — 3 or more times</li>
      </ul>
      <p>
        By default, quantifiers are greedy — they match as much as possible. Adding a{" "}
        <code>?</code> after the quantifier makes it lazy: <code>.*?</code> matches as little as
        possible. This distinction matters a lot when extracting content between delimiters.
      </p>

      <h3>Anchors</h3>
      <p>
        Anchors do not match characters; they match positions in the string.
      </p>
      <ul>
        <li><strong><code>^</code></strong> — the start of the string (or start of a line in multiline mode)</li>
        <li><strong><code>$</code></strong> — the end of the string (or end of a line in multiline mode)</li>
        <li><strong><code>\b</code></strong> — a word boundary — the position between a word character and a non-word character</li>
      </ul>
      <p>
        Anchors are essential for validation. Without them, the pattern <code>\d+</code> would
        match the digits inside "abc123xyz". With anchors — <code>^\d+$</code> — it only matches
        strings that consist entirely of digits.
      </p>

      <h3>Groups and Alternation</h3>
      <p>
        Parentheses create capturing groups. They serve two purposes: grouping a sub-expression
        so a quantifier applies to the whole group, and capturing the matched substring for
        extraction.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// Group with quantifier: match one or more "ab" repetitions
/(ab)+/   →  matches "ab", "abab", "ababab"

// Alternation with |: match "cat" or "dog"
/(cat|dog)/  →  matches "I have a cat" and "I have a dog"

// Named capture group
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/`}
      </pre>
      <p>
        Non-capturing groups — <code>(?:...)</code> — group without capturing, which is cleaner
        when you only need the grouping behavior and do not need to extract the matched text.
      </p>

      <h2>Practical Examples</h2>

      <h3>Email Validation</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`}
      </pre>
      <p>
        Breaking it down: <code>^</code> anchors to the start. <code>[a-zA-Z0-9._%+-]+</code>{" "}
        matches the local part (one or more allowed characters). <code>@</code> is a literal at-sign.{" "}
        <code>[a-zA-Z0-9.-]+</code> matches the domain name. <code>\.</code> is a literal dot
        (escaped, since unescaped <code>.</code> means "any character"). <code>[a-zA-Z]{"{2,}"}</code>{" "}
        matches the TLD with at least 2 letters. <code>$</code> anchors to the end.
      </p>

      <h3>Phone Number (US Format)</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/^\+?1?\s?(\(?\d{3}\)?[\s.-]?)(\d{3}[\s.-]?\d{4})$/`}
      </pre>
      <p>
        This matches formats like <code>555-867-5309</code>, <code>(555) 867-5309</code>,{" "}
        <code>+1 555 867 5309</code>, and <code>5558675309</code>. The key trick is using{" "}
        <code>?</code> to make separators optional and grouping the area code with optional
        parentheses.
      </p>

      <h3>Extracting URLs from Text</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`/https?:\/\/[^\s"'<>]+/g`}
      </pre>
      <p>
        <code>https?</code> matches both "http" and "https" (the <code>s</code> is optional).{" "}
        <code>:\/\/</code> matches the literal "://" with slashes escaped. <code>[^\s"'&lt;&gt;]+</code>{" "}
        matches everything that is not whitespace or common URL-terminating characters. The{" "}
        <code>g</code> flag finds all matches, not just the first.
      </p>

      <h2>Regex Flags</h2>
      <p>
        Flags modify how the entire pattern is applied.
      </p>
      <ul>
        <li><strong><code>g</code> (global)</strong> — find all matches, not just the first</li>
        <li><strong><code>i</code> (case-insensitive)</strong> — treat uppercase and lowercase as equivalent; <code>/hello/i</code> matches "Hello", "HELLO", and "hello"</li>
        <li><strong><code>m</code> (multiline)</strong> — makes <code>^</code> and <code>$</code> match start/end of each line rather than the entire string</li>
        <li><strong><code>s</code> (dotAll)</strong> — makes <code>.</code> also match newlines, useful for matching across line breaks</li>
      </ul>
      <p>
        In JavaScript, flags go after the closing slash: <code>/pattern/gi</code>. In Python,
        they are passed as a second argument: <code>re.findall(pattern, text, re.IGNORECASE)</code>.
      </p>

      <h2>JavaScript vs Python: Key Differences</h2>
      <p>
        The regex syntax is largely the same between JavaScript and Python, but there are a few
        important differences.
      </p>
      <ul>
        <li><strong>Named groups</strong>: JavaScript uses <code>(?&lt;name&gt;...)</code>, Python uses the same. Both return named groups but access them differently — <code>match.groups.name</code> in JS, <code>match.group('name')</code> in Python.</li>
        <li><strong>Lookahead / lookbehind</strong>: Both support <code>(?=...)</code> (positive lookahead) and <code>(?!...)</code> (negative lookahead). Python also supports variable-length lookbehinds; older JavaScript engines do not.</li>
        <li><strong>Unicode</strong>: JavaScript requires the <code>u</code> flag to handle Unicode property escapes like <code>\p{"{Letter}"}</code>. Python's <code>re</code> module handles Unicode by default.</li>
        <li><strong>Raw strings</strong>: In Python, always use raw strings (<code>r"\d+"</code>) to avoid double-escaping backslashes. In JavaScript, you either use the literal <code>/\d+/</code> syntax or the string <code>"\\d+"</code> when constructing with <code>new RegExp()</code>.</li>
      </ul>

      <h2>Common Regex Mistakes</h2>
      <ul>
        <li><strong>Catastrophic backtracking</strong> — patterns like <code>(a+)+</code> on a string that does not match can cause exponential backtracking, locking up the engine. Avoid nested quantifiers on overlapping patterns.</li>
        <li><strong>Forgetting to escape the dot</strong> — <code>3.14</code> as a pattern matches "3X14" because <code>.</code> is a wildcard. Use <code>3\.14</code> to match the literal period.</li>
        <li><strong>Not anchoring validation patterns</strong> — without <code>^</code> and <code>$</code>, a pattern meant to validate the whole string will match any string containing the pattern as a substring.</li>
        <li><strong>Using regex for HTML parsing</strong> — regex cannot handle arbitrarily nested structures. Use a proper HTML parser (DOMParser in the browser, BeautifulSoup in Python) for HTML.</li>
      </ul>

      <h2>Test Your Patterns Safely in the Browser</h2>
      <p>
        Writing regex in an editor with no feedback loop is painful. You write a pattern, run your
        code, see it fail, tweak the pattern, run again. A live regex tester short-circuits this
        loop — you see matches highlighted in real-time as you type.
      </p>
      <p>
        The{" "}
        <a href="/tools/regex-tester">BrowseryTools Regex Tester</a> lets you write a pattern,
        paste in test strings, and see all matches highlighted instantly. It runs entirely in
        your browser, so you can test against real data — logs, user input, production strings —
        without sending anything to a server.
      </p>

      <h2>Summary</h2>
      <p>
        Regular expressions reward the time you invest in learning them. The core vocabulary —
        character classes, quantifiers, anchors, groups, and flags — is small. The patterns you
        can build from it are vast. Start with the examples in this guide, test them against your
        own strings, and the syntax will become intuitive faster than you expect.
      </p>
    </div>
  );
}
