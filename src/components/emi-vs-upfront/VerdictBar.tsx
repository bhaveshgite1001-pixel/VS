'use client';

import React from 'react';
import { EmiVsUpfrontResult } from '@/lib/types/finance';
import { TrendingUp, Scale, Banknote, ShieldCheck } from 'lucide-react';
import { GenericVerdictBar, WinnerConfig, VerdictKpi } from '@/components/ui/GenericVerdictBar';

interface VerdictBarProps {
  result: EmiVsUpfrontResult;
  tenureMonths: number;
}

const winnerConfig: Record<string, WinnerConfig> = {
  upfront: {
    colorHex: '#6366f1',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    borderGlow: 'rgba(99, 102, 241, 0.3)',
    Icon: ShieldCheck,
    label: 'Pay Upfront'
  },
  emi: {
    colorHex: '#10b981',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    borderGlow: 'rgba(52, 211, 153, 0.3)',
    Icon: TrendingUp,
    label: 'Take the EMI'
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

export const VerdictBar: React.FC<VerdictBarProps> = ({ result, tenureMonths }) => {
  const { winner, netWealthGapAtEnd, finalUpfrontNetWorth, finalEmiNetWorth, totalHiddenCosts } = result;

  const kpis: VerdictKpi[] = [
    {
      icon: <ShieldCheck size={14} />,
      label: "Upfront Net Value",
      numericValue: finalUpfrontNetWorth,
      isCurrency: true,
      accentClass: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20'
    },
    {
      icon: <TrendingUp size={14} />,
      label: "EMI Net Value",
      numericValue: finalEmiNetWorth,
      isCurrency: true,
      accentClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
    },
    {
      icon: <Banknote size={14} />,
      label: "EMI Hidden Costs",
      numericValue: totalHiddenCosts,
      isCurrency: true,
      isWarning: totalHiddenCosts > 0,
      accentClass: totalHiddenCosts > 0 ? "text-amber-400 bg-amber-400/10 border-amber-500/20" : "text-zinc-400 bg-zinc-400/10 border-zinc-500/20"
    },
    {
      icon: <Scale size={14} />,
      label: "Net Difference",
      numericValue: Math.abs(netWealthGapAtEnd),
      isCurrency: true,
      prefix: netWealthGapAtEnd > 0 ? '+ ' : '- ',
      accentClass: netWealthGapAtEnd > 0 ? 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
    }
  ];

  return (
    <GenericVerdictBar 
      winnerId={winner}
      title={`${tenureMonths}-Month Verdict`}
      winnerConfig={winnerConfig}
      gapValue={winner !== 'tie' ? netWealthGapAtEnd : undefined}
      kpis={kpis}
    />
  );
};
