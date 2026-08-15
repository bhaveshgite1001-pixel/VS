'use client';

import React from 'react';
import { EmiVsUpfrontResult, EmiVsUpfrontInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { Sparkles, ShoppingCart, CreditCard, Tag } from 'lucide-react';

interface WhyUpfrontWinsProps {
  result: EmiVsUpfrontResult;
  inputs: EmiVsUpfrontInputs;
}

export const WhyUpfrontWins: React.FC<WhyUpfrontWinsProps> = ({ result, inputs }) => {
  const { winner, finalUpfrontNetWorth, finalEmiNetWorth, netWealthGapAtEnd } = result;

  const isUpfrontWinner = winner === 'upfront';

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
            Why Does {isUpfrontWinner ? 'Paying Upfront' : 'No-Cost EMI'} Win?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Opportunity cost decision rationale over {inputs.emiTenureMonths} months
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
        <p className="text-xs md:text-sm text-white/80 leading-relaxed">
          {isUpfrontWinner ? (
            <>
              Paying upfront wins because the <span className="text-indigo-400 font-semibold">{formatINR(inputs.upfrontDiscountAmount)} upfront discount</span> + <span className="text-indigo-300 font-semibold">{formatINR(inputs.processingFee)} processing fee saved</span> outweighs the investment growth of retaining cash over {inputs.emiTenureMonths} months at your assumed <span className="text-emerald-400 font-semibold">{inputs.investmentExpectedCagr}% CAGR</span>.
            </>
          ) : (
            <>
              No-Cost EMI wins because keeping <span className="text-emerald-400 font-semibold">{formatINR(inputs.purchasePrice)}</span> invested at <span className="text-emerald-300 font-semibold">{inputs.investmentExpectedCagr}% CAGR</span> generates more wealth than the upfront discount + fee costs.
            </>
          )}
        </p>

        {/* Side-by-side net value figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="p-3 rounded-xl bg-indigo-500/[0.04] border border-indigo-500/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
              <Tag size={12} className="text-indigo-400" /> Upfront Strategy Net Value
            </span>
            <p className="text-base font-bold font-mono text-white mt-1">
              {formatINR(finalUpfrontNetWorth)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
              <CreditCard size={12} className="text-emerald-400" /> EMI Strategy Net Value
            </span>
            <p className="text-base font-bold font-mono text-white mt-1">
              {formatINR(finalEmiNetWorth)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">
              Net Advantage
            </span>
            <p className={`text-base font-bold font-mono mt-1 ${isUpfrontWinner ? 'text-indigo-400' : 'text-emerald-400'}`}>
              +{formatINR(Math.abs(netWealthGapAtEnd))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
