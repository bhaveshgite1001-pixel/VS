'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '@/lib/utils/formatters';
import { AlertCircle } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export interface VerdictKpi {
  icon: React.ReactNode;
  label: string;
  value?: string;
  numericValue?: number;
  prefix?: string;
  isCurrency?: boolean;
  isWarning?: boolean;
  accentClass: string;
}

export interface WinnerConfig {
  colorHex: string;
  bgClass: string;
  textClass: string;
  glowColor: string;
  borderGlow: string;
  Icon: React.ElementType;
  label: string;
}

export interface GenericVerdictBarProps {
  winnerId: string;
  title: string;
  winnerConfig: Record<string, WinnerConfig>;
  gapValue?: number;
  kpis: VerdictKpi[];
}

export function GenericVerdictBar({ winnerId, title, winnerConfig, gapValue, kpis }: GenericVerdictBarProps) {
  const [prevWinner, setPrevWinner] = useState(winnerId);
  const [justFlipped, setJustFlipped] = useState(false);
  
  useEffect(() => {
    if (winnerId !== prevWinner && prevWinner !== 'tie' && winnerId !== 'tie') {
      setJustFlipped(true);
      const t = setTimeout(() => setJustFlipped(false), 1000);
      setPrevWinner(winnerId);
      return () => clearTimeout(t);
    }
    setPrevWinner(winnerId);
  }, [winnerId, prevWinner]);

  const config = winnerConfig[winnerId] || winnerConfig['tie'] || Object.values(winnerConfig)[0];
  const isTie = winnerId === 'tie';

  return (
    <motion.div 
      className="relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-[100px]"
          animate={{ 
            backgroundColor: config.colorHex,
            scale: justFlipped ? [1, 1.2, 1] : 1,
            opacity: justFlipped ? [0.2, 0.4, 0.2] : 0.2
          }}
          transition={{ duration: justFlipped ? 0.8 : 0.5 }}
        />
      </div>

      <div className="relative z-10 px-2">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-2">{title}</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-none flex flex-wrap items-baseline gap-1.5">
            <AnimatePresence mode="popLayout">
              {isTie ? (
                <motion.span 
                  key="tie"
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  className="text-white/80"
                >
                  {config.label}
                </motion.span>
              ) : (
                <React.Fragment key="winner">
                  <motion.span 
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                    className={config.textClass}
                    style={{ textShadow: `0 0 20px ${config.glowColor}` }}
                  >
                    {config.label}
                  </motion.span>
                  {gapValue !== undefined && (
                    <>
                      <motion.span 
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                        className="text-white/30 text-2xl lg:text-3xl font-medium ml-1"
                      >
                        by
                      </motion.span>
                      <motion.span 
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                        className="text-white ml-1 font-medium tracking-tight"
                      >
                        <AnimatedNumber value={Math.abs(gapValue)} formatFn={formatINR} />
                      </motion.span>
                    </>
                  )}
                </React.Fragment>
              )}
            </AnimatePresence>
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {kpis.map((kpi, idx) => (
            <KpiCard key={idx} {...kpi} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function KpiCard({ icon, label, value, numericValue, prefix = '', accentClass, isWarning, isCurrency }: VerdictKpi) {
  return (
    <div className={`flex flex-col gap-1.5 min-w-[120px] relative`}>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-white/30 font-mono">[ {label} ]</span>
        {isWarning && (
          <div className="text-amber-500/50">
            <AlertCircle size={10} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className={`text-[15px] font-medium tracking-tight ${isWarning ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`}>
        {prefix}
        {numericValue !== undefined ? <AnimatedNumber value={numericValue} formatFn={isCurrency ? formatINR : undefined} /> : value}
      </p>
    </div>
  );
}
