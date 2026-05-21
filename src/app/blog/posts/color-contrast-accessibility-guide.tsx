export default function Content() {
  return (
    <div>
      <p>
        Every time you squint at a website because the text is too light, or struggle to read a button
        label because it blends into the background, you are experiencing a contrast failure. For most
        people this is a minor annoyance. For a significant portion of the population — those with color
        vision deficiencies, low vision, aging eyes, or anyone using a screen in bright sunlight — it
        makes content genuinely inaccessible. Color contrast is one of the most impactful and most
        frequently violated aspects of web accessibility, and it is also one of the easiest to fix once
        you understand the rules. This guide explains the standard, the math, the common mistakes, and
        how to use the <a href="/tools/contrast-checker">BrowseryTools Color Contrast Checker</a> to
        verify any color pair instantly in your browser.
      </p>

      <h2>Why Contrast Matters</h2>
      <p>
        The scale of the affected population is larger than most designers assume. According to the World
        Health Organization, approximately 2.2 billion people globally have some form of near or distance
        vision impairment. Color vision deficiency — commonly called color blindness — affects roughly
        8% of men and 0.5% of women of Northern European descent, meaning around 300 million people
        worldwide have some difficulty distinguishing certain colors.
      </p>
      <p>
        Beyond permanent conditions, contrast affects everyone situationally:
      </p>
      <ul>
        <li>Reading a phone in bright outdoor sunlight washes out low-contrast text entirely.</li>
        <li>Old or budget monitors have reduced brightness and worse color accuracy.</li>
        <li>Migraine sufferers and people with photosensitivity often use reduced-brightness displays.</li>
        <li>Screen glare from windows or overhead lights effectively reduces perceived contrast.</li>
        <li>Users in a hurry — essentially everyone — process high-contrast content faster.</li>
      </ul>
      <p>
        Good contrast is not a niche accommodation. It improves the experience for every user, on every
        device, in every lighting condition.
      </p>

      <h2>What Is Contrast Ratio?</h2>
      <p>
        Contrast ratio is a standardized number that expresses how different two colors are in terms of
        their relative brightness (luminance). It is always expressed as a ratio: the brighter color
        divided by the darker color, with 0.05 added to each to avoid division by zero and to account for
        ambient light in real displays.
      </p>
      <p>
        The range runs from <strong>1:1</strong> (two identical colors — zero contrast, completely
        unreadable) to <strong>21:1</strong> (pure black on pure white — the maximum possible contrast).
        The higher the ratio, the more distinguishable the two colors are.
      </p>

      <h2>How Contrast Ratio Is Calculated</h2>
      <p>
        The formula used by WCAG (and the entire web standards ecosystem) relies on the concept of
        relative luminance — a measure of how much light a color appears to emit, adjusted for human
        visual perception. The calculation happens in two steps.
      </p>
      <p>
        <strong>Step 1: Calculate relative luminance (L) for each color.</strong>
      </p>
      <p>
        First, convert each RGB channel from the 0–255 range to a 0–1 linear scale, then apply a
        gamma-expansion formula to account for how displays encode brightness:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`// For each channel value c in [0, 1]:
if c <= 0.04045:
    c_linear = c / 12.92
else:
    c_linear = ((c + 0.055) / 1.055) ^ 2.4

L = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear`}
      </pre>
      <p>
        The coefficients 0.2126, 0.7152, and 0.0722 reflect human color sensitivity: our eyes are most
        sensitive to green, moderately sensitive to red, and least sensitive to blue.
      </p>
      <p>
        <strong>Step 2: Calculate the contrast ratio.</strong>
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.9rem", overflowX: "auto"}}>
{`Contrast Ratio = (L_lighter + 0.05) / (L_darker + 0.05)`}
      </pre>
      <p>
        Where <code>L_lighter</code> is the relative luminance of the brighter color and{" "}
        <code>L_darker</code> is the relative luminance of the darker color.
      </p>

      <h3>Example Calculations</h3>
      <ul>
        <li>
          <strong>Black (#000000) on white (#FFFFFF):</strong> L(white) = 1.0, L(black) = 0.0.
          Ratio = (1.0 + 0.05) / (0.0 + 0.05) = 1.05 / 0.05 = <strong>21:1</strong>. Maximum possible contrast.
        </li>
        <li>
          <strong>#767676 gray on white (#FFFFFF):</strong> L(#767676) ≈ 0.216.
          Ratio = (1.0 + 0.05) / (0.216 + 0.05) ≈ 1.05 / 0.266 ≈ <strong>4.54:1</strong>.
          This barely passes WCAG AA for normal text.
        </li>
        <li>
          <strong>#999999 gray on white (#FFFFFF):</strong> L(#999999) ≈ 0.319.
          Ratio = (1.0 + 0.05) / (0.319 + 0.05) ≈ 1.05 / 0.369 ≈ <strong>2.85:1</strong>.
          This fails WCAG AA for text of any size.
        </li>
      </ul>

      <h2>WCAG: The Standard That Defines Accessibility Requirements</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) are published by the World Wide Web Consortium
        (W3C) and define the internationally recognized standard for web accessibility. The current
        version in widespread regulatory use is WCAG 2.1, published in 2018. WCAG 3.0 is in development
        and will eventually replace it with a more nuanced measurement system, but WCAG 2.1 remains the
        operative standard for compliance purposes.
      </p>
      <p>
        WCAG organizes requirements into three conformance levels: A (minimum), AA (standard), and AAA
        (enhanced). Level AA is what most legal frameworks require. Level AAA is aspirational and not
        mandated for entire sites, only for specific contexts.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 700, fontSize: "1rem", color: "#1d4ed8"}}>
          WCAG 2.1 Contrast Requirements at a Glance
        </p>
        <ul style={{marginTop: 0, marginBottom: 0}}>
          <li>
            <strong>Level AA — Normal text:</strong> minimum contrast ratio of <strong>4.5:1</strong>
          </li>
          <li>
            <strong>Level AA — Large text:</strong> minimum contrast ratio of <strong>3:1</strong>
            (large text = 18pt / 24px regular weight, or 14pt / ~18.67px bold weight)
          </li>
          <li>
            <strong>Level AA — UI components and graphical objects:</strong> minimum contrast ratio of <strong>3:1</strong>
            (applies to button borders, input field outlines, icons that convey meaning)
          </li>
          <li>
            <strong>Level AAA — Normal text:</strong> minimum contrast ratio of <strong>7:1</strong>
          </li>
          <li>
            <strong>Level AAA — Large text:</strong> minimum contrast ratio of <strong>4.5:1</strong>
          </li>
        </ul>
      </div>

      <p>
        It is important to note what the contrast requirements do <em>not</em> apply to: decorative
        images with no informational content, logos and brand wordmarks, and text that is part of an
        inactive UI component (a disabled button, for instance) are all exempt from the contrast
        requirements under WCAG 2.1. The intent is to protect informational content, not purely
        decorative elements.
      </p>

      <h2>Color Pairs: Pass and Fail Examples</h2>
      <p>
        The contrast ratio of a color pair depends entirely on the relative luminance of the two
        colors — not on which color is "nicer" or which ones look similar to you. Here are representative
        examples across the pass/fail spectrum:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Text Color</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Background Color</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Contrast Ratio</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AA Normal</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>AAA Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#000000</code> (black)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><strong>21:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#1a1a2e</code> (dark navy)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><strong>18.1:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#595959</code> (dark gray)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><strong>7.0:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#767676</code> (medium gray)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><strong>4.54:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><code>#4f46e5</code> (indigo)</td>
              <td style={{padding: "12px 16px"}}><strong>5.9:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Pass</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#999999</code> (light gray)</td>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><strong>2.85:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><code>#FFFFFF</code> (white)</td>
              <td style={{padding: "12px 16px"}}><code>#ffdd00</code> (yellow)</td>
              <td style={{padding: "12px 16px"}}><strong>1.29:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
            </tr>
            <tr style={{background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><code>#0000ee</code> (blue link)</td>
              <td style={{padding: "12px 16px"}}><code>#6b21a8</code> (purple)</td>
              <td style={{padding: "12px 16px"}}><strong>1.7:1</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Fail</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Common Contrast Mistakes</h2>
      <p>
        The same errors appear repeatedly in accessibility audits across the web. Knowing them by name
        makes them easier to spot in your own work.
      </p>

      <h3>Light Gray Text on White</h3>
      <p>
        This is the single most common contrast failure on the modern web. Design trends toward
        minimalism have produced a generation of interfaces where body text, captions, metadata, and
        placeholder text are rendered in shades like <code>#aaaaaa</code>, <code>#bbbbbb</code>, or
        <code>#cccccc</code> on white backgrounds. These combinations typically produce contrast ratios
        between 1.5:1 and 2.5:1 — far below the 4.5:1 minimum. The designer can read it on a calibrated
        studio monitor in a dim room; the end user on a smartphone in afternoon sunlight cannot.
      </p>

      <h3>White Text on Colored Buttons</h3>
      <p>
        White text on yellow (<code>#ffdd00</code>), lime green (<code>#84cc16</code>), or light orange
        (<code>#fb923c</code>) backgrounds fails WCAG AA at any text size. These color combinations are
        visually striking but the contrast is too low. Dark text (black or very dark gray) on these bright
        backgrounds is the accessible solution — it usually achieves ratios above 10:1.
      </p>

      <h3>Placeholder Text in Form Fields</h3>
      <p>
        Browser default placeholder text — the hint text that appears in empty input fields before the
        user types — is typically rendered at around 40% opacity of the text color, or as a mid-gray like
        <code>#aaaaaa</code>. This almost universally fails WCAG AA. Placeholder text is subject to the
        same 4.5:1 contrast requirement as regular text because it conveys information about what to type.
      </p>

      <h3>Blue Links on Colored or Dark Backgrounds</h3>
      <p>
        The traditional blue hyperlink color (<code>#0000ee</code>) has excellent contrast on white (8.6:1)
        but falls apart on colored backgrounds. On a medium purple background, the same blue link achieves
        only about 1.7:1. Link colors need to be checked not just against the page background but against
        any colored section or card they appear within.
      </p>

      <h3>Disabled States and Focus Indicators</h3>
      <p>
        While WCAG 2.1 exempts disabled UI components from contrast requirements, focus indicators —
        the visible ring or outline that appears when a user tabs to a focusable element — must meet 3:1
        contrast against the adjacent colors under WCAG 2.2. Many sites suppress the browser default focus
        ring with <code>outline: none</code> and provide no replacement, which is an accessibility failure
        for keyboard-only users.
      </p>

      <h2>Techniques for Choosing Accessible Colors</h2>

      <h3>Start Dark on Light</h3>
      <p>
        The simplest default for text is near-black text on a white or very light gray background.
        Ratios above 10:1 are easy to achieve and give you enormous flexibility with font size and weight.
        Reserve light-on-dark color schemes (dark mode) for secondary surfaces and ensure you verify
        contrast in both themes.
      </p>

      <h3>Check All Interactive States</h3>
      <p>
        A button's default state might pass AA while its hover state — which lightens the background —
        falls below 4.5:1. Check the default, hover, focus, active, and disabled states separately. The
        disabled state is exempt from the requirement, but all others must pass.
      </p>

      <h3>The 60-30-10 Rule Applied Accessibly</h3>
      <p>
        The 60-30-10 color rule (60% dominant color, 30% secondary color, 10% accent) is useful for
        visual hierarchy. Applying it accessibly means: verify that text appearing on each of those three
        color zones meets the contrast threshold for that zone individually. The accent color at 10% is
        often the most problematic — bright accent colors paired with either white or dark text can
        fail at certain hue and saturation combinations.
      </p>

      <h3>Use the Color Contrast Checker Before Committing</h3>
      <p>
        The cheapest time to fix a contrast problem is before you code anything. When selecting colors
        in a design tool, check the intended text/background pairs immediately. Adjusting a color's
        lightness by 10–15% often brings a failing combination into compliance without significantly
        changing the visual character of the design.
      </p>

      <h2>Legal Requirements</h2>
      <p>
        WCAG compliance is not purely voluntary in many jurisdictions. Legal frameworks that reference
        WCAG AA include:
      </p>
      <ul>
        <li>
          <strong>United States — Americans with Disabilities Act (ADA):</strong> The ADA prohibits
          disability discrimination in places of public accommodation. Federal courts and the Department
          of Justice have interpreted this to cover commercial websites. Thousands of ADA accessibility
          lawsuits are filed in US federal courts annually, with color contrast violations frequently
          cited in demand letters.
        </li>
        <li>
          <strong>European Union — EN 301 549:</strong> The EU Web Accessibility Directive mandates WCAG
          2.1 Level AA compliance for public sector websites and mobile apps. EN 301 549 is the technical
          standard used for procurement. Private sector organizations in regulated industries face
          increasing requirements as well.
        </li>
        <li>
          <strong>Canada — AODA (Accessibility for Ontarians with Disabilities Act):</strong> Ontario
          mandates WCAG 2.0 Level AA compliance for private-sector organizations with 50 or more
          employees and for all public sector organizations.
        </li>
        <li>
          <strong>United Kingdom — Equality Act 2010:</strong> Service providers have a duty to make
          reasonable adjustments for disabled people, which the UK government interprets to include
          website accessibility.
        </li>
      </ul>
      <p>
        Beyond legal risk, many enterprise clients and government procurement processes now require WCAG
        AA conformance in vendor contracts. Accessibility compliance is increasingly a commercial
        requirement, not just an ethical one.
      </p>

      <div style={{background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: "12px", padding: "20px 24px", margin: "28px 0"}}>
        <p style={{marginTop: 0, marginBottom: "10px", fontWeight: 700, fontSize: "1rem", color: "#dc2626"}}>
          Key Requirement to Remember
        </p>
        <p style={{marginTop: 0, marginBottom: 0}}>
          WCAG 2.1 Level AA requires a <strong>4.5:1 contrast ratio for normal text</strong> and{" "}
          <strong>3:1 for large text</strong> (18pt+ or 14pt+ bold). UI component outlines and
          meaningful icons also require 3:1. Failing these thresholds means failing the most widely
          mandated accessibility standard on the web.
        </p>
      </div>

      <h2>Who Benefits Beyond Users with Disabilities</h2>
      <p>
        Accessible contrast is good design for everyone. Research in user experience consistently shows
        that high-contrast text is read faster and with fewer errors across all user groups. The
        populations who benefit most demonstrably include:
      </p>
      <ul>
        <li>People with color vision deficiency (red-green, blue-yellow, or monochromacy)</li>
        <li>Older adults, for whom contrast sensitivity decreases naturally with age</li>
        <li>People with low vision who do not use screen magnification</li>
        <li>Users in high ambient-light environments (outdoors, near windows)</li>
        <li>Users on low-quality, aging, or budget displays</li>
        <li>Anyone under cognitive load — when tired or distracted, high contrast reduces reading errors</li>
      </ul>

      <h2>How to Use the BrowseryTools Color Contrast Checker</h2>
      <p>
        The <a href="/tools/contrast-checker">BrowseryTools Color Contrast Checker</a> makes it trivial
        to verify any color combination against WCAG standards:
      </p>
      <ul>
        <li>
          <strong>Enter hex codes:</strong> Type or paste any valid hex color code (3 or 6 digits, with
          or without the <code>#</code> prefix) into the foreground and background fields.
        </li>
        <li>
          <strong>See the ratio immediately:</strong> The contrast ratio is calculated and displayed in
          real time as you type — no button to click.
        </li>
        <li>
          <strong>AA and AAA badges:</strong> Clear pass/fail badges are shown for Level AA normal text,
          Level AA large text, Level AAA normal text, and Level AAA large text — so you can see exactly
          which thresholds your pair meets.
        </li>
        <li>
          <strong>Live preview:</strong> The tool renders a sample of text on your chosen background so
          you can see the combination as it would appear to a user.
        </li>
        <li>
          <strong>Use the color picker:</strong> If you do not have a specific hex value in mind, the
          integrated color picker lets you select colors visually and instantly see how the ratio changes
          as you move through the color space.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Everything runs locally in your browser.</strong> The Color Contrast Checker performs
        all luminance calculations using JavaScript in your browser tab. No color values are transmitted
        to any server. There are no accounts, no history logs, and no third-party analytics involved in
        the calculation. Close the tab and everything is gone.
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Check any color combination against WCAG AA and AAA instantly
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          Enter two hex codes and see the contrast ratio, pass/fail status, and a live text preview.
          No sign-up required. Nothing is uploaded.
        </p>
        <a
          href="/tools/contrast-checker"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Open Color Contrast Checker →
        </a>
      </div>
    </div>
  );
}
