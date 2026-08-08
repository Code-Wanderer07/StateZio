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
    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 border border-slate-200 p-1.5 rounded-2xl shadow-md backdrop-blur-md">
      {/* Add State */}
      <button
        onClick={addState}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-300 text-xs font-semibold transition-all duration-200 shadow-xs"
        title="Add a new state to canvas"
      >
        <Plus className="w-4 h-4" />
        <span>Add State</span>
      </button>

      {/* Auto Layout (Dagre) */}
      <button
        onClick={autoLayout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors shadow-xs"
        title="Automatically organize graph layout using Dagre"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Auto-Layout</span>
      </button>

      {/* NFA to DFA Converter Button (Only if NFA) */}
      {machine.type === 'NFA' && (
        <button
          onClick={runSubsetConstruction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 text-xs font-semibold transition-all duration-200 shadow-sm"
          title="Convert NFA to DFA using Powerset Construction"
        >
          <GitFork className="w-3.5 h-3.5 text-white" />
          <span>Convert NFA → DFA</span>
        </button>
      )}

      <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

      {/* Export / Import Modal */}
      <button
        onClick={() => setIsExportImportOpen(true)}
        className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
        title="Import / Export Machine JSON & Images"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Clear Canvas */}
      <button
        onClick={clearCanvas}
        className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors shadow-xs"
        title="Clear Canvas"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
