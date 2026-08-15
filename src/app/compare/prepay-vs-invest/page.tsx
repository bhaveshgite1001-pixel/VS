'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PrepayVsInvestInputs } from '@/lib/types/finance';
import { calculatePrepayVsInvest } from '@/lib/finance/prepay-vs-invest';
import { VerdictBar } from '@/components/prepay-vs-invest/VerdictBar';
import { ControlPanel } from '@/components/prepay-vs-invest/ControlPanel';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';
import { formatINR } from '@/lib/utils/formatters';

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
  const [inputs, setInputs] = useState<PrepayVsInvestInputs>(defaultInputs);
  const result = useMemo(() => calculatePrepayVsInvest(inputs), [inputs]);

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
          <div className="w-[370px] xl:w-[390px] flex-shrink-0 min-h-0">
            <ControlPanel inputs={inputs} setInputs={setInputs} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex-shrink-0">
              <VerdictBar result={result} outstandingLoan={inputs.outstandingLoanBalance} />
            </div>
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
        </div>
      </div>

      {/* ══════ MOBILE: scrollable vertical flow ══════ */}
      <div className="lg:hidden min-h-screen bg-[#0a0a0f] text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-600/[0.04] blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-emerald-600/[0.03] blur-[80px]" />
        </div>

        <div className="relative z-10 p-3 flex flex-col">
          <Header subtitle="Prepay vs. Invest Engine" />

          <div className="mt-2 flex flex-col gap-3">
            <VerdictBar result={result} outstandingLoan={inputs.outstandingLoanBalance} />
            <div className="h-[400px]">
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
          </div>

          <div className="mt-6 mb-6">
            <ControlPanel inputs={inputs} setInputs={setInputs} />
          </div>
        </div>
      </div>
    </>
  );
}
