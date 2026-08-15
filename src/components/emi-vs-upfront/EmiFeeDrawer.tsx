'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, CreditCard, Percent, Landmark } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <HelpCircle size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
              Fee Breakdown & No-Cost Subvention Mechanics
            </h4>
            <p className="text-[10px] text-white/40">
              Why 15% bank interest is charged & breakdown of {formatINR(totalHiddenCosts)} hidden costs
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
            className="border-t border-white/5 p-5 space-y-4 text-xs"
          >
            {/* Explicit Fee Table */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">1. Upfront Discount Forgone</span>
                <span className="text-amber-400 font-bold">{formatINR(discount)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">2. Processing Fee (One-Time)</span>
                <span className="text-rose-400 font-bold">{formatINR(processingFee)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">3. 18% GST on Bank Interest Component ({inputs.emiInterestRatePercent}% Rate)</span>
                <span className="text-rose-400 font-bold">{formatINR(gstOnInterest)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-white">
                <span>Total Financing Outflow Cost</span>
                <span className="text-amber-300">{formatINR(discount + totalHiddenCosts)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <CreditCard size={12} /> Merchant Interest Subvention
                </span>
                <p className="text-[11px] text-white/60">
                  On "No-Cost EMI", the merchant discounts the item price by the interest amount so the bank charges 15% interest without increasing your principal EMI.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Landmark size={12} /> Why GST Appears
                </span>
                <p className="text-[11px] text-white/60">
                  Government regulations mandate 18% GST on bank interest components, which cannot be waived or subvented by the merchant.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
