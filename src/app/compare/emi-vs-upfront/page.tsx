'use client';

import React, { useState, useMemo } from 'react';
import { EmiVsUpfrontInputs } from '@/lib/types/finance';
import { calculateEmiVsUpfront } from '@/lib/finance/emi-vs-upfront';
import { VerdictBar } from '@/components/emi-vs-upfront/VerdictBar';
import { ControlPanel } from '@/components/emi-vs-upfront/ControlPanel';
import { WhyUpfrontWins } from '@/components/emi-vs-upfront/WhyUpfrontWins';
import { EmiSensitivity } from '@/components/emi-vs-upfront/EmiSensitivity';
import { EmiFeeDrawer } from '@/components/emi-vs-upfront/EmiFeeDrawer';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

const defaultInputs: EmiVsUpfrontInputs = {
  purchasePrice: 150000,
  upfrontDiscountAmount: 10000,
  emiTenureMonths: 9,
  emiInterestRatePercent: 15.0,
  processingFee: 499,
  gstOnInterestPercent: 18,
  investmentExpectedCagr: 12.0,
};

export default function EmiVsUpfrontPage() {
  const [inputs, setInputs] = useState<EmiVsUpfrontInputs>(defaultInputs);
  const result = useMemo(() => calculateEmiVsUpfront(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col p-3 md:p-4 relative pb-12">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
      </div>

      <Header subtitle="No-Cost EMI vs. Upfront Decision Engine" />

      {/* Main Single-Tree Responsive Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 mt-2">
        {/* Controls Column */}
        <div className="w-full lg:w-[370px] xl:w-[390px] flex-shrink-0">
          <ControlPanel inputs={inputs} setInputs={setInputs} />
        </div>

        {/* Analytics & Visualization Column */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <VerdictBar result={result} tenureMonths={inputs.emiTenureMonths} />

          <div className="h-[380px] lg:h-[400px] w-full">
            <ComparisonChart 
              data={result.monthlyData}
              xAxisKey="month"
              lineA={{ key: 'upfrontNetWorth', label: 'Upfront Net Value', color: '#6366f1' }}
              lineB={{ key: 'emiNetWorth', label: 'EMI Net Value', color: '#10b981' }}
              title="Net Value Over Time"
              formatYAxis={(v) => {
                if (Math.abs(v) >= 1e7) return `₹${(v/1e7).toFixed(1)}Cr`;
                if (Math.abs(v) >= 1e5) return `₹${(v/1e5).toFixed(0)}L`;
                return `₹${(v/1e3).toFixed(0)}k`;
              }}
              formatTooltipValue={formatINR}
              xAxisLabelPrefix="Month "
            />
          </div>

          {/* Decision Rationale Explanation */}
          <WhyUpfrontWins result={result} inputs={inputs} />

          {/* Investment Return Sensitivity Tipping Point */}
          <EmiSensitivity result={result} inputs={inputs} />

          {/* Fee & Merchant Subvention Breakdown Drawer */}
          <EmiFeeDrawer inputs={inputs} result={result} />
        </div>
      </div>
    </div>
  );
}
