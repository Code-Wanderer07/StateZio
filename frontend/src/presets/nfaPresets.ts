import { NFAMachine, PresetAutomata } from '../types/automata';

export const nfaContains101: PresetAutomata = {
  id: 'nfa_contains_101',
  name: 'Contains Substring "101"',
  module: 'Module 1',
  type: 'NFA',
  description: 'NFA that non-deterministically guesses when substring "101" begins.',
  machine: {
    type: 'NFA',
    name: 'Contains "101"',
    alphabet: ['0', '1'],
    startState: 'q0',
    acceptStates: ['q3'],
    states: [
      { id: 'q0', label: 'q0 (Scan)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Read 1)', isInitial: false, isAccept: false, x: 260, y: 220 },
      { id: 'q2', label: 'q2 (Read 10)', isInitial: false, isAccept: false, x: 420, y: 220 },
      { id: 'q3', label: 'q3 (Accept 101)', isInitial: false, isAccept: true, x: 580, y: 220 },
    ],
    transitions: [
      { id: 't0_0', from: 'q0', to: 'q0', symbol: '0' },
      { id: 't0_1', from: 'q0', to: 'q0', symbol: '1' },
      { id: 't0_match1', from: 'q0', to: 'q1', symbol: '1' },
      { id: 't1_match0', from: 'q1', to: 'q2', symbol: '0' },
      { id: 't2_match1', from: 'q2', to: 'q3', symbol: '1' },
      { id: 't3_0', from: 'q3', to: 'q3', symbol: '0' },
      { id: 't3_1', from: 'q3', to: 'q3', symbol: '1' },
    ],
  },
  testCases: [
    { input: '101', expected: true },
    { input: '0010100', expected: true },
    { input: '11101', expected: true },
    { input: '10101', expected: true },
    { input: '000', expected: false },
    { input: '1100', expected: false },
    { input: '1001', expected: false },
  ],
};

export const nfaWithEpsilon: PresetAutomata = {
  id: 'nfa_with_epsilon',
  name: 'NFA with ε-Transitions (a*b | b*a)',
  module: 'Module 1',
  type: 'NFA',
  description: 'NFA using ε-transitions to branch into two sub-machines: strings of form a*b or b*a.',
  machine: {
    type: 'NFA',
    name: 'a*b | b*a (with ε)',
    alphabet: ['a', 'b'],
    startState: 'q0',
    acceptStates: ['q2', 'q4'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 240 },
      { id: 'q1', label: 'q1 (Branch A)', isInitial: false, isAccept: false, x: 280, y: 140 },
      { id: 'q2', label: 'q2 (Accept a*b)', isInitial: false, isAccept: true, x: 480, y: 140 },
      { id: 'q3', label: 'q3 (Branch B)', isInitial: false, isAccept: false, x: 280, y: 340 },
      { id: 'q4', label: 'q4 (Accept b*a)', isInitial: false, isAccept: true, x: 480, y: 340 },
    ],
    transitions: [
      { id: 't_eps1', from: 'q0', to: 'q1', symbol: 'ε' },
      { id: 't_eps2', from: 'q0', to: 'q3', symbol: 'ε' },
      { id: 't_q1_a', from: 'q1', to: 'q1', symbol: 'a' },
      { id: 't_q1_b', from: 'q1', to: 'q2', symbol: 'b' },
      { id: 't_q3_b', from: 'q3', to: 'q3', symbol: 'b' },
      { id: 't_q3_a', from: 'q3', to: 'q4', symbol: 'a' },
    ],
  },
  testCases: [
    { input: 'b', expected: true },
    { input: 'a', expected: true },
    { input: 'aaab', expected: true },
    { input: 'bbba', expected: true },
    { input: 'ab', expected: true },
    { input: 'ba', expected: true },
    { input: 'aba', expected: false },
    { input: 'bab', expected: false },
    { input: '', expected: false },
  ],
};

export const nfaThirdFromEndIs1: PresetAutomata = {
  id: 'nfa_third_from_end_1',
  name: 'Third symbol from end is 1',
  module: 'Module 1',
  type: 'NFA',
  description: 'Classic NFA showing powerset construction efficiency. Accepts binary strings whose 3rd symbol from the end is 1.',
  machine: {
    type: 'NFA',
    name: '3rd from end is 1',
    alphabet: ['0', '1'],
    startState: 'q0',
    acceptStates: ['q3'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (2 left)', isInitial: false, isAccept: false, x: 260, y: 220 },
      { id: 'q2', label: 'q2 (1 left)', isInitial: false, isAccept: false, x: 420, y: 220 },
      { id: 'q3', label: 'q3 (Accept)', isInitial: false, isAccept: true, x: 580, y: 220 },
    ],
    transitions: [
      { id: 't0_0', from: 'q0', to: 'q0', symbol: '0' },
      { id: 't0_1', from: 'q0', to: 'q0', symbol: '1' },
      { id: 't0_1_step', from: 'q0', to: 'q1', symbol: '1' },
      { id: 't1_0', from: 'q1', to: 'q2', symbol: '0' },
      { id: 't1_1', from: 'q1', to: 'q2', symbol: '1' },
      { id: 't2_0', from: 'q2', to: 'q3', symbol: '0' },
      { id: 't2_1', from: 'q2', to: 'q3', symbol: '1' },
    ],
  },
  testCases: [
    { input: '100', expected: true },
    { input: '101', expected: true },
    { input: '111', expected: true },
    { input: '0101', expected: true },
    { input: '11000', expected: true },
    { input: '000', expected: false },
    { input: '010', expected: false },
    { input: '11', expected: false },
  ],
};

export const nfaPresets: PresetAutomata[] = [
  nfaContains101,
  nfaWithEpsilon,
  nfaThirdFromEndIs1,
];
