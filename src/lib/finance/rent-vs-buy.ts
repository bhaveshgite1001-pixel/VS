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

  return {
    yearlyData,
    breakEvenYear,
    totalInterestPaid,
    totalRentPaid,
    netWealthGapAtHorizon,
    winner,
  };
}
