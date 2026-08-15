'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { EpfVsIndexInputs } from '@/lib/types/finance';
import { calculateEpfVsIndex } from '@/lib/finance/epf-vs-index';
import { VerdictBar } from '@/components/epf-vs-index/VerdictBar';
import { ControlPanel } from '@/components/epf-vs-index/ControlPanel';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

const defaultInputs: EpfVsIndexInputs = {
  monthlyBasicSalary: 120000,
  vpfContributionPercent: 18,
  taxBracketPercent: 30,
  epfInterestRate: 8.1,
  indexFundExpectedCagr: 12.0,
  investmentHorizonYears: 20,
};

export default function EpfVsIndexPage() {
  const [inputs, setInputs] = useState<EpfVsIndexInputs>(defaultInputs);
  const result = useMemo(() => calculateEpfVsIndex(inputs), [inputs]);

  return (
    <>
      {/* ══════ DESKTOP: fixed 100vh side-by-side ══════ */}
      <div className="hidden lg:flex h-screen max-h-screen overflow-hidden flex-col bg-[#0a0a0f] text-white p-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
        </div>

        <Header subtitle="Calculator Engine" />

        <div className="relative z-10 flex-1 min-h-0 flex gap-4">
          <div className="w-[370px] xl:w-[390px] flex-shrink-0 min-h-0 flex flex-col gap-4">
            <ControlPanel inputs={inputs} setInputs={setInputs} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex-shrink-0">
              <VerdictBar result={result} horizon={inputs.investmentHorizonYears} />
            </div>
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
        </div>
      </div>

      {/* ══════ MOBILE: scrollable vertical flow ══════ */}
      <div className="lg:hidden min-h-screen bg-[#0a0a0f] text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-600/[0.05] blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-emerald-600/[0.04] blur-[80px]" />
        </div>

        <div className="relative z-10 p-3 flex flex-col">
          <Header subtitle="EPF/VPF vs. Index Engine" />

          <div className="mt-2 flex flex-col gap-3">
            <VerdictBar result={result} horizon={inputs.investmentHorizonYears} />
            <div className="h-[400px]">
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
          </div>

          <div className="mt-6 mb-2">
            <ControlPanel inputs={inputs} setInputs={setInputs} />
          </div>

          <div className="mt-4 mb-8">
          </div>
        </div>
      </div>
    </>
  );
}
