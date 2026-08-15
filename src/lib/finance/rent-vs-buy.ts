import { RentVsBuyInputs, RentVsBuyResult, YearData } from '../types/finance';

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResult {
  const {
    propertyValue,
    downPaymentPercent,
    stampDutyPercent,
    loanInterestRate,
    loanTenureYears,
    propertyAppreciationRate,
    propertyMaintenancePercent,
    currentMonthlyRent,
    rentEscalationRate,
    equityCagr,
    comparisonHorizonYears
  } = inputs;

  // Initial calculations
  const downPayment = propertyValue * (downPaymentPercent / 100);
  const stampDuty = propertyValue * (stampDutyPercent / 100);
  const loanPrincipal = propertyValue - downPayment;
  
  const monthlyLoanRate = loanInterestRate / 100 / 12;
  const totalLoanMonths = loanTenureYears * 12;
  
  // EMI Calculation
  const emi = loanPrincipal > 0 && monthlyLoanRate > 0
    ? loanPrincipal * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalLoanMonths) / (Math.pow(1 + monthlyLoanRate, totalLoanMonths) - 1)
    : 0;

  // Monthly Equity Rate
  const monthlyEquityRate = Math.pow(1 + equityCagr / 100, 1 / 12) - 1;

  let currentLoanBalance = loanPrincipal;
  let currentPropertyValue = propertyValue;
  
  let currentRenterPortfolio = downPayment + stampDuty; // Renter invests the upfront cost
  let currentRent = currentMonthlyRent;
  
  let totalInterestPaid = 0;
  let totalRentPaid = 0;
  
  const yearlyData: YearData[] = [];
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= comparisonHorizonYears; year++) {
    const monthlyMaintenance = (currentPropertyValue * (propertyMaintenancePercent / 100)) / 12;
    
    // Monthly Simulation for current year
    for (let month = 1; month <= 12; month++) {
      // Buyer
      if (currentLoanBalance > 0) {
        const interestPayment = currentLoanBalance * monthlyLoanRate;
        const principalPayment = emi - interestPayment;
        currentLoanBalance -= principalPayment;
        if (currentLoanBalance < 0) currentLoanBalance = 0;
        totalInterestPaid += interestPayment;
      }
      
      // Renter
      totalRentPaid += currentRent;
      const cashFlowDiff = (emi + monthlyMaintenance) - currentRent;
      
      // Compound portfolio
      currentRenterPortfolio = currentRenterPortfolio * (1 + monthlyEquityRate) + cashFlowDiff;
    }
    
    // Year-end updates
    currentPropertyValue *= (1 + propertyAppreciationRate / 100);
    const buyerNetWorth = currentPropertyValue - currentLoanBalance;
    const renterNetWorth = currentRenterPortfolio;
    const difference = buyerNetWorth - renterNetWorth;
    
    yearlyData.push({
      year,
      buyerNetWorth,
      renterNetWorth,
      difference,
      buyerPropertyVal: currentPropertyValue,
      buyerLoanBalance: currentLoanBalance,
      renterPortfolio: currentRenterPortfolio,
    });

    if (breakEvenYear === null && difference > 0) {
      breakEvenYear = year;
    }
    
    // Escalations
    currentRent *= (1 + rentEscalationRate / 100);
  }

  const finalYearData = yearlyData[yearlyData.length - 1];
  const netWealthGapAtHorizon = finalYearData.difference;
  
  let winner: 'buyer' | 'renter' | 'tie' = 'tie';
  if (netWealthGapAtHorizon > 0) winner = 'buyer';
  else if (netWealthGapAtHorizon < 0) winner = 'renter';

  // Binary search for break-even Property Appreciation Rate
  const findBreakEvenAppreciation = (): number | null => {
    let low = -5;
    let high = 35;
    let result: number | null = null;

    const calcGapAtAppreciation = (rate: number) => {
      const simResult = calculateRentVsBuyInternal({ ...inputs, propertyAppreciationRate: rate });
      return simResult.netWealthGapAtHorizon;
    };

    const lowGap = calcGapAtAppreciation(low);
    const highGap = calcGapAtAppreciation(high);

    if ((lowGap >= 0 && highGap >= 0) || (lowGap <= 0 && highGap <= 0)) {
      return null; // No crossover in reasonable range
    }

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const gap = calcGapAtAppreciation(mid);
      if (Math.abs(gap) < 1000) {
        return Math.round(mid * 10) / 10;
      }
      if (gap > 0) {
        high = mid; // Buying wins, lower appreciation needed to find tie
      } else {
        low = mid;  // Renting wins, higher appreciation needed to find tie
      }
    }
    return Math.round(((low + high) / 2) * 10) / 10;
  };

  // Binary search for break-even Equity CAGR
  const findBreakEvenEquityCagr = (): number | null => {
    let low = 0;
    let high = 35;

    const calcGapAtCagr = (rate: number) => {
      const simResult = calculateRentVsBuyInternal({ ...inputs, equityCagr: rate });
      return simResult.netWealthGapAtHorizon;
    };

    const lowGap = calcGapAtCagr(low);
    const highGap = calcGapAtCagr(high);

    if ((lowGap >= 0 && highGap >= 0) || (lowGap <= 0 && highGap <= 0)) {
      return null; // No crossover in reasonable range
    }

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const gap = calcGapAtCagr(mid);
      if (Math.abs(gap) < 1000) {
        return Math.round(mid * 10) / 10;
      }
      if (gap > 0) {
        low = mid; // Buying wins, higher equity CAGR needed to beat buying
      } else {
        high = mid; // Renting wins, lower equity CAGR needed to tie
      }
    }
    return Math.round(((low + high) / 2) * 10) / 10;
  };

  return {
    yearlyData,
    breakEvenYear,
    totalInterestPaid,
    totalRentPaid,
    netWealthGapAtHorizon,
    winner,
    sensitivity: {
      breakEvenAppreciationRate: findBreakEvenAppreciation(),
      breakEvenEquityCagr: findBreakEvenEquityCagr(),
    }
  };
}

