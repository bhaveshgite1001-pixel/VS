'use client';

import React from 'react';
import { formatINR } from '@/lib/utils/formatters';
import { RentVsBuyResult } from '@/lib/types/finance';
import { CalendarCheck, TrendingUp, Banknote, Home } from 'lucide-react';

interface SummaryStatsProps {
  result: RentVsBuyResult;
}

interface StatCardData {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  accentColor: string;
  bgGlow: string;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ result }) => {
  const { breakEvenYear, totalInterestPaid, totalRentPaid, netWealthGapAtHorizon } = result;

  const stats: StatCardData[] = [
    {
      title: 'Break-Even Year',
      value: breakEvenYear ? `Year ${breakEvenYear}` : 'Never',
      icon: <CalendarCheck size={18} strokeWidth={2} />,
      subtitle: breakEvenYear ? 'Buyer overtakes renter' : 'Within this horizon',
      accentColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-orange-500/5',
    },
    {
      title: 'Net Wealth Gap',
      value: formatINR(Math.abs(netWealthGapAtHorizon)),
      icon: <TrendingUp size={18} strokeWidth={2} />,
      subtitle: `${netWealthGapAtHorizon > 0 ? 'Buyer' : 'Renter'} is ahead`,
      accentColor: netWealthGapAtHorizon > 0 ? 'text-blue-400' : 'text-emerald-400',
      bgGlow: netWealthGapAtHorizon > 0 ? 'from-blue-500/10 to-indigo-500/5' : 'from-emerald-500/10 to-teal-500/5',
    },
    {
      title: 'Total Interest Paid',
      value: formatINR(totalInterestPaid),
      icon: <Banknote size={18} strokeWidth={2} />,
      subtitle: 'Sunk cost for buyer',
      accentColor: 'text-rose-400',
      bgGlow: 'from-rose-500/10 to-pink-500/5',
    },
    {
      title: 'Total Rent Paid',
      value: formatINR(totalRentPaid),
      icon: <Home size={18} strokeWidth={2} />,
      subtitle: 'Sunk cost for renter',
      accentColor: 'text-violet-400',
      bgGlow: 'from-violet-500/10 to-purple-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-float-in" style={{ animationDelay: '0.2s' }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden glass-card-subtle p-5 hover:border-zinc-600/50 transition-all duration-300"
        >
          {/* Subtle background glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative z-10">
            <div className={`inline-flex p-2 rounded-xl bg-zinc-800/60 ${stat.accentColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500 mb-1.5">{stat.title}</p>
            <p className="text-xl font-extrabold text-white font-mono tabular-nums tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-zinc-500 mt-1.5">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
