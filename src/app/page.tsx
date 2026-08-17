'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Home, ShieldCheck, Briefcase, ShoppingCart, ArrowRight, Landmark, Building2, Compass, Share2, CheckCircle2, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

const flagshipTool = {
  id: 'rent-vs-buy',
  title: 'Rent vs. Buy',
  badge: '🔥 Flagship Decision',
  question: 'Should your down payment become home equity or compound in market funds?',
  output: 'Find your break-even crossover year',
  icon: Home,
  color: '#6366f1',
  bg: 'bg-indigo-500/10',
  border: 'border-indigo-500/20',
  link: '/compare/rent-vs-buy',
};

const secondaryTools = [
  {
    id: 'prepay-vs-invest',
    title: 'Prepay vs. Invest',
    question: 'Should you clear home loan debt early or invest the surplus into equity?',
    output: 'Find break-even investment return',
    icon: Briefcase,
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    link: '/compare/prepay-vs-invest',
  },
  {
    id: 'nps-vs-mf',
    title: 'NPS vs. Mutual Funds',
    question: 'Does 14% tax-free employer match beat uncapped equity mutual fund returns?',
    output: 'See tax savings & liquidity trade-off',
    icon: ShieldCheck,
    color: '#8b5cf6',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    link: '/compare/nps-vs-mf',
  },
  {
    id: 'epf-vs-index',
    title: 'EPF vs. Index Funds',
    question: 'Compare EPF tax advantages & 8.25% interest against liquid equity funds.',
    output: 'See post-tax wealth projection',
    icon: Landmark,
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    link: '/compare/epf-vs-index',
  },
  {
    id: 'emi-vs-upfront',
    title: 'No-Cost EMI vs. Upfront',
    question: 'Expose hidden fees & 18% GST vs taking the upfront discount.',
    output: 'See required investment return',
    icon: ShoppingCart,
    color: '#ec4899',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    link: '/compare/emi-vs-upfront',
  },
  {
    id: 'under-construction',
    title: 'Under-Construction Property',
    question: 'Model the full 30-year lifecycle: GST tranches, Pre-EMI, possession shock & rental yield.',
    output: 'See cash flow burn & net worth journey',
    icon: Building2,
    color: '#f97316',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    link: '/compare/under-construction',
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/[0.04] blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/[0.03] blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <BrandLogo size="md" showTagline />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>5 Decision Engines Live</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-4 space-y-20">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
              <Sparkles size={13} /> Pure Math. Zero Bias. Live Sensitivity.
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.05]">
              Financial decisions,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                simulated.
              </span>
            </h2>

            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
              Stop guessing. Start calculating. Choose two financial paths, model the tax-adjusted compounding, and discover the exact assumptions that flip the winner.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/compare/rent-vs-buy" 
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2"
              >
                <span>Simulate Rent vs Buy</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* HERO VISUAL MINI-DEMO COMPONENT */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono uppercase text-white/40 tracking-wider">Live Simulation Preview</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Break-Even Engine</span>
              </div>

              {/* Sample Mini Chart Output */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white/50 font-medium">Verdict:</span>
                  <span className="text-lg font-bold text-emerald-400">Renting wins by ₹3.36 Cr</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-indigo-400">Buyer NW (Yr 20): ₹7.2 Cr</span>
                    <span className="text-emerald-400">Renter NW (Yr 20): ₹10.5 Cr</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-indigo-500 h-full w-[40%]" />
                    <div className="bg-emerald-500 h-full w-[60%]" />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
                  <span>Tipping Point:</span>
                  <span className="font-mono font-bold">Buy wins if Appreciation &gt; 7.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DECISION ENGINES GRID SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">Select a Decision Engine</h3>
              <p className="text-xs md:text-sm text-white/50">High-precision simulators tailored for Indian tax & market conditions</p>
            </div>
          </div>

          {/* FLAGSHIP CARD: Rent vs Buy */}
          <Link href={flagshipTool.link} className="block group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-indigo-500/30 p-8 transition-all duration-500 hover:bg-zinc-900/70 hover:border-indigo-500/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_15px_40px_rgba(99,102,241,0.15)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                    {flagshipTool.badge}
                  </div>
                  <h4 className="text-3xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                    {flagshipTool.title}
                  </h4>
                  <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed">
                    {flagshipTool.question}
                  </p>
                  <p className="text-xs font-mono text-indigo-400 flex items-center gap-1 font-semibold pt-1">
                    <span>{flagshipTool.output}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Home size={32} />
                </div>
              </div>
            </div>
          </Link>

          {/* SECONDARY 2x2 GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.link} className="block group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl">
                  <div className="h-full relative overflow-hidden rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-white/10 p-7 transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/20 hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <div className="flex flex-col justify-between h-full space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={`p-3.5 rounded-2xl ${tool.bg} border ${tool.border}`}>
                          <Icon size={24} style={{ color: tool.color }} />
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <ArrowRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold mb-2 tracking-tight group-hover:text-white transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-white/60 font-medium leading-relaxed mb-4">
                          {tool.question}
                        </p>
                        <p className="text-[11px] font-mono text-white/40 group-hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1">
                          <span>{tool.output}</span>
                          <ArrowRight size={12} />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* PRODUCT DIFFERENTIATION SECTION */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-zinc-950/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold">[ The Dside Philosophy ]</span>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight">
              Don't just see who wins.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
                See what changes the winner.
              </span>
            </h3>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed">
              Standard calculators give static outputs based on rigid defaults. Dside continuously computes live sensitivity tipping points, telling you exact threshold values (e.g. property appreciation rate, equity return, or tax slab) where the decision reverses.
            </p>
          </div>

          {/* 3-STEP WORKFLOW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-400">01 — Set Assumptions</span>
              <p className="text-xs text-white/70 font-medium">Input your property prices, salaries, loan terms, and market return expectations.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">02 — Simulate Both</span>
              <p className="text-xs text-white/70 font-medium">Both financial strategies are modeled side-by-side with full tax and opportunity cost accounting.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">03 — Find Crossover</span>
              <p className="text-xs text-white/70 font-medium">Discover break-even years, net wealth differences, and tipping point return matrices.</p>
            </div>
          </div>
        </div>

        {/* SHAREABLE SCENARIOS BANNER */}
        <div className="p-6 rounded-3xl bg-zinc-950/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 size={16} className="text-indigo-400" /> Build a scenario. Share the math with one link.
            </h4>
            <p className="text-xs text-white/50">
              Every slider update dynamically syncs your custom scenario so you can share exact models with advisors or friends.
            </p>
          </div>
          <Link href="/compare/rent-vs-buy" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors whitespace-nowrap">
            Try A Scenario →
          </Link>
        </div>

        {/* METHODOLOGY & FOOTER */}
        <footer className="pt-10 border-t border-white/5 text-xs text-white/40 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold text-white/70">Dside Money — Decision Intelligence</p>
              <p className="text-[10px] text-white/40">Built for Indian professionals. Educational projections, not investment advice.</p>
            </div>
            <div className="flex gap-4 text-[11px] font-mono">
              <Link href="/compare/rent-vs-buy" className="hover:text-white transition-colors">Rent vs Buy</Link>
              <Link href="/compare/prepay-vs-invest" className="hover:text-white transition-colors">Prepay vs Invest</Link>
              <Link href="/compare/nps-vs-mf" className="hover:text-white transition-colors">NPS vs MF</Link>
              <Link href="/compare/epf-vs-index" className="hover:text-white transition-colors">EPF vs Index</Link>
              <Link href="/compare/emi-vs-upfront" className="hover:text-white transition-colors">EMI vs Upfront</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
