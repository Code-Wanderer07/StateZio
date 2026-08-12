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
    <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 bg-surface-container-highest/60 backdrop-blur-2xl rounded-full flex-col items-center gap-2 py-4 px-2 border border-outline-variant/30 shadow-2xl">
      
      {/* Guide Button with Popup */}
      <div className="relative group">
        <button 
          onClick={startTour}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="p-1.5 rounded-full text-primary hover:text-primary-fixed hover:bg-primary/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(76,215,246,0.2)] bg-primary/10" 
        >
          <span className="material-symbols-outlined text-2xl font-bold animate-pulse">school</span>
        </button>
        
        {/* Tooltip */}
        <div className={`absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(76,215,246,0.4)] pointer-events-none transition-all duration-300 ${(showTooltip || isHovered) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          Click this to know how to use the simulator!
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-t-4 border-t-transparent border-r-4 border-r-primary border-b-4 border-b-transparent"></div>
        </div>
      </div>

      <div className="w-6 h-px bg-outline-variant/30 my-1"></div>

      <button className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Select">
        <span className="material-symbols-outlined text-xl">near_me</span>
      </button>
      <button id="tour-add-state" onClick={addState} className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Add State">
        <span className="material-symbols-outlined text-xl">add_circle</span>
      </button>
      
      <div className="w-6 h-px bg-outline-variant/30 my-1"></div>
      
      <button id="tour-auto-layout" onClick={autoLayout} className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Auto-Layout">
        <span className="material-symbols-outlined text-xl">auto_awesome</span>
      </button>
      <button onClick={clearCanvas} className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-bright/50 transition-all active:scale-95" title="Clear Canvas">
        <span className="material-symbols-outlined text-xl">layers_clear</span>
      </button>

      {/* Export/Import was in the old toolbar, adding it here */}
      <button onClick={() => setIsExportImportOpen(true)} className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-bright/50 transition-all active:scale-95" title="Export / Import">
        <span className="material-symbols-outlined text-xl">download</span>
      </button>

      {/* Convert NFA to DFA if applicable */}
      {machine.type === 'NFA' && (
        <button onClick={runSubsetConstruction} className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 transition-all active:scale-95" title="Convert NFA to DFA">
          <span className="material-symbols-outlined text-xl">fork_right</span>
        </button>
      )}
      
      <div className="w-6 h-px bg-outline-variant/30 my-1"></div>
      
      <div id="tour-undo-redo" className="flex flex-col items-center gap-2">
        <button 
          onClick={undo}
          disabled={pastStates.length === 0}
          className={`p-1.5 rounded-full transition-all active:scale-95 ${
            pastStates.length === 0 
              ? 'text-on-surface-variant/30 cursor-not-allowed' 
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright/50'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <span className="material-symbols-outlined text-xl">undo</span>
        </button>
        <button 
          onClick={redo}
          disabled={futureStates.length === 0}
          className={`p-1.5 rounded-full transition-all active:scale-95 ${
            futureStates.length === 0 
              ? 'text-on-surface-variant/30 cursor-not-allowed' 
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright/50'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <span className="material-symbols-outlined text-xl">redo</span>
        </button>
      </div>
    </div>
  );
};
