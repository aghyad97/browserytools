import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Every so often you need an impartial decision-maker. Who pays for lunch? Which name wins the
        giveaway? What order should the team present in? Who goes first in the board game? Reaching for a
        physical die, a coin from your pocket, or scribbling names on torn paper works — but it is slow, it
        is easy to fudge, and half the time you do not have a coin on you anyway. A{" "}
        <a href="/tools/random-picker">random picker</a> in your browser solves all of that in one tab.
      </p>
      <ToolCTA slug="random-picker" variant="inline" />
      <p>
        The BrowseryTools <strong>Random Picker</strong> bundles four classic randomizers into a single
        page: a <strong>random number generator</strong>, a <strong>dice roller</strong>, a{" "}
        <strong>coin flip</strong>, and a <strong>random name picker</strong> (wheel-style) for draws and
        giveaways. Everything runs locally in your browser — there is no server deciding the outcome, no
        account, and no ads. This guide walks through each mode and the small details that make a random
        picker actually fair.
      </p>

      <h2>The Random Number Generator</h2>
      <p>
        The most common request is also the simplest: give me a number between X and Y. The random number
        generator lets you set a <strong>minimum</strong> and <strong>maximum</strong>, choose{" "}
        <strong>how many</strong> numbers you want at once, and decide whether duplicates are allowed. That
        last toggle matters more than people expect. If you are picking three raffle tickets out of a
        hundred, you almost certainly want unique numbers — you do not want ticket 47 to win twice. If you
        are simulating dice or generating test data, duplicates are fine and expected.
      </p>
      <p>
        Under the hood the tool uses the browser&apos;s <code>crypto.getRandomValues</code> primitive with
        rejection sampling, which avoids the subtle modulo bias that naive{" "}
        <code>Math.random() * range</code> code introduces. In plain terms: every number in your range has a
        genuinely equal chance of coming up, not a slightly-skewed one. For a casual pick that distinction
        is invisible, but for anything where fairness is questioned — a public giveaway, a paid draw — it is
        the difference between defensible and dubious.
      </p>

      <h2>The Dice Roller</h2>
      <p>
        Tabletop and role-playing games live and die by dice, and physical dice have a habit of rolling off
        the table or going missing right when you need them. The dice roller supports the full polyhedral
        set — d4, d6, d8, d10, d12, and d20 — and lets you roll many of them at once, the classic{" "}
        <em>2d6</em> or <em>4d6</em> notation. Each die is shown individually so you can see the spread, and
        the total is summed for you automatically. No mental arithmetic, no arguing about whether that die
        landed on a 5 or a 6.
      </p>
      <p>
        Because the rolls use the same cryptographically-decent randomness as the number generator, a digital
        d20 is every bit as fair as a physical one — arguably fairer, since real dice are rarely perfectly
        balanced. Roll for initiative, roll for damage, roll a quick d100 percentile check, all from the same
        tab.
      </p>

      <h2>The Coin Flip</h2>
      <p>
        Sometimes you only need a yes or no, and nothing settles a binary choice faster than a coin. The coin
        flip mode shows a quick spin animation and lands on heads or tails, then keeps a{" "}
        <strong>running tally</strong> of both. The tally is the underrated feature here: if you are settling
        a best-of-seven, or you just want to watch the law of large numbers slowly pull a 50/50 split toward
        even, the count is right there. Reset it whenever you start a new contest.
      </p>

      <h2>The Random Name Picker (Wheel)</h2>
      <p>
        This is the mode people share most. Paste a list of names — one per line — and the picker chooses a
        random winner with a brief spin for suspense. It is built for{" "}
        <strong>giveaways, classroom cold-calling, team standups, and prize draws</strong>. Drop in your
        Instagram commenters, your students, your raffle entrants, and let the tool do the choosing so nobody
        can accuse you of favoritism.
      </p>
      <p>
        The key option for draws is <strong>&quot;remove winner after picking.&quot;</strong> Turn it on and
        each chosen name is pulled out of the list, so you can run a multi-prize draw — first place, second
        place, third place — without the same person winning twice. Turn it off and the full list stays
        intact for repeated single picks. A counter shows how many entries remain after each pick.
      </p>

      <h2>Why a Browser Tool Beats an App</h2>
      <p>
        Dedicated randomizer apps and wheel websites exist, but most are buried under ads, ask you to sign
        up, or run the randomization on a server you cannot inspect. The BrowseryTools random picker is the
        opposite: a single static page that does its work entirely on your device. Nothing you type — not
        your giveaway entrants, not your students&apos; names — ever leaves your browser. You can copy any
        result to the clipboard, bookmark the page, or share the URL with a colleague who needs the same fair
        coin toss.
      </p>

      <h2>Try It Now</h2>
      <p>
        Whether you need a quick random number, a fair d20, a coin to settle an argument, or a name picker for
        your next giveaway, the <a href="/tools/random-picker">Random Picker</a> has it in one place — free,
        private, and instant. No installs, no accounts, no catch.
      </p>
      <ToolCTA slug="random-picker" variant="card" />
    </div>
  );
}
