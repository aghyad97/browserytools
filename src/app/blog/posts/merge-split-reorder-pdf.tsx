import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        You scanned a five-page contract, but the scanner saved each page as its own PDF. A colleague
        needs only the appendix from a forty-page report, not the whole thing. The pages of a document
        you scanned came out in the wrong order, and page three is a blank sheet the feeder pulled by
        mistake. None of these is a real emergency, but all of them stall you for the same reason: PDFs
        are awkward to rearrange, and the obvious fixes seem to require heavy desktop software or a
        subscription. They do not. A small set of focused browser tools handles each of these problems
        in a minute or two, and — this is the part that matters — the file never leaves your device.
      </p>
      <ToolCTA slug="merge-pdf" variant="inline" />
      <p>
        Everything below runs entirely inside the browser tab. Your PDF is read, edited, and written
        back out locally; nothing is uploaded to a server, which is exactly what you want when the
        document is a contract, a medical record, an ID scan, or anything else you would not hand to a
        stranger just to shuffle its pages.
      </p>

      <h2>Merge: Making Many Files Into One</h2>
      <p>
        The most common page-management problem is fragmentation. A scanner that saves one page per file,
        a signed agreement that arrives in three separate emails, an application that asks for a single
        combined PDF when you have four — in each case you have the right pages, they are just spread
        across too many files. The <a href="/tools/merge-pdf">Merge PDF</a> tool solves this directly:
        drop in every PDF you want combined, put them in the order you need, and it stitches them into
        one continuous document you can download and send.
      </p>
      <p>
        This is the tool for <strong>assembling a packet</strong>. Think of a job application that wants
        your resume, a cover letter, and a certificate as one file, or an expense claim that needs a
        stack of separately-scanned receipts submitted together. Instead of asking the recipient to open
        four attachments, you hand them one clean document. It is also how you rejoin pages that were
        scanned individually: gather the single-page PDFs your scanner spat out, order them, and merge —
        and the five loose files become the five-page contract they were always meant to be.
      </p>

      <h2>Split: Pulling Out Just the Part You Need</h2>
      <p>
        The opposite problem is just as common. You have one large PDF, but you only need a slice of it.
        Sending the whole forty-page report when someone asked for the three-page summary is a small
        rudeness — it makes them hunt for the part that matters and balloons the size of the email.{" "}
        <a href="/tools/split-pdf">Split PDF</a> lets you pull out a specific page range, or break a big
        document into smaller parts, so you send exactly what was asked for and nothing more.
      </p>
      <p>
        Reach for this whenever a document is <strong>bigger than the task</strong>. Extract a single
        chapter from a manual to share with someone who only needs that chapter. Pull the one signed page
        out of a long agreement to file it on its own. Break a bulky scanned book into per-chapter files
        so each is small enough to attach. Splitting is also the honest way to respect a page or size
        limit: rather than compressing a whole document into unreadability, you send only the pages that
        are actually relevant.
      </p>

      <h2>Reorder: Fixing the Sequence and Dropping Dead Pages</h2>
      <p>
        Sometimes the pages are all there, they are just in the wrong order — the classic result of a
        messy scan, a document fed through the scanner upside down or back-to-front, or pages that got
        combined in whatever sequence the software happened to grab them. The{" "}
        <a href="/tools/reorder-pdf-pages">Reorder PDF Pages</a> tool shows you every page as a
        thumbnail and lets you drag them into the correct sequence, so you can fix the order by eye
        instead of guessing at page numbers.
      </p>
      <p>
        The same tool handles the other half of tidying up: <strong>deleting pages you do not want</strong>.
        Scanners routinely pull a blank sheet, capture the same page twice, or grab a stray cover
        page you never meant to include. In the reorder view you can see those pages plainly and remove
        them, so the final document is exactly the pages you want in exactly the order you want them.
        Reordering and deleting are really one job — getting the sequence right — which is why they live
        in the same place.
      </p>
      <p>
        One neighbouring problem is worth a mention here, because it often shows up alongside a messy
        scan: pages that came out sideways. If a page was fed in rotated and now displays landscape when
        it should be portrait, reordering will not fix the orientation. That is what{" "}
        <a href="/tools/rotate-pdf">Rotate PDF</a> is for — turn the offending pages upright, and combine
        it with a reorder pass when a scan is both out of sequence and rotated.
      </p>

      <h2>Why Do This in a Browser Tab</h2>
      <p>
        There is a genuine reason to prefer an in-browser tool for this over a random free website, and
        it is not just convenience. Editing a PDF means opening its full contents — every clause, every
        signature, every number on that scanned ID. A lot of free online PDF sites work by uploading your
        document to their server, doing the edit there, and sending it back, which means a copy of a
        potentially sensitive file now sits on a machine you do not control, for however long they choose
        to keep it.
      </p>
      <p>
        These tools do the work locally instead. Modern browsers can read and rewrite PDF files directly
        in the page, so the merge, split, reorder, and rotate all happen on your device — the document
        is never transmitted anywhere. That also means it works the same on Windows, Mac, Linux, or a
        Chromebook, with no install, no account, and no subscription. For an ordinary task like
        rearranging pages, keeping the file on your own machine is simply the right default.
      </p>

      <h2>Which Tool for Which Problem</h2>
      <p>
        The four tools map cleanly onto four situations, and it is easy to remember which is which once
        you frame it by the problem in front of you. If you have <strong>too many files and need one</strong>,
        use <a href="/tools/merge-pdf">Merge PDF</a>. If you have <strong>one file and need only part of
        it</strong>, use <a href="/tools/split-pdf">Split PDF</a>. If the pages are all there but{" "}
        <strong>in the wrong order, or some need deleting</strong>, use{" "}
        <a href="/tools/reorder-pdf-pages">Reorder PDF Pages</a>. And if a page is simply{" "}
        <strong>facing the wrong way</strong>, use <a href="/tools/rotate-pdf">Rotate PDF</a>. They also
        chain naturally — merge a stack of scans, reorder and delete the blanks, rotate the sideways
        page, then split off the section you actually need to send. Each step takes a moment, runs
        entirely on your device, and leaves you with a document that is exactly what you meant to send.
      </p>
      <ToolCTA slug="merge-pdf" variant="card" />
    </div>
  );
}
