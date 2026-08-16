'use client';

import React from 'react';
import { NpsVsMfResult, NpsVsMfInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { Sparkles, ShieldCheck, TrendingUp, Lock, Unlock, ArrowRightLeft } from 'lucide-react';

interface WhyNpsWinsProps {
  result: NpsVsMfResult;
  inputs: NpsVsMfInputs;
}

export const WhyNpsWins: React.FC<WhyNpsWinsProps> = ({ result, inputs }) => {
  const { winner, finalNpsCorpus, finalMfCorpus, netWealthGapAtHorizon, annualEmployerContribution, annualTaxSaved } = result;
  const isNpsWinner = winner === 'nps';

  const annualPureMfContribution = annualEmployerContribution - annualTaxSaved;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
              Cash-Flow & Liquidity Trade-Off
            </h3>
            <p className="text-[10px] text-white/40 font-medium">
              Equivalent cash-flow model breakdown ({inputs.investmentHorizonYears}-yr horizon)
            </p>
          </div>
        </div>

        {/* Liquidity Trade-off Status Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
            <Lock size={12} /> NPS: Lock-in to 60
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            <Unlock size={12} /> MF: 100% Liquid
          </div>
        </div>
      </div>

      {/* Core Explanation Box */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
        <p className="text-xs md:text-sm text-white/80 leading-relaxed">
          {isNpsWinner ? (
            <>
              Corporate NPS wins because contributing <span className="text-indigo-400 font-semibold">{formatINR(annualEmployerContribution)}/yr</span> pre-tax only reduces your take-home pay by <span className="text-indigo-300 font-semibold">{formatINR(annualPureMfContribution)}/yr</span> (due to the <span className="text-emerald-400 font-semibold">{inputs.taxBracketPercent}% tax savings</span> under Sec 80CCD(2)). That extra pre-tax compounding power inside NPS outperforms the pure equity MF strategy.
            </>
          ) : (
            <>
              Pure Mutual Funds win because the higher expected equity return (<span className="text-emerald-400 font-semibold">{inputs.mfExpectedCagr}% vs {inputs.npsExpectedCagr}%</span>) on your <span className="text-emerald-300 font-semibold">{formatINR(annualPureMfContribution)}/yr</span> post-tax investment overcomes the upfront tax shield of Corporate NPS over your {inputs.investmentHorizonYears}-year horizon.
            </>
          )}
        </p>

        {/* Out-of-Pocket Cash-Flow Equivalence Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="p-3.5 rounded-xl bg-indigo-500/[0.04] border border-indigo-500/10 space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
                <ShieldCheck size={12} className="text-indigo-400" /> Corporate NPS Strategy
              </span>
              <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5"><Lock size={9} /> Low Liquidity</span>
            </div>
            <p className="font-mono text-white text-xs">
              NPS Invested Pre-Tax: <span className="font-bold text-indigo-300">{formatINR(annualEmployerContribution)}/yr</span>
            </p>
            <p className="font-mono text-indigo-300 text-[11px] mt-0.5">
              Net Take-Home Outflow: <span className="font-bold">{formatINR(annualPureMfContribution)}/yr</span> (Tax saved = {formatINR(annualTaxSaved)})
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-400" /> Pure Mutual Fund Strategy
              </span>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5"><Unlock size={9} /> High Liquidity</span>
            </div>
            <p className="font-mono text-white text-xs">
              Pure MF Invested Post-Tax: <span className="font-bold text-emerald-300">{formatINR(annualPureMfContribution)}/yr</span>
            </p>
            <p className="font-mono text-white/50 text-[11px] mt-0.5">
              Net Take-Home Outflow: <span className="font-bold text-white">{formatINR(annualPureMfContribution)}/yr</span> (Same out-of-pocket cost)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
