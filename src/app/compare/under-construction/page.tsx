'use client';

import React, { useMemo } from 'react';
import { UnderConstructionInputs } from '@/lib/types/finance';
import { calculateUnderConstruction } from '@/lib/finance/under-construction';
import { Header } from '@/components/ui/Header';
import { ScenarioWorkspace } from '@/components/ui/ScenarioWorkspace';
import { useScenarioInputs } from '@/lib/utils/scenarioState';
import { ControlPanel } from '@/components/under-construction/ControlPanel';
import { HeroKpis } from '@/components/under-construction/HeroKpis';
import { CashFlowChart } from '@/components/under-construction/CashFlowChart';
import { PortfolioChart } from '@/components/under-construction/NetWorthChart';

const defaultInputs: UnderConstructionInputs = {
  // Group A: Property & Taxes
  propertyBaseValue: 10000000,
  downPayment: 2000000,
  stampDutyPercent: 6,
  registrationPercent: 1,
  constructionPeriodMonths: 48,

  // Group B: Appreciation & Maintenance
  appreciationConstructionCagr: 10,
  appreciationPostPossessionCagr: 8,
  monthlySocietyMaintenance: 5000,

  // Group C: Rental Income (Post-Possession)
  targetRentalIncomeMonthly: 30000,
  rentalIncomeEscalation: 8,

  // Group D: Portfolio & Debt
  totalPortfolio: 4000000,
  liquidBucketCapacity: 1000000,
  liquidFundReturn: 7.1,
  equityReturn: 12,
  ltcgTaxPercent: 12.5,
  homeLoanRate: 8.5,
  homeLoanTenureYears: 20,
};

export default function UnderConstructionPage() {
  const [inputs, setInputs] = useScenarioInputs<UnderConstructionInputs>(defaultInputs);
  const result = useMemo(() => calculateUnderConstruction(inputs), [inputs]);

  const possessionYear = Math.ceil(inputs.constructionPeriodMonths / 12);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-orange-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="Portfolio Needed for Home Purchase" />

      {/* Main Split Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ScenarioWorkspace
            engineId="under-construction"
            engineTitle="Portfolio Needed Calculator"
            currentInputs={inputs}
            onApplyScenario={(newInputs) => setInputs(newInputs)}
          />

          {/* Hero KPIs */}
          <HeroKpis result={result} />

          {/* Cash Flow Burner Chart */}
          <CashFlowChart data={result.yearlyData} possessionYear={possessionYear} />

          {/* Portfolio & Loan Trajectory Chart */}
          <PortfolioChart
            data={result.yearlyData}
            possessionYear={possessionYear}
            startingPortfolio={result.startingPortfolio}
          />
        </div>
      </div>
    </div>
  );
}
