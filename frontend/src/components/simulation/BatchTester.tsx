import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const BatchTester: React.FC = () => {
  const {
    batchTestCases,
    runBatchTests,
    addBatchTestCase,
    deleteBatchTestCase,
    setInputString,
    runSimulation,
  } = useAutomataStore();

  const [newString, setNewString] = useState('');
  const [newExpected, setNewExpected] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBatchTestCase(newString, newExpected);
    setNewString('');
  };

  const passCount = batchTestCases.filter((tc) => tc.status === 'PASS').length;
  const failCount = batchTestCases.filter((tc) => tc.status === 'FAIL').length;

  return (
    <div className="flex flex-col gap-4 select-none h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-label-caps text-xs tracking-widest text-tertiary uppercase">
          Batch Test Suite
        </h3>

        <div className="flex items-center gap-2">
          {batchTestCases.some((tc) => tc.status !== 'PENDING') && (
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">{passCount} PASS</span>
              <span className="text-slate-500">/</span>
              <span className="text-rose-400 font-bold">{failCount} FAIL</span>
            </div>
          )}

          <button
            onClick={runBatchTests}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md text-[10px] font-bold font-label-caps transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>RUN ALL</span>
          </button>
        </div>
      </div>

      {/* Add Test Case Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 bg-surface-container p-2 rounded-lg border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
        <input
          type="text"
          value={newString}
          onChange={(e) => setNewString(e.target.value)}
          placeholder="New test string..."
          className="flex-1 bg-transparent text-sm font-code-md text-on-surface placeholder-on-surface-variant outline-none px-2 w-full min-w-0"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setNewExpected(!newExpected)}
            className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
              newExpected
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {newExpected ? 'ACCEPT' : 'REJECT'}
          </button>
        </div>

        <button
          type="submit"
          className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Test Cases List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-1 pb-4">
        {batchTestCases.length === 0 ? (
          <div className="p-4 flex flex-col items-center justify-center text-center text-on-surface-variant mt-4">
            <FlaskConical className="w-6 h-6 text-on-surface-variant/50 mb-2" />
            <p className="text-xs font-medium">No test cases loaded.</p>
          </div>
        ) : (
          batchTestCases.map((tc) => (
            <div
              key={tc.id}
              className="px-3 py-2 flex items-center justify-between bg-surface-container rounded-lg border border-outline-variant/30 hover:border-primary/30 transition-colors text-sm font-mono group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {tc.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {tc.status === 'FAIL' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {tc.status === 'PENDING' && <div className="w-4 h-4 rounded-full border-2 border-outline-variant shrink-0" />}

                <button
                  onClick={() => {
                    setInputString(tc.input);
                    runSimulation(tc.input);
                  }}
                  className="font-bold text-on-surface hover:text-primary transition-colors text-left cursor-pointer truncate"
                  title={tc.input}
                >
                  "{tc.input}"
                </button>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-[10px] text-on-surface-variant flex flex-col items-end leading-tight">
                  <span>Exp: <strong className={tc.expected ? 'text-emerald-400' : 'text-rose-400'}>{tc.expected ? 'ACC' : 'REJ'}</strong></span>
                  {tc.actual !== undefined && <span>Act: <strong className={tc.actual ? 'text-emerald-400' : 'text-rose-400'}>{tc.actual ? 'ACC' : 'REJ'}</strong></span>}
                </span>

                <button
                  onClick={() => deleteBatchTestCase(tc.id)}
                  className="text-on-surface-variant hover:text-error transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
