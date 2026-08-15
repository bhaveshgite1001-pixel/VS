'use client';

import React from 'react';
import { PrepayVsInvestResult, PrepayVsInvestInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { Compass, Target, BarChart2 } from 'lucide-react';

interface PrepaySensitivityProps {
  result: PrepayVsInvestResult;
  inputs: PrepayVsInvestInputs;
}

export const PrepaySensitivity: React.FC<PrepaySensitivityProps> = ({ result, inputs }) => {
  const { sensitivity } = result;
  const { breakEvenCagr, confidenceRange } = sensitivity;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
            What Return Makes Investing Better?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Break-even return threshold & return sensitivity matrix
          </p>
        </div>
      </div>

      {/* Break-even CAGR Highlight */}
      <div className="mb-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
            <Target size={12} className="text-amber-400" /> Break-Even Return Tipping Point
          </span>
          <p className="text-sm font-semibold text-white/90 mt-1">
            {breakEvenCagr !== null ? (
              <>
                Investing wins if return exceeds <span className="text-emerald-400 font-mono font-bold">{breakEvenCagr}% CAGR</span> (Guaranteed debt rate: {inputs.loanInterestRate}%)
              </>
            ) : (
              <span>Prepaying remains ahead across reasonable equity CAGR ranges.</span>
            )}
          </p>
        </div>
        {breakEvenCagr !== null && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold whitespace-nowrap">
            Break-Even: {breakEvenCagr}%
          </div>
        )}
      </div>

      {/* Return Sensitivity / Confidence Matrix */}
      <div>
        <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2 block flex items-center gap-1">
          <BarChart2 size={12} className="text-indigo-400" /> Outcome Sensitivity Across Market Rates
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {confidenceRange.map((point) => {
            const isSelected = inputs.investmentExpectedCagr === point.cagr;
            const isPrepayWinner = point.winner === 'prepay';

            return (
              <div
                key={point.cagr}
                className={`p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30'
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-white">{point.cagr}% CAGR</span>
                  {isSelected && <span className="text-[9px] font-mono text-indigo-400 uppercase">[ Selected ]</span>}
                </div>
                <p className={`text-xs font-bold font-mono ${isPrepayWinner ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {isPrepayWinner ? 'Prepay' : 'Invest'} +{formatINR(point.differenceAmount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
