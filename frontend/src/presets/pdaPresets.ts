import { PDAMachine, PresetAutomata } from '../types/automata';

export const pdaAnBn: PresetAutomata = {
  id: 'pda_an_bn',
  name: 'aⁿ bⁿ (n ≥ 0)',
  module: 'Module 3',
  type: 'PDA',
  description: 'Deterministic Pushdown Automaton accepting L = { aⁿ bⁿ | n ≥ 0 } using stack counter.',
  machine: {
    type: 'PDA',
    name: 'aⁿ bⁿ (n ≥ 0)',
    inputAlphabet: ['a', 'b'],
    stackAlphabet: ['a', 'Z0'],
    initialStackSymbol: 'Z0',
    acceptanceMode: 'state',
    startState: 'q0',
    acceptStates: ['q3'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Push a)', isInitial: false, isAccept: false, x: 280, y: 220 },
      { id: 'q2', label: 'q2 (Pop a on b)', isInitial: false, isAccept: false, x: 460, y: 220 },
      { id: 'q3', label: 'q3 (Accept)', isInitial: false, isAccept: true, x: 640, y: 220 },
    ],
    transitions: [
      // q0: on 'a', Z0 -> aZ0 to q1, or on ε, Z0 -> Z0 to q3 (for n=0)
      { id: 't0_a', from: 'q0', to: 'q1', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' },
      { id: 't0_eps', from: 'q0', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      // q1: on 'a', a -> aa to q1, or on 'b', a -> ε to q2
      { id: 't1_a', from: 'q1', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aa' },
      { id: 't1_b', from: 'q1', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
      // q2: on 'b', a -> ε to q2, or on ε, Z0 -> Z0 to q3
      { id: 't2_b', from: 'q2', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't2_eps', from: 'q2', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  },
  testCases: [
    { input: '', expected: true },
    { input: 'ab', expected: true },
    { input: 'aabb', expected: true },
    { input: 'aaabbb', expected: true },
    { input: 'a', expected: false },
    { input: 'b', expected: false },
    { input: 'aab', expected: false },
    { input: 'abb', expected: false },
    { input: 'ba', expected: false },
  ],
};

export const pdaBalancedParens: PresetAutomata = {
  id: 'pda_balanced_parens',
  name: 'Balanced Parentheses ()',
  module: 'Module 3',
  type: 'PDA',
  description: 'PDA verifying well-formed balanced parentheses expressions over Σ = {(, )}.',
  machine: {
    type: 'PDA',
    name: 'Balanced Parentheses ()',
    inputAlphabet: ['(', ')'],
    stackAlphabet: ['(', 'Z0'],
    initialStackSymbol: 'Z0',
    acceptanceMode: 'state',
    startState: 'q0',
    acceptStates: ['q2'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 120, y: 220 },
      { id: 'q1', label: 'q1 (Matching)', isInitial: false, isAccept: false, x: 360, y: 220 },
      { id: 'q2', label: 'q2 (Accept)', isInitial: false, isAccept: true, x: 600, y: 220 },
    ],
    transitions: [
      { id: 'tp_0', from: 'q0', to: 'q1', inputSymbol: '(', popSymbol: 'Z0', pushSymbols: '(Z0' },
      { id: 'tp_0_empty', from: 'q0', to: 'q2', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      { id: 'tp_push_more', from: 'q1', to: 'q1', inputSymbol: '(', popSymbol: '(', pushSymbols: '((' },
      { id: 'tp_push_fresh', from: 'q1', to: 'q1', inputSymbol: '(', popSymbol: 'Z0', pushSymbols: '(Z0' },
      { id: 'tp_pop', from: 'q1', to: 'q1', inputSymbol: ')', popSymbol: '(', pushSymbols: 'ε' },
      { id: 'tp_done', from: 'q1', to: 'q2', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  },
  testCases: [
    { input: '', expected: true },
    { input: '()', expected: true },
    { input: '(())', expected: true },
    { input: '()()', expected: true },
    { input: '((()()))', expected: true },
    { input: '(', expected: false },
    { input: ')', expected: false },
    { input: ')(', expected: false },
    { input: '(()', expected: false },
  ],
};

export const pdaEvenPalindromes: PresetAutomata = {
  id: 'pda_even_palindromes',
  name: 'Even Palindromes w wᴿ',
  module: 'Module 3',
  type: 'PDA',
  description: 'Non-deterministic Pushdown Automaton accepting even-length palindromes over {a, b}.',
  machine: {
    type: 'PDA',
    name: 'Even Palindromes w wᴿ',
    inputAlphabet: ['a', 'b'],
    stackAlphabet: ['a', 'b', 'Z0'],
    initialStackSymbol: 'Z0',
    acceptanceMode: 'state',
    startState: 'q0',
    acceptStates: ['q2'],
    states: [
      { id: 'q0', label: 'q0 (Push Prefix)', isInitial: true, isAccept: false, x: 120, y: 220 },
      { id: 'q1', label: 'q1 (Pop Suffix)', isInitial: false, isAccept: false, x: 380, y: 220 },
      { id: 'q2', label: 'q2 (Accept)', isInitial: false, isAccept: true, x: 620, y: 220 },
    ],
    transitions: [
      // q0 push operations
      { id: 't_push_a_Z0', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' },
      { id: 't_push_b_Z0', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'Z0', pushSymbols: 'bZ0' },
      { id: 't_push_a_a', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aa' },
      { id: 't_push_a_b', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'b', pushSymbols: 'ab' },
      { id: 't_push_b_a', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ba' },
      { id: 't_push_b_b', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'bb' },
      // Non-deterministic midpoint guess
      { id: 't_guess_a', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'a', pushSymbols: 'a' },
      { id: 't_guess_b', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'b', pushSymbols: 'b' },
      { id: 't_guess_empty', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      // q1 matching pop
      { id: 't_match_a', from: 'q1', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't_match_b', from: 'q1', to: 'q1', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'ε' },
      // Final accept
      { id: 't_final', from: 'q1', to: 'q2', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  },
  testCases: [
    { input: '', expected: true },
    { input: 'aa', expected: true },
    { input: 'bb', expected: true },
    { input: 'abba', expected: true },
    { input: 'baab', expected: true },
    { input: 'aabbaa', expected: true },
    { input: 'a', expected: false },
    { input: 'ab', expected: false },
    { input: 'aba', expected: false },
    { input: 'abbb', expected: false },
  ],
};

export const pdaPresets: PresetAutomata[] = [
  pdaAnBn,
  pdaBalancedParens,
  pdaEvenPalindromes,
];
