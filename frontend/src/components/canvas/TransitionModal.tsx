import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Layers, ArrowLeftRight } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { DFAMachine, NFAMachine, PDAMachine, TMMachine } from '../../types/automata';

export const TransitionModal: React.FC = () => {
  const {
    isTransitionModalOpen,
    transitionModalSourceId,
    transitionModalTargetId,
    editingTransitionId,
    machine,
    closeTransitionModal,
    saveTransition,
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

  // Initialize from editing transition if exists
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
    } else {
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
  }, [editingTransitionId, machine, isTransitionModalOpen]);

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-indigo-400">
            <ArrowLeftRight className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              {editingTransitionId ? 'Edit Transition' : 'Add Transition Rule'}
            </h3>
          </div>
          <button
            onClick={closeTransitionModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-900/30 flex items-center justify-center gap-4 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-indigo-900/60 text-indigo-300 font-semibold border border-indigo-700/50">
            {sourceLabel}
          </span>
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span className="px-2.5 py-1 rounded bg-indigo-900/60 text-indigo-300 font-semibold border border-indigo-700/50">
            {targetLabel}
          </span>
          <span className="text-slate-400 text-[11px] font-sans">({machine.type})</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* DFA / NFA form */}
          {(machine.type === 'DFA' || machine.type === 'NFA') && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Input Symbol (read)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. 0, 1, a, or ε"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm font-mono text-white outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Quick Symbol Insertion buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1">Quick:</span>
                {['0', '1', 'a', 'b', ...(machine.type === 'NFA' ? ['ε'] : [])].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSymbol(sym)}
                    className="px-2 py-0.5 text-xs font-mono bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded border border-slate-700 transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDA form */}
          {machine.type === 'PDA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Input Symbol
                  </label>
                  <input
                    type="text"
                    value={inputSymbol}
                    onChange={(e) => setInputSymbol(e.target.value)}
                    placeholder="a or ε"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['a', 'b', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInputSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Pop from Stack
                  </label>
                  <input
                    type="text"
                    value={popSymbol}
                    onChange={(e) => setPopSymbol(e.target.value)}
                    placeholder="Z0 or ε"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['Z0', 'a', 'b', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPopSymbol(s)}
                        className="text-[10px] px-1 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Push to Stack
                  </label>
                  <input
                    type="text"
                    value={pushSymbols}
                    onChange={(e) => setPushSymbols(e.target.value)}
                    placeholder="aZ0 or ε"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['aZ0', 'aa', 'Z0', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPushSymbols(s)}
                        className="text-[10px] px-1 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="text-slate-500">Rule notation:</span>
                <span className="text-indigo-300 font-bold">
                  {inputSymbol || 'ε'}, {popSymbol || 'ε'} → {pushSymbols || 'ε'}
                </span>
              </div>
            </div>
          )}

          {/* TM form */}
          {machine.type === 'TM' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Read Tape Symbol
                  </label>
                  <input
                    type="text"
                    value={readSymbol}
                    onChange={(e) => setReadSymbol(e.target.value)}
                    placeholder="0, 1, _"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['0', '1', '_', 'X', 'Y'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReadSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Write Symbol
                  </label>
                  <input
                    type="text"
                    value={writeSymbol}
                    onChange={(e) => setWriteSymbol(e.target.value)}
                    placeholder="0, 1, _"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['0', '1', '_', 'X', 'Y'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setWriteSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 rounded"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Head Movement
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-700">
                    {(['L', 'R', 'S'] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setDirection(dir)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold transition-colors ${
                          direction === dir
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 text-center">
                    {direction === 'L' ? 'Left' : direction === 'R' ? 'Right' : 'Stay'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="text-slate-500">TM Transition:</span>
                <span className="text-indigo-300 font-bold">
                  {readSymbol || '_'} → {writeSymbol || '_'}, {direction}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeTransitionModal}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              {editingTransitionId ? 'Save Changes' : 'Add Transition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
