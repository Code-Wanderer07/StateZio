import { NFAMachine, NFATransition, SimulationResult, SimulationStepTrace } from '../types/automata';

export const isEpsilon = (symbol: string): boolean => {
  return !symbol || symbol === 'ε' || symbol === 'eps' || symbol === 'EPS' || symbol === 'E' || symbol === 'λ';
};

/**
 * Computes the ε-closure for a set of NFA states
 */
export function computeEpsilonClosure(states: string[], transitions: NFATransition[]): string[] {
  const closure = new Set<string>(states);
  const queue = [...states];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const epsTransitions = transitions.filter(t => t.from === current && isEpsilon(t.symbol));

    for (const t of epsTransitions) {
      if (!closure.has(t.to)) {
        closure.add(t.to);
        queue.push(t.to);
      }
    }
  }

  return Array.from(closure).sort();
}

/**
 * Simulates an NFA on an input string
 */
export function simulateNFA(machine: NFAMachine, inputString: string): SimulationResult {
  const traces: SimulationStepTrace[] = [];

  if (!machine.startState) {
    return {
      accepted: false,
      finalStatus: 'ERROR',
      traces: [{
        stepIndex: 0,
        activeStates: [],
        remainingInput: inputString,
        inputIndex: 0,
        actionSummary: 'No start state defined for NFA',
        status: 'ERROR',
      }],
      totalSteps: 1,
      message: 'No start state defined for NFA.',
    };
  }

  // Initial step with ε-closure
  let currentStates = computeEpsilonClosure([machine.startState], machine.transitions);
  const stateNames = (ids: string[]) => ids.map(id => machine.states.find(s => s.id === id)?.label || id).join(', ');

  traces.push({
    stepIndex: 0,
    activeStates: [...currentStates],
    currentSymbol: inputString.length > 0 ? inputString[0] : undefined,
    inputIndex: 0,
    remainingInput: inputString,
    actionSummary: `Initial active states (after ε-closure of ${machine.startState}): {${stateNames(currentStates)}}`,
    status: 'RUNNING',
  });

  for (let i = 0; i < inputString.length; i++) {
    const symbol = inputString[i];
    const nextStatesSet = new Set<string>();
    const usedTransitionIds: string[] = [];

    for (const st of currentStates) {
      const directMatches = machine.transitions.filter(t => t.from === st && t.symbol === symbol);
      for (const t of directMatches) {
        nextStatesSet.add(t.to);
        usedTransitionIds.push(t.id);
      }
    }

    if (nextStatesSet.size === 0) {
      // Branch dead-end
      traces.push({
        stepIndex: i + 1,
        activeStates: [],
        currentSymbol: symbol,
        inputIndex: i,
        remainingInput: inputString.slice(i),
        actionSummary: `No transitions on '${symbol}' from active states {${stateNames(currentStates)}} (All branches halted)`,
        status: 'REJECTED',
      });

      return {
        accepted: false,
        finalStatus: 'REJECTED',
        traces,
        totalSteps: traces.length,
        message: `NFA rejected: No branches survived reading symbol '${symbol}'.`,
      };
    }

    // Apply ε-closure to the resulting states
    const directArray = Array.from(nextStatesSet);
    currentStates = computeEpsilonClosure(directArray, machine.transitions);
    
    const nextSymbol = i + 1 < inputString.length ? inputString[i + 1] : undefined;
    const remaining = inputString.slice(i + 1);

    traces.push({
      stepIndex: i + 1,
      activeStates: [...currentStates],
      currentSymbol: nextSymbol,
      inputIndex: i + 1,
      remainingInput: remaining,
      activeTransitionId: usedTransitionIds[0],
      actionSummary: `Read '${symbol}' → Reached {${stateNames(directArray)}} | ε-closure: {${stateNames(currentStates)}}`,
      status: 'RUNNING',
    });
  }

  // Check acceptance
  const isAccept = currentStates.some(st => machine.acceptStates.includes(st));
  const finalStatus = isAccept ? 'ACCEPTED' : 'REJECTED';

  if (traces.length > 0) {
    const lastTrace = traces[traces.length - 1];
    lastTrace.status = finalStatus;
    const acceptingStates = currentStates.filter(st => machine.acceptStates.includes(st));
    if (isAccept) {
      lastTrace.actionSummary += ` | Accepted via accepting state(s): {${stateNames(acceptingStates)}}`;
    } else {
      lastTrace.actionSummary += ` | Rejected: none of {${stateNames(currentStates)}} are accept states`;
    }
  }

  return {
    accepted: isAccept,
    finalStatus,
    traces,
    totalSteps: traces.length,
    message: isAccept
      ? `Input string "${inputString}" ACCEPTED by NFA.`
      : `Input string "${inputString}" REJECTED by NFA.`,
  };
}
