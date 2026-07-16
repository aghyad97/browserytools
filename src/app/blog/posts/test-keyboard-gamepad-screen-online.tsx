export default function Content() {
  return (
    <div>
      <p>
        A key stops registering mid-sentence. A game controller&apos;s stick seems to nudge your
        character even when you are not touching it. A video call starts and you cannot tell if your
        microphone is actually working until
        someone tells you they cannot hear you. In every one of these cases, the honest first question
        is the same: is this the hardware, or is it something else? You do not need to install anything
        to find out — a handful of focused browser tools will give you a clear answer in under a
        minute.
      </p>

      <h2>Keyboard: Chatter, Stuck Keys, and Rollover</h2>
      <p>
        Open the <a href="/tools/keyboard-tester">Keyboard Tester</a> and it draws a live layout of a
        full keyboard on screen. Press any key and it lights up in the layout, gets logged in a running
        history of everything you have pressed, and updates a rollover count — how many keys the
        keyboard is currently reporting as held down at once.
      </p>
      <p>
        This is useful for two different problems. The first is a dead or unresponsive key: press it
        and watch whether it lights up at all. The second, subtler problem is <strong>chatter</strong> —
        a worn switch that fires twice (or more) from a single press. The key history makes this easy
        to spot: press a key once, deliberately, and check whether it shows up once or multiple times in
        the log. If you see doubles from single presses, that is chatter, and it usually means the
        switch is wearing out.
      </p>
      <p>
        The rollover count is also how you check <strong>N-key rollover (NKRO)</strong> — whether your
        keyboard can register many keys held down simultaneously, which matters for gaming and fast
        typing. Hold down several keys at once and watch the rollover number: a keyboard limited to
        old-style 6-key rollover will stop registering new presses past six, while an NKRO keyboard will
        keep counting well beyond that.
      </p>

      <h2>Gamepad: Catching Stick Drift</h2>
      <p>
        Controller <strong>stick drift</strong> — where the game registers movement even though you are
        not touching the stick — is one of the most common and most annoying hardware issues, and it is
        also one of the easiest to gaslight yourself about (&quot;maybe I am just bumping it?&quot;). The{" "}
        <a href="/tools/gamepad-tester">Gamepad Tester</a> settles the question with a raw readout: it
        shows every stick&apos;s reported position as a live decimal value, alongside a visual position
        indicator.
      </p>
      <p>
        Connect your controller, let go of both sticks completely, and watch the readout. A healthy
        stick should sit at, or extremely close to, zero on both axes when centered and untouched. If
        you see a persistent nonzero reading with nothing touching the stick, that is drift — you are
        seeing the exact signal the game engine sees, with nothing smoothing it over. The tool also
        reports every button press and trigger value, so you can check the whole pad — face buttons,
        shoulder buttons, and analog triggers — in one pass, useful when buying a used controller or
        diagnosing an intermittent connection issue.
      </p>

      <h2>Mic and Webcam: The Pre-Call Check</h2>
      <p>
        &quot;Can you hear me?&quot; is a bad way to start a meeting. Before you join the call, open{" "}
        <a href="/tools/mic-test">Mic Test</a> to see a live level meter respond to your voice — speak
        normally and confirm the bar actually moves, at a level that is not clipped or silent. It is the
        difference between finding out your microphone is unplugged before the call versus fifteen
        awkward seconds into it.
      </p>
      <p>
        The same logic applies to video: open <a href="/tools/webcam-test">Webcam Test</a> to preview
        your camera feed and confirm it is sharp, correctly framed, and not showing the wrong device if
        you have more than one camera connected. Nothing from either test is recorded or sent anywhere —
        it is purely a local preview so you can catch a problem before it becomes everyone else&apos;s
        problem too.
      </p>

      <h2>Why Run These in a Browser Tab</h2>
      <p>
        None of these checks need a native app, an account, or an install. Modern browsers expose
        keyboard events, the Gamepad API, WebGL/canvas rendering, and the microphone and camera streams
        directly to web pages, which is exactly what these tools use. That means the same tester works
        identically on Windows, Mac, Linux, and Chromebooks, and nothing about your input devices or
        media streams is ever sent off your machine — the readings stay local to the tab that is
        drawing them.
      </p>

      <h2>Try Them Now</h2>
      <p>
        Bookmark the set and run through them whenever something feels off, or before you commit to
        returning a piece of hardware: <a href="/tools/keyboard-tester">Keyboard Tester</a>,{" "}
        <a href="/tools/gamepad-tester">Gamepad Tester</a>,{" "}
        <a href="/tools/mic-test">Mic Test</a>, and <a href="/tools/webcam-test">Webcam Test</a>. Each one takes under a minute and tells you,
        with real data instead of guesswork, whether the problem is your hardware or something else.
      </p>
    </div>
  );
}
