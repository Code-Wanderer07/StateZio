import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileJson } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { AutomataMachine } from '../../types/automata';

export const ExportImportModal: React.FC = () => {
  const {
    isExportImportOpen,
    setIsExportImportOpen,
    machine,
    setMachine,
  } = useAutomataStore();

  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isExportImportOpen) return null;

  const jsonString = JSON.stringify(machine, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${machine.name.toLowerCase().replace(/\s+/g, '-') || 'automata'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText) as AutomataMachine;
      if (!parsed.type || !parsed.states || !parsed.transitions) {
        throw new Error('Invalid automata format: Missing type, states, or transitions field.');
      }
      setMachine(parsed);
      setIsExportImportOpen(false);
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-emerald-800">
            <FileJson className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Export & Import Automata
            </h3>
          </div>
          <button
            onClick={() => setIsExportImportOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-white">
          {/* Export Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Export Current Machine
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-200 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 max-h-36 overflow-y-auto shadow-inner">
              {jsonString}
            </pre>
          </div>

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="space-y-3 pt-3 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Import Machine JSON
            </label>

            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste valid Automata JSON definition here..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl p-3 text-xs font-mono text-slate-900 outline-none resize-none"
            />

            {importError && (
              <p className="text-xs text-rose-600 font-mono">Error: {importError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Load Machine</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
