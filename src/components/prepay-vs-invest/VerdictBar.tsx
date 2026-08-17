'use client';

import React from 'react';
import { PrepayVsInvestResult } from '@/lib/types/finance';
import { TrendingUp, Flame, Scale, CalendarCheck, Banknote, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { GenericVerdictBar, WinnerConfig, VerdictKpi } from '@/components/ui/GenericVerdictBar';

interface VerdictBarProps {
  result: PrepayVsInvestResult;
  outstandingLoan: number;
}

const winnerConfig: Record<string, WinnerConfig> = {
  prepay: {
    colorHex: '#6366f1',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    borderGlow: 'rgba(99, 102, 241, 0.3)',
    Icon: Flame,
    label: 'Prepaying wins'
  },
  invest: {
    colorHex: '#10b981',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    borderGlow: 'rgba(52, 211, 153, 0.3)',
    Icon: TrendingUp,
    label: 'Investing wins'
  },
  tie: {
    colorHex: '#9ca3af',
    bgClass: 'bg-zinc-500/10',
    textClass: 'text-zinc-300',
    glowColor: 'rgba(156, 163, 175, 0.1)',
    borderGlow: 'rgba(255, 255, 255, 0.05)',
    Icon: Scale,
    label: 'Dead heat'
  }
};

export const VerdictBar: React.FC<VerdictBarProps> = ({ result, outstandingLoan }) => {
  const { winner, netWealthGapAtEnd, loanClearedMonthPrepay, loanClearedMonthInvest, totalInterestPrepay, totalInterestInvest } = result;
  
  const interestSaved = totalInterestInvest - totalInterestPrepay;
  const monthsSaved = loanClearedMonthInvest - loanClearedMonthPrepay;
  const yearsSaved = Math.floor(monthsSaved / 12);
  const remainingMonths = monthsSaved % 12;
  const timeSavedStr = yearsSaved > 0 
    ? `${yearsSaved}y ${remainingMonths > 0 ? remainingMonths + 'm' : ''}`
    : `${monthsSaved}m`;

  const kpis: VerdictKpi[] = [
    {
      icon: <ShieldCheck size={14} />,
      label: "Debt Free (Prepay)",
      value: `Month ${loanClearedMonthPrepay}`,
      accentClass: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20'
    },
    {
      icon: <CalendarCheck size={14} />,
      label: "Debt Free (Invest)",
      value: `Month ${loanClearedMonthInvest}`,
      accentClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
    },
    {
      icon: <Banknote size={14} />,
      label: "Interest Saved",
      numericValue: interestSaved > 0 ? interestSaved : 0,
      isCurrency: true,
      accentClass: interestSaved > 0 ? "text-indigo-400 bg-indigo-400/10 border-indigo-500/20" : "text-zinc-400 bg-zinc-400/10 border-zinc-500/20"
    },
    {
      icon: <ArrowRightLeft size={14} />,
      label: "Time Saved",
      value: monthsSaved > 0 ? timeSavedStr : 'None',
      accentClass: monthsSaved > 0 ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' : 'text-zinc-400 bg-zinc-400/10 border-zinc-500/20'
    }
  ];

  return (
    <GenericVerdictBar 
      winnerId={winner}
      title="End-of-Term Verdict"
      winnerConfig={winnerConfig}
      gapValue={winner !== 'tie' ? netWealthGapAtEnd : undefined}
      kpis={kpis}
    />
  );
};
