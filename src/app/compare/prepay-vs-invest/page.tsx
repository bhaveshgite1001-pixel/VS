'use client';

import React, { useState, useMemo } from 'react';
import { PrepayVsInvestInputs } from '@/lib/types/finance';
import { calculatePrepayVsInvest } from '@/lib/finance/prepay-vs-invest';
import { VerdictBar } from '@/components/prepay-vs-invest/VerdictBar';
import { ControlPanel } from '@/components/prepay-vs-invest/ControlPanel';
import { WhyWinnerWins } from '@/components/prepay-vs-invest/WhyWinnerWins';
import { PrepaySensitivity } from '@/components/prepay-vs-invest/PrepaySensitivity';
import { TaxMethodologyDrawer } from '@/components/prepay-vs-invest/TaxMethodologyDrawer';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

import { ScenarioWorkspace } from '@/components/ui/ScenarioWorkspace';
import { useScenarioInputs } from '@/lib/utils/scenarioState';

const defaultInputs: PrepayVsInvestInputs = {
  outstandingLoanBalance: 8000000,
  remainingTenureYears: 15,
  loanInterestRate: 8.5,
  lumpsumAmount: 1000000,
  monthlyAdditionalPrepayment: 0,
  investmentExpectedCagr: 12.0,
  capitalGainsTaxRate: 12.5,
};

export default function PrepayVsInvestPage() {
  const [inputs, setInputs] = useScenarioInputs<PrepayVsInvestInputs>(defaultInputs);
  const result = useMemo(() => calculatePrepayVsInvest(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="Prepay vs. Invest Decision Engine" />

      {/* Main Single-Tree Responsive Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ScenarioWorkspace
            engineId="prepay-vs-invest"
            engineTitle="Prepay vs. Invest"
            currentInputs={inputs}
            onApplyScenario={(newInputs) => setInputs(newInputs)}
          />

          <VerdictBar result={result} outstandingLoan={inputs.outstandingLoanBalance} />
          
          <div className="h-[380px] lg:h-[400px] w-full">
            <ComparisonChart 
              data={result.yearlyData}
              xAxisKey="year"
              lineA={{ key: 'netWorthPrepay', label: 'Prepay NW', color: '#6366f1' }}
              lineB={{ key: 'netWorthInvest', label: 'Invest NW', color: '#10b981' }}
              title="Net Worth Projection"
              formatYAxis={(v) => {
                if (Math.abs(v) >= 1e7) return `₹${(v/1e7).toFixed(1)}Cr`;
                if (Math.abs(v) >= 1e5) return `₹${(v/1e5).toFixed(0)}L`;
                return `₹${(v/1e3).toFixed(0)}k`;
              }}
              formatTooltipValue={formatINR}
              xAxisLabelPrefix="Year "
            />
          </div>

          {/* Decision Engine: Why the Winner Wins */}
          <WhyWinnerWins result={result} inputs={inputs} />

          {/* Sensitivity Matrix & Break-Even Return */}
          <PrepaySensitivity result={result} inputs={inputs} />

          {/* Tax Methodology & Cash-Flow Drawer */}
          <TaxMethodologyDrawer inputs={inputs} />
        </div>
      </div>
    </div>
  );
}
