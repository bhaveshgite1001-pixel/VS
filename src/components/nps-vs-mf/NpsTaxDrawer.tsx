'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, Landmark, Calculator } from 'lucide-react';
import { NpsVsMfInputs, NpsVsMfResult } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface NpsTaxDrawerProps {
  inputs: NpsVsMfInputs;
  result: NpsVsMfResult;
}

export const NpsTaxDrawer: React.FC<NpsTaxDrawerProps> = ({ inputs, result }) => {
  const [isOpen, setIsOpen] = useState(false);

  const annualContribution = result.annualEmployerContribution;
  const annualTaxSaved = result.annualTaxSaved;
  const totalTaxSaved = result.totalTaxSaved;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calculator size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
              Derivation of ₹{ (totalTaxSaved / 1e5).toFixed(2) }L Tax Saved
            </h4>
            <p className="text-[10px] text-white/40">
              Step-by-step breakdown under Sec 80CCD(2) Corporate NPS rules
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
            {/* Step-by-step Mathematical Derivation */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">1. Basic Salary</span>
                <span className="text-white font-bold">{formatINR(inputs.basicSalary)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">2. Employer NPS Match ({inputs.employerMatchPercent}%)</span>
                <span className="text-indigo-400 font-bold">{formatINR(annualContribution)}/yr</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">3. Annual Tax Saved ({inputs.taxBracketPercent}% Slab)</span>
                <span className="text-emerald-400 font-bold">{formatINR(annualTaxSaved)}/yr</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-amber-300">
                <span>4. Cumulative Tax Saved ({inputs.investmentHorizonYears} yrs)</span>
                <span>{formatINR(annualTaxSaved)} × {inputs.investmentHorizonYears} = {formatINR(totalTaxSaved)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Sec 80CCD(2) Rule</span>
                <p className="text-[11px] text-white/60">
                  Employer contributions up to 10% of basic salary are 100% tax-exempt over and above the ₹1.5L limit of Sec 80C.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Terminal Tax Rule</span>
                <p className="text-[11px] text-white/60">
                  At retirement (age 60), 60% of NPS corpus is 100% tax-free lump sum. 40% goes into annuity which yields taxable pension income.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
