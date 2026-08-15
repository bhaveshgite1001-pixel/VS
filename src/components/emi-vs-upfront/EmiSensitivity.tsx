'use client';

import React from 'react';
import { EmiVsUpfrontResult, EmiVsUpfrontInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { Compass, Target, BarChart2 } from 'lucide-react';

interface EmiSensitivityProps {
  result: EmiVsUpfrontResult;
  inputs: EmiVsUpfrontInputs;
}

export const EmiSensitivity: React.FC<EmiSensitivityProps> = ({ result, inputs }) => {
  const { winner, sensitivity } = result;
  const { breakEvenInvestmentCagr } = sensitivity;

  const sampleRates = [8, 12, breakEvenInvestmentCagr ?? 18, 24].sort((a, b) => a - b);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
            What Investment Return Makes EMI Better?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Break-even return tipping point for retaining cash
          </p>
        </div>
      </div>

      {/* Break-even CAGR Highlight */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
            <Target size={12} className="text-amber-400" /> Break-Even Investment Return
          </span>
          <p className="text-sm font-semibold text-white/90 mt-1">
            {breakEvenInvestmentCagr !== null ? (
              <>
                EMI beats paying upfront if your investment return exceeds <span className="text-emerald-400 font-mono font-bold">{breakEvenInvestmentCagr}% CAGR</span>
              </>
            ) : (
              <span>Paying upfront remains superior across standard return expectations.</span>
            )}
          </p>
        </div>
        {breakEvenInvestmentCagr !== null && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold whitespace-nowrap">
            Break-Even: {breakEvenInvestmentCagr}%
          </div>
        )}
      </div>
    </div>
  );
};
