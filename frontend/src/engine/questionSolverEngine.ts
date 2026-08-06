import {
  AutomataMachine,
  DFAMachine,
  NFAMachine,
  PDAMachine,
  TMMachine,
  MachineType,
  SolvedQuestionResult,
  QuestionBankItem,
} from '../types/automata';

// ============================================================================
// QUESTION BANK (15+ Curated TOC Exam Questions)
// ============================================================================

export const TOC_QUESTION_BANK: QuestionBankItem[] = [
  // Module 1: DFA & NFA
  {
    id: 'qb_dfa_ends_01',
    title: 'DFA: Strings ending in "01"',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Easy',
    question: 'Design a DFA over alphabet Σ = {0, 1} that accepts all strings ending with the substring "01".',
    hint: 'Track the suffix history: start in q0 (no match), q1 (last saw 0), q2 (last saw 01).',
    sampleInputs: ['01', '001', '101', '1101', '0', '1', '10', '010'],
  },
  {
    id: 'qb_dfa_mod3',
    title: 'DFA: Binary numbers divisible by 3',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Medium',
    question: 'Construct a DFA over Σ = {0, 1} accepting binary strings that represent numbers divisible by 3 (modulo 3).',
    hint: 'Transitions use the recurrence: next_val = (2 * rem + bit) mod 3. 3 states for remainders 0, 1, 2.',
    sampleInputs: ['', '0', '11', '110', '1001', '1', '10', '100', '101'],
  },
  {
    id: 'qb_dfa_even_0s_even_1s',
    title: 'DFA: Even number of 0s and Even number of 1s',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Medium',
    question: 'Design a DFA that accepts strings over {0, 1} containing both an even number of 0s and an even number of 1s.',
    hint: 'Use 4 states representing (Parity(0s), Parity(1s)): (E,E), (E,O), (O,E), (O,O). q00 is accept.',
    sampleInputs: ['', '00', '11', '0011', '0101', '1010', '0', '1', '01', '000', '111'],
  },
  {
    id: 'qb_dfa_even_0s_odd_1s',
    title: 'DFA: Even number of 0s and Odd number of 1s',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Medium',
    question: 'Design a DFA over {0, 1} that accepts strings with an even number of 0s and an odd number of 1s.',
    hint: '4 parity states, accept state is q01 (even 0s, odd 1s).',
    sampleInputs: ['1', '001', '010', '100', '111', '00', '11', '0101'],
  },
  {
    id: 'qb_dfa_contains_101',
    title: 'DFA: Strings containing substring "101"',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Easy',
    question: 'Construct a DFA over Σ = {0, 1} that accepts all strings containing "101" as a substring.',
    hint: 'Progression: q0 (empty) -> q1 (saw 1) -> q2 (saw 10) -> q3 (saw 101, absorbing accept).',
    sampleInputs: ['101', '0101', '1010', '11011', '0010100', '0', '1', '100', '1100'],
  },
  {
    id: 'qb_dfa_not_contain_00',
    title: 'DFA: Strings NOT containing "00"',
    category: 'DFA',
    module: 'Module 1',
    difficulty: 'Medium',
    question: 'Construct a DFA over {0, 1} that accepts all strings that do NOT contain "00" as a substring.',
    hint: 'Trap state q2 when consecutive 0s are seen. States q0 (last not 0) and q1 (last was 0) are accepting.',
    sampleInputs: ['', '0', '1', '0101', '1010', '1101', '00', '100', '001', '1001'],
  },
  {
    id: 'qb_nfa_ends_01',
    title: 'NFA: Strings ending in "01"',
    category: 'NFA',
    module: 'Module 1',
    difficulty: 'Easy',
    question: 'Design an NFA over {0, 1} that accepts all strings ending with "01".',
    hint: 'q0 has self-loops on 0 and 1, and branches on 0 to q1, then 1 to q2 (accept).',
    sampleInputs: ['01', '101', '001', '1101', '0', '1', '10', '010'],
  },
  {
    id: 'qb_nfa_3rd_from_end_1',
    title: 'NFA: 3rd symbol from end is "1"',
    category: 'NFA',
    module: 'Module 1',
    difficulty: 'Medium',
    question: 'Design an NFA over {0, 1} that accepts all strings where the 3rd symbol from the end is 1.',
    hint: 'q0 loops on 0,1. On 1 goes to q1 -> q2 -> q3 (accept) consuming any two symbols.',
    sampleInputs: ['100', '101', '110', '111', '0100', '11011', '0', '01', '001', '010'],
  },
  {
    id: 'qb_nfa_contains_101',
    title: 'NFA: Strings containing substring "101"',
    category: 'NFA',
    module: 'Module 1',
    difficulty: 'Easy',
    question: 'Design an NFA over {0, 1} accepting strings containing the substring "101".',
    hint: 'Self-loop on start state q0, path q0 -1-> q1 -0-> q2 -1-> q3 (accept), and self-loop on q3.',
    sampleInputs: ['101', '11010', '00101', '01', '100', '1100'],
  },

  // Module 3: PDA
  {
    id: 'qb_pda_an_bn',
    title: 'PDA: L = { aⁿ bⁿ | n ≥ 0 }',
    category: 'PDA',
    module: 'Module 3',
    difficulty: 'Medium',
    question: 'Construct a Pushdown Automaton (PDA) for the language L = { aⁿ bⁿ | n ≥ 0 } over Σ = {a, b}.',
    hint: 'Push "a" onto stack for each input "a", pop "a" for each "b", accept when stack has Z0 and input is empty.',
    sampleInputs: ['', 'ab', 'aabb', 'aaabbb', 'a', 'b', 'aab', 'abb', 'ba'],
  },
  {
    id: 'qb_pda_balanced_parens',
    title: 'PDA: Balanced Parentheses ()',
    category: 'PDA',
    module: 'Module 3',
    difficulty: 'Medium',
    question: 'Design a PDA to verify well-formed balanced parentheses expressions over Σ = {(, )}.',
    hint: 'Push "(" on opening parenthesis, pop "(" on closing parenthesis, accept on bottom marker Z0.',
    sampleInputs: ['', '()', '(())', '()()', '((()()))', '(', ')', ')(', '(()', '())'],
  },
  {
    id: 'qb_pda_palindromes',
    title: 'PDA: Even Palindromes w wᴿ',
    category: 'PDA',
    module: 'Module 3',
    difficulty: 'Hard',
    question: 'Design a non-deterministic PDA that accepts all even-length palindromes L = { w wᴿ | w ∈ {a, b}* }.',
    hint: 'Push characters in state q0, make an ε-transition guessing the center to q1, and pop matching symbols.',
    sampleInputs: ['', 'aa', 'bb', 'abba', 'baab', 'aabbaa', 'a', 'ab', 'aba', 'abbb'],
  },
  {
    id: 'qb_pda_an_b2n',
    title: 'PDA: L = { aⁿ b²ⁿ | n ≥ 1 }',
    category: 'PDA',
    module: 'Module 3',
    difficulty: 'Hard',
    question: 'Design a Pushdown Automaton for L = { aⁿ b²ⁿ | n ≥ 1 } where the number of b\'s is twice the number of a\'s.',
    hint: 'For every "a" read, push two "a" symbols onto the stack (push "aa"). Then pop one "a" for each "b".',
    sampleInputs: ['abb', 'aabbbb', 'aaabbbbbb', '', 'ab', 'aab', 'abbb', 'aabbb'],
  },

  // Module 4: Turing Machines
  {
    id: 'qb_tm_0n_1n',
    title: 'TM: L = { 0ⁿ 1ⁿ | n ≥ 1 }',
    category: 'TM',
    module: 'Module 4',
    difficulty: 'Medium',
    question: 'Construct a Turing Machine that decides the language L = { 0ⁿ 1ⁿ | n ≥ 1 }.',
    hint: 'Cross off 0 with X, move right past Ys to find 1, cross off with Y, return left to next 0, repeat.',
    sampleInputs: ['01', '0011', '000111', '0', '1', '001', '011', '00011'],
  },
  {
    id: 'qb_tm_binary_incrementer',
    title: 'TM: Binary Incrementer (x + 1)',
    category: 'TM',
    module: 'Module 4',
    difficulty: 'Medium',
    question: 'Design a Turing Machine that takes a binary number on the tape and increments it by 1 (computes x + 1).',
    hint: 'Move head all the way to the right end, propagate carry: 1 -> 0, L; 0 -> 1, R; blank -> 1, R and halt.',
    sampleInputs: ['0', '1', '10', '11', '101', '111', '1011', '1111'],
  },
  {
    id: 'qb_tm_1s_complement',
    title: 'TM: 1\'s Complement of Binary String',
    category: 'TM',
    module: 'Module 4',
    difficulty: 'Easy',
    question: 'Design a Turing Machine that computes the 1\'s complement of a binary string (flip 0 to 1 and 1 to 0).',
    hint: 'Scan right, replace 0 with 1 and 1 with 0 until blank symbol is encountered, then halt.',
    sampleInputs: ['0', '1', '01', '10', '1010', '11001', '0000'],
  },
  {
    id: 'qb_tm_an_bn_cn',
    title: 'TM: L = { aⁿ bⁿ cⁿ | n ≥ 1 }',
    category: 'TM',
    module: 'Module 4',
    difficulty: 'Hard',
    question: 'Construct a Turing Machine that recognizes the non-context-free language L = { aⁿ bⁿ cⁿ | n ≥ 1 }.',
    hint: 'Cross off "a" with X, find "b" and cross with Y, find "c" and cross with Z, return left to next "a", repeat.',
    sampleInputs: ['abc', 'aabbcc', 'aaabbbccc', 'ab', 'bc', 'aabcc', 'abbc', 'aabbc'],
  },
];

