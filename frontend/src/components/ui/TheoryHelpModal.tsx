import React from 'react';
import { X, BookOpen, Layers, Disc3, GitFork, MousePointer } from 'lucide-react';

interface TheoryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryHelpModal: React.FC<TheoryHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-sky-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/30 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-200 dark:border-sky-500/20 bg-sky-200 dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
              Theory of Computation Quick Reference & Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-sky-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900">
          {/* Canvas Controls Guide */}
          <div className="p-4 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold">
              <MousePointer className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>How to Use the Interactive Canvas</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong className="text-slate-900 dark:text-white">Add State:</strong> Click "+ Add State" or duplicate nodes.</li>
              <li><strong className="text-slate-900 dark:text-white">Create Transition:</strong> Drag from any handle on a state circle to another state circle.</li>
              <li><strong className="text-slate-900 dark:text-white">Start / Accept States:</strong> Hover any node and click the Play icon (Start) or Check icon (Accept / double ring).</li>
              <li><strong className="text-slate-900 dark:text-white">Edit / Delete Rules:</strong> Click the symbol badge on any transition edge.</li>
              <li><strong className="text-slate-900 dark:text-white">Step-by-Step Debugging:</strong> Type an input string and click "Simulate". Use Play/Pause, Slider, or the Trace Table.</li>
            </ul>
          </div>

          {/* Finite Automata (DFA / NFA) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Finite Automata (DFA, NFA & Subset Construction)
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              A <strong>Deterministic Finite Automaton (DFA)</strong> has exactly one transition for each symbol from every state. An <strong>NFA</strong> permits multiple transitions for the same symbol and spontaneous <em>ε-transitions</em>.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-sky-300 dark:border-sky-500/30 font-mono text-[11px] text-sky-800 dark:text-sky-200">
              DFA / NFA: M = (Q, Σ, δ, q₀, F)
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Subset Construction (Powerset):</strong> Converts any NFA to an equivalent DFA where each DFA state corresponds to a subset of NFA states reachable under ε-closure.
            </p>
          </div>

          {/* Pushdown Automata (PDA) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Pushdown Automata (PDA)
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              A PDA augments a finite control with a <strong>Last-In-First-Out (LIFO) stack</strong> memory. Transition format: <code className="text-amber-300 font-mono font-bold">a, X → Y</code> (Read input <em>a</em>, Pop <em>X</em> from stack, Push <em>Y</em> onto stack).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-sky-300 dark:border-sky-500/30 font-mono text-[11px] text-amber-700 dark:text-amber-200">
              PDA: M = (Q, Σ, Γ, δ, q₀, Z₀, F)
            </div>
          </div>

          {/* Turing Machines (TM) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Turing Machines (TM)
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              A Turing Machine operates on an infinite memory tape with a read/write head that can move Left (L) or Right (R). Transition format: <code className="text-teal-300 font-mono font-bold">a → b, R</code> (Read <em>a</em>, Write <em>b</em>, Move Right).
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-sky-300 dark:border-sky-500/30 font-mono text-[11px] text-teal-200">
              TM: M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
