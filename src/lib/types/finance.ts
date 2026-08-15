export interface RentVsBuyInputs {
  propertyValue: number;
  downPaymentPercent: number;
  stampDutyPercent: number;
  loanInterestRate: number;
  loanTenureYears: number;
  propertyAppreciationRate: number;
  propertyMaintenancePercent: number;
  currentMonthlyRent: number;
  rentEscalationRate: number;
  equityCagr: number;
  comparisonHorizonYears: number;
}

export interface YearData {
  year: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  difference: number;
  buyerPropertyVal: number;
  buyerLoanBalance: number;
  renterPortfolio: number;
}

export interface RentVsBuyResult {
  yearlyData: YearData[];
  breakEvenYear: number | null;
  totalInterestPaid: number;
  totalRentPaid: number;
  netWealthGapAtHorizon: number;
  winner: 'buyer' | 'renter' | 'tie';
}

export interface PrepayVsInvestInputs {
  outstandingLoanBalance: number;
  remainingTenureYears: number;
  loanInterestRate: number;
  lumpsumAmount: number;
  monthlyAdditionalPrepayment: number;
  investmentExpectedCagr: number;
  capitalGainsTaxRate: number;
}

export interface PrepayYearData {
  year: number;
  month: number;
  loanBalancePrepay: number;
  loanBalanceInvest: number;
  portfolioValuePrepay: number;
  portfolioValueInvest: number;
  netWorthPrepay: number;
  netWorthInvest: number;
}

export interface PrepayVsInvestResult {
  monthlyData: PrepayYearData[];
  yearlyData: PrepayYearData[];
  loanClearedMonthPrepay: number;
  loanClearedMonthInvest: number;
  totalInterestPrepay: number;
  totalInterestInvest: number;
  netWealthGapAtEnd: number;
  winner: 'prepay' | 'invest' | 'tie';
}

export interface NpsVsMfInputs {
  basicSalary: number; 
  employerMatchPercent: number; 
  taxBracketPercent: number; 
  npsExpectedCagr: number; 
  mfExpectedCagr: number; 
  investmentHorizonYears: number;
}

export interface NpsYearData {
  year: number;
  npsCorpus: number;
  mfCorpus: number;
  totalTaxSaved: number;
}

export interface NpsVsMfResult {
  yearlyData: NpsYearData[];
  finalNpsCorpus: number; 
  finalMfCorpus: number; 
  totalTaxSaved: number;
  netWealthGapAtHorizon: number;
  winner: 'nps' | 'mf' | 'tie';
}

export interface EpfVsIndexInputs {
  monthlyBasicSalary: number;
  vpfContributionPercent: number;
  taxBracketPercent: number;
  epfInterestRate: number;
  indexFundExpectedCagr: number;
  investmentHorizonYears: number;
}

export interface EpfYearData {
  year: number;
  epfCorpus: number;
  indexCorpus: number;
}

export interface EpfVsIndexResult {
  yearlyData: EpfYearData[];
  finalEpfCorpus: number;
  finalIndexCorpus: number;
  taxPaidOnEpf: number;
  netWealthGapAtHorizon: number;
  winner: 'epf' | 'index' | 'tie';
}

export interface EmiVsUpfrontInputs {
  purchasePrice: number;
  upfrontDiscountAmount: number;
  emiTenureMonths: number;
  emiInterestRatePercent: number; // e.g., 15% used by bank to calculate GST
  processingFee: number;
  gstOnInterestPercent: number; // Typically 18%
  investmentExpectedCagr: number;
}

export interface EmiMonthData {
  month: number;
  upfrontNetWorth: number;
  emiNetWorth: number;
}

export interface EmiVsUpfrontResult {
  monthlyData: EmiMonthData[];
  finalUpfrontNetWorth: number;
  finalEmiNetWorth: number;
  totalHiddenCosts: number; 
  netWealthGapAtEnd: number;
  winner: 'upfront' | 'emi' | 'tie';
}
