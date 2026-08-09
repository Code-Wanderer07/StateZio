import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { allPresets } from '../../presets';
import { MachineType } from '../../types/automata';

export const PresetSidebar: React.FC = () => {
  const { loadPreset, activePresetId } = useAutomataStore();
  const [selectedType, setSelectedType] = useState<'All' | MachineType>('All');

  const filtered = allPresets.filter((p) => {
    if (selectedType === 'All') return true;
    return p.type === selectedType;
  });

  const getModuleBadge = (type: MachineType) => {
    if (type === 'DFA') return <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 text-[10px] font-mono font-semibold">DFA</span>;
    if (type === 'NFA') return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-semibold">NFA</span>;
    if (type === 'PDA') return <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-semibold">PDA</span>;
    return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold">TM</span>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#161111] border-r border-sky-200 dark:border-sky-500/20 w-80 shadow-2xl text-slate-900 dark:text-slate-100 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sky-200 dark:border-sky-500/20 bg-sky-50 dark:bg-[#1C1313]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Preset Library
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-sky-100 dark:bg-[#241919] rounded-xl border border-sky-300 dark:border-sky-500/30">
          {(['All', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`py-1 text-[10px] font-bold rounded-lg transition-colors truncate cursor-pointer ${
                selectedType === type
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-xs'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-100 dark:bg-[#120D0D]">
        {filtered.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-sky-200 dark:bg-[#271C1C] border-sky-400 shadow-md ring-1 ring-sky-400/60'
                  : 'bg-sky-50 dark:bg-[#1C1313] border-sky-300 dark:border-sky-500/30 hover:border-sky-400 hover:bg-sky-100 dark:bg-[#221717] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-sky-700 dark:text-sky-300 truncate">
                  {preset.name}
                </span>
                {getModuleBadge(preset.type)}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
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
