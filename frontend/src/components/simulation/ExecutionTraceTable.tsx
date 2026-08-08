import React from 'react';
import { ListOrdered, CheckCircle, XCircle } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const ExecutionTraceTable: React.FC = () => {
  const { simulationResult, currentStepIndex, jumpToStep, machine } = useAutomataStore();

  if (!simulationResult || simulationResult.traces.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center text-slate-400 py-12">
        <ListOrdered className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-xs font-medium text-slate-600">No simulation trace available.</p>
        <p className="text-[11px] text-slate-400 mt-1">Enter an input string and click "Simulate" to view step trace.</p>
      </div>
    );
  }

  const stateLabel = (id: string) => machine.states.find((s) => s.id === id)?.label || id;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Execution Trace Log
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Total Steps: {simulationResult.traces.length}
        </span>
      </div>

      {/* Table container */}
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-200 z-10">
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
          <tbody className="divide-y divide-slate-100">
            {simulationResult.traces.map((trace, idx) => {
              const isCurrent = idx === currentStepIndex;
              return (
                <tr
                  key={`trace_row_${idx}`}
                  onClick={() => jumpToStep(idx)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border-l-4 border-l-emerald-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400">{idx}</td>
                  <td className="py-2 px-3 text-emerald-800 font-semibold">
                    {trace.activeStates.length > 0
                      ? `{${trace.activeStates.map(stateLabel).join(', ')}}`
                      : '∅'}
                  </td>
                  <td className="py-2 px-3 text-teal-800">
                    {trace.remainingInput.length > 0 ? `"${trace.remainingInput}"` : 'ε (End)'}
                  </td>
                  {machine.type === 'PDA' && (
                    <td className="py-2 px-3 text-amber-800">
                      [{trace.stack ? trace.stack.join(', ') : 'Z0'}]
                    </td>
                  )}
                  {machine.type === 'TM' && (
                    <td className="py-2 px-3 text-teal-800">
                      pos: {trace.headIndex !== undefined ? trace.headIndex : 0} ('{trace.tape?.[trace.headIndex || 0] || '_'}')
                    </td>
                  )}
                  <td className="py-2 px-3 text-slate-600 max-w-[280px] truncate">
                    {trace.actionSummary}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {trace.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> ACCEPT
                      </span>
                    ) : trace.status === 'REJECTED' || trace.status === 'HALTED_REJECT' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                        <XCircle className="w-2.5 h-2.5 text-rose-600" /> REJECT
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">RUNNING</span>
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
