import { DFAMachine, PresetAutomata } from '../types/automata';

export const dfaEndsWith01: PresetAutomata = {
  id: 'dfa_ends_with_01',
  name: 'Strings ending with "01"',
  module: 'Module 1',
  type: 'DFA',
  description: 'Accepts all binary strings that end with "01". Σ = {0, 1}',
  machine: {
    type: 'DFA',
    name: 'Ends with "01"',
    alphabet: ['0', '1'],
    startState: 'q0',
    acceptStates: ['q2'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Seen 0)', isInitial: false, isAccept: false, x: 320, y: 220 },
      { id: 'q2', label: 'q2 (Seen 01)', isInitial: false, isAccept: true, x: 540, y: 220 },
    ],
    transitions: [
      { id: 't1', from: 'q0', to: 'q0', symbol: '1' },
      { id: 't2', from: 'q0', to: 'q1', symbol: '0' },
      { id: 't3', from: 'q1', to: 'q1', symbol: '0' },
      { id: 't4', from: 'q1', to: 'q2', symbol: '1' },
      { id: 't5', from: 'q2', to: 'q1', symbol: '0' },
      { id: 't6', from: 'q2', to: 'q0', symbol: '1' },
    ],
  },
  testCases: [
    { input: '01', expected: true },
    { input: '1001', expected: true },
    { input: '11101', expected: true },
    { input: '0', expected: false },
    { input: '1', expected: false },
    { input: '010', expected: false },
    { input: '1011', expected: false },
  ],
};

export const dfaDivisibleBy3: PresetAutomata = {
  id: 'dfa_divisible_by_3',
  name: 'Binary Divisible by 3',
  module: 'Module 1',
  type: 'DFA',
  description: 'Accepts binary representations of integers divisible by 3 (e.g. 0, 3=11, 6=110, 9=1001).',
  machine: {
    type: 'DFA',
    name: 'Binary Divisible by 3',
    alphabet: ['0', '1'],
    startState: 'q0',
    acceptStates: ['q0'],
    states: [
      { id: 'q0', label: 'q0 (Rem 0)', isInitial: true, isAccept: true, x: 150, y: 150 },
      { id: 'q1', label: 'q1 (Rem 1)', isInitial: false, isAccept: false, x: 420, y: 150 },
      { id: 'q2', label: 'q2 (Rem 2)', isInitial: false, isAccept: false, x: 285, y: 350 },
    ],
    transitions: [
      { id: 't1', from: 'q0', to: 'q0', symbol: '0' },
      { id: 't2', from: 'q0', to: 'q1', symbol: '1' },
      { id: 't3', from: 'q1', to: 'q2', symbol: '0' },
      { id: 't4', from: 'q1', to: 'q0', symbol: '1' },
      { id: 't5', from: 'q2', to: 'q1', symbol: '0' },
      { id: 't6', from: 'q2', to: 'q2', symbol: '1' },
    ],
  },
  testCases: [
    { input: '0', expected: true },
    { input: '11', expected: true },   // 3
    { input: '110', expected: true },  // 6
    { input: '1001', expected: true }, // 9
    { input: '1100', expected: true }, // 12
    { input: '1', expected: false },   // 1
    { input: '10', expected: false },  // 2
    { input: '100', expected: false }, // 4
    { input: '101', expected: false }, // 5
  ],
};

export const dfaEvenZeros: PresetAutomata = {
  id: 'dfa_even_zeros',
  name: 'Even Number of 0s',
  module: 'Module 1',
  type: 'DFA',
  description: 'Accepts all binary strings containing an even count of "0"s (including zero count).',
  machine: {
    type: 'DFA',
    name: 'Even Number of 0s',
    alphabet: ['0', '1'],
    startState: 'q_even',
    acceptStates: ['q_even'],
    states: [
      { id: 'q_even', label: 'q_even (Even 0s)', isInitial: true, isAccept: true, x: 180, y: 220 },
      { id: 'q_odd', label: 'q_odd (Odd 0s)', isInitial: false, isAccept: false, x: 440, y: 220 },
    ],
    transitions: [
      { id: 't1', from: 'q_even', to: 'q_even', symbol: '1' },
      { id: 't2', from: 'q_even', to: 'q_odd', symbol: '0' },
      { id: 't3', from: 'q_odd', to: 'q_odd', symbol: '1' },
      { id: 't4', from: 'q_odd', to: 'q_even', symbol: '0' },
    ],
  },
  testCases: [
    { input: '', expected: true },
    { input: '111', expected: true },
    { input: '00', expected: true },
    { input: '10101', expected: true },
    { input: '0', expected: false },
    { input: '01010', expected: false },
  ],
};

export const dfaPresets: PresetAutomata[] = [
  dfaEndsWith01,
  dfaDivisibleBy3,
  dfaEvenZeros,
];
