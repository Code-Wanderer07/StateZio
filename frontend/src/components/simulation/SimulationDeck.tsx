import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAutomataStore } from '../../store/useAutomataStore';

export const SimulationDeck: React.FC = () => {
  const {
    machine,
    inputString,
    setInputString,
    simulationResult,
    currentStepIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    runSimulation,
    stepForward,
    stepBackward,
    resetSimulation,
    jumpToStep,
  } = useAutomataStore(
    useShallow((state) => ({
      machine: state.machine,
      inputString: state.inputString,
      setInputString: state.setInputString,
      simulationResult: state.simulationResult,
      currentStepIndex: state.currentStepIndex,
      isPlaying: state.isPlaying,
      playbackSpeed: state.playbackSpeed,
      runSimulation: state.runSimulation,
      setIsPlaying: state.setIsPlaying,
      stepForward: state.stepForward,
      stepBackward: state.stepBackward,
      resetSimulation: state.resetSimulation,
      setPlaybackSpeed: state.setPlaybackSpeed,
      jumpToStep: state.jumpToStep,
    }))
  );

  // Playback timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const delayMs = Math.max(100, Math.round(800 / playbackSpeed));
      interval = setInterval(() => {
        const { simulationResult, currentStepIndex } = useAutomataStore.getState();
        if (simulationResult && currentStepIndex < simulationResult.traces.length - 1) {
          stepForward();
        } else {
          setIsPlaying(false);
        }
      }, delayMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, stepForward, setIsPlaying]);

  // Trigger celebration on accept
  useEffect(() => {
    if (simulationResult?.accepted && currentStepIndex === simulationResult.traces.length - 1) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#818cf8', '#34d399'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [simulationResult, currentStepIndex]);

  const totalSteps = simulationResult ? simulationResult.traces.length : 0;
  const currentTrace = simulationResult?.traces?.[currentStepIndex];
  const isFinalStep = simulationResult ? currentStepIndex === totalSteps - 1 : false;

  // Dynamic Engine Border & Glow State
  const getDeckBorderClass = () => {
    if (simulationResult && isFinalStep) {
      if (simulationResult.accepted) {
        return 'border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]';
      }
      return 'border-rose-500/80 ring-2 ring-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.25)]';
    }
    if (isPlaying) {
      return 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_25px_rgba(56,189,248,0.3)] animate-pulse';
    }
    return 'border-cyan-500/40 shadow-xl shadow-cyan-950/20 hover:border-cyan-400/60';
  };

  return (
    <div
      className={`flex flex-col bg-cyan-50 dark:bg-slate-950/95 backdrop-blur-xl border rounded-2xl p-4 space-y-3.5 w-full box-border overflow-hidden text-slate-900 dark:text-slate-100 transition-all duration-300 ${getDeckBorderClass()}`}
    >
      {/* Engine Header / Badge */}
      <div className="flex items-center justify-between pb-1 border-b border-cyan-200 dark:border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Simulation Engine ({machine.type})</span>
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-semibold">
          {isPlaying ? 'ACTIVE' : simulationResult ? 'READY' : 'STANDBY'}
        </span>
      </div>

      {/* Top Row: Input String & Run Button */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSimulation();
            }}
            placeholder={`Input for ${machine.type} (e.g. 0101, aaabbb)...`}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-cyan-300 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 dark:ring-cyan-400/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-500 outline-none transition-all"
          />
          {inputString.length === 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono pointer-events-none hidden sm:inline">
              (Empty ε)
            </span>
          )}
        </div>

        <button
          onClick={() => runSimulation()}
          disabled={isPlaying}
          aria-label="Run simulation"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all shrink-0 border ${
            isPlaying
              ? 'bg-cyan-900/40 border-cyan-700/30 text-cyan-600 dark:text-cyan-400/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-900 dark:text-white border-cyan-300/40 shadow-cyan-200 dark:shadow-cyan-950/40 cursor-pointer'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'Running…' : 'Simulate'}</span>
        </button>
      </div>

      {/* Middle Row: Playback Controls & Speed Adjuster */}
      <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
        {/* Step Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={resetSimulation}
            disabled={!simulationResult}
            title="Reset Simulation (Step 0)"
            className="p-2 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-cyan-200 dark:bg-slate-800 text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white transition-all active:scale-95 cursor-pointer border border-cyan-300 dark:border-cyan-500/30 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stepBackward}
            disabled={!simulationResult || currentStepIndex === 0}
            title="Step Backward"
            className="p-2 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-cyan-200 dark:bg-slate-800 text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white transition-all active:scale-95 cursor-pointer border border-cyan-300 dark:border-cyan-500/30 shadow-xs"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (!simulationResult) runSimulation();
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-900 dark:text-white shadow-lg shadow-amber-950/40 border border-amber-400/40'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 dark:text-white shadow-lg shadow-cyan-200 dark:shadow-cyan-950/40 border border-cyan-300/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={!simulationResult || isFinalStep}
            title="Step Forward"
            className="p-2 rounded-xl bg-cyan-200 dark:bg-slate-800 hover:bg-cyan-300 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-cyan-200 dark:bg-slate-800 text-cyan-800 dark:text-cyan-200 hover:text-slate-900 dark:text-white transition-colors cursor-pointer border border-cyan-300 dark:border-cyan-500/30 shadow-xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector (0.5x, 1x, 2x) */}
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-cyan-300 dark:border-cyan-500/30 shrink-0">
          <div className="flex items-center gap-0.5 px-1 text-slate-600 dark:text-slate-400" title="Playback Speed">
            <Gauge className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-cyan-500 text-white dark:text-[#1C1313] font-extrabold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-white/5'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Step Counter and Timeline */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Step Timeline:</span>
          </span>
          <span>
            <strong className="text-cyan-700 dark:text-cyan-300 font-bold">
              {totalSteps > 0 ? currentStepIndex + 1 : 0}
            </strong>{' '}
            / {totalSteps}
          </span>
        </div>

        {/* Progress Timeline Slider */}
        {totalSteps > 1 && (
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={(e) => jumpToStep(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-50 dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        )}
      </div>

      {/* Action Banner / Status Verdict */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/20 text-xs w-full overflow-hidden">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold shrink-0 text-[11px]">
            [S{currentStepIndex}]:
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate">
            {simulationResult?.message || currentTrace?.actionSummary || 'Simulation ready. Click Simulate to execute.'}
          </span>
        </div>

        {/* Final Acceptance Status Pill */}
        {simulationResult && isFinalStep && (
          <div className="shrink-0">
            {simulationResult.accepted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold shadow-md shadow-emerald-950/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ACCEPTED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[11px] font-bold shadow-md shadow-rose-950/40">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>REJECTED</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
