import React from 'react';
import { Info, Code2, Tag, Layers } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { PDAMachine, TMMachine } from '../../types/automata';

export const MachineProperties: React.FC = () => {
  const { machine } = useAutomataStore();

  const stateIds = machine.states.map((s) => s.label || s.id);
  const acceptStateIds = machine.states.filter((s) => s.isAccept).map((s) => s.label || s.id);
  const startStateLabel = machine.states.find((s) => s.id === machine.startState)?.label || machine.startState;

  return (
    <div className="flex flex-col bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Formal Definition ({machine.type})
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          {machine.type === 'PDA' || machine.type === 'TM' ? '7-Tuple' : '5-Tuple'}
        </span>
      </div>

      {/* Tuples breakdown */}
      <div className="space-y-2 text-xs font-mono">
        {/* Q: States */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-indigo-400 font-semibold shrink-0">Q (States):</span>
          <span className="text-slate-300 text-right truncate">
            {'{'}{stateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* Sigma: Input Alphabet */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-cyan-400 font-semibold shrink-0">Σ (Alphabet):</span>
          <span className="text-slate-300 text-right">
            {'{'}{(machine.type === 'PDA' ? (machine as PDAMachine).inputAlphabet : machine.type === 'TM' ? (machine as TMMachine).inputAlphabet : machine.alphabet)?.join(', ') || '0, 1'}{'}'}
          </span>
        </div>

        {/* PDA Gamma & Z0 */}
        {machine.type === 'PDA' && (
          <>
            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-amber-400 font-semibold shrink-0">Γ (Stack Alph.):</span>
              <span className="text-slate-300 text-right">
                {'{'}{(machine as PDAMachine).stackAlphabet?.join(', ') || 'Z0, a'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-amber-400 font-semibold shrink-0">Z₀ (Init Stack):</span>
              <span className="text-slate-300 text-right">
                {(machine as PDAMachine).initialStackSymbol || 'Z0'}
              </span>
            </div>
          </>
        )}

        {/* TM Gamma & Blank */}
        {machine.type === 'TM' && (
          <>
            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-cyan-400 font-semibold shrink-0">Γ (Tape Alph.):</span>
              <span className="text-slate-300 text-right">
                {'{'}{(machine as TMMachine).tapeAlphabet?.join(', ') || '0, 1, _'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-cyan-400 font-semibold shrink-0">␣ (Blank):</span>
              <span className="text-slate-300 text-right">
                '{(machine as TMMachine).blankSymbol || '_'}'
              </span>
            </div>
          </>
        )}

        {/* q0: Start State */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-amber-400 font-semibold shrink-0">q₀ (Start):</span>
          <span className="text-slate-300 text-right">
            {startStateLabel || 'None'}
          </span>
        </div>

        {/* F: Accept States */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-emerald-400 font-semibold shrink-0">F (Accept):</span>
          <span className="text-slate-300 text-right truncate">
            {'{'}{acceptStateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* delta: Transition Count */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-400 font-semibold shrink-0">δ (Transitions):</span>
          <span className="text-slate-300 text-right">
            {machine.transitions.length} rules
          </span>
        </div>
      </div>
    </div>
  );
};
