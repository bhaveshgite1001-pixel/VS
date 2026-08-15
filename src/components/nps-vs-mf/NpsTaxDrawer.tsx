'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, ShieldCheck, TrendingUp, Calculator } from 'lucide-react';
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
              Assumptions, cash flows & Sec 80CCD(2) rules
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
            {/* STEP-BY-STEP TAX SAVED DERIVATION */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 font-mono text-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-sans">
                DERIVATION OF ₹{ (totalTaxSaved / 1e5).toFixed(2) }L TAX SAVED
              </span>
              <div className="space-y-1 text-[11px] text-white/80">
                <p>1. Annual Employer Match: <span className="font-bold text-indigo-400">{formatINR(annualContribution)}/yr</span></p>
                <p>2. Annual Tax Saved ({inputs.taxBracketPercent}% Slab): <span className="font-bold text-emerald-400">{formatINR(annualTaxSaved)}/yr</span></p>
                <p>3. Cumulative Tax Saved ({inputs.investmentHorizonYears} yrs): <span className="font-bold text-amber-300">{formatINR(totalTaxSaved)}</span></p>
              </div>
            </div>

            {/* SCANNING 1-2-3 STRATEGY STEPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* NPS STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={13} /> CORPORATE NPS STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">1. Upfront:</span> {inputs.employerMatchPercent}% employer match ({formatINR(annualContribution)}/yr) contributed tax-free.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">2. Side MF:</span> Tax savings ({formatINR(annualTaxSaved)}/yr) invested into side equity mutual fund.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">3. Wealth:</span> NPS corpus compounding at {inputs.npsExpectedCagr}% + Side MF value.
                  </p>
                </div>
              </div>

              {/* PURE MF STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={13} /> PURE MUTUAL FUND STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">1. Cash-Flow:</span> If skipping NPS, salary is received post-tax ({formatINR(annualContribution - annualTaxSaved)}/yr).
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">2. Monthly:</span> Post-tax amount invested in pure equity mutual funds.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">3. Wealth:</span> MF portfolio compounding at {inputs.mfExpectedCagr}% minus 12.5% LTCG.
                  </p>
                </div>
              </div>
            </div>

            {/* INCLUDED VS EXCLUDED LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">INCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Sec 80CCD(2) employer tax deduction (up to 14% New Tax Regime)</li>
                  <li>• Side MF compounding of annual tax savings</li>
                  <li>• 12.5% LTCG tax deduction on mutual fund gains</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">EXCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Sec 80C employee ₹1.5L limit</li>
                  <li>• Annuity pension taxation post age 60</li>
                  <li>• Early partial withdrawal penalties</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
