export default function Content() {
  return (
    <div>
      <p>
        For most of AI's short history, connecting a language model to an external tool meant writing
        custom integration code for every single tool. Want the model to read a file? Write a function.
        Query a database? Write a different function, in a different format, for every model you want to
        support. The result was a fragmented ecosystem where every AI application reinvented the same
        plumbing from scratch.
      </p>
      <p>
        Model Context Protocol (MCP) is Anthropic's answer to this problem: an open standard that gives
        AI models a single, consistent interface to tools, files, databases, and services. You can use the{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP Config Generator</a> — free, no sign-up, everything
        stays in your browser — to build and validate MCP configuration files without writing JSON by hand.
      </p>

      <h2>What Is MCP and Why Does It Exist?</h2>
      <p>
        MCP stands for Model Context Protocol. It is an open protocol — published by Anthropic in late
        2024 and available at modelcontextprotocol.io — that standardizes how AI models communicate with
        external data sources and tools. Think of it as a universal adapter: instead of a model needing a
        custom plugin for GitHub, a different one for your filesystem, and another for your database, MCP
        provides a single interface that any compliant client and server can speak.
      </p>
      <p>
        The analogy Anthropic uses is USB-C: before USB-C, you needed a different cable for every device.
        MCP aims to be that universal connector for AI tool use. A tool built once as an MCP server works
        with any MCP-compatible client — Claude Desktop, Claude Code, and any other host that implements
        the protocol.
      </p>

      <h2>MCP Architecture: Clients, Hosts, and Servers</h2>
      <p>
        MCP has three components that work together:
      </p>
      <ul>
        <li><strong>Host</strong> — The AI application running on the user's machine (e.g., Claude Desktop,
        an IDE extension). The host manages connections to one or more MCP servers and injects their
        capabilities into the AI context.</li>
        <li><strong>Client</strong> — A protocol client embedded in the host that maintains a 1:1 connection
        with a single MCP server. The host spawns one client per server.</li>
        <li><strong>Server</strong> — A lightweight program that exposes capabilities (tools, resources,
        prompts) through the MCP protocol. Servers can be local processes (running on your machine) or
        remote services reachable over HTTP.</li>
      </ul>
      <p>
        When you ask Claude to "read the README in my project," the host's MCP client sends a request to
        the filesystem MCP server, which reads the file and returns the content. Claude never touches your
        filesystem directly — the server does, and it reports back through the protocol.
      </p>

      <h2>What MCP Servers Can Expose</h2>
      <p>
        MCP servers can expose three types of capabilities:
      </p>
      <ul>
        <li><strong>Tools</strong> — Functions the model can call. Examples: search a database, create a
        GitHub issue, run a terminal command, fetch a URL.</li>
        <li><strong>Resources</strong> — Data the model can read. Examples: files, database rows, API
        responses, documentation pages. Resources are like read-only context sources.</li>
        <li><strong>Prompts</strong> — Pre-built prompt templates that users can invoke by name. Useful
        for exposing standardized workflows.</li>
      </ul>

      <h2>Common MCP Servers Worth Knowing</h2>
      <ul>
        <li><strong>filesystem</strong> — Reads and writes files on your local machine within a specified
        directory. The most commonly used server. Required for Claude Code to read your codebase.</li>
        <li><strong>github</strong> — Searches repositories, reads files, creates issues and pull requests,
        fetches commit history. Uses the GitHub API with your personal access token.</li>
        <li><strong>postgres / sqlite</strong> — Runs SQL queries against a database. Read-only by default
        in most implementations for safety.</li>
        <li><strong>brave-search / fetch</strong> — Fetches URLs or runs web searches, giving the model
        access to current information beyond its training cutoff.</li>
        <li><strong>memory</strong> — Persistent key-value storage that survives between sessions. Gives
        the model a memory layer it can write to and read from.</li>
        <li><strong>puppeteer / playwright</strong> — Controls a headless browser. Lets the model navigate
        web pages, fill forms, and extract content from JavaScript-rendered sites.</li>
      </ul>

      <h2>Writing a Basic MCP Config JSON</h2>
      <p>
        MCP configuration lives in a JSON file that the host application reads at startup. For Claude
        Desktop on macOS, this file is at{" "}
        <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. The structure is
        consistent regardless of which servers you add:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}`}
      </pre>
      <p>
        Each key inside <code>mcpServers</code> is the name you give the server — this is the label that
        appears in the Claude UI. The <code>command</code> and <code>args</code> fields define how to
        start the server process. Most official servers are npm packages, so <code>npx -y</code> downloads
        and runs them on first use without a separate install step.
      </p>

      <h2>Adding Multiple Servers</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}`}
      </pre>
      <p>
        The <code>env</code> field passes environment variables to the server process. Sensitive values
        like API keys and database credentials should go here, not hardcoded in <code>args</code>, so you
        can manage them separately and avoid accidentally committing them to version control.
      </p>

      <h2>Configuring MCP in Claude Code</h2>
      <p>
        Claude Code (the CLI tool) uses a slightly different configuration mechanism. You add MCP servers
        with the <code>claude mcp add</code> command:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`# Add a local stdio server
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Add a remote HTTP server
claude mcp add my-server --transport http http://localhost:8080/mcp

# Add with environment variables
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github

# List all configured servers
claude mcp list`}
      </pre>
      <p>
        Claude Code stores server configs in <code>~/.claude/</code> by default (user scope) or in
        <code>.mcp.json</code> at the project root (project scope). Project-scoped configs are useful for
        team repositories — commit the <code>.mcp.json</code> and everyone on the team gets the same
        server configuration automatically.
      </p>

      <h2>Common Configuration Mistakes</h2>
      <ul>
        <li><strong>Wrong path separator</strong> — Windows uses backslashes but JSON strings require
        forward slashes or escaped backslashes. Always use forward slashes in MCP configs, even on Windows.</li>
        <li><strong>Missing directory permissions</strong> — The filesystem server can only access
        directories you explicitly list in its args. If Claude says it cannot find a file, check that the
        file's parent directory is in the allowed list.</li>
        <li><strong>Stale server process</strong> — If a server crashes, the host may not restart it
        automatically. Restart Claude Desktop or run <code>claude mcp restart &lt;name&gt;</code> in
        Claude Code to get a fresh connection.</li>
        <li><strong>Version mismatches</strong> — MCP is actively developed. If a server is behaving
        unexpectedly, check whether you are running the latest version with{" "}
        <code>npx -y @modelcontextprotocol/server-name@latest</code>.</li>
      </ul>

      <h2>Generate Your Config with BrowseryTools</h2>
      <p>
        Writing MCP JSON by hand is tedious and easy to get wrong — a missing comma or a misquoted path
        makes the whole config fail silently. The{" "}
        <a href="/tools/mcp-config">BrowseryTools MCP Config Generator</a> lets you select your servers,
        fill in the required parameters, and get a valid, formatted JSON config ready to paste into your
        Claude Desktop config file or <code>.mcp.json</code>. Everything runs in your browser and no
        credentials are stored.
      </p>

      <h2>Summary</h2>
      <p>
        MCP is the infrastructure layer that transforms a standalone chat model into a connected agent
        with access to your actual files, code, databases, and services. The protocol is open, the servers
        are modular, and the configuration format is straightforward JSON. Once your MCP config is in
        place, you get a dramatically more capable AI assistant without changing how you interact with it —
        the tools are just there, ready to use.
      </p>
    </div>
  );
}
