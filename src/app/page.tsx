'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Home, ShieldCheck, Briefcase, ShoppingCart, ArrowRight, Landmark } from 'lucide-react';

const tools = [
  {
    id: 'rent-vs-buy',
    title: 'Rent vs. Buy',
    description: 'The ultimate emotional debate. Calculate the frictional and opportunity costs of real estate vs. equity.',
    icon: Home,
    color: '#6366f1',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    link: '/compare/rent-vs-buy',
    featured: true
  },
  {
    id: 'prepay-vs-invest',
    title: 'Prepay vs. Invest',
    description: 'Aggressively clear debt or invest the surplus? See exactly when compounding beats interest saved.',
    icon: Briefcase,
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    link: '/compare/prepay-vs-invest',
    featured: false
  },
  {
    id: 'nps-vs-mf',
    title: 'NPS vs. Mutual Funds',
    description: 'The classic tax arbitrage dilemma. Does the 30% tax savings beat the uncapped returns of pure equity?',
    icon: ShieldCheck,
    color: '#8b5cf6',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    link: '/compare/nps-vs-mf',
    featured: false
  },
  {
    id: 'epf-vs-index',
    title: 'EPF vs. Index Funds',
    description: 'Maximize safe 8.1% tax-free compounding vs. maintaining liquidity in flexible market instruments.',
    icon: Landmark,
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    link: '/compare/epf-vs-index',
    featured: false
  },
  {
    id: 'emi-vs-upfront',
    title: 'No-Cost EMI vs. Upfront',
    description: 'Expose the hidden GST and processing fees. See when taking the discount beats investing the cash.',
    icon: ShoppingCart,
    color: '#ec4899',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    link: '/compare/emi-vs-upfront',
    featured: false
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/[0.02] blur-[120px]" />
      </div>

      <header className="relative z-10 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Scale size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">
              Financial <span className="text-white/50">VS</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-10">
        <div className="max-w-2xl mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
              Stop guessing.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Start calculating.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium">
              The ultimate toolkit for Indian professionals. Model the emotional financial decisions with pure math, gorgeous visuals, and uncompromising accuracy.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} variants={itemVariants} className={tool.featured ? "md:col-span-2 lg:col-span-2" : ""}>
                <Link href={tool.link} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl">
                  <div className={`h-full group relative overflow-hidden rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.3)] p-8 transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/20 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1`}>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${tool.color} 0%, transparent 70%)` }}
                    />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-12">
                        <div className={`p-4 rounded-2xl ${tool.bg} border ${tool.border}`}>
                          <Icon size={28} style={{ color: tool.color }} strokeWidth={2} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors group-hover:scale-110 duration-300">
                          <ArrowRight size={18} className="text-white/40 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <div className="mt-auto">
                        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-white transition-colors">{tool.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-medium line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
