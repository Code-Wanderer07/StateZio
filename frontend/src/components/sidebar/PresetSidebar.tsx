import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { allPresets } from '../../presets';
import { MachineType } from '../../types/automata';

interface PresetSidebarProps {
  onClose?: () => void;
}

export const PresetSidebar: React.FC<PresetSidebarProps> = ({ onClose }) => {
  const { loadPreset, activePresetId } = useAutomataStore();
  const [selectedType, setSelectedType] = useState<'All' | MachineType>('All');

  const filtered = allPresets.filter((p) => {
    if (selectedType === 'All') return true;
    return p.type === selectedType;
  });

  const getModuleBadge = (type: MachineType) => {
    if (type === 'DFA') return <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-semibold">DFA</span>;
    if (type === 'NFA') return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-semibold">NFA</span>;
    if (type === 'PDA') return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-semibold">PDA</span>;
    return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold">TM</span>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-cyan-200 dark:border-cyan-500/20 w-80 max-w-[85vw] shadow-2xl text-slate-900 dark:text-slate-100 select-none absolute md:relative z-40 md:z-auto">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-slate-950 flex flex-col relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden absolute top-3 right-3 p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Preset Library
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-cyan-100 dark:bg-slate-900 rounded-xl border border-cyan-300 dark:border-cyan-500/30">
          {(['All', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`py-1 text-[10px] font-bold rounded-lg transition-colors truncate cursor-pointer ${
                selectedType === type
                  ? 'bg-cyan-400 text-white dark:text-[#1C1313] shadow-xs'
                  : 'text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-100 dark:bg-slate-900">
        {filtered.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-cyan-200 dark:bg-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-400/60'
                  : 'bg-cyan-50 dark:bg-slate-950 border-cyan-300 dark:border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-100 dark:bg-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-cyan-700 dark:text-cyan-300 truncate">
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
