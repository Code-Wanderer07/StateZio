import React from 'react';
import { Menu, Sun, Moon, HelpCircle } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { MachineType } from '../../types/automata';

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onOpenHelp: () => void;
  onOpenSolver: () => void;
  onNavigateHome: () => void;
  mobileActiveTab?: 'canvas' | 'trace' | 'batch' | 'tuples';
  setMobileActiveTab?: (tab: 'canvas' | 'trace' | 'batch' | 'tuples') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenHelp,
  onOpenSolver,
  onNavigateHome,
  mobileActiveTab,
  setMobileActiveTab
}) => {
  const { machine, setMachineType, theme, toggleTheme } = useAutomataStore();

  return (
    <header className="bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 flex justify-between items-center px-2 md:px-6 h-16 w-full">
      <div className="flex items-center gap-2 md:gap-6 flex-1 min-w-0">
        <button onClick={onNavigateHome} className="flex items-center justify-center p-1 md:p-2 -ml-1 md:-ml-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all active:scale-95 group" title="Back to Home">
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
          <img src="/statezio-logo2.png" alt="StateZio Logo" className="w-9 h-9 dark:mix-blend-screen rounded-lg dark:rounded-none" />
          <div className="flex items-start">
            <span className="hidden sm:inline font-display-lg text-2xl text-primary tracking-tighter font-bold">StateZio</span>
            <span className="hidden sm:inline ml-1 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md self-start mt-0.5">2.0</span>
          </div>
        </div>
        <nav className="flex items-center gap-3 md:gap-6 ml-2 md:ml-0 overflow-x-auto no-scrollbar">
          {(['DFA', 'NFA', 'PDA', 'TM'] as MachineType[]).map((type) => (
            <button
              key={type}
              onClick={() => setMachineType(type)}
              className={`${
                machine.type === type
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 px-1 md:px-2 rounded'
              } active:scale-95 duration-200 text-sm md:text-base font-medium`}
            >
              {type}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-surface-variant/50 hover:bg-surface-bright/50 transition-all border border-outline-variant/50 text-on-surface px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          title="Preset Library"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          <span className="hidden sm:inline">Preset Library</span>
        </button>
        <button
          onClick={onOpenSolver}
          className="bg-primary hover:bg-primary-container text-on-primary font-medium px-6 py-2 rounded-lg transition-all active:scale-95 duration-200 hidden md:block"
        >
          Question Solver
        </button>
        <a href="https://www.linkedin.com/in/shivakanth-m-701631380" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-surface-bright/50 hidden lg:flex items-center gap-1 font-body-md" title="LinkedIn Profile">
          Shivakanth
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
        <button
          onClick={toggleTheme}
          className="text-on-surface hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-bright/50"
        >
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>
    </header>
  );
};
