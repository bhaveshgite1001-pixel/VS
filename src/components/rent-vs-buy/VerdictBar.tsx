'use client';

import React from 'react';
import { RentVsBuyResult } from '@/lib/types/finance';
import { TrendingUp, TrendingDown, Scale, CalendarCheck, Banknote, Home, ArrowRightLeft } from 'lucide-react';
import { GenericVerdictBar, WinnerConfig, VerdictKpi } from '@/components/ui/GenericVerdictBar';

interface VerdictBarProps {
  result: RentVsBuyResult;
  horizon: number;
  emi: number;
  currentRent: number;
}

const winnerConfig: Record<string, WinnerConfig> = {
  buyer: {
    colorHex: '#6366f1',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    borderGlow: 'rgba(99, 102, 241, 0.3)',
    Icon: TrendingUp,
    label: 'Buying wins'
  },
  renter: {
    colorHex: '#10b981',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    borderGlow: 'rgba(52, 211, 153, 0.3)',
    Icon: TrendingDown,
    label: 'Renting wins'
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

export const VerdictBar: React.FC<VerdictBarProps> = ({ result, horizon, emi, currentRent }) => {
  const { winner, netWealthGapAtHorizon, breakEvenYear, totalInterestPaid, totalRentPaid } = result;
  
  const monthlyCashFlowDiff = emi - currentRent;

  const kpis: VerdictKpi[] = [
    {
      icon: <CalendarCheck size={14} />,
      label: "Break-Even",
      value: breakEvenYear ? `Year ${breakEvenYear}` : 'Never',
      accentClass: breakEvenYear ? 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20' : 'text-amber-400 bg-amber-400/10 border-amber-500/30',
      isWarning: !breakEvenYear
    },
    {
      icon: <Banknote size={14} />,
      label: "Interest Paid",
      numericValue: totalInterestPaid,
      isCurrency: true,
      accentClass: "text-rose-400 bg-rose-400/10 border-rose-500/20"
    },
    {
      icon: <Home size={14} />,
      label: "Rent Paid",
      numericValue: totalRentPaid,
      isCurrency: true,
      accentClass: "text-violet-400 bg-violet-400/10 border-violet-500/20"
    },
    {
      icon: <ArrowRightLeft size={14} />,
      label: "EMI − Rent",
      numericValue: monthlyCashFlowDiff,
      prefix: monthlyCashFlowDiff > 0 ? '+' : '',
      isCurrency: true,
      accentClass: monthlyCashFlowDiff > 0 ? 'text-rose-400 bg-rose-400/10 border-rose-500/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
    }
  ];

  return (
    <GenericVerdictBar 
      winnerId={winner}
      title={`${horizon}-Year Verdict`}
      winnerConfig={winnerConfig}
      gapValue={winner !== 'tie' ? netWealthGapAtHorizon : undefined}
      kpis={kpis}
    />
  );
};
