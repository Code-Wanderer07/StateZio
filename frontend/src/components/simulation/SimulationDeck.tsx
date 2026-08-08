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
      } catch (err) {
        // Confetti fallback
      }
    }
  }, [simulationResult, currentStepIndex]);

  const totalSteps = simulationResult ? simulationResult.traces.length : 0;
  const currentTrace = simulationResult?.traces?.[currentStepIndex];
  const isFinalStep = simulationResult ? currentStepIndex === totalSteps - 1 : false;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Top Row: Input String & Run Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runSimulation();
            }}
            placeholder={`Enter input string for ${machine.type} (e.g. 0101, aaabbb)...`}
            className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 outline-none transition-all"
          />
          {inputString.length === 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none">
              (Empty String ε)
            </span>
          )}
        </div>

        <button
          onClick={() => runSimulation()}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate</span>
        </button>
      </div>

      {/* Middle Row: Playback Controls & Speed */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetSimulation}
            disabled={!simulationResult}
            title="Reset Simulation (Step 0)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stepBackward}
            disabled={!simulationResult || currentStepIndex === 0}
            title="Step Backward"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (!simulationResult) runSimulation();
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
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
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>
            Step: <strong className="text-slate-800">{totalSteps > 0 ? currentStepIndex + 1 : 0}</strong> / {totalSteps}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Gauge className="w-3 h-3 text-slate-500 ml-1" />
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-colors ${
                playbackSpeed === spd
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress Timeline Slider */}
      {totalSteps > 1 && (
        <div className="px-1 pt-1">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={(e) => jumpToStep(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
        </div>
      )}

      {/* Action Banner / Status Verdict */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2 flex-1 mr-3 overflow-hidden">
          <span className="text-emerald-800 font-mono font-semibold shrink-0">
            [Step {currentStepIndex}]:
          </span>
          <span className="text-slate-700 font-mono truncate">
            {currentTrace?.actionSummary || 'Simulation ready. Press Simulate to begin.'}
          </span>
        </div>

        {/* Final Acceptance Status Pill */}
        {simulationResult && isFinalStep && (
          <div className="shrink-0">
            {simulationResult.accepted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>ACCEPTED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold shadow-xs">
                <XCircle className="w-3.5 h-3.5 text-rose-700" />
                <span>REJECTED</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
