export default function Content() {
  return (
    <div>
      <p>
        Most people borrow significant amounts of money at some point in their lives — a mortgage,
        a car loan, a student loan, a personal loan for home improvements. Yet most people have
        only a vague understanding of how those loans actually work. They know their monthly payment
        and the rough interest rate, and that is usually it. The details — how much of each payment
        is actually paying down the principal, how much interest they will pay in total, what happens
        if they make extra payments — remain opaque.
      </p>
      <p>
        This guide explains the mechanics of loan repayment clearly, including the actual math behind
        monthly payments, what amortization means and why it matters, the important difference between
        APR and interest rate, and how to compare loan offers intelligently.
      </p>
      <p>
        You can use the{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> — free, no sign-up,
        everything stays in your browser.
      </p>

      <h2>The Loan Payment Formula</h2>
      <p>
        The monthly payment on a fixed-rate loan is calculated using a formula that accounts for
        the principal (the amount borrowed), the interest rate, and the loan term:
      </p>
      <p style={{fontStyle: "italic", paddingLeft: "1.5rem", borderLeft: "3px solid rgba(99,102,241,0.4)", margin: "1rem 0", fontFamily: "monospace"}}>
        M = P × [r(1+r)^n] / [(1+r)^n - 1]
      </p>
      <p>
        Where:
      </p>
      <ul>
        <li><strong>M</strong> is the monthly payment</li>
        <li><strong>P</strong> is the principal (the loan amount)</li>
        <li><strong>r</strong> is the monthly interest rate (annual rate divided by 12)</li>
        <li><strong>n</strong> is the number of payments (loan term in months)</li>
      </ul>
      <p>
        As a concrete example: a $20,000 car loan at 6% annual interest over 48 months has a
        monthly interest rate of 0.5% (6% / 12). Plugging in: M = 20,000 × [0.005 × (1.005)^48]
        / [(1.005)^48 - 1] = approximately $470 per month. Over 48 months, you pay $22,560 in
        total, meaning $2,560 in interest on top of the $20,000 principal.
      </p>
      <p>
        You do not need to calculate this by hand. The{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> handles the formula
        instantly — but understanding what the formula does helps you interpret the results
        intelligently.
      </p>

      <h2>What Principal, Interest Rate, and Term Actually Mean</h2>
      <p>
        These three variables are the complete description of any fixed-rate loan, and they
        interact in ways that are not always intuitive:
      </p>
      <ul>
        <li>
          <strong>Principal</strong> is the amount you borrow. This is the starting balance that
          the interest accrues on. The larger the principal, the more interest you pay at any given
          rate and term — proportionally.
        </li>
        <li>
          <strong>Interest rate</strong> is the annual cost of borrowing, expressed as a percentage
          of the outstanding principal. A 1% difference in interest rate sounds small but compounds
          significantly over a long term. On a 30-year $400,000 mortgage, the difference between
          6% and 7% is roughly $85,000 in total interest paid.
        </li>
        <li>
          <strong>Term</strong> is how long you have to repay the loan, expressed in months or
          years. A longer term lowers the monthly payment but dramatically increases total interest
          paid. A shorter term increases the monthly payment but gets you out of debt faster and
          saves a substantial amount in interest.
        </li>
      </ul>

      <h2>Amortization: Why Early Payments Are Mostly Interest</h2>
      <p>
        Amortization is the process of paying off a debt through regular scheduled payments.
        On a standard amortizing loan, each monthly payment covers two things: the interest that
        has accrued on the outstanding balance, and a portion of the principal.
      </p>
      <p>
        The key insight — which surprises most people — is that in the early years of a loan,
        the vast majority of each payment goes toward interest rather than principal reduction.
        This is because interest is calculated on the outstanding balance, which is at its highest
        at the start of the loan.
      </p>
      <p>
        Consider a 30-year $300,000 mortgage at 7%. The monthly payment is approximately $1,996.
        In the very first month, about $1,750 of that payment is interest and only $246 is
        principal. After one year of payments — $23,952 paid — your loan balance has only decreased
        by roughly $3,000. By year 15, the split flips: more of each payment goes to principal
        than to interest. By the final years, nearly the entire payment is principal.
      </p>
      <p>
        This is why extra payments made early in a loan are so powerful — each extra dollar of
        principal paid reduces the balance that future interest is calculated on, creating a
        compounding effect that eliminates months or years of payments.
      </p>

      <h2>APR vs. Interest Rate: The Difference That Costs You Thousands</h2>
      <p>
        The interest rate and the Annual Percentage Rate (APR) are related but not the same, and
        confusing them is one of the most common mistakes people make when comparing loans.
      </p>
      <ul>
        <li>
          <strong>Interest rate</strong> is the cost of borrowing the principal only, expressed
          as a percentage. It determines your monthly payment amount.
        </li>
        <li>
          <strong>APR</strong> includes the interest rate plus all fees associated with the loan —
          origination fees, broker fees, discount points, mortgage insurance, and other costs.
          APR represents the true total cost of borrowing over the life of the loan.
        </li>
      </ul>
      <p>
        A loan with a 6.5% interest rate and $5,000 in fees might have an APR of 6.9%. A competing
        loan with a 6.75% interest rate and no fees might have an APR of 6.75%. The first loan has
        a lower interest rate but a higher true cost — especially if you pay off or refinance the
        loan before term (which many people do). APR is what you should compare when shopping
        loans, not the advertised interest rate.
      </p>
      <p>
        In the US, lenders are legally required to disclose APR. In the UK, representative APR
        is the standard comparison metric. When a lender advertises a conspicuously low interest
        rate, look immediately at the APR — the gap between the two often reveals where the
        fees are hidden.
      </p>

      <h2>How Extra Payments Affect Total Interest</h2>
      <p>
        Making extra payments — even modest ones — against a loan principal has a disproportionate
        effect on total interest paid. Because each extra payment reduces the principal, all future
        interest calculations are against a lower balance. The savings compound over time.
      </p>
      <p>
        On a 30-year $300,000 mortgage at 7%, making one extra $200 payment per month reduces
        the loan term by approximately 5 years and saves roughly $80,000 in interest. That $200
        per month — $2,400 per year — returns about $80,000 in savings. Almost no investment
        reliably returns that kind of guaranteed, risk-free gain.
      </p>
      <p>
        The important nuance: before making extra payments, make sure your loan has no prepayment
        penalty (most modern loans do not, but some older loans do), and confirm that the extra
        payment is being applied to principal rather than a future payment — some lenders default
        to crediting extra payments as early future installments, which does not have the same
        interest-saving effect.
      </p>

      <h2>Comparing Loan Offers: Don't Just Look at the Monthly Payment</h2>
      <p>
        Lenders know that monthly payment is the number most borrowers fixate on, and they
        structure their offers accordingly. A lower monthly payment sounds appealing but can mask
        a much higher total cost if it is achieved through a longer term or higher fees.
      </p>
      <p>
        When comparing loan offers, always calculate and compare:
      </p>
      <ul>
        <li><strong>Total interest paid</strong> over the full life of the loan</li>
        <li><strong>APR</strong> — the true all-in cost including fees</li>
        <li><strong>Total amount repaid</strong> (principal + all interest + all fees)</li>
        <li><strong>Prepayment penalty</strong> — whether there is a cost for paying off early</li>
        <li><strong>Fixed vs. variable rate</strong> — variable rate loans may start lower but carry interest rate risk</li>
      </ul>
      <p>
        Two lenders might offer the same principal at the same interest rate but with very different
        fee structures. A loan with $3,000 in origination fees versus one with $0 in fees and a
        slightly higher rate — the right choice depends on how long you plan to keep the loan.
        For short holding periods, lower fees beat lower rates. For long terms, lower rates win.
      </p>

      <h2>The Hidden Cost of Extending Loan Terms</h2>
      <p>
        When monthly payments become stressful, the common response is to refinance into a longer
        term. This works to reduce the monthly payment, but the cost is substantial.
      </p>
      <p>
        Extending a remaining 20-year mortgage back to 30 years to lower monthly payments by
        $200 can cost tens of thousands of dollars in additional interest while adding a decade
        of debt. This can be the right choice in a genuine financial hardship — but it should
        be made with eyes open to the total cost, not just the monthly relief.
      </p>
      <p>
        Run the numbers before refinancing. The{" "}
        <a href="/tools/loan-calculator">BrowseryTools Loan Calculator</a> lets you compare
        scenarios side by side — adjust the term and see the exact impact on total interest paid
        before making any decisions.
      </p>

      <div style={{background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", padding: "20px 24px", margin: "32px 0", textAlign: "center" as const}}>
        <p style={{marginTop: 0, marginBottom: "16px", fontWeight: 600, fontSize: "1.05rem"}}>
          Free Loan Calculator — Instant Amortization, No Account Needed
        </p>
        <p style={{marginTop: 0, marginBottom: "20px", fontSize: "0.95rem"}}>
          Calculate monthly payments, total interest, and full amortization schedules for any
          loan. Compare scenarios and understand your debt.
        </p>
        <a
          href="/tools/loan-calculator"
          style={{background: "rgba(59,130,246,0.9)", color: "white", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem"}}
        >
          Open Loan Calculator →
        </a>
      </div>
    </div>
  );
}
