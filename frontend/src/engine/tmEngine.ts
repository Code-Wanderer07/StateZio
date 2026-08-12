import { BLANK, SimulationResult, SimulationStepTrace, TMMachine } from '../types/automata';

export function isBlank(sym: string, blankSymbol: string): boolean {
  if (sym === undefined || sym === null || sym === '') return true;
  const targetBlank = blankSymbol || '_';
  return sym === targetBlank || sym === '_' || sym === '␣';
}

export function normalizeTapeSymbol(sym: string, blankSymbol: string): string {
  if (isBlank(sym, blankSymbol)) return blankSymbol || '_';
  return sym;
}

export function simulateTM(rawMachine: TMMachine, inputString: string, maxSteps = 1000): SimulationResult {
  const machine = {
    ...rawMachine,
    states: rawMachine.states || [],
    transitions: rawMachine.transitions || [],
    acceptStates: rawMachine.acceptStates || [],
    rejectStates: rawMachine.rejectStates || [],
    inputAlphabet: rawMachine.inputAlphabet || [],
    tapeAlphabet: rawMachine.tapeAlphabet || [],
  };
  const blank = machine.blankSymbol || '_';
  const startState = machine.startState;
  const traces: SimulationStepTrace[] = [];

  if (!startState) {
    return {
      accepted: false,
      finalStatus: 'ERROR',
      traces: [{
        stepIndex: 0,
        activeStates: [],
        remainingInput: inputString,
        inputIndex: 0,
        tape: [blank],
        headIndex: 0,
        actionSummary: 'No start state defined for Turing Machine',
        status: 'ERROR',
      }],
      totalSteps: 1,
      message: 'No start state defined for Turing Machine.',
    };
  }

  // Initialize tape: input symbols + padding blanks on both sides for visual clarity
  const inputChars = inputString.length > 0 ? inputString.split('') : [blank];
  const tape: string[] = [...inputChars];
  let headIndex = 0; // head starts at position 0
  let virtualOffset = 0;
  let currentState = startState;

  // Add initial trace
  traces.push({
    stepIndex: 0,
    activeStates: [currentState],
    currentSymbol: tape[headIndex] || blank,
    inputIndex: 0,
    remainingInput: inputString,
    tape: [...tape],
    headIndex: headIndex,
    tapeOffset: virtualOffset,
    actionSummary: `Initial Configuration: State ${currentState}, Head at index 0 reading '${tape[headIndex]}'`,
    status: 'RUNNING',
  });

  // Check if start state is already accept state
  if (machine.acceptStates.includes(currentState)) {
    traces[0].status = 'HALTED_ACCEPT';
    traces[0].actionSummary += ' (Already in Accept State)';
    return {
      accepted: true,
      finalStatus: 'HALTED_ACCEPT',
      traces,
      totalSteps: 1,
      message: `Turing machine immediately accepted in start state ${currentState}.`,
    };
  }

  for (let step = 1; step <= maxSteps; step++) {
    const currentRead = tape[headIndex] !== undefined ? tape[headIndex] : blank;

    // Find matching transition
    const transition = machine.transitions.find(t => {
      if (t.from !== currentState) return false;
      
      const tRead = t.readSymbol;
      if (isBlank(tRead, blank) && isBlank(currentRead, blank)) return true;
      return tRead === currentRead;
    });

    if (!transition) {
      // No transition -> Machine halts
      const isAccept = machine.acceptStates.includes(currentState);
      const haltStatus = isAccept ? 'HALTED_ACCEPT' : 'HALTED_REJECT';

      traces.push({
        stepIndex: step,
        activeStates: [currentState],
        currentSymbol: currentRead,
        inputIndex: headIndex,
        remainingInput: '',
        tape: [...tape],
        headIndex: headIndex,
        tapeOffset: virtualOffset,
        actionSummary: `No transition found for (State: ${currentState}, Symbol: '${currentRead}'). Halted (${isAccept ? 'ACCEPT' : 'REJECT'}).`,
        status: haltStatus,
      });

      return {
        accepted: isAccept,
        finalStatus: haltStatus,
        traces,
        totalSteps: traces.length,
        message: isAccept
          ? `Turing machine halted in accept state ${currentState}. Final tape: "${tape.join('')}"`
          : `Turing machine halted in non-accepting state ${currentState}. Final tape: "${tape.join('')}"`,
      };
    }

    // Write symbol
    const writeSym = normalizeTapeSymbol(transition.writeSymbol, blank);
    tape[headIndex] = writeSym;

    // Direction move
    let dirDesc = 'Stay';
    if (transition.direction === 'L') {
      dirDesc = 'Move Left';
      if (headIndex === 0) {
        tape.unshift(blank);
        virtualOffset -= 1;
        // headIndex remains 0
      } else {
        headIndex -= 1;
      }
    } else if (transition.direction === 'R') {
      dirDesc = 'Move Right';
      headIndex += 1;
      if (headIndex >= tape.length) {
        tape.push(blank);
      }
    }

    currentState = transition.to;
    const nextRead = tape[headIndex] !== undefined ? tape[headIndex] : blank;

    const isAccept = machine.acceptStates.includes(currentState);
    const isReject = (machine.rejectStates || []).includes(currentState);

    let stepStatus: SimulationStepTrace['status'] = 'RUNNING';
    if (isAccept) stepStatus = 'HALTED_ACCEPT';
    else if (isReject) stepStatus = 'HALTED_REJECT';

    const actionDesc = `Read '${currentRead}' → Write '${writeSym}', ${dirDesc} → State ${currentState}`;

    traces.push({
      stepIndex: step,
      activeStates: [currentState],
      currentSymbol: nextRead,
      inputIndex: headIndex,
      remainingInput: '',
      tape: [...tape],
      headIndex: headIndex,
      tapeOffset: virtualOffset,
      activeTransitionId: transition.id,
      actionSummary: actionDesc,
      status: stepStatus,
    });

    if (isAccept) {
      return {
        accepted: true,
        finalStatus: 'HALTED_ACCEPT',
        traces,
        totalSteps: traces.length,
        message: `Turing machine reached ACCEPT state ${currentState}. Final tape: "${tape.join('')}"`,
      };
    }

    if (isReject) {
      return {
        accepted: false,
        finalStatus: 'HALTED_REJECT',
        traces,
        totalSteps: traces.length,
        message: `Turing machine reached REJECT state ${currentState}. Final tape: "${tape.join('')}"`,
      };
    }
  }

  // Max steps exceeded -> Loop detected
  const lastTrace = traces[traces.length - 1];
  lastTrace.status = 'HALTED_REJECT';
  lastTrace.actionSummary += ' | [Max Step Limit Exceeded / Possible Loop]';

  return {
    accepted: false,
    finalStatus: 'TIMEOUT',
    traces,
    totalSteps: traces.length,
    message: `Simulation reached maximum step limit (${maxSteps}) and was terminated. This may indicate an infinite loop.`,
  };
}
