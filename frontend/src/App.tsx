import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { Navbar } from './components/ui/Navbar';
import { PresetSidebar } from './components/sidebar/PresetSidebar';
import { AutomataCanvas } from './components/canvas/AutomataCanvas';
import { SimulationDeck } from './components/simulation/SimulationDeck';
import { StackVisualizer } from './components/visualizers/StackVisualizer';
import { TapeVisualizer } from './components/visualizers/TapeVisualizer';
import { ExecutionTraceTable } from './components/simulation/ExecutionTraceTable';
import { BatchTester } from './components/simulation/BatchTester';
import { MachineProperties } from './components/sidebar/MachineProperties';
import { SubsetConstructionDrawer } from './components/conversion/SubsetConstructionDrawer';
import { ExportImportModal } from './components/sidebar/ExportImportModal';
import { TheoryHelpModal } from './components/ui/TheoryHelpModal';
import { QuestionSolverModal } from './components/solver/QuestionSolverModal';
import { useAutomataStore } from './store/useAutomataStore';
import { ListOrdered, FlaskConical, Info } from 'lucide-react';
import { LinkedInIcon } from './components/ui/LinkedInIcon';
import { MachineType } from './types/automata';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'simulator'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolverOpen, setIsSolverOpen] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'trace' | 'batch' | 'tuples'>('trace');

  const { machine, setMachineType, batchTestCases, theme } = useAutomataStore();
  const linkedInUrl = "https://www.linkedin.com/in/shivakanth-m-701631380";

  // Apply initial theme class to HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLaunchSimulator = (type?: MachineType, openSolver: boolean = false) => {
    if (type) {
      setMachineType(type);
    }
    if (openSolver) {
      setIsSolverOpen(true);
    }
    setCurrentView('simulator');
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchSimulator={handleLaunchSimulator}
        onOpenSolver={() => handleLaunchSimulator(undefined, true)}
      />
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-slate-50 dark:bg-[#0e0a0a] text-slate-900 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSolver={() => setIsSolverOpen(true)}
        onNavigateHome={() => setCurrentView('landing')}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 h-[calc(100dvh-3.5rem)] overflow-hidden">
        {/* Preset Sidebar (collapsible) */}
        {isSidebarOpen && <PresetSidebar />}

        {/* Center: Interactive Graph Canvas (#1C1313) with glowing boundary */}
        <div className="flex-1 relative h-full flex flex-col min-w-0 bg-sky-50 dark:bg-[#1C1313] border-r border-sky-200 dark:border-sky-500/20">
          <AutomataCanvas />
        </div>

        {/* Right Dock: Simulation Controls & Diagnostics with Dark Glass Chassis */}
        <div className="hidden md:flex w-[430px] max-w-[450px] h-full bg-slate-50 dark:bg-[#161111] border-l border-sky-200 dark:border-sky-500/20 flex-col p-3.5 space-y-3 overflow-y-auto overflow-x-hidden z-10 shadow-2xl box-border">
          {/* Main Simulation Deck (with glowing engine chassis) */}
          <SimulationDeck />

          {/* Dedicated Component Visualizer (PDA Stack or TM Tape) */}
          {machine.type === 'PDA' && <StackVisualizer />}
          {machine.type === 'TM' && <TapeVisualizer />}

          {/* Inspector Tabs (Trace / Batch / Tuples) */}
          <div className="flex items-center gap-1 p-1 bg-[#241919] rounded-xl border border-sky-300 dark:border-sky-500/30 shrink-0 shadow-inner">
            <button
              onClick={() => setActiveInspectorTab('trace')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeInspectorTab === 'trace'
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-md shadow-sky-200 dark:shadow-sky-950/40'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Step Trace</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('batch')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeInspectorTab === 'batch'
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-md shadow-sky-200 dark:shadow-sky-950/40'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Batch Tests</span>
              {batchTestCases.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeInspectorTab === 'batch'
                      ? 'bg-sky-50 dark:bg-[#1C1313] text-sky-600 dark:text-sky-400'
                      : 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                  }`}
                >
                  {batchTestCases.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveInspectorTab('tuples')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeInspectorTab === 'tuples'
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-md shadow-sky-200 dark:shadow-sky-950/40'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tuples</span>
            </button>
          </div>

          {/* Active Inspector Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {activeInspectorTab === 'trace' && <ExecutionTraceTable />}
            {activeInspectorTab === 'batch' && <BatchTester />}
            {activeInspectorTab === 'tuples' && <MachineProperties />}
          </div>

          {/* Footer Author Credits */}
          <div className="pt-2.5 border-t border-sky-200 dark:border-sky-500/20 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              Made by <strong className="text-slate-900 dark:text-white font-bold">Shivakanth</strong>
            </span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:text-sky-300 hover:underline font-semibold"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <SubsetConstructionDrawer />
      <ExportImportModal />
      <TheoryHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <QuestionSolverModal isOpen={isSolverOpen} onClose={() => setIsSolverOpen(false)} />
    </div>
  );
};

export default App;
