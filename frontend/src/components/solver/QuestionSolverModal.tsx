import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  TOC_QUESTION_BANK,
  solveTOCQuestion,
} from '../../engine/questionSolverEngine';
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
  const [activeSolution, setActiveSolution] = useState<SolvedQuestionResult | null>(() => {
    return solveTOCQuestion('qb_dfa_ends_01');
  });

  const { loadSolvedMachine, setMachineType } = useAutomataStore();

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
    const solution = solveTOCQuestion(item.id);
    setActiveSolution(solution);
  };

  const handleSolveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    const solution = solveTOCQuestion(customPrompt);
    setActiveSolution(solution);
  };

  const handleLoadOnCanvas = () => {
    if (!activeSolution) return;

    // Set matching machine type in store
    setMachineType(activeSolution.machine.type);

    // Load full machine & test cases into store & canvas
    loadSolvedMachine(activeSolution.machine, activeSolution.testCases);

    // Close modal
    onClose();
  };

  const quickPrompts = [
    { label: 'Ends with "01"', q: 'Design a DFA that accepts strings ending with 01' },
    { label: 'Binary Mod 3', q: 'Construct a DFA accepting binary numbers divisible by 3' },
    { label: 'Even 0s & Odd 1s', q: 'Design a DFA for even number of 0s and odd number of 1s' },
    { label: 'PDA aⁿ bⁿ', q: 'Construct a PDA for the language L = { a^n b^n | n >= 0 }' },
    { label: 'TM Binary x+1', q: 'Design a Turing Machine for binary incrementer x+1' },
    { label: 'Contains "101"', q: 'Design a DFA for strings containing substring 101' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[88vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-800/20 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  TOC Question Solver & AI Assistant
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  Instant Synthesizer
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ask any Theory of Computation question, view formal 5-tuple proofs, and load directly onto the canvas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Prompt Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-col gap-2.5">
          <form onSubmit={handleSolveCustom} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask any TOC problem: e.g. 'Design a DFA for binary divisible by 3' or 'Construct PDA for a^n b^n'..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Solve Question</span>
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Examples:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomPrompt(p.q);
                  const sol = solveTOCQuestion(p.q);
                  setActiveSolution(sol);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split View (Question Bank Left, Solution Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Question Bank */}
          <div className="w-[380px] border-r border-slate-200 bg-slate-50/50 flex flex-col">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-slate-200 flex gap-1 bg-slate-100/70 overflow-x-auto">
              {(['ALL', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {cat === 'ALL' ? 'All Questions' : cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
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
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {item.question}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{item.module}</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold group">
                        Solve <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Formal Solution & Walkthrough */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {activeSolution ? (
              <>
                {/* Solution Title & Action Header */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {activeSolution.machineType}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {activeSolution.module}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium ml-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Formal Construction
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeSolution.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-mono">
                      {activeSolution.formalDefinition}
                    </p>
                  </div>

                  <button
                    onClick={handleLoadOnCanvas}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Load onto Canvas & Simulate</span>
                  </button>
                </div>

                {/* Formal 5-Tuple / 7-Tuple Definition */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> Formal Mathematical Definition (Tuples)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">States (Q)</div>
                      <div className="text-xs font-mono font-bold text-emerald-900 mt-1">
                        {'{' + activeSolution.formalTuples.states.join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Alphabet (Σ)</div>
                      <div className="text-xs font-mono font-bold text-teal-800 mt-1">
                        {'{' + activeSolution.formalTuples.alphabet.join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Start State (q₀)</div>
                      <div className="text-xs font-mono font-bold text-amber-700 mt-1">
                        {activeSolution.formalTuples.startState}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Accept States (F)</div>
                      <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                        {'{' + activeSolution.formalTuples.acceptStates.join(', ') + '}'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* State Meanings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" /> State Meaning & Invariants
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSolution.stateMeanings.map((sm, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                      >
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-bold shrink-0">
                          {sm.stateId}
                        </span>
                        <div className="text-xs text-slate-700 leading-relaxed">
                          {sm.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Construction Walkthrough */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5 text-emerald-700" /> Construction Logic & Walkthrough
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    {activeSolution.constructionSteps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Cases Suite */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Generated Test Cases Suite ({activeSolution.testCases.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSolution.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {tc.expected ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className="font-mono text-xs font-bold text-slate-800 truncate">
                            "{tc.input || 'ε'}"
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 text-right truncate">
                          {tc.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Sparkles className="w-12 h-12 text-slate-300 animate-pulse" />
                <p className="text-sm">Select a question or ask any custom Theory of Computation problem.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
