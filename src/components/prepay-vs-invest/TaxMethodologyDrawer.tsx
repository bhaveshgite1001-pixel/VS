'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, Percent, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { PrepayVsInvestInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface TaxMethodologyDrawerProps {
  inputs: PrepayVsInvestInputs;
}

export const TaxMethodologyDrawer: React.FC<TaxMethodologyDrawerProps> = ({ inputs }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <HelpCircle size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
              Tax Treatment & Cash-Flow Methodology
            </h4>
            <p className="text-[10px] text-white/40">
              LTCG tax logic ({inputs.capitalGainsTaxRate}%) & post-payoff EMI reinvestment compounding
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/30 uppercase">[ Details ]</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-white/40" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5 p-5 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Prepay Strategy Cash Flow Rules */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRightLeft size={13} /> Prepay Strategy Cash-Flow Chain
                </h5>
                <ul className="space-y-1.5 text-[11px] text-white/60">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Lump sum ({formatINR(inputs.lumpsumAmount)}) + Extra Monthly ({formatINR(inputs.monthlyAdditionalPrepayment)}) prepays principal directly.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Once the loan is cleared early, the entire freed-up base EMI is automatically redirected into equity investments for the remaining months.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Guaranteed return: Saves interest at {inputs.loanInterestRate}% risk-free.</span>
                  </li>
                </ul>
              </div>

              {/* Invest Strategy Cash Flow Rules */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent size={13} /> Invest Strategy & LTCG Tax
                </h5>
                <ul className="space-y-1.5 text-[11px] text-white/60">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Lump sum + monthly extra is invested into equity portfolio at {inputs.investmentExpectedCagr}% CAGR.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Taxation: LTCG tax ({inputs.capitalGainsTaxRate}%) is applied exclusively to net capital gains (Portfolio Value minus Total Invested Principal).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Loan continues standard EMI repayment for the full {inputs.remainingTenureYears}-year tenure.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-200/70 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-400 flex-shrink-0" />
              <span>
                Note: LTCG tax is modeled flat on total capital gains above cost basis. Sec 80C principal deduction and Sec 24b home loan interest tax benefits are held constant across both models for fair baseline comparison.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
