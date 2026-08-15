import { EmiVsUpfrontInputs, EmiVsUpfrontResult, EmiMonthData } from '../types/finance';

export function calculateEmiVsUpfront(inputs: EmiVsUpfrontInputs): EmiVsUpfrontResult {
  const {
    purchasePrice,
    upfrontDiscountAmount,
    emiTenureMonths,
    emiInterestRatePercent,
    processingFee,
    gstOnInterestPercent,
    investmentExpectedCagr,
  } = inputs;

  const rInv = investmentExpectedCagr / 100 / 12; // Monthly investment return
  const rEmi = emiInterestRatePercent / 100 / 12; // Monthly loan interest
  const gstRate = gstOnInterestPercent / 100;

  // SCENARIO A: Pay upfront
  // User starts with 'purchasePrice' in bank.
  // Pays (purchasePrice - discount). Remaining is invested.
  let upfrontCorpus = upfrontDiscountAmount; 

  // SCENARIO B: No-Cost EMI
  // User starts with 'purchasePrice' in bank.
  // Pays processing fee on day 1.
  let emiCorpus = purchasePrice - processingFee;

  // The EMI amount is strictly PurchasePrice / Tenure
  const emiAmount = purchasePrice / emiTenureMonths;

  // To find the interest component for GST, we need the implied loan principal.
  // P = EMI * [1 - (1+r)^-n] / r
  let impliedPrincipal = 0;
  if (rEmi > 0) {
    impliedPrincipal = emiAmount * (1 - Math.pow(1 + rEmi, -emiTenureMonths)) / rEmi;
  } else {
    impliedPrincipal = purchasePrice;
  }

  const monthlyData: EmiMonthData[] = [];
  
  // Day 0
  monthlyData.push({
    month: 0,
    upfrontNetWorth: upfrontCorpus,
    emiNetWorth: emiCorpus,
  });

  let totalHiddenCosts = processingFee;
  let currentLoanBalance = impliedPrincipal;

  for (let m = 1; m <= emiTenureMonths; m++) {
    // Upfront Scenario
    upfrontCorpus = upfrontCorpus * (1 + rInv);

    // EMI Scenario
    let interestComponent = 0;
    if (currentLoanBalance > 0 && rEmi > 0) {
      interestComponent = currentLoanBalance * rEmi;
      // Precision issue fix for last month
      if (m === emiTenureMonths) {
        interestComponent = (emiAmount * emiTenureMonths) - impliedPrincipal - (totalHiddenCosts - processingFee) * (1/gstRate);
        // Better: just calculate normally, the schedule balances out.
        interestComponent = currentLoanBalance * rEmi;
      }
    }
    
    const principalComponent = emiAmount - interestComponent;
    currentLoanBalance -= principalComponent;

    const gst = interestComponent * gstRate;
    totalHiddenCosts += gst;

    const totalOutflow = emiAmount + gst;

    // Corpus grows, then outflow is deducted (assuming end-of-month payments)
    emiCorpus = emiCorpus * (1 + rInv) - totalOutflow;

    monthlyData.push({
      month: m,
      upfrontNetWorth: upfrontCorpus,
      emiNetWorth: emiCorpus,
    });
  }

  const finalUpfront = monthlyData[monthlyData.length - 1].upfrontNetWorth;
  const finalEmi = monthlyData[monthlyData.length - 1].emiNetWorth;
  const gap = finalUpfront - finalEmi;

  let winner: 'upfront' | 'emi' | 'tie' = 'tie';
  if (Math.abs(gap) > 50) { // Small threshold for ties
    winner = gap > 0 ? 'upfront' : 'emi';
  }

  return {
    monthlyData,
    finalUpfrontNetWorth: finalUpfront,
    finalEmiNetWorth: finalEmi,
    totalHiddenCosts,
    netWealthGapAtEnd: gap,
    winner,
  };
}
