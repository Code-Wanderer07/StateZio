import React, { useEffect } from 'react';
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
  } = useAutomataStore();

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
          colors: ['#047857', '#059669', '#10b981'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [simulationResult, currentStepIndex]);

  const totalSteps = simulationResult ? simulationResult.traces.length : 0;
  const currentTrace = simulationResult?.traces?.[currentStepIndex];
  const isFinalStep = simulationResult ? currentStepIndex === totalSteps - 1 : false;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3 w-full box-border overflow-hidden">
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
            className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 placeholder-slate-400 outline-none transition-all"
          />
          {inputString.length === 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none hidden sm:inline">
              (Empty ε)
            </span>
          )}
        </div>

        <button
          onClick={() => runSimulation()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate</span>
        </button>
      </div>

      {/* Middle Row: Playback Controls & Speed Adjuster (Cleanly Wrapped, No Overflow) */}
      <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
        {/* Step Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={resetSimulation}
            disabled={!simulationResult}
            title="Reset Simulation (Step 0)"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stepBackward}
            disabled={!simulationResult || currentStepIndex === 0}
            title="Step Backward"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (!simulationResult) runSimulation();
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={!simulationResult || isFinalStep}
            title="Step Forward"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector (Fixed 0.5x, 1x, 2x, stays inside bounds) */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
          <div className="flex items-center gap-0.5 px-1 text-slate-500" title="Playback Speed">
            <Gauge className="w-3 h-3" />
          </div>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Step Counter and Timeline */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-700" />
            <span>Step Counter:</span>
          </span>
          <span>
            <strong className="text-slate-900 font-bold">
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
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
        )}
      </div>

      {/* Action Banner / Status Verdict */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full overflow-hidden">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2">
          <span className="text-emerald-800 font-mono font-bold shrink-0 text-[11px]">
            [S{currentStepIndex}]:
          </span>
          <span className="text-slate-700 font-mono text-[11px] truncate">
            {currentTrace?.actionSummary || 'Simulation ready. Click Simulate.'}
          </span>
        </div>

        {/* Final Acceptance Status Pill */}
        {simulationResult && isFinalStep && (
          <div className="shrink-0">
            {simulationResult.accepted ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>ACCEPTED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold shadow-xs">
                <XCircle className="w-3 h-3 text-rose-700" />
                <span>REJECTED</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
