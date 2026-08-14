import React, { useState, useEffect, useMemo } from 'react';
import { X, ArrowRight, ArrowLeftRight, Trash2, Edit3, Plus, Info } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { DFAMachine, NFAMachine, PDAMachine, TMMachine, DFATransition, NFATransition, PDATransition, TMTransition } from '../../types/automata';

export const TransitionModal: React.FC = () => {
  const {
    isTransitionModalOpen,
    transitionModalSourceId,
    transitionModalTargetId,
    editingTransitionId,
    machine,
    closeTransitionModal,
    saveTransition,
    deleteTransition,
    openTransitionModal,
  } = useAutomataStore();

  // DFA/NFA state
  const [symbol, setSymbol] = useState('0');

  // PDA state
  const [inputSymbol, setInputSymbol] = useState('a');
  const [popSymbol, setPopSymbol] = useState('Z0');
  const [pushSymbols, setPushSymbols] = useState('aZ0');

  // TM state
  const [readSymbol, setReadSymbol] = useState('0');
  const [writeSymbol, setWriteSymbol] = useState('0');
  const [direction, setDirection] = useState<'L' | 'R' | 'S'>('R');

  // Mode: 'list', 'add', or 'edit'
  const isEditingMode = !!editingTransitionId;
  const [isAddingMode, setIsAddingMode] = useState(false);

  // Compute existing bundled transitions between source and target
  const bundledTransitions = useMemo(() => {
    if (!machine || !transitionModalSourceId || !transitionModalTargetId) return [];
    return (machine.transitions as Array<DFATransition | NFATransition | PDATransition | TMTransition>).filter(
      (t) => t.from === transitionModalSourceId && t.to === transitionModalTargetId
    );
  }, [machine, transitionModalSourceId, transitionModalTargetId]);

  // When opened, decide initial mode
  useEffect(() => {
    if (isTransitionModalOpen) {
      if (editingTransitionId) {
        setIsAddingMode(false);
      } else if (bundledTransitions.length === 0) {
        setIsAddingMode(true);
      } else {
        setIsAddingMode(false); // show list by default if transitions exist and not editing
      }
    }
  }, [isTransitionModalOpen, editingTransitionId, bundledTransitions.length]);

  // Initialize from editing transition if exists or reset
  useEffect(() => {
    if (editingTransitionId && machine) {
      if (machine.type === 'DFA') {
        const t = (machine as DFAMachine).transitions.find((x) => x.id === editingTransitionId);
        if (t) setSymbol(t.symbol || '0');
      } else if (machine.type === 'NFA') {
        const t = (machine as NFAMachine).transitions.find((x) => x.id === editingTransitionId);
        if (t) setSymbol(t.symbol || 'ε');
      } else if (machine.type === 'PDA') {
        const t = (machine as PDAMachine).transitions.find((x) => x.id === editingTransitionId);
        if (t) {
          setInputSymbol(t.inputSymbol || 'ε');
          setPopSymbol(t.popSymbol || 'Z0');
          setPushSymbols(t.pushSymbols || 'Z0');
        }
      } else if (machine.type === 'TM') {
        const t = (machine as TMMachine).transitions.find((x) => x.id === editingTransitionId);
        if (t) {
          setReadSymbol(t.readSymbol || '_');
          setWriteSymbol(t.writeSymbol || '_');
          setDirection(t.direction || 'R');
        }
      }
    } else if (isAddingMode) {
      // Default reset
      if (machine.type === 'DFA') setSymbol('0');
      else if (machine.type === 'NFA') setSymbol('0');
      else if (machine.type === 'PDA') {
        setInputSymbol('a');
        setPopSymbol('Z0');
        setPushSymbols('aZ0');
      } else if (machine.type === 'TM') {
        setReadSymbol('0');
        setWriteSymbol('0');
        setDirection('R');
      }
    }
  }, [editingTransitionId, isAddingMode, machine]);

  if (!isTransitionModalOpen || !transitionModalSourceId || !transitionModalTargetId) {
    return null;
  }

  const sourceLabel = machine.states.find((s) => s.id === transitionModalSourceId)?.label || transitionModalSourceId;
  const targetLabel = machine.states.find((s) => s.id === transitionModalTargetId)?.label || transitionModalTargetId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (machine.type === 'DFA' || machine.type === 'NFA') {
      saveTransition({ symbol: symbol.trim() || 'ε' });
    } else if (machine.type === 'PDA') {
      saveTransition({
        inputSymbol: inputSymbol.trim() || 'ε',
        popSymbol: popSymbol.trim() || 'ε',
        pushSymbols: pushSymbols.trim() || 'ε',
      });
    } else {
      saveTransition({
        readSymbol: readSymbol.trim() || '_',
        writeSymbol: writeSymbol.trim() || '_',
        direction,
      });
    }
    setIsAddingMode(false);
  };

  const showForm = isEditingMode || isAddingMode;

  const renderTransitionLabel = (t: any) => {
    if (machine.type === 'DFA' || machine.type === 'NFA') return t.symbol || 'ε';
    if (machine.type === 'PDA') return `${t.inputSymbol || 'ε'}, ${t.popSymbol || 'ε'} → ${t.pushSymbols || 'ε'}`;
    if (machine.type === 'TM') return `${t.readSymbol || '_'} → ${t.writeSymbol || '_'}, ${t.direction || 'R'}`;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface-container border border-outline-variant/30 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden text-on-surface flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-high shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <ArrowLeftRight className="w-5 h-5" />
            <h3 className="font-headline-sm text-on-surface text-lg tracking-wide">
              {isEditingMode ? 'Edit Transition' : 'Connection Transitions'}
            </h3>
          </div>
          <button
            onClick={closeTransitionModal}
            className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-error/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-center gap-4 text-xs font-mono shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
            {sourceLabel}
          </span>
          <ArrowRight className="w-4 h-4 text-on-surface-variant" />
          <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold border border-primary/30">
            {targetLabel}
          </span>
          <span className="text-on-surface-variant text-[11px] font-label-caps">({machine.type})</span>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar">
          {!showForm && bundledTransitions.length > 0 && (
            <div className="p-6 space-y-3">
              <h4 className="text-xs font-label-caps text-on-surface-variant mb-2">Existing Rules</h4>
              {bundledTransitions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/40 transition-colors">
                  <span className="font-mono text-sm font-bold text-on-surface">
                    {renderTransitionLabel(t)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTransitionModal(transitionModalSourceId, transitionModalTargetId, t.id)}
                      className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                      title="Edit Transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteTransition(t.id);
                        if (bundledTransitions.length === 1) closeTransitionModal();
                      }}
                      className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error/10 transition-colors"
                      title="Delete Transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setIsAddingMode(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Rule
                </button>
              </div>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="text-[11px] text-primary/80 bg-primary/10 px-3 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Note: Multiple transitions between the same states are visually grouped into a single line.</span>
              </div>
              {(machine.type === 'DFA' || machine.type === 'NFA') && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Input Symbol (read)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      placeholder="e.g. 0, 1, a, or ε"
                      className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-on-surface-variant mr-1 font-label-caps">Quick:</span>
                    {['0', '1', 'a', 'b', ...(machine.type === 'NFA' ? ['ε'] : [])].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setSymbol(sym)}
                        className="px-3 py-1.5 text-xs font-mono font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded-lg transition-colors shadow-sm"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {machine.type === 'PDA' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Input Symbol
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Read from string</span>
                      </label>
                      <input
                        type="text"
                        value={inputSymbol}
                        onChange={(e) => setInputSymbol(e.target.value)}
                        placeholder="a or ε"
                        className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                        autoFocus
                      />
                      <div className="flex gap-1 mt-1">
                        {['a', 'b', 'ε'].map((s) => (
                          <button key={s} type="button" onClick={() => setInputSymbol(s)} className="text-[11px] px-2 py-1 font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded transition-colors">{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Pop from Stack
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Top of stack</span>
                      </label>
                      <input
                        type="text"
                        value={popSymbol}
                        onChange={(e) => setPopSymbol(e.target.value)}
                        placeholder="Z0 or ε"
                        className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                      />
                      <div className="flex gap-1 mt-1">
                        {['Z0', 'a', 'b', 'ε'].map((s) => (
                          <button key={s} type="button" onClick={() => setPopSymbol(s)} className="text-[11px] px-2 py-1 font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded transition-colors">{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Push to Stack
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Add to stack</span>
                      </label>
                      <input
                        type="text"
                        value={pushSymbols}
                        onChange={(e) => setPushSymbols(e.target.value)}
                        placeholder="aZ0 or ε"
                        className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                      />
                      <div className="flex gap-1 mt-1">
                        {['aZ0', 'aa', 'Z0', 'ε'].map((s) => (
                          <button key={s} type="button" onClick={() => setPushSymbols(s)} className="text-[11px] px-2 py-1 font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded transition-colors">{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono flex items-center justify-between">
                    <span className="text-on-surface-variant">Rule notation:</span>
                    <span className="text-primary font-bold text-sm">{inputSymbol || 'ε'}, {popSymbol || 'ε'} → {pushSymbols || 'ε'}</span>
                  </div>
                </div>
              )}

              {machine.type === 'TM' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Read Symbol
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Current tape cell</span>
                      </label>
                      <input
                        type="text"
                        value={readSymbol}
                        onChange={(e) => setReadSymbol(e.target.value)}
                        placeholder="0, 1, _"
                        className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                        autoFocus
                      />
                      <div className="flex gap-1 mt-1">
                        {['0', '1', '_', 'X', 'Y'].map((s) => (
                          <button key={s} type="button" onClick={() => setReadSymbol(s)} className="text-[11px] px-2 py-1 font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded transition-colors">{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Write Symbol
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Update tape cell</span>
                      </label>
                      <input
                        type="text"
                        value={writeSymbol}
                        onChange={(e) => setWriteSymbol(e.target.value)}
                        placeholder="0, 1, _"
                        className="w-full bg-surface border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30"
                      />
                      <div className="flex gap-1 mt-1">
                        {['0', '1', '_', 'X', 'Y'].map((s) => (
                          <button key={s} type="button" onClick={() => setWriteSymbol(s)} className="text-[11px] px-2 py-1 font-bold bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-on-surface-variant rounded transition-colors">{s}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Head Movement
                        <span className="block text-[9px] font-normal opacity-70 mt-0.5">Tape head direction</span>
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 p-0.5 bg-surface-container">
                        {(['L', 'R', 'S'] as const).map((dir) => (
                          <button
                            key={dir}
                            type="button"
                            onClick={() => setDirection(dir)}
                            className={`flex-1 py-1 text-xs font-mono font-bold transition-all rounded-md m-0.5 ${direction === dir ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(76,215,246,0.3)]' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'}`}
                          >
                            {dir}
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] text-on-surface-variant mt-1 text-center font-medium">
                        {direction === 'L' ? 'Left (←)' : direction === 'R' ? 'Right (→)' : 'Stay (•)'}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono flex items-center justify-between">
                    <span className="text-on-surface-variant">TM Transition:</span>
                    <span className="text-primary font-bold text-sm">{readSymbol || '_'} → {writeSymbol || '_'}, {direction}</span>
                  </div>
                </div>
              )}

              {/* Action buttons for form */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => {
                    if (isAddingMode && bundledTransitions.length > 0) {
                      setIsAddingMode(false); // go back to list
                    } else {
                      closeTransitionModal(); // close entirely
                    }
                  }}
                  className="px-4 py-2 text-sm font-label-caps tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-label-caps tracking-widest font-bold text-on-primary bg-primary hover:brightness-110 rounded-xl shadow-[0_0_15px_rgba(76,215,246,0.3)] hover:shadow-[0_0_20px_rgba(76,215,246,0.5)] transition-all duration-200 active:scale-95"
                >
                  {isEditingMode ? 'Save Changes' : 'Add Transition'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
