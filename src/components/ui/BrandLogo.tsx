'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'primary' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
}

export function BrandLogo({
  variant = 'compact',
  size = 'md',
  showTagline = false,
  clickable = true
}: BrandLogoProps) {
  const iconSizes = {
    sm: { box: 'w-8 h-8', svg: 18, text: 'text-base', subtitle: 'text-[8.5px]' },
    md: { box: 'w-10 h-10', svg: 22, text: 'text-xl', subtitle: 'text-[9.5px]' },
    lg: { box: 'w-14 h-14', svg: 30, text: 'text-3xl', subtitle: 'text-[11.5px]' },
  };

  const currentSize = iconSizes[size];
  const shouldDisplayTagline = showTagline || variant === 'primary';

  const logoContent = (
    <div className="flex items-center gap-3.5 group cursor-pointer select-none">
      {/* Precision Geometric Emblem: Diverging Paths */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:border-white/20 transition-all duration-300 flex-shrink-0 ${currentSize.box}`}>
        <svg
          width={currentSize.svg}
          height={currentSize.svg}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform group-hover:scale-105 transition-transform duration-300"
        >
          <defs>
            <linearGradient id="divergeIndigo" x1="7" y1="16" x2="25" y2="7" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="divergeEmerald" x1="7" y1="16" x2="25" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6ee7b7" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Path A (Upward Indigo Chart Curve) */}
          <path
            d="M 7 16 C 13 16, 17 8, 25 7"
            stroke="url(#divergeIndigo)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Path B (Downward Emerald Chart Curve) */}
          <path
            d="M 7 16 C 13 16, 17 24, 25 25"
            stroke="url(#divergeEmerald)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Single Decision Origin Point */}
          <circle cx="7" cy="16" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography: Color-Split Wordmark */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none tracking-normal">
            {/* 'D' in dual-color gradient representing the decision origin */}
            <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 ${currentSize.text}`}>
              D
            </span>
            {/* 'side' in high-contrast crisp white with generous letter spacing */}
            <span className={`font-extrabold text-white ml-0.5 tracking-normal ${currentSize.text}`}>
              side
            </span>
          </div>
          {shouldDisplayTagline && (
            <span className={`font-mono text-white/40 tracking-[0.25em] font-semibold mt-1.5 uppercase ${currentSize.subtitle}`}>
              FINANCIAL DECISION ENGINES
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return <Link href="/" className="outline-none rounded-xl">{logoContent}</Link>;
  }

  return logoContent;
}
