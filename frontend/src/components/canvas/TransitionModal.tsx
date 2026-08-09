import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeftRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-sky-50 dark:bg-[#1C1313] border border-sky-300 dark:border-sky-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-sky-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-200 dark:border-sky-500/20 bg-sky-200 dark:bg-[#271C1C]">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <ArrowLeftRight className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
              {editingTransitionId ? 'Edit Transition Rule' : 'Add Transition Rule'}
            </h3>
          </div>
          <button
            onClick={closeTransitionModal}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-200 rounded-lg hover:bg-sky-300 dark:hover:bg-[#3D2C2C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div className="px-6 py-3 bg-sky-50 dark:bg-[#1C1313] border-b border-sky-200 dark:border-sky-500/20 flex items-center justify-center gap-4 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-sky-200 dark:bg-[#271C1C] text-emerald-400 font-semibold border border-emerald-500/40 shadow-xs">
            {sourceLabel}
          </span>
          <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="px-2.5 py-1 rounded bg-sky-200 dark:bg-[#271C1C] text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/40 shadow-xs">
            {targetLabel}
          </span>
          <span className="text-slate-600 dark:text-slate-400 text-[11px] font-sans">({machine.type})</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* DFA / NFA form */}
          {(machine.type === 'DFA' || machine.type === 'NFA') && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200">
                Input Symbol (read)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. 0, 1, a, or ε"
                  className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Quick Symbol Insertion buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 mr-1">Quick:</span>
                {['0', '1', 'a', 'b', ...(machine.type === 'NFA' ? ['ε'] : [])].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSymbol(sym)}
                    className="px-2.5 py-0.5 text-xs font-mono bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30 transition-colors shadow-xs"
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
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Input Symbol
                  </label>
                  <input
                    type="text"
                    value={inputSymbol}
                    onChange={(e) => setInputSymbol(e.target.value)}
                    placeholder="a or ε"
                    className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['a', 'b', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInputSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Pop from Stack
                  </label>
                  <input
                    type="text"
                    value={popSymbol}
                    onChange={(e) => setPopSymbol(e.target.value)}
                    placeholder="Z0 or ε"
                    className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['Z0', 'a', 'b', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPopSymbol(s)}
                        className="text-[10px] px-1 py-0.5 bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Push to Stack
                  </label>
                  <input
                    type="text"
                    value={pushSymbols}
                    onChange={(e) => setPushSymbols(e.target.value)}
                    placeholder="aZ0 or ε"
                    className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['aZ0', 'aa', 'Z0', 'ε'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPushSymbols(s)}
                        className="text-[10px] px-1 py-0.5 bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Rule notation:</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">
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
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Read Tape Symbol
                  </label>
                  <input
                    type="text"
                    value={readSymbol}
                    onChange={(e) => setReadSymbol(e.target.value)}
                    placeholder="0, 1, _"
                    className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['0', '1', '_', 'X', 'Y'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReadSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Write Symbol
                  </label>
                  <input
                    type="text"
                    value={writeSymbol}
                    onChange={(e) => setWriteSymbol(e.target.value)}
                    placeholder="0, 1, _"
                    className="w-full bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 focus:border-sky-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <div className="flex gap-1 mt-1">
                    {['0', '1', '_', 'X', 'Y'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setWriteSymbol(s)}
                        className="text-[10px] px-1.5 py-0.5 bg-sky-200 dark:bg-[#271C1C] hover:bg-sky-500 hover:text-slate-900 dark:hover:text-white dark:text-[#1C1313] text-sky-800 dark:text-sky-200 rounded border border-sky-300 dark:border-sky-500/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-800 dark:text-sky-200 mb-1">
                    Head Movement
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-sky-300 dark:border-sky-500/30">
                    {(['L', 'R', 'S'] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setDirection(dir)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold transition-colors ${
                          direction === dir
                            ? 'bg-sky-500 text-white dark:text-[#1C1313]'
                            : 'bg-sky-200 dark:bg-[#271C1C] text-slate-700 dark:text-slate-300 hover:bg-sky-300 dark:hover:bg-[#3D2C2C]'
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 text-center font-medium">
                    {direction === 'L' ? 'Left (←)' : direction === 'R' ? 'Right (→)' : 'Stay (•)'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-200 dark:bg-[#271C1C] border border-sky-300 dark:border-sky-500/30 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">TM Transition:</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">
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
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-200 hover:bg-sky-200 dark:bg-[#271C1C] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white dark:text-[#1C1313] bg-sky-400 hover:bg-sky-300 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              {editingTransitionId ? 'Save Changes' : 'Add Transition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
