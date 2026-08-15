'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, Landmark, TrendingUp, Info } from 'lucide-react';
import { EpfVsIndexInputs, EpfVsIndexResult } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface EpfMethodologyDrawerProps {
  inputs: EpfVsIndexInputs;
  result: EpfVsIndexResult;
}

export const EpfMethodologyDrawer: React.FC<EpfMethodologyDrawerProps> = ({ inputs, result }) => {
  const [isOpen, setIsOpen] = useState(false);

  const monthlyContribution = inputs.monthlyBasicSalary * (inputs.vpfContributionPercent / 100);
  const annualContribution = monthlyContribution * 12;

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
              Assumptions, EPF tax threshold & compounding rules
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
              {/* EPF/VPF STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark size={13} /> MAX EPF/VPF STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">1. Contribution:</span> {inputs.vpfContributionPercent}% of basic salary ({formatINR(monthlyContribution)}/mo).
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">2. Interest:</span> Guaranteed {inputs.epfInterestRate}% compounding per year.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">3. Tax Threshold:</span> Interest on annual contribution above ₹2.5L is taxed at {inputs.taxBracketPercent}%.
                  </p>
                </div>
              </div>

              {/* INDEX FUND STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={13} /> INDEX FUND STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">1. Contribution:</span> Same monthly outlay ({formatINR(monthlyContribution)}/mo) into index funds.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">2. Return:</span> Equity market return compounding at {inputs.indexFundExpectedCagr}% CAGR.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">3. Wealth:</span> Final portfolio minus 12.5% LTCG tax on capital gains.
                  </p>
                </div>
              </div>
            </div>

            {/* FAIRNESS COMPARISON RULE */}
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200">
              <span className="font-bold uppercase tracking-wider block text-[10px] text-indigo-300 mb-0.5">COMPARISON RULE</span>
              Both strategies invest the exact same monthly contribution ({formatINR(monthlyContribution)}/mo) over the exact same {inputs.investmentHorizonYears}-year horizon.
            </div>

            {/* INCLUDED VS EXCLUDED LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">INCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Guaranteed EPF 8.25% interest rate</li>
                  <li>• ₹2.5L annual VPF contribution tax-free cap</li>
                  <li>• Tax at {inputs.taxBracketPercent}% on VPF interest above ₹2.5L</li>
                  <li>• 12.5% LTCG tax on index fund gains</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">EXCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Employer EPF 12% mandatory match (equal on both sides)</li>
                  <li>• Sec 80C initial tax deduction</li>
                  <li>• Emergency loan withdrawal options</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
