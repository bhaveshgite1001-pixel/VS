'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RentVsBuyResult, RentVsBuyInputs } from '@/lib/types/finance';
import { Compass, TrendingUp, LineChart, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SensitivityAnalysisProps {
  result: RentVsBuyResult;
  inputs: RentVsBuyInputs;
}

export const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ result, inputs }) => {
  const { winner, breakEvenYear, sensitivity } = result;
  const { breakEvenAppreciationRate, breakEvenEquityCagr } = sensitivity;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-tight text-white uppercase tracking-[0.15em]">
            What Changes the Winner?
          </h3>
          <p className="text-[10px] text-white/40 font-medium">
            Dynamic sensitivity analysis for your target horizon ({inputs.comparisonHorizonYears} yrs)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tipping Point 1: Appreciation */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Property Appr.</span>
            <TrendingUp size={14} className="text-indigo-400" />
          </div>
          <div>
            {breakEvenAppreciationRate !== null ? (
              <>
                <p className="text-sm font-semibold text-white/90">
                  {winner === 'renter' ? 'Buy wins if appreciation exceeds ' : 'Rent wins if appreciation drops below '}
                  <span className="text-indigo-400 font-bold font-mono">{breakEvenAppreciationRate}%</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Current model assumption: <span className="text-white/70 font-mono">{inputs.propertyAppreciationRate}%</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-white/60">
                {winner === 'buyer' 
                  ? 'Buying remains ahead across realistic appreciation rates.' 
                  : 'Renting remains ahead even at 35%+ appreciation.'}
              </p>
            )}
          </div>
        </div>

        {/* Tipping Point 2: Equity CAGR */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Equity CAGR</span>
            <LineChart size={14} className="text-emerald-400" />
          </div>
          <div>
            {breakEvenEquityCagr !== null ? (
              <>
                <p className="text-sm font-semibold text-white/90">
                  {winner === 'buyer' ? 'Rent wins if equity CAGR exceeds ' : 'Buy wins if equity CAGR drops below '}
                  <span className="text-emerald-400 font-bold font-mono">{breakEvenEquityCagr}%</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Current model assumption: <span className="text-white/70 font-mono">{inputs.equityCagr}%</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-white/60">
                {winner === 'renter' 
                  ? 'Renting remains ahead across realistic CAGR ranges.' 
                  : 'Buying remains ahead even at high market returns.'}
              </p>
            )}
          </div>
        </div>

        {/* Tipping Point 3: Time Horizon Break Even */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Time Horizon</span>
            {breakEvenYear ? <CheckCircle2 size={14} className="text-indigo-400" /> : <AlertTriangle size={14} className="text-amber-400" />}
          </div>
          <div>
            {breakEvenYear ? (
              <>
                <p className="text-sm font-semibold text-white/90">
                  Buying breaks even after <span className="text-indigo-400 font-bold font-mono">{breakEvenYear} years</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Selected horizon: <span className="text-white/70 font-mono">{inputs.comparisonHorizonYears} yrs</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-amber-300">
                  Buying does not break even within {inputs.comparisonHorizonYears} years
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  Renting remains net-worth positive throughout.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
