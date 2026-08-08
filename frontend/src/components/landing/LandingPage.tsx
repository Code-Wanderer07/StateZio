import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  BookOpen,
  MousePointer,
  Cpu,
  FlaskConical,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Layers,
  Disc3,
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
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'json' | 'tuples'>('python');

  const linkedInUrl = 'https://www.linkedin.com/in/shivakanth-m-701631380';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    const code =
      activeCodeTab === 'python'
        ? `from statezio import DFAMachine, Simulator\n\n# Initialize StateZio Automata Engine\nmachine = DFAMachine(\n    states=["q0", "q1", "q2"],\n    alphabet=["0", "1"],\n    start_state="q0",\n    accept_states=["q2"]\n)\n\n# Define Transitions\nmachine.add_transition("q0", "0", "q0")\nmachine.add_transition("q0", "1", "q1")\nmachine.add_transition("q1", "0", "q2")\n\n# Run Step-by-Step Simulation\nresult = Simulator.run(machine, input_str="0101")\nprint(result.status)  # ACCEPTED`
        : activeCodeTab === 'json'
        ? `{\n  "name": "DFA Ending in 01",\n  "type": "DFA",\n  "alphabet": ["0", "1"],\n  "states": [\n    {"id": "q0", "isStart": true, "isAccept": false},\n    {"id": "q1", "isStart": false, "isAccept": false},\n    {"id": "q2", "isStart": false, "isAccept": true}\n  ],\n  "transitions": [\n    {"from": "q0", "to": "q0", "symbol": "0"},\n    {"from": "q0", "to": "q1", "symbol": "1"},\n    {"from": "q1", "to": "q2", "symbol": "0"}\n  ]\n}`
        : `M = (Q, Σ, δ, q0, F)\nQ = { q0, q1, q2 }\nΣ = { 0, 1 }\nq0 = q0\nF = { q2 }\n\nTransition Function δ:\nδ(q0, 0) = q0\nδ(q0, 1) = q1\nδ(q1, 0) = q2\nδ(q1, 1) = q1\nδ(q2, 0) = q0\nδ(q2, 1) = q1`;

    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Top Floating Glass Navbar */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src="/statezio-logo.png"
                  alt="StateZio Logo"
                  className="relative w-8 h-8 rounded-xl object-contain bg-[#161b22] border border-white/10"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    StateZio
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                    v1.0
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('models')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Automata Models
            </button>
            <button
              onClick={() => scrollToSection('solver')}
              className="text-purple-300 hover:text-purple-200 transition-colors cursor-pointer font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>AI Solver</span>
            </button>
            <button
              onClick={() => scrollToSection('pro-tips')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tips
            </button>
          </nav>

          {/* Right Action & Author Badge */}
          <div className="flex items-center gap-3">
            {/* Author Credit Badge with LinkedIn */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs backdrop-blur-md">
              <span className="text-slate-400 text-[11px]">
                Made by <strong className="text-white font-bold">Shivakanth</strong>
              </span>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Connect with Shivakanth on LinkedIn"
                className="p-1 rounded-lg bg-white/10 hover:bg-[#0077B5] text-slate-300 hover:text-white border border-white/10 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Launch CTA */}
            <button
              onClick={() => onLaunchSimulator()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Launch Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Light Shadowy Background Image */}
      <section
        id="hero"
        className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center justify-center min-h-[85vh] w-full"
      >
        {/* Background Graphic: The uploaded automata blueprint wallpaper in shadowy center */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
          <div
            className="w-full h-full max-w-6xl opacity-35 bg-cover bg-center mix-blend-screen transform scale-105 filter blur-[0.5px]"
            style={{
              backgroundImage: `url('/hero-bg.jpg')`,
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 25%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 25%, transparent 85%)',
            }}
          />

          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/25 via-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        </div>

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1936]/80 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-lg shadow-purple-950/50 mb-8 backdrop-blur-md hover:border-purple-400/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span className="font-mono text-[11px] text-purple-300">
            ● StateZio Automata Engine v1.0
          </span>
        </div>

        {/* Large Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
          Build & Simulate Automata <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            in Half the Time
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
          The next-generation visual theory platform to construct, simulate, and debug{' '}
          <strong className="text-white">DFA</strong>, <strong className="text-white">NFA</strong>,{' '}
          <strong className="text-white">Pushdown Automata (PDA)</strong>, and{' '}
          <strong className="text-white">Turing Machines (TM)</strong> in minutes.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 z-10">
          <button
            onClick={() => onLaunchSimulator()}
            className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-purple-900/40 border border-purple-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start Simulating Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('models')}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-md transition-all hover:border-white/30 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Explore Models</span>
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex items-center gap-2 px-5 py-3.5 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <Play className="w-3.5 h-3.5 text-purple-300 fill-current group-hover:text-white ml-0.5" />
            </div>
            <span>How It Works</span>
          </button>
        </div>

        {/* Stats Section Divider */}
        <div className="w-full max-w-4xl mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              4
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Automata Types (DFA, NFA, PDA, TM)
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Deterministic Step Engine
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              &lt;10ms
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Fast Interactive Latency
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
              50+
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Preset Bank & University Questions
            </div>
          </div>
        </div>

        {/* Interactive Code / Graph Preview Window */}
        <div className="w-full max-w-3xl mt-14 text-left">
          <div className="rounded-2xl bg-[#131620]/95 border border-white/15 shadow-2xl shadow-purple-950/60 overflow-hidden backdrop-blur-2xl">
            <div className="h-10 bg-[#0d1017] border-b border-white/10 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs font-mono text-slate-400">
                  statezio_example.py
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    activeCodeTab === 'python'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python API
                </button>
                <button
                  onClick={() => setActiveCodeTab('json')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    activeCodeTab === 'json'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5-Tuple JSON
                </button>
                <button
                  onClick={() => setActiveCodeTab('tuples')}
                  className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    activeCodeTab === 'tuples'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Formal δ Table
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                title="Copy snippet"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto bg-[#0b0e14]/90 text-slate-300">
              {activeCodeTab === 'python' && (
                <pre className="space-y-1">
                  <span className="text-purple-400">from</span> statezio <span className="text-purple-400">import</span> DFAMachine, Simulator
                  <br /><br />
                  <span className="text-slate-500"># 1. Initialize DFA Machine</span><br />
                  machine = DFAMachine(<br />
                  &nbsp;&nbsp;states=[<span className="text-emerald-300">"q0"</span>, <span className="text-emerald-300">"q1"</span>, <span className="text-emerald-300">"q2"</span>],<br />
                  &nbsp;&nbsp;alphabet=[<span className="text-emerald-300">"0"</span>, <span className="text-emerald-300">"1"</span>],<br />
                  &nbsp;&nbsp;start_state=<span className="text-emerald-300">"q0"</span>,<br />
                  &nbsp;&nbsp;accept_states=[<span className="text-emerald-300">"q2"</span>]<br />
                  )<br /><br />
                  <span className="text-slate-500"># 2. Add Transitions for Language L = {'{'}w | w ends with 01{'}'}</span><br />
                  machine.add_transition(<span className="text-emerald-300">"q0"</span>, <span className="text-emerald-300">"0"</span>, <span className="text-emerald-300">"q0"</span>)<br />
                  machine.add_transition(<span className="text-emerald-300">"q0"</span>, <span className="text-emerald-300">"1"</span>, <span className="text-emerald-300">"q1"</span>)<br />
                  machine.add_transition(<span className="text-emerald-300">"q1"</span>, <span className="text-emerald-300">"0"</span>, <span className="text-emerald-300">"q2"</span>)<br /><br />
                  <span className="text-slate-500"># 3. Simulate step-by-step with state highlighting</span><br />
                  result = Simulator.run(machine, input_str=<span className="text-emerald-300">"0101"</span>)<br />
                  <span className="text-purple-400">print</span>(result.status)&nbsp;&nbsp;<span className="text-emerald-400"># -&gt; ACCEPTED (Final State: q2)</span>
                </pre>
              )}

              {activeCodeTab === 'json' && (
                <pre className="text-cyan-300">
{`{
  "name": "DFA Ending in 01",
  "type": "DFA",
  "alphabet": ["0", "1"],
  "states": [
    { "id": "q0", "isStart": true, "isAccept": false },
    { "id": "q1", "isStart": false, "isAccept": false },
    { "id": "q2", "isStart": false, "isAccept": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q0", "symbol": "0" },
    { "from": "q0", "to": "q1", "symbol": "1" },
    { "from": "q1", "to": "q2", "symbol": "0" }
  ]
}`}
                </pre>
              )}

              {activeCodeTab === 'tuples' && (
                <pre className="text-amber-200">
{`M = (Q, Σ, δ, q0, F)
Q = { q0, q1, q2 }
Σ = { 0, 1 }
q0 = q0
F = { q2 }

Transition Function δ:
  δ(q0, 0) = q0
  δ(q0, 1) = q1
  δ(q1, 0) = q2
  δ(q1, 1) = q1
  δ(q2, 0) = q0
  δ(q2, 1) = q1`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 bg-[#0a0d13] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Full Automata Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Tools Built for Computation
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Construct complex state graphs, inspect infinite Turing tapes, test batches, and verify university problem sets with real-time feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#121622] border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <MousePointer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Visual Graph Canvas
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add states, drag transition connectors, toggle Start and Double-circle Accept states with single clicks. Includes automatic layout positioning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121622] border border-white/10 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Step Engine & Playback
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Play, pause, forward, backward, or adjust speed (0.5x, 1x, 2x). Highlights active state cyan glows and active transition edges with trace logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121622] border border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Stack & Tape Visualizers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live PDA Stack push/pop animation and Turing Machine infinite bi-directional tape with glowing read/write head indicators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121622] border border-white/10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Batch Test Suite & Solver
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run batch tests across multiple positive/negative inputs simultaneously, or ask the AI question solver to load machine solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-semibold mb-3 border border-white/10">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How to Build and Simulate in StateZio
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Four simple steps to construct, verify, and master your automata machines.
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#131722] border border-white/10 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-purple-900/30">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Select Your Automata Type
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Choose between <strong>DFA</strong>, <strong>NFA</strong>, <strong>PDA</strong>, or <strong>Turing Machine (TM)</strong> using the top navigation bar or preset menu.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#131722] border border-white/10 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-purple-900/30">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Add States and Define Transitions
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Click <strong>+ Add State</strong> to create nodes on the canvas. Drag connection handles between circles to form transitions. Double click any node or edge badge to configure symbol rules (<code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-purple-300">0, 1, ε</code> for DFA/NFA, <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-purple-300">a, Z0 → aZ0</code> for PDA, <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-purple-300">0 → X, R</code> for TM).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#131722] border border-white/10 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-purple-900/30">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Set Start & Accept States
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hover over any state circle to reveal the quick action icons: click the <strong>Play Icon</strong> to mark as Start State (Green arrow) and the <strong>Check Icon</strong> to mark as Accept State (Double ring).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#131722] border border-white/10 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-purple-900/30">
              4
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Input String & Step Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your test string in the bottom simulation deck (e.g. <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-purple-300">0101</code> or <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-purple-300">aaabbb</code>) and click <strong>Simulate</strong>. Use Step Forward / Step Backward, run at 0.5x, 1x, or 2x speed, and examine the trace table!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Automata Models Covered */}
      <section id="models" className="py-20 bg-[#0a0d13] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Supported Automata Models
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Full coverage for standard Theory of Computation models and algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DFA / NFA */}
            <div className="bg-[#121622] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs mb-3">
                  DFA & NFA
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Finite Automata
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>DFA: 5-tuple formal definition & state transitions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>NFA & ε-NFA with spontaneous epsilon transitions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Subset Construction Algorithm (NFA → DFA)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Batch Test Suite & Pass/Fail Matrix</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onLaunchSimulator('DFA')}
                className="mt-6 w-full py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs rounded-xl border border-purple-500/30 transition-all cursor-pointer"
              >
                Launch DFA / NFA
              </button>
            </div>

            {/* PDA */}
            <div className="bg-[#121622] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs mb-3">
                  PDA
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Pushdown Automata
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>7-tuple PDA formal definition</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Acceptance by Final State & Empty Stack</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Live stack animation with top pointer (Z₀)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Classic languages: aⁿbⁿ, Palindromes (wwᴿ)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onLaunchSimulator('PDA')}
                className="mt-6 w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white font-bold text-xs rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
              >
                Launch PDA Visualizer
              </button>
            </div>

            {/* TM */}
            <div className="bg-[#121622] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs mb-3">
                  TM
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Turing Machines
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Standard 7-tuple TM definition</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Read/Write transitions & Left/Right moves</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Interactive tape strip with cell highlighting</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Languages: aⁿbⁿcⁿ, 1's complement, w#w</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onLaunchSimulator('TM')}
                className="mt-6 w-full py-2.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-200 hover:text-white font-bold text-xs rounded-xl border border-cyan-500/30 transition-all cursor-pointer"
              >
                Launch Turing Machine
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section id="pro-tips" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-purple-950 via-[#191533] to-[#0f192b] border border-purple-500/30 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-4 backdrop-blur-xs border border-purple-500/40">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Pro Tips for Automata Construction</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              StateZio Tips & Best Practices
            </h2>
            <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="font-bold text-purple-400 text-base">💡</span>
                <p>
                  <strong className="text-white">DFA Completeness:</strong> Ensure every state has a transition for every alphabet symbol. Any unhandled transition will instantly halt with a rejected status!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-purple-400 text-base">💡</span>
                <p>
                  <strong className="text-white">NFA ε-Transitions:</strong> Use the symbol <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-purple-300">ε</code> to allow transitions without consuming input characters.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-purple-400 text-base">💡</span>
                <p>
                  <strong className="text-white">Batch Test Suite:</strong> Use the sidebar Batch Testing card to run 5+ test cases in parallel and get an instant Pass/Fail report card.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => onLaunchSimulator()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xl shadow-purple-900/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <span>Open Simulator Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek Dark Footer */}
      <footer className="mt-auto bg-[#090b10] border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/statezio-logo.png"
              alt="StateZio Logo"
              className="w-8 h-8 rounded-xl object-contain bg-[#161b22] border border-white/10 shadow-xs"
            />
            <div>
              <span className="font-extrabold text-sm text-white">
                StateZio
              </span>
              <p className="text-[11px] text-slate-500">
                Theory of Computation Interactive Suite
              </p>
            </div>
          </div>

          {/* Center Author Credit */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              Designed & Developed by <strong className="text-white font-bold">Shivakanth</strong>
            </span>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with Shivakanth on LinkedIn"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#0077B5] text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <button
              onClick={() => onLaunchSimulator()}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              Launch App
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              User Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
