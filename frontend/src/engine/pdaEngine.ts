import { PDAMachine, PDATransition, SimulationResult, SimulationStepTrace } from '../types/automata';
import { isEpsilon } from './nfaEngine';

export function tokenizeStackSymbols(str: string, alphabet: string[] = []): string[] {
  if (!str || isEpsilon(str)) return [];
  const sortedAlpha = [...alphabet.filter((a) => a && !isEpsilon(a))].sort((a, b) => b.length - a.length);
  const tokens: string[] = [];
  let remaining = str;
  while (remaining.length > 0) {
    const match = sortedAlpha.find((a) => remaining.startsWith(a));
    if (match) {
      tokens.push(match);
      remaining = remaining.slice(match.length);
    } else {
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }
  return tokens;
}

interface PDAConfig {
  state: string;
  inputIndex: number;
  stack: string[]; // stack array, last element is top of stack
  trace: SimulationStepTrace[];
}

export function simulatePDA(machine: PDAMachine, inputString: string, maxSteps = 500): SimulationResult {
  const initStack = machine.initialStackSymbol ? [machine.initialStackSymbol] : ['Z0'];
  const startState = machine.startState;

  if (!startState) {
    return {
      accepted: false,
      finalStatus: 'ERROR',
      traces: [{
        stepIndex: 0,
        activeStates: [],
        remainingInput: inputString,
        inputIndex: 0,
        stack: initStack,
        actionSummary: 'No start state defined for PDA',
        status: 'ERROR',
      }],
      totalSteps: 1,
      message: 'No start state defined for PDA.',
    };
  }

  const initialTrace: SimulationStepTrace = {
    stepIndex: 0,
    activeStates: [startState],
    currentSymbol: inputString.length > 0 ? inputString[0] : undefined,
    inputIndex: 0,
    remainingInput: inputString,
    stack: [...initStack],
    topOfStack: initStack[initStack.length - 1],
    actionSummary: `Initial state: ${startState}, Stack: [${initStack.join(', ')}]`,
    status: 'RUNNING',
  };

  const isAcceptedConfig = (cfg: PDAConfig): boolean => {
    const inputConsumed = cfg.inputIndex >= inputString.length;
    if (!inputConsumed) return false;

    if (machine.acceptanceMode === 'empty_stack') {
      return cfg.stack.length === 0;
    } else {
      // By final state
      return machine.acceptStates.includes(cfg.state);
    }
  };

  // BFS / Priority search to find accepting path or longest valid path
  const queue: PDAConfig[] = [
    {
      state: startState,
      inputIndex: 0,
      stack: [...initStack],
      trace: [initialTrace],
    },
  ];

  let bestRejectConfig: PDAConfig | null = null;
  const visited = new Set<string>();
  let exploredCount = 0;

  while (queue.length > 0 && exploredCount < maxSteps) {
    exploredCount++;
    const current = queue.shift()!;

    // Check acceptance
    if (isAcceptedConfig(current)) {
      const finalTraces = [...current.trace];
      const lastTrace = finalTraces[finalTraces.length - 1];
      lastTrace.status = 'ACCEPTED';
      lastTrace.actionSummary += ` | Accepted via ${machine.acceptanceMode === 'empty_stack' ? 'empty stack' : `final state ${current.state}`}`;

      return {
        accepted: true,
        finalStatus: 'ACCEPTED',
        traces: finalTraces,
        totalSteps: finalTraces.length,
        message: `Input string "${inputString}" ACCEPTED by PDA.`,
      };
    }

    if (!bestRejectConfig || current.inputIndex > bestRejectConfig.inputIndex || current.trace.length > bestRejectConfig.trace.length) {
      bestRejectConfig = current;
    }

    // Config signature for cycle detection
    const sig = `${current.state}:${current.inputIndex}:${current.stack.join('|')}`;
    if (visited.has(sig)) continue;
    visited.add(sig);

    // Explore possible transitions from this configuration
    const currentInputSym = current.inputIndex < inputString.length ? inputString[current.inputIndex] : '';
    const topOfStack = current.stack.length > 0 ? current.stack[current.stack.length - 1] : '';

    // Find transitions matching:
    // 1) matching inputSymbol or ε
    // 2) matching popSymbol or ε
    const possibleTransitions = machine.transitions.filter(t => {
      if (t.from !== current.state) return false;

      const inputMatches = isEpsilon(t.inputSymbol) || t.inputSymbol === currentInputSym;
      const stackMatches = isEpsilon(t.popSymbol) || t.popSymbol === topOfStack;

      return inputMatches && stackMatches;
    });

    for (const t of possibleTransitions) {
      const readsInput = !isEpsilon(t.inputSymbol);
      const nextInputIndex = readsInput ? current.inputIndex + 1 : current.inputIndex;

      // Stack manipulation
      const nextStack = [...current.stack];
      if (!isEpsilon(t.popSymbol)) {
        if (nextStack.length === 0 || nextStack[nextStack.length - 1] !== t.popSymbol) {
          continue; // Cannot pop
        }
        nextStack.pop();
      }

      // Push symbols
      if (!isEpsilon(t.pushSymbols)) {
        // Tokenize using stackAlphabet and push in reverse order so first token ends up on top
        const tokens = tokenizeStackSymbols(t.pushSymbols, machine.stackAlphabet || ['Z0', 'a', 'b', 'c', '0', '1', '(', ')']);
        for (let i = tokens.length - 1; i >= 0; i--) {
          nextStack.push(tokens[i]);
        }
      }

      const nextRemaining = inputString.slice(nextInputIndex);
      const nextSymbol = nextInputIndex < inputString.length ? inputString[nextInputIndex] : undefined;

      const actionDesc = `Read '${readsInput ? t.inputSymbol : 'ε'}', Pop '${t.popSymbol || 'ε'}', Push '${t.pushSymbols || 'ε'}' → State ${t.to}`;

      const newTraceStep: SimulationStepTrace = {
        stepIndex: current.trace.length,
        activeStates: [t.to],
        currentSymbol: nextSymbol,
        inputIndex: nextInputIndex,
        remainingInput: nextRemaining,
        stack: [...nextStack],
        topOfStack: nextStack.length > 0 ? nextStack[nextStack.length - 1] : undefined,
        activeTransitionId: t.id,
        actionSummary: actionDesc,
        status: 'RUNNING',
      };

      queue.push({
        state: t.to,
        inputIndex: nextInputIndex,
        stack: nextStack,
        trace: [...current.trace, newTraceStep],
      });
    }
  }

  // If no accepting path was found
  const rejectTraces = bestRejectConfig ? [...bestRejectConfig.trace] : [initialTrace];
  const lastRejectTrace = rejectTraces[rejectTraces.length - 1];
  lastRejectTrace.status = 'REJECTED';
  lastRejectTrace.actionSummary += ' | No valid accepting path found (Rejected)';

  return {
    accepted: false,
    finalStatus: 'REJECTED',
    traces: rejectTraces,
    totalSteps: rejectTraces.length,
    message: `Input string "${inputString}" REJECTED by PDA (explored ${exploredCount} configurations).`,
  };
}
