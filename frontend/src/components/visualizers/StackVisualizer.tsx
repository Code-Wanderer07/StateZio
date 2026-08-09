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
    <div className="flex flex-col bg-white dark:bg-[#121622] border border-slate-300 dark:border-white/10 rounded-2xl p-4 shadow-xl text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            PDA Stack Visualizer
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
          Depth: {stack.length}
        </span>
      </div>

      {/* Top of Stack indicator */}
      <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono font-semibold text-purple-300">
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        <span>TOP OF STACK (TOS)</span>
      </div>

      {/* Vertical Stack Tube */}
      <div className="flex-1 min-h-[150px] max-h-[240px] overflow-y-auto px-4 py-2 flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-[#0d1017] rounded-xl border border-slate-300 dark:border-white/10 shadow-inner">
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
                className={`w-full max-w-[140px] py-2 px-3 rounded-xl flex items-center justify-between font-mono text-xs transition-all duration-300 ${
                  isTOS
                    ? 'bg-purple-600/30 border-2 border-purple-400 text-slate-900 dark:text-white font-bold scale-105 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-100 dark:bg-[#161b26] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-slate-500 text-[10px]">
                  [{stack.length - 1 - idx}]
                </span>
                <span className="text-sm font-semibold tracking-wider text-purple-200">{sym}</span>
                {isTOS && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500 text-slate-900 dark:text-white uppercase font-sans font-bold">
                    TOS
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Stack base container anchor */}
      <div className="w-full max-w-[160px] mx-auto h-2 bg-purple-900/50 rounded-b-md mt-1 border-t border-purple-500/40"></div>

      <div className="pt-2 text-[10px] text-slate-600 dark:text-slate-400 text-center font-medium">
        Mode: {machine.acceptanceMode === 'empty_stack' ? 'Accept by Empty Stack' : 'Accept by Final State'}
      </div>
    </div>
  );
};
