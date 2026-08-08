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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <GitFork className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              NFA → DFA Subset Construction (Powerset)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applyConvertedDFA}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-200"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Render Converted DFA</span>
            </button>

            <button
              onClick={() => setIsSubsetDrawerOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold text-emerald-950">Conversion Summary:</p>
            <p>
              Converted NFA into a DFA with <strong>{convertedDfa.states.length}</strong> states and{' '}
              <strong>{convertedDfa.acceptStates.length}</strong> accepting state(s) across alphabet{' '}
              Σ = {'{'}{alphabet.join(', ')}{'}'}.
            </p>
          </div>

          {/* Transition Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                DFA Transition Table δ'
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">DFA State</th>
                    <th className="py-2.5 px-3">NFA Subset</th>
                    {alphabet.map((sym) => (
                      <th key={sym} className="py-2.5 px-3">
                        Input '{sym}'
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.map((row, idx) => (
                    <tr
                      key={`subset_row_${idx}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2 px-3 text-slate-900 font-bold">
                        <span className="flex items-center gap-1">
                          {row.isInitial && <span className="text-amber-600">→</span>}
                          {row.isAccept && <span className="text-emerald-700">★</span>}
                          <span>{row.dfaStateName.split(' = ')[0]}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-teal-800 font-medium">
                        {row.dfaStateName.split(' = ')[1] || '∅'}
                      </td>
                      {alphabet.map((sym) => {
                        const target = row.transitions[sym];
                        return (
                          <td key={sym} className="py-2 px-3 text-emerald-800">
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
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mathematical Derivations
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 max-h-[220px] overflow-y-auto">
              {stepsExplanation.map((step, idx) => (
                <div key={`step_${idx}`} className="text-slate-700 leading-relaxed">
                  <span className="text-slate-400 mr-2">[{idx + 1}]</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Click "Render Converted DFA" to load onto main canvas.
          </span>
          <button
            onClick={applyConvertedDFA}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-200"
          >
            Apply to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
