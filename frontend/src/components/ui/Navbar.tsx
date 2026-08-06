import React from 'react';
import {
  Sparkles,
  BookOpen,
  Binary,
  Layers,
  Disc3,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { MachineType } from '../../types/automata';

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenHelp: () => void;
  onOpenSolver: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenHelp,
  onOpenSolver,
}) => {
  const { machine, setMachineType } = useAutomataStore();

  const handleModuleClick = (type: MachineType) => {
    setMachineType(type);
  };

  return (
    <header className="h-14 bg-slate-900/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shadow-md backdrop-blur-md">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Binary className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-white">
              TOC Visualizer
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 -mt-0.5">
            Automata & Computability Suite
          </p>
        </div>
      </div>

      {/* Center: Module Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        <button
          onClick={() => handleModuleClick('DFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            machine.type === 'DFA'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 1: DFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('NFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            machine.type === 'NFA'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 1: NFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('PDA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            machine.type === 'PDA'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Module 3: PDA</span>
        </button>

        <button
          onClick={() => handleModuleClick('TM')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            machine.type === 'TM'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>Module 4: TM</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSolver}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white border border-indigo-400/30 text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="TOC Question Solver & AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Question Solver</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
            isSidebarOpen
              ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Presets</span>
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Theory Guide & Reference"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
