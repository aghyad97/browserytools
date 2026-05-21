export default function Content() {
  return (
    <div>
      <p>
        If you have ever deployed a web application, configured a CI/CD pipeline, or managed a Linux server, you have
        almost certainly encountered a cron expression. Five asterisks staring back at you from a configuration file.
        A cryptic string like <code>0 2 * * 0</code> buried in a GitHub Actions workflow. An AWS EventBridge schedule
        that nobody on the team fully understands anymore. Cron expressions are everywhere — and they are genuinely
        confusing if you have not taken the time to learn the system behind them.
      </p>
      <p>
        This guide is the reference you should bookmark. It covers everything from the history of cron and where it
        shows up in modern infrastructure, to every special character, 10 annotated real-world examples, common
        mistakes, and a full reference table. By the end, you will be able to read any cron expression at a glance
        and write new ones with confidence.
      </p>

      <h2>What Is Cron?</h2>
      <p>
        Cron is a Unix-based job scheduler that runs commands or scripts automatically at specified times and
        intervals. The name comes from <strong>Chronos</strong>, the Greek personification of time — an apt choice
        for a tool whose entire purpose is time-based automation. The original cron was introduced in{" "}
        <strong>Unix Version 7 in 1979</strong>, written by Ken Thompson at Bell Labs, and it has been a staple of
        Unix-like operating systems ever since.
      </p>
      <p>
        The scheduler works by reading configuration files called <strong>crontabs</strong> (cron tables) — plain
        text files where each line defines a scheduled task. A background daemon process (<code>crond</code>) wakes
        up every minute, checks all active crontabs, and runs any jobs whose schedule matches the current time.
        It is a beautifully simple design that has remained fundamentally unchanged for over four decades.
      </p>

      <h2>Where You Encounter Cron Today</h2>
      <p>
        Cron is not just a relic of the Unix past. The cron expression syntax is the de facto standard for
        expressing recurring schedules across the modern software stack:
      </p>
      <ul>
        <li><strong>Linux and macOS crontab:</strong> The original use case. Run <code>crontab -e</code> on any
        Linux or macOS machine to edit your personal cron schedule.</li>
        <li><strong>GitHub Actions:</strong> Workflow files use cron syntax under the <code>schedule:</code> trigger
        to run CI/CD pipelines on a recurring basis.</li>
        <li><strong>AWS EventBridge (formerly CloudWatch Events):</strong> Triggers Lambda functions, ECS tasks, and
        other AWS services on a schedule using a 6-field cron variant.</li>
        <li><strong>Kubernetes CronJobs:</strong> The <code>CronJob</code> resource runs batch workloads inside a
        cluster on a cron schedule.</li>
        <li><strong>CI/CD pipelines:</strong> GitLab CI, CircleCI, Jenkins, and Bitbucket Pipelines all support
        scheduled runs using cron expressions.</li>
        <li><strong>Vercel and Netlify:</strong> Both platforms support cron-triggered serverless functions for
        tasks like cache invalidation, data fetching, and nightly builds.</li>
        <li><strong>Database maintenance:</strong> PostgreSQL's <code>pg_cron</code> extension, MySQL Event Scheduler,
        and managed database services use cron syntax for vacuuming, indexing, and backup jobs.</li>
        <li><strong>Application-level schedulers:</strong> Libraries like node-cron, APScheduler (Python), Quartz
        (Java), and Sidekiq (Ruby) all use cron expressions to define recurring background jobs.</li>
      </ul>
      <p>
        In short: if you work in any area of software development or system administration, cron expressions are
        something you will encounter regularly. Learning them once pays dividends everywhere.
      </p>

      <h2>The Five-Field Structure</h2>
      <p>
        A standard cron expression consists of exactly five fields separated by spaces, each representing a unit
        of time. Together, they define when a job should run. Here is the canonical visual representation:
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "20px 24px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.7", margin: "24px 0"}}>{`┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–7)
│ │ │ │ │
* * * * *`}</pre>
      <p>
        Reading left to right: minute, hour, day of month, month, day of week. An asterisk (<code>*</code>) in any
        field means "every possible value for this field." So <code>* * * * *</code> means "every minute of every
        hour of every day" — the most permissive schedule possible.
      </p>

      <h3>Field 1: Minute (0–59)</h3>
      <p>
        The minute field controls which minute(s) within an hour a job fires. A value of <code>0</code> means
        on the hour, <code>30</code> means at the half hour, and <code>*</code> means every minute. This is the
        most granular field in standard cron — the smallest scheduling unit is one minute.
      </p>

      <h3>Field 2: Hour (0–23)</h3>
      <p>
        The hour field uses 24-hour time. <code>0</code> is midnight, <code>9</code> is 9am, <code>17</code> is
        5pm, and <code>23</code> is 11pm. There is no AM/PM — everything is in 24-hour format. Remember that cron
        always runs in the timezone of the server unless explicitly configured otherwise.
      </p>

      <h3>Field 3: Day of Month (1–31)</h3>
      <p>
        Controls which day(s) of the month a job runs. <code>1</code> is the first, <code>15</code> is the
        fifteenth, <code>31</code> is the thirty-first. Be careful with values like <code>31</code> — in months
        with fewer days (February, April, June, etc.), a job scheduled for the 31st simply will not run that month.
        Some implementations support the special <code>L</code> character to mean "last day of the month"
        regardless of how many days the month has.
      </p>

      <h3>Field 4: Month (1–12)</h3>
      <p>
        The month field uses numeric values (1 for January through 12 for December) or three-letter abbreviations
        (<code>JAN</code>, <code>FEB</code>, <code>MAR</code>, <code>APR</code>, <code>MAY</code>, <code>JUN</code>,
        <code>JUL</code>, <code>AUG</code>, <code>SEP</code>, <code>OCT</code>, <code>NOV</code>, <code>DEC</code>)
        in most implementations. An asterisk means "every month."
      </p>

      <h3>Field 5: Day of Week (0–7)</h3>
      <p>
        This field specifies which day(s) of the week the job should run. The numbering here is a common source of
        confusion: <strong>both 0 and 7 represent Sunday</strong> in most cron implementations (a legacy quirk from
        the original Unix design). Monday is 1, Tuesday is 2, and Saturday is 6. Three-letter abbreviations
        (<code>SUN</code>, <code>MON</code>, <code>TUE</code>, <code>WED</code>, <code>THU</code>, <code>FRI</code>,
        <code>SAT</code>) are supported in most modern cron tools.
      </p>
      <div style={{background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Important:</strong> When both day-of-month and day-of-week are specified (not <code>*</code>),
        most cron implementations treat them as an OR condition — the job runs if either condition matches. This
        is a subtle but critical behavior that catches many developers off guard.
      </div>

      <h2>Special Characters</h2>
      <p>
        The real power of cron expressions comes from six special characters that let you express complex schedules
        concisely. Understanding these is the key to fluency.
      </p>

      <h3>* — Wildcard (Every Value)</h3>
      <p>
        An asterisk means "match every possible value in this field." In the minute field, <code>*</code> means
        every minute (0 through 59). In the month field, it means every month. It is the default "I don't care
        about this field" value.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`* * * * *    # Runs every single minute, all day, every day`}</pre>

      <h3>, — List (Multiple Values)</h3>
      <p>
        A comma separates a list of specific values. The field matches if the current time matches any value in
        the list. This is how you schedule a job to run at multiple discrete times without using a range.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9,13,17 * * *    # Runs at 9:00 AM, 1:00 PM, and 5:00 PM every day
0 0 1,15 * *       # Runs at midnight on the 1st and 15th of every month`}</pre>

      <h3>- — Range (From Through To)</h3>
      <p>
        A hyphen defines an inclusive range of values. The field matches every value between the start and end,
        inclusive. This is ideal for expressing things like "during business hours" or "on weekdays."
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9-17 * * *      # Runs at the top of every hour from 9 AM through 5 PM
0 0 * * 1-5       # Runs at midnight every Monday through Friday`}</pre>

      <h3>/ — Step (Every N Units)</h3>
      <p>
        A forward slash defines a step value. <code>*/5</code> means "every 5 units starting from the minimum."
        You can also combine it with a range: <code>0-30/10</code> means "every 10 units between 0 and 30"
        (i.e., 0, 10, 20, 30). Steps are one of the most commonly used special characters.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 * * * *       # Every 5 minutes (0, 5, 10, 15, ... 55)
*/15 * * * *      # Every 15 minutes (0, 15, 30, 45)
0 */6 * * *       # Every 6 hours (0:00, 6:00, 12:00, 18:00)
0/15 * * * *      # Same as */15 — starts from 0, every 15 minutes`}</pre>

      <h3>L — Last (Some Implementations Only)</h3>
      <p>
        The <code>L</code> character is supported in some cron implementations (notably Quartz Scheduler in Java
        and some Linux cron variants) to mean "last." In the day-of-month field, <code>L</code> means the last
        day of the current month — whether that is the 28th, 29th, 30th, or 31st. It solves the problem of
        scheduling "end-of-month" tasks without knowing the month's length in advance.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 L * *         # Midnight on the last day of every month (Quartz/some crons)`}</pre>

      <h3>? — No Specific Value (Quartz/Java Cron)</h3>
      <p>
        The question mark is used in Quartz Scheduler (Java) and some other tools when you want to specify a
        day-of-week without also specifying a day-of-month, or vice versa. Since it does not make logical sense
        to specify both (say "the 15th AND a Wednesday"), one of them should be set to <code>?</code> to indicate
        "I don't care." Standard Unix cron does not use this character — you use <code>*</code> instead.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 15 * ?        # Quartz: 9 AM on the 15th, day-of-week unspecified
0 9 ? * MON       # Quartz: 9 AM every Monday, day-of-month unspecified`}</pre>

      <h2>10 Real-World Cron Examples</h2>
      <p>
        The best way to solidify your understanding is to study real examples with context for why each schedule
        was chosen. Here are ten patterns you will encounter (and use) regularly.
      </p>

      <h3>1. Every Weekday at 9:00 AM</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 9 * * 1-5`}</pre>
      <p>
        The minute is <code>0</code> (top of the hour), hour is <code>9</code> (9 AM), day-of-month and month
        are wildcards, and day-of-week is <code>1-5</code> (Monday through Friday). Used for daily standup
        reminders, report emails sent at the start of the business day, and morning data sync jobs that should
        not run over the weekend.
      </p>

      <h3>2. Every 15 Minutes</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/15 * * * *`}</pre>
      <p>
        The step syntax <code>*/15</code> in the minute field gives you runs at 0, 15, 30, and 45 minutes past
        every hour, around the clock. Common for health check pings, cache warming, webhook retries, and any
        near-real-time polling task where you need freshness but true real-time is overkill or not available.
      </p>

      <h3>3. Every Day at Midnight</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 * * *`}</pre>
      <p>
        Minute 0, hour 0, everything else wildcard. This is one of the most common cron patterns in existence.
        Used for daily report generation, log rotation, database archiving, clearing temporary files, sending
        daily digest emails, and any "once a day" task that should run outside business hours.
      </p>

      <h3>4. First Day of Every Month at Midnight</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 * *`}</pre>
      <p>
        Day-of-month is <code>1</code>, everything else is wildcard (except fixed minute/hour). This runs on
        January 1st, February 1st, March 1st, and so on. The go-to schedule for monthly invoice generation,
        billing cycle triggers, SaaS subscription renewals, and monthly analytics roll-ups.
      </p>

      <h3>5. Every Sunday at 2:00 AM</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 2 * * 0`}</pre>
      <p>
        Day-of-week <code>0</code> is Sunday, and hour <code>2</code> is 2 AM — a time when traffic is typically
        at its lowest. Used for weekly full database backups, sitemap regeneration, content re-indexing for search,
        and heavy batch processing jobs that would impact performance during the week.
      </p>

      <h3>6. Weekdays at 8:30 AM, 12:30 PM, and 5:30 PM</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`30 8,12,17 * * 1-5`}</pre>
      <p>
        This combines a list in the hour field with a range in the day-of-week field. The minute <code>30</code>
        means it fires at the half-hour mark. Used for scheduled notification batches (push notifications, email
        digests), three-times-daily data sync jobs, and any workflow where you want regular touchpoints
        throughout the business day without hammering every hour.
      </p>

      <h3>7. January 1st at Midnight</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 1 1 *`}</pre>
      <p>
        Day-of-month <code>1</code> and month <code>1</code> (January) together pin this to New Year's Day.
        Used for annual tasks like yearly subscription renewals, archiving the previous year's data, generating
        annual compliance reports, and resetting yearly quotas or counters in applications.
      </p>

      <h3>8. Every 5 Minutes During Business Hours on Weekdays</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`*/5 9-17 * * 1-5`}</pre>
      <p>
        A compound expression combining a step (<code>*/5</code>), a range in hours (<code>9-17</code>), and a
        range in day-of-week (<code>1-5</code>). This gives you aggressive monitoring or polling — every 5 minutes
        from 9 AM to 5 PM on Monday through Friday — while going quiet overnight and on weekends to save resources
        and avoid alert fatigue.
      </p>

      <h3>9. Every 6 Hours</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 */6 * * *`}</pre>
      <p>
        The step in the hour field (<code>*/6</code>) gives four evenly-spaced runs per day: midnight, 6 AM,
        noon, and 6 PM. Used for data synchronization between systems, refreshing long-lived API tokens or
        OAuth credentials before they expire, and periodic cache invalidation for content that changes a few
        times a day but does not need minute-level freshness.
      </p>

      <h3>10. 15th and Last Day of Every Month</h3>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`0 0 15,L * *`}</pre>
      <p>
        A comma list in the day-of-month field combining a fixed date (<code>15</code>) and the last-day
        shorthand (<code>L</code>). This is the classic semi-monthly payroll schedule — pay periods that end
        on the 15th and on the last day of the month. Note that <code>L</code> requires an implementation that
        supports it (Quartz, some Linux crons); standard crontab does not support <code>L</code>.
      </p>

      <h2>Common Mistakes and Gotchas</h2>
      <p>
        Cron expressions have several well-known pitfalls that cause production incidents. Understanding them
        upfront will save you a painful debugging session at 2 AM.
      </p>

      <h3>Day-of-Week Numbering Is Not Universal</h3>
      <p>
        Most Unix cron implementations treat both <code>0</code> and <code>7</code> as Sunday. But some tools
        (including certain application-level libraries) start the week on Monday, making <code>1</code> = Monday
        and <code>7</code> = Sunday. Always verify the numbering convention for the specific tool you are using,
        and prefer using three-letter abbreviations (<code>MON</code>, <code>TUE</code>, etc.) when the
        implementation supports them to eliminate ambiguity.
      </p>

      <h3>Cron Runs in the Server's Timezone</h3>
      <p>
        This is probably the most common source of cron bugs in production. <code>0 9 * * *</code> means 9 AM
        in <em>the timezone of the machine running the job</em> — which may be UTC, US/Eastern, or anything else.
        Always document the timezone assumption in a comment next to the cron expression. For cloud-based schedulers,
        explicitly configure the timezone if the platform supports it.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# Good practice: always document the timezone
# Runs at 9 AM US/Eastern (UTC-5 or UTC-4 during DST)
0 14 * * 1-5   # 9 AM ET expressed in UTC`}</pre>

      <h3>GitHub Actions Cron Always Runs on UTC</h3>
      <p>
        GitHub Actions uses standard 5-field cron syntax under the <code>on: schedule:</code> key, but the
        scheduler always operates in UTC — there is no timezone configuration option. If you want a job to run
        at 9 AM Eastern time, you need to schedule it at <code>0 14 * * *</code> (UTC). Also note that GitHub
        Actions scheduled workflows may run up to 15 minutes late during periods of high demand.
      </p>

      <h3>The Step Syntax Applies to Its Field, Not Minutes</h3>
      <p>
        A common misreading: <code>*/5</code> in the <em>hour</em> field means every 5 hours — not every 5
        minutes. The step always applies to the unit of the field it is in. <code>*/5</code> in the minute field
        is every 5 minutes; in the hour field, every 5 hours; in the month field, every 5 months.
      </p>

      <h3>Jobs That Run Longer Than Their Interval Can Overlap</h3>
      <p>
        Cron is a fire-and-forget scheduler. If you schedule a job every 5 minutes and a job instance takes
        7 minutes to complete, a second instance will start while the first is still running. This can cause
        race conditions, duplicate processing, and data corruption. Use a file lock or an advisory lock in
        your database to prevent concurrent execution of the same job.
      </p>

      <h3>Missing Fields vs. Wildcards Are Not Always Equivalent</h3>
      <p>
        In some extended cron implementations (particularly Quartz), omitting a field and using <code>*</code>
        are treated differently. Always use all required fields explicitly and never rely on defaults for
        critical production schedules.
      </p>

      <h2>Non-Standard Extensions: 6-Field Cron</h2>
      <p>
        The standard Unix cron has five fields, with minute as the finest granularity. Several systems extend
        this with additional fields:
      </p>

      <h3>Seconds Field (Prepended)</h3>
      <p>
        Many application-level schedulers (node-cron, Quartz, Spring Scheduler) add a <strong>seconds field
        at the beginning</strong>, giving you 6 fields. This enables sub-minute scheduling down to the second.
        The fields are: <code>second minute hour day-of-month month day-of-week</code>.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# 6-field cron with seconds prepended (Quartz / node-cron)
