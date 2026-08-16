'use client';

import React, { useState, useMemo } from 'react';
import { NpsVsMfInputs } from '@/lib/types/finance';
import { calculateNpsVsMf } from '@/lib/finance/nps-vs-mf';
import { VerdictBar } from '@/components/nps-vs-mf/VerdictBar';
import { ControlPanel } from '@/components/nps-vs-mf/ControlPanel';
import { WhyNpsWins } from '@/components/nps-vs-mf/WhyNpsWins';
import { NpsSensitivity } from '@/components/nps-vs-mf/NpsSensitivity';
import { NpsTaxDrawer } from '@/components/nps-vs-mf/NpsTaxDrawer';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

import { ScenarioWorkspace } from '@/components/ui/ScenarioWorkspace';
import { useScenarioInputs } from '@/lib/utils/scenarioState';

const defaultInputs: NpsVsMfInputs = {
  basicSalary: 1500000,
  employerMatchPercent: 10,
  taxBracketPercent: 30,
  npsExpectedCagr: 10.0,
  mfExpectedCagr: 12.0,
  investmentHorizonYears: 20,
};

export default function NpsVsMfPage() {
  const [inputs, setInputs] = useScenarioInputs<NpsVsMfInputs>(defaultInputs);
  const result = useMemo(() => calculateNpsVsMf(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="Corporate NPS vs. Mutual Funds Decision Engine" />

      {/* Main Single-Tree Responsive Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ScenarioWorkspace
            engineId="nps-vs-mf"
            engineTitle="NPS vs. Mutual Funds"
            currentInputs={inputs}
            onApplyScenario={(newInputs) => setInputs(newInputs)}
          />

          <VerdictBar result={result} horizon={inputs.investmentHorizonYears} />

          <div className="h-[380px] lg:h-[400px] w-full">
            <ComparisonChart 
              data={result.yearlyData}
              xAxisKey="year"
              lineA={{ key: 'npsCorpus', label: 'NPS + MF', color: '#6366f1' }}
              lineB={{ key: 'mfCorpus', label: 'Pure MF', color: '#10b981' }}
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

          {/* Cash-Flow & Liquidity Trade-off Explanation */}
          <WhyNpsWins result={result} inputs={inputs} />

          {/* Dynamic Return & Tax Bracket Sensitivity */}
          <NpsSensitivity result={result} inputs={inputs} />

          {/* Tax Saved Derivation & Legal Rules Drawer */}
          <NpsTaxDrawer inputs={inputs} result={result} />
        </div>
      </div>
    </div>
  );
}
