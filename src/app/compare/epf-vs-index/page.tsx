'use client';

import React, { useState, useMemo } from 'react';
import { EpfVsIndexInputs } from '@/lib/types/finance';
import { calculateEpfVsIndex } from '@/lib/finance/epf-vs-index';
import { VerdictBar } from '@/components/epf-vs-index/VerdictBar';
import { ControlPanel } from '@/components/epf-vs-index/ControlPanel';
import { EpfMethodologyDrawer } from '@/components/epf-vs-index/EpfMethodologyDrawer';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

import { EpfSensitivity } from '@/components/epf-vs-index/EpfSensitivity';

import { ScenarioWorkspace } from '@/components/ui/ScenarioWorkspace';
import { deserializeInputsFromUrl } from '@/lib/utils/scenarioState';

const defaultInputs: EpfVsIndexInputs = {
  monthlyBasicSalary: 120000,
  vpfContributionPercent: 18,
  taxBracketPercent: 30,
  epfInterestRate: 8.25,
  indexFundExpectedCagr: 12.0,
  investmentHorizonYears: 20,
};

export default function EpfVsIndexPage() {
  const [inputs, setInputs] = useState<EpfVsIndexInputs>(defaultInputs);

  React.useEffect(() => {
    const hydrated = deserializeInputsFromUrl<EpfVsIndexInputs>(defaultInputs);
    setInputs(hydrated);
  }, []);

  const result = useMemo(() => calculateEpfVsIndex(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="EPF/VPF vs. Index Funds Decision Engine" />

      {/* Main Single-Tree Responsive Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ScenarioWorkspace
            engineId="epf-vs-index"
            engineTitle="EPF vs. Index Funds"
            currentInputs={inputs}
            onApplyScenario={(newInputs) => setInputs(newInputs)}
          />

          <VerdictBar result={result} horizon={inputs.investmentHorizonYears} />

          <div className="h-[380px] lg:h-[400px] w-full">
            <ComparisonChart 
              data={result.yearlyData}
              xAxisKey="year"
              lineA={{ key: 'epfCorpus', label: 'Max VPF', color: '#6366f1' }}
              lineB={{ key: 'indexCorpus', label: 'Index Fund', color: '#10b981' }}
              title="Net Worth Projection (Post Tax)"
              formatYAxis={(v) => {
                if (Math.abs(v) >= 1e7) return `₹${(v/1e7).toFixed(1)}Cr`;
                if (Math.abs(v) >= 1e5) return `₹${(v/1e5).toFixed(0)}L`;
                return `₹${(v/1e3).toFixed(0)}k`;
              }}
              formatTooltipValue={formatINR}
              xAxisLabelPrefix="Year "
            />
          </div>

          {/* Return Sensitivity Analysis */}
          <EpfSensitivity result={result} inputs={inputs} />

          {/* Model Assumptions & Methodology Drawer */}
          <EpfMethodologyDrawer inputs={inputs} result={result} />
        </div>
      </div>
    </div>
  );
}
