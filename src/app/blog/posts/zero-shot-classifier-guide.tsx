export default function Content() {
  return (
    <div>
      <p>
        Most text classification advice starts with a depressing prerequisite: collect a few hundred labeled
        examples, train a model, evaluate it, and redeploy every time your categories change. That pipeline
        makes sense for a mature product with stable categories and an ML team. It is wildly overkill when you
        just want to sort a list of support tickets into <em>urgent</em>, <em>billing</em>, and{" "}
        <em>feedback</em>, or tag a backlog of feature requests by theme. Zero-shot text classification skips
        the training step entirely — and the BrowseryTools{" "}
        <a href="/tools/zero-shot-classifier">Zero-Shot Text Classifier</a> runs it directly in your browser,
        with no upload and no account.
      </p>

      <h2>What &ldquo;zero-shot&rdquo; actually means</h2>
      <p>
        A traditional classifier only knows the labels it was trained on. If you trained it on{" "}
        <em>spam</em> vs <em>not spam</em>, it can never tell you whether a message is about{" "}
        <em>shipping</em>. Zero-shot text classification flips this. Instead of learning a fixed label set,
        the model is trained to judge whether a piece of text <strong>entails</strong> a hypothesis. To
        classify with custom labels, the tool quietly turns each of your labels into a hypothesis like
        &ldquo;This text is about billing,&rdquo; and the model scores how well the input supports it. The
        label with the highest entailment score wins.
      </p>
      <p>
        The practical payoff is enormous: you can classify text with custom labels you invent on the spot. No
        examples, no training run, no waiting. Type your text, type your labels, and get ranked scores back in
        a second or two.
      </p>

      <h2>How to classify text with custom labels</h2>
      <p>
        The workflow in the tool is deliberately simple. Paste or type the text you want to categorize. Then
        add your own candidate labels — type one and press Enter to turn it into a chip, or paste a
        comma-separated list like <code>urgent, billing, feedback, bug report</code>. When you click{" "}
        <strong>Classify</strong>, the model evaluates the text against every label and returns a ranked list,
        each with a confidence percentage and a bar so you can see the spread at a glance.
      </p>
      <p>
        Two design choices keep results honest. First, results are always sorted by score, so the most likely
        category sits at the top. Second, there is a <strong>multi-label</strong> toggle. By default the tool
        treats your labels as mutually exclusive — the scores compete and sum toward one winner, which is what
        you want for routing (a ticket goes to exactly one queue). Turn multi-label on and each label is
        scored independently, so a message can legitimately be both <em>billing</em> and{" "}
        <em>complaint</em> at the same time. Use single-label for routing, multi-label for tagging.
      </p>

      <h2>Where AI text categorization shines</h2>
      <p>
        Zero-shot classification is a quiet workhorse. A few places it pays off immediately:
      </p>
      <p>
        <strong>Support triage.</strong> Drop in an incoming message and label it{" "}
        <em>refund</em>, <em>technical</em>, <em>sales</em>, or <em>spam</em> without writing a single rule.
        When your categories change next quarter, you just edit the labels.
      </p>
      <p>
        <strong>Content tagging.</strong> Tag blog drafts, notes, or research snippets by topic so they are
        easier to find later. Multi-label mode is ideal here, since one article can span several themes.
      </p>
      <p>
        <strong>Intent detection.</strong> Decide whether a sentence is a <em>question</em>,{" "}
        <em>complaint</em>, <em>compliment</em>, or <em>request</em> — a useful first pass before deeper
        analysis.
      </p>
      <p>
        <strong>Quick experiments.</strong> Because there is no setup, it is the fastest way to sanity-check
        whether a labeling scheme even makes sense before you invest in a trained model.
      </p>

      <h2>Why running it in the browser matters</h2>
      <p>
        The classifier uses a compact model (<code>nli-deberta-v3-xsmall</code>) compiled to run via
        WebAssembly through Transformers.js. The model downloads once from a CDN on first use and is cached on
        your device. After that, every classification happens locally — your text never leaves the machine,
        there is no API key, no per-request cost, and no rate limit. For anyone handling customer messages or
        internal documents, that privacy guarantee is not a nice-to-have; it is the whole point.
      </p>
      <p>
        It also means the tool keeps working offline once the model is cached, and there is nothing to scale
        or pay for as you classify more text. The trade-off is that a small in-browser model is less accurate
        than a large hosted one, so treat the scores as a strong first pass rather than a final verdict on
        ambiguous text.
      </p>

      <h2>Tips for better results</h2>
      <p>
        Good labels make good classifications. Prefer specific, meaningful words over abbreviations —{" "}
        <em>billing question</em> beats <em>bq</em>. Keep your label set focused; a dozen overlapping labels
        will produce muddier scores than five distinct ones. And give the model enough text to work with: a
        full sentence classifies far more reliably than two words. If the top two scores are close, that
        usually means the text genuinely sits between categories, which is itself useful signal.
      </p>

      <h2>Try it</h2>
      <p>
        Zero-shot text classification removes the single biggest barrier to AI text categorization — the
        training data — and the in-browser version removes the second biggest: sending your text to someone
        else&rsquo;s server. Open the{" "}
        <a href="/tools/zero-shot-classifier">Zero-Shot Text Classifier</a>, paste some text, invent a few
        labels, and watch it sort them. No training, no upload, no cost.
      </p>
    </div>
  );
}
