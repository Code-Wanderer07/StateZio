import React from 'react';
import {
  Sparkles,
  Binary,
  Layers,
  Disc3,
  HelpCircle,
  FolderOpen,
  Home,
} from 'lucide-react';
import { LinkedInIcon } from './LinkedInIcon';
import { useAutomataStore } from '../../store/useAutomataStore';
import { MachineType } from '../../types/automata';

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenHelp: () => void;
  onOpenSolver: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenHelp,
  onOpenSolver,
  onNavigateHome,
}) => {
  const { machine, setMachineType } = useAutomataStore();

  const handleModuleClick = (type: MachineType) => {
    setMachineType(type);
  };

  const linkedInUrl = "https://www.linkedin.com/in/shivakanth-m-701631380";

  return (
    <header className="h-14 bg-white/95 border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs backdrop-blur-md text-slate-800 shrink-0">
      {/* Brand & Logo (Clickable to return to Intro/Home) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          title="Return to StateZio Intro & Tutorials"
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-800/20 text-white group-hover:scale-105 transition-transform">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                StateZio
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5">
              Automata Theory Simulator
            </p>
          </div>
        </button>

        {/* Intro/Home quick button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title="Go to StateZio Intro & How to Use Guide"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 ml-2"
          >
            <Home className="w-3.5 h-3.5 text-emerald-700" />
            <span>Intro / Guide</span>
          </button>
        )}
      </div>

      {/* Center: Module Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
        <button
          onClick={() => handleModuleClick('DFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            machine.type === 'DFA'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 1: DFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('NFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            machine.type === 'NFA'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 1: NFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('PDA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            machine.type === 'PDA'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Module 3: PDA</span>
        </button>

        <button
          onClick={() => handleModuleClick('TM')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            machine.type === 'TM'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>Module 4: TM</span>
        </button>
      </div>

      {/* Right Controls & Author Credit */}
      <div className="flex items-center gap-2">
        {/* Author Credit Badge with LinkedIn Link */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
          <span className="text-slate-600 flex items-center gap-1 text-[11px]">
            Made by <strong className="text-emerald-900 font-bold">Shivakanth</strong>
          </span>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect with Shivakanth on LinkedIn"
            className="p-1 rounded-lg bg-white hover:bg-emerald-700 text-emerald-700 hover:text-white border border-emerald-300 transition-all shadow-xs flex items-center justify-center cursor-pointer"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Question Solver Button */}
        <button
          onClick={onOpenSolver}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="TOC Question Solver & AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Question Solver</span>
        </button>

        {/* Presets Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
            isSidebarOpen
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Presets</span>
        </button>

        {/* Theory Help Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          title="Theory Guide & Reference"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
