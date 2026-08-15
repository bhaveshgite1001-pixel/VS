'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { EmiVsUpfrontInputs } from '@/lib/types/finance';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { ShoppingCart, Banknote, Percent, Clock, TrendingUp, Laptop, Smartphone, CarFront } from 'lucide-react';

interface ControlPanelProps {
  inputs: EmiVsUpfrontInputs;
  setInputs: React.Dispatch<React.SetStateAction<EmiVsUpfrontInputs>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof EmiVsUpfrontInputs]: value }));
  }, [setInputs]);

  const applyPreset = (preset: 'phone' | 'laptop' | 'car') => {
    switch (preset) {
      case 'phone':
        setInputs(prev => ({ ...prev, purchasePrice: 80000, upfrontDiscountAmount: 4000, emiTenureMonths: 6, processingFee: 199 }));
        break;
      case 'laptop':
        setInputs(prev => ({ ...prev, purchasePrice: 150000, upfrontDiscountAmount: 10000, emiTenureMonths: 9, processingFee: 499 }));
        break;
      case 'car':
        setInputs(prev => ({ ...prev, purchasePrice: 1500000, upfrontDiscountAmount: 50000, emiTenureMonths: 60, processingFee: 5000 }));
        break;
    }
  };

  return (
    <div className="card p-5 lg:h-full flex flex-col bg-[#0d0d14]/80">
      {/* Presets */}
      <div className="flex gap-2 mb-5 flex-shrink-0 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'phone' as const, label: 'Phone', icon: Smartphone },
          { key: 'laptop' as const, label: 'Laptop', icon: Laptop },
          { key: 'car' as const, label: 'Car Loan', icon: CarFront },
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
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Purchase Details</h4>
        <div className="space-y-1">
          <CompactSlider label="Purchase Price" name="purchasePrice" min={10000} max={3000000} step={5000} inputType="currency" icon={<ShoppingCart size={13} />} value={inputs.purchasePrice} onChange={handleChange} accent="indigo" />
          <CompactSlider label="Upfront Discount" name="upfrontDiscountAmount" min={0} max={200000} step={500} inputType="currency" icon={<Banknote size={13} />} value={inputs.upfrontDiscountAmount} onChange={handleChange} accent="indigo" />
          <CompactSlider label="EMI Tenure (Months)" name="emiTenureMonths" min={3} max={84} step={3} inputType="years" icon={<Clock size={13} />} value={inputs.emiTenureMonths} onChange={handleChange} accent="indigo" />
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2">Hidden Costs & Market</h4>
        <div className="space-y-1">
          <CompactSlider label="Bank Interest Rate" name="emiInterestRatePercent" min={8} max={24} step={0.5} inputType="percent" icon={<Percent size={13} />} value={inputs.emiInterestRatePercent} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Processing Fee" name="processingFee" min={0} max={10000} step={99} inputType="currency" icon={<Banknote size={13} />} value={inputs.processingFee} onChange={handleChange} accent="emerald" />
          <CompactSlider label="Invested Cash CAGR" name="investmentExpectedCagr" min={6} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.investmentExpectedCagr} onChange={handleChange} accent="emerald" />
        </div>
      </div>
    </div>
  );
};
