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
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Turing Machine Tape Visualizer
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            Head Pos: [{headIndex}]
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Blank: '{blank}'
          </span>
        </div>
      </div>

      {/* Tape Head Indicator Arrow */}
      <div className="flex items-center justify-center pt-2 text-[11px] font-mono text-emerald-700 gap-1 animate-bounce-subtle">
        <ArrowDown className="w-4 h-4" />
        <span className="font-semibold tracking-wider">READ / WRITE HEAD</span>
      </div>

      {/* Horizontal Tape Scroll Strip */}
      <div className="relative my-2 py-3 px-2 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto shadow-inner">
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
                    isHead ? 'text-emerald-800 font-bold' : 'text-slate-400'
                  }`}
                >
                  {idx}
                </span>

                {/* Tape Cell Box */}
                <div
                  className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 select-none shadow-xs ${
                    isHead
                      ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-md scale-110 ring-2 ring-emerald-500/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sym === blank ? (
                    <span className="text-slate-400 text-xs font-normal">_</span>
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
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Infinite dynamic bidirectional tape</span>
        <span className="font-mono text-slate-700">
          Current Symbol: <strong className="text-emerald-800 font-bold">'{tape[headIndex] || blank}'</strong>
        </span>
      </div>
    </div>
  );
};
