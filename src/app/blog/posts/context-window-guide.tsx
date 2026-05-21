export default function Content() {
  return (
    <div>
      <p>
        One of the most common sources of frustration for developers building with LLMs is hitting
        an invisible wall — a request that fails without explanation, a conversation that suddenly
        loses context, or a document that gets processed incompletely. In almost every case, the
        culprit is the context window. Understanding what a context window is, what its limits mean
        in practice, and how to work within them skillfully is foundational to building reliable
        AI-powered applications.
      </p>
      <p>
        You can use the{" "}
        <a href="/tools/context-window">BrowseryTools Context Window tool</a> — free, no sign-up,
        everything stays in your browser — to visualize how much of a model's context window
        your content occupies before you send it to an API.
      </p>

      <h2>What Is a Context Window?</h2>
      <p>
        A context window is the maximum amount of text — measured in tokens — that a language model
        can "see" and reason about in a single request. It is the model's working memory. Everything
        that is relevant to generating the next token must fit within this window: your system prompt,
        the full conversation history, any documents you've included, and the tokens the model is
        generating right now.
      </p>
      <p>
        Unlike human working memory, which degrades gradually as it gets overloaded, context windows
        have a hard limit. When you exceed it, the API returns an error. There is no partial success —
        the request simply fails, and your application must handle that gracefully.
      </p>
      <p>
        The context window is a single pool shared by input and output. If a model has a 128K token
        context window and your input is 120K tokens, you have only 8K tokens left for the model's
        response. This is an important constraint when designing tasks that require long outputs.
      </p>

      <h2>Current Context Window Limits by Model</h2>
      <p>
        Context windows have grown dramatically over the past few years, and the numbers continue
        to expand as models improve:
      </p>
      <ul>
        <li>
          <strong>GPT-4o</strong> — 128,000 tokens (~96,000 words). Enough for a full novel or
          a large codebase.
        </li>
        <li>
          <strong>Claude 3.5 Sonnet / Claude 3 Opus</strong> — 200,000 tokens (~150,000 words).
          Anthropic has consistently pushed this limit further than OpenAI.
        </li>
        <li>
          <strong>Gemini 1.5 Pro</strong> — 1,000,000 tokens (~750,000 words). A genuinely
          unprecedented context window that can hold entire codebases or hours of meeting transcripts.
        </li>
        <li>
          <strong>Gemini 1.5 Flash</strong> — 1,000,000 tokens, optimized for speed and lower cost.
        </li>
        <li>
          <strong>Llama 3.1 (70B / 405B)</strong> — 128,000 tokens, available via various providers
          including together.ai and Groq.
        </li>
        <li>
          <strong>Mistral Large</strong> — 128,000 tokens.
        </li>
      </ul>
      <p>
        For comparison, this entire blog post is around 1,200 tokens. Even the "small" 128K window
        of GPT-4o is large enough to process the entirety of most practical documents. The question
        is not just whether your content fits — it's how the model handles content at different
        positions within that window.
      </p>

      <h2>What Happens When You Exceed the Context Window</h2>
      <p>
        When your input exceeds the model's maximum context length, the API returns an error. Common
        error messages include:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`// OpenAI
{
  "error": {
    "type": "invalid_request_error",
    "code": "context_length_exceeded",
    "message": "This model's maximum context length is 128000 tokens. However, your messages resulted in 134291 tokens."
  }
}

// Anthropic
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "prompt is too long: 201483 tokens > 200000 maximum"
  }
}`}
      </pre>
      <p>
        In a chat application, this commonly happens after enough turns in a long conversation. As
        each user message and assistant reply is appended to the history, the total token count grows
        until it hits the limit. Without proactive management, the application crashes on the next
        turn. Users experience this as the AI suddenly refusing to respond or throwing an error
        mid-conversation — a deeply frustrating experience.
      </p>

      <h2>The "Lost in the Middle" Problem</h2>
      <p>
        Having a large context window does not mean the model attends equally to all of it. Research
        has consistently shown that transformer-based models perform better on information placed at
        the beginning or end of the context — a phenomenon known as the <strong>lost in the middle</strong>{" "}
        problem.
      </p>
      <p>
        In practice, this means that if you are doing retrieval-augmented generation (RAG) and you
        inject 20 retrieved document chunks into the middle of a long context, the model may fail
        to reference the chunks in positions 8–14 even if they are the most relevant. The most
        important information for your task should be placed either at the very beginning (near the
        system prompt) or at the very end (just before the user's question) of the context.
      </p>
      <p>
        This also means that simply giving the model a 1M token context and dumping everything you
        have into it is not always the right strategy. A focused 10K context with precisely the
        right information will often outperform a 500K context filled with loosely relevant material.
      </p>

      <h2>Strategies for Working Within Context Limits</h2>

      <h3>Chunking</h3>
      <p>
        For documents that exceed the context window, split them into overlapping chunks and process
        each chunk independently. Use a small overlap (e.g., 20% of the chunk size) to preserve
        continuity across chunk boundaries. This works well for tasks like summarization, extraction,
        and classification where each chunk is relatively self-contained.
      </p>

      <h3>Summarization / Compression</h3>
      <p>
        For long conversations or document histories, periodically summarize older content and replace
        it with the summary. A conversation of 50 turns can often be compressed to a 300-token summary
        that preserves the key context without consuming the full history. This is particularly
        effective in chat applications where the conversation's early turns become less relevant as
        it progresses.
      </p>

      <h3>Retrieval-Augmented Generation (RAG)</h3>
      <p>
        Instead of putting entire documents in the context, embed them into a vector database and
        retrieve only the most relevant passages at query time. A well-designed RAG system can make
        a model with a 128K context window effectively "know" about millions of tokens of documentation —
        it just retrieves what's needed per query. This also reduces cost significantly compared to
        using a full long-context model on every request.
      </p>

      <h3>Selective Context Inclusion</h3>
      <p>
        Be deliberate about what you include. In a coding assistant, you don't need to include every
        file in the project — just the files relevant to the current task. In a document Q&A system,
        don't include the entire document unless the question is about something that spans the whole
        document. Build logic that selects context intelligently rather than including everything by
        default.
      </p>

      <h2>How to Monitor Your Context Usage</h2>
      <p>
        Most AI provider APIs return token usage in their responses. OpenAI's response object includes
        a <code>usage</code> field with <code>prompt_tokens</code>, <code>completion_tokens</code>, and{" "}
        <code>total_tokens</code>. Anthropic returns <code>input_tokens</code> and <code>output_tokens</code>.
        Logging these counts for every request gives you visibility into growth trends before you hit
        the limit.
      </p>
      <p>
        For pre-flight checks before sending a request, use the{" "}
        <a href="/tools/context-window">BrowseryTools Context Window tool</a> to paste your prompt
        and see exactly how many tokens it occupies and what percentage of each model's context window
        that represents. This is especially useful when building system prompts or designing RAG
        retrieval strategies — you can see the impact of your choices before making a single API call.
      </p>

      <h2>Bigger Is Not Always Better</h2>
      <p>
        The expansion of context windows is a genuine engineering achievement, and million-token
        contexts open up genuinely new use cases. But for most applications, the winning strategy
        is not to fill the context window as much as possible — it is to put the right information
        in the right position within a well-scoped context. Combine that with an understanding of
        how much context you're using at any given moment, and you'll build applications that are
        faster, cheaper, and more reliable than those that treat the context window as a dumping ground.
      </p>

      <div style={{background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free Context Window Tool — Visualize Your Prompt Size Instantly
        </p>
        <a
          href="/tools/context-window"
          style={{background: "rgba(168,85,247,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open Context Window Tool →
        </a>
      </div>
    </div>
  );
}
