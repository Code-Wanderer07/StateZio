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
    <div className="flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-label-caps text-xs tracking-widest text-tertiary">
          Formal Definition ({machine.type})
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded text-primary bg-primary/10 border border-primary/20 font-bold">
          {machine.type === 'PDA' || machine.type === 'TM' ? '7-Tuple' : '5-Tuple'}
        </span>
      </div>

      {/* Tuples breakdown */}
      <div className="flex flex-col gap-2 font-mono text-sm">
        {/* Q: States */}
        <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
          <span className="text-primary font-bold shrink-0">Q</span>
          <span className="text-on-surface text-right break-words font-medium">
            {'{'}{stateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* Sigma: Input Alphabet */}
        <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
          <span className="text-primary font-bold shrink-0">Σ</span>
          <span className="text-on-surface text-right font-medium">
            {'{'}{(machine.type === 'PDA' ? (machine as PDAMachine).inputAlphabet : machine.type === 'TM' ? (machine as TMMachine).inputAlphabet : machine.alphabet)?.join(', ') || '0, 1'}{'}'}
          </span>
        </div>

        {/* PDA Gamma & Z0 */}
        {machine.type === 'PDA' && (
          <>
            <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
              <span className="text-primary font-bold shrink-0">Γ</span>
              <span className="text-on-surface text-right font-medium">
                {'{'}{(machine as PDAMachine).stackAlphabet?.join(', ') || 'Z0, a'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
              <span className="text-primary font-bold shrink-0">Z₀</span>
              <span className="text-on-surface text-right font-medium">
                {(machine as PDAMachine).initialStackSymbol || 'Z0'}
              </span>
            </div>
          </>
        )}

        {/* TM Gamma & Blank */}
        {machine.type === 'TM' && (
          <>
            <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
              <span className="text-primary font-bold shrink-0">Γ</span>
              <span className="text-on-surface text-right font-medium">
                {'{'}{(machine as TMMachine).tapeAlphabet?.join(', ') || '0, 1, _'}{'}'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
              <span className="text-primary font-bold shrink-0">␣</span>
              <span className="text-on-surface text-right font-medium">
                '{(machine as TMMachine).blankSymbol || '_'}'
              </span>
            </div>
            {/* Singly Infinite Tape Toggle */}
            <div 
              className="flex items-center justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => {
                const tmMachine = machine as TMMachine;
                useAutomataStore.getState().setMachine({
                  ...tmMachine,
                  singlyInfiniteTape: !tmMachine.singlyInfiniteTape
                });
              }}
            >
              <div className="flex flex-col">
                <span className="text-on-surface font-bold text-sm">Strict Tape Mode</span>
                <span className="text-on-surface-variant text-[10px]">Singly-infinite tape (blocks L at index 0)</span>
              </div>
              <div className={`relative w-8 h-4 rounded-full border transition-colors ${(machine as TMMachine).singlyInfiniteTape ? 'bg-primary border-primary' : 'bg-surface-variant border-outline-variant/50'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-surface rounded-full transition-transform ${(machine as TMMachine).singlyInfiniteTape ? 'left-4' : 'left-0.5'}`}></div>
              </div>
            </div>
          </>
        )}

        {/* q0: Start State */}
        <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
          <span className="text-primary font-bold shrink-0">q₀</span>
          <span className="text-on-surface text-right font-medium">
            {startStateLabel || 'None'}
          </span>
        </div>

        {/* F: Accept States */}
        <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
          <span className="text-primary font-bold shrink-0">F</span>
          <span className="text-on-surface text-right break-words font-medium">
            {'{'}{acceptStateIds.join(', ')}{'}'}
          </span>
        </div>

        {/* delta: Transition Count */}
        <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container border border-outline-variant/30">
          <span className="text-primary font-bold shrink-0">δ</span>
          <span className="text-on-surface-variant text-right font-medium">
            {machine.transitions.length} rules
          </span>
        </div>
      </div>
    </div>
  );
};
