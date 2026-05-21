export default function Content() {
  return (
    <div>
      <p>
        Scheduling a meeting across time zones sounds simple until you have done it a few times.
        The person who said "let's meet at 9am my time" did not mention their time zone. Someone
        moved a meeting "an hour earlier" the week before a daylight saving transition, and it
        landed at the wrong time for half the team. A developer stored timestamps in local time
        and now the database is a mess of ambiguous entries.
      </p>
      <p>
        Time zones are one of those systems that seem intuitive until they are not, and the edge
        cases cause real problems. This guide covers how the system works, where it breaks down,
        how remote teams can avoid the most common scheduling errors, and the standards that make
        working across time zones tractable.
      </p>
      <p>
        You can use the{" "}
        <a href="/tools/timezone-converter">BrowseryTools Timezone Converter</a> — free, no sign-up,
        everything stays in your browser.
      </p>

      <h2>How Time Zones Work: UTC Offsets Explained</h2>
      <p>
        Time zones are defined as offsets from Coordinated Universal Time (UTC) — the modern
        successor to Greenwich Mean Time (GMT). UTC itself has no offset: UTC+0. Every other
        time zone is defined as UTC plus or minus some number of hours (and sometimes minutes).
      </p>
      <p>
        New York is UTC-5 in winter (Eastern Standard Time) and UTC-4 in summer (Eastern Daylight
        Time). London is UTC+0 in winter and UTC+1 in summer (British Summer Time). Tokyo is
        UTC+9 year-round. Sydney shifts between UTC+10 and UTC+11 depending on whether it is
        observing daylight saving time — which runs from October to April in the Southern
        Hemisphere, opposite to the Northern Hemisphere.
      </p>
      <p>
        Complicating matters further: not all time zone offsets are in whole hours. India is UTC+5:30.
        Nepal is UTC+5:45. Iran is UTC+3:30. Australia's Central Standard Time is UTC+9:30.
        These fractional offsets exist for historical, political, or geographical reasons and
        catch people off guard who assume all zones are on the hour.
      </p>

      <h2>Daylight Saving Time: Why It Makes Everything Harder</h2>
      <p>
        Daylight Saving Time (DST) is the practice of moving clocks forward one hour in spring
        and back one hour in autumn to shift daylight hours to the evening. It is observed by
        approximately 70 countries, ignored by the rest, and the transitions do not happen on
        the same date worldwide.
      </p>
      <p>
        The US and Canada switch on the second Sunday in March and the first Sunday in November.
        Most of Europe switches on the last Sunday in March and the last Sunday in October. This
        creates a three-week window in March and a one-week window in November when the offset
        between, say, New York and London is different from what it is the rest of the year.
        A standing weekly call "at 2pm New York time" can land at 6pm London time for 48 weeks
        and 7pm for 4 weeks — catching people off guard every time.
      </p>
      <p>
        Some places do not observe DST at all: Arizona (except the Navajo Nation), Hawaii, most
        of Africa, Japan, China, India, and much of Southeast Asia. The EU voted to abolish DST
        in 2019 but implementation has been deferred indefinitely. Until there is a permanent
        resolution, the complexity is not going away.
      </p>

      <h2>Why Scheduling Across Time Zones Is Error-Prone</h2>
      <p>
        The failure modes are well-documented:
      </p>
      <ul>
        <li>
          <strong>Assuming UTC offset is stable year-round</strong> — DST transitions mean the
          offset changes twice a year in most countries. A calendar invite created in January with
          a hard-coded UTC offset will be wrong after the March DST transition.
        </li>
        <li>
          <strong>"9am your time"</strong> — This phrase is ambiguous unless the speaker specifies
          the time zone explicitly. Their time zone, or your time zone? It is not always clear
          who is speaking.
        </li>
        <li>
          <strong>Calendar software inconsistency</strong> — Google Calendar, Outlook, and Apple
          Calendar all handle time zone display differently. An event created in one calendar
          app and shared via email does not always convert cleanly in the recipient's app,
          especially across different meeting invitation formats.
        </li>
        <li>
          <strong>Countries with non-standard offsets</strong> — Inviting someone in Kathmandu
          (UTC+5:45) or Tehran (UTC+3:30) to a meeting specified in whole-hour UTC will produce
          a fractional offset that many simple tools do not handle correctly.
        </li>
        <li>
          <strong>Date line crossings</strong> — A meeting at 9pm UTC on a Tuesday is Wednesday
          in Tokyo (UTC+9). Getting the date wrong when specifying meetings near midnight UTC
          is a common error.
        </li>
      </ul>

      <h2>Best Practices for Remote Team Scheduling</h2>
      <p>
        Teams that work across time zones have converged on several practices that dramatically
        reduce scheduling errors:
      </p>
      <ul>
        <li>
          <strong>Always specify time zone explicitly.</strong> Never say "3pm" without a time zone.
          "3pm UTC" is unambiguous. "3pm ET" is partially ambiguous (EST or EDT?). "3pm Eastern"
          is better but still ambiguous during transition weeks. "15:00 UTC" is completely
          unambiguous to anyone who knows their UTC offset.
        </li>
        <li>
          <strong>Use UTC as the team's reference time for internal communication.</strong> When
          discussing schedules internally, anchor everything to UTC. "The deploy is at 14:00 UTC"
          is something every team member can convert to their local time independently and correctly.
        </li>
        <li>
          <strong>Use tools that display multiple time zones simultaneously.</strong> A world clock
          showing UTC, each team member's current local time, and the offset makes it easy to
          check at a glance without mental arithmetic. The{" "}
          <a href="/tools/timezone-converter">BrowseryTools Timezone Converter</a> lets you compare
          multiple cities instantly.
        </li>
        <li>
          <strong>Schedule rotating "inconvenient" meetings.</strong> For globally distributed
          teams where no single time is convenient for everyone, rotate the inconvenient slot
          rather than requiring the same team members to always join at 7am or 10pm. Document
          the rotation so it is transparent.
        </li>
        <li>
          <strong>Avoid scheduling close to DST transition dates.</strong> In the two weeks
          around late October and late March, double-check offset assumptions before sending
          invites to international participants.
        </li>
      </ul>

      <h2>ISO 8601: The Datetime Format That Eliminates Ambiguity</h2>
      <p>
        ISO 8601 is an international standard for representing dates and times in a way that
        is unambiguous and sorts correctly as text. The format is:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        YYYY-MM-DDTHH:MM:SSZ (or +HH:MM for offset)
      </p>
      <ul>
        <li><code>2026-03-15T14:30:00Z</code> — March 15, 2026, 2:30pm UTC</li>
        <li><code>2026-03-15T14:30:00+05:30</code> — March 15, 2026, 2:30pm India Standard Time</li>
        <li><code>2026-03-15T14:30:00-07:00</code> — March 15, 2026, 2:30pm Mountain Daylight Time</li>
      </ul>
      <p>
        The "T" separates the date from the time. The trailing "Z" means UTC (Zulu time). A
        +/- offset specifies the local time and how far it is from UTC.
      </p>
      <p>
        ISO 8601 is used in all modern APIs, web standards (HTML datetime attributes, HTTP headers),
        and most programming language date libraries. For human communication, the "YYYY-MM-DD"
        date format — even without the time component — is useful because it sorts correctly
        and is unambiguous internationally. "03/04/2026" is April 3rd in the US and March 4th
        in the UK. "2026-03-04" is unambiguous.
      </p>

      <h2>Timezone Handling in Code: Always Store UTC</h2>
      <p>
        The single most important rule for developers working with timestamps:
        <strong> store all timestamps in UTC in your database.</strong> Always. Without exception.
      </p>
      <p>
        Storing timestamps in local time creates a class of bugs that are difficult to reproduce,
        hard to diagnose, and expensive to fix at scale:
      </p>
      <ul>
        <li>When your server changes time zones (as happens with cloud provider migrations), all historical timestamps are suddenly wrong</li>
        <li>DST transitions create ambiguous timestamps — 1:30am occurs twice on the day clocks fall back</li>
        <li>Sorting events chronologically becomes unreliable when timestamps mix different offsets</li>
        <li>Cross-timezone queries (find all events between midnight and midnight) become complex joins rather than simple range queries</li>
      </ul>
      <p>
        The correct pattern: store UTC, display local. Accept user input in their local time,
        convert to UTC immediately, store UTC, convert back to user's local time for display.
        The database layer should never need to know anything about time zones.
      </p>
      <p>
        Use the IANA timezone database (the "tz database" or "Olson database") for timezone data
        in code rather than maintaining UTC offsets manually. The IANA database is updated when
        countries change their DST rules or offsets — which happens more often than you would
        expect. Reference timezones by IANA identifier (e.g., "America/New_York", "Asia/Kolkata")
        not by offset (e.g., "UTC-5"), because identifiers correctly handle DST transitions
        while fixed offsets do not.
      </p>

      <div style={{background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free Timezone Converter — Compare Cities, Find Overlaps
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Convert times across multiple cities instantly, account for DST automatically,
          and find the right meeting time for your remote team.
        </p>
        <a
          href="/tools/timezone-converter"
          style={{background: "rgba(139,92,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open Timezone Converter →
        </a>
      </div>
    </div>
  );
}
