export default function Content() {
  return (
    <div>
      <p>
        Animation is what separates an interface that feels alive from one that feels like a slideshow. And
        the single most important ingredient in good animation is not duration or distance — it is the{" "}
        <strong>easing curve</strong>. Easing describes how a value accelerates and decelerates over time.
        Linear motion looks robotic; well-eased motion feels physical, intentional, and human. In CSS, the
        most powerful way to express easing is the <code>cubic-bezier()</code> function, and the fastest way
        to author one is with a visual{" "}
        <a href="/tools/cubic-bezier">cubic bezier generator</a> — a CSS easing editor that lets you drag two
        control handles and watch the curve update in real time.
      </p>

      <h2>What Is a Cubic Bezier Curve?</h2>
      <p>
        A cubic Bezier easing curve is defined by four numbers: <code>cubic-bezier(x1, y1, x2, y2)</code>.
        The curve always starts at the point (0, 0) and ends at (1, 1). The horizontal axis represents time,
        progressing from the start of the animation to the end. The vertical axis represents progress — how
        far along the animated value is. The two pairs of coordinates are the two control points that bend
        the line between start and finish.
      </p>
      <p>
        The <code>x</code> values are constrained between 0 and 1 because you cannot move backward or forward
        in time. The <code>y</code> values, however, can go below 0 or above 1. That is what produces those
        delightful overshoot and anticipation effects, where an element springs slightly past its target
        before settling — the basis of every &quot;bouncy&quot; or &quot;back&quot; easing you have seen.
      </p>

      <h2>The Built-in CSS Keywords Are Just Beziers</h2>
      <p>
        Every easing keyword you already know maps to a specific cubic-bezier value:
      </p>
      <ul>
        <li><code>ease</code> = <code>cubic-bezier(0.25, 0.1, 0.25, 1)</code> — the browser default</li>
        <li><code>linear</code> = <code>cubic-bezier(0, 0, 1, 1)</code> — constant speed</li>
        <li><code>ease-in</code> = <code>cubic-bezier(0.42, 0, 1, 1)</code> — slow start</li>
        <li><code>ease-out</code> = <code>cubic-bezier(0, 0, 0.58, 1)</code> — slow finish</li>
        <li><code>ease-in-out</code> = <code>cubic-bezier(0.42, 0, 0.58, 1)</code> — slow at both ends</li>
      </ul>
      <p>
        The keywords are convenient, but they are a tiny subset of what is possible. The real expressive power
        comes from custom curves, and that is exactly where a visual CSS easing editor earns its keep. Instead
        of guessing four decimals and reloading the page, you drag a handle and the motion responds instantly.
      </p>

      <h2>How to Use the Cubic-Bezier Easing Editor</h2>
      <p>
        Our <a href="/tools/cubic-bezier">cubic bezier generator</a> runs entirely in your browser — nothing
        is uploaded, and it works offline once loaded. Here is the workflow:
      </p>
      <ul>
        <li><strong>Start from a preset.</strong> Pick <code>ease</code>, <code>ease-in-out</code>, or one of the others to get a sensible baseline.</li>
        <li><strong>Drag the two handles.</strong> Each pulls the curve toward acceleration or deceleration. Drag a handle below the box or above it to create overshoot.</li>
        <li><strong>Fine-tune with numbers.</strong> The four numeric inputs let you type exact values when you need precision.</li>
        <li><strong>Watch the preview.</strong> A dot animates across the track using your curve so you feel the motion, not just see the math.</li>
        <li><strong>Copy the CSS.</strong> The tool outputs a ready-to-paste <code>transition-timing-function</code> declaration.</li>
      </ul>

      <h2>Where the Output Goes in Your CSS</h2>
      <p>
        The generated value drops into two properties. For transitions:
      </p>
      <pre>{`.button {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}`}</pre>
      <p>
        And for keyframe animations via <code>animation-timing-function</code>:
      </p>
      <pre>{`.card {
  animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}`}</pre>

      <h2>Tips for Choosing Good Easing</h2>
      <p>
        <strong>Use ease-out for things entering the screen.</strong> Elements that appear should decelerate
        into place — a fast start that settles gently reads as responsive and confident.
      </p>
      <p>
        <strong>Use ease-in for things leaving.</strong> When an element exits, accelerating away feels
        natural, because the user no longer needs to track it.
      </p>
      <p>
        <strong>Reserve overshoot for personality moments.</strong> A little bounce on a toggle or a modal is
        charming; the same bounce on every micro-interaction becomes exhausting.
      </p>
      <p>
        <strong>Keep durations honest.</strong> Most UI motion should land between 150ms and 400ms. The curve
        shapes the feel; the duration shapes the pace.
      </p>

      <h2>Why a Browser Tool Beats Memorizing Numbers</h2>
      <p>
        Nobody can intuit how <code>cubic-bezier(0.68, -0.55, 0.27, 1.55)</code> feels by reading it. Motion
        is something you judge with your eyes, not your arithmetic. A live CSS easing editor closes that gap:
        you shape the curve, you watch the preview, and you copy the result when it feels right. Try the{" "}
        <a href="/tools/cubic-bezier">Cubic-Bezier Easing Editor</a> the next time a transition feels off —
        a five-second tweak to the curve often does more than any change to duration or distance.
      </p>
    </div>
  );
}
