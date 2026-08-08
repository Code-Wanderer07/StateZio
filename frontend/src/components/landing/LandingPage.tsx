import React from 'react';
import {
  Sparkles,
  Binary,
  Layers,
  Disc3,
  GitFork,
  ArrowRight,
  CheckCircle2,
  Play,
  BookOpen,
  MousePointer,
  Cpu,
  FlaskConical,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { LinkedInIcon } from '../ui/LinkedInIcon';
import { MachineType } from '../../types/automata';

interface LandingPageProps {
  onLaunchSimulator: (type?: MachineType) => void;
  onOpenPreset?: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchSimulator,
}) => {
  const linkedInUrl = 'https://www.linkedin.com/in/shivakanth-m-701631380';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-800/20 text-white">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  StateZio
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Theory of Computation Interactive Suite
              </p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-to-use')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              How to Use
            </button>
            <button
              onClick={() => scrollToSection('theory-modules')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Theory Modules
            </button>
            <button
              onClick={() => scrollToSection('tips')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Pro Tips
            </button>
          </nav>

          {/* Right Action & Author Badge */}
          <div className="flex items-center gap-3">
            {/* Author Credit Badge with LinkedIn */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
              <span className="text-slate-600 text-[11px]">
                Made by <strong className="text-emerald-900 font-bold">Shivakanth</strong>
              </span>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Shivakanth's LinkedIn Profile"
                className="p-1 rounded-lg bg-white hover:bg-emerald-700 text-emerald-700 hover:text-white border border-emerald-300 transition-all shadow-xs flex items-center justify-center cursor-pointer"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Launch CTA */}
            <button
              onClick={() => onLaunchSimulator()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Badge (Similar to reference image) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300/80 text-emerald-900 text-xs font-bold mb-6 shadow-xs animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>✨ New Interactive Tutor & Question Solver Mode</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-3xl">
          Master Automata Theory <br />
          <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
            The Interactive Way
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
          Stop struggling with static textbook diagrams. <strong className="text-slate-900 font-semibold">StateZio</strong> is a visual digital laboratory to construct, simulate, and debug <strong>DFA</strong>, <strong>NFA</strong>, <strong>Pushdown Automata (PDA)</strong>, and <strong>Turing Machines (TM)</strong> with real-time stack and tape visualization.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunchSimulator()}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-700/25 transition-all hover:scale-105 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Simulator</span>
          </button>

          <button
            onClick={() => scrollToSection('how-to-use')}
            className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-2xl text-sm font-semibold shadow-xs transition-all hover:border-slate-400 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Learn Rules & Tips</span>
          </button>
        </div>

        {/* Quick Launch Machine Type Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium mr-1">Quick Jump:</span>
          <button
            onClick={() => onLaunchSimulator('DFA')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>Module 1: DFA</span>
          </button>
          <button
            onClick={() => onLaunchSimulator('NFA')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <GitFork className="w-3 h-3 text-emerald-700" />
            <span>Module 1: NFA</span>
          </button>
          <button
            onClick={() => onLaunchSimulator('PDA')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-3 h-3 text-amber-700" />
            <span>Module 3: PDA (Stack)</span>
          </button>
          <button
            onClick={() => onLaunchSimulator('TM')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Disc3 className="w-3 h-3 text-teal-700" />
            <span>Module 4: TM (Tape)</span>
          </button>
        </div>
      </section>

      {/* Feature Cards Grid (Inspired by reference bottom section) */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            Engineered for Precision & Learning
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
            Everything you need to master Theory of Computation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MousePointer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Intuitive Graph Canvas
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag from state handles to create transitions, toggle Start or double-ring Accept states with quick-action hover controls, and customize alphabet symbols effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Live Step-by-Step Debugger
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Play, pause, and step forward/backward at variable speeds (0.5x, 1x, 2x). Inspect real-time active state glow, LIFO stack operations, and Turing tape head movements.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Subset Converter & AI Solver
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Convert any NFA to an equivalent DFA with an interactive power-set table, or type any formal language question in the Question Solver for instant state-by-state solutions.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white rounded-3xl border border-slate-200 shadow-sm my-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            Interactive User Guide
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-950">
            How to Use StateZio in 4 Simple Steps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Follow this workflow to design, simulate, and verify your automata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                Select Model
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Pick Automata Type
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose <strong>DFA</strong>, <strong>NFA</strong>, <strong>PDA</strong>, or <strong>TM</strong> from the top navigation bar or load standard university textbook presets from the Presets drawer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                Build Graph
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Add States & Edges
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click <strong>"+ Add State"</strong> to place nodes. Hover on any node's handle dots and drag a connection line to another state circle to create transition rules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                Configure Rules
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Start & Accept Nodes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hover over a state node to click the <strong>Play icon</strong> (Initial state) or <strong>Check icon</strong> (Accept state with double circle). Click edge badges to edit symbols.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                Debug & Verify
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Run Step Simulations
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Type your input string in the Simulation Deck and click <strong>Simulate</strong>. Use Play/Pause, Step Forward/Back, or test 10+ strings in the Batch Tester.
            </p>
          </div>
        </div>
      </section>

      {/* Theory Quick-Reference Modules */}
      <section id="theory-modules" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            Theoretical Foundations
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
            Supported Formal Models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                Module 1
              </span>
              <GitFork className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              DFA, NFA & Subset Construction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulates Deterministic and Non-Deterministic Finite Automata. Automatically converts any NFA with spontaneous $\epsilon$-transitions into an equivalent minimal DFA.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              M = (Q, Σ, δ, q₀, F)
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                Module 3
              </span>
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Pushdown Automata (PDA)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recognizes Context-Free Languages with a live LIFO Stack Visualizer. Supports transitions of form <code className="font-mono text-amber-800 font-bold">a, X → Y</code> (read input, pop stack, push symbol).
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              M = (Q, Σ, Γ, δ, q₀, Z₀, F)
            </div>
          </div>

          {/* Module 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
                Module 4
              </span>
              <Disc3 className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Turing Machines (TM)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full universal Turing Machine simulator with an interactive bi-directional tape, active read/write head, and explicit <code className="font-mono text-teal-800 font-bold">q_accept</code> / <code className="font-mono text-rose-700 font-bold">q_reject</code> halting states.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              M = (Q, Σ, Γ, δ, q₀, q_acc, q_rej)
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips & Tricks Section */}
      <section id="tips" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 rounded-3xl bg-emerald-900 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-700/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Pro Tips & Best Practices
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Maximize Your Workflow in StateZio
            </h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-emerald-100">
              <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">
                    Batch Testing
                  </strong>
                  Test multiple valid and invalid strings at once under the <strong>Batch Tests</strong> tab to instantly verify machine accuracy.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 flex items-start gap-3">
                <FileCode className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">
                    Export & Share JSON
                  </strong>
                  Save and share your custom machine architectures with friends or professors by copying the formatted JSON in the Presets drawer.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">
                    Epsilon Transitions
                  </strong>
                  Use the symbol <code className="font-mono text-white bg-emerald-950 px-1 py-0.5 rounded">ε</code> or type <code className="font-mono text-white bg-emerald-950 px-1 py-0.5 rounded">eps</code> in NFA and PDA models for spontaneous jumps.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-800/60 border border-emerald-700/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">
                    Question Solver
                  </strong>
                  Click <strong>"Question Solver"</strong> in the top navbar anytime to input natural language TOC prompts and receive step-by-step guidance.
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => onLaunchSimulator()}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-emerald-900 rounded-xl text-xs font-extrabold shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <span>Open Simulator Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-xs">
              SZ
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900">
                StateZio
              </span>
              <p className="text-[11px] text-slate-500">
                Theory of Computation Educational Suite
              </p>
            </div>
          </div>

          {/* Center Author Credit */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              Designed & Developed by <strong className="text-emerald-900 font-bold">Shivakanth</strong>
            </span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with Shivakanth on LinkedIn"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-700 text-slate-700 hover:text-white border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <button
              onClick={() => onLaunchSimulator()}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Launch App
            </button>
            <button
              onClick={() => scrollToSection('how-to-use')}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              User Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