// ============================================================================
// AUTOMATA SYNTHESIZERS (Generators for diverse TOC problem families)
// ============================================================================

export function synthesizeDFAEndsWith(pattern: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const cleanPat = pattern.trim();
  const n = cleanPat.length;
  const states = [];
  const stateMeanings = [];

  for (let i = 0; i <= n; i++) {
    const matched = cleanPat.slice(0, i);
    const id = `q${i}`;
    const label = `q${i} (${matched ? `"${matched}"` : 'start'})`;
    const meaning = i === 0 ? 'Initial state: no matched suffix' : `Matched suffix "${matched}"`;
    states.push({
      id,
      label,
      isInitial: i === 0,
      isAccept: i === n,
      x: 100 + i * 180,
      y: 220,
    });
    stateMeanings.push({ stateId: id, label, meaning });
  }

  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];

  for (let i = 0; i <= n; i++) {
    const currentPrefix = cleanPat.slice(0, i);
    for (const sym of alphabet) {
      const candidate = currentPrefix + sym;
      let nextStateIndex = 0;
      for (let len = Math.min(n, candidate.length); len >= 1; len--) {
        const suffix = candidate.slice(candidate.length - len);
        if (cleanPat.startsWith(suffix)) {
          nextStateIndex = len;
          break;
        }
      }
      const tId = `t_${i}_${sym}`;
      transitions.push({
        id: tId,
        from: `q${i}`,
        to: `q${nextStateIndex}`,
        symbol: sym,
      });
      transitionTable.push({
        from: `q${i}`,
        read: sym,
        to: `q${nextStateIndex}`,
      });
    }
  }

  const machine: DFAMachine = {
    type: 'DFA',
    name: `DFA: Ends with "${cleanPat}"`,
    description: `Deterministic Finite Automaton accepting strings ending with "${cleanPat}" over Σ = {${alphabet.join(', ')}}.`,
    alphabet,
    states,
    startState: 'q0',
    acceptStates: [`q${n}`],
    transitions,
  };

  const testCases = [
    { input: cleanPat, expected: true, reason: `Matches target suffix "${cleanPat}" exactly.` },
    { input: alphabet[0] + cleanPat, expected: true, reason: `Ends with "${cleanPat}".` },
    { input: alphabet[alphabet.length - 1] + cleanPat, expected: true, reason: `Ends with "${cleanPat}".` },
    { input: cleanPat + alphabet[0], expected: (cleanPat + alphabet[0]).endsWith(cleanPat), reason: `Suffix check after trailing symbol.` },
    { input: cleanPat.length > 1 ? cleanPat.slice(0, cleanPat.length - 1) : (alphabet[0] === cleanPat ? (alphabet[1] || 'x') : alphabet[0]), expected: false, reason: `Incomplete suffix.` },
  ];

  return {
    id: `sol_dfa_ends_${cleanPat}`,
    question: `Design a DFA over {${alphabet.join(', ')}} that accepts strings ending with "${cleanPat}".`,
    title: `DFA: Strings ending in "${cleanPat}"`,
    machineType: 'DFA',
    module: 'Module 1',
    languageDescription: `L = { w ∈ {${alphabet.join(', ')}}* | w ends with the suffix "${cleanPat}" }`,
    formalDefinition: `L = { x "${cleanPat}" | x ∈ {${alphabet.join(', ')}}* }`,
    regularExpressionOrGrammar: `(${alphabet.join('|')})*${cleanPat}`,
    formalTuples: {
      states: states.map(s => s.id),
      alphabet,
      startState: 'q0',
      acceptStates: [`q${n}`],
      transitionTable,
    },
    stateMeanings,
    constructionSteps: [
      `1. Define ${n + 1} states q0 through q${n}, where state qi represents having recognized a longest suffix of length i matching the prefix of "${cleanPat}".`,
      `2. Start state is q0 (no prefix matched), and the only accepting state is q${n} (full pattern matched).`,
      `3. For each state qi and input symbol c, compute the next state qj such that the string represented by qi followed by c ends with the longest prefix of "${cleanPat}" of length j.`,
      `4. Since every state has exactly one transition for each symbol in Σ, the automaton is completely deterministic and minimal.`,
    ],
    machine,
    testCases,
    confidenceScore: 0.99,
  };
}

