import React from 'react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { AutomataMachine, AutomataTransition, DFATransition, NFATransition, PDATransition, TMTransition } from '../../types/automata';

export const NodeProperties: React.FC = () => {
  const { machine, setMachine, selectedNodeId } = useAutomataStore();

  const selectedState = machine.states.find(s => s.id === selectedNodeId);

  if (!selectedState || !selectedNodeId) {
    return (
      <div className="p-4 text-center text-on-surface-variant font-body-md">
        Select a state or transition to view its properties.
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStates = machine.states.map(s => s.id === selectedNodeId ? { ...s, label: e.target.value } : s);
    setMachine({ ...machine, states: newStates } as AutomataMachine);
  };

  const toggleStart = () => {
    // If making this the start state, remove start state from others
    const newStates = machine.states.map(s => {
      if (s.id === selectedNodeId) return { ...s, isInitial: !s.isInitial };
      return { ...s, isInitial: s.isInitial ? false : s.isInitial }; // Ensure only one start state
    });
    const newMachine = { ...machine, states: newStates };
    if (!selectedState.isInitial) {
        newMachine.startState = selectedNodeId;
    } else if (newMachine.startState === selectedNodeId) {
        newMachine.startState = newStates.find(s => s.isInitial)?.id || '';
    }
    setMachine(newMachine as AutomataMachine);
  };

  const toggleAccept = () => {
    const newStates = machine.states.map(s => s.id === selectedNodeId ? { ...s, isAccept: !s.isAccept } : s);
    const newAcceptStates = newStates.filter(s => s.isAccept).map(s => s.id);
    setMachine({ ...machine, states: newStates, acceptStates: newAcceptStates } as AutomataMachine);
  };

  const deleteState = () => {
    const newStates = machine.states.filter(s => s.id !== selectedNodeId);
    const newTransitions = machine.transitions.filter(t => t.from !== selectedNodeId && t.to !== selectedNodeId);
    const newAcceptStates = newStates.filter(s => s.isAccept).map(s => s.id);
    const newMachine = { 
        ...machine, 
        states: newStates, 
        transitions: newTransitions, 
        acceptStates: newAcceptStates,
        startState: machine.startState === selectedNodeId ? (newStates.find(s => s.isInitial)?.id || '') : machine.startState
    };
    setMachine(newMachine as AutomataMachine);
  };

  const deleteTransition = (transitionId: string) => {
    setMachine({
        ...machine,
        transitions: machine.transitions.filter(t => t.id !== transitionId)
    } as AutomataMachine);
  };

  // Filter transitions originating from this state
  const stateTransitions = machine.transitions.filter(t => t.from === selectedNodeId);

  return (
    <div className="p-4 flex flex-col gap-6 select-none">
      <p className="font-label-caps text-xs tracking-widest text-on-surface-variant">
        Node {selectedState.label || selectedState.id} Properties
      </p>
      
      <div>
        <label className="block font-label-caps text-xs tracking-widest text-tertiary mb-2">State Name</label>
        <input 
          className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 text-on-surface font-code-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          type="text" 
          value={selectedState.label || selectedState.id}
          onChange={handleNameChange}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between cursor-pointer group" onClick={toggleStart}>
          <span className="font-body-md text-base text-on-surface group-hover:text-primary transition-colors">Start State</span>
          <div className={`relative w-12 h-6 rounded-full border transition-colors ${selectedState.isInitial ? 'bg-primary border-primary' : 'bg-surface-variant border-outline-variant/50'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-surface rounded-full transition-transform ${selectedState.isInitial ? 'left-7' : 'left-1'}`}></div>
          </div>
        </label>
        
        <label className="flex items-center justify-between cursor-pointer group" onClick={toggleAccept}>
          <span className="font-body-md text-base text-on-surface group-hover:text-primary transition-colors">Accept State</span>
          <div className={`relative w-12 h-6 rounded-full border transition-colors ${selectedState.isAccept ? 'bg-primary border-primary' : 'bg-surface-variant border-outline-variant/50'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-surface rounded-full transition-transform ${selectedState.isAccept ? 'left-7' : 'left-1'}`}></div>
          </div>
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-label-caps text-xs tracking-widest text-tertiary">Transitions from {selectedState.label || selectedState.id}</h3>
        </div>
        
        <div className="flex flex-col gap-2">
          {stateTransitions.length === 0 ? (
            <p className="text-xs text-on-surface-variant italic">No outgoing transitions.</p>
          ) : (
            stateTransitions.map(t => {
              const toState = machine.states.find(s => s.id === t.to);
              const toLabel = toState ? (toState.label || toState.id) : t.to;
              
              let ruleLabel = '';
              if (machine.type === 'DFA' || machine.type === 'NFA') {
                  ruleLabel = (t as DFATransition).symbol || 'ε';
              } else if (machine.type === 'PDA') {
                  const pt = t as PDATransition;
                  ruleLabel = `${pt.inputSymbol || 'ε'},${pt.popSymbol}→${pt.pushSymbols}`;
              } else if (machine.type === 'TM') {
                  const tm = t as TMTransition;
                  ruleLabel = `${tm.readSymbol}→${tm.writeSymbol},${tm.direction}`;
              }

              return (
                <div key={t.id} className="flex items-center gap-2 bg-surface-container p-2 rounded-lg border border-outline-variant/30">
                  <div className="flex-1 bg-surface border border-outline-variant/50 rounded px-2 py-1 text-on-surface text-center font-code-md text-sm truncate">
                      {ruleLabel}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_forward</span>
                  <div className="flex-1 bg-surface border border-outline-variant/50 rounded px-2 py-1 text-on-surface font-code-md text-sm truncate text-center">
                      {toLabel}
                  </div>
                  <button onClick={() => deleteTransition(t.id)} className="text-error hover:bg-error/10 p-1 rounded transition-colors" title="Delete transition">
                      <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <button onClick={deleteState} className="w-full bg-surface-variant hover:bg-error/20 hover:text-error border border-outline-variant/50 hover:border-error/50 text-on-surface py-2 rounded-lg font-body-md transition-all">
          Delete State
        </button>
      </div>
    </div>
  );
};
