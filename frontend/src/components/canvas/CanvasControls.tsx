import React, { useState, useEffect } from 'react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { startTour } from '../../utils/tour';

export const CanvasControls: React.FC = () => {
  const {
    machine,
    addState,
    autoLayout,
    clearCanvas,
    runSubsetConstruction,
    setIsExportImportOpen,
    setIsGuideOpen,
    undo,
    redo,
    pastStates,
    futureStates,
  } = useAutomataStore();

  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show tooltip on initial load for a few seconds
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex fixed md:left-6 md:top-1/2 md:-translate-y-1/2 bottom-0 md:bottom-auto left-0 w-full md:w-auto z-50 bg-surface-container-highest/90 md:bg-surface-container-highest/90 backdrop-blur-2xl md:rounded-full rounded-t-none md:border border-t-0 border-x-0 border-b-0 border-outline-variant/30 shadow-none md:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex-row md:flex-col items-center justify-around md:justify-center md:gap-2 md:py-6 md:px-2 px-1 pt-1.5 pb-3 overflow-x-auto md:overflow-visible hide-scrollbar">
      
      {/* Guide Button with Popup */}
      <div className="relative group flex-shrink-0">
        <button 
          onClick={startTour}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex flex-col items-center p-1.5 md:p-1.5 rounded-lg md:rounded-full text-primary hover:text-cyan-300 hover:bg-primary/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(76,215,246,0.2)] bg-primary/10" 
        >
          <span className="material-symbols-outlined text-xl md:text-2xl font-bold animate-pulse">school</span>
          <span className="md:hidden text-[9px] font-label-caps mt-1">Guide</span>
        </button>
        
        {/* Tooltip (Desktop only) */}
        <div className={`hidden md:block absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(76,215,246,0.4)] pointer-events-none transition-all duration-300 ${(showTooltip || isHovered) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          Click this to know how to use the simulator!
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-t-4 border-t-transparent border-r-4 border-r-primary border-b-4 border-b-transparent"></div>
        </div>
      </div>

      <div className="hidden md:block w-6 h-px bg-outline-variant/30 my-1"></div>
      <div className="md:hidden h-8 w-px bg-outline-variant/30 mx-1"></div>

      <button className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Select">
        <span className="material-symbols-outlined text-xl">near_me</span>
        <span className="md:hidden text-[9px] font-label-caps mt-1">Select</span>
      </button>
      <button id="tour-add-state" onClick={addState} className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Add State">
        <span className="material-symbols-outlined text-xl">add_circle</span>
        <span className="md:hidden text-[9px] font-label-caps mt-1">State</span>
      </button>
      
      <div className="hidden md:block w-6 h-px bg-outline-variant/30 my-1"></div>
      <div className="md:hidden h-8 w-px bg-outline-variant/30 mx-1"></div>
      
      <button id="tour-auto-layout" onClick={autoLayout} className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Auto-Layout">
        <span className="material-symbols-outlined text-xl">auto_awesome</span>
        <span className="md:hidden text-[9px] font-label-caps mt-1">Layout</span>
      </button>
      <button onClick={clearCanvas} className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-on-surface-variant hover:text-error hover:bg-surface-bright/50 transition-all active:scale-95" title="Clear Graph">
        <span className="material-symbols-outlined text-xl">delete_sweep</span>
        <span className="md:hidden text-[9px] font-label-caps mt-1">Clear All</span>
      </button>

      {/* Export/Import was in the old toolbar, adding it here */}
      <button onClick={() => setIsExportImportOpen(true)} className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Export / Import">
        <span className="material-symbols-outlined text-xl">download</span>
        <span className="md:hidden text-[9px] font-label-caps mt-1">Export</span>
      </button>

      {/* Convert NFA to DFA if applicable */}
      {machine.type === 'NFA' && (
        <button onClick={runSubsetConstruction} className="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 transition-all active:scale-95" title="Convert NFA to DFA">
          <span className="material-symbols-outlined text-xl">fork_right</span>
          <span className="md:hidden text-[9px] font-label-caps mt-1">Subset</span>
        </button>
      )}
      
      <div className="hidden md:block w-6 h-px bg-outline-variant/30 my-1"></div>
      <div className="md:hidden h-8 w-px bg-outline-variant/30 mx-1"></div>
      
      <div id="tour-undo-redo" className="flex flex-row md:flex-col items-center gap-2">
        <button 
          onClick={undo}
          disabled={pastStates.length === 0}
          className={`flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full transition-all active:scale-95 ${
            pastStates.length === 0 
              ? 'text-on-surface-variant/30 cursor-not-allowed' 
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright/50'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <span className="material-symbols-outlined text-xl">undo</span>
          <span className="md:hidden text-[9px] font-label-caps mt-1">Undo</span>
        </button>
        <button 
          onClick={redo}
          disabled={futureStates.length === 0}
          className={`flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg md:rounded-full transition-all active:scale-95 ${
            futureStates.length === 0 
              ? 'text-on-surface-variant/30 cursor-not-allowed' 
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright/50'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <span className="material-symbols-outlined text-xl">redo</span>
          <span className="md:hidden text-[9px] font-label-caps mt-1">Redo</span>
        </button>
      </div>
    </div>
  );
};
