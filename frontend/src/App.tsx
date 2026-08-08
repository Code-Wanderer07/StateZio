import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolverOpen, setIsSolverOpen] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'trace' | 'batch' | 'tuples'>('trace');

  const { machine } = useAutomataStore();
  const linkedInUrl = "https://www.linkedin.com/in/shivakanth-m-701631380";

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSolver={() => setIsSolverOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Preset Sidebar (collapsible) */}
        {isSidebarOpen && <PresetSidebar />}

        {/* Center: Interactive Graph Canvas */}
        <div className="flex-1 relative h-full flex flex-col min-w-0 bg-slate-50">
          <AutomataCanvas />
        </div>

        {/* Right Dock: Simulation Controls & Diagnostics */}
        <div className="w-[440px] h-full bg-white border-l border-slate-200 flex flex-col p-4 space-y-4 overflow-y-auto z-10 shadow-sm">
          {/* Main Simulation Deck */}
          <SimulationDeck />

          {/* Dedicated Component Visualizer (PDA Stack or TM Tape) */}
          {machine.type === 'PDA' && <StackVisualizer />}
          {machine.type === 'TM' && <TapeVisualizer />}

          {/* Inspector Tabs (Trace / Batch / Tuples) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveInspectorTab('trace')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeInspectorTab === 'trace'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Step Trace</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('batch')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeInspectorTab === 'batch'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Batch Tests</span>
            </button>

            <button
              onClick={() => setActiveInspectorTab('tuples')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeInspectorTab === 'tuples'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tuples</span>
            </button>
          </div>

          {/* Active Inspector Tab Content */}
          <div className="flex-1 min-h-0">
            {activeInspectorTab === 'trace' && <ExecutionTraceTable />}
            {activeInspectorTab === 'batch' && <BatchTester />}
            {activeInspectorTab === 'tuples' && <MachineProperties />}
          </div>

          {/* Footer Author Credits */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              Made by <strong className="text-emerald-800 font-semibold">Shivakanth</strong>
            </span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 hover:underline font-medium"
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
