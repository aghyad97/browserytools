export default function Content() {
  return (
    <div>
      <p>
        Ten hands go up, and you call on the same three students you always call on, because they are
        the ones you happen to see first. Group work is announced, and the room splits into the same
        four friend clusters it splits into every single time. A review game needs a randomizer that
        does not feel rigged. None of these are big problems, but they eat a surprising amount of a
        teacher&apos;s mental bandwidth during a normal class period — bandwidth that would be better
        spent actually teaching. A small set of browser tools handles the picking, grouping, and timing
        so you can stop doing it in your head.
      </p>
      <p>
        Everything below runs in the browser tab, works on the classroom projector or a phone, and needs
        no login, no install, and no student data leaving the device. You paste names, click a button,
        and move on with the lesson.
      </p>

      <h2>Wheel of Names: Cold-Calling Without the Bias</h2>
      <p>
        The honest problem with calling on students &quot;randomly&quot; is that people are bad
        randomizers. You unconsciously default to the students who make eye contact, sit near the
        front, or answered well last time, and the quiet kid in the back corner can go weeks without
        being picked. The <a href="/tools/wheel-of-names">Wheel of Names</a> fixes this by taking the
        decision out of your hands entirely: paste your class roster, one name per line, spin the wheel,
        and it lands on a name with a satisfying bit of suspense that a plain random-number picker does
        not give you.
      </p>
      <p>
        There is an option to <strong>remove the winner</strong> after each spin, which is the setting
        you want for cold-calling through an entire roster over the course of a class or a week — once
        someone has answered, they drop out of the wheel and everyone left still has a fair shot. Turn
        that option off when you are picking a single volunteer for a task where repeats do not matter,
        like choosing who erases the board or who goes first in a game. Either way, the shuffle happens
        in front of the class on the shared screen, so nobody can argue you picked their least favorite
        student on purpose — the wheel did it.
      </p>
      <p>
        It works for more than students, too. Decide which class gets the field trip slot first, which
        table presents their project first, or which topic from a list the class debates today. Anywhere
        you would otherwise flip a mental coin, the wheel makes the choice visible and fair.
      </p>

      <h2>Group Maker: Breaking Up the Same Four Friend Clusters</h2>
      <p>
        Left to their own devices, students group with the same people every time, which is comfortable
        for them and often bad for the actual learning goal — a lab partner who always works with their
        best friend does not get practiced at collaborating with someone new, and a strong student
        paired with three other strong students leaves a weaker table with nobody to lean on. The{" "}
        <a href="/tools/group-maker">Group Maker</a> breaks that pattern by taking your full list of
        names and splitting it into randomized groups, either by choosing{" "}
        <strong>how many groups</strong> you want (say, six lab stations) or by choosing{" "}
        <strong>how many students per group</strong> (say, teams of four for a project).
      </p>
      <p>
        This is the tool for lab groups, breakout discussion circles, project teams, and any activity
        where you want the room mixed up rather than self-selected. Run it fresh each time a new
        activity starts, and the output is a print-friendly grid you can put on the projector or hand
        out on paper, so students can find their group and get moving without you reading names off a
        list one at a time.
      </p>

      <h2>Bingo Card Generator: A Review Game That Prints</h2>
      <p>
        Bingo is one of the most reliable review-game formats there is, because the game mechanics are
        already familiar to every student and the actual content is whatever you put on the card. The{" "}
        <a href="/tools/bingo-card-generator">Bingo Card Generator</a> covers both versions you are
        likely to need. The first is <strong>classic number bingo, 1 through 75</strong>, the standard
        five-by-five grid with a free center space — useful for indoor-recess games, math number
        recognition with younger students, or just a straightforward reward activity that needs no
        prep beyond printing.
      </p>
      <p>
        The second is <strong>custom word-pool bingo</strong>, where you supply your own list of words
        or terms and the generator builds a grid from them — this is the one that turns bingo into an
        actual review tool. Load it with vocabulary words for a language class, historical figures for
        a unit test review, chemical elements, or key terms from the chapter you just finished, and call
        out definitions or clues instead of the words themselves. Each card the tool generates is a
        different shuffle of your word list, so every student in the room gets a unique sheet and nobody
        can just copy their neighbor&apos;s card. Cards are built to <strong>print</strong> cleanly, so
        you can generate a full class set, print it once, and reuse the master list for the next unit
        review by just swapping the words.
      </p>

      <h2>Classroom Timer: Keeping the Room on Track</h2>
      <p>
        A phone timer works, but it is small, it is in your pocket instead of on the wall, and it does
        not communicate urgency to thirty kids at the other end of the room. The{" "}
        <a href="/tools/classroom-timer">Classroom Timer</a> is a full-screen countdown built to be read
        from the back row: set the minutes, hit start, and it fills the projector or the smartboard with
        a large, unmistakable countdown.
      </p>
      <p>
        Use it for silent reading blocks, timed sections of a quiz or exam, the &quot;you have five
        minutes to finish this problem set&quot; portion of a lesson, or a station-rotation activity
        where every group needs to move to the next table at the same moment. Because the whole room can
        see the numbers ticking down without you announcing the time remaining every ninety seconds, it
        does a real piece of classroom management for you — students self-regulate against the clock
        instead of asking you how much time is left.
      </p>

      <h2>Why These Run in a Browser Tab</h2>
      <p>
        None of these tools need a school-issued license, an account, or software installed on a
        classroom computer that IT has to approve. They are ordinary web pages: open the link on the
        classroom projector, a laptop, or a personal phone, and they work the same way every time.
        Nothing about the roster you paste in — student names included — is uploaded anywhere or stored
        on a server; the wheel, the groups, and the bingo cards are all generated locally in the tab and
        never leave the device you are using. For a tool you are handing student names to, that is not
        a minor detail — it is the reason to prefer this over a random app that asks you to sign up
        first.
      </p>

      <h2>Putting Them Together</h2>
      <p>
        A typical class period might use two or three of these back to back without you thinking about
        it as &quot;using a tool&quot; at all: spin the{" "}
        <a href="/tools/wheel-of-names">Wheel of Names</a> to pick who answers the warm-up question,
        run the <a href="/tools/group-maker">Group Maker</a> to split the room into lab stations, start
        the <a href="/tools/classroom-timer">Classroom Timer</a> for the activity, and close the period
        with a round of <a href="/tools/bingo-card-generator">Bingo</a> built from the day&apos;s
        vocabulary as a review. Each one takes a few seconds to set up, keeps the picking and grouping
        genuinely fair, and lets you spend your attention on the lesson instead of the logistics around
        it.
      </p>
    </div>
  );
}
