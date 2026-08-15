'use client';

import React from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { formatINR } from '@/lib/utils/formatters';

interface MiniKpiProps {
  label: string;
  value: number;
  isCurrency?: boolean;
}

export function MiniKpi({ label, value, isCurrency }: MiniKpiProps) {
  return (
    <div className="text-center">
      <p className="text-[9px] text-indigo-300/50 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
      <p className="text-[12px] font-bold text-white font-mono">
        {isCurrency ? <AnimatedNumber value={value} formatFn={formatINR} /> : <AnimatedNumber value={value} />}
      </p>
    </div>
  );
}
