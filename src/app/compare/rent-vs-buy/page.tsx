'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RentVsBuyInputs } from '@/lib/types/finance';
import { calculateRentVsBuy } from '@/lib/finance/rent-vs-buy';
import { formatINR } from '@/lib/utils/formatters';
import { VerdictBar } from '@/components/rent-vs-buy/VerdictBar';
import { ControlPanel } from '@/components/rent-vs-buy/ControlPanel';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { Header } from '@/components/ui/Header';

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
  const result = useMemo(() => calculateRentVsBuy(inputs), [inputs]);

  const emi = useMemo(() => {
    const dp = inputs.propertyValue * (inputs.downPaymentPercent / 100);
    const loan = inputs.propertyValue - dp;
    const r = inputs.loanInterestRate / 100 / 12;
    const n = inputs.loanTenureYears * 12;
    return loan > 0 && r > 0 ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;
  }, [inputs.propertyValue, inputs.downPaymentPercent, inputs.loanInterestRate, inputs.loanTenureYears]);

  return (
    <>
      {/* ══════ DESKTOP: fixed 100vh side-by-side ══════ */}
      <div className="hidden lg:flex h-screen max-h-screen overflow-hidden flex-col bg-[#0a0a0f] text-white p-4">
        {/* Ambient blobs */}
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
              <VerdictBar result={result} horizon={inputs.comparisonHorizonYears} emi={emi} currentRent={inputs.currentMonthlyRent} />
            </div>
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
        </div>
      </div>

      {/* ══════ MOBILE: scrollable vertical flow ══════ */}
      <div className="lg:hidden min-h-screen bg-[#0a0a0f] text-white">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-600/[0.04] blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-emerald-600/[0.03] blur-[80px]" />
        </div>

        <div className="relative z-10 p-3 flex flex-col">
          <Header subtitle="Rent vs. Buy Engine" />

          {/* Verdict and Chart (First) */}
          <div className="mt-2 flex flex-col gap-3">
            <VerdictBar result={result} horizon={inputs.comparisonHorizonYears} emi={emi} currentRent={inputs.currentMonthlyRent} />
            <div className="h-[400px]">
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
          </div>

          {/* Controls (Below) */}
          <div className="mt-6 mb-6">
            <ControlPanel inputs={inputs} setInputs={setInputs} />
          </div>
        </div>
      </div>
    </>
  );
}
