'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UnderConstructionInputs } from '@/lib/types/finance';
import { formatINR } from '@/lib/utils/formatters';
import { CompactSlider } from '@/components/ui/CompactSlider';
import { MiniKpi } from '@/components/ui/MiniKpi';
import {
  Building2, Banknote, Landmark, Percent, Clock,
  TrendingUp, Home, Hammer,
  PiggyBank, LineChart, Wallet, ArrowUpDown, Layers,
} from 'lucide-react';

interface ControlPanelProps {
  inputs: UnderConstructionInputs;
  setInputs: React.Dispatch<React.SetStateAction<UnderConstructionInputs>>;
}

const tabs = [
  { id: 'property', label: 'Property & Tax' },
  { id: 'appreciation', label: 'Appreciation' },
  { id: 'rental', label: 'Rental Income' },
  { id: 'portfolio', label: 'Portfolio & Debt' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs }) => {
  const [activeTab, setActiveTab] = useState<TabId>('property');

  const handleChange = useCallback((name: string, value: number) => {
    setInputs(prev => ({ ...prev, [name as keyof UnderConstructionInputs]: value }));
  }, [setInputs]);

  const derived = useMemo(() => {
    const loanAmount = Math.max(0, inputs.propertyBaseValue - inputs.downPayment);
    const stampPct = inputs.stampDutyPercent ?? 6;
    const regPct = inputs.registrationPercent ?? 1;
    
    const stampDutyAmt = inputs.propertyBaseValue * (stampPct / 100);
    const registrationAmt = inputs.propertyBaseValue * (regPct / 100);
    const totalUpfront = inputs.downPayment + stampDutyAmt + registrationAmt;

    const r = inputs.homeLoanRate / 100 / 12;
    const n = inputs.homeLoanTenureYears * 12;
    const emi = loanAmount > 0 && r > 0
      ? loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      : 0;

    const trancheDemand = inputs.propertyBaseValue * 0.25;
    const initialLoanDisbursement = Math.min(loanAmount, Math.max(0, trancheDemand - inputs.downPayment));
    const preEmiInitial = initialLoanDisbursement * r;

    const initialLiquid = Math.min(inputs.totalPortfolio ?? 4000000, inputs.liquidBucketCapacity ?? 1000000);
    const initialEquity = Math.max(0, (inputs.totalPortfolio ?? 4000000) - initialLiquid);

    const rentalIncome = inputs.targetRentalIncomeMonthly ?? 0;
    const initialYield = inputs.propertyBaseValue > 0 ? (rentalIncome * 12 / inputs.propertyBaseValue) * 100 : 0;

    return {
      loanAmount,
      stampDutyAmt,
      registrationAmt,
      totalUpfront,
      emi,
      preEmiInitial,
      initialLiquid,
      initialEquity,
      initialYield,
    };
  }, [inputs]);

  return (
    <div className="card p-5 lg:h-full flex flex-col bg-[#0d0d14]/80">

      {/* Tabs */}
      <div className="relative flex mb-5 flex-shrink-0 bg-white/[0.03] p-1 rounded-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-1.5 text-[10px] font-semibold z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="uc-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-orange-500/20 border border-orange-500/30"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto pr-2 space-y-1">

        {activeTab === 'property' && (
          <>
            <CompactSlider label="Property Base Value" name="propertyBaseValue" min={2000000} max={100000000} step={500000} inputType="currency" icon={<Building2 size={13} />} value={inputs.propertyBaseValue} onChange={handleChange} accent="indigo" />
            <CompactSlider label="Down Payment" name="downPayment" min={500000} max={50000000} step={500000} inputType="currency" icon={<Banknote size={13} />} value={inputs.downPayment} onChange={handleChange} accent="indigo" />
            <CompactSlider label="Stamp Duty Rate" name="stampDutyPercent" min={1} max={10} step={0.5} inputType="percent" icon={<Landmark size={13} />} value={inputs.stampDutyPercent ?? 6} onChange={handleChange} hint={`= ${formatINR(derived.stampDutyAmt)}`} accent="indigo" />
            <CompactSlider label="Registration Rate" name="registrationPercent" min={0.5} max={3} step={0.25} inputType="percent" icon={<Landmark size={13} />} value={inputs.registrationPercent ?? 1} onChange={handleChange} hint={`= ${formatINR(derived.registrationAmt)}`} accent="indigo" />
            <CompactSlider label="Construction Period" name="constructionPeriodMonths" min={12} max={84} step={6} inputType="months" icon={<Clock size={13} />} value={inputs.constructionPeriodMonths} onChange={handleChange} accent="indigo" />

            <div className="mt-3 p-3 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/[0.08] grid grid-cols-3 gap-2">
              <MiniKpi label="Loan Amount" value={derived.loanAmount} isCurrency />
              <MiniKpi label="Day-1 Outflow" value={derived.totalUpfront} isCurrency />
              <MiniKpi label="Pre-EMI (M1)" value={derived.preEmiInitial} isCurrency />
            </div>
          </>
        )}

        {activeTab === 'appreciation' && (
          <>
            <CompactSlider label="Appreciation (Construction)" name="appreciationConstructionCagr" min={0} max={25} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.appreciationConstructionCagr} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Appreciation (Post-Possession)" name="appreciationPostPossessionCagr" min={0} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.appreciationPostPossessionCagr} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Monthly Society Maintenance" name="monthlySocietyMaintenance" min={1000} max={50000} step={500} inputType="currency" icon={<Home size={13} />} value={inputs.monthlySocietyMaintenance} onChange={handleChange} accent="emerald" />
          </>
        )}

        {activeTab === 'rental' && (
          <>
            <CompactSlider label="Target Rental Income (Monthly)" name="targetRentalIncomeMonthly" min={0} max={200000} step={1000} inputType="currency" icon={<Wallet size={13} />} value={inputs.targetRentalIncomeMonthly ?? 0} onChange={handleChange} hint={`= ${derived.initialYield.toFixed(2)}% Yield`} accent="indigo" />
            <CompactSlider label="Rental Income Escalation" name="rentalIncomeEscalation" min={0} max={15} step={0.5} inputType="percent" icon={<ArrowUpDown size={13} />} value={inputs.rentalIncomeEscalation} onChange={handleChange} accent="indigo" />

            <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 leading-relaxed space-y-2">
              <p className="text-white/60 font-semibold">How this works:</p>
              <p>If you <span className="text-orange-400">rent out</span> the property after possession, this rental income offsets your EMI + maintenance outflow from the portfolio.</p>
              <p>Set yield to <span className="text-white/60">0%</span> if you plan to <span className="text-indigo-400">self-occupy</span> (no rental income, but you save equivalent rent elsewhere).</p>
            </div>
          </>
        )}

        {activeTab === 'portfolio' && (
          <>
            <CompactSlider label="Total Portfolio Size" name="totalPortfolio" min={1000000} max={200000000} step={500000} inputType="currency" icon={<PiggyBank size={13} />} value={inputs.totalPortfolio} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Liquid Bucket Capacity" name="liquidBucketCapacity" min={100000} max={10000000} step={100000} inputType="currency" icon={<Layers size={13} />} value={inputs.liquidBucketCapacity} onChange={handleChange} hint={`MF = ${formatINR(derived.initialEquity)}`} accent="emerald" />
            <CompactSlider label="Liquid Fund Return" name="liquidFundReturn" min={4} max={12} step={0.1} inputType="percent" icon={<LineChart size={13} />} value={inputs.liquidFundReturn} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Equity MF Return" name="equityReturn" min={6} max={20} step={0.5} inputType="percent" icon={<TrendingUp size={13} />} value={inputs.equityReturn} onChange={handleChange} accent="emerald" />
            <CompactSlider label="LTCG Tax on Equity" name="ltcgTaxPercent" min={0} max={20} step={0.5} inputType="percent" icon={<Percent size={13} />} value={inputs.ltcgTaxPercent} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Home Loan Rate" name="homeLoanRate" min={6} max={14} step={0.25} inputType="percent" icon={<Landmark size={13} />} value={inputs.homeLoanRate} onChange={handleChange} accent="emerald" />
            <CompactSlider label="Home Loan Tenure" name="homeLoanTenureYears" min={5} max={30} step={1} inputType="years" icon={<Clock size={13} />} value={inputs.homeLoanTenureYears} onChange={handleChange} accent="emerald" />

            <div className="mt-3 p-3 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/[0.08] grid grid-cols-3 gap-2">
              <MiniKpi label="Liquid Buffer" value={derived.initialLiquid} isCurrency />
              <MiniKpi label="Equity MF" value={derived.initialEquity} isCurrency />
              <MiniKpi label="Full EMI" value={derived.emi} isCurrency />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
