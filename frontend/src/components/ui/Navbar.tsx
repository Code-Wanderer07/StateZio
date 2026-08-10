import React from 'react';
import {
  Sparkles,
  Layers,
  Disc3,
  HelpCircle,
  FolderOpen,
  Home,
  Sun,
  Moon,
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
  const { machine, setMachineType, theme, toggleTheme } = useAutomataStore();

  const handleModuleClick = (type: MachineType) => {
    setMachineType(type);
  };

  const linkedInUrl = "https://www.linkedin.com/in/shivakanth-m-701631380";

  return (
    <header className="hidden md:flex min-h-[3.5rem] bg-slate-50 dark:bg-slate-900/95 border-b border-cyan-200 dark:border-cyan-500/20 px-2 sm:px-4 py-2 sm:py-0 items-center justify-between gap-2 z-30 shadow-md backdrop-blur-md text-slate-900 dark:text-slate-100 shrink-0 select-none flex-wrap sm:flex-nowrap">
      {/* Brand & Logo (Clickable to return to Intro/Home) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          title="Return to StateZio Intro & Tutorials"
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/statezio-logo.jpg"
              alt="StateZio Logo"
              className="w-full h-full object-cover scale-[1.2]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-700 dark:text-cyan-300 transition-colors">
                StateZio
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 -mt-0.5">
              Automata Theory Simulator
            </p>
          </div>
        </button>

        {/* Home quick button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title="Go to StateZio Home"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-800 text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white text-xs font-semibold transition-colors cursor-pointer border border-cyan-300 dark:border-cyan-500/30 ml-2 shadow-xs"
          >
            <Home className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}
      </div>

      {/* Center: Automata Type Switcher Tabs (DFA, NFA, PDA, TM) */}
      <div className="flex items-center gap-1 p-1 bg-cyan-100 dark:bg-slate-900 rounded-xl border border-cyan-300 dark:border-cyan-500/30 shadow-inner overflow-x-auto max-w-full hide-scrollbar">
        <button
          onClick={() => handleModuleClick('DFA')}
          className={`flex shrink-0 whitespace-nowrap items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'DFA'
              ? 'bg-cyan-400 text-white dark:text-[#1C1313] shadow-md shadow-cyan-950/50 border border-cyan-200'
              : 'text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>DFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('NFA')}
          className={`flex shrink-0 whitespace-nowrap items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'NFA'
              ? 'bg-cyan-400 text-white dark:text-[#1C1313] shadow-md shadow-cyan-950/50 border border-cyan-200'
              : 'text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>NFA</span>
        </button>

        <button
          onClick={() => handleModuleClick('PDA')}
          className={`flex shrink-0 whitespace-nowrap items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'PDA'
              ? 'bg-cyan-400 text-white dark:text-[#1C1313] shadow-md shadow-cyan-950/50 border border-cyan-200'
              : 'text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>PDA</span>
        </button>

        <button
          onClick={() => handleModuleClick('TM')}
          className={`flex shrink-0 whitespace-nowrap items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            machine.type === 'TM'
              ? 'bg-cyan-400 text-white dark:text-[#1C1313] shadow-md shadow-cyan-950/50 border border-cyan-200'
              : 'text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>TM</span>
        </button>
      </div>

      {/* Right Controls & Author Credit */}
      <div className="flex items-center gap-2">
        {/* Author Credit Badge with LinkedIn Link */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-200 dark:bg-slate-800 border border-cyan-300 dark:border-cyan-500/30 text-xs">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
            Made by <strong className="text-slate-900 dark:text-white font-bold">Shivakanth</strong>
          </span>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect with Shivakanth on LinkedIn"
            className="p-1 rounded-lg bg-cyan-50 dark:bg-slate-950 hover:bg-cyan-500 text-cyan-600 dark:text-cyan-400 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] border border-cyan-500/40 transition-all shadow-xs flex items-center justify-center cursor-pointer"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Question Solver Button */}
        <button
          onClick={onOpenSolver}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 dark:text-white border border-cyan-300/40 text-xs font-bold shadow-md shadow-cyan-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="TOC Question Solver"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
          <span className="hidden sm:inline">Question Solver</span>
        </button>

        {/* Presets Toggle Button */}
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-cyan-300 transition-colors shadow-xs border border-slate-200 dark:border-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs border flex items-center gap-1.5 cursor-pointer ${
            isSidebarOpen
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-xs'
              : 'bg-cyan-200 dark:bg-slate-800 border-cyan-300 dark:border-cyan-500/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-cyan-300 dark:hover:bg-slate-800'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {/* Theory Help Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-800 border border-cyan-300 dark:border-cyan-500/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors shadow-xs cursor-pointer"
          title="Theory Guide & Reference"
        >
          <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
