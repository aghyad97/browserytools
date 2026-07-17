import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Roman numerals are everywhere once you start looking: the copyright year at the end of a
        film, the chapter numbers in a book, Super Bowl titles, clock faces, the &ldquo;MMXXVI&rdquo;
        on a cornerstone. They are elegant, but reading and writing them is not intuitive — quick,
        what is <strong>MCMXCIV</strong>? This guide explains exactly how Roman numerals work, the
        rules that trip people up, and how to convert any number in both directions instantly.
      </p>
      <ToolCTA slug="roman-numeral" variant="inline" />
      <p>
        If you just need the answer, the{" "}
        <a href="/tools/roman-numeral">BrowseryTools Roman Numeral Converter</a> turns numbers into
        Roman numerals and back again in your browser — free, no sign-up, nothing uploaded. Read on
        for how the system actually works so you can verify any result yourself.
      </p>

      <h2>The Seven Symbols</h2>
      <p>
        The entire system is built from just seven letters, each with a fixed value:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000`}
      </pre>
      <p>
        Every Roman numeral is some arrangement of these seven symbols. There is no zero, and there
        is no symbol for negative numbers — the system was built for counting and labeling, not for
        arithmetic.
      </p>

      <h2>The Two Rules That Govern Everything</h2>
      <p>
        <strong>Rule 1 — Add when symbols descend.</strong> When a symbol of equal or smaller value
        follows a larger one, you add them. So <code>VI</code> is 5 + 1 = 6, <code>XV</code> is
        10 + 5 = 15, and <code>MDC</code> is 1000 + 500 + 100 = 1600. You read left to right and keep
        a running total.
      </p>
      <p>
        <strong>Rule 2 — Subtract when a smaller symbol precedes a larger one.</strong> Putting a
        smaller value <em>before</em> a larger one means subtract. <code>IV</code> is 5 &minus; 1 =
        4, <code>IX</code> is 10 &minus; 1 = 9, <code>XL</code> is 50 &minus; 10 = 40, and{" "}
        <code>CM</code> is 1000 &minus; 100 = 900. This subtractive notation is why Roman numerals
        avoid four-in-a-row repetition like IIII.
      </p>
      <p>
        Only six subtractive pairs are valid: <code>IV</code> (4), <code>IX</code> (9),{" "}
        <code>XL</code> (40), <code>XC</code> (90), <code>CD</code> (400), and <code>CM</code> (900).
        You subtract only powers of ten (I, X, C), and only from the next one or two steps up.
      </p>

      <h2>How to Read MCMXCIV (the Tricky One)</h2>
      <p>
        Break it into the subtractive and additive chunks from left to right:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.95rem", lineHeight: 1.8}}>
{`M    = 1000
CM   =  900   (1000 - 100)
XC   =   90   (100 - 10)
IV   =    4   (5 - 1)
-----------
       1994`}
      </pre>
      <p>
        So <strong>MCMXCIV = 1994</strong>. Once you can spot the four subtractive chunks, even
        long numerals decode quickly.
      </p>

      <h2>How to Write a Number as a Roman Numeral</h2>
      <p>
        Work one digit place at a time, from thousands down to ones, and write each place using its
        symbols:
      </p>
      <p>
        Take <strong>2026</strong>. Thousands: 2 &rarr; <code>MM</code>. Hundreds: 0 &rarr; nothing.
        Tens: 2 &rarr; <code>XX</code>. Ones: 6 &rarr; <code>VI</code>. Put them together:{" "}
        <strong>MMXXVI</strong>. Take <strong>49</strong>: tens 4 &rarr; <code>XL</code>, ones 9 &rarr;{" "}
        <code>IX</code>, giving <strong>XLIX</strong> — a good reminder that 49 is <em>not</em> IL,
        because you can only subtract from the next one or two steps up.
      </p>

      <h2>Common Mistakes</h2>
      <p>
        <strong>Repeating a symbol four times.</strong> 4 is <code>IV</code>, not <code>IIII</code>;
        40 is <code>XL</code>, not <code>XXXX</code>. (Clock faces are a quirky exception that often
        use IIII for 4 for visual balance.)
      </p>
      <p>
        <strong>Illegal subtractions.</strong> 99 is <code>XCIX</code> (90 + 9), not <code>IC</code>.
        You cannot subtract I from C. Stick to the six valid pairs.
      </p>
      <p>
        <strong>Numbers above 3999.</strong> Standard Roman numerals top out at 3999 (MMMCMXCIX).
        Larger values historically used a bar over a letter to multiply by 1000, but that is rarely
        needed today.
      </p>

      <h2>Where You Still See Roman Numerals</h2>
      <p>
        Movie and TV copyright years, book chapters and page prefixes, monarch and pope names
        (Elizabeth II, Benedict XVI), the Super Bowl, Olympic Games, clock and watch faces, building
        cornerstones, and outline numbering. Knowing the rules turns all of these from a puzzle into
        an instant read.
      </p>

      <h2>Frequently Asked Questions</h2>
      <p>
        <strong>How do you write 0 in Roman numerals?</strong> You do not — the system has no symbol
        for zero. Medieval scholars sometimes used the word <em>nulla</em> instead.
      </p>
      <p>
        <strong>What is the largest standard Roman numeral?</strong> 3999, written MMMCMXCIX.
      </p>
      <p>
        <strong>Why do clocks use IIII instead of IV?</strong> Tradition and visual symmetry; it
        balances the VIII on the opposite side. It is a stylistic exception, not the standard rule.
      </p>
      <p>
        <strong>Can I convert both directions?</strong> Yes — the{" "}
        <a href="/tools/roman-numeral">converter</a> goes from numbers to numerals and from numerals
        back to numbers.
      </p>

      <h2>Convert Instantly</h2>
      <p>
        Open the <a href="/tools/roman-numeral">Roman Numeral Converter</a> to translate any number
        in either direction — handy for decoding a copyright year or writing a tattoo, title, or
        cornerstone. While you are here, BrowseryTools also has a{" "}
        <a href="/tools/calculator">scientific calculator</a> and a{" "}
        <a href="/tools/percentage-calculator">percentage calculator</a> for the math the Romans
        never got around to.
      </p>
      <ToolCTA slug="roman-numeral" variant="card" />
    </div>
  );
}
