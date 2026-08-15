'use client';

import React from 'react';
import { formatINR } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface DynamicHeroProps {
  winner: 'buyer' | 'renter' | 'tie';
  netWealthGap: number;
  horizon: number;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({ winner, netWealthGap, horizon }) => {
  const isBuyer = winner === 'buyer';
  const isTie = winner === 'tie';

  const gradientClass = isTie
    ? 'from-zinc-500 via-zinc-400 to-zinc-500'
    : isBuyer
      ? 'from-blue-400 via-blue-500 to-indigo-500'
      : 'from-emerald-400 via-emerald-500 to-teal-500';

  const bgGlowClass = isTie
    ? ''
    : isBuyer
      ? 'glow-blue'
      : 'glow-emerald';

  const IconComponent = isTie ? Scale : isBuyer ? TrendingUp : TrendingDown;

  return (
    <div className={`relative overflow-hidden glass-card p-8 md:p-10 ${bgGlowClass} animate-float-in`}>
      {/* Background decorative gradient blob */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${isBuyer ? 'bg-blue-500' : isTie ? 'bg-zinc-500' : 'bg-emerald-500'}`} />
      <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-10 ${isBuyer ? 'bg-indigo-500' : isTie ? 'bg-zinc-500' : 'bg-teal-500'}`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${isBuyer ? 'bg-blue-500/15 text-blue-400' : isTie ? 'bg-zinc-500/15 text-zinc-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            <IconComponent size={22} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-zinc-500">
            {horizon}-Year Verdict
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5">
          {isTie ? (
            <span className="text-zinc-300">It&apos;s a dead heat.</span>
          ) : (
            <>
              <span className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent animate-gradient`}>
                {isBuyer ? 'Buying' : 'Renting'} wins
              </span>
              <br />
              <span className="text-white">
                by {formatINR(Math.abs(netWealthGap))}
              </span>
            </>
          )}
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
          {isBuyer
            ? 'Property equity accumulation outpaces the renter\'s invested portfolio over this timeframe.'
            : isTie
              ? 'Both strategies deliver nearly identical net worth at this horizon.'
              : 'The renter\'s compounding investments exceed the homeowner\'s equity, even after accounting for appreciation.'}
        </p>
      </div>
    </div>
  );
};
