'use client';

import React from 'react';
import { PrepayVsInvestResult, PrepayVsInvestInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

interface WhyWinnerWinsProps {
  result: PrepayVsInvestResult;
  inputs: PrepayVsInvestInputs;
}

export const WhyWinnerWins: React.FC<WhyWinnerWinsProps> = ({ result, inputs }) => {
  const { winner, finalNetWorthPrepay, finalNetWorthInvest, netWealthGapAtEnd } = result;

  const isInvestWinner = winner === 'invest';
  const effectiveReturn = inputs.investmentExpectedCagr * (1 - inputs.capitalGainsTaxRate / 100);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
            Why Does {isInvestWinner ? 'Investing' : 'Prepaying'} Win?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Mathematical decision rationale for {inputs.remainingTenureYears}-year tenure
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        {/* Core Rationale Explanation */}
        <p className="text-xs md:text-sm text-white/80 leading-relaxed">
          {isInvestWinner ? (
            <>
              Your expected investment return of <span className="text-emerald-400 font-semibold">{inputs.investmentExpectedCagr}% CAGR</span> (post-tax ~<span className="text-emerald-300 font-semibold">{effectiveReturn.toFixed(1)}%</span>) outperforms your loan interest rate of <span className="text-indigo-400 font-semibold">{inputs.loanInterestRate}%</span>. Compounding equity growth over time beats the interest saved by prepaying.
            </>
          ) : (
            <>
              Prepaying provides a <span className="text-indigo-400 font-semibold">guaranteed, risk-free {inputs.loanInterestRate}% return</span> (by eliminating debt interest) which beats your tax-adjusted investment return expectations.
            </>
          )}
        </p>

        {/* Side-by-side final net worth values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          <div className="p-3 rounded-xl bg-indigo-500/[0.04] border border-indigo-500/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
              <ShieldCheck size={12} className="text-indigo-400" /> Prepay Strategy Net Worth
            </span>
            <p className="text-base font-bold font-mono text-white mt-1">
              {formatINR(finalNetWorthPrepay)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-400" /> Invest Strategy Net Worth
            </span>
            <p className="text-base font-bold font-mono text-white mt-1">
              {formatINR(finalNetWorthInvest)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">
              Net Wealth Difference
            </span>
            <p className={`text-base font-bold font-mono mt-1 ${isInvestWinner ? 'text-emerald-400' : 'text-indigo-400'}`}>
              +{formatINR(Math.abs(netWealthGapAtEnd))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
