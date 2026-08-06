import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileJson, Image as ImageIcon } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-indigo-400">
            <FileJson className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              Export & Import Automata
            </h3>
          </div>
          <button
            onClick={() => setIsExportImportOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Export Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Export Current Machine
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto">
              {jsonString}
            </pre>
          </div>

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="space-y-3 pt-3 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Import Machine JSON
            </label>

            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste valid Automata JSON definition here..."
              className="w-full bg-slate-950/90 border border-slate-700 focus:border-indigo-500 rounded-xl p-3 text-xs font-mono text-white outline-none resize-none"
            />

            {importError && (
              <p className="text-xs text-rose-400 font-mono">Error: {importError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
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
