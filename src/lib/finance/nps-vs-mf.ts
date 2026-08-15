import { NpsVsMfInputs, NpsVsMfResult, NpsYearData } from '../types/finance';

export function calculateNpsVsMf(inputs: NpsVsMfInputs): NpsVsMfResult {
  const {
    basicSalary,
    employerMatchPercent,
    taxBracketPercent,
    npsExpectedCagr,
    mfExpectedCagr,
    investmentHorizonYears,
  } = inputs;

  const annualMatch = basicSalary * (employerMatchPercent / 100);
  const taxSaved = annualMatch * (taxBracketPercent / 100);
  const mfInvestmentIfNoNps = annualMatch - taxSaved;

  const rNps = npsExpectedCagr / 100;
  const rMf = mfExpectedCagr / 100;

  let npsCorpus = 0;
  let sideMfCorpus = 0; // MF built from tax savings
  let pureMfCorpus = 0; // MF built from skipping NPS

  let pureMfPrincipal = 0;
  let sideMfPrincipal = 0;

  const yearlyData: NpsYearData[] = [];
  let totalTaxSaved = 0;

  for (let year = 1; year <= investmentHorizonYears; year++) {
    // Option A: NPS + Tax Savings Invested
    npsCorpus = (npsCorpus + annualMatch) * (1 + rNps);
    sideMfCorpus = (sideMfCorpus + taxSaved) * (1 + rMf);
    sideMfPrincipal += taxSaved;
    totalTaxSaved += taxSaved;

    // Option B: Pure MF (Skipping NPS)
    pureMfCorpus = (pureMfCorpus + mfInvestmentIfNoNps) * (1 + rMf);
    pureMfPrincipal += mfInvestmentIfNoNps;

    // We apply LTCG of 12.5% on MF for the net worth estimation
    const sideMfTax = Math.max(0, sideMfCorpus - sideMfPrincipal) * 0.125;
    const pureMfTax = Math.max(0, pureMfCorpus - pureMfPrincipal) * 0.125;

    const netOptionA = npsCorpus + (sideMfCorpus - sideMfTax);
    const netOptionB = pureMfCorpus - pureMfTax;

    yearlyData.push({
      year,
      npsCorpus: netOptionA,
      mfCorpus: netOptionB,
      totalTaxSaved,
    });
  }

  const finalOptionA = yearlyData[yearlyData.length - 1].npsCorpus;
  const finalOptionB = yearlyData[yearlyData.length - 1].mfCorpus;
  const netWealthGapAtHorizon = finalOptionA - finalOptionB;

  let winner: 'nps' | 'mf' | 'tie' = 'tie';
  if (Math.abs(netWealthGapAtHorizon) > 1000) {
    winner = netWealthGapAtHorizon > 0 ? 'nps' : 'mf';
  }

  // Binary search for Break-even MF Return Rate
  const findBreakEvenMfReturn = (): number | null => {
    let low = 0;
    let high = 35;

    const calcGapAtMfCagr = (cagr: number) => {
      const res = calculateNpsVsMfInternal({ ...inputs, mfExpectedCagr: cagr });
      return res.finalOptionA - res.finalOptionB;
    };

    const lowGap = calcGapAtMfCagr(low);
    const highGap = calcGapAtMfCagr(high);

    if ((lowGap >= 0 && highGap >= 0) || (lowGap <= 0 && highGap <= 0)) {
      return null;
    }

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const gap = calcGapAtMfCagr(mid);
      if (Math.abs(gap) < 1000) {
        return Math.round(mid * 10) / 10;
      }
      if (gap > 0) {
        low = mid; // NPS wins, need higher MF return to match
      } else {
        high = mid; // MF wins, need lower MF return to tie
      }
    }
    return Math.round(((low + high) / 2) * 10) / 10;
  };

  // Binary search for Minimum Tax Bracket for NPS to win
  const findBreakEvenTaxBracket = (): number | null => {
    let low = 0;
    let high = 40;

    const calcGapAtTax = (tax: number) => {
      const res = calculateNpsVsMfInternal({ ...inputs, taxBracketPercent: tax });
      return res.finalOptionA - res.finalOptionB;
    };

    const lowGap = calcGapAtTax(low);
    const highGap = calcGapAtTax(high);

    if ((lowGap >= 0 && highGap >= 0) || (lowGap <= 0 && highGap <= 0)) {
      return null;
    }

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const gap = calcGapAtTax(mid);
      if (Math.abs(gap) < 1000) {
        return Math.round(mid * 10) / 10;
      }
      if (gap > 0) {
        high = mid; // NPS wins, lower tax bracket could tie
      } else {
        low = mid; // MF wins, higher tax bracket needed for NPS tax savings to overcome return gap
      }
    }
    return Math.round(((low + high) / 2) * 10) / 10;
  };

  return {
    yearlyData,
    finalNpsCorpus: finalOptionA,
    finalMfCorpus: finalOptionB,
    annualEmployerContribution: annualMatch,
    annualTaxSaved: taxSaved,
    totalTaxSaved,
    netWealthGapAtHorizon,
    winner,
    sensitivity: {
      breakEvenMfReturn: findBreakEvenMfReturn(),
      breakEvenTaxBracket: findBreakEvenTaxBracket(),
    }
  };
}

// Internal simulation helper to avoid recursion
function calculateNpsVsMfInternal(inputs: NpsVsMfInputs) {
  const { basicSalary, employerMatchPercent, taxBracketPercent, npsExpectedCagr, mfExpectedCagr, investmentHorizonYears } = inputs;
  const annualMatch = basicSalary * (employerMatchPercent / 100);
  const taxSaved = annualMatch * (taxBracketPercent / 100);
  const mfInvestmentIfNoNps = annualMatch - taxSaved;

  const rNps = npsExpectedCagr / 100;
  const rMf = mfExpectedCagr / 100;

  let npsCorpus = 0;
  let sideMfCorpus = 0;
  let pureMfCorpus = 0;
  let pureMfPrincipal = 0;
  let sideMfPrincipal = 0;

  for (let year = 1; year <= investmentHorizonYears; year++) {
    npsCorpus = (npsCorpus + annualMatch) * (1 + rNps);
    sideMfCorpus = (sideMfCorpus + taxSaved) * (1 + rMf);
    sideMfPrincipal += taxSaved;

    pureMfCorpus = (pureMfCorpus + mfInvestmentIfNoNps) * (1 + rMf);
    pureMfPrincipal += mfInvestmentIfNoNps;
  }

  const sideMfTax = Math.max(0, sideMfCorpus - sideMfPrincipal) * 0.125;
  const pureMfTax = Math.max(0, pureMfCorpus - pureMfPrincipal) * 0.125;

  const finalOptionA = npsCorpus + (sideMfCorpus - sideMfTax);
  const finalOptionB = pureMfCorpus - pureMfTax;

  return { finalOptionA, finalOptionB };
}
