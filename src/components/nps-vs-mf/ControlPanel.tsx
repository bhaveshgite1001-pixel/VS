'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { NpsVsMfInputs } from '@/lib/types/finance';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { Building2, Landmark, PiggyBank, Clock, Percent, TrendingUp, Flame, Star, ShieldCheck } from 'lucide-react';

interface ControlPanelProps {
  inputs: NpsVsMfInputs;
  setInputs: React.Dispatch<React.SetStateAction<NpsVsMfInputs>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof NpsVsMfInputs]: value }));
  }, [setInputs]);

  const applyPreset = (preset: 'starter' | 'mid' | 'senior') => {
    switch (preset) {
      case 'starter':
        setInputs(prev => ({ ...prev, basicSalary: 800000, taxBracketPercent: 30, employerMatchPercent: 10 }));
        break;
      case 'mid':
        setInputs(prev => ({ ...prev, basicSalary: 1500000, taxBracketPercent: 30, employerMatchPercent: 10 }));
        break;
      case 'senior':
        setInputs(prev => ({ ...prev, basicSalary: 3000000, taxBracketPercent: 30, employerMatchPercent: 14 }));
        break;
    }
  };

  return (
    <div className="card p-5 lg:h-full flex flex-col bg-[#0d0d14]/80">

      <div className="mb-4">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Income & Tax</h4>
        <div className="space-y-1">
          <CompactSlider label="Basic Salary" name="basicSalary" min={500000} max={10000000} step={100000} inputType="currency" icon={<Building2 size={13} />} value={inputs.basicSalary} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Employer Match" name="employerMatchPercent" min={0} max={14} step={1} inputType="percent" icon={<PiggyBank size={13} />} value={inputs.employerMatchPercent} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Tax Bracket" name="taxBracketPercent" min={0} max={40} step={1} inputType="percent" icon={<Landmark size={13} />} value={inputs.taxBracketPercent} onChange={handleChange} accent="indigo" />
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Market Assumptions</h4>
        <div className="space-y-1">
          <CompactSlider label="Expected Return (NPS)" name="npsExpectedCagr" min={6} max={15} step={0.5} inputType="percent" icon={<Percent size={13} />} value={inputs.npsExpectedCagr} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Expected Return (MF)" name="mfExpectedCagr" min={8} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.mfExpectedCagr} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Horizon" name="investmentHorizonYears" min={5} max={40} step={1} inputType="years" icon={<Clock size={13} />} value={inputs.investmentHorizonYears} onChange={handleChange} accent="emerald" />
        </div>
      </div>
    </div>
  );
};