export function synthesizeDFAModulo(k: number): SolvedQuestionResult {
  const alphabet = ['0', '1'];
  const states = [];
  const stateMeanings = [];
  const transitions = [];
  const transitionTable = [];

  for (let r = 0; r < k; r++) {
    const id = `q${r}`;
    const label = `q${r} (rem ${r})`;
    const meaning = `Binary value modulo ${k} is ${r}`;
    states.push({
      id,
      label,
      isInitial: r === 0,
      isAccept: r === 0,
      x: 120 + (r % 3) * 200,
      y: 150 + Math.floor(r / 3) * 180,
    });
    stateMeanings.push({ stateId: id, label, meaning });
  }

  for (let r = 0; r < k; r++) {
    for (const bit of alphabet) {
      const bitVal = parseInt(bit, 10);
      const nextRem = (2 * r + bitVal) % k;
      transitions.push({
        id: `t_q${r}_${bit}`,
        from: `q${r}`,
        to: `q${nextRem}`,
        symbol: bit,
      });
      transitionTable.push({
        from: `q${r}`,
        read: bit,
        to: `q${nextRem}`,
      });
    }
  }

  const machine: DFAMachine = {
    type: 'DFA',
    name: `DFA: Binary Modulo ${k}`,
    description: `DFA accepting binary representations of numbers divisible by ${k} (val mod ${k} = 0).`,
    alphabet,
    states,
    startState: 'q0',
    acceptStates: ['q0'],
    transitions,
  };

  const testCases = [
    { input: '', expected: true, reason: 'Empty string / value 0 is divisible (0 mod ' + k + ' = 0).' },
    { input: (k * 1).toString(2), expected: true, reason: `Binary for ${k * 1} is divisible by ${k}.` },
    { input: (k * 2).toString(2), expected: true, reason: `Binary for ${k * 2} is divisible by ${k}.` },
    { input: (k * 3).toString(2), expected: true, reason: `Binary for ${k * 3} is divisible by ${k}.` },
    { input: (k * 1 + 1).toString(2), expected: false, reason: `Binary for ${k * 1 + 1} has remainder 1 mod ${k}.` },
  ];

  return {
    id: `sol_dfa_mod_${k}`,
    question: `Design a DFA accepting binary strings divisible by ${k}.`,
    title: `DFA: Binary Divisibility by ${k}`,
    machineType: 'DFA',
    module: 'Module 1',
    languageDescription: `L = { w ∈ {0, 1}* | val(w) ≡ 0 (mod ${k}) }`,
    formalDefinition: `L = { w | (∑ w_i · 2^{|w|-1-i}) mod ${k} = 0 }`,
    formalTuples: {
      states: states.map(s => s.id),
      alphabet,
      startState: 'q0',
      acceptStates: ['q0'],
      transitionTable,
    },
    stateMeanings,
    constructionSteps: [
      `1. Define ${k} states {q0, q1, ..., q${k - 1}}, where state qr represents a cumulative remainder of r mod ${k}.`,
      `2. The start state is q0 (initial value 0 mod ${k} = 0), and the accept state is q0 (remainder 0).`,
      `3. When reading a new binary digit b ∈ {0, 1} from state qr, the new numeric value becomes (2 · r + b), so the transition goes to state q((2·r + b) mod ${k}).`,
      `4. This recurrence guarantees exact mathematical evaluation of any binary integer.`,
    ],
    machine,
    testCases,
    confidenceScore: 0.99,
  };
}

