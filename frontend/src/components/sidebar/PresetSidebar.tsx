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
    const base = "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border";
    if (type === 'DFA') return <span className={`${base} bg-primary/20 text-primary border-primary/40`}>DFA</span>;
    if (type === 'NFA') return <span className={`${base} bg-secondary/20 text-secondary border-secondary/40`}>NFA</span>;
    if (type === 'PDA') return <span className={`${base} bg-tertiary/20 text-tertiary border-tertiary/40`}>PDA</span>;
    return <span className={`${base} bg-error/20 text-error border-error/40`}>TM</span>;
  };

  return (
    <aside className="flex flex-col fixed md:relative left-0 top-16 md:top-0 h-[calc(100vh-64px)] w-80 max-w-[85vw] bg-surface-container-low/90 backdrop-blur-md border-r border-outline-variant/30 shadow-2xl z-40 transition-transform duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20">
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
          <h2 className="font-headline-sm text-[18px] font-bold text-primary tracking-wider uppercase">
            Preset Library
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-[11px] font-code-md font-bold rounded-full transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(76,215,246,0.4)]'
                  : 'bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {filtered.map((preset) => {
          const isActive = preset.id === activePresetId;
          return (
            <button
              key={preset.id}
              onClick={() => {
                 loadPreset(preset);
                 if(onClose) onClose();
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-surface-container border-primary shadow-[0_0_15px_rgba(76,215,246,0.15)]'
                  : 'bg-surface-container border-outline-variant/30 hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`font-bold text-sm truncate transition-colors ${isActive ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                  {preset.name}
                </span>
                {getModuleBadge(preset.type)}
              </div>

              <p className="text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                {preset.description}
              </p>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant/70 font-code-md">
                <span>{preset.machine.states.length} states</span>
                <span>{preset.testCases.length} test cases</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
