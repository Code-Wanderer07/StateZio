import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { allPresets } from '../../presets';
import { MachineType } from '../../types/automata';

export const PresetSidebar: React.FC = () => {
  const { loadPreset, activePresetId } = useAutomataStore();
  const [selectedModule, setSelectedModule] = useState<'All' | 'Module 1' | 'Module 3' | 'Module 4'>('All');

  const filtered = allPresets.filter((p) => {
    if (selectedModule === 'All') return true;
    return p.module === selectedModule;
  });

  const getModuleBadge = (type: MachineType) => {
    if (type === 'DFA') return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">DFA</span>;
    if (type === 'NFA') return <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-mono font-semibold">NFA</span>;
    if (type === 'PDA') return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-semibold">PDA</span>;
    return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-semibold">TM</span>;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-80 shadow-sm">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Preset Library
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          {(['All', 'Module 1', 'Module 3', 'Module 4'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`py-1 text-[10px] font-medium rounded-lg transition-colors truncate ${
                selectedModule === mod
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {mod === 'Module 1' ? 'M1: FA' : mod === 'Module 3' ? 'M3: PDA' : mod === 'Module 4' ? 'M4: TM' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/30">
        {filtered.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-xs text-slate-800 group-hover:text-emerald-900 truncate">
                  {preset.name}
                </span>
                {getModuleBadge(preset.type)}
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
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
