'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ScenarioWorkspaceProps {
  engineTitle?: string;
  engineId?: string;
  currentInputs?: any;
  onApplyScenario?: (inputs: any) => void;
}

export function ScenarioWorkspace({ engineTitle }: ScenarioWorkspaceProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Copy shareable deep link URL
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 px-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
          <Share2 size={14} />
        </div>
        <div className="min-w-0">
          <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px] block truncate">
            Share Exact Scenario
          </span>
          <span className="text-[10px] text-white/40 font-mono truncate hidden sm:block">
            Every slider update syncs to this shareable URL
          </span>
        </div>
      </div>

      <button
        onClick={handleShareLink}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer shadow-md text-[11px] flex-shrink-0 ml-2"
      >
        {copiedUrl ? (
          <>
            <Check size={13} className="text-emerald-300" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={13} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
