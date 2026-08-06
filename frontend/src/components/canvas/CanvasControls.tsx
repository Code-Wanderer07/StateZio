import React from 'react';
import {
  Plus,
  Sparkles,
  RotateCcw,
  GitFork,
  Download,
  Upload,
  Layers,
  HelpCircle,
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
    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* Add State */}
      <button
        onClick={addState}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all duration-200 shadow-sm"
        title="Add a new state to canvas"
      >
        <Plus className="w-4 h-4" />
        <span>Add State</span>
      </button>

      {/* Auto Layout (Dagre) */}
      <button
        onClick={autoLayout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
        title="Automatically organize graph layout using Dagre"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Auto-Layout</span>
      </button>

      {/* NFA to DFA Converter Button (Only if NFA) */}
      {machine.type === 'NFA' && (
        <button
          onClick={runSubsetConstruction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition-all duration-200 animate-pulse-glow"
          title="Convert NFA to DFA using Powerset Construction"
        >
          <GitFork className="w-3.5 h-3.5 text-cyan-400" />
          <span>Convert NFA → DFA</span>
        </button>
      )}

      <div className="w-[1px] h-5 bg-slate-800 mx-1"></div>

      {/* Export / Import Modal */}
      <button
        onClick={() => setIsExportImportOpen(true)}
        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
        title="Import / Export Machine JSON & Images"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Clear Canvas */}
      <button
        onClick={clearCanvas}
        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/60 transition-colors"
        title="Clear Canvas"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
