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
    <div className="flex flex-col bg-white dark:bg-[#121622] border border-slate-300 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1017]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Batch Test Suite
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {batchTestCases.some((tc) => tc.status !== 'PENDING') && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">{passCount} PASS</span>
              <span className="text-slate-500">/</span>
              <span className="text-rose-400 font-bold">{failCount} FAIL</span>
            </div>
          )}

          <button
            onClick={runBatchTests}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-900 dark:text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-950/40 border border-purple-400/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run All</span>
          </button>
        </div>
      </div>

      {/* Add Test Case Form */}
      <form onSubmit={handleAdd} className="p-3 border-b border-slate-300 dark:border-white/10 bg-[#0b0e14] flex items-center gap-2">
        <input
          type="text"
          value={newString}
          onChange={(e) => setNewString(e.target.value)}
          placeholder="New test string (e.g. 1010)..."
          className="flex-1 bg-white dark:bg-[#121622] border border-slate-300 dark:border-white/10 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-500 outline-none"
        />

        <div className="flex items-center gap-1 text-xs">
          <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Expected:</label>
          <button
            type="button"
            onClick={() => setNewExpected(!newExpected)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
              newExpected
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {newExpected ? 'ACCEPT' : 'REJECT'}
          </button>
        </div>

        <button
          type="submit"
          className="p-1.5 bg-slate-200 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-slate-50/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 transition-colors shadow-xs cursor-pointer"
          title="Add Test Case"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Test Cases List */}
      <div className="max-h-[260px] overflow-y-auto divide-y divide-white/5">
        {batchTestCases.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No test cases loaded. Add test strings above.
          </div>
        ) : (
          batchTestCases.map((tc) => (
            <div
              key={tc.id}
              className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-white/5 transition-colors text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                {tc.status === 'PASS' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {tc.status === 'FAIL' && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {tc.status === 'PENDING' && (
                  <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}

                <button
                  onClick={() => {
                    setInputString(tc.input);
                    runSimulation(tc.input);
                  }}
                  title="Click to simulate this string"
                  className="font-bold text-slate-200 hover:text-purple-300 transition-colors text-left cursor-pointer"
                >
                  "{tc.input}"
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Expected: <strong className={tc.expected ? 'text-emerald-400' : 'text-rose-400'}>{tc.expected ? 'ACCEPT' : 'REJECT'}</strong>
                </span>

                {tc.actual !== undefined && (
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Actual: <strong className={tc.actual ? 'text-emerald-400' : 'text-rose-400'}>{tc.actual ? 'ACCEPT' : 'REJECT'}</strong>
                  </span>
                )}

                <button
                  onClick={() => deleteBatchTestCase(tc.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove test case"
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
