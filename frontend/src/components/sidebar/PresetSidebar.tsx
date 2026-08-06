import React, { useState } from 'react';
import { BookOpen, ChevronRight, Sparkles, Binary, Layers, Disc3 } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { allPresets } from '../../presets';
import { MachineType, PresetAutomata } from '../../types/automata';

export const PresetSidebar: React.FC = () => {
  const { loadPreset, activePresetId, setMachineType } = useAutomataStore();
  const [selectedModule, setSelectedModule] = useState<'All' | 'Module 1' | 'Module 3' | 'Module 4'>('All');

  const filtered = allPresets.filter((p) => {
    if (selectedModule === 'All') return true;
    return p.module === selectedModule;
  });

  const getModuleBadge = (type: MachineType) => {
    if (type === 'DFA') return <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-[10px] font-mono">DFA</span>;
    if (type === 'NFA') return <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-[10px] font-mono">NFA</span>;
    if (type === 'PDA') return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 text-[10px] font-mono">PDA</span>;
    return <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-700/60 text-[10px] font-mono">TM</span>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border-r border-slate-800/80 w-80 shadow-2xl backdrop-blur-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Preset Library
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {(['All', 'Module 1', 'Module 3', 'Module 4'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`py-1 text-[10px] font-medium rounded-lg transition-colors truncate ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mod === 'Module 1' ? 'M1: FA' : mod === 'Module 3' ? 'M3: PDA' : mod === 'Module 4' ? 'M4: TM' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-950/70 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-xs text-slate-200 group-hover:text-white truncate">
                  {preset.name}
                </span>
                {getModuleBadge(preset.type)}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{preset.machine.states.length} states</span>
                <span>{preset.testCases.length} test cases</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
