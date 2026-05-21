import Link from 'next/link';

export default function Content() {
  return (
    <div>
      <p>
        Every developer eventually hits the same wall: you need data to test against, but using real
        user data is a liability, Lorem Ipsum is useless for anything beyond paragraph filler, and
        hand-crafting 500 test records in JSON is a way to ruin an afternoon. Fake data generators
        exist to solve exactly this problem — and the{" "}
        <Link href="/tools/fake-data">BrowseryTools Fake Data Generator</Link> does it for free, locally,
        with no account, no row limits, and no subscription.
      </p>
      <p>
        This guide covers why realistic fake data matters, what the generator produces, how to use it
        effectively across different workflows, and how to import the output into every common database
        and toolchain.
      </p>

      <h2>Why You Cannot Use Real User Data for Testing</h2>
      <p>
        Using production data in development or test environments is a compliance and legal risk under
        multiple regulatory frameworks:
      </p>
      <ul>
        <li>
          <strong>GDPR (Europe):</strong> Article 25 requires data minimization by design. Copying
          real user records — names, emails, addresses — into a staging database violates this principle
          unless the data has been properly anonymized. A breach of that staging environment exposes
          real people's data.
        </li>
        <li>
          <strong>HIPAA (US healthcare):</strong> Protected Health Information (PHI) cannot be used in
          test environments without either a Business Associate Agreement or proper de-identification
          per the Safe Harbor or Expert Determination methods. Using real patient records in a dev
          database is a direct HIPAA violation.
        </li>
        <li>
          <strong>CCPA (California):</strong> Personal information of California residents carries
          specific rights and restrictions. Using real customer records in any non-production context
          without appropriate controls creates unnecessary risk exposure.
        </li>
      </ul>
      <p>
        Beyond compliance, there are practical engineering reasons to avoid real data in tests: real
        data is messy in unpredictable ways (it has null fields, special characters, and Unicode that
        tests might not be written to handle), it changes over time (making tests non-deterministic),
        and it contains values that may accidentally trigger real side effects (sending emails to real
        addresses, charging real payment methods).
      </p>

      <div style={{background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", margin: "24px 0"}}>
        <strong>The safer default:</strong> Generate realistic fake data for every non-production
        environment. It is structurally valid, never identifiable, safe to commit to version control,
        and reproducible. Real data in dev/test environments is a liability by default.
      </div>

      <h2>Why Lorem Ipsum Is the Wrong Tool for Data</h2>
      <p>
        Lorem ipsum is fine for filling text blocks in a layout mockup. It is completely wrong for
        testing data-driven UIs and APIs because:
      </p>
      <ul>
        <li>
          It does not stress-test real field lengths. Email addresses, phone numbers, and zip codes
          all have specific formats and maximum lengths. "Lorem ipsum dolor sit amet" in an email
          field will not reveal that your input validation is wrong, but{" "}
          <code>very.long.name.that.pushes.limits@subdomain.example.com</code> will.
        </li>
        <li>
          It does not reveal edge cases in your UI. A name like "José García-López" tests your
          character encoding. A company name like "O'Brien & Associates, LLC" tests your SQL
          escaping. "Lorem ipsum" tests neither.
        </li>
        <li>
          It makes your mockups and prototypes look fake in a way that matters. Stakeholders reviewing
          a prototype with realistic names, realistic cities, and realistic email addresses can evaluate
          the design properly. Placeholder text breaks the illusion and makes it harder to spot
          actual usability problems.
        </li>
      </ul>

      <h2>What the BrowseryTools Fake Data Generator Produces</h2>
      <p>
        The generator supports a wide range of field types across multiple categories. You select
        which fields to include, and each generated record contains realistic, properly formatted
        values for every selected field:
      </p>

      <h3>Personal Information</h3>
      <ul>
        <li><strong>Full name</strong> — culturally realistic first + last name combinations</li>
        <li><strong>First name</strong> and <strong>last name</strong> separately (useful when your schema stores them in different columns)</li>
        <li><strong>Email address</strong> — properly formatted, using the generated name as the local part</li>
        <li><strong>Phone number</strong> — US format with area code</li>
        <li><strong>Date of birth</strong> — generates adults between 18 and 80 years old</li>
        <li><strong>Gender</strong> — male / female / non-binary</li>
      </ul>

      <h3>Address</h3>
      <ul>
        <li><strong>Street address</strong> — realistic house number and street name</li>
        <li><strong>City</strong> — real US and international city names</li>
        <li><strong>State</strong> — US states and international equivalents</li>
        <li><strong>Country</strong></li>
        <li><strong>ZIP / postal code</strong> — format matches the selected country</li>
      </ul>

      <h3>Internet &amp; Identity</h3>
      <ul>
        <li><strong>Username</strong> — generated from the name with numbers appended for realism</li>
        <li><strong>URL</strong> — realistic personal or company website URLs</li>
        <li><strong>IP address</strong> — valid IPv4 addresses in public ranges</li>
        <li><strong>User agent</strong> — real browser user-agent strings from common browsers</li>
      </ul>

      <h3>Finance</h3>
      <ul>
        <li>
          <strong>Credit card number</strong> — passes Luhn algorithm validation, so it will not be
          rejected by format validators; uses realistic card number prefixes (Visa 4xxx, Mastercard 5xxx)
          but is not a real card number
        </li>
        <li><strong>IBAN</strong> — valid format for European bank account numbers</li>
      </ul>

      <h3>Identifiers &amp; System Fields</h3>
      <ul>
        <li><strong>UUID</strong> — v4 UUID for database primary keys and correlation IDs</li>
        <li><strong>SSN</strong> — US Social Security Number format (XXX-XX-XXXX)</li>
        <li><strong>Dates</strong> and <strong>random numbers</strong> within configurable ranges</li>
      </ul>

      <h2>How to Use the Generator</h2>
      <p>
        Open <Link href="/tools/fake-data">/tools/fake-data</Link>. The interface gives you three controls:
      </p>
      <ol>
        <li>
          <strong>Select your fields:</strong> Check the boxes for every field type you want in the
          output. You can select as few as one field (just email addresses, for example) or the full
          set for comprehensive user records.
        </li>
        <li>
          <strong>Set the record count:</strong> Enter a number between 1 and 1,000. For load testing
          seed data, use 1,000. For a Storybook story or a design mockup, 5–10 records is usually enough.
        </li>
        <li>
          <strong>Choose output format:</strong> Select JSON or CSV. JSON is better for API testing
          and JavaScript toolchains. CSV is better for database imports, spreadsheet review, or tools
          like Postman.
        </li>
      </ol>
      <p>
        Click "Generate." The output appears in the text area below. Use the "Copy" button to copy it
        to your clipboard, or "Download" to save the file locally. Generation is instantaneous for up
        to 1,000 records — all computation happens in your browser.
      </p>

      <h2>JSON Output Example</h2>
      <p>
        Here is a representative 3-record snippet of JSON output with personal, address, and internet
        fields selected:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`[
  {
    "id": "a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e",
    "firstName": "Meredith",
    "lastName": "Okafor",
    "email": "meredith.okafor47@mailbox.net",
    "phone": "(312) 554-8821",
    "dateOfBirth": "1988-03-14",
    "gender": "female",
    "street": "2841 Birchwood Drive",
    "city": "Columbus",
    "state": "OH",
    "zipCode": "43215",
    "country": "United States",
    "username": "meredith_okafor88",
    "ipAddress": "74.125.224.18"
  },
  {
    "id": "b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f",
    "firstName": "Derek",
    "lastName": "Nascimento",
    "email": "d.nascimento@webfrontier.io",
    "phone": "(415) 703-2294",
    "dateOfBirth": "1995-11-02",
    "gender": "male",
    "street": "509 Elmwood Court",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "United States",
    "username": "derek_n95",
    "ipAddress": "192.0.2.147"
  },
  {
    "id": "c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a",
    "firstName": "Simone",
    "lastName": "Bertrand",
    "email": "simone.bertrand@alphamail.com",
    "phone": "(617) 889-4471",
    "dateOfBirth": "1979-07-28",
    "gender": "female",
    "street": "77 Harborview Terrace",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "United States",
    "username": "simone_b79",
    "ipAddress": "203.0.113.42"
  }
]`}</code></pre>

      <h2>CSV Output Example</h2>
      <p>
        The same data in CSV format, ready to import into a spreadsheet, a database, or any tool that
        accepts delimited files:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`id,firstName,lastName,email,phone,dateOfBirth,gender,street,city,state,zipCode,country,username,ipAddress
a3f7c2e1-8b4d-4f6a-9c1e-2d5b8f3a0c7e,Meredith,Okafor,meredith.okafor47@mailbox.net,(312) 554-8821,1988-03-14,female,2841 Birchwood Drive,Columbus,OH,43215,United States,meredith_okafor88,74.125.224.18
b8e2d5f1-3a9c-4e7b-8d2f-1c6a4e9b0d3f,Derek,Nascimento,d.nascimento@webfrontier.io,(415) 703-2294,1995-11-02,male,509 Elmwood Court,Portland,OR,97201,United States,derek_n95,192.0.2.147
c1d4f9a2-7e3b-4c8d-a5f2-0b9e6c1d4f8a,Simone,Bertrand,simone.bertrand@alphamail.com,(617) 889-4471,1979-07-28,female,77 Harborview Terrace,Boston,MA,02101,United States,simone_b79,203.0.113.42`}</code></pre>

      <h2>Real-World Example 1: Seeding a User Database for Load Testing</h2>
      <p>
        Load testing a user-facing API requires a populated database. You need enough records to
        simulate realistic query performance, pagination behavior, and search indexing — but you cannot
        use real user data, and hand-crafting thousands of SQL inserts is not practical.
      </p>
      <p>
        With the fake data generator, generate 1,000 records with all user-relevant fields selected,
        download as CSV, then import directly into your database:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`-- PostgreSQL: import CSV directly into users table
COPY users (id, first_name, last_name, email, phone, date_of_birth, city, state, zip_code)
FROM '/path/to/fake_users.csv'
DELIMITER ','
CSV HEADER;

-- MySQL equivalent:
LOAD DATA LOCAL INFILE '/path/to/fake_users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;

-- MongoDB (using mongoimport):
mongoimport --db myapp --collection users --type csv --headerline --file fake_users.csv`}</code></pre>

      <h2>Real-World Example 2: Populating a Storybook Story or Design Mockup</h2>
      <p>
        When building a UI component — a user table, a contact card, a search results list — the data
        you test against shapes whether you catch real problems. A table of 10 users where one has a
        very long name, one has an international character in their email, and one has a city that
        wraps onto two lines will reveal layout bugs that a table of identical placeholder rows never
        would.
      </p>
      <p>
        Generate 10–20 records as JSON, paste the output directly into your Storybook story or
        component fixture file:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// UserTable.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from './UserTable';

// Paste generated JSON directly from BrowseryTools:
const fakeUsers = [
  { id: "a3f7c2e1...", firstName: "Meredith", lastName: "Okafor", email: "meredith.okafor47@mailbox.net", city: "Columbus" },
  { id: "b8e2d5f1...", firstName: "Derek", lastName: "Nascimento", email: "d.nascimento@webfrontier.io", city: "Portland" },
  // ... more records
];

const meta: Meta<typeof UserTable> = { component: UserTable };
export default meta;

export const WithData: StoryObj<typeof UserTable> = {
  args: { users: fakeUsers },
};`}</code></pre>

      <h2>Real-World Example 3: API Integration Test Fixtures</h2>
      <p>
        Integration tests for an API endpoint that creates or updates user records need a reliable,
        deterministic set of input data. Rather than writing fixture objects by hand, generate a set of
        records once, save the JSON file to your test fixtures directory, and import it in your tests:
      </p>
      <pre style={{background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.2)", borderRadius: "10px", padding: "16px", overflowX: "auto", fontSize: "13px", lineHeight: "1.6"}}><code>{`// tests/fixtures/users.json — generated by BrowseryTools, committed to version control
// tests/api/users.test.ts

import users from '../fixtures/users.json';
import { createUser } from '../../src/api/users';

describe('POST /api/users', () => {
  it.each(users.slice(0, 10))('creates user with valid data (%s)', async (user) => {
    const response = await createUser(user);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
  });
});`}</code></pre>

      <h2>Importing into Postman Collections</h2>
      <p>
        For API testing with Postman, generate your test records as JSON and use Postman's data file
        feature to run a request once per record. Save the JSON output as a file, then in Postman:
        open your collection runner, select the request, and attach the JSON file as the "Data" source.
        Postman will iterate through each record, substituting the values into your request body using{" "}
        <code>{"{{firstName}}"}</code>, <code>{"{{email}}"}</code>, and similar variable syntax.
      </p>
      <p>
        This turns a manually written POST request into an automated test that runs against 100
        different realistic user records in seconds — without requiring any test framework setup.
      </p>

      <h2>BrowseryTools vs. Mockaroo</h2>
      <p>
        Mockaroo is the most well-known online fake data generator. It is a solid tool, but it has
        friction that BrowseryTools removes entirely:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "14px"}}>
          <thead>
            <tr style={{background: "rgba(34,197,94,0.08)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Dimension</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>BrowseryTools</th>
              <th style={{padding: "12px 16px", textAlign: "center", borderBottom: "2px solid rgba(34,197,94,0.25)", fontWeight: "700"}}>Mockaroo (Free)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Account required", "No", "Yes"],
              ["Row limit (free)", "1,000 per generation", "1,000/day total"],
              ["Subscription needed for more", "No", "Yes ($50/year)"],
              ["Data uploaded to a server", "Never", "Yes (schema + data)"],
              ["API access", "N/A", "Paid plans only"],
              ["Works offline", "Yes (after page load)", "No"],
              ["Output formats", "JSON, CSV", "JSON, CSV, SQL, Excel, and more"],
              ["Field type variety", "Common types covered", "Very extensive"],
            ].map(([dim, bt, moc], i) => (
              <tr key={i} style={{borderBottom: "1px solid rgba(128,128,128,0.15)", background: i % 2 === 0 ? "transparent" : "rgba(128,128,128,0.03)"}}>
                <td style={{padding: "11px 16px", fontWeight: "600"}}>{dim}</td>
                <td style={{padding: "11px 16px", textAlign: "center", color: "rgb(22,163,74)", fontWeight: "600"}}>{bt}</td>
                <td style={{padding: "11px 16px", textAlign: "center"}}>{moc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        If you need highly specialized field types or SQL output, Mockaroo remains valuable. For the
        common case — generating realistic JSON or CSV for user records — BrowseryTools requires no
        account setup, no daily limit management, and no concern about your data schema being sent to
        a third-party server.
      </p>

      <h2>Privacy: All Generation Happens Locally</h2>
      <p>
        Every name, email, address, and UUID the generator produces is created by JavaScript running
        in your browser tab. The field types you select, the number of records you request, and the
        output data itself are never transmitted to any server. BrowseryTools has no backend component
        involved in data generation.
      </p>
      <p>
        This matters less when generating fake data specifically (since it is all fictional by
        definition), but it matters for the schema you are using it to test against. If your field
        selections reveal the structure of a sensitive internal system, that information stays local too.
      </p>

      <div style={{background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "1rem 1.25rem", borderRadius: "0.5rem", margin: "1.5rem 0"}}>
        <strong>Fake data vs. data anonymization:</strong> These are separate tools for separate
        purposes. A fake data generator creates fictional records from scratch — nothing is based on
        real individuals. A data anonymization tool takes real records and transforms them to remove
        identifying information while preserving statistical properties. If you have real user data
        that you need to use in a test environment, anonymization is the appropriate tool (look at
        tools like ARX, Amnesia, or PostgreSQL's pg_anonymizer). If you need test data from scratch
        and have no real data to base it on, a fake data generator like this one is exactly right.
      </div>

      <h2>Generate Your First Dataset Now</h2>
      <p>
        Whether you are seeding a load test database, populating a Storybook story, writing API test
        fixtures, or just demoing a feature with something that looks real — realistic fake data is the
        right foundation, and generating it should take 30 seconds.
      </p>
      <p>
        Open the <Link href="/tools/fake-data">BrowseryTools Fake Data Generator</Link>, select your fields,
        set your record count, choose JSON or CSV, and hit Generate. No account, no row limit, no cost,
        nothing uploaded anywhere.
      </p>

      <div style={{background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.1))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "32px", margin: "40px 0", textAlign: "center"}}>
        <div style={{fontSize: "48px", marginBottom: "16px"}}>🤖</div>
        <h2 style={{margin: "0 0 12px", fontSize: "22px"}}>Generate Realistic Test Data in Seconds</h2>
        <p style={{margin: "0 0 20px", opacity: 0.8, maxWidth: "480px", marginLeft: "auto", marginRight: "auto"}}>
          Up to 1,000 records. JSON or CSV. Names, emails, addresses, UUIDs, credit cards, and more.
          Free, local, no account required.
        </p>
        <Link
          href="/tools/fake-data"
          style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "rgb(22,163,74)", color: "white", padding: "12px 28px", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "16px"}}
        >
          Open Fake Data Generator →
        </Link>
      </div>

      <p style={{fontSize: "14px", opacity: 0.7}}>
        Related tools:{" "}
        <Link href="/tools/json-formatter">JSON Formatter</Link> ·{" "}
        <Link href="/tools/uuid-generator">UUID Generator</Link> ·{" "}
        <Link href="/tools/regex-tester">Regex Tester</Link> ·{" "}
        <Link href="/tools/csv-to-json">CSV to JSON</Link> ·{" "}
        <Link href="/">All BrowseryTools</Link>
      </p>
    </div>
  );
}
