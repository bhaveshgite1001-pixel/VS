'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { formatINR } from '@/lib/utils/formatters';
import { UnderConstructionResult } from '@/lib/types/finance';
import { ShieldCheck, AlertTriangle, PiggyBank, Wallet, Receipt, Banknote, Calendar, ArrowRightLeft } from 'lucide-react';

interface HeroKpisProps {
  result: UnderConstructionResult;
}

export function HeroKpis({ result }: HeroKpisProps) {
  const {
    requiredStartingPortfolio,
    startingPortfolio,
    portfolioGap,
    isPortfolioSufficient,
    depletionYearMonth,
    totalCashDrained,
    totalInterestPaid,
    emiAmount,
    yearlyData,
  } = result;

  const finalYear = yearlyData[yearlyData.length - 1];
  const finalNetWorth = finalYear ? finalYear.propertyValue + finalYear.totalPortfolio - finalYear.loanOutstanding : 0;

  const statusText = isPortfolioSufficient
    ? `Surplus of ${formatINR(Math.abs(portfolioGap))}`
    : `Deficit of ${formatINR(Math.abs(portfolioGap))}`;

  const depletionText = depletionYearMonth
    ? `Runs out Yr ${depletionYearMonth.year}, Mo ${depletionYearMonth.month}`
    : 'Never Depleted';

  return (
    <div className="space-y-3">
      {/* Top Banner: Core Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isPortfolioSufficient
            ? 'bg-emerald-500/[0.05] border-emerald-500/20'
            : 'bg-amber-500/[0.05] border-amber-500/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl flex-shrink-0 ${
              isPortfolioSufficient
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isPortfolioSufficient ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Required Starting Portfolio:</span>
              <span className="text-amber-300 font-mono text-base">{formatINR(requiredStartingPortfolio)}</span>
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              {isPortfolioSufficient
                ? `Your current portfolio (${formatINR(startingPortfolio)}) is sufficient to cover all costs.`
                : `Your current portfolio (${formatINR(startingPortfolio)}) will deplete in Year ${depletionYearMonth?.year}, Month ${depletionYearMonth?.month}. You need ${formatINR(Math.abs(portfolioGap))} more.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <div
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
              isPortfolioSufficient
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {statusText}
          </div>
        </div>
      </motion.div>

      {/* Grid of 6 KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {/* KPI 1: Required Portfolio */}
        <div className="relative p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-amber-400">
              <PiggyBank size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Required Portfolio
              </span>
            </div>
            <p className="text-[14px] font-bold font-mono text-amber-300 tracking-tight">
              <AnimatedNumber value={requiredStartingPortfolio} formatFn={formatINR} />
            </p>
          </div>
        </div>

        {/* KPI 2: Your Portfolio */}
        <div className="relative p-3.5 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
              <Wallet size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Your Portfolio
              </span>
            </div>
            <p className="text-[14px] font-bold font-mono text-white tracking-tight">
              <AnimatedNumber value={startingPortfolio} formatFn={formatINR} />
            </p>
          </div>
        </div>

        {/* KPI 3: Depletion Timeline */}
        <div className="relative p-3.5 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
              <Calendar size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Depletion Time
              </span>
            </div>
            <p className={`text-[13px] font-bold font-mono tracking-tight ${depletionYearMonth ? 'text-amber-400' : 'text-emerald-400'}`}>
              {depletionText}
            </p>
          </div>
        </div>

        {/* KPI 4: Total Cash Drained */}
        <div className="relative p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-amber-400">
              <Receipt size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Total Cash Outflows
              </span>
            </div>
            <p className="text-[14px] font-bold font-mono text-white tracking-tight">
              <AnimatedNumber value={totalCashDrained} formatFn={formatINR} />
            </p>
          </div>
        </div>

        {/* KPI 5: Total Net Worth */}
        <div className="relative p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
              <PiggyBank size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Final Net Worth (Yr 30)
              </span>
            </div>
            <p className="text-[14px] font-bold font-mono text-white tracking-tight">
              <AnimatedNumber value={finalNetWorth} formatFn={formatINR} />
            </p>
          </div>
        </div>

        {/* KPI 6: Monthly EMI */}
        <div className="relative p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1 text-amber-400">
              <Banknote size={14} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-semibold text-white/40">
                Monthly EMI
              </span>
            </div>
            <p className="text-[14px] font-bold font-mono text-white tracking-tight">
              <AnimatedNumber value={emiAmount} formatFn={formatINR} />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
