'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { EpfVsIndexInputs } from '@/lib/types/finance';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { Building2, Landmark, PiggyBank, Clock, Percent, TrendingUp, Flame, Star, ShieldCheck } from 'lucide-react';

interface ControlPanelProps {
  inputs: EpfVsIndexInputs;
  setInputs: React.Dispatch<React.SetStateAction<EpfVsIndexInputs>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof EpfVsIndexInputs]: value }));
  }, [setInputs]);

  const applyPreset = (preset: 'starter' | 'mid' | 'senior') => {
    switch (preset) {
      case 'starter':
        setInputs(prev => ({ ...prev, monthlyBasicSalary: 50000, vpfContributionPercent: 12, taxBracketPercent: 30 }));
        break;
      case 'mid':
        setInputs(prev => ({ ...prev, monthlyBasicSalary: 120000, vpfContributionPercent: 20, taxBracketPercent: 30 }));
        break;
      case 'senior':
        setInputs(prev => ({ ...prev, monthlyBasicSalary: 250000, vpfContributionPercent: 5, taxBracketPercent: 30 }));
        break;
    }
  };

  return (
    <div className="lg:h-full flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">

      <div className="mb-4">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Salary & VPF</h4>
        <div className="space-y-1">
          <CompactSlider label="Monthly Basic Salary" name="monthlyBasicSalary" min={20000} max={1000000} step={5000} inputType="currency" icon={<Building2 size={13} />} value={inputs.monthlyBasicSalary} onChange={handleChange} accent="indigo" />
          <CompactSlider label="VPF Contribution" name="vpfContributionPercent" min={0} max={88} step={1} inputType="percent" icon={<PiggyBank size={13} />} value={inputs.vpfContributionPercent} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Tax Bracket" name="taxBracketPercent" min={0} max={40} step={1} inputType="percent" icon={<Landmark size={13} />} value={inputs.taxBracketPercent} onChange={handleChange} accent="indigo" />
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Market Assumptions</h4>
        <div className="space-y-1">
          <CompactSlider label="EPF Interest Rate" name="epfInterestRate" min={7} max={9} step={0.1} inputType="percent" icon={<Percent size={13} />} value={inputs.epfInterestRate} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Index Fund CAGR" name="indexFundExpectedCagr" min={8} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.indexFundExpectedCagr} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Horizon" name="investmentHorizonYears" min={5} max={40} step={1} inputType="years" icon={<Clock size={13} />} value={inputs.investmentHorizonYears} onChange={handleChange} accent="emerald" />
        </div>
      </div>
    </div>
  );
};
