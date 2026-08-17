import { calculateUnderConstruction } from './src/lib/finance/under-construction';
const inputs = {
  propertyBaseValue: 10000000,
  downPayment: 2000000,
  stampDutyPercent: 6,
  registrationPercent: 1,
  constructionPeriodMonths: 48,
  appreciationConstructionCagr: 10,
  appreciationPostPossessionCagr: 8,
  monthlySocietyMaintenance: 5000,
  targetRentalIncomeMonthly: 30000,
  rentalIncomeEscalation: 8,
  totalPortfolio: 4000000,
  liquidBucketCapacity: 1000000,
  liquidFundReturn: 7.1,
  equityReturn: 12,
  ltcgTaxPercent: 12.5,
  homeLoanRate: 8.5,
  homeLoanTenureYears: 20,
};
const res = calculateUnderConstruction(inputs);
console.log("Annual EMI in Year 10:", res.yearlyData[10].emi);
