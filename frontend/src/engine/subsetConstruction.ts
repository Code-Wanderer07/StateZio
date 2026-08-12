import { AutomataState, DFAMachine, DFATransition, NFAMachine, SubsetConstructionResult, SubsetRow } from '../types/automata';
import { computeEpsilonClosure, isEpsilon } from './nfaEngine';

/**
 * Converts any NFA (with or without ε-transitions) to an equivalent DFA using Powerset Construction
 */
export function convertNFAToDFA(rawNfa: NFAMachine): SubsetConstructionResult {
  const nfa = {
    ...rawNfa,
    states: rawNfa.states || [],
    transitions: rawNfa.transitions || [],
    acceptStates: rawNfa.acceptStates || [],
    alphabet: rawNfa.alphabet || [],
  };

  const stepsExplanation: string[] = [];
  
  // 1. Identify input alphabet excluding epsilon
  const alphabetSet = new Set<string>();
  for (const sym of nfa.alphabet) {
    if (!isEpsilon(sym)) alphabetSet.add(sym);
  }
  for (const t of nfa.transitions) {
    if (!isEpsilon(t.symbol)) alphabetSet.add(t.symbol);
  }
  const alphabet = Array.from(alphabetSet).sort();
  stepsExplanation.push(`Identified input alphabet Σ = {${alphabet.join(', ')}}`);

  // Helper to format state set
  const setKey = (set: string[]) => [...set].sort().join(',');
  const formatSetName = (set: string[]) => {
    if (set.length === 0) return '∅ (Trap)';
    const labels = set.map(id => nfa.states.find(s => s.id === id)?.label || id);
    return `{${labels.join(', ')}}`;
  };

  // 2. Start state = ε-closure(q0)
  const startClosure = computeEpsilonClosure([nfa.startState], nfa.transitions);
  stepsExplanation.push(`Initial DFA state S₀ = ε-closure(${nfa.startState}) = ${formatSetName(startClosure)}`);

  // State registry: key -> state letter & data
  const stateMap = new Map<string, { id: string; name: string; set: string[]; index: number }>();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letterIdx = 0;

  const getOrAddState = (set: string[]) => {
    const key = setKey(set);
    if (stateMap.has(key)) {
      return stateMap.get(key)!;
    }
    const letter = letterIdx < letters.length ? letters[letterIdx] : `S${letterIdx}`;
    const id = `dfa_s${letterIdx}`;
    const entry = { id, name: `${letter} = ${formatSetName(set)}`, set: [...set].sort(), index: letterIdx };
    stateMap.set(key, entry);
    letterIdx++;
    return entry;
  };

  const startEntry = getOrAddState(startClosure);
  const queue: string[][] = [startClosure];
  const visitedKeys = new Set<string>();
  const tableRows: SubsetRow[] = [];
  const dfaTransitions: DFATransition[] = [];

  while (queue.length > 0) {
    const currentSet = queue.shift()!;
    const key = setKey(currentSet);
    if (visitedKeys.has(key)) continue;
    visitedKeys.add(key);

    const sourceEntry = getOrAddState(currentSet);
    const isStart = key === setKey(startClosure);
    const isAccept = currentSet.some(st => nfa.acceptStates.includes(st));

    const transitionsRecord: Record<string, { targetName: string; targetSet: string[] }> = {};

    for (const sym of alphabet) {
      // Find all states reachable on symbol 'sym' from any state in currentSet
      const moveSet = new Set<string>();
      for (const st of currentSet) {
        const matches = nfa.transitions.filter(t => t.from === st && t.symbol === sym);
        for (const m of matches) {
          moveSet.add(m.to);
        }
      }

      // Take ε-closure of the move set
      const targetClosure = computeEpsilonClosure(Array.from(moveSet), nfa.transitions);
      const targetEntry = getOrAddState(targetClosure);

      transitionsRecord[sym] = {
        targetName: targetEntry.name,
        targetSet: targetClosure,
      };

      stepsExplanation.push(
        `δ'(${sourceEntry.name.split(' ')[0]}, ${sym}) = ε-closure(Move(${formatSetName(currentSet)}, ${sym})) = ${formatSetName(targetClosure)} → ${targetEntry.name.split(' ')[0]}`
      );

      // Add transition if target is not empty trap or even if it is
      dfaTransitions.push({
        id: `dfa_t_${sourceEntry.id}_${targetEntry.id}_${sym}`,
        from: sourceEntry.id,
        to: targetEntry.id,
        symbol: sym,
      });

      const targetKey = setKey(targetClosure);
      if (!visitedKeys.has(targetKey)) {
        queue.push(targetClosure);
      }
    }

    tableRows.push({
      dfaStateName: sourceEntry.name,
      nfaStateSet: currentSet,
      isInitial: isStart,
      isAccept: isAccept,
      transitions: transitionsRecord,
    });
  }

  // Build the converted DFA Machine
  const dfaStates: AutomataState[] = [];
  const acceptStates: string[] = [];

  let idx = 0;
  const count = stateMap.size;
  const radius = Math.max(180, count * 50);

  for (const entry of stateMap.values()) {
    const isStart = entry.id === startEntry.id;
    const isAccept = entry.set.some(st => nfa.acceptStates.includes(st));
    if (isAccept) acceptStates.push(entry.id);

    // Circle / Grid layout
    const angle = (idx / count) * 2 * Math.PI;
    const x = 350 + radius * Math.cos(angle);
    const y = 300 + radius * Math.sin(angle);

    dfaStates.push({
      id: entry.id,
      label: entry.name.split(' = ')[0] + (entry.set.length > 0 ? ` {${entry.set.map(s => nfa.states.find(st => st.id === s)?.label || s).join(',')}}` : ' ∅'),
      isInitial: isStart,
      isAccept: isAccept,
      x: Math.round(x),
      y: Math.round(y),
    });
    idx++;
  }

  const convertedDfa: DFAMachine = {
    type: 'DFA',
    name: `DFA (Converted from ${nfa.name || 'NFA'})`,
    description: `Determinized equivalent DFA constructed via subset powerset construction algorithm. Total states: ${dfaStates.length}.`,
    alphabet,
    states: dfaStates,
    startState: startEntry.id,
    acceptStates,
    transitions: dfaTransitions,
  };

  stepsExplanation.push(`Conversion complete. Created DFA with ${dfaStates.length} states and ${acceptStates.length} accepting states.`);

  return {
    convertedDfa,
    table: tableRows,
    stepsExplanation,
  };
}
