import React, { useRef, useEffect } from 'react';
import { Disc3, ArrowDown } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const TapeVisualizer: React.FC = () => {
  const { machine, simulationResult, currentStepIndex, inputString } = useAutomataStore();
  const tapeScrollRef = useRef<HTMLDivElement>(null);

  if (machine.type !== 'TM') return null;

  const blank = machine.blankSymbol || '_';
  const currentTrace = simulationResult?.traces?.[currentStepIndex];

  // If simulation is running, use trace tape; otherwise initialize with inputString
  let tape = currentTrace?.tape;
  if (!tape) {
    tape = inputString.length > 0 ? inputString.split('') : [blank];
  }
  const headIndex = currentTrace?.headIndex !== undefined ? currentTrace.headIndex : 0;

  // Auto-scroll tape to keep head cell centered
  useEffect(() => {
    if (tapeScrollRef.current) {
      const activeCell = tapeScrollRef.current.children[headIndex] as HTMLElement;
      if (activeCell) {
        activeCell.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [headIndex, currentStepIndex]);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-2xl p-4 shadow-xl text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Turing Machine Tape Visualizer
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
            Head Pos: [{headIndex}]
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
            Blank: '{blank}'
          </span>
        </div>
      </div>

      {/* Tape Head Indicator Arrow */}
      <div className="flex items-center justify-center pt-2 text-[11px] font-mono text-cyan-300 gap-1 animate-bounce">
        <ArrowDown className="w-4 h-4" />
        <span className="font-semibold tracking-wider">READ / WRITE HEAD</span>
      </div>

      {/* Horizontal Tape Scroll Strip */}
      <div className="relative my-2 py-3 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl overflow-x-auto shadow-inner">
        <div
          ref={tapeScrollRef}
          className="flex items-center justify-start gap-2 min-w-max px-8"
        >
          {tape.map((sym, idx) => {
            const isHead = idx === headIndex;
            return (
              <div
                key={`tape_cell_${idx}`}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                {/* Index label */}
                <span
                  className={`text-[9px] font-mono ${
                    isHead ? 'text-cyan-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  {idx}
                </span>

                {/* Tape Cell Box */}
                <div
                  className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 select-none shadow-md ${
                    isHead
                      ? 'bg-cyan-500/25 border-2 border-cyan-400 text-slate-900 dark:text-white shadow-cyan-950/60 scale-110 ring-2 ring-cyan-400/30'
                      : 'bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:border-white/20'
                  }`}
                >
                  {sym === blank ? (
                    <span className="text-slate-500 text-xs font-normal">_</span>
                  ) : (
                    sym
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1">
        <span>Infinite dynamic bidirectional tape</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">
          Current Symbol: <strong className="text-cyan-300 font-bold">'{tape[headIndex] || blank}'</strong>
        </span>
      </div>
    </div>
  );
};
