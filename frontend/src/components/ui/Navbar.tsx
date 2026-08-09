import React from 'react';
import {
  Sparkles,
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
    <header className="min-h-[3.5rem] bg-[#161111]/95 border-b border-sky-500/20 px-2 sm:px-4 py-2 sm:py-0 flex items-center justify-between gap-2 z-30 shadow-md backdrop-blur-md text-slate-100 shrink-0 select-none flex-wrap sm:flex-nowrap">
      {/* Brand & Logo (Clickable to return to Intro/Home) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          title="Return to StateZio Intro & Tutorials"
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <img
            src="/statezio-logo.png"
            alt="StateZio Logo"
            className="w-8 h-8 rounded-xl object-contain shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-white group-hover:text-sky-300 transition-colors">
                StateZio
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5">
              Automata Theory Simulator
            </p>
          </div>
        </button>

        {/* Home quick button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title="Go to StateZio Home"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#271C1C] hover:bg-[#3D2C2C] text-sky-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-sky-500/30 ml-2 shadow-xs"
          >
            <Home className="w-3.5 h-3.5 text-sky-400" />
            <span>Home</span>
          </button>
        )}
      </div>

      {/* Center: Automata Type Switcher Tabs (DFA, NFA, PDA, TM) */}
      <div className="flex items-center gap-1 p-1 bg-[#241919] rounded-xl border border-sky-500/30 shadow-inner overflow-x-auto max-w-full hide-scrollbar">
        <button
          onClick={() => handleModuleClick('DFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'DFA'
              ? 'bg-sky-400 text-[#1C1313] shadow-md shadow-sky-950/50 border border-sky-200'
              : 'text-sky-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>DFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('NFA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'NFA'
              ? 'bg-sky-400 text-[#1C1313] shadow-md shadow-sky-950/50 border border-sky-200'
              : 'text-sky-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>NFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('PDA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'PDA'
              ? 'bg-sky-400 text-[#1C1313] shadow-md shadow-sky-950/50 border border-sky-200'
              : 'text-sky-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>PDA</span>
        </button>

        <button
          onClick={() => handleModuleClick('TM')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'TM'
              ? 'bg-sky-400 text-[#1C1313] shadow-md shadow-sky-950/50 border border-sky-200'
              : 'text-sky-200 hover:text-white hover:bg-white/10'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>TM</span>
        </button>
      </div>

      {/* Right Controls & Author Credit */}
      <div className="flex items-center gap-2">
        {/* Author Credit Badge with LinkedIn Link */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#271C1C] border border-sky-500/30 text-xs">
          <span className="text-slate-300 flex items-center gap-1 text-[11px]">
            Made by <strong className="text-white font-bold">Shivakanth</strong>
          </span>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect with Shivakanth on LinkedIn"
            className="p-1 rounded-lg bg-[#1C1313] hover:bg-sky-500 text-sky-400 hover:text-[#1C1313] border border-sky-500/40 transition-all shadow-xs flex items-center justify-center cursor-pointer"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Question Solver Button */}
        <button
          onClick={onOpenSolver}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white border border-sky-300/40 text-xs font-bold shadow-md shadow-sky-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="TOC Question Solver"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Question Solver</span>
        </button>

        {/* Presets Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
            isSidebarOpen
              ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-xs'
              : 'bg-[#271C1C] border-sky-500/30 text-slate-300 hover:text-white hover:bg-[#3D2C2C]'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {/* Theory Help Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-[#271C1C] hover:bg-[#3D2C2C] border border-sky-500/30 text-slate-300 hover:text-white transition-colors shadow-xs cursor-pointer"
          title="Theory Guide & Reference"
        >
          <HelpCircle className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </header>
  );
};
