import React, { useRef, useEffect } from 'react';
import { Disc3, ArrowDown } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const TapeVisualizer: React.FC = () => {
  const { machine, simulationResult, currentStepIndex, inputString } = useAutomataStore();
  const tapeScrollRef = useRef<HTMLDivElement>(null);

  if (machine.type !== 'TM') return null;

  const blank = machine.blankSymbol || '_';
  const currentTrace = simulationResult?.traces?.[currentStepIndex];

  let tape = currentTrace?.tape ? [...currentTrace.tape] : [];
  if (tape.length === 0) {
    tape = inputString.length > 0 ? inputString.split('') : [blank];
  }
  let headIndex = currentTrace?.headIndex !== undefined ? currentTrace.headIndex : 0;

  // Dynamically pad the tape for visualization if head moves out of bounds
  while (headIndex < 0) {
    tape.unshift(blank);
    headIndex++;
  }
  while (headIndex >= tape.length) {
    tape.push(blank);
  }
  // Add a few extra blanks on either side for better infinite tape visual feel
  const PADDING = 3;
  const renderTape = [
    ...Array(PADDING).fill(blank),
    ...tape,
    ...Array(PADDING).fill(blank),
  ];
  const renderHeadIndex = headIndex + PADDING;

  // Auto-scroll tape to keep head cell centered
  useEffect(() => {
    if (tapeScrollRef.current) {
      const activeCell = tapeScrollRef.current.children[renderHeadIndex] as HTMLElement;
      if (activeCell) {
        activeCell.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [renderHeadIndex, currentStepIndex]);

  return (
    <div className="flex flex-col bg-surface-container/30 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Tape Visualizer
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-[inset_0_0_8px_rgba(34,211,238,0.1)]">
            Head Pos: [{headIndex}]
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-variant/50 text-on-surface-variant border border-outline-variant/20">
            Blank: '{blank}'
          </span>
        </div>
      </div>

      {/* Tape Head Indicator Arrow (Removed in favor of scanner bracket below) */}
      <div className="pt-3"></div>

      {/* Horizontal Tape Scroll Strip */}
      <div className="relative my-2 py-3 px-2 bg-background/50 backdrop-blur-md border border-outline-variant/10 rounded-xl overflow-x-auto shadow-inner">
        <div
          ref={tapeScrollRef}
          className="flex items-center justify-start gap-2 min-w-max px-8"
        >
          {renderTape.map((sym, idx) => {
            const isHead = idx === renderHeadIndex;
            // Original index for display purposes (accounting for left padding and dynamic unshifts)
            const displayIndex = headIndex - renderHeadIndex + idx;
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
                  {displayIndex}
                </span>

                {/* Tape Cell Box */}
                <div
                  className={`relative w-11 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 select-none ${
                    isHead
                      ? 'bg-cyan-500/10 text-cyan-400 scale-110 z-10 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'bg-surface-container/50 text-on-surface-variant border border-outline-variant/20 hover:border-outline-variant/40'
                  }`}
                >
                  {/* Glowing bracket for active cell */}
                  {isHead && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
                      <div className="absolute inset-0 bg-cyan-400/5 rounded-xl animate-pulse" />
                    </>
                  )}
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
      <div className="flex items-center justify-between text-[11px] text-on-surface-variant dark:text-on-surface-variant pt-1">
        <span>Infinite dynamic bidirectional tape</span>
        <span className="font-mono text-on-surface-variant dark:text-on-surface-variant">
          Current Symbol: <strong className="text-cyan-300 font-bold">'{tape[headIndex] || blank}'</strong>
        </span>
      </div>
    </div>
  );
};
