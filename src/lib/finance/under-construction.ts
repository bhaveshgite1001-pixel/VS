import { UnderConstructionInputs, UnderConstructionResult, UCYearData } from '../types/finance';

export function calculateUnderConstruction(inputs: UnderConstructionInputs): UnderConstructionResult {
  const {
    propertyBaseValue,
    downPayment,
    stampDutyPercent,
    registrationPercent,
    constructionPeriodMonths,
    appreciationConstructionCagr,
    appreciationPostPossessionCagr,
    monthlySocietyMaintenance,
    targetRentalIncomeMonthly,
    rentalIncomeEscalation,
    totalPortfolio,
    liquidBucketCapacity,
    liquidFundReturn,
    equityReturn,
    ltcgTaxPercent,
    homeLoanRate,
    homeLoanTenureYears,
  } = inputs;

  const TOTAL_MONTHS = 360;

  // Monthly compounding rates
  const rLiquid = Math.pow(1 + liquidFundReturn / 100, 1 / 12) - 1;
  const rEquity = Math.pow(1 + equityReturn / 100, 1 / 12) - 1;
  const rLoan = homeLoanRate / 100 / 12;
  const rConstructionAppreciation = Math.pow(1 + appreciationConstructionCagr / 100, 1 / 12) - 1;
  const rPostAppreciation = Math.pow(1 + appreciationPostPossessionCagr / 100, 1 / 12) - 1;
  const ltcgRate = ltcgTaxPercent / 100;

  // Stamp Duty & Registration amounts
  const stampDutyAmount = propertyBaseValue * (stampDutyPercent / 100);
  const registrationAmount = propertyBaseValue * (registrationPercent / 100);

  // Construction loan tranche logic
  const totalLoanAmount = Math.max(0, propertyBaseValue - downPayment);
  const trancheDemand = propertyBaseValue * 0.25;

  // Month 0: Buyer pays downPayment. Bank disburses difference if downPayment < trancheDemand
  const initialLoanDisbursement = Math.min(totalLoanAmount, Math.max(0, trancheDemand - downPayment));
  const remainingLoanToDisburse = Math.max(0, totalLoanAmount - initialLoanDisbursement);
  const subsequentTrancheLoanDisbursement = remainingLoanToDisburse / 3;

  // Core Simulation Function
  function runSimulation(startPortfolioAmount: number) {
    const bucketCapacity = Math.max(100000, liquidBucketCapacity);
    let liquidFund = Math.min(startPortfolioAmount, bucketCapacity);
    let mfPortfolio = Math.max(0, startPortfolioAmount - liquidFund);

    // Track baseline (what if we didn't buy the house)
    let baselineLiquid = liquidFund;
    let baselineMf = mfPortfolio;

    let cumulativeDisbursedLoan = initialLoanDisbursement;
    let loanOutstanding = cumulativeDisbursedLoan;
    let propertyValue = propertyBaseValue;
    let currentMaintenance = monthlySocietyMaintenance;
    let emiAmount = 0;

    let totalInterestPaid = 0;
    let totalLtcgPaid = 0;
    let totalMaintenancePaid = 0;
    let totalCashDrained = 0;
    let bucketShiftCount = 0;

    let isDepleted = false;
    let depletionYearMonth: { year: number; month: number } | null = null;

    let yearPreEmi = 0;
    let yearEmi = 0;
    let yearMaintenance = 0;
    let yearRentalIncome = 0;
    let currentRentalMonthly = 0;

    const yearlyData: UCYearData[] = [];

    function bucketShift() {
      if (mfPortfolio <= 0) return;
      const targetCashNet = Math.max(100000, bucketCapacity);
      const grossWithdrawal = targetCashNet / (1 - ltcgRate);
      const actualWithdrawal = Math.min(grossWithdrawal, mfPortfolio);
      const ltcgTax = actualWithdrawal * ltcgRate;
      const netCash = actualWithdrawal - ltcgTax;
      mfPortfolio -= actualWithdrawal;
      liquidFund += netCash;
      totalLtcgPaid += ltcgTax;
      bucketShiftCount++;
    }

    function drainLiquid(amount: number, m: number) {
      totalCashDrained += amount;
      liquidFund -= amount;

      // Trigger bucket shifts from MF if liquid fund drops below 0
      while (liquidFund < 0 && mfPortfolio > 0) {
        bucketShift();
      }

      // If portfolio is completely exhausted and still in deficit
      if (liquidFund < 0 && mfPortfolio <= 0) {
        if (!isDepleted) {
          isDepleted = true;
          const yr = Math.max(1, Math.ceil(m / 12));
          const mo = (m % 12) === 0 ? 12 : (m % 12);
          depletionYearMonth = { year: yr, month: mo };
        }
        liquidFund = 0;
      }
    }

    // ═══ MONTH 0: BOOKING ═══
    const bookingOutflow = downPayment + stampDutyAmount + registrationAmount;
    drainLiquid(bookingOutflow, 0);

    yearlyData.push({
      year: 0,
      upfrontPaid: bookingOutflow,
      preEmi: 0,
      emi: 0,
      maintenancePaid: 0,
      rentalIncome: 0,
      propertyValue: propertyBaseValue,
      loanOutstanding: initialLoanDisbursement,
      liquidFund: Math.max(0, liquidFund),
      mfPortfolio: Math.max(0, mfPortfolio),
      totalPortfolio: Math.max(0, liquidFund) + Math.max(0, mfPortfolio),
      baselinePortfolio: baselineLiquid + baselineMf,
    });

    const mTranche1 = Math.floor(constructionPeriodMonths * 0.25) || 1;
    const mTranche2 = Math.floor(constructionPeriodMonths * 0.50) || 2;
    const mTranche3 = Math.floor(constructionPeriodMonths * 0.75) || 3;

    // ═══ MONTHS 1 TO 360 ═══
    for (let m = 1; m <= TOTAL_MONTHS; m++) {
      const isConstruction = m <= constructionPeriodMonths;
      const isPossessionMonth = m === constructionPeriodMonths + 1;
      const currentYear = Math.ceil(m / 12);

      // Property appreciation
      propertyValue *= isConstruction
        ? (1 + rConstructionAppreciation)
        : (1 + rPostAppreciation);

      // Compound portfolios
      if (liquidFund > 0) liquidFund *= (1 + rLiquid);
      if (mfPortfolio > 0) mfPortfolio *= (1 + rEquity);

      baselineLiquid *= (1 + rLiquid);
      baselineMf *= (1 + rEquity);

      // ── CONSTRUCTION PHASE ──
      if (isConstruction) {
        if (m === mTranche1 || m === mTranche2 || m === mTranche3) {
          cumulativeDisbursedLoan += subsequentTrancheLoanDisbursement;
          loanOutstanding = cumulativeDisbursedLoan;
        }

        // Pre-EMI payment
        const preEmiPayment = cumulativeDisbursedLoan * rLoan;
        drainLiquid(preEmiPayment, m);
        totalInterestPaid += preEmiPayment;
        yearPreEmi += preEmiPayment;
      }

      // ── POSSESSION SHOCK (Month 49) ──
      if (isPossessionMonth) {
        const emiMonths = homeLoanTenureYears * 12;
        if (rLoan > 0 && loanOutstanding > 0) {
          emiAmount = loanOutstanding * rLoan * Math.pow(1 + rLoan, emiMonths) /
            (Math.pow(1 + rLoan, emiMonths) - 1);
        }

        // Scale initial target rent up by the property appreciation ratio during construction
        currentRentalMonthly = targetRentalIncomeMonthly * (propertyValue / propertyBaseValue);
      }

      // ── POST-POSSESSION SERVICING ──
      if (m > constructionPeriodMonths) {
        if (loanOutstanding > 0 && emiAmount > 0) {
          const interestComponent = loanOutstanding * rLoan;
          const principalComponent = Math.min(emiAmount - interestComponent, loanOutstanding);
          loanOutstanding -= principalComponent;
          if (loanOutstanding < 1) loanOutstanding = 0;
          totalInterestPaid += interestComponent;

          drainLiquid(emiAmount, m);
          yearEmi += emiAmount;
        }

        // Rental income
        liquidFund += currentRentalMonthly;
        yearRentalIncome += currentRentalMonthly;

        // Maintenance
        drainLiquid(currentMaintenance, m);
        totalMaintenancePaid += currentMaintenance;
        yearMaintenance += currentMaintenance;

        if (m % 12 === 0) {
          currentRentalMonthly *= (1 + rentalIncomeEscalation / 100);
          currentMaintenance *= (1 + rentalIncomeEscalation / 100);
        }
      }

      // End of year snapshot
      if (m % 12 === 0) {
        const totalPort = Math.max(0, liquidFund) + Math.max(0, mfPortfolio);

        yearlyData.push({
          year: currentYear,
          upfrontPaid: 0,
          preEmi: yearPreEmi,
          emi: yearEmi,
          maintenancePaid: yearMaintenance,
          rentalIncome: yearRentalIncome,
          propertyValue,
          loanOutstanding: Math.max(0, loanOutstanding),
          liquidFund: Math.max(0, liquidFund),
          mfPortfolio: Math.max(0, mfPortfolio),
          totalPortfolio: totalPort,
          baselinePortfolio: baselineLiquid + baselineMf,
        });

        yearPreEmi = 0;
        yearEmi = 0;
        yearMaintenance = 0;
        yearRentalIncome = 0;
      }
    }

    const finalYear = yearlyData[yearlyData.length - 1];

    return {
      yearlyData,
      totalInterestPaid,
      totalLtcgPaid,
      totalMaintenancePaid,
      totalCashDrained,
      portfolioRemaining: finalYear?.totalPortfolio ?? 0,
      isDepleted,
      depletionYearMonth,
      bucketShiftCount,
      finalPropertyValue: finalYear?.propertyValue ?? 0,
      finalLoanOutstanding: finalYear?.loanOutstanding ?? 0,
      emiAmount,
    };
  }

  // 1. Run current simulation
  const currentSim = runSimulation(totalPortfolio);

  // 2. Binary search to find Minimum Required Portfolio
  let minP = 0;
  let maxP = 200000000;
  let requiredStartingPortfolio = totalPortfolio;

  for (let iter = 0; iter < 30; iter++) {
    const midP = (minP + maxP) / 2;
    const testSim = runSimulation(midP);

    if (testSim.isDepleted) {
      minP = midP;
    } else {
      requiredStartingPortfolio = midP;
      maxP = midP;
    }
  }

  const portfolioGap = totalPortfolio - requiredStartingPortfolio;
  const isPortfolioSufficient = !currentSim.isDepleted;

  return {
    yearlyData: currentSim.yearlyData,
    requiredStartingPortfolio: Math.round(requiredStartingPortfolio),
    portfolioGap: Math.round(portfolioGap),
    isPortfolioSufficient,
    depletionYearMonth: currentSim.depletionYearMonth,
    totalInterestPaid: Math.round(currentSim.totalInterestPaid),
    totalLtcgPaid: Math.round(currentSim.totalLtcgPaid),
    totalMaintenancePaid: Math.round(currentSim.totalMaintenancePaid),
    totalCashDrained: Math.round(currentSim.totalCashDrained),
    startingPortfolio: Math.round(totalPortfolio),
    portfolioRemaining: Math.round(currentSim.portfolioRemaining),
    possessionMonth: constructionPeriodMonths + 1,
    bucketShiftCount: currentSim.bucketShiftCount,
    finalPropertyValue: Math.round(currentSim.finalPropertyValue),
    finalLoanOutstanding: Math.round(currentSim.finalLoanOutstanding),
    emiAmount: Math.round(currentSim.emiAmount),
  };
}
