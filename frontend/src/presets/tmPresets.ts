import { PresetAutomata, TMMachine } from '../types/automata';

export const tmBinaryIncrementer: PresetAutomata = {
  id: 'tm_binary_incrementer',
  name: 'Binary Incrementer (x + 1)',
  module: 'Module 4',
  type: 'TM',
  description: 'Turing machine that computes the binary increment of an unsigned integer (e.g. 1011 -> 1100).',
  machine: {
    type: 'TM',
    name: 'Binary Incrementer (x + 1)',
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', '_'],
    blankSymbol: '_',
    startState: 'q_scan_right',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    states: [
      { id: 'q_scan_right', label: 'q0 (Scan to End)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q_carry', label: 'q1 (Add 1 & Carry)', isInitial: false, isAccept: false, x: 340, y: 220 },
      { id: 'q_rewind', label: 'q2 (Rewind Head)', isInitial: false, isAccept: false, x: 580, y: 220 },
      { id: 'q_accept', label: 'q_acc (Done)', isInitial: false, isAccept: true, x: 800, y: 220 },
      { id: 'q_reject', label: 'q_rej', isInitial: false, isAccept: false, x: 450, y: 380 },
    ],
    transitions: [
      // q_scan_right: skip over 0s and 1s until blank at end
      { id: 'tm_sr0', from: 'q_scan_right', to: 'q_scan_right', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 'tm_sr1', from: 'q_scan_right', to: 'q_scan_right', readSymbol: '1', writeSymbol: '1', direction: 'R' },
      { id: 'tm_srb', from: 'q_scan_right', to: 'q_carry', readSymbol: '_', writeSymbol: '_', direction: 'L' },

      // q_carry: if 1, change to 0 and move left (carry); if 0, change to 1 and rewind; if blank, write 1 and rewind
      { id: 'tm_c1', from: 'q_carry', to: 'q_carry', readSymbol: '1', writeSymbol: '0', direction: 'L' },
      { id: 'tm_c0', from: 'q_carry', to: 'q_rewind', readSymbol: '0', writeSymbol: '1', direction: 'L' },
      { id: 'tm_cb', from: 'q_carry', to: 'q_rewind', readSymbol: '_', writeSymbol: '1', direction: 'L' },

      // q_rewind: rewind back to left boundary blank
      { id: 'tm_rw0', from: 'q_rewind', to: 'q_rewind', readSymbol: '0', writeSymbol: '0', direction: 'L' },
      { id: 'tm_rw1', from: 'q_rewind', to: 'q_rewind', readSymbol: '1', writeSymbol: '1', direction: 'L' },
      { id: 'tm_rwb', from: 'q_rewind', to: 'q_accept', readSymbol: '_', writeSymbol: '_', direction: 'R' },
    ],
  },
  testCases: [
    { input: '0', expected: true },
    { input: '1', expected: true },
    { input: '10', expected: true },
    { input: '1011', expected: true },
    { input: '1111', expected: true },
  ],
};

export const tmAnBnCn: PresetAutomata = {
  id: 'tm_an_bn_cn',
  name: 'aⁿ bⁿ cⁿ (n ≥ 1)',
  module: 'Module 4',
  type: 'TM',
  description: 'Turing machine recognizing non-context-free language L = { aⁿ bⁿ cⁿ | n ≥ 1 } by cross-marking matching a, b, c triplets.',
  machine: {
    type: 'TM',
    name: 'aⁿ bⁿ cⁿ (n ≥ 1)',
    inputAlphabet: ['a', 'b', 'c'],
    tapeAlphabet: ['a', 'b', 'c', 'X', 'Y', 'Z', '_'],
    blankSymbol: '_',
    startState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    states: [
      { id: 'q0', label: 'q0 (Mark a as X)', isInitial: true, isAccept: false, x: 100, y: 200 },
      { id: 'q1', label: 'q1 (Find & Mark b)', isInitial: false, isAccept: false, x: 300, y: 120 },
      { id: 'q2', label: 'q2 (Find & Mark c)', isInitial: false, isAccept: false, x: 500, y: 120 },
      { id: 'q3', label: 'q3 (Return to X)', isInitial: false, isAccept: false, x: 400, y: 280 },
      { id: 'q4', label: 'q4 (Verify All Marked)', isInitial: false, isAccept: false, x: 260, y: 360 },
      { id: 'q_accept', label: 'q_acc (Accept)', isInitial: false, isAccept: true, x: 680, y: 360 },
      { id: 'q_reject', label: 'q_rej (Reject)', isInitial: false, isAccept: false, x: 100, y: 380 },
    ],
    transitions: [
      // q0: read 'a' -> mark 'X', move R to q1. Or if 'Y', check if all marked
      { id: 'tm_0_a', from: 'q0', to: 'q1', readSymbol: 'a', writeSymbol: 'X', direction: 'R' },
      { id: 'tm_0_Y', from: 'q0', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },

      // q1: skip 'a' and 'Y' until find first 'b' -> mark 'Y', move R to q2
      { id: 'tm_1_a', from: 'q1', to: 'q1', readSymbol: 'a', writeSymbol: 'a', direction: 'R' },
      { id: 'tm_1_Y', from: 'q1', to: 'q1', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 'tm_1_b', from: 'q1', to: 'q2', readSymbol: 'b', writeSymbol: 'Y', direction: 'R' },

      // q2: skip 'b' and 'Z' until find first 'c' -> mark 'Z', move L to q3
      { id: 'tm_2_b', from: 'q2', to: 'q2', readSymbol: 'b', writeSymbol: 'b', direction: 'R' },
      { id: 'tm_2_Z', from: 'q2', to: 'q2', readSymbol: 'Z', writeSymbol: 'Z', direction: 'R' },
      { id: 'tm_2_c', from: 'q2', to: 'q3', readSymbol: 'c', writeSymbol: 'Z', direction: 'L' },

      // q3: rewind left past a, b, Y, Z until hitting X, then move R to q0
      { id: 'tm_3_a', from: 'q3', to: 'q3', readSymbol: 'a', writeSymbol: 'a', direction: 'L' },
      { id: 'tm_3_b', from: 'q3', to: 'q3', readSymbol: 'b', writeSymbol: 'b', direction: 'L' },
      { id: 'tm_3_Y', from: 'q3', to: 'q3', readSymbol: 'Y', writeSymbol: 'Y', direction: 'L' },
      { id: 'tm_3_Z', from: 'q3', to: 'q3', readSymbol: 'Z', writeSymbol: 'Z', direction: 'L' },
      { id: 'tm_3_X', from: 'q3', to: 'q0', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },

      // q4: verify tape only contains Y and Z until blank '_'
      { id: 'tm_4_Y', from: 'q4', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 'tm_4_Z', from: 'q4', to: 'q4', readSymbol: 'Z', writeSymbol: 'Z', direction: 'R' },
      { id: 'tm_4_b', from: 'q4', to: 'q_accept', readSymbol: '_', writeSymbol: '_', direction: 'R' },
    ],
  },
  testCases: [
    { input: 'abc', expected: true },
    { input: 'aabbcc', expected: true },
    { input: 'aaabbbccc', expected: true },
    { input: 'ab', expected: false },
    { input: 'aabbc', expected: false },
    { input: 'aabcc', expected: false },
    { input: 'cba', expected: false },
  ],
};

export const tmPresets: PresetAutomata[] = [
  tmBinaryIncrementer,
  tmAnBnCn,
];
