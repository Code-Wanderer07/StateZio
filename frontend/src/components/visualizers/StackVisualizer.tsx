import React from 'react';
import { Layers, ArrowDown } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const StackVisualizer: React.FC = () => {
  const { machine, simulationResult, currentStepIndex } = useAutomataStore();

  if (machine.type !== 'PDA') return null;

  const currentTrace = simulationResult?.traces?.[currentStepIndex];
  const stack = currentTrace?.stack || (machine.initialStackSymbol ? [machine.initialStackSymbol] : ['Z0']);
  // Stack elements are stored [bottom, ..., top]
  // We display top at the top
  const reversedStack = [...stack].reverse();

  return (
    <div className="flex flex-col bg-surface-container/30 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Stack Visualizer
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold shadow-[inset_0_0_8px_rgba(168,85,247,0.1)]">
          Depth: {stack.length}
        </span>
      </div>

      {/* Top of Stack indicator (Removed bouncy arrow in favor of glowing TOS box) */}
      <div className="pt-3"></div>

      {/* Vertical Stack Tube */}
      <div className="flex-1 min-h-[150px] max-h-[240px] overflow-y-auto px-4 py-2 flex flex-col items-center gap-2 bg-background/50 backdrop-blur-md rounded-xl border border-outline-variant/10 shadow-inner">
        {reversedStack.length === 0 ? (
          <div className="m-auto text-xs text-slate-500 italic font-mono">
            Stack is Empty (ε)
          </div>
        ) : (
          reversedStack.map((sym, idx) => {
            const isTOS = idx === 0;
            return (
              <div
                key={`stack_sym_${idx}_${sym}`}
                className={`relative w-full max-w-[140px] py-2 px-3 rounded-xl flex items-center justify-between font-mono text-xs transition-all duration-300 ${
                  isTOS
                    ? 'bg-purple-500/10 text-purple-400 font-bold scale-105 z-10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-surface-container/50 text-on-surface-variant border border-outline-variant/20 hover:border-outline-variant/40'
                }`}
              >
                {/* Glowing bracket for TOS */}
                {isTOS && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-400 rounded-br-xl" />
                    <div className="absolute inset-0 bg-purple-400/5 rounded-xl animate-pulse" />
                  </>
                )}
                <span className="text-slate-500/60 text-[10px] relative z-10">
                  [{stack.length - 1 - idx}]
                </span>
                <span className={`text-sm font-semibold tracking-wider relative z-10 ${isTOS ? 'text-purple-400' : 'text-on-surface/80'}`}>{sym}</span>
                {isTOS && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-purple-500/20 text-purple-300 uppercase font-sans font-bold relative z-10 border border-purple-500/30 shadow-[inset_0_0_4px_rgba(168,85,247,0.3)]">
                    TOS
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Stack base container anchor */}
      <div className="w-full max-w-[160px] mx-auto h-1.5 bg-purple-900/40 rounded-b-md mt-1 border-t border-purple-500/20"></div>

      <div className="pt-2 text-[10px] text-on-surface-variant/70 text-center font-medium">
        Mode: {machine.acceptanceMode === 'empty_stack' ? 'Accept by Empty Stack' : 'Accept by Final State'}
      </div>
    </div>
  );
};
