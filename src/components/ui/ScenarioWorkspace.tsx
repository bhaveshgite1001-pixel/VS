'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Share2, Copy, Check, Plus, Trash2, FolderKanban, Download, Upload, ArrowRight, Sparkles, Scale, Layers } from 'lucide-react';
import { 
  SavedScenario, 
  getSavedScenarios, 
  saveScenario, 
  deleteScenario, 
  duplicateScenario, 
  serializeInputsToUrl,
  exportWorkspaceBackupJson,
  importWorkspaceBackupJson 
} from '@/lib/utils/scenarioState';
import { formatINR } from '@/lib/utils/formatters';

interface ScenarioWorkspaceProps<T extends Record<string, any>> {
  engineId: string;
  engineTitle: string;
  currentInputs: T;
  onApplyScenario: (inputs: T) => void;
}

export function ScenarioWorkspace<T extends Record<string, any>>({
  engineId,
  engineTitle,
  currentInputs,
  onApplyScenario,
}: ScenarioWorkspaceProps<T>) {
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario<T>[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioNotes, setScenarioNotes] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Selected scenarios for Side-by-Side comparison (max 3)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareView, setIsCompareView] = useState(false);

  // Refresh saved scenarios list
  const reloadScenarios = () => {
    const list = getSavedScenarios<T>(engineId);
    setSavedScenarios(list);
  };

  useEffect(() => {
    reloadScenarios();
  }, [engineId]);

  // Sync current inputs to browser URL search params without page reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = serializeInputsToUrl(currentInputs);
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [currentInputs]);

  // Copy shareable deep link URL
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // Save scenario
  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    saveScenario<T>(engineId, scenarioName, currentInputs, scenarioNotes);
    setScenarioName('');
    setScenarioNotes('');
    setIsSaveModalOpen(false);
    reloadScenarios();
  };

  // Duplicate scenario
  const handleDuplicate = (id: string) => {
    duplicateScenario<T>(id);
    reloadScenarios();
  };

  // Delete scenario
  const handleDelete = (id: string) => {
    deleteScenario(id);
    setSelectedForCompare((prev) => prev.filter((item) => item !== id));
    reloadScenarios();
  };

  // Toggle selection for side-by-side compare
  const toggleCompareSelect = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id]; // Max 3
      return [...prev, id];
    });
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const jsonStr = exportWorkspaceBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dside_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importWorkspaceBackupJson(content)) {
        reloadScenarios();
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Workspace Floating Action Bar */}
      <div className="flex items-center justify-between p-2.5 px-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FolderKanban size={14} />
          </div>
          <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">
            Decision Workspace
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Scenario Link */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer font-medium text-[11px]"
          >
            {copiedUrl ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            <span>{copiedUrl ? 'Copied Link!' : 'Share Link'}</span>
          </button>

          {/* Save Scenario Button */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-all cursor-pointer font-bold text-[11px]"
          >
            <Bookmark size={13} />
            <span>Save Scenario</span>
          </button>

          {/* Saved Drawer & Compare */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer font-bold text-[11px] relative"
          >
            <Layers size={13} />
            <span>Saved Scenarios</span>
            {savedScenarios.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-400 text-black text-[9px] font-mono font-black flex items-center justify-center ml-0.5">
                {savedScenarios.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Save Scenario Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bookmark size={16} className="text-indigo-400" /> Save Scenario to Workspace
                </h3>
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="text-white/40 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveScenario} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Scenario Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandra 3BHK Buy vs Rent"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Notes / Context (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Assuming 6% appreciation and ₹45k rent with 12% equity returns..."
                    value={scenarioNotes}
                    onChange={(e) => setScenarioNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                  >
                    Save to Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Saved Scenarios & Side-by-Side Comparison Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-2xl h-full bg-zinc-950 border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                        {engineTitle} Workspace
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono">
                        {savedScenarios.length} saved scenarios in local workspace
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white text-xs font-mono"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Compare Matrix Toggle Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <Scale size={14} className="text-indigo-400" />
                    <span className="font-mono text-white/80">
                      Select 2–3 scenarios to compare side-by-side ({selectedForCompare.length}/3 selected)
                    </span>
                  </div>
                  {selectedForCompare.length >= 2 && (
                    <button
                      onClick={() => setIsCompareView(!isCompareView)}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold font-mono text-[10px]"
                    >
                      {isCompareView ? 'View List' : 'Compare Side-by-Side →'}
                    </button>
                  )}
                </div>

                {/* SIDE-BY-SIDE COMPARISON MATRIX */}
                {isCompareView && selectedForCompare.length >= 2 ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                      Side-by-Side Scenario Matrix
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedForCompare.map((id) => {
                        const target = savedScenarios.find((s) => s.id === id);
                        if (!target) return null;

                        return (
                          <div key={target.id} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs">
                            <span className="font-bold text-white block truncate">{target.name}</span>
                            <div className="space-y-1 text-[10px] font-mono text-white/60">
                              {Object.entries(target.inputs).slice(0, 5).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="truncate uppercase text-white/40">{k}:</span>
                                  <span className="font-bold text-white">{typeof v === 'number' && v > 1000 ? formatINR(v) : String(v)}</span>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                onApplyScenario(target.inputs);
                                setIsDrawerOpen(false);
                              }}
                              className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-[10px]"
                            >
                              Load Into Engine
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* SAVED SCENARIOS LIST */
                  <div className="space-y-3">
                    {savedScenarios.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-white/40">
                        <Bookmark size={24} className="mx-auto text-white/20" />
                        <p className="text-xs font-medium">No saved scenarios yet.</p>
                        <p className="text-[10px]">Use "Save Scenario" to pin models for quick comparison!</p>
                      </div>
                    ) : (
                      savedScenarios.map((sc) => {
                        const isSelected = selectedForCompare.includes(sc.id);

                        return (
                          <div
                            key={sc.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleCompareSelect(sc.id)}
                                    className="rounded border-white/20 bg-zinc-900 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <h4 className="text-xs font-bold text-white">{sc.name}</h4>
                                </div>
                                {sc.notes && (
                                  <p className="text-[10.5px] text-white/50 mt-1 italic pl-5">
                                    "{sc.notes}"
                                  </p>
                                )}
                              </div>
                              <span className="text-[9px] font-mono text-white/30 whitespace-nowrap">
                                {new Date(sc.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                              <span className="text-white/40">
                                {Object.keys(sc.inputs).length} parameters modeled
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDuplicate(sc.id)}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                                >
                                  Duplicate & Tweak
                                </button>
                                <button
                                  onClick={() => {
                                    onApplyScenario(sc.inputs);
                                    setIsDrawerOpen(false);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold"
                                >
                                  Load →
                                </button>
                                <button
                                  onClick={() => handleDelete(sc.id)}
                                  className="p-1 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Workspace JSON Backup & Restore Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>Workspace Data Persistence</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-1 text-indigo-400 hover:underline cursor-pointer"
                  >
                    <Download size={12} /> Export JSON
                  </button>
                  <label className="flex items-center gap-1 text-emerald-400 hover:underline cursor-pointer">
                    <Upload size={12} /> Import JSON
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
