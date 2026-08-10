import React, { useState, useEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
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
import { ListOrdered, FlaskConical, Info, Cpu } from 'lucide-react';
import { LinkedInIcon } from './components/ui/LinkedInIcon';
import { MachineType } from './types/automata';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'simulator'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolverOpen, setIsSolverOpen] = useState(false);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'engine' | 'trace' | 'batch' | 'tuples'>('engine');

  const { machine, setMachineType, batchTestCases, theme } = useAutomataStore(
    useShallow((state) => ({
      machine: state.machine,
      setMachineType: state.setMachineType,
      batchTestCases: state.batchTestCases,
      theme: state.theme,
    }))
  );
  const linkedInUrl = "https://www.linkedin.com/in/shivakanth-m-701631380";

  // Apply initial theme class to HTML root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLaunchSimulator = useCallback((type?: MachineType, openSolver: boolean = false) => {
    if (type) {
      setMachineType(type);
    }
    if (openSolver) {
      setIsSolverOpen(true);
    }
    setCurrentView('simulator');
  }, [setMachineType]);

  const handleOpenSolverFromLanding = useCallback(() => {
    handleLaunchSimulator(undefined, true);
  }, [handleLaunchSimulator]);

  const handleOpenHelp = useCallback(() => setIsHelpOpen(true), []);
  const handleOpenSolver = useCallback(() => setIsSolverOpen(true), []);
  const handleNavigateHome = useCallback(() => setCurrentView('landing'), []);

  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchSimulator={handleLaunchSimulator}
        onOpenSolver={handleOpenSolverFromLanding}
      />
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenHelp={handleOpenHelp}
        onOpenSolver={handleOpenSolver}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-row flex-1 h-[calc(100dvh-3.5rem)] relative overflow-hidden">
        {/* Preset Sidebar (collapsible) */}
        {isSidebarOpen && <PresetSidebar onClose={() => setIsSidebarOpen(false)} />}

        {/* Center: Interactive Graph Canvas (#1C1313) with glowing boundary */}
        <div className="flex-1 relative flex flex-col min-h-0 min-w-0 bg-sky-50 dark:bg-slate-950 border-b md:border-b-0 md:border-r border-sky-200 dark:border-sky-500/20">
          <AutomataCanvas />
          {/* Mobile Controls Toggle Buttons */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden flex gap-2 w-max max-w-[90vw]">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-full shadow-xl shadow-slate-900/40 border border-slate-600 font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Presets
            </button>
            <button 
              onClick={() => setIsMobileControlsOpen(prev => !prev)}
              className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-2.5 rounded-full shadow-xl shadow-sky-900/20 border border-sky-400 font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <ListOrdered className="w-4 h-4" />
              {isMobileControlsOpen ? 'Hide Controls' : 'Controls'}
            </button>
          </div>
        </div>

        {/* Right Dock: Simulation Controls & Diagnostics with Dark Glass Chassis */}
        <div className={`flex w-full md:w-[430px] md:max-w-[450px] md:relative absolute bottom-0 left-0 right-0 z-50 md:z-10 transition-transform duration-300 ease-in-out ${isMobileControlsOpen ? 'translate-y-0' : 'translate-y-[100%] md:translate-y-0'} h-auto md:h-full max-h-[85vh] md:max-h-none bg-slate-50 dark:bg-slate-900 md:border-l border-t md:border-t-0 border-sky-200 dark:border-sky-500/20 flex-col p-3.5 space-y-3 overflow-y-auto box-border shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-2xl rounded-t-2xl md:rounded-none`}>
          {/* Mobile Close Button for Controls */}
          <div className="md:hidden flex justify-end mb-1">
            <button 
              onClick={() => setIsMobileControlsOpen(false)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {/* Main Simulation Deck for Desktop */}
          <div className="hidden md:flex flex-col space-y-3 shrink-0">
            <SimulationDeck />
            {machine.type === 'PDA' && <StackVisualizer />}
            {machine.type === 'TM' && <TapeVisualizer />}
          </div>

          {/* Inspector Tabs (Engine / Trace / Batch / Tuples) */}
          <div className="flex items-center gap-1 p-1 bg-sky-100 dark:bg-slate-900 rounded-xl border border-sky-300 dark:border-sky-500/30 shrink-0 shadow-inner">
            <button
              onClick={() => setActiveInspectorTab('engine')}
              className={`md:hidden flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeInspectorTab === 'engine'
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-md shadow-sky-200 dark:shadow-sky-950/40'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Engine</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('trace')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeInspectorTab === 'trace'
                  ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-md shadow-sky-200 dark:shadow-sky-950/40'
                  : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Step Trace</span>
              <span className="sm:hidden">Trace</span>
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
              <span className="hidden sm:inline">Batch Tests</span>
              <span className="sm:hidden">Batch</span>
              {batchTestCases.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeInspectorTab === 'batch'
                      ? 'bg-sky-50 dark:bg-slate-950 text-sky-600 dark:text-sky-400'
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
          <div className="flex-none md:flex-1 md:min-h-0 overflow-y-auto overflow-x-auto mb-4 md:mb-0 pb-6 md:pb-0">
            {activeInspectorTab === 'engine' && (
              <>
                <div className="md:hidden space-y-3">
                  <SimulationDeck />
                  {machine.type === 'PDA' && <StackVisualizer />}
                  {machine.type === 'TM' && <TapeVisualizer />}
                </div>
                <div className="hidden md:block h-full">
                  <ExecutionTraceTable />
                </div>
              </>
            )}
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
