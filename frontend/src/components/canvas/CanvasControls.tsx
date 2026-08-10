import React from 'react';
import {
  Plus,
  Sparkles,
  RotateCcw,
  GitFork,
  Download,
} from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const CanvasControls: React.FC = () => {
  const {
    machine,
    addState,
    autoLayout,
    clearCanvas,
    runSubsetConstruction,
    setIsExportImportOpen,
  } = useAutomataStore();

  return (
    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-cyan-50 dark:bg-slate-950/95 border border-cyan-300 dark:border-cyan-500/30 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md text-cyan-100">
      {/* Add State */}
      <button
        onClick={addState}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-white dark:text-[#1C1313] text-xs font-bold transition-all duration-200 shadow-md cursor-pointer active:scale-95"
        title="Add a new state to canvas"
      >
        <Plus className="w-4 h-4" />
        <span>Add State</span>
      </button>

      {/* Auto Layout (Dagre) */}
      <button
        onClick={autoLayout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-800 text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white border border-cyan-300 dark:border-cyan-500/30 text-xs font-medium transition-colors shadow-xs cursor-pointer"
        title="Automatically organize graph layout using Dagre"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
        <span>Auto-Layout</span>
      </button>

      {/* NFA to DFA Converter Button (Only if NFA) */}
      {machine.type === 'NFA' && (
        <button
          onClick={runSubsetConstruction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white border border-blue-500 text-xs font-semibold transition-all duration-200 shadow-md cursor-pointer active:scale-95"
          title="Convert NFA to DFA using Powerset Construction"
        >
          <GitFork className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
          <span>Convert NFA → DFA</span>
        </button>
      )}

      <div className="w-[1px] h-5 bg-cyan-500/30 mx-1"></div>

      {/* Export / Import Modal */}
      <button
        onClick={() => setIsExportImportOpen(true)}
        className="p-1.5 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 hover:text-slate-900 dark:text-white border border-cyan-300 dark:border-cyan-500/30 transition-colors shadow-xs cursor-pointer"
        title="Import / Export Machine JSON & Images"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Clear Canvas */}
      <button
        onClick={clearCanvas}
        className="p-1.5 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-400 border border-cyan-300 dark:border-cyan-500/30 hover:border-rose-800 transition-colors shadow-xs cursor-pointer"
        title="Clear Canvas"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
