import React from 'react';
import { X, BookOpen, Layers, Disc3, GitFork, MousePointer } from 'lucide-react';

interface TheoryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryHelpModal: React.FC<TheoryHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 text-emerald-800">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Theory of Computation Quick Reference & Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-600 leading-relaxed bg-white">
          {/* Canvas Controls Guide */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <MousePointer className="w-4 h-4 text-emerald-700" />
              <span>How to Use the Interactive Canvas</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong className="text-slate-900">Add State:</strong> Click "+ Add State" or duplicate nodes.</li>
              <li><strong className="text-slate-900">Create Transition:</strong> Drag from any handle on a state circle to another state circle.</li>
              <li><strong className="text-slate-900">Start / Accept States:</strong> Hover any node and click the Play icon (Start) or Check icon (Accept / double ring).</li>
              <li><strong className="text-slate-900">Edit / Delete Rules:</strong> Click the symbol badge on any transition edge.</li>
              <li><strong className="text-slate-900">Step-by-Step Debugging:</strong> Type an input string and click "Simulate". Use Play/Pause, Slider, or the Trace Table.</li>
            </ul>
          </div>

          {/* Module 1: Finite Automata */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-700" />
              Module 1: Finite Automata (DFA, NFA & Subset Construction)
            </h4>
            <p className="text-slate-600">
              A <strong>Deterministic Finite Automaton (DFA)</strong> has exactly one transition for each symbol from every state. An <strong>NFA</strong> permits multiple transitions for the same symbol and spontaneous <em>ε-transitions</em>.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
              DFA / NFA: M = (Q, Σ, δ, q₀, F)
            </div>
            <p className="text-slate-600">
              <strong>Subset Construction (Powerset):</strong> Converts any NFA to an equivalent DFA where each DFA state corresponds to a subset of NFA states reachable under ε-closure.
            </p>
          </div>

          {/* Module 3: Pushdown Automata */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700" />
              Module 3: Pushdown Automata (PDA)
            </h4>
            <p className="text-slate-600">
              A PDA augments a finite control with a <strong>Last-In-First-Out (LIFO) stack</strong> memory. Transition format: <code className="text-amber-800 font-mono font-bold">a, X → Y</code> (Read input <em>a</em>, Pop <em>X</em> from stack, Push <em>Y</em> onto stack).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
              PDA: M = (Q, Σ, Γ, δ, q₀, Z₀, F)
            </div>
          </div>

          {/* Module 4: Turing Machines */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-teal-900 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-teal-700" />
              Module 4: Turing Machines (TM)
            </h4>
            <p className="text-slate-600">
              A Turing Machine operates on an infinite memory tape with a read/write head that can move Left (L) or Right (R). Transition format: <code className="text-teal-800 font-mono font-bold">a → b, R</code> (Read <em>a</em>, Write <em>b</em>, Move Right).
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
              TM: M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
