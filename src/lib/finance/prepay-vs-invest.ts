import { PrepayVsInvestInputs, PrepayVsInvestResult, PrepayYearData } from '../types/finance';

export function calculatePrepayVsInvest(inputs: PrepayVsInvestInputs): PrepayVsInvestResult {
  const {
    outstandingLoanBalance,
    remainingTenureYears,
    loanInterestRate,
    lumpsumAmount,
    monthlyAdditionalPrepayment,
    investmentExpectedCagr,
    capitalGainsTaxRate,
  } = inputs;

  const rLoan = loanInterestRate / 100 / 12;
  const rInvest = investmentExpectedCagr / 100 / 12;
  const nMonths = remainingTenureYears * 12;

  // Base EMI without prepayments
  const baseEmi = rLoan > 0 
    ? (outstandingLoanBalance * rLoan * Math.pow(1 + rLoan, nMonths)) / (Math.pow(1 + rLoan, nMonths) - 1)
    : outstandingLoanBalance / nMonths;

  let loanBalancePrepay = Math.max(0, outstandingLoanBalance - lumpsumAmount);
  let loanBalanceInvest = outstandingLoanBalance;

  let portfolioPrepay = 0;
  let portfolioInvest = lumpsumAmount;

  // Track invested principal for accurate taxation later (simplified approximation: tax on entire gain)
  let investedPrincipalInvest = lumpsumAmount;
  let investedPrincipalPrepay = 0;

  const monthlyData: PrepayYearData[] = [];
  const yearlyData: PrepayYearData[] = [];

  let totalInterestPrepay = 0;
  let totalInterestInvest = 0;

  let loanClearedMonthPrepay = 0;
  let loanClearedMonthInvest = 0;

  for (let m = 1; m <= nMonths; m++) {
    // ---- INVEST SCENARIO ----
    if (loanBalanceInvest > 0) {
      const interest = loanBalanceInvest * rLoan;
      totalInterestInvest += interest;
      const principalPart = baseEmi - interest;
      loanBalanceInvest = Math.max(0, loanBalanceInvest - principalPart);
      if (loanBalanceInvest === 0 && loanClearedMonthInvest === 0) {
        loanClearedMonthInvest = m;
      }
    }
    
    // In Invest scenario, the monthly additional amount goes to investments
    portfolioInvest = portfolioInvest * (1 + rInvest) + monthlyAdditionalPrepayment;
    investedPrincipalInvest += monthlyAdditionalPrepayment;


    // ---- PREPAY SCENARIO ----
    if (loanBalancePrepay > 0) {
      const interest = loanBalancePrepay * rLoan;
      totalInterestPrepay += interest;
      
      // They pay the base EMI + the additional prepayment
      const totalPayment = baseEmi + monthlyAdditionalPrepayment;
      const principalPart = totalPayment - interest;
      
      loanBalancePrepay -= principalPart;
      
      if (loanBalancePrepay <= 0) {
        if (loanClearedMonthPrepay === 0) {
          loanClearedMonthPrepay = m;
        }
        // The excess payment goes into the portfolio this month
        portfolioPrepay += Math.abs(loanBalancePrepay);
        investedPrincipalPrepay += Math.abs(loanBalancePrepay);
        loanBalancePrepay = 0;
      }
    } else {
      // Loan is cleared. The entire base EMI + additional prepayment can now be invested
      const investAmount = baseEmi + monthlyAdditionalPrepayment;
      portfolioPrepay = portfolioPrepay * (1 + rInvest) + investAmount;
      investedPrincipalPrepay += investAmount;
    }

    // Tax calculation on portfolio (applied continuously for Net Worth estimation, though actually realized at end)
    const gainsPrepay = Math.max(0, portfolioPrepay - investedPrincipalPrepay);
    const taxPrepay = gainsPrepay * (capitalGainsTaxRate / 100);
    const netPortfolioPrepay = portfolioPrepay - taxPrepay;

    const gainsInvest = Math.max(0, portfolioInvest - investedPrincipalInvest);
    const taxInvest = gainsInvest * (capitalGainsTaxRate / 100);
    const netPortfolioInvest = portfolioInvest - taxInvest;

    const netWorthPrepay = netPortfolioPrepay - loanBalancePrepay;
    const netWorthInvest = netPortfolioInvest - loanBalanceInvest;

    const currentData: PrepayYearData = {
      year: m / 12,
      month: m,
      loanBalancePrepay,
      loanBalanceInvest,
      portfolioValuePrepay: netPortfolioPrepay,
      portfolioValueInvest: netPortfolioInvest,
      netWorthPrepay,
      netWorthInvest,
    };

    monthlyData.push(currentData);

    if (m % 12 === 0 || m === nMonths) {
      yearlyData.push(currentData);
    }
  }

  // If loan never cleared in the timeframe (unlikely unless math is weird, but theoretically possible)
  if (loanClearedMonthInvest === 0) loanClearedMonthInvest = nMonths;
  if (loanClearedMonthPrepay === 0) loanClearedMonthPrepay = nMonths;

  const finalNWPrepay = monthlyData[monthlyData.length - 1].netWorthPrepay;
  const finalNWInvest = monthlyData[monthlyData.length - 1].netWorthInvest;
  const netWealthGapAtEnd = finalNWPrepay - finalNWInvest;

  let winner: 'prepay' | 'invest' | 'tie' = 'tie';
  if (Math.abs(netWealthGapAtEnd) > 1000) {
    winner = netWealthGapAtEnd > 0 ? 'prepay' : 'invest';
  }

  return {
    monthlyData,
    yearlyData,
    loanClearedMonthPrepay,
    loanClearedMonthInvest,
    totalInterestPrepay,
    totalInterestInvest,
    netWealthGapAtEnd,
    winner,
  };
}
