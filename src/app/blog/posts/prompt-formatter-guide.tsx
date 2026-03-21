export default function Content() {
  return (
    <div>
      <p>
        The difference between a mediocre AI response and a genuinely useful one is rarely about the
        model's capabilities — it is almost always about how the prompt was written. Structure, clarity,
        and the right formatting cues can turn a vague, rambling output into a precise, actionable answer.
        If you have ever felt like an AI tool is not living up to its potential, your prompt format is the
        first thing worth examining.
      </p>
      <p>
        You can use the{" "}
        <a href="/tools/prompt-formatter">BrowseryTools Prompt Formatter</a> — free, no sign-up, everything
        stays in your browser — to clean up, restructure, and refine your prompts before sending them to any
        AI model.
      </p>

      <h2>Why Formatting Matters More Than You Think</h2>
      <p>
        Language models do not read prompts the way a human skims a message. They process tokens
        sequentially and are sensitive to how instructions are phrased, ordered, and separated. A prompt
        written as a long, unbroken paragraph buries the most important instructions in the middle — exactly
        where they are least likely to influence the output. A well-formatted prompt puts constraints and
        goals upfront, uses clear delimiters between sections, and signals the expected output format
        explicitly.
      </p>
      <p>
        Think of prompt formatting as writing a brief for a contractor. The more precisely you specify the
        deliverable, the constraints, and the context, the closer the first draft will be to what you
        actually need.
      </p>

      <h2>Technique 1: Role Assignment</h2>
      <p>
        One of the most effective formatting techniques is giving the model a role before the actual task.
        This activates a specific register and set of conventions that the model associates with that role,
        producing more consistent output.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Without role:
"Explain how to write a good README."

✅ With role:
"You are a senior open-source maintainer who reviews hundreds of repositories.
Explain how to write a README that communicates a project's value clearly
to both technical and non-technical readers."`}
      </pre>
      <p>
        The role framing does not restrict the model — it focuses it. You get writing that matches the
        standards and vocabulary of the persona, rather than a generic overview.
      </p>

      <h2>Technique 2: Clear Instruction Blocks</h2>
      <p>
        Separate your task description, context, and constraints into distinct sections. Markdown headers
        and triple-backtick delimiters work well here. Many models have been trained on documents with this
        structure and respond well to it.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`## Task
Summarize the following customer feedback into three actionable product priorities.

## Context
This is feedback from B2B SaaS users collected over Q4 2025. The audience for
this summary is a product manager preparing for a sprint planning session.

## Constraints
- Maximum 150 words total
- Use bullet points
- Do not include direct quotes

## Input
"""
[customer feedback goes here]
"""`}
      </pre>
      <p>
        The labeled sections make it immediately clear what belongs where. You can adjust the context or
        constraints independently without rewriting the whole prompt.
      </p>

      <h2>Technique 3: Few-Shot Examples</h2>
      <p>
        If you need output in a specific style or format, the single most reliable technique is to include
        one or two examples of what you want. This is called few-shot prompting and it consistently
        outperforms long verbal descriptions of the desired format.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`Convert a raw feature request into a user story using the following format.

Example input: "Users want to export data to CSV"
Example output: "As a data analyst, I want to export my dashboard data to CSV
so that I can perform custom analysis in spreadsheet tools."

Now convert: "Users want to be notified when a report is ready"`}
      </pre>
      <p>
        Notice that the example defines both the structure ("As a... I want... so that...") and the level
        of specificity expected. You do not need to explain the format in prose — the example shows it.
      </p>

      <h2>Technique 4: Chain-of-Thought Prompting</h2>
      <p>
        For reasoning tasks — debugging, analysis, calculations, decision-making — explicitly asking the
        model to think step by step before giving a final answer dramatically improves accuracy. This is
        not a trick: it changes how the model allocates its internal computation during generation.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Without chain-of-thought:
"What is the best database for a real-time multiplayer game?"

