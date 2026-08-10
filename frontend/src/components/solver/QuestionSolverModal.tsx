import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  BookOpen,
  Play,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Info,
  Cpu,
  FlaskConical,
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

// ── Supported patterns guide data ────────────────────────────────────────────
const PATTERN_GUIDE = [
  {
    category: 'DFA Patterns',
    color: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-300 dark:border-sky-500/30',
    bg: 'bg-sky-500/10',
    icon: '🔵',
    patterns: [
      { label: 'Ends with a pattern', example: 'Design a DFA that accepts strings ending with 01' },
      { label: 'Starts with a pattern', example: 'Design a DFA that accepts strings starting with 10' },
      { label: 'Contains a substring', example: 'Construct a DFA containing the substring 101' },
      { label: 'Does NOT contain', example: 'DFA for strings that do not contain 00' },
      { label: 'Even / Odd length', example: 'DFA accepting strings of even length' },
      { label: 'Divisible by N (binary)', example: 'DFA accepting binary numbers divisible by 3' },
      { label: 'Parity of 0s and 1s', example: 'DFA for even number of 0s and odd number of 1s' },
      { label: 'Exactly N occurrences', example: 'DFA for strings with exactly two 0s' },
      { label: 'At least N occurrences', example: 'DFA for strings with at least three 1s' },
      { label: 'At most N occurrences', example: 'DFA for strings with at most one 0' },
      { label: 'No consecutive same symbol', example: 'DFA where no two consecutive 0s appear' },
    ],
  },
  {
    category: 'NFA Patterns',
    color: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/10',
    icon: '🟢',
    patterns: [
      { label: 'Kth symbol from end', example: 'NFA where 3rd symbol from the end is 1' },
      { label: 'Ends with pattern (NFA)', example: 'NFA accepting strings ending with 01' },
      { label: 'Kth from end is 0', example: 'NFA where 2nd symbol from end is 0' },
      { label: '5th from end', example: 'NFA where 5th symbol from end is 1' },
    ],
  },
  {
    category: 'PDA Patterns',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    icon: '🟡',
    patterns: [
      { label: 'Equal counts (aⁿbⁿ)', example: 'Construct a PDA for the language a^n b^n' },
      { label: 'Double counts (aⁿb²ⁿ)', example: 'PDA for strings of the form a^n b^2n' },
      { label: 'Palindromes', example: 'Design a PDA for palindromes over {a,b}' },
      { label: 'Balanced brackets', example: 'PDA for balanced parentheses' },
      { label: 'Equal a and b counts', example: 'PDA where number of a equals number of b' },
    ],
  },
  {
    category: 'Turing Machine Patterns',
    color: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    icon: '🟣',
    patterns: [
      { label: 'Binary increment', example: 'Design a Turing Machine for binary increment x+1' },
      { label: "1's complement", example: "Turing Machine for 1's complement of binary string" },
      { label: 'aⁿbⁿcⁿ recognizer', example: 'Turing Machine for the language a^n b^n c^n' },
      { label: '0ⁿ1ⁿ recognizer', example: 'TM accepting strings 0^n 1^n' },
    ],
  },
];