// Internal simulation helper to avoid recursion
function calculateRentVsBuyInternal(inputs: RentVsBuyInputs) {
  const {
    propertyValue, downPaymentPercent, stampDutyPercent, loanInterestRate,
    loanTenureYears, propertyAppreciationRate, propertyMaintenancePercent,
    currentMonthlyRent, rentEscalationRate, equityCagr, comparisonHorizonYears
  } = inputs;

  const downPayment = propertyValue * (downPaymentPercent / 100);
  const stampDuty = propertyValue * (stampDutyPercent / 100);
  const loanPrincipal = propertyValue - downPayment;
  const monthlyLoanRate = loanInterestRate / 100 / 12;
  const totalLoanMonths = loanTenureYears * 12;

  const emi = loanPrincipal > 0 && monthlyLoanRate > 0
    ? loanPrincipal * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalLoanMonths) / (Math.pow(1 + monthlyLoanRate, totalLoanMonths) - 1)
    : 0;

  const monthlyEquityRate = Math.pow(1 + equityCagr / 100, 1 / 12) - 1;
  let currentLoanBalance = loanPrincipal;
  let currentPropertyValue = propertyValue;
  let currentRenterPortfolio = downPayment + stampDuty;
  let currentRent = currentMonthlyRent;

  for (let year = 1; year <= comparisonHorizonYears; year++) {
    const monthlyMaintenance = (currentPropertyValue * (propertyMaintenancePercent / 100)) / 12;
    for (let month = 1; month <= 12; month++) {
      if (currentLoanBalance > 0) {
        const interestPayment = currentLoanBalance * monthlyLoanRate;
        const principalPayment = emi - interestPayment;
        currentLoanBalance -= principalPayment;
        if (currentLoanBalance < 0) currentLoanBalance = 0;
      }
      const cashFlowDiff = (emi + monthlyMaintenance) - currentRent;
      currentRenterPortfolio = currentRenterPortfolio * (1 + monthlyEquityRate) + cashFlowDiff;
    }
    currentPropertyValue *= (1 + propertyAppreciationRate / 100);
    currentRent *= (1 + rentEscalationRate / 100);
  }

  const buyerNetWorth = currentPropertyValue - currentLoanBalance;
  const renterNetWorth = currentRenterPortfolio;
  return { netWealthGapAtHorizon: buyerNetWorth - renterNetWorth };
}
