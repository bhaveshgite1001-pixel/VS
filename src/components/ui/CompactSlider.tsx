'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { formatINR, formatINRInput, parseINRInput } from '@/lib/utils/formatters';

export type InputType = 'currency' | 'percent' | 'years' | 'months';

interface CompactSliderProps {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  inputType: InputType;
  icon: React.ReactNode;
  value: number;
  onChange: (name: string, value: number) => void;
  hint?: string;
  accent: 'indigo' | 'emerald';
}

export function CompactSlider({ label, name, min, max, step, inputType, icon, value, onChange, hint, accent }: CompactSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState('');

  const dp = (() => { const s = String(step); const d = s.indexOf('.'); return d === -1 ? 0 : s.length - d - 1; })();
  const rp = (n: number) => parseFloat(n.toFixed(Math.max(dp, 2)));
  const fill = ((value - min) / (max - min)) * 100;

  const display = () => {
    switch (inputType) {
      case 'currency': return <AnimatedNumber value={value} formatFn={formatINR} />;
      case 'percent': return <><AnimatedNumber value={value} formatFn={(v) => rp(v).toString()} />%</>;
      case 'years': return <><AnimatedNumber value={value} formatFn={(v) => Math.round(v).toString()} /> yrs</>;
      case 'months': return <><AnimatedNumber value={value} formatFn={(v) => Math.round(v).toString()} /> mo</>;
    }
  };

  const rawEditable = () => {
    switch (inputType) {
      case 'currency': return formatINRInput(value);
      case 'percent': return String(rp(value));
      case 'years': return String(Math.round(value));
      case 'months': return String(Math.round(value));
    }
  };

  const startEdit = () => { setIsEditing(true); setTextValue(rawEditable()); };
  
  const commitEdit = () => {
    setIsEditing(false);
    let parsed: number | null = null;
    if (inputType === 'currency') {
      parsed = parseINRInput(textValue);
    } else {
      const val = parseFloat(textValue);
      if (!isNaN(val)) parsed = val;
    }
    if (parsed !== null) {
      onChange(name, rp(Math.min(max, Math.max(min, parsed))));
    }
  };
  
  const sliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, rp(Math.round(parseFloat(e.target.value) / step) * step));
  };
  
  const keyDown = (e: React.KeyboardEvent) => { 
    if (e.key === 'Enter') commitEdit(); 
    if (e.key === 'Escape') setIsEditing(false); 
  };

  const gradientFrom = accent === 'indigo' ? 'from-indigo-500' : 'from-emerald-400';
  const gradientTo = accent === 'indigo' ? 'to-indigo-400' : 'to-emerald-300';
  const glowColor = accent === 'indigo' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(52, 211, 153, 0.5)';

  return (
    <div className="group py-1.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/30 group-hover:text-white/50 transition-colors flex-shrink-0">{icon}</span>
          <span className="text-[12px] font-medium text-white/50 group-hover:text-white/80 truncate transition-colors tracking-wide">{label}</span>
          {hint && <span className="text-[10px] text-white/30 font-medium truncate ml-1">{hint}</span>}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            {inputType === 'currency' && <span className="text-[12px] text-white/40">₹</span>}
            <input type="text" autoFocus value={textValue}
              onChange={(e) => setTextValue(e.target.value)} onBlur={commitEdit} onKeyDown={keyDown}
              className={`w-24 text-right text-[12px] font-medium text-white bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded outline-none focus:border-${accent}-500/50`} />
            {inputType === 'percent' && <span className="text-[12px] text-white/40">%</span>}
            {inputType === 'years' && <span className="text-[12px] text-white/40">yrs</span>}
            {inputType === 'months' && <span className="text-[12px] text-white/40">mo</span>}
          </div>
        ) : (
          <button onClick={startEdit}
            className="text-[13px] font-medium text-white tracking-wide tabular-nums px-1 py-0.5 rounded cursor-text flex-shrink-0 transition-colors hover:text-white/70"
            title="Click to type">
            {display()}
          </button>
        )}
      </div>
      <div className="relative h-[12px] flex items-center group-hover:opacity-100 opacity-80 transition-opacity">
        <div className="absolute w-full h-[2px] rounded-full bg-white/[0.05]" />
        <motion.div 
          className={`absolute left-0 h-[2px] rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} pointer-events-none`} 
          style={{ boxShadow: `0 0 8px ${glowColor}` }}
          animate={{ width: `${fill}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        />
        <input 
          type="range" min={min} max={max} step={step} value={value} onChange={sliderChange} 
          className="w-full relative z-10 opacity-0 cursor-pointer h-full" 
        />
        <motion.div
          className="absolute h-[10px] w-[10px] rounded-full bg-white pointer-events-none"
          style={{ boxShadow: `0 0 10px ${glowColor}` }}
          animate={{ left: `calc(${fill}% - 5px)` }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        />
      </div>
    </div>
  );
}