export const QuestionSolverModal: React.FC<QuestionSolverModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedGuideCategory, setExpandedGuideCategory] = useState<string | null>('DFA Patterns');

  const [activeSolution, setActiveSolution] = useState<SolvedQuestionResult | null>(() => {
    return solveTOCQuestion('qb_dfa_ends_01');
  });

  // Debounced search to avoid filtering 800 items on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const { loadSolvedMachine, setMachineType } = useAutomataStore();

  // Pattern detection — same regexes as solver engine so error is accurate
  const hasKnownPattern = (prompt: string): boolean => {
    const query = prompt.trim().toLowerCase();
    return (
      /(?:starts?\s+(?:with|in)|begins?\s+with|starting\s+with)\s+["']?([01ab]+)["']?/i.test(query) ||
      /(?:not\s+contain(?:ing)?|does\s+not\s+contain|without)\s+["']?([01ab]+)["']?/i.test(query) ||
      /(?:ends?\s+(?:with|in)|ending\s+(?:with|in))\s+["']?([01ab]+)["']?/i.test(query) ||
      /(?:divisible\s+by|mod(?:ulo)?|multiple\s+of)\s+(\d+)/i.test(query) ||
      /(?:contains?|substring|having)\s+["']?([01ab]+)["']?/i.test(query) ||
      /(?:exactly|at\s+least|at\s+most)\s+\d+/i.test(query) ||
      /(?:even|odd)\s+(?:length|number|count)/i.test(query) ||
      /length\s+(?:divisible|mod|modulo)/i.test(query) ||
      /no\s+(?:two\s+)?consecutive/i.test(query) ||
      /(?:\d+)(?:st|nd|rd|th)\s+(?:symbol|char|character)\s+from\s+(?:the\s+)?end/i.test(query) ||
      query.includes('even') || query.includes('odd') ||
      query.includes('pda') || query.includes('pushdown') ||
      query.includes('palindrome') || query.includes('balanced') ||
      query.includes('tm') || query.includes('turing') ||
      query.includes('increment') || query.includes('complement') ||
      query.includes('a^n') || query.includes('an bn') || query.includes('0^n') ||
      TOC_QUESTION_BANK.some(q =>
        q.id === prompt || q.question.toLowerCase() === query || q.title.toLowerCase() === query
      ) ||
      TOC_QUESTION_BANK.some(q =>
        q.question.toLowerCase().split(/\s+/).filter(w => w.length > 3 && query.includes(w)).length >= 2
      )
    );
  };

  const filteredQuestions = useMemo(() => {
    return TOC_QUESTION_BANK.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !debouncedSearch ||
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.question.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, debouncedSearch]);

  if (!isOpen) return null;

  const handleSelectQuestion = (item: QuestionBankItem) => {
    setCustomPrompt(item.question);
    setErrorMessage(null);
    const solution = solveTOCQuestion(item.id);
    setActiveSolution(solution);
  };

  const handleSolve = (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const prompt = overridePrompt !== undefined ? overridePrompt : customPrompt;
    if (!prompt.trim()) return;
    setErrorMessage(null);

    if (!hasKnownPattern(prompt)) {
      setErrorMessage(
        'This question pattern is not recognized. Please use one of the supported formats shown in the "Supported Patterns" guide above, or pick a question from the bank on the left.'
      );
      return;
    }

    const solution = solveTOCQuestion(prompt);
    setActiveSolution(solution);
  };

  const handleLoadOnCanvas = () => {
    if (!activeSolution) return;
    loadSolvedMachine(activeSolution.machine, activeSolution.testCases);
    onClose();
  };

  const quickPrompts = [
    { label: 'Starts with "01"', q: 'Design a DFA that accepts strings starting with 01' },
    { label: 'Ends with "01"', q: 'Design a DFA that accepts strings ending with 01' },
    { label: 'Contains "101"', q: 'Construct a DFA containing the substring 101' },
    { label: 'NOT contain "00"', q: 'DFA for strings that do not contain 00' },
    { label: 'Even length', q: 'DFA accepting strings of even length' },
    { label: 'Odd length', q: 'DFA accepting strings of odd length' },
    { label: 'Binary Mod 3', q: 'DFA accepting binary numbers divisible by 3' },
    { label: 'Even 0s & Odd 1s', q: 'DFA for even number of 0s and odd number of 1s' },
    { label: 'At least two 1s', q: 'DFA for strings with at least two 1s' },
    { label: 'Exactly one 0', q: 'DFA for strings with exactly one 0' },
    { label: '3rd from end = 1', q: 'NFA where 3rd symbol from the end is 1' },
    { label: 'PDA aⁿbⁿ', q: 'Construct a PDA for the language a^n b^n where n >= 0' },
    { label: 'PDA Palindromes', q: 'Design a PDA for palindromes over the alphabet {a,b}' },
    { label: 'TM Binary x+1', q: 'Design a Turing Machine for binary increment x+1' },
  ];

  const categoryStats = {
    ALL: TOC_QUESTION_BANK.length,
    DFA: TOC_QUESTION_BANK.filter(q => q.category === 'DFA').length,
    NFA: TOC_QUESTION_BANK.filter(q => q.category === 'NFA').length,
    PDA: TOC_QUESTION_BANK.filter(q => q.category === 'PDA').length,
    TM: TOC_QUESTION_BANK.filter(q => q.category === 'TM').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-6xl h-[90vh] bg-sky-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-200 dark:border-sky-500/20 bg-sky-200 dark:bg-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-950/50">
              <Cpu className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">TOC Question Solver</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ⚡ 100% Offline
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40">
                  {TOC_QUESTION_BANK.length} Questions
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Instantly synthesize verified automata — no API key, no internet required.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-sky-50 dark:bg-slate-950 hover:bg-sky-300 dark:hover:bg-slate-800 border border-sky-300 dark:border-sky-500/30 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Supported Patterns Collapsible Guide ───────────────────────────── */}
        <div className="px-6 py-2.5 border-b border-sky-200 dark:border-sky-500/20 bg-slate-100 dark:bg-slate-950 shrink-0">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:text-sky-200 transition-colors cursor-pointer py-0.5"
          >
            <span className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              What can the solver handle? — Supported question patterns &amp; how to write them
            </span>
            {showGuide ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showGuide && (
            <div className="mt-3 grid grid-cols-2 gap-3 pb-2">
              {PATTERN_GUIDE.map((group) => (
                <div key={group.category} className={`rounded-xl border ${group.border} ${group.bg} overflow-hidden`}>
                  <button
                    onClick={() => setExpandedGuideCategory(
                      expandedGuideCategory === group.category ? null : group.category
                    )}
                    className="w-full flex items-center justify-between px-3 py-2 cursor-pointer"
                  >
                    <span className={`text-xs font-bold ${group.color} flex items-center gap-1.5`}>
                      {group.icon} {group.category}
                    </span>
                    {expandedGuideCategory === group.category
                      ? <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      : <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
                  </button>
                  {expandedGuideCategory === group.category && (
                    <div className="px-3 pb-3 space-y-1.5">
                      {group.patterns.map((p, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className={`text-[11px] font-semibold ${group.color}`}>{p.label}</div>
                          <button
                            onClick={() => {
                              setCustomPrompt(p.example);
                              setErrorMessage(null);
                              handleSolve(undefined, p.example);
                            }}
                            className="text-[10px] text-slate-700 dark:text-slate-300 italic hover:text-slate-900 dark:text-white transition-colors text-left cursor-pointer leading-relaxed"
                            title="Click to solve this example"
                          >
                            "{p.example}" →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Search & Solve Bar ────────────────────────────────────────────── */}
        <div className="px-6 py-3 border-b border-sky-200 dark:border-sky-500/20 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2.5 shrink-0">
          <form onSubmit={handleSolve} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400" />
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => { setCustomPrompt(e.target.value); setErrorMessage(null); }}
                placeholder="Type a TOC question e.g. 'DFA accepting strings ending with 01' or 'PDA for a^n b^n'..."
                maxLength={500}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-slate-900 dark:text-white text-xs font-bold shadow-md shadow-sky-200 dark:shadow-sky-950/40 flex items-center gap-2 transition-all shrink-0 cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>Solve</span>
            </button>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="px-3 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-500/40 text-amber-700 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-0.5">Pattern not recognized</div>
                <div className="text-amber-700 dark:text-amber-200/80">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1 shrink-0">
              <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Quick:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomPrompt(p.q);
                  setErrorMessage(null);
                  handleSolve(undefined, p.q);
                }}
                className="px-2.5 py-1 rounded-lg bg-sky-200 dark:bg-slate-800 hover:bg-sky-300 dark:hover:bg-slate-800 border border-sky-300 dark:border-sky-500/30 hover:border-sky-400 text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap shadow-xs cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body: Question Bank Left | Solution Right ──────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Left: Question Bank */}
          <div className="w-full md:w-[360px] border-b md:border-b-0 md:border-r border-sky-200 dark:border-sky-500/20 bg-slate-100 dark:bg-slate-900 flex flex-col shrink-0 max-h-[40vh] md:max-h-full">
            {/* Category Filter */}
            <div className="p-3 border-b border-sky-200 dark:border-sky-500/20 flex gap-1 bg-sky-50 dark:bg-slate-950 overflow-x-auto shrink-0">
              {(['ALL', 'DFA', 'NFA', 'PDA', 'TM'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'bg-sky-400 text-white dark:text-[#1C1313] shadow-xs'
                      : 'text-sky-800 dark:text-sky-200 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-50/10'
                  }`}
                >
                  {cat === 'ALL' ? 'All' : cat}
                  <span className={`font-mono ${selectedCategory === cat ? 'text-white dark:text-[#1C1313]/70' : 'text-slate-500'}`}>
                    {categoryStats[cat]}
                  </span>
                </button>
              ))}

              {/* Search within list */}
              <div className="relative flex-1 min-w-[80px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter..."
                  aria-label="Filter questions"
                  role="searchbox"
                  className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 focus:border-sky-500 rounded-lg text-[11px] text-slate-900 dark:text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </div>

              {filteredQuestions.map((item) => {
                const isSelected = activeSolution?.id === 'sol_' + item.id.replace('qb_', '') || activeSolution?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectQuestion(item)}
                    aria-label={`Load question: ${item.title}`}
                    aria-pressed={isSelected}
                    className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-200 dark:bg-slate-800 border-sky-400 shadow-md ring-1 ring-sky-400/60'
                        : 'bg-sky-50 dark:bg-slate-950 border-sky-300 dark:border-sky-500/30 hover:border-sky-400 hover:bg-sky-100 dark:bg-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate pr-2">{item.title}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
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

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-1.5 leading-relaxed">
                      {item.question}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-mono text-sky-700 dark:text-sky-300 font-bold">{item.category}</span>
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                        Solve <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No matching questions found.
                </div>
              )}
            </div>
          </div>

          {/* Right: Solution Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50 dark:bg-slate-900">
            {activeSolution ? (
              <>
                {/* Solution Header */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30 shadow-md">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40">
                        {activeSolution.machineType}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Formally Verified (Score: {Math.round((activeSolution.confidenceScore ?? 1) * 100)}%)
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeSolution.title}</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-mono">{activeSolution.formalDefinition}</p>
                  </div>

                  <button
                    onClick={handleLoadOnCanvas}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-900 dark:text-white text-xs font-bold shadow-md shadow-sky-950/50 flex items-center gap-2 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Load onto Canvas</span>
                  </button>
                </div>

                {/* Formal Tuples */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Formal Mathematical Definition
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30">
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">States (Q)</div>
                      <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 mt-1 truncate" title={'{' + activeSolution.formalTuples.states.join(', ') + '}'}>
                        {'{' + activeSolution.formalTuples.states.join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30">
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Alphabet (Σ)</div>
                      <div className="text-xs font-mono font-bold text-teal-300 mt-1 truncate">
                        {'{' + (activeSolution.formalTuples.alphabet || ['0', '1']).join(', ') + '}'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30">
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Start State (q₀)</div>
                      <div className="text-xs font-mono font-bold text-amber-300 mt-1 truncate">
                        {activeSolution.formalTuples.startState}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30">
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold">Accept States (F)</div>
                      <div className="text-xs font-mono font-bold text-emerald-300 mt-1 truncate">
                        {'{' + activeSolution.formalTuples.acceptStates.join(', ') + '}'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language Description */}
                <div className="p-4 rounded-xl bg-slate-950 border border-sky-200 dark:border-sky-500/20">
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1">Language Description</div>
                  <div className="text-sm font-mono text-sky-800 dark:text-sky-200">{activeSolution.languageDescription}</div>
                  {activeSolution.regularExpressionOrGrammar && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Regex / Grammar: <span className="font-mono text-teal-300">{activeSolution.regularExpressionOrGrammar}</span>
                    </div>
                  )}
                </div>

                {/* State Meanings */}
                {activeSolution.stateMeanings && activeSolution.stateMeanings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">State Invariants</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeSolution.stateMeanings.map((sm) => (
                        <div key={sm.stateId} className="p-2.5 rounded-xl bg-sky-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-500/20 flex gap-2.5">
                          <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 shrink-0 mt-0.5">{sm.label}</span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{sm.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Construction Steps */}
                {activeSolution.constructionSteps && activeSolution.constructionSteps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Step-by-Step Construction
                    </h4>
                    <div className="space-y-1.5">
                      {activeSolution.constructionSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="text-sky-600 dark:text-sky-400 font-mono font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Cases */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Verification Test Cases</h4>
                  <div className="space-y-1.5">
                    {activeSolution.testCases.map((tc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-sky-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-500/20 text-xs font-mono">
                        <span className={`shrink-0 font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                          tc.expected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}>
                          {tc.expected ? 'ACCEPT' : 'REJECT'}
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">
                          {tc.input === '' ? '(empty string ε)' : `"${tc.input}"`}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 text-[11px] font-sans">{tc.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transition Table */}
                {activeSolution.formalTuples.transitionTable && activeSolution.formalTuples.transitionTable.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Transition Function δ</h4>
                    <div className="overflow-x-auto rounded-xl border border-sky-200 dark:border-sky-500/20">
                      <table className="w-full text-xs font-mono">
                        <thead className="bg-sky-100 dark:bg-slate-900 text-sky-800 dark:text-sky-200 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-2 px-3 text-left">From State</th>
                            <th className="py-2 px-3 text-left">Read</th>
                            <th className="py-2 px-3 text-left">To State</th>
                            {activeSolution.formalTuples.transitionTable[0]?.popOrWrite && (
                              <th className="py-2 px-3 text-left">Pop/Write</th>
                            )}
                            {activeSolution.formalTuples.transitionTable[0]?.pushOrMove && (
                              <th className="py-2 px-3 text-left">Push/Move</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-500/10">
                          {activeSolution.formalTuples.transitionTable.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                              <td className="py-1.5 px-3 text-sky-700 dark:text-sky-300 font-semibold">{row.from}</td>
                              <td className="py-1.5 px-3 text-teal-300">{row.read || 'ε'}</td>
                              <td className="py-1.5 px-3 text-sky-700 dark:text-sky-300 font-semibold">{row.to}</td>
                              {row.popOrWrite && <td className="py-1.5 px-3 text-amber-300">{row.popOrWrite}</td>}
                              {row.pushOrMove && <td className="py-1.5 px-3 text-purple-300">{row.pushOrMove}</td>}
                            </tr>
                          ))}
                          {activeSolution.formalTuples.transitionTable.length > 20 && (
                            <tr>
                              <td colSpan={5} className="py-1.5 px-3 text-slate-500 text-center text-[10px]">
                                ... and {activeSolution.formalTuples.transitionTable.length - 20} more transitions
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <Cpu className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Select a question or type a problem above</p>
                <p className="text-xs mt-1">The formal solution will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
