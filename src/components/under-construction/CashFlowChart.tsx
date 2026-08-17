'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { UCYearData } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface CashFlowChartProps {
  data: UCYearData[];
  possessionYear: number;
}

export function CashFlowChart({ data, possessionYear }: CashFlowChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    upfront: d.upfrontPaid > 0 ? -d.upfrontPaid : 0,
    preEmi: d.preEmi > 0 ? -d.preEmi : 0,
    emi: d.emi > 0 ? -d.emi : 0,
    maintenance: d.maintenancePaid > 0 ? -d.maintenancePaid : 0,
    rentalIncome: d.rentalIncome,
  }));

  const formatYAxis = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1e7) return `${v < 0 ? '-' : ''}₹${(abs / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `${v < 0 ? '-' : ''}₹${(abs / 1e5).toFixed(0)}L`;
    if (abs >= 1e3) return `${v < 0 ? '-' : ''}₹${(abs / 1e3).toFixed(0)}k`;
    return `₹${v}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-zinc-950/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
        <p className="font-mono font-bold text-white/80 text-[11px] mb-2">Year {label}</p>
        {payload.map((entry: any) => {
          if (entry.value === 0) return null;
          return (
            <div key={entry.dataKey} className="flex justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-white/60">{entry.name}</span>
              </span>
              <span className={`font-mono font-medium ${entry.value > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formatINR(Math.abs(entry.value))}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-white/40">
          Portfolio Cash Flow Drain
        </h3>
        <div className="flex items-center gap-3 text-[9px] text-white/40">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Rental Income</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Outflows</span>
        </div>
      </div>
      <div className="h-[280px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} stackOffset="sign" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="year"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
            <ReferenceLine
              x={possessionYear}
              stroke="rgba(249,115,22,0.4)"
              strokeDasharray="4 4"
              label={{ value: 'Possession', fill: 'rgba(249,115,22,0.6)', fontSize: 9, position: 'top' }}
            />
            <Bar dataKey="upfront" name="Upfront (Down Payment + Taxes)" stackId="stack" fill="#f43f5e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="preEmi" name="Pre-EMI Interest" stackId="stack" fill="#f87171" radius={[0, 0, 4, 4]} />
            <Bar dataKey="emi" name="Annual EMI" stackId="stack" fill="#f97316" />
            <Bar dataKey="maintenance" name="Annual Maintenance" stackId="stack" fill="#fbbf24" />
            <Bar dataKey="rentalIncome" name="Annual Rental Income" stackId="stack" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
