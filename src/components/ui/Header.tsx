'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="relative z-10 flex items-center justify-between py-1 mb-2 flex-shrink-0">
      <Link href="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg pr-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
          <Scale size={14} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-tight leading-none group-hover:text-white transition-colors">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Financial</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">VS</span>
          </h1>
          <p className="text-[9px] text-white/25 font-medium leading-none mt-0.5">{subtitle}</p>
        </div>
      </Link>
    </header>
  );
}
