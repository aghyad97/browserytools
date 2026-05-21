export default function Content() {
  return (
    <div>
      <p>
        Every developer has faced this situation: two versions of a file that should be identical, but
        something changed. Maybe it is a config file that was manually edited on a server. Maybe it is
        a contract that came back from a lawyer with undisclosed changes. Maybe it is a translation file
        that a vendor returned and you need to verify nothing was accidentally deleted. In all these cases,
        the answer is the same: run a diff.
      </p>
      <p>
        You can compare any two blocks of text instantly using the{" "}
        <a href="/tools/text-diff">BrowseryTools Text Diff tool</a> — free, no sign-up, everything stays
        in your browser.
      </p>

      <h2>Why Text Diffing Matters</h2>
      <p>
        Text diffing is not just a developer tool. Any situation where two versions of a document exist
        and differences need to be surfaced is a diffing problem:
      </p>
      <ul>
        <li><strong>Code review</strong> — understanding what changed between two versions of source code before approving a merge</li>
        <li><strong>Contract and legal document comparison</strong> — identifying exactly which clauses were added, removed, or modified between drafts</li>
        <li><strong>Configuration management</strong> — confirming that a deployed config file matches the version in source control</li>
        <li><strong>Translated content verification</strong> — checking that a translated document covers all the same sections as the original</li>
        <li><strong>Data validation</strong> — comparing CSV exports from two systems to find discrepancies</li>
        <li><strong>Proofreading</strong> — catching unintended changes between a document draft and its published version</li>
      </ul>

      <h2>How Diff Algorithms Work</h2>
      <p>
        The core problem a diff algorithm solves is: given two sequences A and B, find the minimum set of
        edits (insertions and deletions) required to transform A into B. This is formally the
        Longest Common Subsequence (LCS) problem. The diff then reports what was not in the LCS — the
        lines unique to A (deletions) and the lines unique to B (insertions).
      </p>
      <p>
        Two algorithms dominate practical implementations:
      </p>
      <ul>
        <li>
          <strong>Myers diff (1986)</strong> — the algorithm behind the original Unix <code>diff</code>
          command and Git. Eugene Myers designed it to find the shortest edit script (the diff with the
          fewest total insertions and deletions) in O(ND) time, where N is the total size of both inputs
          and D is the number of differences. It is fast and produces minimal diffs, but can produce
          unintuitive output when large blocks of code are moved.
        </li>
        <li>
          <strong>Patience diff</strong> — developed by Bram Cohen (creator of BitTorrent) and used by
          Bazaar, later popularized by Kaleidoscope. Instead of working line by line, patience diff first
          matches unique lines that appear exactly once in both files. This produces output that preserves
          function and block boundaries much better than Myers diff for source code. Git supports it via
          <code>git diff --patience</code>.
        </li>
      </ul>

      <h2>Reading Unified Diff Output</h2>
      <p>
        The unified diff format is the standard output of <code>git diff</code> and most diff tools. Once
        you understand the notation, it becomes instantly readable.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`--- a/config.yml       (original file)
+++ b/config.yml       (modified file)
@@ -10,7 +10,8 @@     (hunk header)
 server:
   host: localhost
-  port: 3000
+  port: 8080
+  timeout: 30
   debug: false`}
      </pre>
      <p>
        The key elements to read:
      </p>
      <ul>
        <li><strong>Lines starting with <code>-</code></strong> — present in the original, removed in the new version (shown in red)</li>
        <li><strong>Lines starting with <code>+</code></strong> — not in the original, added in the new version (shown in green)</li>
        <li><strong>Lines with no prefix (space)</strong> — unchanged context lines, shown for orientation</li>
        <li>
          <strong>The <code>@@</code> hunk header</strong> — reads as "starting at line 10, showing 7 lines from
          the original; starting at line 10, showing 8 lines from the new version." The format is
          <code>@@ -start,count +start,count @@</code>.
        </li>
      </ul>

      <h2>Word-Level vs Line-Level vs Character-Level Diff</h2>
      <p>
        The granularity of a diff determines how useful it is for a given task.
      </p>
      <ul>
        <li>
          <strong>Line-level diff</strong> — the default for source code. Each line is treated as an atomic
          unit. Fast and appropriate for code where lines are short and meaningful. If a single word changes
          in a long paragraph, the entire line shows as changed.
        </li>
        <li>
          <strong>Word-level diff</strong> — appropriate for prose and documentation. Changed words within
          a line are highlighted individually, giving much clearer signal in text-heavy documents. Most
          document comparison tools (Microsoft Word Track Changes, Google Docs version history) operate
          at word level.
        </li>
        <li>
          <strong>Character-level diff</strong> — highlights individual character changes within words.
          Most useful for detecting subtle typos, whitespace changes, invisible characters (zero-width
          spaces, non-breaking spaces), or encoding differences. Essential for comparing data that looks
          identical visually but differs at the byte level.
        </li>
      </ul>
      <p>
        The <a href="/tools/text-diff">BrowseryTools Text Diff tool</a> highlights differences inline,
        making it easy to spot changes at a glance without reading the unified diff format manually.
      </p>

      <h2>Git Diff Under the Hood</h2>
      <p>
        When you run <code>git diff</code>, Git computes the Myers diff between the object versions
        stored in its object database. A few useful flags change the behavior:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`git diff                      # unstaged changes vs last commit
git diff --staged             # staged changes vs last commit
git diff HEAD~3               # current state vs 3 commits ago
git diff main...feature       # what feature branch adds to main
git diff --word-diff          # word-level highlighting
git diff --patience           # use patience algorithm (better for code)
git diff --stat               # summary: files changed, insertions, deletions`}
      </pre>
      <p>
        Understanding <code>git diff main...feature</code> specifically: the triple-dot notation shows
        what the feature branch has added since it diverged from main, excluding any changes that have
        happened on main since the branch point. This is almost always what you want for pull request
        review, rather than the double-dot <code>main..feature</code> which compares the current tips
        of both branches directly.
      </p>

      <h2>Practical Use Cases</h2>

      <h3>Comparing Config Files</h3>
      <p>
        Config files (YAML, TOML, JSON, .env) are frequent sources of production bugs when deployed
        versions diverge from source-controlled versions. Before debugging a mysterious production issue,
        diffing the live config against the expected config often surfaces the cause immediately.
      </p>

      <h3>Contract and Document Comparison</h3>
      <p>
        When a contract draft comes back from the other party, never trust a summary of what changed.
        Export both versions to plain text and run a diff. Lawyers are known to change defined terms,
        add liability caps, or alter notice periods in ways that a quick read misses. A word-level diff
        makes every change visible.
      </p>

      <h3>Translated Document Verification</h3>
      <p>
        When working with translated content, compare the translated document's structure against the
        source. A structural diff of section headings and paragraph counts reveals whether any sections
        were accidentally omitted or merged during translation.
      </p>

      <h2>Diff Tools Compared</h2>
      <ul>
        <li><strong>git diff</strong> — built-in, line-level, unified diff format, no GUI. The baseline for all code work.</li>
        <li><strong>vimdiff</strong> — terminal-based side-by-side diff inside Vim. Powerful for quick comparisons without leaving the terminal; steep learning curve.</li>
        <li><strong>Beyond Compare</strong> — commercial desktop tool with folder sync, binary diff, and three-way merge. The gold standard for non-developer document comparison.</li>
        <li><strong>Meld</strong> — free, cross-platform GUI diff tool with three-way merge support. The best free alternative to Beyond Compare.</li>
        <li><strong>BrowseryTools Text Diff</strong> — instant, browser-based, no installation. Best for quick one-off comparisons, especially for text you would not want to paste into an online service.</li>
      </ul>
    </div>
  );
}
