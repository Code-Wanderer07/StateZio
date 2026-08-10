import React from 'react';
import { X, GitFork, Check, Table } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const SubsetConstructionDrawer: React.FC = () => {
  const {
    isSubsetDrawerOpen,
    setIsSubsetDrawerOpen,
    subsetResult,
    applyConvertedDFA,
  } = useAutomataStore();

  if (!isSubsetDrawerOpen || !subsetResult) return null;

  const { convertedDfa, table, stepsExplanation } = subsetResult;
  const alphabet = convertedDfa.alphabet;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-sky-50 dark:bg-slate-950 border-l border-sky-300 dark:border-sky-500/30 shadow-2xl flex flex-col h-full overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-200 dark:border-sky-500/20 bg-sky-200 dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold">
            <GitFork className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
              NFA → DFA Subset Construction (Powerset)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applyConvertedDFA}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-900 dark:text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-950/40 border border-sky-300/30 transition-all duration-200 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Render Converted DFA</span>
            </button>

            <button
              onClick={() => setIsSubsetDrawerOpen(false)}
              className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-sky-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-bold text-sky-700 dark:text-sky-300">Conversion Summary:</p>
            <p>
              Converted NFA into a DFA with <strong className="text-slate-900 dark:text-white">{convertedDfa.states.length}</strong> states and{' '}
              <strong className="text-slate-900 dark:text-white">{convertedDfa.acceptStates.length}</strong> accepting state(s) across alphabet{' '}
              Σ = {'{'}{alphabet.join(', ')}{'}'}.
            </p>
          </div>

          {/* Transition Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                DFA Transition Table δ'
              </h4>
            </div>

            <div className="border border-sky-300 dark:border-sky-500/30 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-sky-200 dark:border-sky-500/20">
                  <tr>
                    <th className="py-2.5 px-3">DFA State</th>
                    <th className="py-2.5 px-3">NFA Subset</th>
                    {alphabet.map((sym) => (
                      <th key={sym} className="py-2.5 px-3 text-sky-700 dark:text-sky-300">
                        Input '{sym}'
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-100 dark:bg-slate-900">
                  {table.map((row, idx) => (
                    <tr
                      key={`subset_row_${idx}`}
                      className="hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-white/5 transition-colors"
                    >
                      <td className="py-2 px-3 text-slate-900 dark:text-white font-bold">
                        <span className="flex items-center gap-1">
                          {row.isInitial && <span className="text-emerald-400">→</span>}
                          {row.isAccept && <span className="text-indigo-400">★</span>}
                          <span>{row.dfaStateName.split(' = ')[0]}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sky-700 dark:text-sky-300 font-medium">
                        {row.dfaStateName.split(' = ')[1] || '∅'}
                      </td>
                      {alphabet.map((sym) => {
                        const target = row.transitions[sym];
                        return (
                          <td key={sym} className="py-2 px-3 text-purple-300">
                            {target ? target.targetName.split(' = ')[0] : '∅'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Step-by-Step Derivations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Mathematical Derivations
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/30 font-mono text-xs space-y-1.5 max-h-[220px] overflow-y-auto">
              {stepsExplanation.map((step, idx) => (
                <div key={`step_${idx}`} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-slate-500 mr-2">[{idx + 1}]</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sky-200 dark:border-sky-500/20 bg-sky-200 dark:bg-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-600 dark:text-slate-400">
            Click "Render Converted DFA" to load onto main canvas.
          </span>
          <button
            onClick={applyConvertedDFA}
            className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-white dark:text-[#1C1313] rounded-xl text-xs font-bold shadow-md transition-all duration-200 cursor-pointer"
          >
            Apply to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
