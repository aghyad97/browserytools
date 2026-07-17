export default function Content() {
  return (
    <div>
      <p>
        You are staring at seven scrambled letters in a word game and none of them will arrange
        themselves into anything real. Or you are on turn four of today&apos;s Wordle with three gray
        tiles, one yellow, and a shrinking sense of what letters are even left to try. Or you are
        writing a crossword clue, or just trying to remember a word that is sitting right on the tip of
        your tongue and refusing to surface. In every one of these situations, what you actually want is
        not a cheat code — it is a dictionary lookup that is faster than your own memory. That is the
        honest job these three tools do.
      </p>
      <p>
        Worth saying up front, plainly: these tools work off an English word list. If you are playing a
        word game in another language, or working from a non-English dictionary, they will not help —
        they only know the words in their English word list, nothing more.
      </p>

      <h2>Word Unscrambler: Turning Letter Soup Into Real Words</h2>
      <p>
        Word games — Scrabble, Words with Friends, tile-based letter games in general — regularly leave
        you holding a rack of letters that clearly spell something, if only you could see it. The{" "}
        <a href="/tools/word-unscrambler">Word Unscrambler</a> does the part your brain is bad at:
        type in the letters you have, and it returns every valid word that can be built from some or all
        of them, checked against a real dictionary rather than a guess.
      </p>
      <p>
        Two filters make the results actually usable instead of just long. You can set a{" "}
        <strong>minimum word length</strong>, so a big rack of letters does not bury the seven-letter
        bingo play under forty two-letter throwaways. And you can require a{" "}
        <strong>specific letter</strong> to appear in the result, which matters in games where you need
        to build off a letter already on the board rather than play in open space. Results are grouped
        by word length, so you can scan straight to the longest word you can legally play — usually the
        one worth the most points — instead of reading through the whole list top to bottom.
      </p>

      <h2>Anagram Solver: Every Word Hiding in a Set of Letters</h2>
      <p>
        An anagram solver sounds like the same thing as an unscrambler, and the tools are close
        cousins, but the use case is slightly different. The{" "}
        <a href="/tools/anagram-solver">Anagram Solver</a> is built for when you have a specific set of
        letters — a name, a phrase with the spaces stripped out, a word you are trying to find hidden
        rearrangements of — and you want to see everything that set of letters can become, not just
        words that happen to fit a rack in a specific game.
      </p>
      <p>
        It includes an option to <strong>include shorter sub-anagrams</strong>, not only anagrams that
        use every single letter you entered. That distinction matters: a strict anagram of
        &quot;listen&quot; is only words using all six letters (like &quot;silent&quot;), while
        sub-anagrams also surface everything shorter that&apos;s hiding inside those same letters — useful
        when you are building a word puzzle, checking whether a name secretly contains another word, or
        just enjoying the rabbit hole of what is buried inside a string of letters. Results are grouped
        by length here too, so the full-length anagrams are easy to find separately from the shorter
        finds.
      </p>

      <h2>Wordle Solver: Narrowing the Field Tile by Tile</h2>
      <p>
        Wordle&apos;s appeal is the constraint — five letters, six guesses, one word a day — but that
        same constraint is exactly what makes a bad guess expensive. Burn a guess on a word that ignores
        information you already have, and you have thrown away a sixth of your attempts for nothing. The{" "}
        <a href="/tools/wordle-solver">Wordle Solver</a> keeps you from doing that: mark each tile{" "}
        <strong>gray, yellow, or green</strong> exactly as it appeared in your actual game, and it
        instantly filters the full word list down to every candidate that is still consistent with what
        you have learned.
      </p>
      <p>
        This is not the tool for skipping the puzzle — entering nothing and asking it to just tell you
        today&apos;s answer defeats the point of playing at all. It earns its keep after you have
        already made a guess or two honestly and want to make sure your next guess actually uses the
        information the board gave you, instead of accidentally repeating a gray letter or ignoring a
        yellow one you forgot about. It is also a reasonable way to check your reasoning after you solve
        (or fail to solve) a puzzle, or to explore how a different opening guess would have narrowed the
        field.
      </p>

      <h2>An Honest Word on &quot;Cheating&quot;</h2>
      <p>
        It is worth being direct about what these tools are and are not. None of them are a service
        designed to let you win a competitive word game without knowing any words — that framing does
        not hold up, and it is not how these are meant to be used. What they actually are is a fast
        dictionary lookup for the moment you are stuck: the letter combination is right there, the word
        is real, and you just cannot see it, or you want to double-check a possibility before committing
        a scarce guess. That is a study aid and a puzzle aid, the same category as a rhyming dictionary
        or a thesaurus, not a way to bypass the game. If you are playing head-to-head against another
        person and the rules of that specific game or that specific opponent&apos;s expectations treat a
        lookup tool as cheating, that is a judgment call between you and them — the tool itself is just a
        dictionary with a search box.
      </p>

      <h2>Why These Run in a Browser Tab</h2>
      <p>
        All three tools work entirely client-side: the word list lives in the page, and the filtering
        and matching happen locally as you type, with nothing sent to a server. That means no account,
        no install, and results that come back instantly rather than after a network round trip — useful
        when you are mid-game and the clock, literal or social, is running.
      </p>

      <h2>Which Tool for Which Situation</h2>
      <p>
        If you are holding a <strong>rack of letters in a tile-based word game</strong> and need
        playable words, filtered by length or by a letter you need to build off of, use{" "}
        <a href="/tools/word-unscrambler">Word Unscrambler</a>. If you have a{" "}
        <strong>specific set of letters</strong> — a name, a phrase, a word — and want every word hiding
        inside it, full-length or shorter, use <a href="/tools/anagram-solver">Anagram Solver</a>. And
        if you are <strong>mid-Wordle</strong> with a few gray, yellow, and green tiles already on the
        board and want your next guess to actually use what you have learned, use{" "}
        <a href="/tools/wordle-solver">Wordle Solver</a>. Each one is a narrow, honest tool for a
        specific kind of stuck — not a shortcut around the puzzle, just a faster path through the part
        where you already know the answer is close but cannot quite see it.
      </p>
    </div>
  );
}
