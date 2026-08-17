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

export interface RentVsBuySensitivity {
  breakEvenAppreciationRate: number | null;
  breakEvenEquityCagr: number | null;
}

export interface RentVsBuyResult {
  yearlyData: YearData[];
  breakEvenYear: number | null;
  totalInterestPaid: number;
  totalRentPaid: number;
  netWealthGapAtHorizon: number;
  winner: 'buyer' | 'renter' | 'tie';
  sensitivity: RentVsBuySensitivity;
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

export interface ConfidenceRangePoint {
  cagr: number;
  winner: 'prepay' | 'invest' | 'tie';
  differenceAmount: number;
}

export interface PrepayVsInvestSensitivity {
  breakEvenCagr: number | null;
  confidenceRange: ConfidenceRangePoint[];
}

export interface PrepayVsInvestResult {
  monthlyData: PrepayYearData[];
  yearlyData: PrepayYearData[];
  loanClearedMonthPrepay: number;
  loanClearedMonthInvest: number;
  totalInterestPrepay: number;
  totalInterestInvest: number;
  finalNetWorthPrepay: number;
  finalNetWorthInvest: number;
  netWealthGapAtEnd: number;
  winner: 'prepay' | 'invest' | 'tie';
  sensitivity: PrepayVsInvestSensitivity;
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

export interface NpsVsMfSensitivity {
  breakEvenMfReturn: number | null;
  breakEvenTaxBracket: number | null;
}

export interface NpsVsMfResult {
  yearlyData: NpsYearData[];
  finalNpsCorpus: number; 
  finalMfCorpus: number; 
  annualEmployerContribution: number;
  annualTaxSaved: number;
  totalTaxSaved: number;
  netWealthGapAtHorizon: number;
  winner: 'nps' | 'mf' | 'tie';
  sensitivity: NpsVsMfSensitivity;
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

export interface EpfVsIndexSensitivity {
  breakEvenIndexCagr: number | null;
  scenarios: {
    cagr: number;
    differenceAmount: number;
    winner: 'epf' | 'index' | 'tie';
  }[];
}

export interface EpfVsIndexResult {
  yearlyData: EpfYearData[];
  finalEpfCorpus: number;
  finalIndexCorpus: number;
  taxPaidOnEpf: number;
  netWealthGapAtHorizon: number;
  winner: 'epf' | 'index' | 'tie';
  sensitivity: EpfVsIndexSensitivity;
}

export interface EmiVsUpfrontInputs {
  purchasePrice: number;
  upfrontDiscountAmount: number;
  emiCashbackAmount?: number;
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

export interface EmiVsUpfrontSensitivity {
  breakEvenInvestmentCagr: number | null;
}

export interface EmiVsUpfrontResult {
  monthlyData: EmiMonthData[];
  finalUpfrontNetWorth: number;
  finalEmiNetWorth: number;
  totalHiddenCosts: number; 
  netWealthGapAtEnd: number;
  winner: 'upfront' | 'emi' | 'tie';
  sensitivity: EmiVsUpfrontSensitivity;
}

// ── Under-Construction Property: Portfolio Needed Calculator ──────────

export interface UnderConstructionInputs {
  // Group A: Property & Taxes
  propertyBaseValue: number;
  downPayment: number;
  stampDutyPercent: number;
  registrationPercent: number;
  constructionPeriodMonths: number;

  // Group B: Appreciation & Maintenance
  appreciationConstructionCagr: number;
  appreciationPostPossessionCagr: number;
  monthlySocietyMaintenance: number;

  // Group C: Rental Income (Post-Possession)
  targetRentalIncomeMonthly: number;
  rentalIncomeEscalation: number;

  // Group D: Portfolio & Debt
  totalPortfolio: number;
  liquidBucketCapacity: number;
  liquidFundReturn: number;
  equityReturn: number;
  ltcgTaxPercent: number;
  homeLoanRate: number;
  homeLoanTenureYears: number;
}

export interface UCYearData {
  year: number;
  // Cash flow components (annual totals)
  upfrontPaid: number;
  preEmi: number;
  emi: number;
  maintenancePaid: number;
  rentalIncome: number;
  // Portfolio snapshots (end-of-year)
  propertyValue: number;
  loanOutstanding: number;
  liquidFund: number;
  mfPortfolio: number;
  totalPortfolio: number; // liquid + mf
  baselinePortfolio: number; // what portfolio would have been if invested and untouched
}

export interface UnderConstructionResult {
  yearlyData: UCYearData[];
  requiredStartingPortfolio: number; // Minimum portfolio needed on Day 1 to never run out of money
  portfolioGap: number; // Current portfolio minus required portfolio (+ = surplus, - = deficit)
  isPortfolioSufficient: boolean;
  depletionYearMonth: { year: number; month: number } | null; // When current portfolio runs out (if insufficient)
  totalInterestPaid: number;
  totalLtcgPaid: number;
  totalMaintenancePaid: number;
  totalCashDrained: number; // Total outflows paid from portfolio
  startingPortfolio: number; // Current liquid + MF portfolio
  portfolioRemaining: number; // What is left at Year 30 (or 0 if depleted)
  possessionMonth: number;
  bucketShiftCount: number;
  finalPropertyValue: number;
  finalLoanOutstanding: number;
  emiAmount: number;
}
