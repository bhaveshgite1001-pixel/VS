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

  return {
    yearlyData,
    finalNpsCorpus: finalOptionA,
    finalMfCorpus: finalOptionB,
    totalTaxSaved,
    netWealthGapAtHorizon,
    winner,
  };
}
