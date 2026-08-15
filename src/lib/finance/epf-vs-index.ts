import { EpfVsIndexInputs, EpfVsIndexResult, EpfYearData } from '../types/finance';

export function calculateEpfVsIndex(inputs: EpfVsIndexInputs): EpfVsIndexResult {
  const {
    monthlyBasicSalary,
    vpfContributionPercent,
    taxBracketPercent,
    epfInterestRate,
    indexFundExpectedCagr,
    investmentHorizonYears,
  } = inputs;

  const annualBasic = monthlyBasicSalary * 12;
  const annualStatutory = annualBasic * (12 / 100);
  const annualVpf = annualBasic * (vpfContributionPercent / 100);
  
  const rEpf = epfInterestRate / 100;
  const rIndex = indexFundExpectedCagr / 100;
  const taxRate = taxBracketPercent / 100;

  // Scenario A (VPF into EPF)
  let aTaxFreeBucket = 0;
  let aTaxableBucket = 0;
  let taxPaidA = 0;

  // Scenario B (VPF into Index)
  let bTaxFreeBucket = 0;
  let bTaxableBucket = 0;
  let indexCorpusB = 0;
  let indexPrincipalB = 0;
  let taxPaidB = 0;

  const yearlyData: EpfYearData[] = [];

  for (let year = 1; year <= investmentHorizonYears; year++) {
    // ---- SCENARIO A: Statutory + VPF all in EPF ----
    const contribA = annualStatutory + annualVpf;
    const tfAddA = Math.min(contribA, 250000);
    const txAddA = Math.max(0, contribA - 250000);

    // Add contribs (simplified mid-year for interest)
    aTaxFreeBucket += tfAddA;
    aTaxableBucket += txAddA;

    const intTfA = aTaxFreeBucket * rEpf;
    const intTxA = aTaxableBucket * rEpf;
    const taxOnIntA = intTxA * taxRate;
    taxPaidA += taxOnIntA;

    aTaxFreeBucket += intTfA;
    aTaxableBucket += (intTxA - taxOnIntA);

    // ---- SCENARIO B: Statutory to EPF, VPF to Index ----
    const contribB = annualStatutory;
    const tfAddB = Math.min(contribB, 250000);
    const txAddB = Math.max(0, contribB - 250000);

    bTaxFreeBucket += tfAddB;
    bTaxableBucket += txAddB;

    const intTfB = bTaxFreeBucket * rEpf;
    const intTxB = bTaxableBucket * rEpf;
    const taxOnIntB = intTxB * taxRate;
    taxPaidB += taxOnIntB;

    bTaxFreeBucket += intTfB;
    bTaxableBucket += (intTxB - taxOnIntB);

    indexCorpusB = (indexCorpusB + annualVpf) * (1 + rIndex);
    indexPrincipalB += annualVpf;

    // Estimate B's net worth (post LTCG)
    const unrealizedGains = Math.max(0, indexCorpusB - indexPrincipalB);
    const ltcg = unrealizedGains * 0.125;
    const netIndexB = indexCorpusB - ltcg;

    const netA = aTaxFreeBucket + aTaxableBucket;
    const netB = bTaxFreeBucket + bTaxableBucket + netIndexB;

    yearlyData.push({
      year,
      epfCorpus: netA,
      indexCorpus: netB,
    });
  }

  const finalA = yearlyData[yearlyData.length - 1].epfCorpus;
  const finalB = yearlyData[yearlyData.length - 1].indexCorpus;
  const gap = finalA - finalB;

  let winner: 'epf' | 'index' | 'tie' = 'tie';
  if (Math.abs(gap) > 1000) {
    winner = gap > 0 ? 'epf' : 'index';
  }

  return {
    yearlyData,
    finalEpfCorpus: finalA,
    finalIndexCorpus: finalB,
    taxPaidOnEpf: taxPaidA, // Only returning the tax paid in Scenario A
    netWealthGapAtHorizon: gap,
    winner,
  };
}
