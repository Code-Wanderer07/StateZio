import React, { useEffect } from 'react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { MachineType } from '../../types/automata';
import { Code, Share2 } from 'lucide-react';

interface LandingPageProps {
  onLaunchSimulator: (type?: MachineType) => void;
  onOpenSolver: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchSimulator, onOpenSolver }) => {
  const { theme, toggleTheme } = useAutomataStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="bg-background text-on-surface font-body-md text-base min-h-screen flex flex-col selection:bg-primary/30 relative overflow-hidden">
      
      {/* TopNavBar */}
      <nav className="flex justify-between items-center px-6 md:px-8 lg:px-12 h-16 w-full z-50 bg-surface-container/80 backdrop-blur-xl text-primary sticky top-0 border-b border-outline-variant/30 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/statezio-logo2.png" alt="StateZio Logo" className="w-9 h-9 dark:mix-blend-screen rounded-lg dark:rounded-none" />
            <div className="flex items-start">
              <div className="font-display-lg text-2xl font-bold text-primary tracking-tighter">StateZio</div>
              <span className="ml-1 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md self-start mt-0.5">2.0</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-2 xl:gap-6 text-sm xl:text-base whitespace-nowrap">
            <a href="#about" className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 px-2 xl:px-3 py-1 rounded-md cursor-pointer">About</a>
            <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 px-2 xl:px-3 py-1 rounded-md cursor-pointer">How it Works</a>
            <a href="#capabilities" className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 px-2 xl:px-3 py-1 rounded-md cursor-pointer">Capabilities</a>
            <a href="#automata-models" className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 px-2 xl:px-3 py-1 rounded-md cursor-pointer">Automata Models</a>
            <a href="#question-solver" className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 px-2 xl:px-3 py-1 rounded-md cursor-pointer">Question Solver</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright/50 active:scale-95 duration-200 p-2 rounded-full items-center justify-center">
            <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <a className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low/30 text-on-surface-variant hover:text-cyan-400 hover:border-cyan-400/30 transition-all active:scale-95 duration-200 shadow-sm" href="https://www.linkedin.com/in/shivakanth-m-701631380" target="_blank" rel="noopener noreferrer" title="Shivakanth's LinkedIn">
            <span>Shivakanth</span>
            <span className="material-symbols-outlined text-[16px]">link</span>
          </a>
          <button onClick={() => onLaunchSimulator()} className="bg-primary text-on-primary px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-full font-label-caps text-xs font-bold tracking-widest hover:bg-primary-fixed transition-colors active:scale-95 duration-200 shadow-sm shadow-primary/30 md:shadow-[0_0_15px_rgba(76,215,246,0.3)] whitespace-nowrap">
            Launch
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow relative flex flex-col items-center justify-start pt-20 md:pt-32 pb-24 px-4 md:px-8 overflow-hidden z-10">
        
        {/* Background Effects */}
        <div className="absolute inset-0 blueprint-bg z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] opacity-20 z-0 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] opacity-10 z-0"></div>
        
        <div id="about" className="relative z-10 w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 scroll-mt-24 mt-8 md:mt-16">
          
          {/* Left Column: Text & Buttons */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start z-20">
            {/* Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6 text-sm font-code">
              <span className="material-symbols-outlined text-[16px]">science</span>
              v2.0 Beta Live
            </div>
            
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight tracking-tight">
              Master the <br className="md:hidden" /><span className="text-primary">Theory of Computation</span>
            </h1>
            <p className="font-body-lg text-base md:text-lg text-on-surface-variant mb-8 max-w-lg">
              Interactive automata simulator. Design, visualize, and debug deterministic and non-deterministic state machines in a high-performance Cyber-Educational environment.
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <button onClick={() => onLaunchSimulator('DFA')} className="w-full md:w-auto flex justify-center items-center gap-2 bg-primary/90 text-on-primary px-6 py-3 rounded-md font-label-caps font-bold tracking-wider hover:bg-primary transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 duration-200">
                <span className="material-symbols-outlined text-[18px]">play_arrow</span> Start Simulating
              </button>
              <a href="https://github.com/Code-Wanderer07/StateZio" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-md font-label-caps font-bold tracking-wider border border-outline-variant/50 text-on-surface hover:bg-surface-container-high transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200 shadow-sm">
                View Source Code <span className="material-symbols-outlined text-[18px]">code</span>
              </a>
            </div>
          </div>

          {/* Right Column: Code Snippet & Accent */}
          <div className="relative w-full flex justify-center lg:justify-end mt-12 lg:mt-0 z-20">
            {/* Cyber Brackets / Accent */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-lg opacity-50 hidden md:block"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-secondary rounded-br-lg opacity-50 hidden md:block"></div>
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-1 h-16 bg-secondary rounded-full shadow-[0_0_10px_#ddb8ff] hidden lg:block"></div>

            <div className="relative w-full max-w-[500px] bg-[#1a1d24] border border-outline-variant/30 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center px-4 py-3 bg-[#1a1d24] border-b border-outline-variant/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="mx-auto font-code text-xs text-on-surface-variant/70">nfa_definition.json</div>
              </div>
              <div className="p-5 overflow-x-auto text-left text-sm leading-relaxed">
                <pre><code className="font-code text-[#a9b1d6]" dangerouslySetInnerHTML={{ __html: `{
  <span class="text-[#7aa2f7]">"type"</span>: <span class="text-[#9ece6a]">"NFA"</span>,
  <span class="text-[#7aa2f7]">"states"</span>: [<span class="text-[#9ece6a]">"q0"</span>, <span class="text-[#9ece6a]">"q1"</span>, <span class="text-[#9ece6a]">"q2"</span>],
  <span class="text-[#7aa2f7]">"alphabet"</span>: [<span class="text-[#9ece6a]">"0"</span>, <span class="text-[#9ece6a]">"1"</span>],
  <span class="text-[#7aa2f7]">"start_state"</span>: <span class="text-[#9ece6a]">"q0"</span>,
  <span class="text-[#7aa2f7]">"accept_states"</span>: [<span class="text-[#9ece6a]">"q2"</span>],
  <span class="text-[#7aa2f7]">"transitions"</span>: {
    <span class="text-[#9ece6a]">"q0"</span>: { <span class="text-[#9ece6a]">"0"</span>: [<span class="text-[#9ece6a]">"q0"</span>, <span class="text-[#9ece6a]">"q1"</span>], <span class="text-[#9ece6a]">"1"</span>: [<span class="text-[#9ece6a]">"q0"</span>] },
    <span class="text-[#9ece6a]">"q1"</span>: { <span class="text-[#9ece6a]">"1"</span>: [<span class="text-[#9ece6a]">"q2"</span>] },
    <span class="text-[#9ece6a]">"q2"</span>: {}
  }
}` }} /></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bento Grid (Explore Automata Types) */}
        <div id="automata-models" className="relative z-10 w-full max-w-[1200px] mx-auto mt-32 md:mt-48 scroll-mt-24 px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-3xl font-bold text-on-surface mb-4">Explore Automata Types</h2>
            <p className="font-body-md text-on-surface-variant">Interactive environments tailored for every computational model.</p>
          </div>
          
          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* DFA Card (Large) */}
            <div onClick={() => onLaunchSimulator('DFA')} className="col-span-1 md:col-span-8 group relative bg-surface-container-low/90 dark:bg-[#1a1d24] border border-outline-variant/30 hover:border-primary/50 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(5,150,105,0.15)] dark:hover:shadow-[0_0_40px_rgba(76,215,246,0.15)] cursor-pointer min-h-[240px] flex flex-col justify-end shadow-sm">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 text-primary">
                <span className="material-symbols-outlined text-[24px]">account_tree</span>
              </div>
              
              <div className="relative z-10 mt-12">
                <h3 className="font-headline-sm text-3xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">Deterministic Finite Automata</h3>
                <p className="font-body-md text-base text-on-surface-variant/80 max-w-[450px]">Design strict state machines where every transition is explicitly defined. Perfect for lexical analysis and pattern matching.</p>
              </div>
              
              <div className="absolute bottom-6 right-6 text-on-surface-variant group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>

            {/* NFA Card (Narrow, Top Right) */}
            <div onClick={() => onLaunchSimulator('NFA')} className="col-span-1 md:col-span-4 group relative bg-surface-container-low/90 dark:bg-[#1a1d24] border border-outline-variant/30 hover:border-secondary/50 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(126,34,206,0.15)] dark:hover:shadow-[0_0_30px_rgba(221,184,255,0.15)] cursor-pointer min-h-[240px] flex flex-col justify-end shadow-sm">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-secondary/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 group-hover:bg-secondary/30 transition-colors pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 text-secondary">
                <span className="material-symbols-outlined text-[24px]">route</span>
              </div>
              
              <div className="relative z-10 mt-12">
                <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 group-hover:text-secondary transition-colors">NFA & ε-NFA</h3>
                <p className="font-body-md text-sm text-on-surface-variant/80">Embrace non-determinism. Visualize multiple computational paths executing simultaneously.</p>
              </div>
            </div>

            {/* PDA Card (Narrow, Bottom Left) */}
            <div onClick={() => onLaunchSimulator('PDA')} className="col-span-1 md:col-span-4 group relative bg-surface-container-low/90 dark:bg-[#1a1d24] border border-outline-variant/30 hover:border-tertiary/50 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,180,171,0.15)] cursor-pointer min-h-[240px] flex flex-col justify-end shadow-sm">
              <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-tertiary/20 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 group-hover:bg-tertiary/30 transition-colors pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 text-tertiary">
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </div>
              
              <div className="relative z-10 mt-12">
                <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 group-hover:text-tertiary transition-colors">Pushdown Automata</h3>
                <p className="font-body-md text-sm text-on-surface-variant/80">Add memory with LIFO stacks. Parse context-free grammars with ease.</p>
              </div>
            </div>

            {/* TM Card (Wide, Bottom Right) */}
            <div onClick={() => onLaunchSimulator('TM')} className="col-span-1 md:col-span-8 group relative bg-surface-container-low/90 dark:bg-[#1a1d24] border border-outline-variant/30 hover:border-warning/50 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,200,0,0.1)] cursor-pointer min-h-[240px] flex flex-col justify-end shadow-sm">
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-warning/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 group-hover:bg-warning/20 transition-colors pointer-events-none"></div>
              
              <div className="absolute top-6 left-6 text-warning">
                <span className="material-symbols-outlined text-[24px]">memory</span>
              </div>
              
              <div className="relative z-10 mt-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 group-hover:text-warning transition-colors">Turing Machines</h3>
                  <p className="font-body-md text-sm text-on-surface-variant/80 max-w-[350px] mb-4">The ultimate computational model. Simulate infinite tape interactions and explore computability theory interactively.</p>
                  <div className="flex items-center gap-2 text-xs text-warning/80 font-code">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
                    Multi-tape support coming soon
                  </div>
                </div>
                
                {/* Mock Tape Visualizer */}
                <div className="flex gap-1.5 p-2 bg-surface-container/50 border border-outline-variant/30 rounded-lg">
                  <div className="w-8 h-10 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-xs font-code">0</div>
                  <div className="w-8 h-10 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-xs font-code">1</div>
                  <div className="w-8 h-10 bg-warning/20 flex items-center justify-center rounded border border-warning text-warning text-xs font-code shadow-[0_0_10px_rgba(255,200,0,0.3)]">1</div>
                  <div className="w-8 h-10 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-xs font-code">_</div>
                  <div className="w-8 h-10 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-xs font-code">_</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Capabilities Section */}
        <div id="capabilities" className="relative z-10 w-full max-w-[1000px] mx-auto mt-24 md:mt-32 border-t border-outline-variant/20 pt-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 1: Live Execution */}
            <div className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[20px] text-primary">visibility</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-3">Live Execution</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Watch your machine process strings character by character with glowing active state highlights.
              </p>
            </div>
            {/* Card 2: Graph Editor */}
            <div className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 hover:border-secondary/50 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[20px] text-secondary">account_tree</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-3">Graph Editor</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Drag and drop states. Connect edges smoothly with auto-routing bezier curves in a fluid canvas.
              </p>
            </div>
            {/* Card 3: Formal Verification */}
            <div className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 hover:border-tertiary/50 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[20px] text-tertiary">fact_check</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-3">Formal Verification</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">
                Automatically detect non-determinism, unreachable states, and test for language equivalency.
              </p>
              <div className="flex gap-2 p-2 bg-surface-container/50 border border-outline-variant/30 rounded-lg w-max">
                <div className="w-6 h-8 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-[10px] font-code">1</div>
                <div className="w-6 h-8 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-[10px] font-code">0</div>
                <div className="w-6 h-8 bg-tertiary/20 flex items-center justify-center rounded border border-tertiary text-tertiary text-[10px] font-code shadow-[0_0_8px_rgba(45,212,191,0.3)]">0</div>
                <div className="w-6 h-8 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-[10px] font-code">1</div>
                <div className="w-6 h-8 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant text-[10px] font-code">0</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="relative z-10 w-full max-w-[1000px] mx-auto mt-24 md:mt-32 border-t border-outline-variant/20 pt-16">
          <h2 className="font-headline-md text-3xl font-semibold text-on-surface mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Connecting Lines for Desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-[-1]"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center border-2 border-primary/30 text-primary font-display-lg text-2xl font-bold shadow-[0_0_15px_rgba(76,215,246,0.2)] group-hover:scale-110 group-hover:border-primary transition-all">
                1
              </div>
              <h3 className="font-headline-sm text-xl font-semibold text-on-surface">Choose Architecture</h3>
              <p className="font-body-md text-on-surface-variant max-w-[250px]">Select between DFA, NFA, PDA, or TM depending on the complexity of your language.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center border-2 border-secondary/30 text-secondary font-display-lg text-2xl font-bold shadow-[0_0_15px_rgba(221,184,255,0.2)] group-hover:scale-110 group-hover:border-secondary transition-all">
                2
              </div>
              <h3 className="font-headline-sm text-xl font-semibold text-on-surface">Design the Graph</h3>
              <p className="font-body-md text-on-surface-variant max-w-[250px]">Use the interactive canvas to drop states, connect transitions, and define acceptance rules.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center border-2 border-primary/30 text-primary font-display-lg text-2xl font-bold shadow-[0_0_15px_rgba(76,215,246,0.2)] group-hover:scale-110 group-hover:border-primary transition-all">
                3
              </div>
              <h3 className="font-headline-sm text-xl font-semibold text-on-surface">Simulate & Inspect</h3>
              <p className="font-body-md text-on-surface-variant max-w-[250px]">Run strings through the machine at custom speeds, watching memory stacks and tapes in real-time.</p>
            </div>

          </div>
        </div>

        {/* Question Solver Section */}
        <div id="question-solver" className="relative z-10 w-full max-w-[1000px] mx-auto mt-24 md:mt-32 border-t border-outline-variant/20 pt-16 text-center">
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-error/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-error/10 text-error mb-6 shadow-[0_0_15px_rgba(255,85,85,0.2)]">
            <span className="material-symbols-outlined text-[32px]">quiz</span>
          </div>
          
          <h2 className="font-headline-md text-3xl md:text-4xl font-semibold text-on-surface mb-6">TOC Question Solver</h2>
          <p className="font-body-md text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Stuck on a Theory of Computation assignment? Access our built-in library of challenging questions ranging from DFA design to Turing Machine computability, and get instant, visual step-by-step solutions.
          </p>
          
          <button 
            onClick={onOpenSolver} 
            className="bg-surface-container border border-outline-variant/50 text-on-surface hover:text-error hover:border-error/50 px-8 py-4 rounded-xl font-label-caps tracking-widest text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(255,85,85,0.2)] flex items-center justify-center gap-3 mx-auto active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">psychology</span>
            Launch Question Solver
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container/30 backdrop-blur-md border-t border-outline-variant/20 py-8 px-6 md:px-12 mt-auto relative z-20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-display-lg text-2xl font-bold text-on-surface tracking-tighter opacity-50">StateZio</div>
          <div className="font-body-md text-sm text-on-surface-variant/70 text-center md:text-left">
            &copy; {new Date().getFullYear()} StateZio Automata Simulator. Educational Open Source.
          </div>
          <div className="flex items-center gap-4">
            <div className="font-body-md text-sm text-on-surface-variant/70 mr-2 md:mr-4">
              Made by <a href="https://www.linkedin.com/in/shivakanth-m-701631380" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Shivakanth</a>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container hidden sm:block">
              <Code className="w-5 h-5" />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container hidden sm:block">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
