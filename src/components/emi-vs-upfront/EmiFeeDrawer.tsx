'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, ShoppingCart, CreditCard, Info } from 'lucide-react';
import { EmiVsUpfrontInputs, EmiVsUpfrontResult } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface EmiFeeDrawerProps {
  inputs: EmiVsUpfrontInputs;
  result: EmiVsUpfrontResult;
}

export const EmiFeeDrawer: React.FC<EmiFeeDrawerProps> = ({ inputs, result }) => {
  const [isOpen, setIsOpen] = useState(false);

  const discount = inputs.upfrontDiscountAmount;
  const processingFee = inputs.processingFee;
  const totalHiddenCosts = result.totalHiddenCosts;
  const gstOnInterest = Math.max(0, totalHiddenCosts - processingFee);

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
              Assumptions, cash flows & hidden fee mechanics
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
              {/* UPFRONT STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingCart size={13} /> UPFRONT STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">1. Outflow:</span> Pays discounted price ({formatINR(inputs.purchasePrice - discount)}) immediately on Day 0.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">2. Monthly:</span> Zero recurring monthly payments or fees.
                  </p>
                  <p>
                    <span className="font-mono text-indigo-400 font-bold">3. Wealth:</span> Upfront discount saved ({formatINR(discount)}) invested into equity.
                  </p>
                </div>
              </div>

              {/* NO-COST EMI STEPS */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={13} /> NO-COST EMI STRATEGY
                </h5>
                <div className="space-y-1.5 text-[11px] text-white/70">
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">1. Retained Cash:</span> Retains {formatINR(inputs.purchasePrice)} cash to invest at {inputs.investmentExpectedCagr}% CAGR.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">2. Outflows:</span> Processing fee ({formatINR(processingFee)}) + Monthly EMI + 18% GST on interest.
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400 font-bold">3. Wealth:</span> Net value of invested cash minus total monthly outflows over {inputs.emiTenureMonths} months.
                  </p>
                </div>
              </div>
            </div>

            {/* INCLUDED VS EXCLUDED LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">INCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Upfront discount value ({formatINR(discount)})</li>
                  <li>• One-time processing fee ({formatINR(processingFee)})</li>
                  <li>• Mandatory 18% GST on bank financing interest</li>
                  <li>• Monthly compounding of retained cash</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">EXCLUDED</span>
                <ul className="space-y-0.5 text-white/60">
                  <li>• Credit card reward points / cashback</li>
                  <li>• Default or late payment penalty charges</li>
                  <li>• Inflation adjustment over short tenure</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