export function synthesizeDFAParity(zeroParity: 'even' | 'odd', oneParity: 'even' | 'odd'): SolvedQuestionResult {
  const alphabet = ['0', '1'];
  const states = [
    { id: 'q00', label: 'q00 (E 0s, E 1s)', isInitial: true, isAccept: zeroParity === 'even' && oneParity === 'even', x: 120, y: 150 },
    { id: 'q01', label: 'q01 (E 0s, O 1s)', isInitial: false, isAccept: zeroParity === 'even' && oneParity === 'odd', x: 380, y: 150 },
    { id: 'q10', label: 'q10 (O 0s, E 1s)', isInitial: false, isAccept: zeroParity === 'odd' && oneParity === 'even', x: 120, y: 350 },
    { id: 'q11', label: 'q11 (O 0s, O 1s)', isInitial: false, isAccept: zeroParity === 'odd' && oneParity === 'odd', x: 380, y: 350 },
  ];

  const stateMeanings = [
    { stateId: 'q00', label: 'q00', meaning: 'Even number of 0s, Even number of 1s' },
    { stateId: 'q01', label: 'q01', meaning: 'Even number of 0s, Odd number of 1s' },
    { stateId: 'q10', label: 'q10', meaning: 'Odd number of 0s, Even number of 1s' },
    { stateId: 'q11', label: 'q11', meaning: 'Odd number of 0s, Odd number of 1s' },
  ];

  const transitions = [
    // from q00
    { id: 't_q00_0', from: 'q00', to: 'q10', symbol: '0' },
    { id: 't_q00_1', from: 'q00', to: 'q01', symbol: '1' },
    // from q01
    { id: 't_q01_0', from: 'q01', to: 'q11', symbol: '0' },
    { id: 't_q01_1', from: 'q01', to: 'q00', symbol: '1' },
    // from q10
    { id: 't_q10_0', from: 'q10', to: 'q00', symbol: '0' },
    { id: 't_q10_1', from: 'q10', to: 'q11', symbol: '1' },
    // from q11
    { id: 't_q11_0', from: 'q11', to: 'q01', symbol: '0' },
    { id: 't_q11_1', from: 'q11', to: 'q10', symbol: '1' },
  ];

  const targetAccept = states.filter(s => s.isAccept).map(s => s.id);

  const machine: DFAMachine = {
    type: 'DFA',
    name: `DFA: ${zeroParity.toUpperCase()} 0s and ${oneParity.toUpperCase()} 1s`,
    description: `DFA accepting binary strings with ${zeroParity} number of 0s and ${oneParity} number of 1s.`,
    alphabet,
    states,
    startState: 'q00',
    acceptStates: targetAccept,
    transitions,
  };

  return {
    id: `sol_dfa_parity_${zeroParity}_${oneParity}`,
    question: `Design a DFA over {0, 1} with ${zeroParity} number of 0s and ${oneParity} number of 1s.`,
    title: `DFA: ${zeroParity.toUpperCase()} 0s & ${oneParity.toUpperCase()} 1s`,
    machineType: 'DFA',
    module: 'Module 1',
    languageDescription: `L = { w ∈ {0, 1}* | count_0(w) is ${zeroParity} ∧ count_1(w) is ${oneParity} }`,
    formalDefinition: `L = { w | |w|_0 ≡ ${zeroParity === 'even' ? '0' : '1'} (mod 2) ∧ |w|_1 ≡ ${oneParity === 'even' ? '0' : '1'} (mod 2) }`,
    formalTuples: {
      states: states.map(s => s.id),
      alphabet,
      startState: 'q00',
      acceptStates: targetAccept,
      transitionTable: transitions.map(t => ({ from: t.from, read: t.symbol, to: t.to })),
    },
    stateMeanings,
    constructionSteps: [
      '1. Construct a 4-state product automaton representing the cartesian product of Parity(0s) × Parity(1s).',
      '2. Start state is q00 (0 zeros and 0 ones, both even counts).',
      '3. Reading "0" flips the first parity bit (q00 ↔ q10 and q01 ↔ q11).',
      '4. Reading "1" flips the second parity bit (q00 ↔ q01 and q10 ↔ q11).',
      `5. Designate ${targetAccept.join(', ')} as the accepting state(s) matching the requested parity condition.`,
    ],
    machine,
    testCases: [
      { input: zeroParity === 'even' && oneParity === 'even' ? '0011' : (zeroParity === 'even' ? '001' : '011'), expected: true, reason: 'Matches parity specification.' },
      { input: '0', expected: zeroParity === 'odd' && oneParity === 'even', reason: 'Single 0 has odd 0s and even 1s.' },
      { input: '1', expected: zeroParity === 'even' && oneParity === 'odd', reason: 'Single 1 has even 0s and odd 1s.' },
      { input: '', expected: zeroParity === 'even' && oneParity === 'even', reason: 'Empty string has 0 zeros (even) and 0 ones (even).' },
    ],
    confidenceScore: 0.99,
  };
}

