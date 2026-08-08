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
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Batch Test Suite
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {batchTestCases.some((tc) => tc.status !== 'PENDING') && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-700 font-bold">{passCount} PASS</span>
              <span className="text-slate-400">/</span>
              <span className="text-rose-600 font-bold">{failCount} FAIL</span>
            </div>
          )}

          <button
            onClick={runBatchTests}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-200"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run All Tests</span>
          </button>
        </div>
      </div>

      {/* Add Test Case Form */}
      <form onSubmit={handleAdd} className="p-3 border-b border-slate-200 bg-slate-50/40 flex items-center gap-2">
        <input
          type="text"
          value={newString}
          onChange={(e) => setNewString(e.target.value)}
          placeholder="New test string (e.g. 1010)..."
          className="flex-1 bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 outline-none"
        />

        <div className="flex items-center gap-1 text-xs">
          <label className="text-[11px] text-slate-500 font-medium">Expected:</label>
          <button
            type="button"
            onClick={() => setNewExpected(!newExpected)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold font-mono transition-colors ${
              newExpected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}
          >
            {newExpected ? 'ACCEPT' : 'REJECT'}
          </button>
        </div>

        <button
          type="submit"
          className="p-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-300 transition-colors shadow-xs"
          title="Add Test Case"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Test Cases List */}
      <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-100">
        {batchTestCases.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No test cases loaded. Add test strings above.
          </div>
        ) : (
          batchTestCases.map((tc) => (
            <div
              key={tc.id}
              className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                {tc.status === 'PASS' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {tc.status === 'FAIL' && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                {tc.status === 'PENDING' && (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}

                <button
                  onClick={() => {
                    setInputString(tc.input);
                    runSimulation(tc.input);
                  }}
                  title="Click to simulate this string"
                  className="font-bold text-slate-800 hover:text-emerald-700 transition-colors text-left"
                >
                  "{tc.input}"
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500">
                  Expected: <strong className={tc.expected ? 'text-emerald-700' : 'text-rose-600'}>{tc.expected ? 'ACCEPT' : 'REJECT'}</strong>
                </span>

                {tc.actual !== undefined && (
                  <span className="text-[11px] text-slate-500">
                    Actual: <strong className={tc.actual ? 'text-emerald-700' : 'text-rose-600'}>{tc.actual ? 'ACCEPT' : 'REJECT'}</strong>
                  </span>
                )}

                <button
                  onClick={() => deleteBatchTestCase(tc.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
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
