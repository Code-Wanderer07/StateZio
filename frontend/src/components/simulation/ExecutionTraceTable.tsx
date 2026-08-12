import React from 'react';
import { ListOrdered, CheckCircle, XCircle } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const ExecutionTraceTable: React.FC = () => {
  const { simulationResult, currentStepIndex, jumpToStep, machine } = useAutomataStore();

  if (!simulationResult || simulationResult.traces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-on-surface-variant h-full p-4">
        <ListOrdered className="w-8 h-8 text-on-surface-variant/50 mb-2" />
        <p className="text-xs font-medium">No simulation trace available.</p>
        <p className="text-[10px] mt-1">Enter an input string and click "Simulate" to view step trace.</p>
      </div>
    );
  }

  const stateLabel = (id: string) => machine.states.find((s) => s.id === id)?.label || id;

  return (
    <div className="flex flex-col gap-4 select-none h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-label-caps text-xs tracking-widest text-tertiary uppercase">
          Execution Trace Log
        </h3>
        <span className="text-[10px] font-mono text-primary font-bold">
          Total Steps: {simulationResult.traces.length}
        </span>
      </div>

      {/* Table container */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar pb-4 pr-1">
        <table className="w-full text-left text-sm font-mono border-separate border-spacing-y-1">
          <thead className="text-tertiary font-label-caps text-[10px] tracking-wider sticky top-0 bg-surface-container-low z-10">
            <tr>
              <th className="py-2 px-2 font-medium">Step</th>
              <th className="py-2 px-2 font-medium">State(s)</th>
              <th className="py-2 px-2 font-medium">Input</th>
              {machine.type === 'PDA' && <th className="py-2 px-2 font-medium">Stack</th>}
              {machine.type === 'TM' && <th className="py-2 px-2 font-medium">Tape Head</th>}
              <th className="py-2 px-2 font-medium">Action</th>
              <th className="py-2 px-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {simulationResult.traces.map((trace, idx) => {
              const isCurrent = idx === currentStepIndex;
              return (
                <tr
                  key={`trace_row_${idx}`}
                  onClick={() => jumpToStep(idx)}
                  className={`cursor-pointer transition-all duration-300 text-xs rounded-lg ${
                    isCurrent
                      ? 'bg-cyan-500/10 text-on-surface font-semibold shadow-[inset_4px_0_15px_rgba(34,211,238,0.15)] relative'
                      : 'hover:bg-surface-container/80 text-on-surface-variant'
                  }`}
                >
                  <td className={`py-2 px-2 rounded-l-lg ${isCurrent ? 'border-l-2 border-cyan-400 text-cyan-400' : ''}`}>{idx}</td>
                  <td className={`py-2 px-2 ${isCurrent ? 'text-cyan-400' : ''}`}>
                    {trace.activeStates.length > 0
                      ? `{${trace.activeStates.map(stateLabel).join(', ')}}`
                      : '∅'}
                  </td>
                  <td className="py-2 px-2 truncate max-w-[80px]">
                    {trace.remainingInput.length > 0 ? `"${trace.remainingInput}"` : 'ε (End)'}
                  </td>
                  {machine.type === 'PDA' && (
                    <td className="py-2 px-2">
                      [{trace.stack ? trace.stack.join(', ') : 'Z0'}]
                    </td>
                  )}
                  {machine.type === 'TM' && (
                    <td className="py-2 px-2">
                      pos: {trace.headIndex !== undefined ? trace.headIndex : 0} ('{trace.tape?.[trace.headIndex || 0] || '_'}')
                    </td>
                  )}
                  <td className="py-2 px-2 truncate max-w-[120px]">
                    {trace.actionSummary}
                  </td>
                  <td className="py-2 px-2 text-right rounded-r-lg">
                    {trace.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        ACC
                      </span>
                    ) : trace.status === 'REJECTED' || trace.status === 'HALTED_REJECT' ? (
                      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                        REJ
                      </span>
                    ) : (
                      <span className="text-[9px] text-on-surface-variant">RUN</span>
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
