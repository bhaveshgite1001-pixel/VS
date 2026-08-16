import { EpfVsIndexInputs, EpfVsIndexResult, EpfYearData } from '../types/finance';

function calculateEpfCore(inputs: EpfVsIndexInputs) {
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

  const yearlyData: EpfYearData[] = [];

  for (let year = 1; year <= investmentHorizonYears; year++) {
    // ---- SCENARIO A: Statutory + VPF all in EPF ----
    const contribA = annualStatutory + annualVpf;
    const tfAddA = Math.min(contribA, 250000);
    const txAddA = Math.max(0, contribA - 250000);

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
    taxPaidOnEpf: taxPaidA,
    netWealthGapAtHorizon: gap,
    winner,
  };
}

export function calculateEpfVsIndex(inputs: EpfVsIndexInputs): EpfVsIndexResult {
  const base = calculateEpfCore(inputs);

  // Calculate Break-Even Index CAGR where B equals A
  let breakEvenIndexCagr: number | null = null;
  let low = 4;
  let high = 30;
  for (let i = 0; i < 25; i++) {
    const mid = (low + high) / 2;
    const testResult = calculateEpfCore({ ...inputs, indexFundExpectedCagr: mid });
    if (testResult.finalIndexCorpus >= testResult.finalEpfCorpus) {
      breakEvenIndexCagr = parseFloat(mid.toFixed(1));
      high = mid;
    } else {
      low = mid;
    }
  }

  // Build scenarios for 8%, 10%, 12%, 14%
  const scenarios = [8, 10, 12, 14].map((cagr) => {
    const res = calculateEpfCore({ ...inputs, indexFundExpectedCagr: cagr });
    const diff = Math.abs(res.finalEpfCorpus - res.finalIndexCorpus);
    return {
      cagr,
      differenceAmount: diff,
      winner: res.winner,
    };
  });

  return {
    ...base,
    sensitivity: {
      breakEvenIndexCagr,
      scenarios,
    },
  };
}