✅ With chain-of-thought:
"What is the best database for a real-time multiplayer game?
Think through the requirements step by step — latency, concurrency model,
data structure, consistency guarantees — before giving your recommendation."`}
      </pre>
      <p>
        The step-by-step instruction surfaces intermediate reasoning that you can evaluate. You are also
        much more likely to catch errors when you can see the reasoning chain rather than just a conclusion.
      </p>

      <h2>Technique 5: XML and JSON Structured Prompts</h2>
      <p>
        When you need the output itself to be structured — a JSON object, a table, a specific schema — make
        the output format explicit and use a matching structure in the prompt. Claude and GPT-4 respond
        especially well to XML-tagged sections.
      </p>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`<task>Extract the following fields from the job description below.</task>

<output_format>
{
  "job_title": "string",
  "required_skills": ["string"],
  "seniority_level": "junior | mid | senior",
  "remote_policy": "remote | hybrid | on-site | not specified"
}
</output_format>

<input>
[job description text here]
</input>`}
      </pre>
      <p>
        The XML tags act as unambiguous delimiters. The model knows exactly where its instructions end and
        where the input data begins, reducing the risk of the model treating your instructions as part of
        the content to process.
      </p>

      <h2>Common Prompt Formatting Mistakes</h2>
      <ul>
        <li><strong>Burying the main instruction</strong> — Put what you want the model to do at the start, not
        after three paragraphs of context. Models weight earlier tokens more heavily.</li>
        <li><strong>Contradictory constraints</strong> — "Be concise but cover every detail" forces the model
        to make an arbitrary tradeoff. Specify which matters more.</li>
        <li><strong>Assuming shared context</strong> — The model has no memory of your previous sessions.
        Include all relevant context in the prompt itself.</li>
        <li><strong>No output format specified</strong> — If you need a list, say list. If you need JSON,
        say JSON. If you need a response under 200 words, say that. Unspecified format = unpredictable output.</li>
        <li><strong>Over-specified style rules</strong> — Long lists of negative instructions ("don't do X,
        never say Y") consume context and often produce stilted, awkward output. One or two strong
        constraints outperform ten weak ones.</li>
      </ul>

      <h2>Before and After: The Same Request, Reformatted</h2>
      <pre style={{background: "rgba(0,0,0,0.06)", borderRadius: "0.5rem", padding: "1rem 1.25rem", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.7}}>
{`❌ Before:
"Can you help me write an email to my boss about a project delay?
We were supposed to launch the new payment integration last Friday but
the third-party API had some issues and now we're looking at maybe
next Wednesday or Thursday, can you make it professional?"

✅ After:
You are an experienced business communicator.

## Task
Write a professional delay notification email from a developer to their manager.

## Context
- Project: payment gateway integration
- Original deadline: last Friday
- New estimate: Wednesday or Thursday this week
- Cause: issues with a third-party API (not our team's fault)

## Tone
Professional, direct, and solution-focused — not defensive or apologetic

## Output
Subject line + email body, under 150 words`}
      </pre>
      <p>
        The reformatted version takes 20 extra seconds to write and produces an output that is immediately
        usable, rather than requiring two or three follow-up corrections.
      </p>

      <h2>Using the Prompt Formatter</h2>
      <p>
        The{" "}
        <a href="/tools/prompt-formatter">BrowseryTools Prompt Formatter</a> helps you apply these
        techniques without memorizing every rule. Paste your raw prompt, choose the structure that fits
        your use case, and get a clean, well-organized version ready to send to ChatGPT, Claude, Gemini,
        or any other model. No account needed, and your prompts never leave your browser.
      </p>

      <h2>Summary</h2>
      <p>
        Prompt formatting is a learnable skill with a measurable payoff. Role assignment focuses the model,
        clear section breaks eliminate ambiguity, few-shot examples define your expected format, and
        explicit output constraints remove the guesswork. The best prompt is not the most elaborate one —
        it is the one that leaves the fewest questions unanswered before generation begins.
      </p>
    </div>
  );
}
