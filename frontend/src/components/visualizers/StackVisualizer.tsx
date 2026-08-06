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
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            PDA Stack Visualizer
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
          Depth: {stack.length}
        </span>
      </div>

      {/* Top of Stack indicator */}
      <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono text-cyan-400">
        <ArrowDown className="w-3.5 h-3.5 animate-bounce-subtle" />
        <span>TOP OF STACK (TOS)</span>
      </div>

      {/* Vertical Stack Tube */}
      <div className="flex-1 min-h-[160px] max-h-[260px] overflow-y-auto px-4 py-2 flex flex-col items-center gap-1.5 bg-slate-950/60 rounded-xl border border-slate-800/80 shadow-inner">
        {reversedStack.length === 0 ? (
          <div className="m-auto text-xs text-slate-500 italic font-mono">
            Stack is Empty (ϵ)
          </div>
        ) : (
          reversedStack.map((sym, idx) => {
            const isTOS = idx === 0;
            return (
              <div
                key={`stack_sym_${idx}_${sym}`}
                className={`w-full max-w-[140px] py-2 px-3 rounded-xl flex items-center justify-between font-mono text-xs transition-all duration-300 shadow-md ${
                  isTOS
                    ? 'bg-indigo-600/30 border-2 border-indigo-400 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.5)] font-bold scale-105'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-slate-400 text-[10px]">
                  [{stack.length - 1 - idx}]
                </span>
                <span className="text-sm font-semibold tracking-wider">{sym}</span>
                {isTOS && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/40 text-indigo-200 uppercase font-sans">
                    TOS
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Stack base container anchor */}
      <div className="w-full max-w-[160px] mx-auto h-2 bg-slate-700 rounded-b-md mt-1 border-t border-slate-600"></div>

      <div className="pt-2 text-[10px] text-slate-400 text-center">
        Mode: {machine.acceptanceMode === 'empty_stack' ? 'Accept by Empty Stack' : 'Accept by Final State'}
      </div>
    </div>
  );
};