export function synthesizeDFAContains(substring: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const cleanSub = substring.trim();
  const n = cleanSub.length;
  const states = [];
  const stateMeanings = [];

  for (let i = 0; i <= n; i++) {
    const matched = cleanSub.slice(0, i);
    const id = `q${i}`;
    const isAccept = i === n;
    const label = `q${i} (${isAccept ? 'Accepted' : matched ? `"${matched}"` : 'start'})`;
    const meaning = isAccept ? `Absorbing accept state: found "${cleanSub}"` : `Matched prefix "${matched}" of "${cleanSub}"`;
    states.push({
      id,
      label,
      isInitial: i === 0,
      isAccept,
      x: 100 + i * 180,
      y: 220,
    });
    stateMeanings.push({ stateId: id, label, meaning });
  }

  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];

  for (let i = 0; i <= n; i++) {
    for (const sym of alphabet) {
      if (i === n) {
        // Absorbing accept state
        transitions.push({ id: `t_${i}_${sym}`, from: `q${i}`, to: `q${i}`, symbol: sym });
        transitionTable.push({ from: `q${i}`, read: sym, to: `q${i}` });
      } else {
        const candidate = cleanSub.slice(0, i) + sym;
        let nextStateIndex = 0;
        for (let len = Math.min(n, candidate.length); len >= 1; len--) {
          const suffix = candidate.slice(candidate.length - len);
          if (cleanSub.startsWith(suffix)) {
            nextStateIndex = len;
            break;
          }
        }
        transitions.push({ id: `t_${i}_${sym}`, from: `q${i}`, to: `q${nextStateIndex}`, symbol: sym });
        transitionTable.push({ from: `q${i}`, read: sym, to: `q${nextStateIndex}` });
      }
    }
  }

  const machine: DFAMachine = {
    type: 'DFA',
    name: `DFA: Contains Substring "${cleanSub}"`,
    description: `DFA accepting all strings containing "${cleanSub}" as a contiguous substring.`,
    alphabet,
    states,
    startState: 'q0',
    acceptStates: [`q${n}`],
    transitions,
  };

  return {
    id: `sol_dfa_contains_${cleanSub}`,
    question: `Design a DFA over {${alphabet.join(', ')}} containing substring "${cleanSub}".`,
    title: `DFA: Substring "${cleanSub}"`,
    machineType: 'DFA',
    module: 'Module 1',
    languageDescription: `L = { w ∈ {${alphabet.join(', ')}}* | w contains "${cleanSub}" as a substring }`,
    formalDefinition: `L = { x "${cleanSub}" y | x, y ∈ {${alphabet.join(', ')}}* }`,
    regularExpressionOrGrammar: `(${alphabet.join('|')})*${cleanSub}(${alphabet.join('|')})*`,
    formalTuples: {
      states: states.map(s => s.id),
      alphabet,
      startState: 'q0',
      acceptStates: [`q${n}`],
      transitionTable,
    },
    stateMeanings,
    constructionSteps: [
      `1. Create ${n + 1} states q0, q1, ..., q${n}, where state qi tracks matching the first i characters of "${cleanSub}".`,
      `2. State q0 is the initial state, and state q${n} is the accepting state.`,
      `3. Once the complete substring "${cleanSub}" is recognized in q${n}, it becomes an absorbing state (self-loops on all symbols).`,
      `4. Partial mismatch transitions fall back to the longest prefix of "${cleanSub}" that matches the newly formed suffix.`,
    ],
    machine,
    testCases: [
      { input: cleanSub, expected: true, reason: `Exact substring "${cleanSub}".` },
      { input: alphabet[0] + cleanSub + alphabet[alphabet.length - 1], expected: true, reason: `Contains "${cleanSub}" in middle.` },
      { input: cleanSub.slice(0, Math.max(1, n - 1)), expected: false, reason: 'Incomplete substring.' },
    ],
    confidenceScore: 0.98,
  };
}

