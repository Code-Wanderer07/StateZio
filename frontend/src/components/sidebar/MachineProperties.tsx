import React from 'react';
import { Info } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { PDAMachine, TMMachine } from '../../types/automata';

export const MachineProperties: React.FC = () => {
  const { machine } = useAutomataStore();

  const stateIds = machine.states.map((s) => s.label || s.id);
  const acceptStateIds = machine.states.filter((s) => s.isAccept).map((s) => s.label || s.id);
  const startStateLabel = machine.states.find((s) => s.id === machine.startState)?.label || machine.startState;

  return (
    <div className="flex flex-col bg-[#1C1313] border border-sky-500/30 rounded-2xl p-4 shadow-xl space-y-3 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-sky-500/20">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Formal Definition ({machine.type})
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
          {machine.type === 'PDA' || machine.type === 'TM' ? '7-Tuple' : '5-Tuple'}
        </span>
      </div>

      {/* Tuples breakdown */}
      <div className="space-y-2 text-xs font-mono">
        {/* Q: States */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
          <span className="text-sky-300 font-semibold shrink-0">Q (States):</span>
          <span className="text-white text-right truncate font-medium">
            {'{'}{stateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* Sigma: Input Alphabet */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
          <span className="text-teal-300 font-semibold shrink-0">Σ (Alphabet):</span>
          <span className="text-white text-right font-medium">
            {'{'}{(machine.type === 'PDA' ? (machine as PDAMachine).inputAlphabet : machine.type === 'TM' ? (machine as TMMachine).inputAlphabet : machine.alphabet)?.join(', ') || '0, 1'}{'}'}
          </span>
        </div>

        {/* PDA Gamma & Z0 */}
        {machine.type === 'PDA' && (
          <>
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
              <span className="text-amber-300 font-semibold shrink-0">Γ (Stack Alph.):</span>
              <span className="text-white text-right font-medium">
                {'{'}{(machine as PDAMachine).stackAlphabet?.join(', ') || 'Z0, a'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
              <span className="text-amber-300 font-semibold shrink-0">Z₀ (Init Stack):</span>
              <span className="text-white text-right font-medium">
                {(machine as PDAMachine).initialStackSymbol || 'Z0'}
              </span>
            </div>
          </>
        )}

        {/* TM Gamma & Blank */}
        {machine.type === 'TM' && (
          <>
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
              <span className="text-teal-300 font-semibold shrink-0">Γ (Tape Alph.):</span>
              <span className="text-white text-right font-medium">
                {'{'}{(machine as TMMachine).tapeAlphabet?.join(', ') || '0, 1, _'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
              <span className="text-teal-300 font-semibold shrink-0">␣ (Blank):</span>
              <span className="text-white text-right font-medium">
                '{(machine as TMMachine).blankSymbol || '_'}'
              </span>
            </div>
          </>
        )}

        {/* q0: Start State */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
          <span className="text-emerald-400 font-semibold shrink-0">q₀ (Start):</span>
          <span className="text-white text-right font-medium">
            {startStateLabel || 'None'}
          </span>
        </div>

        {/* F: Accept States */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
          <span className="text-indigo-400 font-semibold shrink-0">F (Accept):</span>
          <span className="text-white text-right truncate font-medium">
            {'{'}{acceptStateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* delta: Transition Count */}
        <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#271C1C] border border-sky-500/20">
          <span className="text-slate-400 font-semibold shrink-0">δ (Transitions):</span>
          <span className="text-white text-right font-medium">
            {machine.transitions.length} rules
          </span>
        </div>
      </div>
    </div>
  );
};
