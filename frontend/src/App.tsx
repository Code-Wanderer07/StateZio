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
import { Suspense, lazy } from 'react';

const ExportImportModal = lazy(() => import('./components/sidebar/ExportImportModal').then(module => ({ default: module.ExportImportModal })));
const TheoryHelpModal = lazy(() => import('./components/ui/TheoryHelpModal').then(module => ({ default: module.TheoryHelpModal })));
const QuestionSolverModal = lazy(() => import('./components/solver/QuestionSolverModal').then(module => ({ default: module.QuestionSolverModal })));
const SubsetConstructionDrawer = lazy(() => import('./components/conversion/SubsetConstructionDrawer').then(module => ({ default: module.SubsetConstructionDrawer })));
import { NodeProperties } from './components/sidebar/NodeProperties';
import { useAutomataStore } from './store/useAutomataStore';
import { MachineType } from './types/automata';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'simulator'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolverOpen, setIsSolverOpen] = useState(false);
  
  // Mobile active tab logic (Canvas, Trace, Batch, Tuples)
  const [mobileActiveTab, setMobileActiveTab] = useState<'canvas' | 'trace' | 'batch' | 'tuples'>('canvas');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'engine' | 'trace' | 'batch' | 'tuples'>('engine');

  const { machine, setMachineType, batchTestCases, theme, toggleTheme, undo, redo } = useAutomataStore(
    useShallow((state) => ({
      machine: state.machine,
      setMachineType: state.setMachineType,
      batchTestCases: state.batchTestCases,
      theme: state.theme,
      toggleTheme: state.toggleTheme,
      undo: state.undo,
      redo: state.redo,
    }))
  );

  // Global Keyboard Shortcuts (Undo/Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLaunchSimulator = useCallback((type?: MachineType, openSolver: boolean = false) => {
    if (type) setMachineType(type);
    if (openSolver) setIsSolverOpen(true);
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
    <div className="flex flex-col h-[100dvh] w-full bg-background text-on-surface overflow-hidden font-sans select-none relative">
      
      {/* Top Navigation - Shared */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenHelp={handleOpenHelp}
        onOpenSolver={handleOpenSolver}
        onNavigateHome={handleNavigateHome}
        mobileActiveTab={mobileActiveTab}
        setMobileActiveTab={setMobileActiveTab}
      />

      {/* Main Workspace */}
      <main className="flex-1 relative flex w-full overflow-hidden">
        
        {/* Preset Sidebar (Desktop Modal/Drawer) */}
        {isSidebarOpen && <PresetSidebar onClose={() => setIsSidebarOpen(false)} />}

        {/* Mobile Top Pill Navigation */}
        <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-surface-container-high/90 backdrop-blur-2xl rounded-xl border border-outline-variant/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] p-1 flex gap-1 font-code text-xs">
           <button onClick={() => setMobileActiveTab('canvas')} className={`px-3 py-1.5 rounded-lg transition-colors ${mobileActiveTab === 'canvas' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Canvas</button>
           <button onClick={() => setMobileActiveTab('trace')} className={`px-3 py-1.5 rounded-lg transition-colors ${mobileActiveTab === 'trace' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Trace</button>
           <button onClick={() => setMobileActiveTab('batch')} className={`px-3 py-1.5 rounded-lg transition-colors ${mobileActiveTab === 'batch' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Batch</button>
           <button onClick={() => setMobileActiveTab('tuples')} className={`px-3 py-1.5 rounded-lg transition-colors ${mobileActiveTab === 'tuples' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Tuples</button>
        </div>

        {/* Center Canvas Area (Visible always on Desktop, visible on Mobile always as background) */}
        <div className={`flex-1 relative flex flex-col min-h-0 min-w-0 dot-grid z-0 md:mr-80`}>
          <AutomataCanvas />
        </div>

        {/* Desktop Inspector Sidebar (Right) */}
        <aside id="tour-inspector" className="hidden md:flex fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-surface-container-low/90 backdrop-blur-md border-l border-outline-variant/20 shadow-lg z-40 flex-col transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-outline-variant/20 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                    <h2 className="font-headline-sm text-xl font-semibold text-primary">Inspector</h2>
                </div>
                {/* Tab Switcher */}
                <div className="flex bg-surface-container rounded-lg p-1 gap-1 w-full">
                   <button onClick={() => setActiveInspectorTab('engine')} className={`flex-1 py-1 text-xs font-label-caps rounded-md transition-colors ${activeInspectorTab === 'engine' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Props</button>
                   <button onClick={() => setActiveInspectorTab('trace')} className={`flex-1 py-1 text-xs font-label-caps rounded-md transition-colors ${activeInspectorTab === 'trace' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Trace</button>
                   <button id="tour-tab-batch" onClick={() => setActiveInspectorTab('batch')} className={`flex-1 py-1 text-xs font-label-caps rounded-md transition-colors ${activeInspectorTab === 'batch' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Batch</button>
                   <button id="tour-tab-tuples" onClick={() => setActiveInspectorTab('tuples')} className={`flex-1 py-1 text-xs font-label-caps rounded-md transition-colors ${activeInspectorTab === 'tuples' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Tuples</button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto w-full">
               {activeInspectorTab === 'engine' && (
                  <div className="flex flex-col gap-4 p-2 h-full">
                    <NodeProperties />
                    {machine.type === 'PDA' && <StackVisualizer />}
                    {machine.type === 'TM' && <TapeVisualizer />}
                  </div>
               )}
               {activeInspectorTab === 'trace' && (
                  <div className="p-2 w-full h-full">
                     <ExecutionTraceTable />
                  </div>
               )}
               {activeInspectorTab === 'batch' && (
                  <div className="p-2 w-full h-full">
                     <BatchTester />
                  </div>
               )}
               {activeInspectorTab === 'tuples' && (
                  <div className="p-2 w-full h-full">
                     <MachineProperties />
                  </div>
               )}
            </div>


        </aside>

        {/* Desktop Floating Simulation Deck (Bottom) */}
        <div className="hidden md:flex absolute bottom-6 left-0 right-80 justify-center px-container-padding z-30 pointer-events-none">
          <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2 shadow-2xl pointer-events-auto w-full max-w-4xl mx-8">
            <SimulationDeck />
          </div>
        </div>

        {/* Mobile Floating Simulation Deck (Bottom, above controls) */}
        <div className="md:hidden absolute bottom-24 left-2 right-2 z-40 pointer-events-none flex justify-center">
          <div className="glass-panel rounded-xl p-2 flex flex-col gap-1 shadow-2xl pointer-events-auto w-full max-w-md bg-surface-container-highest/90 backdrop-blur-2xl">
            <SimulationDeck />
          </div>
        </div>

        {/* Mobile Views Content Overlays */}
        {mobileActiveTab !== 'canvas' && (
          <div className="md:hidden absolute inset-0 z-30 bg-background/95 backdrop-blur-md pt-16 pb-32 px-4 overflow-y-auto">
             {mobileActiveTab === 'trace' && (
               <div className="space-y-4">
                  <ExecutionTraceTable />
               </div>
             )}
             {mobileActiveTab === 'batch' && <BatchTester />}
             {mobileActiveTab === 'tuples' && <MachineProperties />}
          </div>
        )}

      </main>

      {/* Global Modals & Drawers */}
      <Suspense fallback={null}>
        <ExportImportModal />
        <TheoryHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        <QuestionSolverModal isOpen={isSolverOpen} onClose={() => setIsSolverOpen(false)} />
        <SubsetConstructionDrawer />
      </Suspense>
    </div>
  );
};

export default App;
