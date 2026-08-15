'use client';

import React from 'react';
import { NpsVsMfResult, NpsVsMfInputs } from '@/lib/types/finance';
import { Compass, Target, Percent } from 'lucide-react';

interface NpsSensitivityProps {
  result: NpsVsMfResult;
  inputs: NpsVsMfInputs;
}

export const NpsSensitivity: React.FC<NpsSensitivityProps> = ({ result, inputs }) => {
  const { winner, sensitivity } = result;
  const { breakEvenMfReturn, breakEvenTaxBracket } = sensitivity;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
            When Does Mutual Funds Beat NPS?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Dynamic sensitivity analysis for return rates & tax brackets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Tipping Point 1: MF Return Needed */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
              <Target size={12} className="text-emerald-400" /> MF Return Tipping Point
            </span>
            {breakEvenMfReturn !== null && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                {breakEvenMfReturn}% CAGR
              </span>
            )}
          </div>
          <div>
            {breakEvenMfReturn !== null ? (
              <>
                <p className="text-sm font-semibold text-white/90">
                  {winner === 'nps' ? 'Mutual Funds beat NPS if MF return exceeds ' : 'NPS beats Mutual Funds if MF return drops below '}
                  <span className="text-emerald-400 font-bold font-mono">{breakEvenMfReturn}%</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Current model assumption: <span className="text-white/70 font-mono">{inputs.mfExpectedCagr}%</span> (NPS: {inputs.npsExpectedCagr}%)
                </p>
              </>
            ) : (
              <p className="text-xs text-white/60">
                {winner === 'nps'
                  ? 'Corporate NPS remains ahead across reasonable equity return expectations.'
                  : 'Mutual Funds remain ahead even at lower expected returns.'}
              </p>
            )}
          </div>
        </div>

        {/* Tipping Point 2: Minimum Tax Bracket Needed */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
              <Percent size={12} className="text-indigo-400" /> Tax Bracket Threshold
            </span>
            {breakEvenTaxBracket !== null && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                ≥ {breakEvenTaxBracket}% Slab
              </span>
            )}
          </div>
          <div>
            {breakEvenTaxBracket !== null ? (
              <>
                <p className="text-sm font-semibold text-white/90">
                  {winner === 'nps' ? 'NPS remains winning down to a ' : 'NPS starts winning if your tax slab is '}
                  <span className="text-indigo-400 font-bold font-mono">{breakEvenTaxBracket}% tax slab</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Current model assumption: <span className="text-white/70 font-mono">{inputs.taxBracketPercent}% tax bracket</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-white/60">
                Tax bracket does not change the winner under current return assumptions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