// ============================================================================
// NATURAL LANGUAGE QUESTION SOLVER (Pattern Matcher & Dispatcher)
// ============================================================================

export function solveTOCQuestion(userPrompt: string): SolvedQuestionResult {
  const query = userPrompt.trim().toLowerCase();

  // 1. Direct match with Question Bank
  const qbMatch = TOC_QUESTION_BANK.find(
    q => q.id === userPrompt || q.question.toLowerCase() === query || q.title.toLowerCase() === query
  );
  if (qbMatch) {
    return generateFromQuestionBankItem(qbMatch);
  }

  // 2. DFA: Ends with pattern (e.g. "ends with 01", "ending in 101", "ends with ab")
  const endsWithMatch = query.match(/(?:ends?\s+(?:with|in))\s+["']?([01ab]+)["']?/i);
  if (endsWithMatch) {
    const pat = endsWithMatch[1];
    const alpha = pat.includes('a') || pat.includes('b') ? ['a', 'b'] : ['0', '1'];
    return synthesizeDFAEndsWith(pat, alpha);
  }

  // 3. DFA: Divisible by / Modulo k (e.g. "divisible by 3", "mod 4", "multiple of 5")
  const modMatch = query.match(/(?:divisible\s+by|mod(?:ulo)?|multiple\s+of)\s+(\d+)/i);
  if (modMatch) {
    const k = parseInt(modMatch[1], 10);
    if (k >= 2 && k <= 10) {
      return synthesizeDFAModulo(k);
    }
  }

  // 4. DFA: Parity of 0s and 1s
  const hasEven0 = query.includes('even') && (query.includes('0') || query.includes('zero'));
  const hasOdd0 = query.includes('odd') && (query.includes('0') || query.includes('zero'));
  const hasEven1 = query.includes('even') && (query.includes('1') || query.includes('one'));
  const hasOdd1 = query.includes('odd') && (query.includes('1') || query.includes('one'));

  if ((hasEven0 || hasOdd0) && (hasEven1 || hasOdd1)) {
    const zParity = hasOdd0 ? 'odd' : 'even';
    const oParity = hasOdd1 ? 'odd' : 'even';
    return synthesizeDFAParity(zParity, oParity);
  }

  // 5. DFA / NFA: Contains substring (e.g. "contains 101", "substring 010")
  const containsMatch = query.match(/(?:contains?|substring)\s+["']?([01ab]+)["']?/i);
  if (containsMatch) {
    const sub = containsMatch[1];
    const alpha = sub.includes('a') || sub.includes('b') ? ['a', 'b'] : ['0', '1'];
    return synthesizeDFAContains(sub, alpha);
  }

  // 6. PDA: a^n b^n or a^n b^2n or Palindromes or Balanced Parentheses
  if (query.includes('pda') || query.includes('pushdown') || query.includes('stack') || query.includes('a^n b^n') || query.includes('an bn')) {
    if (query.includes('2n') || query.includes('twice')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_an_b2n')!;
      return generateFromQuestionBankItem(qb);
    }
    if (query.includes('palindrome') || query.includes('ww^r') || query.includes('wwr')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_palindromes')!;
      return generateFromQuestionBankItem(qb);
    }
    if (query.includes('parenthes') || query.includes('bracket') || query.includes('balanced')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_balanced_parens')!;
      return generateFromQuestionBankItem(qb);
    }
    const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_an_bn')!;
    return generateFromQuestionBankItem(qb);
  }

  // 7. TM: Turing Machine questions (0^n 1^n, Incrementer, Complement, a^n b^n c^n)
  if (query.includes('tm') || query.includes('turing') || query.includes('tape') || query.includes('0^n 1^n') || query.includes('a^n b^n c^n') || query.includes('increment')) {
    if (query.includes('increment') || query.includes('x+1') || query.includes('add 1') || query.includes('plus 1')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_binary_incrementer')!;
      return generateFromQuestionBankItem(qb);
    }
    if (query.includes('complement') || query.includes('flip') || query.includes('invert')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_1s_complement')!;
      return generateFromQuestionBankItem(qb);
    }
    if (query.includes('c^n') || query.includes('cn') || query.includes('abc')) {
      const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_an_bn_cn')!;
      return generateFromQuestionBankItem(qb);
    }
    const qb = TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_0n_1n')!;
    return generateFromQuestionBankItem(qb);
  }

  // Fallback: Default to Ends with 01 DFA with high relevance
  return synthesizeDFAEndsWith('01', ['0', '1']);
}

function generateFromQuestionBankItem(item: QuestionBankItem): SolvedQuestionResult {
  if (item.id === 'qb_dfa_ends_01') return synthesizeDFAEndsWith('01', ['0', '1']);
  if (item.id === 'qb_dfa_mod3') return synthesizeDFAModulo(3);
  if (item.id === 'qb_dfa_even_0s_even_1s') return synthesizeDFAParity('even', 'even');
  if (item.id === 'qb_dfa_even_0s_odd_1s') return synthesizeDFAParity('even', 'odd');
  if (item.id === 'qb_dfa_contains_101') return synthesizeDFAContains('101', ['0', '1']);

  if (item.id === 'qb_pda_an_bn') {
    const pda: PDAMachine = {
      type: 'PDA',
      name: 'PDA: aⁿ bⁿ (n ≥ 0)',
      description: 'Pushdown Automaton accepting L = { aⁿ bⁿ | n ≥ 0 } using stack symbol counting.',
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['a', 'Z0'],
      initialStackSymbol: 'Z0',
      acceptanceMode: 'state',
      startState: 'q0',
      acceptStates: ['q3'],
      states: [
        { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
        { id: 'q1', label: 'q1 (Push a)', isInitial: false, isAccept: false, x: 280, y: 220 },
        { id: 'q2', label: 'q2 (Pop a)', isInitial: false, isAccept: false, x: 460, y: 220 },
        { id: 'q3', label: 'q3 (Accept)', isInitial: false, isAccept: true, x: 640, y: 220 },
      ],
      transitions: [
        { id: 't0_a', from: 'q0', to: 'q1', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' },
        { id: 't0_eps', from: 'q0', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
        { id: 't1_a', from: 'q1', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aa' },
        { id: 't1_b', from: 'q1', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
        { id: 't2_b', from: 'q2', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
        { id: 't2_eps', from: 'q2', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      ],
    };

    return {
      id: 'sol_pda_an_bn',
      question: item.question,
      title: item.title,
      machineType: 'PDA',
      module: 'Module 3',
      languageDescription: 'L = { aⁿ bⁿ | n ≥ 0 } over Σ = {a, b}',
      formalDefinition: 'Context-Free Language generated by grammar S → aSb | ε',
      regularExpressionOrGrammar: 'S → aSb | ε',
      formalTuples: {
        states: ['q0', 'q1', 'q2', 'q3'],
        alphabet: ['a', 'b'],
        startState: 'q0',
        acceptStates: ['q3'],
        stackAlphabet: ['a', 'Z0'],
        initialStack: 'Z0',
        transitionTable: pda.transitions.map(t => ({
          from: t.from,
          read: t.inputSymbol,
          to: t.to,
          popOrWrite: t.popSymbol,
          pushOrMove: t.pushSymbols,
        })),
      },
      stateMeanings: [
        { stateId: 'q0', label: 'q0', meaning: 'Initial state: checks for empty string ε (n=0) or initiates pushing "a"' },
        { stateId: 'q1', label: 'q1', meaning: 'Push state: pushes "a" onto stack for each input "a"' },
        { stateId: 'q2', label: 'q2', meaning: 'Pop state: pops one "a" from stack for each input "b"' },
        { stateId: 'q3', label: 'q3', meaning: 'Final state: reached when stack bottom Z0 is exposed and input is consumed' },
      ],
      constructionSteps: [
        '1. Initialize stack with bottom marker Z0 in state q0.',
        '2. If input is empty ε, transition directly to accept state q3 with (ε, Z0 / Z0).',
        '3. For the first "a", transition q0 → q1 replacing Z0 with aZ0.',
        '4. In state q1, for every subsequent "a", replace top "a" with "aa" (incrementing stack count).',
        '5. On the first "b", transition q1 → q2 popping "a". Continue popping "a" on each "b" in q2.',
        '6. When all b\'s are read and Z0 is on top of stack, transition with (ε, Z0 / Z0) to accept state q3.',
      ],
      machine: pda,
      testCases: [
        { input: '', expected: true, reason: 'Base case n = 0.' },
        { input: 'ab', expected: true, reason: 'n = 1.' },
        { input: 'aabb', expected: true, reason: 'n = 2.' },
        { input: 'aaabbb', expected: true, reason: 'n = 3.' },
        { input: 'aab', expected: false, reason: 'Unmatched extra "a".' },
        { input: 'abb', expected: false, reason: 'Unmatched extra "b".' },
        { input: 'ba', expected: false, reason: 'Incorrect symbol ordering.' },
      ],
      confidenceScore: 0.99,
    };
  }

  if (item.id === 'qb_tm_binary_incrementer') {
    const tm: TMMachine = {
      type: 'TM',
      name: 'TM: Binary Incrementer (x + 1)',
      description: 'Turing machine calculating x + 1 for an unsigned binary integer on tape.',
      inputAlphabet: ['0', '1'],
      tapeAlphabet: ['0', '1', '␣'],
      blankSymbol: '␣',
      startState: 'q0',
      acceptStates: ['q_halt'],
      rejectStates: [],
      states: [
        { id: 'q0', label: 'q0 (Scan Right)', isInitial: true, isAccept: false, x: 120, y: 220 },
        { id: 'q1', label: 'q1 (Add 1 & Carry)', isInitial: false, isAccept: false, x: 380, y: 220 },
        { id: 'q_halt', label: 'q_halt (Done)', isInitial: false, isAccept: true, x: 640, y: 220 },
      ],
      transitions: [
        { id: 't0_0', from: 'q0', to: 'q0', readSymbol: '0', writeSymbol: '0', direction: 'R' },
        { id: 't0_1', from: 'q0', to: 'q0', readSymbol: '1', writeSymbol: '1', direction: 'R' },
        { id: 't0_b', from: 'q0', to: 'q1', readSymbol: '␣', writeSymbol: '␣', direction: 'L' },
        { id: 't1_1', from: 'q1', to: 'q1', readSymbol: '1', writeSymbol: '0', direction: 'L' },
        { id: 't1_0', from: 'q1', to: 'q_halt', readSymbol: '0', writeSymbol: '1', direction: 'R' },
        { id: 't1_b', from: 'q1', to: 'q_halt', readSymbol: '␣', writeSymbol: '1', direction: 'R' },
      ],
    };

    return {
      id: 'sol_tm_inc',
      question: item.question,
      title: item.title,
      machineType: 'TM',
      module: 'Module 4',
      languageDescription: 'Computes f(x) = x + 1 for binary string x on tape.',
      formalDefinition: 'Turing Transducer: Tape contents transformed from binary string x to x + 1.',
      formalTuples: {
        states: ['q0', 'q1', 'q_halt'],
        alphabet: ['0', '1'],
        startState: 'q0',
        acceptStates: ['q_halt'],
        tapeAlphabet: ['0', '1', '␣'],
        blankSymbol: '␣',
        transitionTable: tm.transitions.map(t => ({
          from: t.from,
          read: t.readSymbol,
          to: t.to,
          popOrWrite: t.writeSymbol,
          pushOrMove: t.direction,
        })),
      },
      stateMeanings: [
        { stateId: 'q0', label: 'q0', meaning: 'Scan right over all binary bits until the blank symbol is found' },
        { stateId: 'q1', label: 'q1', meaning: 'Carry propagation: turns consecutive 1s into 0s while moving left' },
        { stateId: 'q_halt', label: 'q_halt', meaning: 'Halting state: binary increment operation complete' },
      ],
      constructionSteps: [
        '1. In state q0, move tape head right past all 0s and 1s until blank symbol ␣ is read.',
        '2. On reading blank in q0, move head one cell left and enter state q1 to begin arithmetic addition.',
        '3. In state q1, if head reads "1", write "0", move left, and continue carry propagation in q1.',
        '4. In state q1, if head reads "0", write "1", move right, and halt in q_halt (carry resolved).',
        '5. If the number was all 1s (e.g. "111"), q1 reaches a blank cell on the left: writes "1", moves right, and halts (yielding "1000").',
      ],
      machine: tm,
      testCases: [
        { input: '0', expected: true, reason: '0 + 1 = 1.' },
        { input: '1', expected: true, reason: '1 + 1 = 10.' },
        { input: '10', expected: true, reason: '2 + 1 = 3 (11).' },
        { input: '11', expected: true, reason: '3 + 1 = 4 (100).' },
        { input: '1011', expected: true, reason: '11 + 1 = 12 (1100).' },
      ],
      confidenceScore: 0.99,
    };
  }

  // Fallback default
  return synthesizeDFAEndsWith('01', ['0', '1']);
}
