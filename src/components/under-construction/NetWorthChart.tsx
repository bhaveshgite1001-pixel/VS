'use client';

import React from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { UCYearData } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';

interface PortfolioChartProps {
  data: UCYearData[];
  possessionYear: number;
  startingPortfolio: number;
}

export function PortfolioChart({ data, possessionYear, startingPortfolio }: PortfolioChartProps) {
  const formatYAxis = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `₹${(v / 1e5).toFixed(0)}L`;
    if (abs >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
    return `₹${v}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-zinc-950/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
        <p className="font-mono font-bold text-white/80 text-[11px] mb-2">Year {label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-white/60">{entry.name}</span>
            </span>
            <span className="font-mono font-medium text-white/90">
              {formatINR(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
      {payload?.map((entry: any) => (
        <span key={entry.dataKey} className="flex items-center gap-1.5 text-[9px] text-white/50">
          <span className="w-2.5 h-[3px] rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-white/40">
          Portfolio & Loan Trajectory (30 Years)
        </h3>
      </div>
      <div className="h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>


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
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <ReferenceLine
              x={possessionYear}
              stroke="rgba(249,115,22,0.4)"
              strokeDasharray="4 4"
              label={{ value: 'Possession', fill: 'rgba(249,115,22,0.6)', fontSize: 9, position: 'top' }}
            />



            <Line
              type="monotone"
              dataKey="totalPortfolio"
              name="Portfolio After Buying House"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
