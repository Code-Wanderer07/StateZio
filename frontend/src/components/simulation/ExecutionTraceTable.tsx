import React from 'react';
import { ListOrdered, CheckCircle, XCircle } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const ExecutionTraceTable: React.FC = () => {
  const { simulationResult, currentStepIndex, jumpToStep, machine } = useAutomataStore();

  if (!simulationResult || simulationResult.traces.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center text-slate-500 py-12">
        <ListOrdered className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-xs">No simulation trace available.</p>
        <p className="text-[11px] text-slate-600 mt-1">Enter an input string and click "Simulate" to view step trace.</p>
      </div>
    );
  }

  const stateLabel = (id: string) => machine.states.find((s) => s.id === id)?.label || id;

  return (
    <div className="flex flex-col bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Execution Trace Log
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Total Steps: {simulationResult.traces.length}
        </span>
      </div>

      {/* Table container */}
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800 z-10">
            <tr>
              <th className="py-2.5 px-3">Step</th>
              <th className="py-2.5 px-3">State(s)</th>
              <th className="py-2.5 px-3">Remaining Input</th>
              {machine.type === 'PDA' && <th className="py-2.5 px-3">Stack</th>}
              {machine.type === 'TM' && <th className="py-2.5 px-3">Tape Head</th>}
              <th className="py-2.5 px-3">Action Description</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {simulationResult.traces.map((trace, idx) => {
              const isCurrent = idx === currentStepIndex;
              return (
                <tr
                  key={`trace_row_${idx}`}
                  onClick={() => jumpToStep(idx)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-indigo-950/60 text-indigo-200 font-semibold border-l-4 border-l-indigo-400'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400">{idx}</td>
                  <td className="py-2 px-3 text-indigo-300">
                    {trace.activeStates.length > 0
                      ? `{${trace.activeStates.map(stateLabel).join(', ')}}`
                      : '∅'}
                  </td>
                  <td className="py-2 px-3 text-cyan-300">
                    {trace.remainingInput.length > 0 ? `"${trace.remainingInput}"` : 'ε (End)'}
                  </td>
                  {machine.type === 'PDA' && (
                    <td className="py-2 px-3 text-amber-300">
                      [{trace.stack ? trace.stack.join(', ') : 'Z0'}]
                    </td>
                  )}
                  {machine.type === 'TM' && (
                    <td className="py-2 px-3 text-cyan-300">
                      pos: {trace.headIndex !== undefined ? trace.headIndex : 0} ('{trace.tape?.[trace.headIndex || 0] || '_'}')
                    </td>
                  )}
                  <td className="py-2 px-3 text-slate-300 max-w-[280px] truncate">
                    {trace.actionSummary}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {trace.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle className="w-2.5 h-2.5" /> ACCEPT
                      </span>
                    ) : trace.status === 'REJECTED' || trace.status === 'HALTED_REJECT' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                        <XCircle className="w-2.5 h-2.5" /> REJECT
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">RUNNING</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
