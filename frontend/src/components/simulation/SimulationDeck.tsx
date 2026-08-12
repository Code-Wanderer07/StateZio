import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAutomataStore } from '../../store/useAutomataStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Activity, Info, AlertTriangle, AlertCircle, Sparkles, CheckCircle2, ChevronDown, Rocket, Clock, Database, Eye, ActivitySquare, RefreshCw, Gauge } from 'lucide-react';

export const SimulationDeck: React.FC = () => {
  const {
    machine,
    inputString,
    setInputString,
    simulationResult,
    runSimulation,
    resetSimulation,
    stepForward,
    stepBackward,
    jumpToStep,
    currentStepIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
  } = useAutomataStore(
    useShallow((state) => ({
      machine: state.machine,
      inputString: state.inputString,
      setInputString: state.setInputString,
      simulationResult: state.simulationResult,
      runSimulation: state.runSimulation,
      resetSimulation: state.resetSimulation,
      stepForward: state.stepForward,
      stepBackward: state.stepBackward,
      jumpToStep: state.jumpToStep,
      currentStepIndex: state.currentStepIndex,
      isPlaying: state.isPlaying,
      setIsPlaying: state.setIsPlaying,
      playbackSpeed: state.playbackSpeed,
      setPlaybackSpeed: state.setPlaybackSpeed,
    }))
  );

  const totalSteps = simulationResult?.traces.length || 0;
  const isFinalStep = currentStepIndex >= totalSteps - 1;
  const currentStep = simulationResult?.traces[currentStepIndex];

  // Helper to get border color based on status
  const getDeckBorderClass = () => {
    if (!simulationResult) return 'border-outline-variant/30 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-none';
    if (simulationResult.accepted) return 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)] dark:shadow-green-950/40 ring-1 ring-green-400/50';
    return 'border-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.2)] dark:shadow-rose-950/40 ring-1 ring-rose-400/50';
  };

  const stepRef = useRef(stepForward);
  const isFinalRef = useRef(isFinalStep);
  const playingRef = useRef(isPlaying);
  const setPlayingRef = useRef(setIsPlaying);

  useEffect(() => {
    stepRef.current = stepForward;
    isFinalRef.current = isFinalStep;
    playingRef.current = isPlaying;
    setPlayingRef.current = setIsPlaying;
  }, [stepForward, isFinalStep, isPlaying, setIsPlaying]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (isFinalRef.current) {
          setPlayingRef.current(false);
        } else {
          stepRef.current();
        }
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, playbackSpeed]);

  return (
    <div className="flex flex-col w-full box-border overflow-hidden text-on-surface">
      <div className="flex items-center justify-center overflow-hidden py-2 px-2">
        <div className="flex items-center font-code-md text-base overflow-x-auto custom-scrollbar min-w-0 bg-surface-container/30 backdrop-blur-sm rounded-xl p-1.5 border border-outline-variant/20 shadow-inner">
          {!simulationResult && inputString.length === 0 && (
             <div className="text-on-surface-variant/50 text-sm italic font-sans py-1 px-4">No input provided</div>
          )}
          {simulationResult ? (
            inputString.split('').map((char, index) => {
              const isActive = (machine.type === 'DFA' || machine.type === 'NFA') 
                ? (index === currentStepIndex - (currentStepIndex === totalSteps - 1 ? 2 : 1)) 
                : false;

              return (
                <div 
                  key={index} 
                  className={`relative w-8 h-10 flex-shrink-0 flex items-center justify-center transition-all duration-300 font-bold ${
                    isActive 
                      ? 'text-cyan-400 scale-110 z-10' 
                      : 'text-on-surface/70 hover:text-on-surface'
                  }`}
                >
                  {char}
                  {isActive && (
                    <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                  )}
                </div>
              );
            })
          ) : (
            inputString.split('').map((char, index) => (
              <div key={index} className="w-8 h-10 flex-shrink-0 flex items-center justify-center text-on-surface-variant/60 font-medium">
                {char}
              </div>
            ))
          )}
          <div className="w-8 h-10 flex-shrink-0 flex items-center justify-center text-on-surface-variant/30 opacity-50">_</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-outline-variant/20 pt-2 pb-1 gap-2 md:gap-0">
        <div id="tour-sim-input" className="flex items-center gap-4 w-full md:w-1/3">
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSimulation();
            }}
            placeholder="Enter test string..."
            className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface font-code-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div id="tour-sim-play" className="flex items-center justify-center w-full md:w-auto">
          {!simulationResult ? (
              <button onClick={() => {
                runSimulation();
                setIsPlaying(true);
              }} className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#1C1313] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
           ) : (
              <div className="flex items-center gap-1 bg-surface-container/40 backdrop-blur-md rounded-full px-3 py-1 border border-outline-variant/20 shadow-inner w-full md:w-auto justify-center">
                <button onClick={stepBackward} disabled={currentStepIndex === 0} className="p-1.5 rounded-full text-on-surface hover:text-cyan-400 hover:bg-surface-variant/50 transition-all disabled:opacity-30">
                  <span className="material-symbols-outlined text-xl">skip_previous</span>
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} disabled={isFinalStep} className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#1C1313] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none mx-2">
                  {isPlaying ? (
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                  ) : (
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  )}
                </button>
                <button onClick={stepForward} disabled={isFinalStep} className="p-1.5 rounded-full text-on-surface hover:text-cyan-400 hover:bg-surface-variant/50 transition-all disabled:opacity-30">
                  <span className="material-symbols-outlined text-xl">skip_next</span>
                </button>
                <div className="hidden md:block w-[1px] h-5 bg-outline-variant/30 mx-1"></div>
                <button onClick={resetSimulation} className="p-1.5 rounded-full text-on-surface-variant hover:text-rose-400 hover:bg-surface-variant/50 transition-all" title="Reset Simulation">
                   <span className="material-symbols-outlined text-[18px]">replay</span>
                </button>
              </div>
           )}
        </div>

        <div id="tour-sim-speed" className="flex items-center gap-2 w-full md:w-1/3 justify-center md:justify-end">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">speed</span>
          <div className="flex items-center bg-surface-container/40 backdrop-blur-md rounded-lg p-1 border border-outline-variant/20 md:mr-2 text-[10px] font-mono font-bold shadow-inner">
            <button onClick={() => setPlaybackSpeed(0.5)} className={`px-2 py-1 rounded-md transition-all ${playbackSpeed === 0.5 ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_4px_rgba(6,182,212,0.3)]' : 'text-on-surface-variant hover:text-on-surface'}`}>.5x</button>
            <button onClick={() => setPlaybackSpeed(1.0)} className={`px-2 py-1 rounded-md transition-all ${playbackSpeed === 1.0 ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_4px_rgba(6,182,212,0.3)]' : 'text-on-surface-variant hover:text-on-surface'}`}>1x</button>
            <button onClick={() => setPlaybackSpeed(2.0)} className={`px-2 py-1 rounded-md transition-all ${playbackSpeed === 2.0 ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_4px_rgba(6,182,212,0.3)]' : 'text-on-surface-variant hover:text-on-surface'}`}>2x</button>
            <button onClick={() => setPlaybackSpeed(4.0)} className={`px-2 py-1 rounded-md transition-all ${playbackSpeed === 4.0 ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_4px_rgba(6,182,212,0.3)]' : 'text-on-surface-variant hover:text-on-surface'}`}>4x</button>
          </div>
        </div>
      </div>
    </div>
  );
};
