import React from 'react';
import { X, BookOpen, Layers, Disc3, GitFork, Lightbulb, MousePointer } from 'lucide-react';

interface TheoryHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryHelpModal: React.FC<TheoryHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-indigo-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              Theory of Computation Quick Reference & Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Canvas Controls Guide */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <MousePointer className="w-4 h-4" />
              <span>How to Use the Interactive Canvas</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-white">Add State:</strong> Click "+ Add State" or duplicate nodes.</li>
              <li><strong className="text-white">Create Transition:</strong> Drag from any handle on a state circle to another state circle.</li>
              <li><strong className="text-white">Start / Accept States:</strong> Hover any node and click the Play icon (Start) or Check icon (Accept / double ring).</li>
              <li><strong className="text-white">Edit / Delete Rules:</strong> Click the symbol badge on any transition edge.</li>
              <li><strong className="text-white">Step-by-Step Debugging:</strong> Type an input string and click "Simulate". Use Play/Pause, Slider, or the Trace Table.</li>
            </ul>
          </div>

          {/* Module 1: Finite Automata */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <GitFork className="w-4 h-4" />
              Module 1: Finite Automata (DFA, NFA & Subset Construction)
            </h4>
            <p className="text-slate-400">
              A <strong>Deterministic Finite Automaton (DFA)</strong> has exactly one transition for each symbol from every state. An <strong>NFA</strong> permits multiple transitions for the same symbol and spontaneous <em>ε-transitions</em>.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px]">
              DFA / NFA: M = (Q, Σ, δ, q₀, F)
            </div>
            <p className="text-slate-400">
              <strong>Subset Construction (Powerset):</strong> Converts any NFA to an equivalent DFA where each DFA state corresponds to a subset of NFA states reachable under ε-closure.
            </p>
          </div>

          {/* Module 3: Pushdown Automata */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Module 3: Pushdown Automata (PDA)
            </h4>
            <p className="text-slate-400">
              A PDA augments a finite control with a <strong>Last-In-First-Out (LIFO) stack</strong> memory. Transition format: <code className="text-amber-300 font-mono">a, X → Y</code> (Read input <em>a</em>, Pop <em>X</em> from stack, Push <em>Y</em> onto stack).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px]">
              PDA: M = (Q, Σ, Γ, δ, q₀, Z₀, F)
            </div>
          </div>

          {/* Module 4: Turing Machines */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Disc3 className="w-4 h-4" />
              Module 4: Turing Machines (TM)
            </h4>
            <p className="text-slate-400">
              A Turing Machine operates on an infinite memory tape with a read/write head that can move Left (L) or Right (R). Transition format: <code className="text-cyan-300 font-mono">a → b, R</code> (Read <em>a</em>, Write <em>b</em>, Move Right).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-[11px]">
              TM: M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
