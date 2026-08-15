'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { PrepayVsInvestInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface TaxMethodologyDrawerProps {
  inputs: PrepayVsInvestInputs;
}

export const TaxMethodologyDrawer: React.FC<TaxMethodologyDrawerProps> = ({ inputs }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      {/* Tappable Full-Bar Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
            <HelpCircle size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase tracking-[0.15em] truncate">
              How This Result Is Calculated
            </h4>
            <p className="text-[10px] text-white/40 truncate mt-0.5">
              Assumptions, cash flows & LTCG tax rules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium flex-shrink-0 ml-2">
          <span>{isOpen ? 'Hide' : 'View methodology'}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
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
            className="border-t border-white/5 p-4 md:p-5 space-y-4 text-xs"
          >
            {/* SCANNING 1-2-3 STRATEGY STEPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* PREPAY STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={13} /> PREPAY STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">1. Upfront:</span> Lump sum ({formatINR(inputs.lumpsumAmount)}) clears loan principal directly.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">2. Monthly:</span> Extra monthly prepayment accelerates payoff date.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">3. Reinvestment:</span> Once debt-free, freed-up EMI flows into equity compounding.
                  </p>
                </div>
              </div>

              {/* INVEST STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={13} /> INVEST STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">1. Upfront:</span> Lump sum ({formatINR(inputs.lumpsumAmount)}) invested into equity on Day 1.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">2. Monthly:</span> Extra monthly surplus invested into equity portfolio.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">3. Wealth:</span> Net portfolio minus {inputs.capitalGainsTaxRate}% LTCG tax on gains.
                  </p>
                </div>
              </div>
            </div>

            {/* FAIRNESS COMPARISON RULE */}
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-indigo-300 mb-0.5">COMPARISON RULE</span>
              Both scenarios start with the exact same lump sum ({formatINR(inputs.lumpsumAmount)}) and monthly surplus ({formatINR(inputs.monthlyAdditionalPrepayment)}), evaluated over the full {inputs.remainingTenureYears}-year tenure.
            </div>

            {/* INCLUDED VS EXCLUDED LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">INCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Guaranteed interest savings at {inputs.loanInterestRate}%</li>
                  <li>• Reinvestment of freed-up EMI post loan payoff</li>
                  <li>• LTCG tax ({inputs.capitalGainsTaxRate}%) on net gains</li>
                  <li>• Full loan amortization compounding</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">EXCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Section 24(b) & Sec 80C tax deductions</li>
                  <li>• Personal income tax slab variations</li>
                  <li>• Emergency liquidity preferences</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
