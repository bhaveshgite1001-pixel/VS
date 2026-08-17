import { calculateUnderConstruction } from './src/lib/finance/under-construction';
const inputs = {
  propertyBaseValue: 10000000,
  downPayment: 5700000, // 57L down payment gives ~43L loan
  stampDutyPercent: 6,
  registrationPercent: 1,
  constructionPeriodMonths: 48,
  appreciationConstructionCagr: 10,
  appreciationPostPossessionCagr: 8,
  monthlySocietyMaintenance: 5000,
  targetRentalIncomeMonthly: 30000,
  rentalIncomeEscalation: 8,
  totalPortfolio: 15000000,
  liquidBucketCapacity: 1000000,
  liquidFundReturn: 7.1,
  equityReturn: 12,
  ltcgTaxPercent: 12.5,
  homeLoanRate: 8.5,
  homeLoanTenureYears: 20,
};
const res = calculateUnderConstruction(inputs);
for (let i = 1; i <= 15; i++) {
  console.log(`Year ${i} EMI: ${res.yearlyData[i].emi}`);
}
