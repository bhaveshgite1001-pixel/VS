'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RentVsBuyInputs } from '@/lib/types/finance';
import { formatINR, formatINRInput, parseINRInput } from '@/lib/utils/formatters';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { MiniKpi } from '@/components/ui/MiniKpi';
import { Home, Landmark, TrendingUp, Clock, Percent, Banknote, Building2, ArrowUpDown, PiggyBank, Calendar, MapPin, Flame } from 'lucide-react';

interface ControlPanelProps {
  inputs: RentVsBuyInputs;
  setInputs: React.Dispatch<React.SetStateAction<RentVsBuyInputs>>;
}

type InputType = 'currency' | 'percent' | 'years';

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const [activeTab, setActiveTab] = useState<'property' | 'market'>('property');

  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof RentVsBuyInputs]: value }));
  }, [setInputs]);

  const applyPreset = (preset: 'tier1' | 'starter' | 'high_growth') => {
    switch (preset) {
      case 'tier1':
        setInputs(prev => ({ ...prev, propertyValue: 15000000, currentMonthlyRent: 45000, propertyAppreciationRate: 6, equityCagr: 12 }));
        break;
      case 'starter':
        setInputs(prev => ({ ...prev, propertyValue: 6000000, currentMonthlyRent: 18000, propertyAppreciationRate: 5, equityCagr: 12 }));
        break;
      case 'high_growth':
        setInputs(prev => ({ ...prev, equityCagr: 15, rentEscalationRate: 8, propertyAppreciationRate: 7 }));
        break;
    }
  };

  const derived = useMemo(() => {
    const downPaymentAmt = inputs.propertyValue * (inputs.downPaymentPercent / 100);
    const stampDutyAmt = inputs.propertyValue * (inputs.stampDutyPercent / 100);
    const loanAmount = inputs.propertyValue - downPaymentAmt;
    const r = inputs.loanInterestRate / 100 / 12;
    const n = inputs.loanTenureYears * 12;
    const emi = loanAmount > 0 && r > 0 ? loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;
    const rentYieldPercent = inputs.propertyValue > 0 ? ((inputs.currentMonthlyRent * 12) / inputs.propertyValue) * 100 : 0;
    const maintenanceMonthly = (inputs.propertyValue * (inputs.propertyMaintenancePercent / 100)) / 12;
    const totalUpfront = downPaymentAmt + stampDutyAmt;
    return { downPaymentAmt, stampDutyAmt, loanAmount, emi, rentYieldPercent, maintenanceMonthly, totalUpfront };
  }, [inputs]);

  return (
    <div className="card p-5 lg:h-full flex flex-col bg-[#0d0d14]/80">
      {/* Presets */}
      <div className="flex gap-2 mb-4 flex-shrink-0 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'tier1' as const, label: 'Metro ₹1.5Cr', icon: MapPin },
          { key: 'starter' as const, label: 'Starter ₹60L', icon: Home },
          { key: 'high_growth' as const, label: 'High Growth', icon: Flame },
        ].map(p => {
          const Icon = p.icon;
          return (
            <motion.button
              key={p.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(p.key)}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 hover:text-white/80 transition-colors flex-shrink-0 cursor-pointer"
            >
               
              {p.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="relative flex mb-5 flex-shrink-0 bg-white/[0.03] p-1 rounded-2xl">
        {['property', 'market'].map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'property' ? 'Property & Loan' : 'Rent & Market';
          const accentColor = tab === 'property' ? 'bg-indigo-500' : 'bg-emerald-500';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative flex-1 py-1.5 text-xs font-semibold z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className={`absolute inset-0 rounded-xl ${accentColor}/20 border border-${accentColor.split('-')[1]}-500/30`}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-20">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto pr-2 space-y-1">
        {activeTab === 'property' ? (
          <>
            <CompactSlider label="Property Value" name="propertyValue" min={2000000} max={50000000} step={500000} inputType="currency" icon={<Building2 size={13} />} value={inputs.propertyValue} onChange={handleChange} accent="indigo" />
            <CompactSlider label="Down Payment" name="downPaymentPercent" min={10} max={50} step={5} inputType="percent" icon={<Banknote size={13} />} value={inputs.downPaymentPercent} onChange={handleChange} hint={`= ${formatINR(derived.downPaymentAmt)}`} accent="indigo" />
            <CompactSlider label="Loan Rate" name="loanInterestRate" min={6.5} max={14} step={0.25} inputType="percent" icon={<Percent size={13} />} value={inputs.loanInterestRate} onChange={handleChange} accent="indigo" />
            <CompactSlider label="Tenure" name="loanTenureYears" min={5} max={30} step={1} inputType="years" icon={<Clock size={13} />} value={inputs.loanTenureYears} onChange={handleChange} accent="indigo" />
            <CompactSlider label="Stamp Duty" name="stampDutyPercent" min={3} max={10} step={0.5} inputType="percent" icon={<Landmark size={13} />} value={inputs.stampDutyPercent} onChange={handleChange} hint={`= ${formatINR(derived.stampDutyAmt)}`} accent="indigo" />
            <CompactSlider label="Maintenance" name="propertyMaintenancePercent" min={0} max={3} step={0.25} inputType="percent" icon={<Home size={13} />} value={inputs.propertyMaintenancePercent} onChange={handleChange} hint={`= ${formatINR(derived.maintenanceMonthly)}/mo`} accent="indigo" />

            <div className="mt-3 p-3 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/[0.08] grid grid-cols-3 gap-2">
              <MiniKpi label="Loan" value={derived.loanAmount} isCurrency />
              <MiniKpi label="EMI" value={derived.emi} isCurrency />
              <MiniKpi label="Upfront" value={derived.totalUpfront} isCurrency />
            </div>
          </>
        ) : (
          <>
            <CompactSlider label="Monthly Rent" name="currentMonthlyRent" min={5000} max={200000} step={2500} inputType="currency" icon={<Home size={13} />} value={inputs.currentMonthlyRent} onChange={handleChange} hint={`Yield: ${derived.rentYieldPercent.toFixed(1)}%`} accent="emerald" />
            <CompactSlider label="Rent Escalation" name="rentEscalationRate" min={3} max={12} step={0.5} inputType="percent" icon={<ArrowUpDown size={13} />} value={inputs.rentEscalationRate} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Property Appr." name="propertyAppreciationRate" min={2} max={15} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.propertyAppreciationRate} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Equity CAGR" name="equityCagr" min={6} max={18} step={0.5} inputType="percent" icon={<PiggyBank size={13} />} value={inputs.equityCagr} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Horizon" name="comparisonHorizonYears" min={5} max={30} step={1} inputType="years" icon={<Calendar size={13} />} value={inputs.comparisonHorizonYears} onChange={handleChange} accent="emerald" />
          </>
        )}
      </div>
    </div>
  );
};

