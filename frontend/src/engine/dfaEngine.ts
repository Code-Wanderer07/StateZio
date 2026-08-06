import { DFAMachine, SimulationResult, SimulationStepTrace } from '../types/automata';

export function simulateDFA(machine: DFAMachine, inputString: string): SimulationResult {
  const traces: SimulationStepTrace[] = [];
  let currentState = machine.startState;
  
  // Initial Step 0
  traces.push({
    stepIndex: 0,
    activeStates: [currentState],
    currentSymbol: inputString.length > 0 ? inputString[0] : undefined,
    inputIndex: 0,
    remainingInput: inputString,
    actionSummary: `Initial state: ${machine.states.find(s => s.id === currentState)?.label || currentState}`,
    status: 'RUNNING',
  });

  if (!currentState) {
    traces[0].status = 'ERROR';
    traces[0].actionSummary = 'No start state defined for DFA';
    return {
      accepted: false,
      finalStatus: 'ERROR',
      traces,
      totalSteps: 1,
      message: 'No start state defined for DFA.',
    };
  }

  for (let i = 0; i < inputString.length; i++) {
    const symbol = inputString[i];
    
    // Find matching transition
    const transition = machine.transitions.find(
      t => t.from === currentState && t.symbol === symbol
    );

    if (!transition) {
      // Missing transition -> Trap / Dead state -> Immediate reject
      const rejectTrace: SimulationStepTrace = {
        stepIndex: i + 1,
        activeStates: [currentState],
        currentSymbol: symbol,
        inputIndex: i,
        remainingInput: inputString.slice(i),
        actionSummary: `No transition from state ${machine.states.find(s => s.id === currentState)?.label || currentState} on symbol '${symbol}' (Halted & Rejected)`,
        status: 'REJECTED',
      };
      traces.push(rejectTrace);

      return {
        accepted: false,
        finalStatus: 'REJECTED',
        traces,
        totalSteps: traces.length,
        message: `DFA halted: No valid transition for '${symbol}' from state ${currentState}.`,
      };
    }

    currentState = transition.to;
    const nextSymbol = i + 1 < inputString.length ? inputString[i + 1] : undefined;
    const remaining = inputString.slice(i + 1);

    traces.push({
      stepIndex: i + 1,
      activeStates: [currentState],
      currentSymbol: nextSymbol,
      inputIndex: i + 1,
      remainingInput: remaining,
      activeTransitionId: transition.id,
      actionSummary: `Read '${symbol}' → Transitioned to ${machine.states.find(s => s.id === currentState)?.label || currentState}`,
      status: 'RUNNING',
    });
  }

  // End of input reached
  const isAccept = machine.acceptStates.includes(currentState);
  const finalStatus = isAccept ? 'ACCEPTED' : 'REJECTED';
  
  if (traces.length > 0) {
    traces[traces.length - 1].status = finalStatus;
    const lastLabel = machine.states.find(s => s.id === currentState)?.label || currentState;
    traces[traces.length - 1].actionSummary += ` | Input exhausted at ${lastLabel} (${isAccept ? 'ACCEPT' : 'REJECT'})`;
  }

  return {
    accepted: isAccept,
    finalStatus,
    traces,
    totalSteps: traces.length,
    message: isAccept 
      ? `Input string "${inputString}" ACCEPTED by DFA in state ${currentState}.` 
      : `Input string "${inputString}" REJECTED by DFA in non-accepting state ${currentState}.`,
  };
}