0 */5 * * * *    # Every 5 minutes (second=0, minute=*/5, ...)
30 0 9 * * 1-5   # Weekdays at 9:00:30 AM`}</pre>

      <h3>AWS EventBridge (6 Fields with Year)</h3>
      <p>
        AWS EventBridge uses a 6-field format where a <strong>year field is appended at the end</strong>:
        <code>minute hour day-of-month month day-of-week year</code>. It also requires using <code>?</code>
        for either day-of-month or day-of-week (never both as wildcards at the same time). AWS EventBridge
        does not support the <code>*/</code> step syntax in the same way as Unix cron.
      </p>
      <pre style={{background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "16px 20px", overflowX: "auto", fontFamily: "monospace", fontSize: "0.9rem", margin: "16px 0"}}>{`# AWS EventBridge cron format (6 fields, year at end)
cron(0 9 ? * MON-FRI *)    # Weekdays at 9 AM UTC, any year
cron(0 0 1 * ? *)           # First day of every month at midnight`}</pre>
      <div style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>Quick tip:</strong> When copying a cron expression between platforms, always verify the field
        count and any platform-specific syntax differences. A valid Unix cron expression may be invalid (or
        mean something different) in AWS EventBridge, Quartz, or a node-cron context.
      </div>

      <h2>How to Use the BrowseryTools Cron Parser</h2>
      <p>
        Writing a cron expression from scratch is one skill — validating that you wrote it correctly is another.
        The <a href="/tools/cron-parser">BrowseryTools Cron Parser</a> makes it trivial to verify any expression
        before it goes anywhere near production.
      </p>
      <p>Paste any 5-field (or 6-field) cron expression into the tool and instantly get:</p>
      <ul>
        <li>A <strong>human-readable description</strong> of the schedule ("Every weekday at 9:00 AM") so you can
        verify your intent matches your expression at a glance.</li>
        <li>The <strong>next 5–10 scheduled run times</strong> listed out explicitly, so you can see exactly when
        the job will fire and confirm there are no surprises.</li>
        <li>Instant feedback on <strong>invalid syntax</strong> — helpful if you have a typo or are working with
        an expression someone else wrote.</li>
      </ul>
      <p>
        Everything runs entirely in your browser — no expression is sent to any server. It is the fastest way to
        sanity-check a schedule before deploying to GitHub Actions, Kubernetes, or any other platform.
      </p>

      <h2>Cron Expression Reference Table</h2>
      <p>
        Use this table as a quick reference. Bookmark this page and come back to it whenever you need to look up
        a pattern or verify what an expression means.
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.15)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)", whiteSpace: "nowrap"}}>Expression</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Human-Readable Meaning</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Typical Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>* * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every minute</td>
              <td style={{padding: "12px 16px"}}>High-frequency polling, testing</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every 5 minutes</td>
              <td style={{padding: "12px 16px"}}>Health checks, cache warming</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/15 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every 15 minutes</td>
              <td style={{padding: "12px 16px"}}>Data sync, webhook retries</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 * * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every hour on the hour</td>
              <td style={{padding: "12px 16px"}}>Hourly aggregations, API calls</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 */6 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every 6 hours</td>
              <td style={{padding: "12px 16px"}}>Token refresh, data sync</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 * * *</code></td>
              <td style={{padding: "12px 16px"}}>Every day at midnight</td>
              <td style={{padding: "12px 16px"}}>Daily reports, log rotation</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 9 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Weekdays at 9:00 AM</td>
              <td style={{padding: "12px 16px"}}>Business-hours jobs, reminders</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 2 * * 0</code></td>
              <td style={{padding: "12px 16px"}}>Every Sunday at 2:00 AM</td>
              <td style={{padding: "12px 16px"}}>Weekly backups, maintenance</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 * *</code></td>
              <td style={{padding: "12px 16px"}}>First of every month at midnight</td>
              <td style={{padding: "12px 16px"}}>Monthly invoices, billing</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1,15 * *</code></td>
              <td style={{padding: "12px 16px"}}>1st and 15th of every month</td>
              <td style={{padding: "12px 16px"}}>Semi-monthly payroll</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>0 0 1 1 *</code></td>
              <td style={{padding: "12px 16px"}}>January 1st at midnight</td>
              <td style={{padding: "12px 16px"}}>Annual tasks, yearly reset</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>30 8,12,17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Weekdays at 8:30, 12:30, 17:30</td>
              <td style={{padding: "12px 16px"}}>Notification batches</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.08)"}}>
              <td style={{padding: "12px 16px"}}><code style={{background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap"}}>*/5 9-17 * * 1-5</code></td>
              <td style={{padding: "12px 16px"}}>Every 5 min during business hours (weekdays)</td>
              <td style={{padding: "12px 16px"}}>Active monitoring, polling</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Validate Your Cron Expressions Before You Deploy</h2>
      <p>
        Cron expressions are compact and powerful, but their terseness means a single typo can silently produce
        a completely different schedule. A job you intended to run monthly might run daily. A backup you meant
        to trigger every Sunday might never run at all. The cost of a wrong schedule in production can range
        from a missed report to a billing job that fires hundreds of times.
      </p>
      <p>
        The two-minute habit of pasting your expression into a validator and reviewing the next few scheduled
        run times before deploying is one of the highest-value practices in DevOps and backend engineering. It
        catches mistakes before they become incidents.
      </p>
      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Validate Any Cron Expression Instantly — Free, Private, In-Browser
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Paste your expression, get a human-readable description, and see the next scheduled run times.
          Nothing leaves your browser.
        </p>
        <a
          href="/tools/cron-parser"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block"}}
        >
          Open the Cron Parser →
        </a>
      </div>
    </div>
  );
}
