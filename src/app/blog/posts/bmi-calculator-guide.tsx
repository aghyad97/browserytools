export default function Content() {
  return (
    <div>
      <p>
        Body Mass Index — BMI — is one of the most widely used numbers in preventive medicine. Doctors
        mention it at checkups. Insurance forms ask for it. Fitness apps compute it automatically. And yet
        most people who know their BMI number have only a vague sense of what it actually measures, how it
        is calculated, and — critically — what it cannot tell you. This guide covers all of it: the formula,
        the categories, the history, the genuine limitations, and how to use the{" "}
        <a href="/tools/bmi-calculator">BrowseryTools BMI Calculator</a> to get your result instantly and
        privately in your browser.
      </p>

      <h2>What Is BMI?</h2>
      <p>
        BMI is a simple ratio of weight to height squared. It was devised in the 1830s by the Belgian
        mathematician and statistician Adolphe Quetelet, who was studying the characteristics of an
        "average man" across large populations. Quetelet was not a physician and never intended his index
        to be used as an individual health diagnostic — it was a tool for studying population-level
        patterns. The formula he developed was later adopted by the medical community in the twentieth
        century because it offered something rare in clinical settings: a fast, free, non-invasive way to
        screen large numbers of people for potential weight-related health risk.
      </p>
      <p>
        The index became entrenched in the 1970s after physiologist Ancel Keys reviewed several competing
        weight-for-height indices and concluded that Quetelet's original formula correlated most reliably
        with body fat percentage in population studies. Keys coined the term "Body Mass Index" at that
        point. Since then it has been the default screening metric for overweight and obesity in clinical
        and public health contexts worldwide.
      </p>

      <h2>The BMI Formula</h2>
      <p>
        The formula is straightforward. In metric units:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = weight (kg) ÷ height² (m²)
      </pre>
      <p>
        In imperial units, a conversion factor is required because pounds and inches do not share the same
        mathematical relationship as kilograms and metres:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
        BMI = 703 × weight (lbs) ÷ height² (inches²)
      </pre>
      <p>
        The constant 703 is derived from the unit conversion between the metric and imperial systems
        (specifically, 1 kg/m² ≈ 703 × lb/in²). Both formulas produce exactly the same dimensionless
        number for the same person.
      </p>

      <h2>A Concrete Example</h2>
      <p>
        Consider a person who weighs 70 kg and is 1.75 m tall. Their BMI is:
      </p>
      <pre style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`BMI = 70 ÷ (1.75²)
    = 70 ÷ 3.0625
    = 22.9`}
      </pre>
      <p>
        A result of 22.9 falls squarely in the Normal weight range (18.5–24.9). In imperial terms, a person
        who is 5 ft 9 in (69 inches) and weighs 154 lbs would get: 703 × 154 ÷ 69² = 108,262 ÷ 4,761 ≈
        22.7 — essentially the same number, as expected.
      </p>

      <h2>BMI Categories</h2>
      <p>
        The World Health Organization (WHO) defines the following standard BMI classifications for adults
        aged 18 and over:
      </p>
      <div style={{overflowX: "auto", margin: "24px 0"}}>
        <table style={{width: "100%", borderCollapse: "collapse", fontSize: "0.9rem"}}>
          <thead>
            <tr style={{background: "rgba(99,102,241,0.12)"}}>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Category</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>BMI Range</th>
              <th style={{padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(99,102,241,0.3)"}}>Associated Health Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#2563eb"}}>Underweight</strong></td>
              <td style={{padding: "12px 16px"}}>Below 18.5</td>
              <td style={{padding: "12px 16px"}}>Malnutrition, osteoporosis, anemia, immune suppression</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#16a34a"}}>Normal weight</strong></td>
              <td style={{padding: "12px 16px"}}>18.5 – 24.9</td>
              <td style={{padding: "12px 16px"}}>Lowest risk in the BMI-based framework</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#d97706"}}>Overweight</strong></td>
              <td style={{padding: "12px 16px"}}>25 – 29.9</td>
              <td style={{padding: "12px 16px"}}>Elevated risk of type 2 diabetes, hypertension, cardiovascular disease</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,0,0,0.02)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#dc2626"}}>Obese Class I</strong></td>
              <td style={{padding: "12px 16px"}}>30 – 34.9</td>
              <td style={{padding: "12px 16px"}}>Moderate risk; metabolic syndrome, sleep apnea</td>
            </tr>
            <tr style={{borderBottom: "1px solid rgba(0,0,0,0.07)"}}>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#b91c1c"}}>Obese Class II</strong></td>
              <td style={{padding: "12px 16px"}}>35 – 39.9</td>
              <td style={{padding: "12px 16px"}}>High risk; increased surgical risk, joint disease</td>
            </tr>
            <tr>
              <td style={{padding: "12px 16px"}}><strong style={{color: "#7f1d1d"}}>Obese Class III (Severe)</strong></td>
              <td style={{padding: "12px 16px"}}>40 and above</td>
              <td style={{padding: "12px 16px"}}>Very high risk; significantly reduced life expectancy</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These thresholds are used for adults only. Children and teenagers are assessed against age- and
        sex-specific growth charts, where BMI percentile — not a fixed number — determines the category.
      </p>

      <h2>What BMI Does Not Measure</h2>
      <p>
        This is where BMI becomes genuinely complicated. The formula is so simple that it inevitably
        misses important aspects of body composition. Understanding these limitations is not just academic
        — they directly affect how you should interpret your own number.
      </p>

      <h3>Muscle Mass</h3>
      <p>
        BMI measures total body weight relative to height. It cannot distinguish between lean muscle
        tissue and adipose (fat) tissue. A professional athlete or competitive bodybuilder who carries
        substantial muscle will often register as Overweight or even Obese by BMI, despite having very
        low body fat. Conversely, a sedentary person with low muscle mass and high body fat —
        sometimes called "skinny fat" or having normal-weight obesity — can have a perfectly Normal BMI
        while carrying metabolically harmful levels of fat. This is arguably the most significant
        flaw in routine BMI use.
      </p>

      <h3>Age</h3>
      <p>
        As people age, muscle mass typically decreases and is replaced by fat tissue even when body
        weight stays constant — a process called sarcopenic obesity. An older adult with a Normal BMI
        of 23 may actually carry a higher proportion of body fat than a younger person with the same
        number. Some geriatric researchers argue that slightly higher BMI ranges (up to 27 or even 28)
        may be protective in older adults, since low body weight in the elderly is associated with
        frailty and increased mortality.
      </p>

      <h3>Sex</h3>
      <p>
        Women naturally carry a higher percentage of body fat than men at the same BMI. On average,
        women have about 10–12 percentage points more body fat than men with identical BMI scores.
        This is physiologically normal — it is related to hormonal function and reproductive biology —
        but it means the same BMI number represents meaningfully different body compositions depending
        on biological sex.
      </p>

      <h3>Ethnicity</h3>
      <p>
        Population research has consistently shown that people of Asian descent have higher risk of
        cardiometabolic conditions (type 2 diabetes, hypertension, cardiovascular disease) at lower BMI
        values compared to populations of European descent. The WHO Expert Consultation on BMI in Asian
        populations recommended that the action thresholds for Asian adults be lowered — with overweight
        beginning at BMI 23 and obesity at BMI 27.5 — to better reflect actual health risk in these
        populations. Standard WHO categories were developed primarily from data on European populations
        and do not translate cleanly across all ethnic groups.
      </p>

      <h3>Fat Distribution</h3>
      <p>
        Where fat is stored on the body matters enormously — arguably more than total fat mass. Visceral
        fat, which accumulates around the abdominal organs (liver, pancreas, intestines), is metabolically
        active and strongly associated with insulin resistance, inflammation, and cardiovascular disease.
        Subcutaneous fat, stored beneath the skin especially in the hips and thighs, is less harmful and
        may even be somewhat protective. BMI captures neither of these distinctions. Two people with
        identical BMI scores can have radically different health profiles depending on where their fat
        is stored.
      </p>

      <h2>Why BMI Became the Standard Anyway</h2>
      <p>
        Given these well-documented limitations, it is reasonable to ask why BMI has remained so dominant
        in clinical practice. The answer is practical: it requires only a scale and a measuring tape.
        Computing it takes about ten seconds. It is free, reproducible, and universally understood. More
        sophisticated methods of body composition analysis — DEXA scans, hydrostatic weighing, air
        displacement plethysmography (Bod Pod), MRI-based fat quantification — are accurate but expensive,
        time-consuming, and unavailable in most routine clinical settings.
      </p>
      <p>
        BMI serves a specific purpose well: it is a cheap population-level screening tool that can
        quickly flag people who may warrant further investigation. It was never designed to be a
        diagnostic tool for individuals, and most researchers and physicians who work with it understand
        this distinction. The problem arises when it is used as if it were more definitive than it is.
      </p>

      <h2>Complementary Measurements</h2>
      <p>
        If you want a more complete picture of your body composition and health risk, consider these
        measurements alongside BMI:
      </p>
      <ul>
        <li>
          <strong>Waist circumference:</strong> Measured at the narrowest point of the torso (or at the
          navel). High-risk thresholds are generally 94 cm (37 in) for men and 80 cm (31.5 in) for women,
          with very high risk above 102 cm (40 in) for men and 88 cm (34.5 in) for women. This directly
          captures central adiposity — abdominal fat — which BMI cannot.
        </li>
        <li>
          <strong>Waist-to-hip ratio (WHR):</strong> Waist circumference divided by hip circumference.
          A WHR above 0.90 for men or 0.85 for women indicates abdominal obesity per WHO guidelines.
        </li>
        <li>
          <strong>Waist-to-height ratio (WHtR):</strong> Waist circumference divided by height. A ratio
          below 0.5 is generally considered healthy across most populations and ages, making it one of
          the simplest single-number indicators of central fat.
        </li>
        <li>
          <strong>Body fat percentage:</strong> Direct measurement of the fraction of your weight that is
          fat. Healthy ranges are approximately 10–20% for men and 18–28% for women, though optimal ranges
          vary by age. Body fat percentage requires more specialized measurement methods.
        </li>
      </ul>

      <h2>Healthy Weight Range for Your Height</h2>
      <p>
        The BMI formula can be rearranged to calculate what weights would give you a BMI in the Normal
        range (18.5–24.9). To find your healthy weight range, multiply your height in metres squared by
        18.5 and 24.9:
      </p>
      <pre style={{background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", padding: "16px 20px", fontSize: "0.95rem", overflowX: "auto"}}>
{`Healthy weight range = 18.5 × height² to 24.9 × height²

For 1.75 m:
Lower bound = 18.5 × 3.0625 = 56.7 kg
Upper bound = 24.9 × 3.0625 = 76.3 kg`}
      </pre>
      <p>
        So for a person 1.75 m tall, a Normal BMI corresponds to a body weight between approximately
        56.7 kg and 76.3 kg — a range of nearly 20 kg. The <a href="/tools/bmi-calculator">BrowseryTools
        BMI Calculator</a> displays this healthy range automatically below your result, so you can see
        exactly where you stand relative to the Normal category for your specific height.
      </p>

      <h2>Health Risks Associated With Each Category</h2>
      <p>
        While BMI is imperfect, it does correlate with meaningful health outcomes at the population level.
        Being significantly underweight is associated with malnutrition, weakened immune function, bone
        density loss, and cardiovascular complications. At the other end of the scale, sustained
        overweight and obesity increase the statistical risk of:
      </p>
      <ul>
        <li>Type 2 diabetes (risk begins rising above BMI 25 and accelerates above 30)</li>
        <li>Hypertension and cardiovascular disease</li>
        <li>Certain cancers, including colorectal, breast, endometrial, and kidney cancers</li>
        <li>Obstructive sleep apnea</li>
        <li>Non-alcoholic fatty liver disease (NAFLD)</li>
        <li>Osteoarthritis of weight-bearing joints</li>
        <li>Increased surgical and anesthetic risk</li>
      </ul>
      <p>
        These are statistical associations across populations, not individual predictions. A BMI of 28 does
        not mean you will develop any of these conditions — it means that in large study populations,
        people with that BMI have had elevated rates of these outcomes compared to people in the Normal
        range.
      </p>

      <h2>How to Use the BrowseryTools BMI Calculator</h2>
      <p>
        The <a href="/tools/bmi-calculator">BrowseryTools BMI Calculator</a> is designed to give you
        an instant, clear result with useful context:
      </p>
      <ul>
        <li>
          <strong>Metric or imperial:</strong> Toggle between kg/cm and lbs/inches. The calculator
          converts automatically — you never need to think about unit conversions.
        </li>
        <li>
          <strong>Instant results:</strong> Your BMI is displayed the moment you enter your height and
          weight. No button to click, no loading.
        </li>
        <li>
          <strong>Category display:</strong> The result shows not just the number but the WHO category it
          falls into — Underweight, Normal, Overweight, or Obese — with color coding for clarity.
        </li>
        <li>
          <strong>Healthy weight range:</strong> For your entered height, the tool displays the range of
          body weights that correspond to a Normal BMI (18.5–24.9) in your selected unit system.
        </li>
      </ul>

      <div style={{background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "16px 20px", margin: "28px 0"}}>
        <strong>Your data never leaves your device.</strong> The BMI Calculator runs entirely in your
        browser. The height and weight values you enter are used only for the on-screen calculation and
        are never transmitted to BrowseryTools servers, stored in any database, or shared with any
        third party. Nothing is logged. Closing the tab discards everything.
      </div>

      <div style={{background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.5)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0"}}>
        <p style={{marginTop: 0, marginBottom: "8px", fontWeight: 700, fontSize: "1rem", color: "#92400e"}}>
          Medical Disclaimer
        </p>
        <p style={{marginTop: 0, marginBottom: 0, fontSize: "0.95rem"}}>
          The BrowseryTools BMI Calculator is an informational tool only. BMI is a screening metric, not
          a diagnostic measure. The result it provides is not medical advice and should not be used to
          make decisions about your health, diet, or treatment without consulting a qualified healthcare
          professional. If you have concerns about your weight, body composition, or related health
          conditions, please speak with your doctor or a registered dietitian.
        </p>
      </div>

      <div style={{background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "12px", fontWeight: 600, fontSize: "1.05rem"}}>
          Calculate your BMI instantly — metric or imperial
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", color: "#6b7280", fontSize: "0.95rem"}}>
          See your category, your healthy weight range, and what the number actually means.
          No account needed. Nothing is uploaded or stored.
        </p>
        <a
          href="/tools/bmi-calculator"
          style={{background: "rgba(99,102,241,0.9)", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem"}}
        >
          Open BMI Calculator →
        </a>
      </div>
    </div>
  );
}
