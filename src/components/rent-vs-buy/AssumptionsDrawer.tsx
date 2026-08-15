'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check, ShieldAlert, Percent, Landmark } from 'lucide-react';
import { RentVsBuyInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface AssumptionsDrawerProps {
  inputs: RentVsBuyInputs;
}

export const AssumptionsDrawer: React.FC<AssumptionsDrawerProps> = ({ inputs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const downPaymentAmt = inputs.propertyValue * (inputs.downPaymentPercent / 100);
  const stampDutyAmt = inputs.propertyValue * (inputs.stampDutyPercent / 100);
  const loanPrincipal = inputs.propertyValue - downPaymentAmt;

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
            <h4 className="text-xs font-bold text-white tracking-wide uppercase tracking-[0.15em]">
              Model Assumptions & Methodology
            </h4>
            <p className="text-[10px] text-white/40">
              Tax rules, cash-flow reinvestment logic, & frictional costs accounted for
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
              {/* Left Column: Buyer Side Logic */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark size={13} /> Buyer Model Rules
                </h5>
                <ul className="space-y-1.5 text-[11px] text-white/60">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Upfront Outflow: Down Payment ({formatINR(downPaymentAmt)}) + Stamp Duty ({formatINR(stampDutyAmt)}).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Ongoing Costs: EMI + Maintenance ({inputs.propertyMaintenancePercent}% p.a. of current property value).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Equity Calculation: Current Property Value minus Remaining Loan Balance.</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Renter Side Logic */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent size={13} /> Renter Opportunity Model
                </h5>
                <ul className="space-y-1.5 text-[11px] text-white/60">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Initial Portfolio: Invests total upfront cost ({formatINR(downPaymentAmt + stampDutyAmt)}) into equity at day 0.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Monthly Surplus SIP: Renter invests monthly savings <code>(EMI + Maintenance − Rent)</code> into equity at {inputs.equityCagr}% CAGR.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Rent Growth: Rent escalates at {inputs.rentEscalationRate}% annually.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-200/70 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-400 flex-shrink-0" />
              <span>
                Note: Standard tax deduction under Sec 24b is excluded for conservative baseline estimation. Actual wealth gap may vary based on personal tax slabs and LTCG applicability at sale.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
