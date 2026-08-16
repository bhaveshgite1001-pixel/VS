'use client';

import React, { useState, useMemo } from 'react';
import { RentVsBuyInputs } from '@/lib/types/finance';
import { calculateRentVsBuy } from '@/lib/finance/rent-vs-buy';
import { formatINR } from '@/lib/utils/formatters';
import { VerdictBar } from '@/components/rent-vs-buy/VerdictBar';
import { ControlPanel } from '@/components/rent-vs-buy/ControlPanel';
import { SensitivityAnalysis } from '@/components/rent-vs-buy/SensitivityAnalysis';
import { AssumptionsDrawer } from '@/components/rent-vs-buy/AssumptionsDrawer';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';

import { ScenarioWorkspace } from '@/components/ui/ScenarioWorkspace';
import { deserializeInputsFromUrl } from '@/lib/utils/scenarioState';

const defaultInputs: RentVsBuyInputs = {
  propertyValue: 12000000,
  downPaymentPercent: 20,
  stampDutyPercent: 6,
  loanInterestRate: 8.5,
  loanTenureYears: 20,
  propertyAppreciationRate: 6.0,
  propertyMaintenancePercent: 1.0,
  currentMonthlyRent: 35000,
  rentEscalationRate: 6.0,
  equityCagr: 12.0,
  comparisonHorizonYears: 20,
};

export default function RentVsBuyPage() {
  const [inputs, setInputs] = useState<RentVsBuyInputs>(defaultInputs);

  // Hydrate from URL query parameters on mount
  React.useEffect(() => {
    const hydrated = deserializeInputsFromUrl<RentVsBuyInputs>(defaultInputs);
    setInputs(hydrated);
  }, []);

  const result = useMemo(() => calculateRentVsBuy(inputs), [inputs]);

  const emi = useMemo(() => {
    const dp = inputs.propertyValue * (inputs.downPaymentPercent / 100);
    const loan = inputs.propertyValue - dp;
    const r = inputs.loanInterestRate / 100 / 12;
    const n = inputs.loanTenureYears * 12;
    return loan > 0 && r > 0 ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;
  }, [inputs.propertyValue, inputs.downPaymentPercent, inputs.loanInterestRate, inputs.loanTenureYears]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="Rent vs. Buy Decision Engine" />

      {/* Main Single-Tree Responsive Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ScenarioWorkspace
            engineId="rent-vs-buy"
            engineTitle="Rent vs. Buy"
            currentInputs={inputs}
            onApplyScenario={(newInputs) => setInputs(newInputs)}
          />

          <VerdictBar result={result} horizon={inputs.comparisonHorizonYears} emi={emi} currentRent={inputs.currentMonthlyRent} />
          
          <div className="h-[380px] lg:h-[400px] w-full">
            <ComparisonChart 
              data={result.yearlyData}
              xAxisKey="year"
              lineA={{ key: 'buyerNetWorth', label: 'Buyer', color: '#6366f1' }}
              lineB={{ key: 'renterNetWorth', label: 'Renter', color: '#10b981' }}
              breakEvenXValue={result.breakEvenYear}
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

          {/* Decision Engine Sensitivity Analysis */}
          <SensitivityAnalysis result={result} inputs={inputs} />

          {/* Model Assumptions & Tax Methodology */}
          <AssumptionsDrawer inputs={inputs} />
        </div>
      </div>
    </div>
  );
}
