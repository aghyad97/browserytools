export default function Content() {
  return (
    <div>
      <p>
        When developers first start working with large language model APIs, one question comes up
        almost immediately: "How long is too long?" They think in words, paragraphs, or characters —
        but the model thinks in tokens. Understanding what tokens are, how they're counted, and why
        the count matters is one of the most practically useful things you can learn before building
        anything serious on top of an LLM.
      </p>
      <p>
        You can use the{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a> — free, no sign-up, everything
        stays in your browser — to count tokens for any text before you send it to an API.
      </p>

      <h2>What Is a Token? (Not a Word, Not a Character)</h2>
      <p>
        A token is the fundamental unit of text that a language model processes. It is not a word.
        It is not a character. It is a chunk of text that the model's tokenizer has learned to treat
        as a single unit — and that chunk can be anywhere from a single character to a multi-character
        word fragment or an entire common word.
      </p>
      <p>
        Here are some examples of how a sentence might be split into tokens by a GPT-family tokenizer:
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`"Hello, world!"
→ ["Hello", ",", " world", "!"]  — 4 tokens

"unbelievable"
→ ["un", "believ", "able"]  — 3 tokens

"ChatGPT"
→ ["Chat", "G", "PT"]  — 3 tokens

"2026-03-22"
→ ["2026", "-", "03", "-", "22"]  — 5 tokens`}
</pre>
      <p>
        Notice how common short words like "Hello" map to a single token, while longer or unusual
        words get split across multiple tokens. Punctuation, numbers, and special characters are
        often their own tokens. The tokenizer does not simply split on spaces or punctuation — it
        uses a learned vocabulary of sub-word units to achieve the best balance between vocabulary
        size and representation efficiency.
      </p>

      <h2>How Tokenizers Work: Byte-Pair Encoding</h2>
      <p>
        Most modern LLMs — GPT-4, Claude, Gemini, Llama — use a variant of <strong>Byte-Pair Encoding
        (BPE)</strong> or a closely related algorithm called SentencePiece. BPE was originally
        developed for data compression; it was adapted for NLP because it elegantly solves the
        open-vocabulary problem.
      </p>
      <p>
        The BPE training process starts with individual characters (or bytes) as the base vocabulary.
        It then repeatedly finds the most frequently co-occurring pair of symbols in the training corpus
        and merges them into a new single symbol. After thousands of such merges, the resulting
        vocabulary contains common words as single tokens, common prefixes and suffixes as tokens,
        and rare words as sequences of smaller tokens. The final vocabulary size is typically 32,000
        to 100,000 tokens.
      </p>
      <p>
        This means the tokenization of any given piece of text depends entirely on the specific
        vocabulary that model was trained with. <strong>GPT-4, Claude, and Gemini all use different
        tokenizers</strong> — the same text may tokenize to different counts on each model. Never
        assume a token count you measured for one model applies to another.
      </p>

      <h2>The "750 Words per 1,000 Tokens" Rule of Thumb</h2>
      <p>
        You will often see the approximation "1,000 tokens ≈ 750 words" cited for English text. This
        is a reasonable heuristic for typical prose — blog posts, articles, documentation. It comes
        from the observation that in a balanced English corpus, the average token length is around
        4–5 characters, and the average English word is around 5 characters plus a space. So a word
        maps to roughly 1.3 tokens on average.
      </p>
      <p>
        But "rule of thumb" is the right framing — it breaks down quickly in practice:
      </p>
      <ul>
        <li>
          <strong>Code tokenizes more densely</strong> — Programming languages use many short keywords,
          operators, and identifiers that are often single tokens. A block of Python may tokenize to
          fewer tokens per character than English prose.
        </li>
        <li>
          <strong>URLs and technical strings are expensive</strong> — A long URL like
          <code>https://api.example.com/v2/users/84219/preferences?include=notifications</code> may
          tokenize into 20+ tokens despite looking short on screen.
        </li>
        <li>
          <strong>Numbers are surprisingly costly</strong> — Each digit in a long number is often a
          separate token. The number "1738371600" can become 5–7 tokens.
        </li>
        <li>
          <strong>Repeated whitespace and formatting</strong> — JSON with pretty-print indentation,
          Markdown tables, and code with deep nesting all add tokens from whitespace.
        </li>
      </ul>

      <h2>Non-English Languages: Arabic, Chinese, and the Token Cost Difference</h2>
      <p>
        The 750-words-per-1,000-tokens heuristic is an <em>English</em> heuristic. For other languages,
        the ratio can be dramatically different — and this has real cost implications for multilingual
        applications.
      </p>
      <p>
        <strong>Arabic and Hebrew</strong> use root-and-pattern morphology, where a single root
        generates dozens of derived forms through prefixes, suffixes, and internal vowel changes.
        Words like "وسيستخدمونها" (they will use it) are single orthographic words but may tokenize
        into 5–8 tokens because the BPE vocabulary was trained predominantly on English data and
        doesn't have these Arabic forms as single tokens.
      </p>
      <p>
        <strong>Chinese and Japanese</strong> have a different challenge. Characters are logographic —
        each character is a meaningful unit — but the token vocabulary covers common single characters
        and some common multi-character words. Chinese text typically runs 1.5–2x more tokens per
        "word equivalent" than English. Japanese, with its mixture of hiragana, katakana, and kanji,
        can run even higher.
      </p>
      <p>
        A practical implication: if you are building an application for Arabic, Chinese, or other
        non-Latin script languages, your cost estimates derived from English testing will significantly
        under-predict actual API costs. Always measure token counts with your actual content using the{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a> or a tokenizer library
        before making budget projections.
      </p>

      <h2>Context Window Limits: Why Exceeding Them Breaks Everything</h2>
      <p>
        Every LLM has a <strong>context window</strong> — the maximum number of tokens it can process
        in a single request, counting both your input and the model's output. As of early 2026:
      </p>
      <ul>
        <li><strong>GPT-4o</strong> — 128,000 tokens</li>
        <li><strong>Claude 3.5 Sonnet</strong> — 200,000 tokens</li>
        <li><strong>Gemini 1.5 Pro</strong> — 1,000,000 tokens</li>
        <li><strong>Llama 3.1 70B</strong> — 128,000 tokens</li>
      </ul>
      <p>
        If your input exceeds the context window limit, the API will return an error — the request
        simply fails. There is no graceful degradation by default; you need to handle this in your
        application logic. More subtly, even within the context window, there is a phenomenon called
        the "lost in the middle" problem: models tend to recall information at the beginning and end
        of their context better than information buried in the middle. A 200K context window does
        not mean every token in it is equally well-attended.
      </p>
      <p>
        For chat applications, the context window fills up as conversations grow. After enough turns,
        you must either truncate old messages, summarize them, or hit the limit and fail. Knowing
        your token count at each step is what lets you make that decision proactively.
      </p>

      <h2>Prompt Design Implications</h2>
      <p>
        Token awareness changes how you write prompts. Some concrete implications:
      </p>
      <ul>
        <li>
          <strong>System prompts compound across every request</strong> — A 500-token system prompt
          costs 500 × your requests × your input price. On 10,000 daily requests, trimming your
          system prompt from 500 to 300 tokens saves real money every month.
        </li>
        <li>
          <strong>Few-shot examples are expensive but effective</strong> — Including 3 examples in
          your prompt might add 300–500 tokens. Measure whether that quality improvement is worth the
          cost versus fine-tuning the model once.
        </li>
        <li>
          <strong>Output length is controllable</strong> — Use <code>max_tokens</code> to cap model
          output. Add explicit instructions in your prompt: "Reply in under 100 words." Models
          generally follow output length instructions well, which directly reduces output token costs.
        </li>
        <li>
          <strong>JSON formatting adds overhead</strong> — If you are using structured output (JSON
          mode), the quotes, brackets, and key names add tokens on top of your actual data values.
          A response with 5 short fields can easily be 40% overhead in formatting tokens.
        </li>
      </ul>

      <h2>Count Tokens Before You Send</h2>
      <p>
        The best habit to build when working with LLM APIs is to count your tokens before committing
        to an architecture or going to production. Paste your system prompt, a representative user
        message, and any context you plan to include into the{" "}
        <a href="/tools/token-counter">BrowseryTools Token Counter</a>. You'll immediately see whether
        your design is well within the context window or dangerously close to it — and you'll have
        the numbers you need to estimate costs accurately.
      </p>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free Token Counter — Works in Your Browser, No Sign-Up
        </p>
        <a
          href="/tools/token-counter"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open Token Counter →
        </a>
      </div>
    </div>
  );
}
