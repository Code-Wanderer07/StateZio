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
      <div className="w-full max-w-2xl bg-surface-container dark:bg-background border-l border-cyan-300 dark:border-cyan-500/30 shadow-2xl flex flex-col h-full overflow-hidden text-on-surface dark:text-on-surface">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-high/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
            <GitFork className="w-5 h-5" />
            <h3 className="font-bold text-on-surface dark:text-on-surface text-sm tracking-tight">
              NFA → DFA Subset Construction (Powerset)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applyConvertedDFA}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-on-surface dark:text-on-surface rounded-xl text-xs font-bold shadow-md shadow-cyan-200 dark:shadow-cyan-950/40 border border-cyan-300/30 transition-all duration-200 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Render Converted DFA</span>
            </button>

            <button
              onClick={() => setIsSubsetDrawerOpen(false)}
              className="p-1 text-on-surface-variant dark:text-on-surface-variant hover:text-slate-900 dark:text-on-surface rounded-lg hover:bg-cyan-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface dark:bg-surface-container">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-surface-container-high dark:bg-surface-container border border-cyan-300 dark:border-cyan-500/30 text-xs text-on-surface-variant dark:text-on-surface-variant space-y-1">
            <p className="font-bold text-cyan-700 dark:text-cyan-300">Conversion Summary:</p>
            <p>
              Converted NFA into a DFA with <strong className="text-on-surface dark:text-on-surface">{convertedDfa.states.length}</strong> states and{' '}
              <strong className="text-on-surface dark:text-on-surface">{convertedDfa.acceptStates.length}</strong> accepting state(s) across alphabet{' '}
              Σ = {'{'}{alphabet.join(', ')}{'}'}.
            </p>
          </div>

          {/* Transition Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h4 className="text-xs font-bold text-on-surface dark:text-on-surface uppercase tracking-wider">
                DFA Transition Table δ'
              </h4>
            </div>

            <div className="border border-cyan-300 dark:border-cyan-500/30 rounded-xl overflow-hidden shadow-md">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-background text-on-surface-variant dark:text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant/30 dark:border-cyan-500/20">
                  <tr>
                    <th className="py-2.5 px-3">DFA State</th>
                    <th className="py-2.5 px-3">NFA Subset</th>
                    {alphabet.map((sym) => (
                      <th key={sym} className="py-2.5 px-3 text-cyan-700 dark:text-cyan-300">
                        Input '{sym}'
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-surface-container dark:bg-surface-container">
                  {table.map((row, idx) => (
                    <tr
                      key={`subset_row_${idx}`}
                      className="hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-surface/5 transition-colors"
                    >
                      <td className="py-2 px-3 text-on-surface dark:text-on-surface font-bold">
                        <span className="flex items-center gap-1">
                          {row.isInitial && <span className="text-emerald-400">→</span>}
                          {row.isAccept && <span className="text-blue-400">★</span>}
                          <span>{row.dfaStateName.split(' = ')[0]}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-700 dark:text-cyan-300 font-medium">
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
            <h4 className="text-xs font-bold text-on-surface dark:text-on-surface uppercase tracking-wider">
              Mathematical Derivations
            </h4>
            <div className="p-4 rounded-xl bg-surface dark:bg-background border border-cyan-300 dark:border-cyan-500/30 font-mono text-xs space-y-1.5 max-h-[220px] overflow-y-auto">
              {stepsExplanation.map((step, idx) => (
                <div key={`step_${idx}`} className="text-on-surface-variant dark:text-on-surface-variant leading-relaxed">
                  <span className="text-slate-500 mr-2">[{idx + 1}]</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-high/80 backdrop-blur-md flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant dark:text-on-surface-variant">
            Click "Render Converted DFA" to load onto main canvas.
          </span>
          <button
            onClick={applyConvertedDFA}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950/40 border border-cyan-300/30 transition-all duration-200 cursor-pointer"
          >
            Apply to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
