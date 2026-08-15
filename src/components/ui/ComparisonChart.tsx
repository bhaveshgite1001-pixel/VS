'use client';

import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceDot, ReferenceLine, Label
} from 'recharts';

export interface ChartDataPoint {
  [key: string]: any;
}

export interface LineConfig {
  key: string;
  label: string;
  color: string;
}

export interface ComparisonChartProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  lineA: LineConfig;
  lineB: LineConfig;
  breakEvenXValue?: number | string | null;
  title?: string;
  formatYAxis?: (val: number) => string;
  formatTooltipValue?: (val: number) => string;
  xAxisLabelPrefix?: string;
}

export function ComparisonChart({ 
  data, 
  xAxisKey, 
  lineA, 
  lineB, 
  breakEvenXValue, 
  title = "Projection", 
  formatYAxis = (v) => v.toString(),
  formatTooltipValue = (v) => v.toString(),
  xAxisLabelPrefix = ""
}: ComparisonChartProps) {
  const breakEvenPoint = breakEvenXValue ? data.find(d => d[xAxisKey] === breakEvenXValue) : null;
  const lastPoint = data[data.length - 1];

  const isNumericX = data.length > 0 && typeof data[0][xAxisKey] === 'number';
  const maxVal = isNumericX ? data[data.length - 1]?.[xAxisKey] : data.length;
  const tickInterval = maxVal > 120 ? 60 : maxVal >= 20 ? 5 : 1;
  const ticks = isNumericX ? Array.from({ length: Math.floor(maxVal / tickInterval) }, (_, i) => (i + 1) * tickInterval) : undefined;

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full w-full p-5 bg-white/[0.02] border border-white/5 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0 px-2">
        <h3 className="text-[10px] font-semibold text-white/30 tracking-[0.15em] uppercase">{title}</h3>
        <div className="flex items-center gap-4">
          <Dot color={lineA.color} label={lineA.label} />
          <Dot color={lineB.color} label={lineB.label} />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineA.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={lineA.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineB.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={lineB.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={true} horizontal={true} />
            
            <XAxis dataKey={xAxisKey} stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter' }}
              tickLine={false} axisLine={false} ticks={ticks} tickMargin={10} />
            <YAxis stroke="transparent"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Inter' }}
              tickLine={false} axisLine={false} width={50}
              tickFormatter={(v) => v === 0 ? '₹0' : formatYAxis(v)} />
            
            <Tooltip
              position={{ y: 0 }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length < 2) return null;
                const valA = payload.find(p => p.dataKey === lineA.key)?.value as number || 0;
                const valB = payload.find(p => p.dataKey === lineB.key)?.value as number || 0;
                const d = valA - valB;
                const absDiff = Math.abs(d);
                const winnerLabel = d > 0 ? lineA.label : lineB.label;
                const winnerColor = d > 0 ? lineA.color : lineB.color;
                
                return (
                  <div className="p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-w-[160px] bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-2xl">
                    <p className="text-white/40 font-bold text-[10px] uppercase tracking-wider mb-3">{xAxisLabelPrefix}{label}</p>
                    <Row dotColor={lineA.color} lbl={lineA.label} val={formatTooltipValue(valA)} />
                    <Row dotColor={lineB.color} lbl={lineB.label} val={formatTooltipValue(valB)} />
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 font-medium">{winnerLabel} ahead by</span>
                      <span className="font-mono text-[12px] font-bold" style={{ color: winnerColor, textShadow: `0 0 8px ${winnerColor}80` }}>
                        {formatTooltipValue(absDiff)}
                      </span>
                    </div>
                  </div>
                );
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            
            <Area type="monotone" dataKey={lineA.key} stroke={lineA.color} strokeWidth={3}
              fillOpacity={1} fill="url(#gradientA)" dot={false}
              activeDot={{ r: 4, fill: lineA.color, stroke: '#0a0a0f', strokeWidth: 2, style: { filter: `drop-shadow(0px 0px 6px ${lineA.color})` } }}
              style={{ filter: `drop-shadow(0px 0px 8px ${lineA.color}60)` }}
              isAnimationActive={true} animationDuration={1500} />
            
            <Area type="monotone" dataKey={lineB.key} stroke={lineB.color} strokeWidth={3}
              fillOpacity={1} fill="url(#gradientB)" dot={false}
              activeDot={{ r: 4, fill: lineB.color, stroke: '#0a0a0f', strokeWidth: 2, style: { filter: `drop-shadow(0px 0px 6px ${lineB.color})` } }}
              style={{ filter: `drop-shadow(0px 0px 8px ${lineB.color}60)` }}
              isAnimationActive={true} animationDuration={1500} />
            
            {breakEvenXValue && breakEvenPoint && (
              <>
                <ReferenceLine x={breakEvenXValue} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} strokeOpacity={0.5} />
                <ReferenceDot x={breakEvenPoint[xAxisKey]} y={breakEvenPoint[lineA.key]} r={6} fill="#0a0a0f" stroke="#f59e0b" strokeWidth={3} />
                <ReferenceDot x={breakEvenPoint[xAxisKey]} y={breakEvenPoint[lineA.key]} r={12} fill="transparent" stroke="#f59e0b" strokeWidth={1} strokeOpacity={0.3} />
              </>
            )}

            {lastPoint && (
              <>
                <ReferenceDot x={lastPoint[xAxisKey]} y={lastPoint[lineA.key]} r={0} stroke="none" fill="none">
                  <Label content={(props: any) => <CustomEndLabel {...props} color={lineA.color} text={formatYAxis(lastPoint[lineA.key])} />} />
                </ReferenceDot>
                <ReferenceDot x={lastPoint[xAxisKey]} y={lastPoint[lineB.key]} r={0} stroke="none" fill="none">
                  <Label content={(props: any) => <CustomEndLabel {...props} color={lineB.color} text={formatYAxis(lastPoint[lineB.key])} />} />
                </ReferenceDot>
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
      <span className="text-[11px] text-white/50 font-semibold">{label}</span>
    </div>
  );
}

function Row({ dotColor, lbl, val }: { dotColor: string; lbl: string; val: string }) {
  return (
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[11px] text-white/60 flex items-center gap-1.5 font-medium">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }}/>
        {lbl}
      </span>
      <span className="font-mono text-[12px] text-white font-bold">{val}</span>
    </div>
  );
}

function CustomEndLabel({ viewBox, color, text }: any) {
  const { cx, cy } = viewBox;
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  return (
    <g>
      <line x1={cx} y1={cy} x2={cx + 6} y2={cy} stroke={color} strokeDasharray="2 2" opacity={0.6} />
      <foreignObject x={cx + 6} y={cy - 12} width={80} height={24} style={{ overflow: 'visible' }}>
        <div className="flex justify-start pl-1">
          <span className="bg-zinc-800/90 backdrop-blur-sm border border-white/5 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap" style={{ color: color, textShadow: `0 0 8px ${color}80` }}>
            {text}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
