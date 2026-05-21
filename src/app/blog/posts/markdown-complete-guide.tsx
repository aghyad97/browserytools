export default function Content() {
  return (
    <div>
      <p>
        Markdown is everywhere. It is the default writing format on GitHub, the backbone of most static site
        generators, the native language of tools like Obsidian and Notion, and the format developers reach for
        when writing READMEs, documentation, and technical notes. Despite being ubiquitous, many writers and
        developers only learn the basics — bold, italic, and a few heading levels — and miss the features that
        make Markdown genuinely powerful for structured writing.
      </p>
      <p>
        You can write and preview Markdown instantly using the{" "}
        <a href="/tools/markdown-editor">BrowseryTools Markdown Editor</a> — free, no sign-up, everything stays
        in your browser.
      </p>

      <h2>Who Created Markdown and Why</h2>
      <p>
        Markdown was created by John Gruber, in collaboration with Aaron Swartz, and released in 2004. Gruber's
        stated goal was to create a plain-text writing format that is readable as-is — before any rendering —
        and that converts cleanly to valid HTML. The name is a play on "markup language" (HTML is HyperText
        Markup Language), flipping the concept: instead of adding syntax to control formatting, Markdown uses
        the natural punctuation habits people had already developed in plain-text email.
      </p>
      <p>
        The motivation was practical. HTML is verbose and distracting to write inline. A sentence like
        <code> &lt;p&gt;This is &lt;strong&gt;important&lt;/strong&gt; text.&lt;/p&gt;</code> requires
        significant mental overhead compared to <code>This is **important** text.</code> Gruber wanted
        bloggers and writers to focus on words, not tags. The original Markdown specification was a Perl
        script that converted plain-text Markdown files to HTML.
      </p>

      <h2>Basic Syntax</h2>
      <p>
        The core Markdown syntax covers everything most writers need for structured documents.
      </p>

      <h3>Headings</h3>
      <p>
        Use hash signs to create headings. One hash for H1, two for H2, up to six for H6. Most style guides
        recommend only one H1 per document (typically the title) and using H2–H4 for content hierarchy.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4`}
      </pre>

      <h3>Emphasis and Strong</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`*italic* or _italic_
**bold** or __bold__
***bold and italic***
~~strikethrough~~`}
      </pre>

      <h3>Links and Images</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`[Link text](https://example.com)
[Link with title](https://example.com "Page title")
![Alt text](image.png)
![Alt text](image.png "Image title")`}
      </pre>

      <h3>Lists</h3>
      <p>
        Unordered lists use hyphens, asterisks, or plus signs. Ordered lists use numbers followed by periods.
        Indented items (2 or 4 spaces) create nested lists.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- Unordered item
- Another item
  - Nested item

1. First
2. Second
3. Third`}
      </pre>

      <h3>Code</h3>
      <p>
        Inline code uses single backticks. Fenced code blocks use triple backticks with an optional language
        identifier for syntax highlighting.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Use \`console.log()\` for debugging.

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\``}
      </pre>

      <h3>Blockquotes</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too.`}
      </pre>

      <h3>Horizontal Rules</h3>
      <p>
        Three or more hyphens, asterisks, or underscores on a line by themselves create a horizontal rule.
        <code>---</code> is the most common convention.
      </p>

      <h2>Extended Syntax</h2>
      <p>
        The original Markdown specification left out several features that writers commonly need. Extended
        syntax, supported by most modern processors, adds these capabilities.
      </p>

      <h3>Tables</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`| Column 1  | Column 2  | Column 3  |
|-----------|:---------:|----------:|
| Left      | Center    | Right     |
| aligned   | aligned   | aligned   |`}
      </pre>
      <p>
        The colon position in the separator row controls alignment: left (default), center (colons on both sides),
        or right (colon on the right).
      </p>

      <h3>Task Lists</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`- [x] Write first draft
- [x] Peer review
- [ ] Final edits
- [ ] Publish`}
      </pre>

      <h3>Footnotes</h3>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Here is a claim that needs a citation.[^1]

[^1]: The supporting source or explanation goes here.`}
      </pre>

      <h2>Markdown Flavors: CommonMark, GFM, and MDX</h2>
      <p>
        The original Markdown specification had ambiguities — places where processors made different decisions
        about edge cases. This led to incompatible implementations across different tools. Several standards
        efforts emerged to resolve this.
      </p>
      <ul>
        <li>
          <strong>CommonMark</strong> — a rigorous specification that resolves every ambiguity in the original
          Markdown spec with a formal test suite. Adopted by Discourse, Reddit, Stack Overflow, and many others.
          The most interoperable flavor.
        </li>
        <li>
          <strong>GitHub Flavored Markdown (GFM)</strong> — GitHub's extension of CommonMark that adds tables,
          task lists, strikethrough, autolinks, and literal URLs. If you write README files or GitHub comments,
          you are using GFM.
        </li>
        <li>
          <strong>MDX</strong> — Markdown extended with JSX component support, used heavily in React-based
          documentation sites (Next.js docs, Docusaurus, Astro). Allows importing and embedding React
          components directly in Markdown files.
        </li>
        <li>
          <strong>MultiMarkdown / Pandoc Markdown</strong> — feature-rich extensions for academic writing,
          with support for citations, math equations (LaTeX), and complex table formatting.
        </li>
      </ul>

      <h2>Where Markdown Is Used</h2>
      <ul>
        <li><strong>GitHub and GitLab</strong> — README files, issues, pull requests, wikis, and comments all render Markdown</li>
        <li><strong>Notion</strong> — supports Markdown import/export and a subset of Markdown shortcuts for inline formatting</li>
        <li><strong>Obsidian</strong> — a knowledge management app built entirely on Markdown files with wikilink extensions</li>
        <li><strong>Static site generators</strong> — Jekyll, Hugo, Gatsby, Astro, and Next.js all use Markdown or MDX as the default content format</li>
        <li><strong>Documentation platforms</strong> — ReadTheDocs, GitBook, and Docusaurus are built around Markdown</li>
        <li><strong>Chat platforms</strong> — Slack, Discord, and Teams support subsets of Markdown for message formatting</li>
        <li><strong>Email clients</strong> — some clients (Superhuman, HEY) support Markdown input</li>
      </ul>

      <h2>Markdown vs Rich Text Editors</h2>
      <p>
        Rich text editors (WYSIWYG — What You See Is What You Get) like Google Docs, Microsoft Word, or
        Contentful's built-in editor show formatted output while you type. Markdown shows the raw source.
        The tradeoffs are real.
      </p>
      <ul>
        <li><strong>Markdown advantages</strong> — plain text files, works in any editor, version-controllable with git, no vendor lock-in, fast keyboard-only workflow</li>
        <li><strong>Rich text advantages</strong> — immediately visual, no syntax to learn, easier for non-technical contributors, better for complex formatting (footnotes, comments, tracked changes)</li>
      </ul>
      <p>
        For technical writing, developer documentation, and personal knowledge management, Markdown's portability
        and version-control compatibility make it the better choice. For collaborative business documents or
        content with complex formatting requirements, a rich text editor is often more practical.
      </p>

      <h2>Common Markdown Mistakes</h2>
      <ul>
        <li><strong>Missing blank lines</strong> — most block elements (headings, lists, code blocks) require a blank line before and after them to render correctly</li>
        <li><strong>Spaces after hash signs</strong> — <code>##Heading</code> without a space after the hashes is not a heading in most processors</li>
        <li><strong>Inconsistent list markers</strong> — mixing <code>-</code> and <code>*</code> in the same list can produce unexpected results in some processors</li>
        <li><strong>Forgetting to escape special characters</strong> — asterisks, underscores, and backticks inside text need a backslash escape if they should render literally</li>
        <li><strong>Assuming extended syntax is universal</strong> — tables and task lists are GFM features not supported by all processors; check your target environment</li>
      </ul>
      <p>
        The <a href="/tools/markdown-editor">BrowseryTools Markdown Editor</a> provides a live preview so you
        can catch rendering issues immediately as you write, without copying text into another tool. Paste your
        Markdown and see the rendered HTML output side by side.
      </p>
    </div>
  );
}
