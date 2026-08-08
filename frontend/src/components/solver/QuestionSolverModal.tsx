import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  Play,
  Layers,
  Disc3,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Key,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  TOC_QUESTION_BANK,
  solveTOCQuestion,
} from '../../engine/questionSolverEngine';
import {
  solveQuestionWithGemini,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
} from '../../services/geminiSolverService';
import {
  SolvedQuestionResult,
  QuestionBankItem,
  QuestionCategory,
} from '../../types/automata';
import { useAutomataStore } from '../../store/useAutomataStore';

interface QuestionSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionSolverModal: React.FC<QuestionSolverModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [engineMode, setEngineMode] = useState<'LOCAL' | 'GEMINI'>('LOCAL');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeSolution, setActiveSolution] = useState<SolvedQuestionResult | null>(() => {
    return solveTOCQuestion('qb_dfa_ends_01');
  });

  const { loadSolvedMachine, setMachineType } = useAutomataStore();

  useEffect(() => {
    const existing = getStoredGeminiApiKey();
    setHasApiKey(Boolean(existing));
    if (existing) {
      setApiKeyInput(existing);
    }
  }, [isOpen]);

  // Filter question bank items
  const filteredQuestions = useMemo(() => {
    return TOC_QUESTION_BANK.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectQuestion = (item: QuestionBankItem) => {
    setCustomPrompt(item.question);
    setErrorMessage(null);
    const solution = solveTOCQuestion(item.id);
    setActiveSolution(solution);
  };

  const handleSolveCustom = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;

    setErrorMessage(null);

    if (engineMode === 'LOCAL') {
      const solution = solveTOCQuestion(customPrompt);
      setActiveSolution(solution);
      return;
    }

    // Gemini Mode
    const key = getStoredGeminiApiKey();
    if (!key) {
      setShowKeyModal(true);
      return;
    }

    setIsLoading(true);
    setLoadingStep('Connecting to Google Gemini AI...');

    try {
      setTimeout(() => setLoadingStep('Synthesizing state transitions & 5-tuple...'), 800);
      setTimeout(() => setLoadingStep('Running local verification & simulation tests...'), 1600);

      const solution = await solveQuestionWithGemini(customPrompt, key);
      setActiveSolution(solution);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate solution with Gemini AI.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveStoredGeminiApiKey(apiKeyInput.trim());
      setHasApiKey(true);
      setShowKeyModal(false);
      setErrorMessage(null);
      if (customPrompt.trim()) {
        handleSolveCustom();
      }
    }
  };

  const handleLoadOnCanvas = () => {
    if (!activeSolution) return;

    // Set matching machine type in store
    setMachineType(activeSolution.machine.type);

    // Load full machine & test cases into store & canvas + auto-runs first simulation test
    loadSolvedMachine(activeSolution.machine, activeSolution.testCases);

    // Close modal
    onClose();
  };

  const quickPrompts = [
    { label: 'Starts with "01"', q: 'Design a DFA that accepts strings starting with 01' },
    { label: 'Ends with "01"', q: 'Design a DFA that accepts strings ending with 01' },
    { label: 'Does NOT contain "00"', q: 'Design a DFA that does not contain 00' },
    { label: 'Binary Mod 3', q: 'Construct a DFA accepting binary numbers divisible by 3' },
    { label: 'Even 0s & Odd 1s', q: 'Design a DFA for even number of 0s and odd number of 1s' },
    { label: 'PDA aⁿ bⁿ', q: 'Construct a PDA for the language L = { a^n b^n | n >= 0 }' },
    { label: 'TM Binary x+1', q: 'Design a Turing Machine for binary incrementer x+1' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-6xl h-[88vh] bg-[#1C1313] border border-sky-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* API Key Modal / Popover */}
        {showKeyModal && (
          <div className="absolute inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#241919] border border-sky-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-base">
                  <Bot className="w-5 h-5" />
                  <span>Google Gemini API Key</span>
                </div>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your free Google Gemini API key to solve <strong>any Theory of Computation problem</strong> with automated verification.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">Gemini API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 bg-[#140D0D] border border-sky-500/40 rounded-xl text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
                >
                  Get free key from Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#1C1313] hover:bg-[#3D2C2C] text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-sky-950/50 transition-all"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-500/20 bg-[#271C1C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-950/50 text-white">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  TOC Question Solver & AI Assistant
                </h2>
                
                {/* Engine Selector */}
                <div className="flex items-center bg-[#140D0D] border border-sky-500/30 rounded-lg p-0.5 ml-2">
                  <button
                    onClick={() => setEngineMode('LOCAL')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      engineMode === 'LOCAL'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Local Synthesizer
                  </button>
                  <button
                    onClick={() => {
                      setEngineMode('GEMINI');
                      if (!hasApiKey) setShowKeyModal(true);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      engineMode === 'GEMINI'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bot className="w-3 h-3" /> Gemini AI
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Ask any Theory of Computation question, view formal 5-tuple proofs, and load directly onto the simulation canvas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configure Gemini API Key"
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasApiKey
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-[#1C1313] border-sky-500/30 text-slate-400 hover:text-white hover:bg-[#3D2C2C]'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini Key Configured' : 'Set Gemini Key'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1C1313] hover:bg-[#3D2C2C] border border-sky-500/30 text-slate-400 hover:text-white transition-colors shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Prompt Bar */}
        <div className="px-6 py-3 border-b border-sky-500/20 bg-[#161111] flex flex-col gap-2.5">
          <form onSubmit={handleSolveCustom} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={
                  engineMode === 'GEMINI'
                    ? "Ask Gemini AI any TOC problem: e.g. 'DFA with at most two 0s' or '2-tape TM for string copy'..."
                    : "Ask any TOC problem: e.g. 'Design a DFA starting with 01' or 'Construct PDA for a^n b^n'..."
                }
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d1017] border border-sky-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shadow-sky-950/40 flex items-center gap-2 transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
                engineMode === 'GEMINI'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{engineMode === 'GEMINI' ? 'Solve with Gemini' : 'Solve Question'}</span>
                </>
              )}
            </button>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => {
                  setEngineMode('LOCAL');
                  setErrorMessage(null);
                  handleSolveCustom();
                }}
                className="px-2 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-[11px] font-bold text-white transition-colors"
              >
                Use Local Synthesizer Instead
              </button>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Examples:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomPrompt(p.q);
                  setErrorMessage(null);
                  if (engineMode === 'LOCAL') {
                    const sol = solveTOCQuestion(p.q);
                    setActiveSolution(sol);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-[#271C1C] hover:bg-[#3D2C2C] border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-white text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split View (Question Bank Left, Solution Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Question Bank */}
          <div className="w-[380px] border-r border-sky-500/20 bg-[#120D0D] flex flex-col">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-sky-500/20 flex gap-1 bg-[#1C1313] overflow-x-auto">
              {(['ALL', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-sky-400 text-[#1C1313] shadow-xs'
                      : 'text-sky-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat === 'ALL' ? 'All Questions' : cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#120D0D]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Exam Question Bank ({filteredQuestions.length})
              </div>

              {filteredQuestions.map((item) => {
                const isSelected = activeSolution?.id.includes(item.id.replace('qb_', ''));
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectQuestion(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#271C1C] border-sky-400 shadow-md ring-1 ring-sky-400/60'
                        : 'bg-[#1C1313] border-sky-500/30 hover:border-sky-400 hover:bg-[#221717] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : item.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {item.question}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-mono text-sky-300 font-bold">{item.category}</span>
                      <span className="flex items-center gap-1 text-sky-400 font-semibold group">
                        Solve <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Formal Solution & Walkthrough */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#161111] relative">
            {isLoading && (
              <div className="absolute inset-0 bg-[#161111]/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-10">
                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                <p className="text-sm font-semibold text-white">{loadingStep}</p>
                <p className="text-xs text-slate-400">Synthesizing state machine and running validation tests...</p>
              </div>
            )}

            {activeSolution ? (
              <>
                {/* Solution Title & Action Header */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#241919] border border-sky-500/30 shadow-md">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        {activeSolution.machineType}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium ml-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Formal Construction (Score: {Math.round((activeSolution.confidenceScore ?? 1) * 100)}%)
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {activeSolution.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">
                      {activeSolution.formalDefinition}
                    </p>
                  </div>

                  <button
                    onClick={handleLoadOnCanvas}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-950/50 flex items-center gap-2 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Load onto Canvas & Simulate Tests</span>
                  </button>
                </div>

                {/* Formal 5-Tuple / 7-Tuple Definition */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Formal Mathematical Definition (Tuples)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[#241919] border border-sky-500/30">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">States (Q)</div>
                      <div className="text-xs font-mono font-bold text-sky-300 mt-1 truncate">
                        {'{' + activeSolution.formalTuples.states.join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#241919] border border-sky-500/30">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Alphabet (Σ)</div>
                      <div className="text-xs font-mono font-bold text-teal-300 mt-1 truncate">
                        {'{' + (activeSolution.formalTuples.alphabet || ['0', '1']).join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#241919] border border-sky-500/30">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Start State (q₀)</div>
                      <div className="text-xs font-mono font-bold text-amber-300 mt-1 truncate">
                        {activeSolution.formalTuples.startState}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#241919] border border-sky-500/30">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Accept States (F)</div>
                      <div className="text-xs font-mono font-bold text-emerald-300 mt-1 truncate">
                        {'{' + activeSolution.formalTuples.acceptStates.join(', ') + '}'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* State Meanings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> State Meaning & Invariants
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSolution.stateMeanings.map((sm, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#241919] border border-sky-500/30 flex items-start gap-3"
                      >
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-xs font-bold shrink-0">
                          {sm.stateId}
                        </span>
                        <div className="text-xs text-slate-300 leading-relaxed">
                          {sm.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Construction Walkthrough */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5" /> Construction Logic & Walkthrough
                  </h4>
                  <div className="p-4 rounded-xl bg-[#241919] border border-sky-500/30 space-y-2">
                    {activeSolution.constructionSteps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Cases Suite */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Generated Test Cases Suite ({activeSolution.testCases.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSolution.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#241919] border border-sky-500/30 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {tc.expected ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span className="font-mono text-xs font-bold text-white truncate">
                            "{tc.input || 'ε'}"
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 text-right truncate">
                          {tc.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <Sparkles className="w-12 h-12 text-slate-600 animate-pulse" />
                <p className="text-sm">Select a question or ask any custom Theory of Computation problem.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

