'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Home, Briefcase, ShieldCheck, Landmark, ShoppingCart, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

const engines = [
  { id: 'rent-vs-buy', title: 'Rent vs. Buy', icon: Home, color: '#6366f1', link: '/compare/rent-vs-buy' },
  { id: 'prepay-vs-invest', title: 'Prepay vs. Invest', icon: Briefcase, color: '#10b981', link: '/compare/prepay-vs-invest' },
  { id: 'nps-vs-mf', title: 'NPS vs. Mutual Funds', icon: ShieldCheck, color: '#8b5cf6', link: '/compare/nps-vs-mf' },
  { id: 'epf-vs-index', title: 'EPF vs. Index Funds', icon: Landmark, color: '#f59e0b', link: '/compare/epf-vs-index' },
  { id: 'emi-vs-upfront', title: 'No-Cost EMI vs. Upfront', icon: ShoppingCart, color: '#ec4899', link: '/compare/emi-vs-upfront' },
];

export function Header({ subtitle }: { subtitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 flex items-center justify-between p-2.5 px-4 mb-4 md:mb-5 flex-shrink-0 bg-zinc-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Left: Dside Brand Logo */}
      <BrandLogo size="sm" />

      {/* Center/Right: Fast Engine Switcher Dropdown */}
      <div className="relative flex items-center gap-2" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <span className="hidden sm:inline text-[10px] text-white/40 uppercase font-semibold">Engine:</span>
          <span className="truncate max-w-[140px] sm:max-w-[180px] font-semibold text-white">{subtitle}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-white/40" />
          </motion.div>
        </button>

        {/* Dropdown Menu Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-1 z-50"
            >
              <div className="px-2 py-1.5 border-b border-white/5 mb-1 flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-semibold">
                  Switch Decision Engine
                </span>
                <span className="text-[9px] font-mono text-indigo-400">5 Live</span>
              </div>

              {engines.map((engine) => {
                const Icon = engine.icon;
                const isActive = subtitle.toLowerCase().includes(engine.title.toLowerCase().split(' ')[0]);

                return (
                  <Link
                    key={engine.id}
                    href={engine.link}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-500/15 border border-indigo-500/30 text-white font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/5" style={{ color: engine.color }}>
                        <Icon size={14} />
                      </div>
                      <span className="truncate">{engine.title}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
