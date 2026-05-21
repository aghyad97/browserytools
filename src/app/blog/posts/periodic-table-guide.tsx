export default function Content() {
  return (
    <div>
      <p>
        The periodic table is one of the most elegant pieces of organization in all of science. In a single
        chart, it captures the structure of every known kind of matter — 118 elements arranged so that their
        properties repeat in predictable patterns. Whether you are a student cramming for a chemistry exam, a
        developer building a science app, or simply curious about why gold sits next to platinum, having a
        fast, clean periodic table at your fingertips is genuinely useful. That is exactly what the{" "}
        <a href="/tools/periodic-table">BrowseryTools interactive periodic table</a> gives you: all 118
        elements, color-coded, searchable, and clickable, running entirely in your browser with nothing to
        install.
      </p>

      <h2>How the Periodic Table Is Organized</h2>
      <p>
        The table is laid out in <strong>rows called periods</strong> and <strong>columns called groups</strong>.
        There are seven periods, and each one corresponds to an electron shell being filled. As you move left
        to right across a period, the atomic number — the count of protons in the nucleus — increases by one
        with each step. The eighteen groups stack elements with similar chemical behavior on top of each
        other, which is why the table is so powerful: elements in the same column tend to react in the same
        way.
      </p>
      <p>
        Two rows are usually pulled out and floated below the main body of the table: the{" "}
        <strong>lanthanides</strong> and the <strong>actinides</strong>. These are the f-block elements, and
        they are separated purely to keep the chart a manageable width. In our interactive periodic table they
        sit in their conventional position beneath the main grid, exactly as you would see them in a textbook.
      </p>

      <h2>The Element Categories</h2>
      <p>
        Every element belongs to a category that describes its general behavior, and our table color-codes
        each one so you can spot patterns at a glance:
      </p>
      <p>
        <strong>Alkali metals</strong> (group 1, minus hydrogen) are soft, highly reactive metals like sodium
        and potassium. <strong>Alkaline earth metals</strong> (group 2) include calcium and magnesium.{" "}
        <strong>Transition metals</strong> fill the broad middle block — iron, copper, gold, and the rest of
        the familiar workhorse metals. <strong>Post-transition metals</strong>, <strong>metalloids</strong>,
        and <strong>nonmetals</strong> span the right side, while the <strong>halogens</strong> (group 17) and
        the <strong>noble gases</strong> (group 18) finish the table. The lanthanides and actinides round out
        the f-block.
      </p>

      <h2>Reading an Element Tile</h2>
      <p>
        Each tile in the table shows the two most important facts: the <strong>atomic number</strong> in the
        corner and the <strong>chemical symbol</strong> in the center. Click any element and a detail panel
        opens with the full picture — the element name, atomic mass, the group and period it belongs to, its
        block (s, p, d, or f), and its electron configuration. The electron configuration is especially handy
        for chemistry students, since it explains why an element behaves the way it does.
      </p>
      <p>
        Take hydrogen, atomic number 1. It has a single electron in a 1s orbital, which is why its
        configuration is simply <code>1s1</code>. Carbon, atomic number 6, reads <code>[He] 2s2 2p2</code> —
        the helium core plus the electrons that make carbon the backbone of all organic chemistry. Seeing this
        information laid out plainly makes the logic of the table click into place.
      </p>

      <h2>Searching and Filtering</h2>
      <p>
        The real advantage of an interactive table over a printed one is speed. Type a name, a symbol, or an
        atomic number into the search box and the matching element lights up while the rest dim away. Looking
        for element 79? Type <code>79</code> and gold (Au) jumps out. Want to see every halogen at once? Click
        the halogen swatch in the legend and the whole group highlights together. This makes the tool ideal
        for quick lookups, homework, and teaching.
      </p>

      <h2>Why a Browser Tool Beats an App</h2>
      <p>
        You do not need to install anything or create an account to use a periodic table. Everything here runs
        locally in your browser — the element data is embedded directly in the page, so it loads instantly and
        works even offline once cached. There are no ads cluttering the chart and no tracking. Open the link,
        explore the elements, and bookmark it for next time. It works the same on a laptop, a tablet, or a
        phone.
      </p>

      <h2>A Tool for Every Level</h2>
      <p>
        Chemistry students use it to memorize trends and check electron configurations. Teachers project it on
        a screen and click through elements during a lesson. Developers and science writers grab atomic
        masses and symbols without hunting through a reference book. And the simply curious can wander the
        table, discover that there are now 118 confirmed elements, and learn that the heaviest ones —
        oganesson, tennessine, and their neighbors — were synthesized in laboratories only in the last few
        decades.
      </p>
      <p>
        Open the <a href="/tools/periodic-table">interactive periodic table</a> and start exploring. It is
        free, private, and ready whenever a question about the elements comes up.
      </p>
    </div>
  );
}
