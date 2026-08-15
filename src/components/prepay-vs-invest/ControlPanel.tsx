'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { PrepayVsInvestInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { Building2, Landmark, PiggyBank, Clock, Banknote, Percent, Flame, Home, Target, TrendingUp } from 'lucide-react';

interface ControlPanelProps {
  inputs: PrepayVsInvestInputs;
  setInputs: React.Dispatch<React.SetStateAction<PrepayVsInvestInputs>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof PrepayVsInvestInputs]: value }));
  }, [setInputs]);

  const applyPreset = (preset: 'bonus' | 'aggressive' | 'steady') => {
    switch (preset) {
      case 'bonus':
        setInputs(prev => ({ ...prev, lumpsumAmount: 1000000, monthlyAdditionalPrepayment: 0 }));
        break;
      case 'aggressive':
        setInputs(prev => ({ ...prev, lumpsumAmount: 500000, monthlyAdditionalPrepayment: 50000 }));
        break;
      case 'steady':
        setInputs(prev => ({ ...prev, lumpsumAmount: 0, monthlyAdditionalPrepayment: 25000 }));
        break;
    }
  };

  return (
    <div className="card p-5 lg:h-full flex flex-col bg-[#0d0d14]/80">
      {/* Presets */}
      <div className="flex gap-2 mb-5 flex-shrink-0 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'bonus' as const, label: '₹10L Bonus', icon: Banknote },
          { key: 'aggressive' as const, label: 'Aggressive EMIs', icon: Flame },
          { key: 'steady' as const, label: 'Steady SIP', icon: Target },
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

      <div className="mb-4">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Current Loan</h4>
        <div className="space-y-1">
          <CompactSlider label="Outstanding Balance" name="outstandingLoanBalance" min={1000000} max={30000000} step={100000} inputType="currency" icon={<Building2 size={13} />} value={inputs.outstandingLoanBalance} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Remaining Tenure" name="remainingTenureYears" min={1} max={30} step={1} inputType="years" icon={<Clock size={13} />} value={inputs.remainingTenureYears} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Interest Rate" name="loanInterestRate" min={6} max={14} step={0.1} inputType="percent" icon={<Percent size={13} />} value={inputs.loanInterestRate} onChange={handleChange} accent="indigo" />
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Deployment</h4>
        <div className="space-y-1">
          <CompactSlider label="Lump Sum Available" name="lumpsumAmount" min={0} max={10000000} step={50000} inputType="currency" icon={<Landmark size={13} />} value={inputs.lumpsumAmount} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Extra Monthly" name="monthlyAdditionalPrepayment" min={0} max={200000} step={5000} inputType="currency" icon={<PiggyBank size={13} />} value={inputs.monthlyAdditionalPrepayment} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Expected Return" name="investmentExpectedCagr" min={6} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.investmentExpectedCagr} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Tax Rate (LTCG)" name="capitalGainsTaxRate" min={0} max={30} step={2.5} inputType="percent" icon={<Landmark size={13} />} value={inputs.capitalGainsTaxRate} onChange={handleChange} accent="emerald" />
        </div>
      </div>
    </div>
  );
};
