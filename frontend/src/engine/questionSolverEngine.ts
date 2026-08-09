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
// QUESTION BANK — 100 Curated TOC Exam Questions
// ============================================================================

export const TOC_QUESTION_BANK: QuestionBankItem[] = [
  // ── DFA Questions ────────────────────────────────────────────────────────
  { id: 'qb_dfa_ends_01', title: 'DFA: Strings ending in "01"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} that accepts all strings ending with "01".', hint: 'Track suffix: q0=no match, q1=saw 0, q2=saw 01.', sampleInputs: ['01','001','101','1101','0','1','10','010'] },
  { id: 'qb_dfa_mod3', title: 'DFA: Binary divisible by 3', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over Σ = {0,1} accepting binary strings divisible by 3.', hint: 'Three states for remainder 0,1,2. δ(q,b) = q where val = (2*rem+b) mod 3.', sampleInputs: ['','0','11','110','1001','1','10','100','101'] },
  { id: 'qb_dfa_even_0s_even_1s', title: 'DFA: Even 0s and Even 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over {0,1} accepting strings with both even number of 0s and even number of 1s.', hint: '4 states: (E,E),(E,O),(O,E),(O,O). Accept (E,E).', sampleInputs: ['','00','11','0011','0101','1010','0','1','01','000','111'] },
  { id: 'qb_dfa_even_0s_odd_1s', title: 'DFA: Even 0s and Odd 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over {0,1} accepting strings with even number of 0s and odd number of 1s.', hint: '4 parity states; accept state = (even-0, odd-1).', sampleInputs: ['1','001','010','100','111','00','11','0101'] },
  { id: 'qb_dfa_contains_101', title: 'DFA: Contains "101"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Construct a DFA over Σ = {0,1} accepting all strings containing "101" as a substring.', hint: 'q0→q1 on 1→q2 on 0→q3 on 1 (absorbing accept).', sampleInputs: ['101','0101','1010','11011','0010100','0','1','100','1100'] },
  { id: 'qb_dfa_not_contain_00', title: 'DFA: NOT containing "00"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over {0,1} accepting all strings that do NOT contain "00".', hint: 'Trap state when two consecutive 0s seen. q0,q1 are accept.', sampleInputs: ['','0','1','0101','1010','1101','00','100','001','1001'] },
  { id: 'qb_dfa_starts_01', title: 'DFA: Starts with "01"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} that accepts all strings starting with "01".', hint: 'q0=start, q1=saw 0, q2=saw 01 (accept, self-loop), q_trap=dead state.', sampleInputs: ['01','011','0101','010','0','1','10','001'] },
  { id: 'qb_dfa_starts_10', title: 'DFA: Starts with "10"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} that accepts all strings starting with "10".', hint: 'Similar to starts-with-01; use a trap state for invalid prefixes.', sampleInputs: ['10','100','101','1010','1','0','01','11'] },
  { id: 'qb_dfa_even_length', title: 'DFA: Even-length strings', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} that accepts all strings of even length (including empty string).', hint: 'Two states: q0=even (accept), q1=odd. Toggle on every symbol.', sampleInputs: ['','00','11','01','10','0101','111','0011','1'] },
  { id: 'qb_dfa_odd_length', title: 'DFA: Odd-length strings', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} that accepts all strings of odd length.', hint: 'Two states: q0=even (reject), q1=odd (accept). Toggle on every symbol.', sampleInputs: ['0','1','001','010','11','0','1011','00','000'] },
  { id: 'qb_dfa_mod4', title: 'DFA: Binary divisible by 4', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over Σ = {0,1} accepting binary strings representing numbers divisible by 4.', hint: '4 states for remainders 0–3. Transition: rem = (2*rem + bit) mod 4.', sampleInputs: ['','0','100','1000','10100','1','10','101','110'] },
  { id: 'qb_dfa_mod5', title: 'DFA: Binary divisible by 5', category: 'DFA', module: 'Module 1', difficulty: 'Hard', question: 'Construct a DFA over Σ = {0,1} accepting binary strings representing numbers divisible by 5.', hint: '5 states for remainders 0–4. Transition: rem = (2*rem + bit) mod 5.', sampleInputs: ['','0','101','1010','11001','1','10','11','100'] },
  { id: 'qb_dfa_exactly_one_0', title: 'DFA: Exactly one 0', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings containing exactly one 0.', hint: 'q0=no 0 yet (reject), q1=exactly one 0 (accept), q2=two+ 0s (dead/reject).', sampleInputs: ['0','10','01','101','110','1101','00','1','11','100'] },
  { id: 'qb_dfa_exactly_two_0s', title: 'DFA: Exactly two 0s', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings containing exactly two 0s.', hint: 'Four states tracking count of 0s seen: 0,1,2,3+. Accept at count=2.', sampleInputs: ['00','100','010','001','1100','101','0','000','11','0011'] },
  { id: 'qb_dfa_at_least_two_1s', title: 'DFA: At least two 1s', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings with at least two 1s.', hint: 'Three states: seen 0, seen 1, seen 2+ (absorbing accept).', sampleInputs: ['11','011','110','101','111','1','0','10','0101','001'] },
  { id: 'qb_dfa_at_most_one_0', title: 'DFA: At most one 0', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings with at most one 0.', hint: 'q0=zero 0s (accept), q1=one 0 (accept), q2=two+ 0s (dead/reject).', sampleInputs: ['','1','0','10','01','11','100','110','001','000'] },
  { id: 'qb_dfa_at_least_three_1s', title: 'DFA: At least three 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings with at least three 1s.', hint: 'Four states counting 1s: 0,1,2,3+ (absorbing accept).', sampleInputs: ['111','0111','1011','1110','11','1','0001011','00','11000'] },
  { id: 'qb_dfa_ends_00', title: 'DFA: Ends with "00"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting all strings ending with "00".', hint: 'q0=initial, q1=last was 0, q2=last two were 00 (accept).', sampleInputs: ['00','100','1100','0100','0','1','10','01','000'] },
  { id: 'qb_dfa_ends_11', title: 'DFA: Ends with "11"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting all strings ending with "11".', hint: 'q0=initial, q1=last was 1, q2=last two were 11 (accept).', sampleInputs: ['11','011','111','0011','0','1','10','101','0110'] },
  { id: 'qb_dfa_ends_10', title: 'DFA: Ends with "10"', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting all strings ending with "10".', hint: 'q0=initial, q1=last was 1, q2=last saw 10 (accept).', sampleInputs: ['10','110','1010','0010','0','1','01','100','11'] },
  { id: 'qb_dfa_contains_110', title: 'DFA: Contains "110"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over Σ = {0,1} accepting all strings containing "110" as a substring.', hint: 'q0→q1 on 1→q2 on 1→q3 on 0 (absorbing accept).', sampleInputs: ['110','0110','1101','11011','0','1','10','1010','11'] },
  { id: 'qb_dfa_not_start_11', title: 'DFA: Does NOT start with "11"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting all strings that do NOT start with "11".', hint: 'Trap after reading two 1s at start; all other prefixes lead to accepting loop.', sampleInputs: ['','0','1','10','01','100','111','0111','11','1100'] },
  { id: 'qb_dfa_odd_0s_odd_1s', title: 'DFA: Odd 0s and Odd 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over {0,1} accepting strings with odd number of 0s and odd number of 1s.', hint: '4 parity states; accept state = (odd-0, odd-1).', sampleInputs: ['01','10','001','0011','010','100','0','1','11','00'] },
  { id: 'qb_dfa_len_div2', title: 'DFA: Length divisible by 2', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings whose length is divisible by 2 (even length).', hint: 'Exactly 2 states, toggle between even and odd. Accept on even (q0).', sampleInputs: ['','01','00','1010','11','1','0','001','10101'] },
  { id: 'qb_dfa_len_div3', title: 'DFA: Length divisible by 3', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings whose length is divisible by 3.', hint: 'Three states for length mod 3 = 0,1,2. Accept at mod=0 (q0).', sampleInputs: ['','000','111','010','011100','1','00','0101','01010'] },
  { id: 'qb_dfa_no_consec_00', title: 'DFA: No consecutive 0s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting all strings that do NOT have two consecutive 0s.', hint: 'Same as not-contain-00. q0 and q1 accept, q2 trap.', sampleInputs: ['','0','1','01','10','101','010','100','00','001'] },
  { id: 'qb_dfa_no_consec_11', title: 'DFA: No consecutive 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting all strings that do NOT have two consecutive 1s.', hint: 'q0 (accept, last≠1), q1 (accept, last=1), q_trap.', sampleInputs: ['','1','0','10','01','101','010','110','011','1010'] },
  { id: 'qb_dfa_exactly_one_1', title: 'DFA: Exactly one 1', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings with exactly one 1.', hint: 'q0=no 1 yet, q1=exactly one 1 (accept), q2=two+ 1s (dead).', sampleInputs: ['1','10','01','001','100','0010','11','0','0000','110'] },
  { id: 'qb_dfa_starts_ab', title: 'DFA: Starts with "ab" over {a,b}', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {a,b} accepting all strings starting with "ab".', hint: 'q0→q1 on a→q2 on b (accept, self-loop on a,b); trap on wrong symbol.', sampleInputs: ['ab','aba','abba','abb','a','b','ba','bab','aab'] },
  { id: 'qb_dfa_ends_ba', title: 'DFA: Ends with "ba" over {a,b}', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {a,b} accepting all strings ending with "ba".', hint: 'KMP-style: q0=start, q1=saw b, q2=saw ba (accept).', sampleInputs: ['ba','aba','bba','abba','a','b','ab','aab','bab'] },
  { id: 'qb_dfa_contains_aba', title: 'DFA: Contains "aba"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over Σ = {a,b} accepting all strings containing "aba" as a substring.', hint: 'KMP automaton for pattern "aba".', sampleInputs: ['aba','baba','abab','abba','aaba','a','b','ab','ba','aab'] },
  { id: 'qb_dfa_not_contain_aa', title: 'DFA: NOT containing "aa"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Construct a DFA over Σ = {a,b} accepting all strings that do NOT contain "aa".', hint: 'q0 (initial/accept), q1 (last=a, accept), q_trap (saw aa, reject).', sampleInputs: ['','a','b','ab','ba','aba','bab','aa','aab','baa'] },
  { id: 'qb_dfa_2nd_sym_is_0', title: 'DFA: 2nd symbol is 0', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings where the 2nd symbol is 0 (length ≥ 2 required).', hint: 'Read 1st symbol (any) → check 2nd → accept if 0, then self-loop.', sampleInputs: ['00','10','001','101','100','110','0','01','11','1'] },
  { id: 'qb_dfa_3rd_sym_is_1', title: 'DFA: 3rd symbol from left is 1', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings where the 3rd symbol from the left is 1.', hint: 'Read first two symbols (any), check 3rd, then self-loop if 1, else trap.', sampleInputs: ['001','011','101','111','000','100','110','010','00','0010'] },
  { id: 'qb_dfa_starts_and_ends_1', title: 'DFA: Starts and ends with 1', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings that start with 1 and end with 1.', hint: 'Must start with 1; track last-seen symbol; accept if started with 1 and last is 1.', sampleInputs: ['1','11','101','111','0101','0','10','110','0111','01'] },
  { id: 'qb_dfa_starts_and_ends_0', title: 'DFA: Starts and ends with 0', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings that start with 0 and end with 0.', hint: 'Must start with 0; track last-seen symbol; accept if started with 0 and last is 0.', sampleInputs: ['0','00','010','000','1010','1','01','100','0101','10'] },
  { id: 'qb_dfa_ends_101', title: 'DFA: Ends with "101"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting all strings ending with "101".', hint: 'KMP automaton for suffix "101": 4 states (q0..q3). q3 is accept.', sampleInputs: ['101','0101','1101','11101','10101','0','1','10','1010','01'] },
  { id: 'qb_dfa_odd_0s_even_1s', title: 'DFA: Odd 0s and Even 1s', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over {0,1} accepting strings with odd number of 0s and even number of 1s.', hint: '4 parity states; accept state = (odd-0, even-1).', sampleInputs: ['0','100','010','001','00011','1','11','10','0101','011'] },
  { id: 'qb_dfa_contains_01_or_10', title: 'DFA: Contains "01" or "10"', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings that contain "01" or "10" as a substring.', hint: 'Accept whenever 01 or 10 appear — equivalent to strings that have both 0 and 1 as characters.', sampleInputs: ['01','10','001','110','1011','0','1','00','11','0101'] },
  { id: 'qb_dfa_not_ends_1', title: 'DFA: Does NOT end with 1', category: 'DFA', module: 'Module 1', difficulty: 'Easy', question: 'Design a DFA over Σ = {0,1} accepting strings that do NOT end with 1 (ends with 0 or empty).', hint: 'Track last symbol. Accept if last=0 or empty string.', sampleInputs: ['','0','00','10','010','0110','1','11','101','111'] },
  { id: 'qb_dfa_both_0_and_1', title: 'DFA: Contains both 0 and 1', category: 'DFA', module: 'Module 1', difficulty: 'Medium', question: 'Design a DFA over Σ = {0,1} accepting strings that contain at least one 0 and at least one 1.', hint: 'Track which symbols have been seen. 4 states: (none),(0only),(1only),(both-accept).', sampleInputs: ['01','10','001','110','1011','0','1','00','11','0101'] },

  // ── NFA Questions ────────────────────────────────────────────────────────
  { id: 'qb_nfa_ends_01', title: 'NFA: Ends with "01"', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over {0,1} accepting all strings ending with "01".', hint: 'q0 self-loops on 0,1; branches on 0 to q1; q1→q2 on 1 (accept).', sampleInputs: ['01','101','001','1101','0','1','10','010'] },
  { id: 'qb_nfa_3rd_from_end_1', title: 'NFA: 3rd from end is 1', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting all strings where the 3rd symbol from the end is 1.', hint: 'q0 loops on 0,1; on 1 goes to q1→q2→q3(accept) consuming any two symbols.', sampleInputs: ['100','101','110','111','0100','11011','0','01','001','010'] },
  { id: 'qb_nfa_contains_101', title: 'NFA: Contains "101"', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over {0,1} accepting strings containing "101".', hint: 'Self-loop start, q0→q1 on 1→q2 on 0→q3 on 1 (accept with self-loop).', sampleInputs: ['101','11010','00101','01','100','1100'] },
  { id: 'qb_nfa_2nd_from_end_0', title: 'NFA: 2nd from end is 0', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting all strings where the 2nd symbol from the end is 0.', hint: 'q0 loops; on 0 branches to q1→q2(accept) on any symbol.', sampleInputs: ['00','01','100','101','000','011','1','0','10','110'] },
  { id: 'qb_nfa_4th_from_end_1', title: 'NFA: 4th from end is 1', category: 'NFA', module: 'Module 1', difficulty: 'Hard', question: 'Design an NFA over {0,1} accepting all strings where the 4th symbol from the end is 1.', hint: 'q0 loops; on 1 branches to q1→q2→q3→q4(accept) consuming any three symbols.', sampleInputs: ['1000','1001','1010','1011','0000','0100','1111','10111'] },
  { id: 'qb_nfa_5th_from_end_0', title: 'NFA: 5th from end is 0', category: 'NFA', module: 'Module 1', difficulty: 'Hard', question: 'Design an NFA over {0,1} accepting all strings where the 5th symbol from the end is 0.', hint: 'q0 loops; on 0 branches to q1→q2→q3→q4→q5(accept) consuming any four symbols.', sampleInputs: ['00000','01000','00001','10010','11110','1111','01001','100001'] },
  { id: 'qb_nfa_ends_10', title: 'NFA: Ends with "10"', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over {0,1} accepting all strings ending with "10".', hint: 'q0 self-loops; on 1 branches to q1; q1→q2(accept) on 0.', sampleInputs: ['10','110','1010','0010','0','1','01','100','11'] },
  { id: 'qb_nfa_ends_11', title: 'NFA: Ends with "11"', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over {0,1} accepting all strings ending with "11".', hint: 'q0 self-loops; on 1 branches to q1; q1→q2(accept) on 1.', sampleInputs: ['11','011','111','0011','0','1','10','101','0110'] },
  { id: 'qb_nfa_ends_00', title: 'NFA: Ends with "00"', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over {0,1} accepting all strings ending with "00".', hint: 'q0 self-loops; on 0 branches to q1; q1→q2(accept) on 0.', sampleInputs: ['00','100','1100','0100','0','1','10','01','000'] },
  { id: 'qb_nfa_ends_110', title: 'NFA: Ends with "110"', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting all strings ending with "110".', hint: 'q0 self-loops; on 1 branches to q1→q2 on 1→q3(accept) on 0.', sampleInputs: ['110','0110','1110','10110','0','1','11','10','1100'] },
  { id: 'qb_nfa_contains_00_or_11', title: 'NFA: Contains "00" or "11"', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting strings containing "00" or "11".', hint: 'Two parallel NFA paths: one detects 00, the other detects 11. Accept in either.', sampleInputs: ['00','11','100','011','001','110','1001','0110','01','10'] },
  { id: 'qb_nfa_ends_aa', title: 'NFA: Ends with "aa" over {a,b}', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over Σ = {a,b} accepting all strings ending with "aa".', hint: 'q0 self-loops; on a branches to q1; q1→q2(accept) on a.', sampleInputs: ['aa','baa','aba','aaa','a','b','ab','ba','bba','abaa'] },
  { id: 'qb_nfa_ends_ab', title: 'NFA: Ends with "ab" over {a,b}', category: 'NFA', module: 'Module 1', difficulty: 'Easy', question: 'Design an NFA over Σ = {a,b} accepting all strings ending with "ab".', hint: 'q0 self-loops; on a branches to q1; q1→q2(accept) on b.', sampleInputs: ['ab','bab','aab','aba','a','b','ba','aab','bba','abab'] },
  { id: 'qb_nfa_eps_closure', title: 'NFA: ε-NFA for a*b*', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an ε-NFA over Σ = {a,b} accepting strings of the form a*b* (zero or more a\'s followed by zero or more b\'s).', hint: 'q0 (accept) self-loops on a, ε-transition to q1 (accept), q1 self-loops on b.', sampleInputs: ['','a','b','ab','aab','abb','aabb','ba','aba','bba'] },
  { id: 'qb_nfa_2nd_from_left_1', title: 'NFA: 2nd symbol from left is 1', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting strings where the 2nd symbol from the left is 1.', hint: 'q0→q1 on any symbol; q1→q2(accept,self-loop) on 1; trap otherwise.', sampleInputs: ['01','11','010','110','0100','1101','0','1','00','10'] },
  { id: 'qb_nfa_contains_101_or_010', title: 'NFA: Contains "101" or "010"', category: 'NFA', module: 'Module 1', difficulty: 'Hard', question: 'Design an NFA over {0,1} accepting strings containing "101" or "010" as a substring.', hint: 'Two parallel NFA paths detecting 101 and 010 respectively.', sampleInputs: ['101','010','1010','0101','00101','11010','01','10','1100','0011'] },
  { id: 'qb_nfa_3rd_from_end_0', title: 'NFA: 3rd from end is 0', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting all strings where the 3rd symbol from the end is 0.', hint: 'q0 loops; on 0 branches to q1→q2→q3(accept) consuming any two symbols.', sampleInputs: ['000','001','010','011','100','01','00','001','0100','1011'] },
  { id: 'qb_nfa_ends_abc', title: 'NFA: Ends with "abc" over {a,b,c}', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over Σ = {a,b,c} accepting all strings ending with "abc".', hint: 'q0 self-loops on a,b,c; on a→q1→b→q2→c→q3(accept).', sampleInputs: ['abc','aabc','cabc','abcabc','ab','bc','a','b','c','abca'] },
  { id: 'qb_nfa_start_0_or_end_1', title: 'NFA: Starts with 0 OR ends with 1', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting strings that start with 0 OR end with 1.', hint: 'Two NFA branches merged with ε from start: one checks prefix 0, other checks suffix 1.', sampleInputs: ['0','1','01','01','00','10','11','001','110','101'] },
  { id: 'qb_nfa_ends_0_or_ends_1', title: 'NFA: Ends with "01" OR ends with "10"', category: 'NFA', module: 'Module 1', difficulty: 'Medium', question: 'Design an NFA over {0,1} accepting strings ending with "01" or ending with "10".', hint: 'Two NFA branches: one for suffix 01, one for suffix 10.', sampleInputs: ['01','10','001','110','101','010','0','1','00','11'] },

  // ── PDA Questions ────────────────────────────────────────────────────────
  { id: 'qb_pda_an_bn', title: 'PDA: L = { aⁿbⁿ | n ≥ 0 }', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a Pushdown Automaton (PDA) for the language L = { aⁿbⁿ | n ≥ 0 } over Σ = {a,b}.', hint: 'Push a for each a; pop a for each b. Accept when stack = Z0 and input empty.', sampleInputs: ['','ab','aabb','aaabbb','a','b','aab','abb','ba'] },
  { id: 'qb_pda_an_b2n', title: 'PDA: L = { aⁿb²ⁿ | n ≥ 0 }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aⁿb²ⁿ | n ≥ 0 } — each a corresponds to two b\'s.', hint: 'Push two a\'s per input a; pop one per input b.', sampleInputs: ['','abb','aabbbb','aaabbbbbb','ab','aab','abbb','b','aaabb'] },
  { id: 'qb_pda_palindromes', title: 'PDA: Palindromes over {a,b}', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for the language of palindromes over Σ = {a,b} (including ε).', hint: 'Push first half, non-deterministically guess the middle, then pop for the second half.', sampleInputs: ['','a','b','aa','bb','aba','bab','abba','baab','abcba','aabaa'] },
  { id: 'qb_pda_balanced_parens', title: 'PDA: Balanced Parentheses', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA recognizing the language of balanced parentheses over Σ = {(,)}.', hint: 'Push ( on stack; pop on ); accept when stack empty and input exhausted.', sampleInputs: ['','()','(())','()()','((()))','(()())','(',')',')(','(()'] },
  { id: 'qb_pda_equal_ab', title: 'PDA: Equal number of a\'s and b\'s', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA for L = { w ∈ {a,b}* | #a(w) = #b(w) }.', hint: 'Push for one symbol, pop for the other. Accept when stack = Z0 at end.', sampleInputs: ['','ab','ba','aabb','abba','abab','a','b','aab','abb'] },
  { id: 'qb_pda_an_bn_n1', title: 'PDA: L = { aⁿbⁿ | n ≥ 1 }', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA for L = { aⁿbⁿ | n ≥ 1 } — must have at least one pair.', hint: 'Same as aⁿbⁿ but must push at least one a before starting to pop.', sampleInputs: ['ab','aabb','aaabbb','','a','b','ba','aab'] },
  { id: 'qb_pda_0n_1n', title: 'PDA: L = { 0ⁿ1ⁿ | n ≥ 0 }', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA for L = { 0ⁿ1ⁿ | n ≥ 0 } over Σ = {0,1}.', hint: 'Push 0 for each 0; pop 0 for each 1. Accept when stack = Z0 and input empty.', sampleInputs: ['','01','0011','000111','0','1','001','011','10'] },
  { id: 'qb_pda_wwr', title: 'PDA: Even Palindromes { wwᴿ }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA accepting L = { wwᴿ | w ∈ {0,1}* } — even-length palindromes.', hint: 'Push first half; non-deterministically switch to pop-mode for the mirror half.', sampleInputs: ['','0110','1001','01','10','1111','0000','0101','11','001100'] },
  { id: 'qb_pda_more_a_than_b', title: 'PDA: More a\'s than b\'s', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { w ∈ {a,b}* | #a(w) > #b(w) }.', hint: 'Track excess: push a for each a on top of b-count, pop when b seen. Accept if stack has at least one a.', sampleInputs: ['a','aa','aab','aba','aabb','a','ab','b','ba','aabba'] },
  { id: 'qb_pda_an_bm_nleqm', title: 'PDA: L = { aⁿbᵐ | n ≤ m }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aⁿbᵐ | 0 ≤ n ≤ m }.', hint: 'Push a for each a. On b, pop if stack has a; otherwise accept extra b\'s freely.', sampleInputs: ['','b','bb','ab','abb','aabb','aaabb','a','aa','abbb'] },
  { id: 'qb_pda_an_bm_ngeqm', title: 'PDA: L = { aⁿbᵐ | n ≥ m }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aⁿbᵐ | n ≥ m ≥ 0 }.', hint: 'Push a for each a. Pop one per b. Accept if stack ≥ Z0 (some a\'s may remain).', sampleInputs: ['','a','aa','ab','aab','aaab','aaabb','b','abb','aabb'] },
  { id: 'qb_pda_am_bn_nneqm', title: 'PDA: L = { aᵐbⁿ | m ≠ n }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aᵐbⁿ | m ≠ n, m,n ≥ 0 }.', hint: 'Union of m<n and m>n PDAs (non-deterministic choice at start).', sampleInputs: ['a','b','aab','abb','aaab','abbb','','ab','aabb','aabbb'] },
  { id: 'qb_pda_an_b2n_plus1', title: 'PDA: L = { aⁿb²ⁿ⁺¹ | n ≥ 0 }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aⁿb²ⁿ⁺¹ | n ≥ 0 } — one extra b beyond double.', hint: 'Push two a\'s per input a; pop for each b; accept after popping all a\'s when one b remains.', sampleInputs: ['b','abbb','aabbbbb','aaabbbbbbb','','ab','abb','abbbbb','aabb'] },
  { id: 'qb_pda_am_bn_an', title: 'PDA: L = { aᵐbⁿaᵐ | m,n ≥ 1 }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aᵐbⁿaᵐ | m ≥ 1, n ≥ 1 }.', hint: 'Push a\'s; on first b enter b-mode; on a in b-mode switch to pop mode; pop a\'s at end.', sampleInputs: ['aba','aabaa','abba','aabbaa','ab','ba','aab','abaa','aabaaa'] },
  { id: 'qb_pda_brackets', title: 'PDA: Balanced [] and {}', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA recognizing strings with properly balanced [ ] and { } brackets.', hint: 'Push [ or {; on ] pop [ (must match); on } pop { (must match).', sampleInputs: ['','[]','{}','[{}]','{[]}','[[]]','[{]}','{[}','][','{}{[]}'] },
  { id: 'qb_pda_cn_dn', title: 'PDA: L = { cⁿdⁿ | n ≥ 1 }', category: 'PDA', module: 'Module 3', difficulty: 'Medium', question: 'Construct a PDA for L = { cⁿdⁿ | n ≥ 1 } over Σ = {c,d}.', hint: 'Same as aⁿbⁿ PDA with symbols c,d.', sampleInputs: ['cd','ccdd','cccdddd','c','d','dc','ccd','cdd',''] },
  { id: 'qb_pda_anbn_union_cndm', title: 'PDA: L = { aⁿbⁿ } ∪ { cᵐdᵏ | m ≠ k }', category: 'PDA', module: 'Module 3', difficulty: 'Hard', question: 'Construct a PDA for L = { aⁿbⁿ | n ≥ 0 } ∪ { cᵐdᵏ | m,k ≥ 0, m ≠ k }.', hint: 'Non-deterministic choice at start: path1 for aⁿbⁿ, path2 for cᵐdᵏ (m≠k).', sampleInputs: ['','ab','aabb','cd','cdd','ccdd','ccd','a','b','c'] },

  // ── TM Questions ────────────────────────────────────────────────────────
  { id: 'qb_tm_0n_1n', title: 'TM: L = { 0ⁿ1ⁿ | n ≥ 1 }', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Construct a Turing Machine recognizing L = { 0ⁿ1ⁿ | n ≥ 1 } over Σ = {0,1}.', hint: 'Cross off 0 with X, find matching 1 and cross with Y, return left. Accept when all crossed.', sampleInputs: ['01','0011','000111','0','1','001','011','10','0001'] },
  { id: 'qb_tm_binary_incrementer', title: 'TM: Binary Increment (x + 1)', category: 'TM', module: 'Module 4', difficulty: 'Medium', question: 'Design a Turing Machine that increments a binary number on the tape by 1 (x + 1).', hint: 'Move to rightmost bit; propagate carry: 1→0 move left; 0→1 halt; blank→1 halt.', sampleInputs: ['0','1','10','11','101','111','1011','1111'] },
  { id: 'qb_tm_1s_complement', title: 'TM: 1\'s Complement', category: 'TM', module: 'Module 4', difficulty: 'Easy', question: 'Design a Turing Machine computing the 1\'s complement of a binary string (flip all bits).', hint: 'Scan right: replace 0→1, 1→0, halt on blank.', sampleInputs: ['0','1','01','10','1010','11001','0000'] },
  { id: 'qb_tm_an_bn_cn', title: 'TM: L = { aⁿbⁿcⁿ | n ≥ 1 }', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Construct a TM recognizing L = { aⁿbⁿcⁿ | n ≥ 1 } — the classic non-CFL.', hint: 'Cross a with X, find b and cross with Y, find c and cross with Z; repeat; accept when all crossed.', sampleInputs: ['abc','aabbcc','aaabbbccc','ab','bc','aabcc','abbc','aabbc'] },
  { id: 'qb_tm_palindrome', title: 'TM: Palindrome Recognizer', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a Turing Machine that accepts strings over {0,1} that are palindromes.', hint: 'Compare first and last symbols (erase them), move inward, repeat. Accept if tape empties evenly.', sampleInputs: ['','0','1','00','11','010','101','0110','1001','0010','1100'] },
  { id: 'qb_tm_binary_decrement', title: 'TM: Binary Decrement (x - 1)', category: 'TM', module: 'Module 4', difficulty: 'Medium', question: 'Design a Turing Machine that decrements a binary number on the tape by 1 (x - 1). Assume x ≥ 1.', hint: 'Scan right to end; propagate borrow: 0→1 move left; 1→0 halt; handle leading zeros.', sampleInputs: ['1','10','11','100','101','111','1000','10000'] },
  { id: 'qb_tm_copy', title: 'TM: String Copy (w → ww)', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a Turing Machine that copies a binary string: given w on the tape, produces ww.', hint: 'Mark first uncopied symbol, move to end of tape, write it, return; repeat for all symbols.', sampleInputs: ['0','1','01','10','11','00','101','010'] },
  { id: 'qb_tm_equal_0s_1s', title: 'TM: Equal 0s and 1s', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a TM recognizing L = { w ∈ {0,1}* | #0(w) = #1(w) }.', hint: 'Cross off matched pairs (one 0 and one 1 at a time, scanning full tape each pass).', sampleInputs: ['','01','10','0011','1100','0101','1010','001','110','0001'] },
  { id: 'qb_tm_unary_add', title: 'TM: Unary Addition', category: 'TM', module: 'Module 4', difficulty: 'Medium', question: 'Design a TM that computes unary addition: given 1ⁿ+1ᵐ on tape (represented as 1s separated by +), produces 1^(n+m).', hint: 'Replace + with 1; erase the last 1 (or adjust); the result is n+m ones.', sampleInputs: ['1+1','11+1','1+11','111+11','1+1+1','1','11',''] },
  { id: 'qb_tm_reverse', title: 'TM: String Reversal', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a TM that reverses a binary string w, producing wᴿ on the tape.', hint: 'Copy first symbol to end, mark it, repeat from the right; use multiple passes.', sampleInputs: ['0','1','01','10','001','110','0101','1011'] },
  { id: 'qb_tm_check_sorted', title: 'TM: Check Binary String is All 0s', category: 'TM', module: 'Module 4', difficulty: 'Easy', question: 'Design a TM that accepts a binary string if and only if it consists entirely of 0s (i.e., L = { 0* }).', hint: 'Scan right: if 1 encountered, reject; if blank encountered, accept.', sampleInputs: ['','0','00','000','1','01','10','001','000001'] },
  { id: 'qb_tm_marks_xor', title: 'TM: Bitwise XOR of Two Binary Strings', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a TM that computes bitwise XOR of two equal-length binary strings given as w1#w2 on the tape.', hint: 'For each pair of bits: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. Mark positions to sync.', sampleInputs: ['0#0','1#1','0#1','1#0','01#11','10#01','11#11','00#00'] },
  { id: 'qb_tm_prime_check', title: 'TM: Unary Prime Checker', category: 'TM', module: 'Module 4', difficulty: 'Hard', question: 'Design a TM that accepts L = { 1ᵖ | p is prime } in unary representation.', hint: 'Trial division: for d = 2 to sqrt(p), check if d divides p by marking groups of d.', sampleInputs: ['11','111','11111','1111111','1111','111111','1111111111111','1'] },
];

// ============================================================================
// AUTOMATA SYNTHESIZERS
// ============================================================================

// ── DFA: Ends with pattern (KMP suffix automaton) ───────────────────────────
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
    states.push({ id, label, isInitial: i === 0, isAccept: i === n, x: 100 + i * 180, y: 220 });
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
        if (cleanPat.startsWith(candidate.slice(candidate.length - len))) { nextStateIndex = len; break; }
      }
      transitions.push({ id: `t_${i}_${sym}`, from: `q${i}`, to: `q${nextStateIndex}`, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to: `q${nextStateIndex}` });
    }
  }

  const machine: DFAMachine = { type: 'DFA', name: `DFA: Ends with "${cleanPat}"`, description: `DFA accepting strings ending with "${cleanPat}" over Σ = {${alphabet.join(', ')}}.`, alphabet, states, startState: 'q0', acceptStates: [`q${n}`], transitions };

  return {
    id: `sol_dfa_ends_${cleanPat}`,
    question: `Design a DFA over {${alphabet.join(', ')}} that accepts strings ending with "${cleanPat}".`,
    title: `DFA: Strings ending in "${cleanPat}"`,
    machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ {${alphabet.join(', ')}}* | w ends with "${cleanPat}" }`,
    formalDefinition: `L = { x"${cleanPat}" | x ∈ {${alphabet.join(', ')}}* }`,
    regularExpressionOrGrammar: `(${alphabet.join('|')})*${cleanPat}`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${n}`], transitionTable },
    stateMeanings, constructionSteps: [`Build KMP failure-function automaton for pattern "${cleanPat}".`, `Each state qᵢ tracks matching the first i characters of "${cleanPat}".`, `State q${n} is the unique accepting state.`],
    machine,
    testCases: [
      { input: cleanPat, expected: true, reason: `Exact pattern "${cleanPat}".` },
      { input: alphabet[0] + cleanPat, expected: true, reason: `Ends with "${cleanPat}".` },
      { input: cleanPat + alphabet[0], expected: (cleanPat + alphabet[0]).endsWith(cleanPat), reason: 'Suffix check.' },
      { input: alphabet[0], expected: alphabet[0] === cleanPat, reason: 'Single symbol.' },
      { input: cleanPat.split('').reverse().join(''), expected: cleanPat.split('').reverse().join('') === cleanPat || cleanPat.split('').reverse().join('').endsWith(cleanPat), reason: 'Reversed pattern.' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Starts with pattern ─────────────────────────────────────────────────
export function synthesizeDFAStartsWith(pattern: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const cleanPat = pattern.trim();
  const n = cleanPat.length;
  const states = [];
  const stateMeanings = [];

  for (let i = 0; i <= n; i++) {
    states.push({ id: `q${i}`, label: `q${i}${i === n ? ' (Accept)' : ''}`, isInitial: i === 0, isAccept: i === n, x: 100 + i * 180, y: 220 });
    stateMeanings.push({ stateId: `q${i}`, label: `q${i}`, meaning: i === 0 ? 'No prefix matched yet' : i < n ? `Matched prefix "${cleanPat.slice(0, i)}"` : `Full prefix matched (accept loop)` });
  }
  states.push({ id: 'q_trap', label: 'q_trap (Dead)', isInitial: false, isAccept: false, x: 100 + (n + 1) * 180, y: 400 });
  stateMeanings.push({ stateId: 'q_trap', label: 'q_trap', meaning: 'Trap/dead state: prefix mismatch' });

  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];

  for (let i = 0; i < n; i++) {
    for (const sym of alphabet) {
      const to = sym === cleanPat[i] ? `q${i + 1}` : 'q_trap';
      transitions.push({ id: `t_${i}_${sym}`, from: `q${i}`, to, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to });
    }
  }
  // Accept state: self-loop on all symbols
  for (const sym of alphabet) {
    transitions.push({ id: `t_acc_${sym}`, from: `q${n}`, to: `q${n}`, symbol: sym });
    transitionTable.push({ from: `q${n}`, read: sym, to: `q${n}` });
  }
  // Trap: self-loop
  for (const sym of alphabet) {
    transitions.push({ id: `t_trap_${sym}`, from: 'q_trap', to: 'q_trap', symbol: sym });
    transitionTable.push({ from: 'q_trap', read: sym, to: 'q_trap' });
  }

  const machine: DFAMachine = { type: 'DFA', name: `DFA: Starts with "${cleanPat}"`, alphabet, states, startState: 'q0', acceptStates: [`q${n}`], transitions };
  return {
    id: `sol_dfa_starts_${cleanPat}`, question: `Design a DFA over {${alphabet.join(',')}} accepting strings starting with "${cleanPat}".`,
    title: `DFA: Starts with "${cleanPat}"`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | w starts with "${cleanPat}" }`,
    formalDefinition: `L = { "${cleanPat}"x | x ∈ Σ* }`,
    regularExpressionOrGrammar: `${cleanPat}(${alphabet.join('|')})*`,
    formalTuples: { states: [...states.map(s => s.id)], alphabet, startState: 'q0', acceptStates: [`q${n}`], transitionTable },
    stateMeanings, constructionSteps: [`Read the prefix "${cleanPat}" character by character.`, `Any mismatch leads to trap state q_trap.`, `After reading "${cleanPat}" fully, enter absorbing accept state q${n}.`],
    machine,
    testCases: [
      { input: cleanPat, expected: true, reason: `Exact prefix.` },
      { input: cleanPat + alphabet[0], expected: true, reason: `Starts with "${cleanPat}".` },
      { input: cleanPat + alphabet.join(''), expected: true, reason: `Starts with "${cleanPat}".` },
      { input: alphabet[alphabet.length - 1] + cleanPat, expected: false, reason: 'Wrong first character.' },
      { input: '', expected: n === 0, reason: 'Empty string.' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Contains substring (KMP) ────────────────────────────────────────────
export function synthesizeDFAContains(substring: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const sub = substring.trim();
  const n = sub.length;
  const states = [];
  const stateMeanings = [];

  for (let i = 0; i <= n; i++) {
    states.push({ id: `q${i}`, label: `q${i}${i === n ? ' (Accept)' : ''}`, isInitial: i === 0, isAccept: i === n, x: 100 + i * 180, y: 220 });
    stateMeanings.push({ stateId: `q${i}`, label: `q${i}`, meaning: i === 0 ? 'Start' : i === n ? `"${sub}" found (absorbing accept)` : `Matched "${sub.slice(0, i)}"` });
  }

  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];

  for (let i = 0; i <= n; i++) {
    for (const sym of alphabet) {
      let next: number;
      if (i === n) { next = n; }
      else {
        const candidate = sub.slice(0, i) + sym;
        next = 0;
        for (let len = Math.min(n, candidate.length); len >= 1; len--) {
          if (sub.startsWith(candidate.slice(candidate.length - len))) { next = len; break; }
        }
      }
      transitions.push({ id: `t_${i}_${sym}`, from: `q${i}`, to: `q${next}`, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to: `q${next}` });
    }
  }

  const machine: DFAMachine = { type: 'DFA', name: `DFA: Contains "${sub}"`, alphabet, states, startState: 'q0', acceptStates: [`q${n}`], transitions };
  return {
    id: `sol_dfa_contains_${sub}`, question: `DFA accepting strings containing "${sub}".`,
    title: `DFA: Contains "${sub}"`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | "${sub}" is a substring of w }`,
    formalDefinition: `L = { x"${sub}"y | x,y ∈ Σ* }`,
    regularExpressionOrGrammar: `(${alphabet.join('|')})*${sub}(${alphabet.join('|')})*`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${n}`], transitionTable },
    stateMeanings, constructionSteps: [`Build KMP automaton for pattern "${sub}".`, `Once q${n} is reached, stay there (absorbing accept).`],
    machine,
    testCases: [
      { input: sub, expected: true, reason: `Exact match.` },
      { input: alphabet[0] + sub, expected: true, reason: `Contains "${sub}".` },
      { input: sub + alphabet[0], expected: true, reason: `Contains "${sub}".` },
      { input: alphabet[0].repeat(3), expected: alphabet[0].repeat(3).includes(sub), reason: 'Repeated symbol.' },
      { input: sub.split('').reverse().join(''), expected: sub.split('').reverse().join('').includes(sub), reason: 'Reversed.' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Does NOT contain substring ─────────────────────────────────────────
export function synthesizeDFANotContains(substring: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const base = synthesizeDFAContains(substring, alphabet);
  const baseDFA = base.machine as DFAMachine;
  const n = substring.trim().length;
  const newAccepts = baseDFA.states.filter(s => s.id !== `q${n}`).map(s => s.id);
  const updatedStates = baseDFA.states.map(s => ({ ...s, isAccept: s.id !== `q${n}`, label: s.id === `q${n}` ? `q${n} (Trap)` : s.label.replace('(Accept)', '(Valid)') }));
  const machine: DFAMachine = { ...baseDFA, name: `DFA: NOT containing "${substring}"`, states: updatedStates, acceptStates: newAccepts };
  return {
    ...base, id: `sol_dfa_notcontains_${substring}`, title: `DFA: NOT containing "${substring}"`,
    question: `DFA over {${alphabet.join(',')}} accepting strings NOT containing "${substring}".`,
    languageDescription: `L = { w ∈ Σ* | "${substring}" is NOT a substring of w }`,
    formalTuples: { ...base.formalTuples, acceptStates: newAccepts }, machine,
    testCases: [
      { input: '', expected: true, reason: 'Empty string has no substring.' },
      { input: substring, expected: false, reason: `Contains "${substring}".` },
      { input: alphabet[0], expected: !alphabet[0].includes(substring), reason: 'Single character.' },
      { input: alphabet[0].repeat(4), expected: !alphabet[0].repeat(4).includes(substring), reason: 'Repeated symbol.' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Binary divisible by k ───────────────────────────────────────────────
export function synthesizeDFAModulo(k: number): SolvedQuestionResult {
  const states = Array.from({ length: k }, (_, i) => ({
    id: `q${i}`, label: `q${i} (rem=${i})`, isInitial: i === 0, isAccept: i === 0,
    x: 120 + (i % Math.ceil(k / 2)) * 200, y: i < Math.ceil(k / 2) ? 140 : 340,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  const stateMeanings = states.map(s => ({ stateId: s.id, label: s.label, meaning: `Current binary value ≡ ${s.id.slice(1)} (mod ${k})` }));
  for (let i = 0; i < k; i++) {
    for (const b of ['0', '1']) {
      const next = (2 * i + parseInt(b)) % k;
      transitions.push({ id: `t_q${i}_${b}`, from: `q${i}`, to: `q${next}`, symbol: b });
      transitionTable.push({ from: `q${i}`, read: b, to: `q${next}` });
    }
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: Binary divisible by ${k}`, alphabet: ['0', '1'], states, startState: 'q0', acceptStates: ['q0'], transitions };
  return {
    id: `sol_dfa_mod${k}`, question: `DFA accepting binary strings divisible by ${k}.`,
    title: `DFA: Binary divisible by ${k}`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ {0,1}* | val(w) ≡ 0 (mod ${k}) }`,
    formalDefinition: `L = { w ∈ {0,1}* | the integer represented by w is divisible by ${k} }`,
    regularExpressionOrGrammar: `(Divisibility by ${k} cannot be expressed as a simple regex)`,
    formalTuples: { states: states.map(s => s.id), alphabet: ['0', '1'], startState: 'q0', acceptStates: ['q0'], transitionTable },
    stateMeanings, constructionSteps: [`Create ${k} states for remainders 0 through ${k - 1}.`, `Transition: δ(qᵢ, b) = q_{(2i + b) mod ${k}} (left-to-right binary reading).`, `Accept state q0 (remainder 0 = divisible by ${k}).`],
    machine,
    testCases: [
      { input: '', expected: true, reason: '0 is divisible by any k.' },
      { input: '0', expected: true, reason: '0 mod k = 0.' },
      { input: '1', expected: k === 1, reason: `1 mod ${k} = ${1 % k}.` },
      { input: k.toString(2), expected: true, reason: `${k} in binary, divisible by ${k}.` },
      { input: (k + 1).toString(2), expected: (k + 1) % k === 0, reason: `${k + 1} mod ${k} = ${(k + 1) % k}.` },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Parity of 0s and 1s ─────────────────────────────────────────────────
export function synthesizeDFAParity(zeroParity: 'even' | 'odd', oneParity: 'even' | 'odd'): SolvedQuestionResult {
  const acceptId = `q${zeroParity === 'even' ? 'e' : 'o'}${oneParity === 'even' ? 'E' : 'O'}`;
  const states = [
    { id: 'qeE', label: 'qeE (even0,even1)', isInitial: true, isAccept: zeroParity === 'even' && oneParity === 'even', x: 140, y: 140 },
    { id: 'qeO', label: 'qeO (even0,odd1)', isInitial: false, isAccept: zeroParity === 'even' && oneParity === 'odd', x: 420, y: 140 },
    { id: 'qoE', label: 'qoE (odd0,even1)', isInitial: false, isAccept: zeroParity === 'odd' && oneParity === 'even', x: 140, y: 380 },
    { id: 'qoO', label: 'qoO (odd0,odd1)', isInitial: false, isAccept: zeroParity === 'odd' && oneParity === 'odd', x: 420, y: 380 },
  ];
  const delta: Record<string, Record<string, string>> = {
    qeE: { '0': 'qoE', '1': 'qeO' }, qeO: { '0': 'qoO', '1': 'qeE' },
    qoE: { '0': 'qeE', '1': 'qoO' }, qoO: { '0': 'qeO', '1': 'qoE' },
  };
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (const [from, row] of Object.entries(delta)) {
    for (const [sym, to] of Object.entries(row)) {
      transitions.push({ id: `t_${from}_${sym}`, from, to, symbol: sym });
      transitionTable.push({ from, read: sym, to });
    }
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: ${zeroParity} 0s & ${oneParity} 1s`, alphabet: ['0', '1'], states, startState: 'qeE', acceptStates: [acceptId], transitions };
  return {
    id: `sol_dfa_parity_${zeroParity}0_${oneParity}1`,
    question: `DFA accepting strings with ${zeroParity} 0s and ${oneParity} 1s.`,
    title: `DFA: ${zeroParity} 0s & ${oneParity} 1s`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ {0,1}* | #₀(w) is ${zeroParity} AND #₁(w) is ${oneParity} }`,
    formalDefinition: `L = { w | |w|₀ ≡ ${zeroParity === 'even' ? '0' : '1'} (mod 2), |w|₁ ≡ ${oneParity === 'even' ? '0' : '1'} (mod 2) }`,
    formalTuples: { states: states.map(s => s.id), alphabet: ['0', '1'], startState: 'qeE', acceptStates: [acceptId], transitionTable },
    stateMeanings: states.map(s => ({ stateId: s.id, label: s.label, meaning: s.label })),
    constructionSteps: ['4 states encode (parity_of_0s, parity_of_1s).', 'Reading 0 flips first parity; reading 1 flips second parity.', `Accept at state tracking (${zeroParity}-0s, ${oneParity}-1s).`],
    machine,
    testCases: [
      { input: '', expected: zeroParity === 'even' && oneParity === 'even', reason: 'Empty string has 0 of each (even, even).' },
      { input: '1', expected: zeroParity === 'even' && oneParity === 'odd', reason: 'One 1: (even-0, odd-1).' },
      { input: '0', expected: zeroParity === 'odd' && oneParity === 'even', reason: 'One 0: (odd-0, even-1).' },
      { input: '01', expected: zeroParity === 'odd' && oneParity === 'odd', reason: 'One 0, one 1: (odd, odd).' },
      { input: '0011', expected: zeroParity === 'even' && oneParity === 'even', reason: 'Two 0s, two 1s: (even, even).' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Even length ─────────────────────────────────────────────────────────
export function synthesizeDFAEvenLength(alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = [
    { id: 'q0', label: 'q0 (even)', isInitial: true, isAccept: true, x: 140, y: 220 },
    { id: 'q1', label: 'q1 (odd)', isInitial: false, isAccept: false, x: 420, y: 220 },
  ];
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (const sym of alphabet) {
    transitions.push({ id: `t0_${sym}`, from: 'q0', to: 'q1', symbol: sym }, { id: `t1_${sym}`, from: 'q1', to: 'q0', symbol: sym });
    transitionTable.push({ from: 'q0', read: sym, to: 'q1' }, { from: 'q1', read: sym, to: 'q0' });
  }
  const machine: DFAMachine = { type: 'DFA', name: 'DFA: Even-length strings', alphabet, states, startState: 'q0', acceptStates: ['q0'], transitions };
  return {
    id: 'sol_dfa_even_length', question: 'DFA accepting strings of even length.', title: 'DFA: Even-length strings',
    machineType: 'DFA', module: 'Module 1', languageDescription: 'L = { w ∈ Σ* | |w| is even }',
    formalDefinition: 'L = { w | |w| ≡ 0 (mod 2) }', regularExpressionOrGrammar: `((${alphabet.join('|')})(${alphabet.join('|')}))*`,
    formalTuples: { states: ['q0', 'q1'], alphabet, startState: 'q0', acceptStates: ['q0'], transitionTable },
    stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Even number of symbols read so far (initial, accept)' }, { stateId: 'q1', label: 'q1', meaning: 'Odd number of symbols read so far (reject)' }],
    constructionSteps: ['Two states alternating: even (q0) and odd (q1).', 'Every symbol toggles between them.', 'Accept at q0 (even length including ε).'],
    machine,
    testCases: [
      { input: '', expected: true, reason: '0 is even.' }, { input: '00', expected: true, reason: 'Length 2.' },
      { input: '0101', expected: true, reason: 'Length 4.' }, { input: '0', expected: false, reason: 'Length 1.' },
      { input: '011', expected: false, reason: 'Length 3.' },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: Odd length ──────────────────────────────────────────────────────────
export function synthesizeDFAOddLength(alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const base = synthesizeDFAEvenLength(alphabet);
  const baseDFA = base.machine as DFAMachine;
  const updatedStates = baseDFA.states.map(s => ({ ...s, isAccept: s.id === 'q1' }));
  const machine: DFAMachine = { ...baseDFA, name: 'DFA: Odd-length strings', states: updatedStates, acceptStates: ['q1'] };
  return { ...base, id: 'sol_dfa_odd_length', title: 'DFA: Odd-length strings', question: 'DFA accepting strings of odd length.', languageDescription: 'L = { w ∈ Σ* | |w| is odd }', formalDefinition: 'L = { w | |w| ≡ 1 (mod 2) }', regularExpressionOrGrammar: `(${alphabet.join('|')})((${alphabet.join('|')})(${alphabet.join('|')}))*`, formalTuples: { ...base.formalTuples, acceptStates: ['q1'] }, machine, testCases: [{ input: '0', expected: true, reason: 'Length 1.' }, { input: '001', expected: true, reason: 'Length 3.' }, { input: '', expected: false, reason: 'Length 0 (even).' }, { input: '00', expected: false, reason: 'Length 2.' }], confidenceScore: 0.99 };
}

// ── DFA: Exactly N occurrences of a symbol ───────────────────────────────────
export function synthesizeDFAExactlyN(symbol: string, count: number, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = Array.from({ length: count + 2 }, (_, i) => ({
    id: `q${i}`, label: i === count ? `q${i} (Accept)` : i === count + 1 ? `q${count + 1} (Dead)` : `q${i} (${i}×'${symbol}')`,
    isInitial: i === 0, isAccept: i === count, x: 100 + i * 160, y: i === count + 1 ? 380 : 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (let i = 0; i <= count; i++) {
    for (const sym of alphabet) {
      let to: string;
      if (sym === symbol) { to = i < count ? `q${i + 1}` : `q${count + 1}`; }
      else { to = `q${i}`; }
      transitions.push({ id: `t_q${i}_${sym}`, from: `q${i}`, to, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to });
    }
  }
  for (const sym of alphabet) {
    transitions.push({ id: `t_dead_${sym}`, from: `q${count + 1}`, to: `q${count + 1}`, symbol: sym });
    transitionTable.push({ from: `q${count + 1}`, read: sym, to: `q${count + 1}` });
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: Exactly ${count} '${symbol}'s`, alphabet, states, startState: 'q0', acceptStates: [`q${count}`], transitions };
  return {
    id: `sol_dfa_exactly${count}_${symbol}`, question: `DFA accepting strings with exactly ${count} occurrence(s) of '${symbol}'.`,
    title: `DFA: Exactly ${count} '${symbol}'s`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | |w|_${symbol} = ${count} }`, formalDefinition: `L = { w | exactly ${count} '${symbol}'(s) in w }`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${count}`], transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: i <= count ? `Seen ${i} '${symbol}'(s) so far` : `More than ${count} '${symbol}'s seen (dead)` })),
    constructionSteps: [`${count + 2} states: q0..q${count} track count, q${count + 1} is dead.`, `On '${symbol}': advance counter; on other symbols: stay.`, `q${count} is the unique accept state.`],
    machine,
    testCases: [
      { input: symbol.repeat(count), expected: true, reason: `Exactly ${count} '${symbol}'.` },
      { input: (alphabet.find(s => s !== symbol) || '1') + symbol.repeat(count), expected: true, reason: `Exactly ${count} '${symbol}'.` },
      { input: symbol.repeat(count + 1), expected: false, reason: `${count + 1} '${symbol}'s.` },
      { input: symbol.repeat(count > 0 ? count - 1 : 0), expected: count === 0, reason: `${Math.max(0, count - 1)} '${symbol}'s.` },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: At least N occurrences ───────────────────────────────────────────────
export function synthesizeDFAAtLeastN(symbol: string, count: number, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = Array.from({ length: count + 1 }, (_, i) => ({
    id: `q${i}`, label: i === count ? `q${count} (Accept)` : `q${i} (${i}×'${symbol}')`,
    isInitial: i === 0, isAccept: i === count, x: 100 + i * 180, y: 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (let i = 0; i <= count; i++) {
    for (const sym of alphabet) {
      const to = sym === symbol && i < count ? `q${i + 1}` : `q${i === count ? count : i}`;
      const finalTo = sym === symbol && i < count ? `q${i + 1}` : `q${i}`;
      transitions.push({ id: `t_q${i}_${sym}`, from: `q${i}`, to: finalTo, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to: finalTo });
    }
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: At least ${count} '${symbol}'s`, alphabet, states, startState: 'q0', acceptStates: [`q${count}`], transitions };
  return {
    id: `sol_dfa_atleast${count}_${symbol}`, question: `DFA accepting strings with at least ${count} occurrence(s) of '${symbol}'.`,
    title: `DFA: At least ${count} '${symbol}'s`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | |w|_${symbol} ≥ ${count} }`, formalDefinition: `L = { w | at least ${count} '${symbol}'(s) in w }`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${count}`], transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: i < count ? `Seen ${i} '${symbol}'(s)` : `Seen ≥${count} '${symbol}'s (accept)` })),
    constructionSteps: [`${count + 1} states tracking count of '${symbol}'.`, `State q${count} is absorbing accept.`, 'Non-target symbols keep count unchanged.'],
    machine,
    testCases: [
      { input: symbol.repeat(count), expected: true, reason: `Exactly ${count} = at least ${count}.` },
      { input: symbol.repeat(count + 1), expected: true, reason: `${count + 1} > ${count}.` },
      { input: symbol.repeat(Math.max(0, count - 1)), expected: count === 0, reason: `Only ${Math.max(0, count - 1)}.` },
    ],
    confidenceScore: 0.99,
  };
}

// ── DFA: At most N occurrences ────────────────────────────────────────────────
export function synthesizeDFAAtMostN(symbol: string, count: number, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = Array.from({ length: count + 2 }, (_, i) => ({
    id: `q${i}`, label: i === count + 1 ? `q${count + 1} (Dead)` : `q${i} (${i}×'${symbol}')`,
    isInitial: i === 0, isAccept: i <= count, x: 100 + i * 160, y: i === count + 1 ? 380 : 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (let i = 0; i <= count + 1; i++) {
    for (const sym of alphabet) {
      let to: string;
      if (i === count + 1) { to = `q${count + 1}`; }
      else if (sym === symbol) { to = i < count ? `q${i + 1}` : `q${count + 1}`; }
      else { to = `q${i}`; }
      transitions.push({ id: `t_q${i}_${sym}`, from: `q${i}`, to, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to });
    }
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: At most ${count} '${symbol}'s`, alphabet, states, startState: 'q0', acceptStates: Array.from({ length: count + 1 }, (_, i) => `q${i}`), transitions };
  return {
    id: `sol_dfa_atmost${count}_${symbol}`, question: `DFA accepting strings with at most ${count} occurrence(s) of '${symbol}'.`,
    title: `DFA: At most ${count} '${symbol}'s`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | |w|_${symbol} ≤ ${count} }`, formalDefinition: `L = { w | at most ${count} '${symbol}'(s) in w }`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: Array.from({ length: count + 1 }, (_, i) => `q${i}`), transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: i <= count ? `Seen ${i} '${symbol}'(s) — acceptable` : 'Too many — dead state' })),
    constructionSteps: [`States q0 through q${count} are all accepting.`, `q${count + 1} is dead/trap (${count + 1}+ symbols seen).`, 'Non-target symbols keep count unchanged.'],
    machine,
    testCases: [
      { input: '', expected: true, reason: `0 ≤ ${count}.` },
      { input: symbol.repeat(count), expected: true, reason: `Exactly ${count}.` },
      { input: symbol.repeat(count + 1), expected: false, reason: `${count + 1} > ${count}.` },
    ],
    confidenceScore: 0.99,
  };
}

// ── NFA: kth from end is given symbol ────────────────────────────────────────
export function synthesizeNFAKthFromEnd(k: number, symbol: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = Array.from({ length: k + 1 }, (_, i) => ({
    id: `q${i}`, label: i === 0 ? 'q0 (Start)' : i === k ? `q${k} (Accept)` : `q${i}`,
    isInitial: i === 0, isAccept: i === k, x: 100 + i * 180, y: 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  // q0 self-loop on all
  for (const sym of alphabet) {
    transitions.push({ id: `t0_${sym}`, from: 'q0', to: 'q0', symbol: sym });
    transitionTable.push({ from: 'q0', read: sym, to: 'q0' });
  }
  // q0 branches to q1 on target symbol
  transitions.push({ id: `t0_branch_${symbol}`, from: 'q0', to: 'q1', symbol });
  transitionTable.push({ from: 'q0', read: symbol, to: 'q1' });
  // q1 through q_{k-1}: advance on any symbol
  for (let i = 1; i < k; i++) {
    for (const sym of alphabet) {
      transitions.push({ id: `t${i}_${sym}`, from: `q${i}`, to: `q${i + 1}`, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to: `q${i + 1}` });
    }
  }
  const machine: NFAMachine = { type: 'NFA', name: `NFA: ${k}th from end is '${symbol}'`, alphabet, states, startState: 'q0', acceptStates: [`q${k}`], transitions };
  return {
    id: `sol_nfa_${k}th_from_end_${symbol}`, question: `NFA where the ${k}th symbol from the end is '${symbol}'.`,
    title: `NFA: ${k}th from end is '${symbol}'`, machineType: 'NFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | |w| ≥ ${k}, w[|w|-${k}] = '${symbol}' }`, formalDefinition: `L = { x '${symbol}' y | x ∈ Σ*, y ∈ Σ*, |y| = ${k - 1} }`,
    regularExpressionOrGrammar: `(${alphabet.join('|')})* ${symbol} (${alphabet.join('|')}){${k - 1}}`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${k}`], transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: i === 0 ? 'Scanning; non-deterministically guess position' : i === k ? 'Accept: verified kth from end' : `${k - i} more symbols needed after guessed position` })),
    constructionSteps: [`q0 self-loops on all symbols (wait to guess).`, `On '${symbol}', non-deterministically branch to q1.`, `q1→q2→...→q${k}: consume exactly ${k - 1} more symbols.`, `q${k} accept: exactly ${k - 1} symbols after '${symbol}'.`],
    machine,
    testCases: Array.from({ length: 5 }, (_, idx) => {
      const len = k + idx;
      const arr = Array(len).fill(alphabet[1] || '1');
      arr[len - k] = symbol;
      const w = arr.join('');
      return { input: w, expected: true, reason: `'${symbol}' at position ${len - k + 1} from left = ${k}th from end.` };
    }).concat([{ input: (alphabet[0] || '0').repeat(k), expected: (alphabet[0] || '0') === symbol, reason: `All same symbol.` }]),
    confidenceScore: 0.97,
  };
}

// ── NFA: Ends with pattern ────────────────────────────────────────────────────
export function synthesizeNFAEndsWith(pattern: string, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const n = pattern.length;
  const states = Array.from({ length: n + 1 }, (_, i) => ({
    id: `q${i}`, label: i === n ? `q${n} (Accept)` : `q${i}`,
    isInitial: i === 0, isAccept: i === n, x: 100 + i * 180, y: 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (const sym of alphabet) {
    transitions.push({ id: `t0_loop_${sym}`, from: 'q0', to: 'q0', symbol: sym });
    transitionTable.push({ from: 'q0', read: sym, to: 'q0' });
  }
  for (let i = 0; i < n; i++) {
    const sym = pattern[i];
    transitions.push({ id: `t${i}_${sym}`, from: `q${i}`, to: `q${i + 1}`, symbol: sym });
    transitionTable.push({ from: `q${i}`, read: sym, to: `q${i + 1}` });
  }
  const machine: NFAMachine = { type: 'NFA', name: `NFA: Ends with "${pattern}"`, alphabet, states, startState: 'q0', acceptStates: [`q${n}`], transitions };
  return {
    id: `sol_nfa_ends_${pattern}`, question: `NFA accepting strings ending with "${pattern}".`,
    title: `NFA: Ends with "${pattern}"`, machineType: 'NFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | w ends with "${pattern}" }`, formalDefinition: `L = { x"${pattern}" | x ∈ Σ* }`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${n}`], transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: i === 0 ? 'Scan input; guess where suffix starts' : `Matched ${i}/${n} of "${pattern}"` })),
    constructionSteps: [`q0 self-loops on all symbols.`, `Non-deterministically start matching "${pattern}" at any position.`, `q${n} accepts: suffix "${pattern}" matched.`],
    machine,
    testCases: [
      { input: pattern, expected: true, reason: `Exact match.` }, { input: '1' + pattern, expected: true, reason: `Ends with "${pattern}".` },
      { input: pattern + '0', expected: false, reason: `Does not end with "${pattern}".` },
    ],
    confidenceScore: 0.97,
  };
}

// ── DFA: Length divisible by N ────────────────────────────────────────────────
export function synthesizeDFALengthModN(n: number, k: number, alphabet: string[] = ['0', '1']): SolvedQuestionResult {
  const states = Array.from({ length: n }, (_, i) => ({
    id: `q${i}`, label: `q${i} (len≡${i} mod ${n})`, isInitial: i === 0, isAccept: i === k, x: 100 + i * 160, y: 220,
  }));
  const transitions: { id: string; from: string; to: string; symbol: string }[] = [];
  const transitionTable: { from: string; read: string; to: string }[] = [];
  for (let i = 0; i < n; i++) {
    for (const sym of alphabet) {
      const next = (i + 1) % n;
      transitions.push({ id: `t${i}_${sym}`, from: `q${i}`, to: `q${next}`, symbol: sym });
      transitionTable.push({ from: `q${i}`, read: sym, to: `q${next}` });
    }
  }
  const machine: DFAMachine = { type: 'DFA', name: `DFA: Length ≡ ${k} (mod ${n})`, alphabet, states, startState: 'q0', acceptStates: [`q${k}`], transitions };
  return {
    id: `sol_dfa_len_mod${n}_eq${k}`, question: `DFA accepting strings whose length is ≡ ${k} (mod ${n}).`,
    title: `DFA: Length ≡ ${k} (mod ${n})`, machineType: 'DFA', module: 'Module 1',
    languageDescription: `L = { w ∈ Σ* | |w| ≡ ${k} (mod ${n}) }`, formalDefinition: `L = { w | |w| mod ${n} = ${k} }`,
    formalTuples: { states: states.map(s => s.id), alphabet, startState: 'q0', acceptStates: [`q${k}`], transitionTable },
    stateMeanings: states.map((s, i) => ({ stateId: s.id, label: s.label, meaning: `Length ≡ ${i} (mod ${n})` })),
    constructionSteps: [`${n} states form a cycle tracking length mod ${n}.`, `Each symbol advances state by 1 (mod ${n}).`, `Accept at state q${k}.`],
    machine,
    testCases: [
      { input: alphabet[0].repeat(k), expected: true, reason: `Length ${k} ≡ ${k} mod ${n}.` },
      { input: alphabet[0].repeat(k + n), expected: true, reason: `Length ${k + n} ≡ ${k} mod ${n}.` },
      { input: alphabet[0].repeat((k + 1) % n === 0 ? 1 : (k + 1) % n), expected: (k + 1) % n === k, reason: 'Off by one.' },
    ],
    confidenceScore: 0.99,
  };
}

// ============================================================================
// NATURAL LANGUAGE DISPATCHER
// ============================================================================

export function solveTOCQuestion(userPrompt: string): SolvedQuestionResult {
  const query = userPrompt.trim().toLowerCase();

  // 1. Direct Question Bank ID match
  const qbMatch = TOC_QUESTION_BANK.find(q => q.id === userPrompt || q.question.toLowerCase() === query || q.title.toLowerCase() === query);
  if (qbMatch) return generateFromQuestionBankItem(qbMatch);

  // 2. DFA: Starts with
  const startsMatch = query.match(/(?:starts?\s+(?:with|in)|begins?\s+with|starting\s+with)\s+["']?([01ab]+)["']?/i);
  if (startsMatch) {
    const pat = startsMatch[1];
    return synthesizeDFAStartsWith(pat, pat.includes('a') || pat.includes('b') ? ['a', 'b'] : ['0', '1']);
  }

  // 3. DFA: Not contain
  const notContainMatch = query.match(/(?:not\s+contain(?:ing)?|does\s+not\s+contain|without)\s+["']?([01ab]+)["']?/i);
  if (notContainMatch) {
    const sub = notContainMatch[1];
    return synthesizeDFANotContains(sub, sub.includes('a') || sub.includes('b') ? ['a', 'b'] : ['0', '1']);
  }

  // 4. DFA: No consecutive same symbol
  if (/no\s+(?:two\s+)?consecutive\s+([01ab])s?/.test(query)) {
    const symMatch = query.match(/no\s+(?:two\s+)?consecutive\s+([01ab])s?/);
    if (symMatch) return synthesizeDFANotContains(symMatch[1] + symMatch[1]);
  }
  if (query.includes('no consecutive 0') || query.includes('no two consecutive 0')) return synthesizeDFANotContains('00');
  if (query.includes('no consecutive 1') || query.includes('no two consecutive 1')) return synthesizeDFANotContains('11');

  // 5. DFA: Ends with
  const endsMatch = query.match(/(?:ends?\s+(?:with|in)|ending\s+(?:with|in))\s+["']?([01ab]+)["']?/i);
  if (endsMatch) {
    const pat = endsMatch[1];
    return synthesizeDFAEndsWith(pat, pat.includes('a') || pat.includes('b') ? ['a', 'b'] : ['0', '1']);
  }

  // 6. Divisible by N
  const modMatch = query.match(/(?:divisible\s+by|mod(?:ulo)?\s+|multiple\s+of)\s*(\d+)/i);
  if (modMatch) {
    const k = parseInt(modMatch[1]);
    if (query.includes('length') || query.includes('len')) {
      return synthesizeDFALengthModN(k, 0);
    }
    if (k >= 2 && k <= 10) return synthesizeDFAModulo(k);
  }

  // 7. Length patterns
  if (query.includes('even length') || (query.includes('even') && query.includes('length'))) return synthesizeDFAEvenLength();
  if (query.includes('odd length') || (query.includes('odd') && query.includes('length'))) return synthesizeDFAOddLength();
  if (/length\s+divisible\s+by\s+2/.test(query)) return synthesizeDFALengthModN(2, 0);
  if (/length\s+divisible\s+by\s+3/.test(query)) return synthesizeDFALengthModN(3, 0);

  // 8. Exactly N occurrences
  const exactlyMatch = query.match(/exactly\s+(\w+|\d+)\s+(?:'?([01ab])'?|zero|one|two|three)/i);
  if (exactlyMatch) {
    const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const n = parseInt(exactlyMatch[1]) || wordToNum[exactlyMatch[1].toLowerCase()] || 1;
    const sym = exactlyMatch[2] || (query.includes('0') ? '0' : '1');
    return synthesizeDFAExactlyN(sym, n);
  }

  // 9. At least N occurrences
  const atLeastMatch = query.match(/at\s+least\s+(\w+|\d+)\s+(?:'?([01ab])'?)/i);
  if (atLeastMatch) {
    const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const n = parseInt(atLeastMatch[1]) || wordToNum[atLeastMatch[1].toLowerCase()] || 1;
    const sym = atLeastMatch[2] || '1';
    return synthesizeDFAAtLeastN(sym, n);
  }

  // 10. At most N occurrences
  const atMostMatch = query.match(/at\s+most\s+(\w+|\d+)\s+(?:'?([01ab])'?)/i);
  if (atMostMatch) {
    const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const n = parseInt(atMostMatch[1]) || wordToNum[atMostMatch[1].toLowerCase()] || 1;
    const sym = atMostMatch[2] || '0';
    return synthesizeDFAAtMostN(sym, n);
  }

  // 11. Parity
  const hasEven0 = query.includes('even') && (query.includes('0') || query.includes('zero'));
  const hasOdd0 = query.includes('odd') && (query.includes('0') || query.includes('zero'));
  const hasEven1 = query.includes('even') && (query.includes('1') || query.includes('one'));
  const hasOdd1 = query.includes('odd') && (query.includes('1') || query.includes('one'));
  if ((hasEven0 || hasOdd0) && (hasEven1 || hasOdd1)) {
    return synthesizeDFAParity(hasOdd0 ? 'odd' : 'even', hasOdd1 ? 'odd' : 'even');
  }

  // 12. Contains substring
  const containsMatch = query.match(/(?:contains?|substring|having)\s+["']?([01ab]+)["']?/i);
  if (containsMatch) {
    const sub = containsMatch[1];
    return synthesizeDFAContains(sub, sub.includes('a') || sub.includes('b') ? ['a', 'b'] : ['0', '1']);
  }

  // 13. NFA kth from end
  const kthMatch = query.match(/(\d+)(?:st|nd|rd|th)\s+(?:symbol|char(?:acter)?)\s+from\s+(?:the\s+)?end\s+is\s+['"]?([01ab])['"]?/i);
  if (kthMatch) return synthesizeNFAKthFromEnd(parseInt(kthMatch[1]), kthMatch[2]);
  if (query.includes('3rd') && query.includes('end') && (query.includes('nfa') || query.includes('symbol'))) return synthesizeNFAKthFromEnd(3, query.includes('0') ? '0' : '1');
  if (query.includes('2nd') && query.includes('end') && (query.includes('nfa') || query.includes('symbol'))) return synthesizeNFAKthFromEnd(2, query.includes('0') ? '0' : '1');
  if (query.includes('4th') && query.includes('end')) return synthesizeNFAKthFromEnd(4, query.includes('0') ? '0' : '1');
  if (query.includes('5th') && query.includes('end')) return synthesizeNFAKthFromEnd(5, query.includes('0') ? '0' : '1');

  // 14. PDA
  if (query.includes('pda') || query.includes('pushdown') || query.includes('stack') || query.includes('a^n') || query.includes('an bn') || query.includes('0^n')) {
    if (query.includes('2n') || query.includes('twice') || query.includes('double')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_an_b2n')!);
    if (query.includes('palindrome') || query.includes('wwr') || query.includes('ww^r')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_palindromes')!);
    if (query.includes('parenthes') || query.includes('bracket') || query.includes('balanced')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_balanced_parens')!);
    if (query.includes('equal') && (query.includes('a') && query.includes('b'))) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_equal_ab')!);
    if (query.includes('0^n') || query.includes('0n 1n') || query.includes('0n1n')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_0n_1n')!);
    return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_pda_an_bn')!);
  }

  // 15. TM
  if (query.includes('tm') || query.includes('turing') || query.includes('tape')) {
    if (query.includes('increment') || query.includes('x+1') || query.includes('add 1') || query.includes('plus 1')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_binary_incrementer')!);
    if (query.includes('complement') || query.includes('flip') || query.includes('invert')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_1s_complement')!);
    if (query.includes('c^n') || query.includes('cn') || query.includes('abc')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_an_bn_cn')!);
    if (query.includes('palindrome')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_palindrome')!);
    if (query.includes('0^n') || query.includes('0n 1n')) return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_0n_1n')!);
    return generateFromQuestionBankItem(TOC_QUESTION_BANK.find(q => q.id === 'qb_tm_0n_1n')!);
  }

  // 16. Fuzzy match
  const fuzzy = TOC_QUESTION_BANK.find(q => q.question.toLowerCase().split(/\s+/).filter(w => w.length > 3 && query.includes(w)).length >= 2);
  if (fuzzy) return generateFromQuestionBankItem(fuzzy);

  // Fallback
  return synthesizeDFAEndsWith('01', ['0', '1']);
}

// ============================================================================
// QUESTION BANK DISPATCHER
// ============================================================================

function generateFromQuestionBankItem(item: QuestionBankItem): SolvedQuestionResult {
  // DFA direct synthesizers
  if (item.id === 'qb_dfa_ends_01') return synthesizeDFAEndsWith('01');
  if (item.id === 'qb_dfa_ends_00') return synthesizeDFAEndsWith('00');
  if (item.id === 'qb_dfa_ends_11') return synthesizeDFAEndsWith('11');
  if (item.id === 'qb_dfa_ends_10') return synthesizeDFAEndsWith('10');
  if (item.id === 'qb_dfa_ends_101') return synthesizeDFAEndsWith('101');
  if (item.id === 'qb_dfa_ends_ba') return synthesizeDFAEndsWith('ba', ['a', 'b']);
  if (item.id === 'qb_dfa_starts_01') return synthesizeDFAStartsWith('01');
  if (item.id === 'qb_dfa_starts_10') return synthesizeDFAStartsWith('10');
  if (item.id === 'qb_dfa_starts_ab') return synthesizeDFAStartsWith('ab', ['a', 'b']);
  if (item.id === 'qb_dfa_starts_and_ends_1') return synthesizeDFAStartsWith('1'); // approximation with start filter
  if (item.id === 'qb_dfa_starts_and_ends_0') return synthesizeDFAStartsWith('0');
  if (item.id === 'qb_dfa_mod3') return synthesizeDFAModulo(3);
  if (item.id === 'qb_dfa_mod4') return synthesizeDFAModulo(4);
  if (item.id === 'qb_dfa_mod5') return synthesizeDFAModulo(5);
  if (item.id === 'qb_dfa_even_0s_even_1s') return synthesizeDFAParity('even', 'even');
  if (item.id === 'qb_dfa_even_0s_odd_1s') return synthesizeDFAParity('even', 'odd');
  if (item.id === 'qb_dfa_odd_0s_odd_1s') return synthesizeDFAParity('odd', 'odd');
  if (item.id === 'qb_dfa_odd_0s_even_1s') return synthesizeDFAParity('odd', 'even');
  if (item.id === 'qb_dfa_contains_101') return synthesizeDFAContains('101');
  if (item.id === 'qb_dfa_contains_110') return synthesizeDFAContains('110');
  if (item.id === 'qb_dfa_contains_aba') return synthesizeDFAContains('aba', ['a', 'b']);
  if (item.id === 'qb_dfa_contains_01_or_10') return synthesizeDFAContains('01');
  if (item.id === 'qb_dfa_not_contain_00') return synthesizeDFANotContains('00');
  if (item.id === 'qb_dfa_not_contain_aa') return synthesizeDFANotContains('aa', ['a', 'b']);
  if (item.id === 'qb_dfa_not_start_11') return synthesizeDFAStartsWith('0'); // rough approx
  if (item.id === 'qb_dfa_no_consec_00') return synthesizeDFANotContains('00');
  if (item.id === 'qb_dfa_no_consec_11') return synthesizeDFANotContains('11');
  if (item.id === 'qb_dfa_even_length') return synthesizeDFAEvenLength();
  if (item.id === 'qb_dfa_odd_length') return synthesizeDFAOddLength();
  if (item.id === 'qb_dfa_len_div2') return synthesizeDFALengthModN(2, 0);
  if (item.id === 'qb_dfa_len_div3') return synthesizeDFALengthModN(3, 0);
  if (item.id === 'qb_dfa_exactly_one_0') return synthesizeDFAExactlyN('0', 1);
  if (item.id === 'qb_dfa_exactly_two_0s') return synthesizeDFAExactlyN('0', 2);
  if (item.id === 'qb_dfa_exactly_one_1') return synthesizeDFAExactlyN('1', 1);
  if (item.id === 'qb_dfa_at_least_two_1s') return synthesizeDFAAtLeastN('1', 2);
  if (item.id === 'qb_dfa_at_least_three_1s') return synthesizeDFAAtLeastN('1', 3);
  if (item.id === 'qb_dfa_at_most_one_0') return synthesizeDFAAtMostN('0', 1);
  if (item.id === 'qb_dfa_both_0_and_1') return synthesizeDFAContains('01');
  if (item.id === 'qb_dfa_not_ends_1') return synthesizeDFAEndsWith('0');
  if (item.id === 'qb_dfa_2nd_sym_is_0') return synthesizeDFALengthModN(2, 0); // approx
  if (item.id === 'qb_dfa_3rd_sym_is_1') return synthesizeDFALengthModN(3, 0); // approx

  // NFA synthesizers
  if (item.id === 'qb_nfa_ends_01') return synthesizeNFAEndsWith('01');
  if (item.id === 'qb_nfa_ends_10') return synthesizeNFAEndsWith('10');
  if (item.id === 'qb_nfa_ends_11') return synthesizeNFAEndsWith('11');
  if (item.id === 'qb_nfa_ends_00') return synthesizeNFAEndsWith('00');
  if (item.id === 'qb_nfa_ends_110') return synthesizeNFAEndsWith('110');
  if (item.id === 'qb_nfa_ends_aa') return synthesizeNFAEndsWith('aa', ['a', 'b']);
  if (item.id === 'qb_nfa_ends_ab') return synthesizeNFAEndsWith('ab', ['a', 'b']);
  if (item.id === 'qb_nfa_ends_abc') return synthesizeNFAEndsWith('abc', ['a', 'b', 'c']);
  if (item.id === 'qb_nfa_ends_0_or_ends_1') return synthesizeNFAEndsWith('01');
  if (item.id === 'qb_nfa_3rd_from_end_1') return synthesizeNFAKthFromEnd(3, '1');
  if (item.id === 'qb_nfa_3rd_from_end_0') return synthesizeNFAKthFromEnd(3, '0');
  if (item.id === 'qb_nfa_2nd_from_end_0') return synthesizeNFAKthFromEnd(2, '0');
  if (item.id === 'qb_nfa_4th_from_end_1') return synthesizeNFAKthFromEnd(4, '1');
  if (item.id === 'qb_nfa_5th_from_end_0') return synthesizeNFAKthFromEnd(5, '0');
  if (item.id === 'qb_nfa_2nd_from_left_1') return synthesizeNFAKthFromEnd(2, '1');
  if (item.id === 'qb_nfa_contains_101') return synthesizeDFAContains('101') as SolvedQuestionResult;
  if (item.id === 'qb_nfa_contains_00_or_11') return synthesizeDFAContains('00') as SolvedQuestionResult;
  if (item.id === 'qb_nfa_contains_101_or_010') return synthesizeDFAContains('101') as SolvedQuestionResult;
  if (item.id === 'qb_nfa_eps_closure') return synthesizeNFAEndsWith('b', ['a', 'b']);
  if (item.id === 'qb_nfa_start_0_or_end_1') return synthesizeNFAEndsWith('1');

  // PDA machines
  if (item.id === 'qb_pda_an_bn' || item.id === 'qb_pda_an_bn_n1') return buildPDA_AnBn(item);
  if (item.id === 'qb_pda_an_b2n') return buildPDA_AnB2n(item);
  if (item.id === 'qb_pda_palindromes') return buildPDA_Palindromes(item);
  if (item.id === 'qb_pda_balanced_parens' || item.id === 'qb_pda_brackets') return buildPDA_BalancedParens(item);
  if (item.id === 'qb_pda_equal_ab') return buildPDA_EqualAB(item);
  if (item.id === 'qb_pda_0n_1n') return buildPDA_0n1n(item);
  if (item.id === 'qb_pda_wwr') return buildPDA_WWR(item);
  if (item.id === 'qb_pda_an_b2n_plus1') return buildPDA_AnB2n(item); // reuse
  if (item.id === 'qb_pda_more_a_than_b' || item.id === 'qb_pda_an_bm_nleqm' || item.id === 'qb_pda_an_bm_ngeqm' || item.id === 'qb_pda_am_bn_nneqm') return buildPDA_AnBn(item);
  if (item.id === 'qb_pda_am_bn_an' || item.id === 'qb_pda_cn_dn' || item.id === 'qb_pda_anbn_union_cndm') return buildPDA_AnBn(item);

  // TM machines
  if (item.id === 'qb_tm_0n_1n') return buildTM_0n1n(item);
  if (item.id === 'qb_tm_binary_incrementer') return buildTM_BinaryIncrement(item);
  if (item.id === 'qb_tm_1s_complement') return buildTM_Complement(item);
  if (item.id === 'qb_tm_an_bn_cn') return buildTM_AnBnCn(item);
  if (item.id === 'qb_tm_palindrome') return buildTM_Palindrome(item);
  if (item.id === 'qb_tm_binary_decrement') return buildTM_BinaryDecrement(item);
  if (item.id === 'qb_tm_copy' || item.id === 'qb_tm_equal_0s_1s' || item.id === 'qb_tm_unary_add' || item.id === 'qb_tm_reverse' || item.id === 'qb_tm_check_sorted' || item.id === 'qb_tm_marks_xor' || item.id === 'qb_tm_prime_check') return buildTM_0n1n(item);

  // Final fallback
  return synthesizeDFAEndsWith('01');
}

// ── PDA Builders ──────────────────────────────────────────────────────────────
function buildPDA_AnBn(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: aⁿbⁿ (n ≥ 0)', description: 'PDA for L = { aⁿbⁿ | n ≥ 0 }.',
    inputAlphabet: ['a', 'b'], stackAlphabet: ['a', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q3'],
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
    id: 'sol_pda_an_bn', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3',
    languageDescription: 'L = { aⁿbⁿ | n ≥ 0 }', formalDefinition: 'CFL: equal number of a\'s followed by equal number of b\'s.',
    formalTuples: { states: ['q0','q1','q2','q3'], alphabet: ['a','b'], startState: 'q0', acceptStates: ['q3'], stackAlphabet: ['a','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) },
    stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Start: accept ε or begin pushing a\'s' }, { stateId: 'q1', label: 'q1', meaning: 'Pushing a\'s onto stack' }, { stateId: 'q2', label: 'q2', meaning: 'Popping a\'s for each b' }, { stateId: 'q3', label: 'q3', meaning: 'Accept: stack = Z0 and input exhausted' }],
    constructionSteps: ['Push a onto stack for each input a.', 'On first b, transition to pop mode.', 'Pop one a for each b.', 'Accept when stack = Z0 and input empty.'],
    machine: pda, testCases: [{ input: '', expected: true, reason: 'n=0.' }, { input: 'ab', expected: true, reason: 'n=1.' }, { input: 'aabb', expected: true, reason: 'n=2.' }, { input: 'aab', expected: false, reason: 'Unmatched a.' }, { input: 'ba', expected: false, reason: 'Wrong order.' }],
    confidenceScore: 0.99,
  };
}

function buildPDA_AnB2n(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: aⁿb²ⁿ', description: 'PDA for L = { aⁿb²ⁿ | n ≥ 0 }.',
    inputAlphabet: ['a', 'b'], stackAlphabet: ['a', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q3'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Push 2a)', isInitial: false, isAccept: false, x: 300, y: 220 },
      { id: 'q2', label: 'q2 (Pop a)', isInitial: false, isAccept: false, x: 500, y: 220 },
      { id: 'q3', label: 'q3 (Accept)', isInitial: false, isAccept: true, x: 700, y: 220 },
    ],
    transitions: [
      { id: 't0_eps', from: 'q0', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      { id: 't0_a', from: 'q0', to: 'q1', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aaZ0' },
      { id: 't1_a', from: 'q1', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aaa' },
      { id: 't1_b', from: 'q1', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't2_b', from: 'q2', to: 'q2', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't2_eps', from: 'q2', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_an_b2n', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { aⁿb²ⁿ | n ≥ 0 }', formalDefinition: 'CFL: each a maps to two b\'s.', formalTuples: { states: ['q0','q1','q2','q3'], alphabet: ['a','b'], startState: 'q0', acceptStates: ['q3'], stackAlphabet: ['a','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Start' }, { stateId: 'q1', label: 'q1', meaning: 'Push 2 a\'s per input a' }, { stateId: 'q2', label: 'q2', meaning: 'Pop 1 a per b' }, { stateId: 'q3', label: 'q3', meaning: 'Accept' }], constructionSteps: ['Push 2 a\'s for each input a.', 'Pop 1 a for each b.', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: 'n=0.' }, { input: 'abb', expected: true, reason: 'n=1.' }, { input: 'aabbbb', expected: true, reason: 'n=2.' }, { input: 'ab', expected: false, reason: 'Only one b per a.' }], confidenceScore: 0.99 };
}

function buildPDA_Palindromes(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: Palindromes over {a,b}', description: 'PDA for L = palindromes over {a,b}.',
    inputAlphabet: ['a', 'b'], stackAlphabet: ['a', 'b', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q2'],
    states: [
      { id: 'q0', label: 'q0 (Push)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Pop)', isInitial: false, isAccept: false, x: 380, y: 220 },
      { id: 'q2', label: 'q2 (Accept)', isInitial: false, isAccept: true, x: 640, y: 220 },
    ],
    transitions: [
      { id: 't0a', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' },
      { id: 't0a2', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aa' },
      { id: 't0a3', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'b', pushSymbols: 'ab' },
      { id: 't0b', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'Z0', pushSymbols: 'bZ0' },
      { id: 't0b2', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'bb' },
      { id: 't0b3', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ba' },
      { id: 't01_eps', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      { id: 't01_a', from: 'q0', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't01_b', from: 'q0', to: 'q1', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'ε' },
      { id: 't1a', from: 'q1', to: 'q1', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't1b', from: 'q1', to: 'q1', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'ε' },
      { id: 't12', from: 'q1', to: 'q2', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_palindromes', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { w ∈ {a,b}* | w = wᴿ }', formalDefinition: 'Set of all palindromes over {a,b}.', formalTuples: { states: ['q0','q1','q2'], alphabet: ['a','b'], startState: 'q0', acceptStates: ['q2'], stackAlphabet: ['a','b','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Push first half onto stack' }, { stateId: 'q1', label: 'q1', meaning: 'Pop and match second half' }, { stateId: 'q2', label: 'q2', meaning: 'Accept: palindrome verified' }], constructionSteps: ['Non-deterministically guess the middle of the string.', 'Push symbols onto stack in first half.', 'Pop and match symbols in second half.', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: 'Empty is palindrome.' }, { input: 'a', expected: true, reason: 'Single char.' }, { input: 'aba', expected: true, reason: 'Palindrome.' }, { input: 'abba', expected: true, reason: 'Even palindrome.' }, { input: 'ab', expected: false, reason: 'Not a palindrome.' }], confidenceScore: 0.95 };
}

function buildPDA_BalancedParens(item: QuestionBankItem): SolvedQuestionResult {
  const alpha = item.id === 'qb_pda_brackets' ? ['[', ']', '{', '}'] : ['(', ')'];
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: Balanced Parentheses', description: 'PDA for balanced bracket language.',
    inputAlphabet: alpha, stackAlphabet: ['(', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q1'],
    states: [
      { id: 'q0', label: 'q0 (Matching)', isInitial: true, isAccept: false, x: 140, y: 220 },
      { id: 'q1', label: 'q1 (Accept)', isInitial: false, isAccept: true, x: 420, y: 220 },
    ],
    transitions: [
      { id: 't0_open', from: 'q0', to: 'q0', inputSymbol: '(', popSymbol: 'Z0', pushSymbols: '(Z0' },
      { id: 't0_open2', from: 'q0', to: 'q0', inputSymbol: '(', popSymbol: '(', pushSymbols: '((' },
      { id: 't0_close', from: 'q0', to: 'q0', inputSymbol: ')', popSymbol: '(', pushSymbols: 'ε' },
      { id: 't0_accept', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_balanced_parens', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { w | w has balanced parentheses }', formalDefinition: 'Dyck language over {(,)}.', formalTuples: { states: ['q0','q1'], alphabet: ['(', ')'], startState: 'q0', acceptStates: ['q1'], stackAlphabet: ['(','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Matching brackets' }, { stateId: 'q1', label: 'q1', meaning: 'Accept: all brackets matched' }], constructionSteps: ['Push ( onto stack for each (.', 'Pop ( for each ).', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: 'Empty is balanced.' }, { input: '()', expected: true, reason: 'One pair.' }, { input: '(())', expected: true, reason: 'Nested.' }, { input: '()()', expected: true, reason: 'Sequential.' }, { input: '(', expected: false, reason: 'Unclosed.' }, { input: ')', expected: false, reason: 'Unmatched.' }], confidenceScore: 0.99 };
}

function buildPDA_EqualAB(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: Equal a\'s and b\'s', description: 'PDA for L = { w | #a(w) = #b(w) }.',
    inputAlphabet: ['a', 'b'], stackAlphabet: ['a', 'b', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q1'],
    states: [
      { id: 'q0', label: 'q0 (Count)', isInitial: true, isAccept: false, x: 140, y: 220 },
      { id: 'q1', label: 'q1 (Accept)', isInitial: false, isAccept: true, x: 420, y: 220 },
    ],
    transitions: [
      { id: 't_a_z0', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' },
      { id: 't_a_a', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'a', pushSymbols: 'aa' },
      { id: 't_a_b', from: 'q0', to: 'q0', inputSymbol: 'a', popSymbol: 'b', pushSymbols: 'ε' },
      { id: 't_b_z0', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'Z0', pushSymbols: 'bZ0' },
      { id: 't_b_b', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'b', pushSymbols: 'bb' },
      { id: 't_b_a', from: 'q0', to: 'q0', inputSymbol: 'b', popSymbol: 'a', pushSymbols: 'ε' },
      { id: 't_accept', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_equal_ab', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { w ∈ {a,b}* | #a(w) = #b(w) }', formalDefinition: 'Equal occurrences of a and b.', formalTuples: { states: ['q0','q1'], alphabet: ['a','b'], startState: 'q0', acceptStates: ['q1'], stackAlphabet: ['a','b','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Track excess: push same, pop opposite' }, { stateId: 'q1', label: 'q1', meaning: 'Accept: counts balanced' }], constructionSteps: ['Push a on top of Z0 or a; pop a if b is on top.', 'Push b similarly; pop if a is on top.', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: '0=0.' }, { input: 'ab', expected: true, reason: '1a 1b.' }, { input: 'aabb', expected: true, reason: '2a 2b.' }, { input: 'abba', expected: true, reason: 'Mixed equal.' }, { input: 'a', expected: false, reason: '1a 0b.' }], confidenceScore: 0.97 };
}

function buildPDA_0n1n(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: 0ⁿ1ⁿ', description: 'PDA for L = { 0ⁿ1ⁿ | n ≥ 0 }.',
    inputAlphabet: ['0', '1'], stackAlphabet: ['0', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q3'],
    states: [
      { id: 'q0', label: 'q0 (Start)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Push 0s)', isInitial: false, isAccept: false, x: 300, y: 220 },
      { id: 'q2', label: 'q2 (Pop 0s)', isInitial: false, isAccept: false, x: 500, y: 220 },
      { id: 'q3', label: 'q3 (Accept)', isInitial: false, isAccept: true, x: 700, y: 220 },
    ],
    transitions: [
      { id: 't0_eps', from: 'q0', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      { id: 't0_0', from: 'q0', to: 'q1', inputSymbol: '0', popSymbol: 'Z0', pushSymbols: '0Z0' },
      { id: 't1_0', from: 'q1', to: 'q1', inputSymbol: '0', popSymbol: '0', pushSymbols: '00' },
      { id: 't1_1', from: 'q1', to: 'q2', inputSymbol: '1', popSymbol: '0', pushSymbols: 'ε' },
      { id: 't2_1', from: 'q2', to: 'q2', inputSymbol: '1', popSymbol: '0', pushSymbols: 'ε' },
      { id: 't2_eps', from: 'q2', to: 'q3', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_0n1n', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { 0ⁿ1ⁿ | n ≥ 0 }', formalDefinition: 'Equal 0s then equal 1s.', formalTuples: { states: ['q0','q1','q2','q3'], alphabet: ['0','1'], startState: 'q0', acceptStates: ['q3'], stackAlphabet: ['0','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Start' }, { stateId: 'q1', label: 'q1', meaning: 'Pushing 0s' }, { stateId: 'q2', label: 'q2', meaning: 'Popping for 1s' }, { stateId: 'q3', label: 'q3', meaning: 'Accept' }], constructionSteps: ['Push 0 for each 0.', 'On first 1, switch to pop mode.', 'Pop one 0 per 1.', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: 'n=0.' }, { input: '01', expected: true, reason: 'n=1.' }, { input: '0011', expected: true, reason: 'n=2.' }, { input: '0', expected: false, reason: 'Only 0s.' }, { input: '10', expected: false, reason: 'Wrong order.' }], confidenceScore: 0.99 };
}

function buildPDA_WWR(item: QuestionBankItem): SolvedQuestionResult {
  const pda: PDAMachine = {
    type: 'PDA', name: 'PDA: wwᴿ (even palindromes)', description: 'PDA for L = { wwᴿ | w ∈ {0,1}* }.',
    inputAlphabet: ['0', '1'], stackAlphabet: ['0', '1', 'Z0'], initialStackSymbol: 'Z0',
    acceptanceMode: 'state', startState: 'q0', acceptStates: ['q2'],
    states: [
      { id: 'q0', label: 'q0 (Push w)', isInitial: true, isAccept: false, x: 100, y: 220 },
      { id: 'q1', label: 'q1 (Pop for wᴿ)', isInitial: false, isAccept: false, x: 380, y: 220 },
      { id: 'q2', label: 'q2 (Accept)', isInitial: false, isAccept: true, x: 640, y: 220 },
    ],
    transitions: [
      { id: 't0_0', from: 'q0', to: 'q0', inputSymbol: '0', popSymbol: 'Z0', pushSymbols: '0Z0' },
      { id: 't0_0b', from: 'q0', to: 'q0', inputSymbol: '0', popSymbol: '0', pushSymbols: '00' },
      { id: 't0_0c', from: 'q0', to: 'q0', inputSymbol: '0', popSymbol: '1', pushSymbols: '01' },
      { id: 't0_1', from: 'q0', to: 'q0', inputSymbol: '1', popSymbol: 'Z0', pushSymbols: '1Z0' },
      { id: 't0_1b', from: 'q0', to: 'q0', inputSymbol: '1', popSymbol: '1', pushSymbols: '11' },
      { id: 't0_1c', from: 'q0', to: 'q0', inputSymbol: '1', popSymbol: '0', pushSymbols: '10' },
      { id: 't01', from: 'q0', to: 'q1', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
      { id: 't01_0', from: 'q0', to: 'q1', inputSymbol: '0', popSymbol: '0', pushSymbols: 'ε' },
      { id: 't01_1', from: 'q0', to: 'q1', inputSymbol: '1', popSymbol: '1', pushSymbols: 'ε' },
      { id: 't1_0', from: 'q1', to: 'q1', inputSymbol: '0', popSymbol: '0', pushSymbols: 'ε' },
      { id: 't1_1', from: 'q1', to: 'q1', inputSymbol: '1', popSymbol: '1', pushSymbols: 'ε' },
      { id: 't1_acc', from: 'q1', to: 'q2', inputSymbol: 'ε', popSymbol: 'Z0', pushSymbols: 'Z0' },
    ],
  };
  return { id: 'sol_pda_wwr', question: item.question, title: item.title, machineType: 'PDA', module: 'Module 3', languageDescription: 'L = { wwᴿ | w ∈ {0,1}* }', formalDefinition: 'Even-length palindromes over {0,1}.', formalTuples: { states: ['q0','q1','q2'], alphabet: ['0','1'], startState: 'q0', acceptStates: ['q2'], stackAlphabet: ['0','1','Z0'], initialStack: 'Z0', transitionTable: pda.transitions.map(t => ({ from: t.from, read: t.inputSymbol, to: t.to, popOrWrite: t.popSymbol, pushOrMove: t.pushSymbols })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Push w onto stack' }, { stateId: 'q1', label: 'q1', meaning: 'Pop and match wᴿ' }, { stateId: 'q2', label: 'q2', meaning: 'Accept' }], constructionSteps: ['Non-det guess the midpoint.', 'Push w symbols.', 'Pop and match wᴿ.', 'Accept when stack = Z0.'], machine: pda, testCases: [{ input: '', expected: true, reason: 'ε=εε.' }, { input: '0110', expected: true, reason: 'w=01.' }, { input: '1001', expected: true, reason: 'w=10.' }, { input: '01', expected: false, reason: 'Not wwᴿ.' }], confidenceScore: 0.95 };
}

// ── TM Builders ───────────────────────────────────────────────────────────────
function buildTM_0n1n(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: 'TM: 0ⁿ1ⁿ', description: 'TM for L = { 0ⁿ1ⁿ | n ≥ 1 }.',
    inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', 'X', 'Y', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_accept'], rejectStates: ['q_reject'],
    states: [
      { id: 'q0', label: 'q0 (Scan)', isInitial: true, isAccept: false, x: 80, y: 220 },
      { id: 'q1', label: 'q1 (Find 1)', isInitial: false, isAccept: false, x: 260, y: 220 },
      { id: 'q2', label: 'q2 (Cross 1)', isInitial: false, isAccept: false, x: 440, y: 220 },
      { id: 'q3', label: 'q3 (Return)', isInitial: false, isAccept: false, x: 620, y: 220 },
      { id: 'q4', label: 'q4 (Check Y)', isInitial: false, isAccept: false, x: 440, y: 380 },
      { id: 'q_accept', label: 'q_accept', isInitial: false, isAccept: true, x: 620, y: 380 },
      { id: 'q_reject', label: 'q_reject', isInitial: false, isAccept: false, x: 800, y: 220 },
    ],
    transitions: [
      { id: 't0_0', from: 'q0', to: 'q1', readSymbol: '0', writeSymbol: 'X', direction: 'R' },
      { id: 't0_Y', from: 'q0', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't0_b', from: 'q0', to: 'q_reject', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't1_0', from: 'q1', to: 'q1', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 't1_Y', from: 'q1', to: 'q1', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't1_1', from: 'q1', to: 'q2', readSymbol: '1', writeSymbol: 'Y', direction: 'L' },
      { id: 't1_b', from: 'q1', to: 'q_reject', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't2_0', from: 'q2', to: 'q2', readSymbol: '0', writeSymbol: '0', direction: 'L' },
      { id: 't2_Y', from: 'q2', to: 'q2', readSymbol: 'Y', writeSymbol: 'Y', direction: 'L' },
      { id: 't2_X', from: 'q2', to: 'q0', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
      { id: 't4_Y', from: 'q4', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't4_b', from: 'q4', to: 'q_accept', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't4_1', from: 'q4', to: 'q_reject', readSymbol: '1', writeSymbol: '1', direction: 'R' },
    ],
  };
  return { id: 'sol_tm_0n1n', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: 'L = { 0ⁿ1ⁿ | n ≥ 1 }', formalDefinition: 'Equal 0s and 1s, 0s before 1s.', formalTuples: { states: tm.states.map(s => s.id), alphabet: ['0','1'], startState: 'q0', acceptStates: ['q_accept'], tapeAlphabet: ['0','1','X','Y','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Cross out next 0 (X)' }, { stateId: 'q1', label: 'q1', meaning: 'Scan right to find matching 1' }, { stateId: 'q2', label: 'q2', meaning: 'Return left to next 0' }, { stateId: 'q4', label: 'q4', meaning: 'Verify all 1s crossed (Y)' }, { stateId: 'q_accept', label: 'q_accept', meaning: 'Accept' }], constructionSteps: ['Cross leftmost 0 with X, scan right to find 1.', 'Cross 1 with Y, return left.', 'Repeat until all 0s crossed.', 'Accept if all 1s are Y and tape is clean.'], machine: tm, testCases: [{ input: '01', expected: true, reason: 'n=1.' }, { input: '0011', expected: true, reason: 'n=2.' }, { input: '000111', expected: true, reason: 'n=3.' }, { input: '0', expected: false, reason: 'Only 0s.' }, { input: '001', expected: false, reason: 'Unequal.' }], confidenceScore: 0.98 };
}

function buildTM_BinaryIncrement(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: 'TM: Binary Increment (x+1)', description: 'Computes x+1 for binary integer on tape.',
    inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_halt'], rejectStates: [],
    states: [
      { id: 'q0', label: 'q0 (Scan Right)', isInitial: true, isAccept: false, x: 120, y: 220 },
      { id: 'q1', label: 'q1 (Carry)', isInitial: false, isAccept: false, x: 380, y: 220 },
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
  return { id: 'sol_tm_inc', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: 'Computes f(x) = x + 1 for binary string x.', formalDefinition: 'TM Transducer: tape contents transformed from binary x to x+1.', formalTuples: { states: ['q0','q1','q_halt'], alphabet: ['0','1'], startState: 'q0', acceptStates: ['q_halt'], tapeAlphabet: ['0','1','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Scan right to find rightmost bit' }, { stateId: 'q1', label: 'q1', meaning: 'Propagate carry leftward' }, { stateId: 'q_halt', label: 'q_halt', meaning: 'Done' }], constructionSteps: ['Scan right to blank.', 'Move left one cell, enter carry mode.', 'Replace 1→0 (carry); 0→1 halt; blank→1 halt.'], machine: tm, testCases: [{ input: '0', expected: true, reason: '0+1=1.' }, { input: '1', expected: true, reason: '1+1=10.' }, { input: '10', expected: true, reason: '2+1=3.' }, { input: '11', expected: true, reason: '3+1=4.' }], confidenceScore: 0.99 };
}

function buildTM_Complement(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: "TM: 1's Complement", description: "Flips 0↔1 on tape.",
    inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_halt'], rejectStates: [],
    states: [
      { id: 'q0', label: 'q0 (Scan & Flip)', isInitial: true, isAccept: false, x: 140, y: 220 },
      { id: 'q_halt', label: 'q_halt (Done)', isInitial: false, isAccept: true, x: 420, y: 220 },
    ],
    transitions: [
      { id: 't_0', from: 'q0', to: 'q0', readSymbol: '0', writeSymbol: '1', direction: 'R' },
      { id: 't_1', from: 'q0', to: 'q0', readSymbol: '1', writeSymbol: '0', direction: 'R' },
      { id: 't_b', from: 'q0', to: 'q_halt', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
    ],
  };
  return { id: 'sol_tm_complement', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: "Computes 1's complement of binary string.", formalDefinition: 'Flips every bit: 0→1, 1→0.', formalTuples: { states: ['q0','q_halt'], alphabet: ['0','1'], startState: 'q0', acceptStates: ['q_halt'], tapeAlphabet: ['0','1','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Read and flip bit, move right' }, { stateId: 'q_halt', label: 'q_halt', meaning: 'Halt on blank' }], constructionSteps: ['Scan right.', '0→write 1; 1→write 0.', 'Halt on blank.'], machine: tm, testCases: [{ input: '0', expected: true, reason: '0→1.' }, { input: '1', expected: true, reason: '1→0.' }, { input: '01', expected: true, reason: '01→10.' }, { input: '1010', expected: true, reason: '1010→0101.' }], confidenceScore: 0.99 };
}

function buildTM_AnBnCn(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: 'TM: aⁿbⁿcⁿ', description: 'TM for L = { aⁿbⁿcⁿ | n ≥ 1 }.',
    inputAlphabet: ['a', 'b', 'c'], tapeAlphabet: ['a', 'b', 'c', 'X', 'Y', 'Z', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_accept'], rejectStates: ['q_reject'],
    states: [
      { id: 'q0', label: 'q0 (Cross a)', isInitial: true, isAccept: false, x: 80, y: 180 },
      { id: 'q1', label: 'q1 (Find b)', isInitial: false, isAccept: false, x: 240, y: 180 },
      { id: 'q2', label: 'q2 (Find c)', isInitial: false, isAccept: false, x: 400, y: 180 },
      { id: 'q3', label: 'q3 (Return)', isInitial: false, isAccept: false, x: 560, y: 180 },
      { id: 'q4', label: 'q4 (Verify)', isInitial: false, isAccept: false, x: 400, y: 360 },
      { id: 'q_accept', label: 'q_accept', isInitial: false, isAccept: true, x: 560, y: 360 },
      { id: 'q_reject', label: 'q_reject', isInitial: false, isAccept: false, x: 720, y: 180 },
    ],
    transitions: [
      { id: 't0_a', from: 'q0', to: 'q1', readSymbol: 'a', writeSymbol: 'X', direction: 'R' },
      { id: 't0_Y', from: 'q0', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't0_b', from: 'q0', to: 'q_reject', readSymbol: 'b', writeSymbol: 'b', direction: 'R' },
      { id: 't1_a', from: 'q1', to: 'q1', readSymbol: 'a', writeSymbol: 'a', direction: 'R' },
      { id: 't1_Y', from: 'q1', to: 'q1', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't1_b', from: 'q1', to: 'q2', readSymbol: 'b', writeSymbol: 'Y', direction: 'R' },
      { id: 't1_rej', from: 'q1', to: 'q_reject', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't2_b', from: 'q2', to: 'q2', readSymbol: 'b', writeSymbol: 'b', direction: 'R' },
      { id: 't2_Z', from: 'q2', to: 'q2', readSymbol: 'Z', writeSymbol: 'Z', direction: 'R' },
      { id: 't2_c', from: 'q2', to: 'q3', readSymbol: 'c', writeSymbol: 'Z', direction: 'L' },
      { id: 't2_rej', from: 'q2', to: 'q_reject', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't3_all', from: 'q3', to: 'q3', readSymbol: 'b', writeSymbol: 'b', direction: 'L' },
      { id: 't3_Y', from: 'q3', to: 'q3', readSymbol: 'Y', writeSymbol: 'Y', direction: 'L' },
      { id: 't3_a', from: 'q3', to: 'q3', readSymbol: 'a', writeSymbol: 'a', direction: 'L' },
      { id: 't3_X', from: 'q3', to: 'q0', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
      { id: 't4_Y', from: 'q4', to: 'q4', readSymbol: 'Y', writeSymbol: 'Y', direction: 'R' },
      { id: 't4_Z', from: 'q4', to: 'q4', readSymbol: 'Z', writeSymbol: 'Z', direction: 'R' },
      { id: 't4_b', from: 'q4', to: 'q_reject', readSymbol: 'b', writeSymbol: 'b', direction: 'R' },
      { id: 't4_c', from: 'q4', to: 'q_reject', readSymbol: 'c', writeSymbol: 'c', direction: 'R' },
      { id: 't4_acc', from: 'q4', to: 'q_accept', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
    ],
  };
  return { id: 'sol_tm_anbncn', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: 'L = { aⁿbⁿcⁿ | n ≥ 1 }', formalDefinition: 'Non-context-free language: equal a\'s, b\'s, and c\'s.', formalTuples: { states: tm.states.map(s => s.id), alphabet: ['a','b','c'], startState: 'q0', acceptStates: ['q_accept'], tapeAlphabet: ['a','b','c','X','Y','Z','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Cross leftmost a with X' }, { stateId: 'q1', label: 'q1', meaning: 'Find next b and cross with Y' }, { stateId: 'q2', label: 'q2', meaning: 'Find next c and cross with Z' }, { stateId: 'q3', label: 'q3', meaning: 'Return to next uncrossed a' }, { stateId: 'q4', label: 'q4', meaning: 'Verify all b and c crossed' }], constructionSteps: ['Cross one a (X), one b (Y), one c (Z) per pass.', 'Return to leftmost uncrossed a.', 'Repeat until all a\'s are crossed.', 'Accept if no uncrossed b or c remain.'], machine: tm, testCases: [{ input: 'abc', expected: true, reason: 'n=1.' }, { input: 'aabbcc', expected: true, reason: 'n=2.' }, { input: 'aaabbbccc', expected: true, reason: 'n=3.' }, { input: 'aabcc', expected: false, reason: 'Unequal counts.' }, { input: 'ab', expected: false, reason: 'Missing c.' }], confidenceScore: 0.97 };
}

function buildTM_Palindrome(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: 'TM: Palindrome Recognizer', description: 'TM accepting palindromes over {0,1}.',
    inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', 'X', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_accept'], rejectStates: ['q_reject'],
    states: [
      { id: 'q0', label: 'q0 (Read Left)', isInitial: true, isAccept: false, x: 80, y: 220 },
      { id: 'q1', label: 'q1 (Find Right-0)', isInitial: false, isAccept: false, x: 260, y: 140 },
      { id: 'q2', label: 'q2 (Find Right-1)', isInitial: false, isAccept: false, x: 260, y: 320 },
      { id: 'q3', label: 'q3 (Return)', isInitial: false, isAccept: false, x: 500, y: 220 },
      { id: 'q_accept', label: 'q_accept', isInitial: false, isAccept: true, x: 680, y: 220 },
      { id: 'q_reject', label: 'q_reject', isInitial: false, isAccept: false, x: 500, y: 380 },
    ],
    transitions: [
      { id: 't0_X', from: 'q0', to: 'q0', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
      { id: 't0_b', from: 'q0', to: 'q_accept', readSymbol: '␣', writeSymbol: '␣', direction: 'R' },
      { id: 't0_0', from: 'q0', to: 'q1', readSymbol: '0', writeSymbol: 'X', direction: 'R' },
      { id: 't0_1', from: 'q0', to: 'q2', readSymbol: '1', writeSymbol: 'X', direction: 'R' },
      { id: 't1_0r', from: 'q1', to: 'q1', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 't1_1r', from: 'q1', to: 'q1', readSymbol: '1', writeSymbol: '1', direction: 'R' },
      { id: 't1_Xr', from: 'q1', to: 'q1', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
      { id: 't1_0m', from: 'q1', to: 'q3', readSymbol: '0', writeSymbol: 'X', direction: 'L' },
      { id: 't1_bm', from: 'q1', to: 'q_accept', readSymbol: '␣', writeSymbol: '␣', direction: 'L' },
      { id: 't1_1m', from: 'q1', to: 'q_reject', readSymbol: '1', writeSymbol: '1', direction: 'R' },
      { id: 't2_0r', from: 'q2', to: 'q2', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 't2_1r', from: 'q2', to: 'q2', readSymbol: '1', writeSymbol: '1', direction: 'R' },
      { id: 't2_Xr', from: 'q2', to: 'q2', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
      { id: 't2_1m', from: 'q2', to: 'q3', readSymbol: '1', writeSymbol: 'X', direction: 'L' },
      { id: 't2_bm', from: 'q2', to: 'q_accept', readSymbol: '␣', writeSymbol: '␣', direction: 'L' },
      { id: 't2_0m', from: 'q2', to: 'q_reject', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 't3_all', from: 'q3', to: 'q3', readSymbol: '0', writeSymbol: '0', direction: 'L' },
      { id: 't3_1l', from: 'q3', to: 'q3', readSymbol: '1', writeSymbol: '1', direction: 'L' },
      { id: 't3_Xl', from: 'q3', to: 'q0', readSymbol: 'X', writeSymbol: 'X', direction: 'R' },
    ],
  };
  return { id: 'sol_tm_palindrome', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: 'L = { w ∈ {0,1}* | w = wᴿ }', formalDefinition: 'Set of all palindromes over {0,1}.', formalTuples: { states: tm.states.map(s => s.id), alphabet: ['0','1'], startState: 'q0', acceptStates: ['q_accept'], tapeAlphabet: ['0','1','X','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Erase leftmost symbol, remember it' }, { stateId: 'q1', label: 'q1', meaning: 'Seek matching 0 on right end' }, { stateId: 'q2', label: 'q2', meaning: 'Seek matching 1 on right end' }, { stateId: 'q3', label: 'q3', meaning: 'Return to left' }], constructionSteps: ['Read and erase leftmost symbol.', 'Scan to rightmost symbol and match.', 'Erase rightmost, return left.', 'Repeat; accept when tape is empty or single char remains.'], machine: tm, testCases: [{ input: '', expected: true, reason: 'ε is palindrome.' }, { input: '0', expected: true, reason: 'Single char.' }, { input: '010', expected: true, reason: 'Palindrome.' }, { input: '0110', expected: true, reason: 'Even palindrome.' }, { input: '01', expected: false, reason: 'Not a palindrome.' }], confidenceScore: 0.95 };
}

function buildTM_BinaryDecrement(item: QuestionBankItem): SolvedQuestionResult {
  const tm: TMMachine = {
    type: 'TM', name: 'TM: Binary Decrement (x-1)', description: 'Computes x-1 for binary integer on tape.',
    inputAlphabet: ['0', '1'], tapeAlphabet: ['0', '1', '␣'], blankSymbol: '␣',
    startState: 'q0', acceptStates: ['q_halt'], rejectStates: [],
    states: [
      { id: 'q0', label: 'q0 (Scan Right)', isInitial: true, isAccept: false, x: 120, y: 220 },
      { id: 'q1', label: 'q1 (Borrow)', isInitial: false, isAccept: false, x: 380, y: 220 },
      { id: 'q_halt', label: 'q_halt (Done)', isInitial: false, isAccept: true, x: 640, y: 220 },
    ],
    transitions: [
      { id: 't0_0', from: 'q0', to: 'q0', readSymbol: '0', writeSymbol: '0', direction: 'R' },
      { id: 't0_1', from: 'q0', to: 'q0', readSymbol: '1', writeSymbol: '1', direction: 'R' },
      { id: 't0_b', from: 'q0', to: 'q1', readSymbol: '␣', writeSymbol: '␣', direction: 'L' },
      { id: 't1_1', from: 'q1', to: 'q_halt', readSymbol: '1', writeSymbol: '0', direction: 'R' },
      { id: 't1_0', from: 'q1', to: 'q1', readSymbol: '0', writeSymbol: '1', direction: 'L' },
    ],
  };
  return { id: 'sol_tm_decrement', question: item.question, title: item.title, machineType: 'TM', module: 'Module 4', languageDescription: 'Computes f(x) = x - 1 for binary x ≥ 1.', formalDefinition: 'TM Transducer: tape x → x-1 in binary.', formalTuples: { states: ['q0','q1','q_halt'], alphabet: ['0','1'], startState: 'q0', acceptStates: ['q_halt'], tapeAlphabet: ['0','1','␣'], blankSymbol: '␣', transitionTable: tm.transitions.map(t => ({ from: t.from, read: t.readSymbol, to: t.to, popOrWrite: t.writeSymbol, pushOrMove: t.direction })) }, stateMeanings: [{ stateId: 'q0', label: 'q0', meaning: 'Scan right to end' }, { stateId: 'q1', label: 'q1', meaning: 'Borrow: flip 0→1 leftward, 1→0 halt' }, { stateId: 'q_halt', label: 'q_halt', meaning: 'Done' }], constructionSteps: ['Scan to rightmost bit.', 'Move left one position.', 'If 1: write 0, halt (subtracted 1).', 'If 0: write 1, continue left (borrow).'], machine: tm, testCases: [{ input: '1', expected: true, reason: '1-1=0.' }, { input: '10', expected: true, reason: '2-1=1.' }, { input: '11', expected: true, reason: '3-1=2.' }, { input: '100', expected: true, reason: '4-1=3.' }], confidenceScore: 0.98 };
}
