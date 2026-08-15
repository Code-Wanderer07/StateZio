import {
  AutomataMachine,
  DFAMachine,
  NFAMachine,
  PDAMachine,
  TMMachine,
  EPSILON,
  DFATransition,
  TMTransition
} from '../types/automata';

export interface ValidationWarning {
  id: string;
  message: string;
  severity: 'error' | 'warning'; // error = strict rule broken, warning = potential issue
}

export function validateMachine(machine: AutomataMachine): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // 1. Universal Checks
  if (machine.states.length === 0) {
    warnings.push({ id: 'no-states', message: 'Machine has no states. Add at least one state.', severity: 'error' });
    return warnings;
  }

  const initialStates = machine.states.filter(s => s.isInitial);
  if (initialStates.length === 0) {
    warnings.push({ id: 'no-initial', message: 'Machine must have exactly one initial state.', severity: 'error' });
  } else if (initialStates.length > 1) {
    warnings.push({ id: 'multiple-initial', message: 'Machine cannot have multiple initial states.', severity: 'error' });
  }

  const acceptStates = machine.states.filter(s => s.isAccept);
  if (acceptStates.length === 0 && machine.type !== 'TM') {
    // TM usually halts explicitly, but DFA/NFA/PDA generally need accept states to accept anything
    warnings.push({ id: 'no-accept', message: 'Machine has no accept states. It will reject all inputs.', severity: 'warning' });
  }

  // 2. Type-Specific Checks
  switch (machine.type) {
    case 'DFA':
      validateDFA(machine, warnings);
      break;
    case 'NFA':
      validateNFA(machine, warnings);
      break;
    case 'PDA':
      validatePDA(machine, warnings);
      break;
    case 'TM':
      validateTM(machine, warnings);
      break;
  }

  return warnings;
}

function validateDFA(machine: DFAMachine, warnings: ValidationWarning[]) {
  if (machine.alphabet.length === 0) {
    warnings.push({ id: 'dfa-no-alphabet', message: 'Alphabet is empty. Define the alphabet in settings.', severity: 'warning' });
    return;
  }

  // Check for EPSILON transitions
  const hasEpsilon = machine.transitions.some(t => t.symbol === EPSILON || t.symbol === 'eps');
  if (hasEpsilon) {
    warnings.push({ id: 'dfa-epsilon', message: `DFA cannot have ${EPSILON}-transitions.`, severity: 'error' });
  }

  // Check determinism and exhaustiveness for each state
  machine.states.forEach(state => {
    const transitionsFromState = machine.transitions.filter(t => t.from === state.id);
    
    // Group transitions by symbol
    const symbolCounts: Record<string, number> = {};
    machine.alphabet.forEach(sym => {
      symbolCounts[sym] = 0;
    });

    transitionsFromState.forEach(t => {
      // If symbol is not in alphabet (and not epsilon, which is caught above), flag it
      if (!machine.alphabet.includes(t.symbol) && t.symbol !== EPSILON && t.symbol !== 'eps') {
        warnings.push({ 
          id: `dfa-invalid-sym-${state.id}-${t.symbol}`, 
          message: `Transition from ${state.label} uses symbol '${t.symbol}' not in alphabet.`, 
          severity: 'error' 
        });
      }
      
      if (symbolCounts[t.symbol] !== undefined) {
        symbolCounts[t.symbol]++;
      } else {
        symbolCounts[t.symbol] = 1;
      }
    });

    // Check counts
    machine.alphabet.forEach(sym => {
      const count = symbolCounts[sym];
      if (count === 0) {
        warnings.push({ 
          id: `dfa-missing-${state.id}-${sym}`, 
          message: `DFA Strict: ${state.label} is missing a transition for '${sym}'.`, 
          severity: 'error' 
        });
      } else if (count > 1) {
        warnings.push({ 
          id: `dfa-nondet-${state.id}-${sym}`, 
          message: `DFA Strict: ${state.label} has multiple transitions for '${sym}'.`, 
          severity: 'error' 
        });
      }
    });
  });
}

function validateNFA(machine: NFAMachine, warnings: ValidationWarning[]) {
  if (machine.alphabet.length === 0) {
    warnings.push({ id: 'nfa-no-alphabet', message: 'Alphabet is empty. Define the alphabet in settings.', severity: 'warning' });
  }

  // Check if any transitions use symbols not in alphabet (ignoring epsilon)
  machine.transitions.forEach(t => {
    if (!machine.alphabet.includes(t.symbol) && t.symbol !== EPSILON && t.symbol !== 'eps') {
      warnings.push({ 
        id: `nfa-invalid-sym-${t.id}`, 
        message: `Transition uses symbol '${t.symbol}' not in alphabet.`, 
        severity: 'warning' 
      });
    }
  });
}

function validatePDA(machine: PDAMachine, warnings: ValidationWarning[]) {
  if (machine.inputAlphabet.length === 0) {
    warnings.push({ id: 'pda-no-input-alpha', message: 'Input alphabet is empty.', severity: 'warning' });
  }
  if (machine.stackAlphabet.length === 0) {
    warnings.push({ id: 'pda-no-stack-alpha', message: 'Stack alphabet is empty.', severity: 'warning' });
  }

  machine.transitions.forEach(t => {
    // Input symbol check
    if (!machine.inputAlphabet.includes(t.inputSymbol) && t.inputSymbol !== EPSILON && t.inputSymbol !== 'eps') {
      warnings.push({ 
        id: `pda-invalid-input-sym-${t.id}`, 
        message: `Transition uses input symbol '${t.inputSymbol}' not in input alphabet.`, 
        severity: 'error' 
      });
    }

    // Pop symbol check
    if (!machine.stackAlphabet.includes(t.popSymbol) && t.popSymbol !== EPSILON && t.popSymbol !== 'eps') {
      warnings.push({ 
        id: `pda-invalid-pop-sym-${t.id}`, 
        message: `Transition pops symbol '${t.popSymbol}' not in stack alphabet.`, 
        severity: 'error' 
      });
    }

    // Push symbols check
    if (t.pushSymbols !== EPSILON && t.pushSymbols !== 'eps') {
      // pushSymbols could be multiple symbols (e.g. "AB") depending on PDA implementation. 
      // We will check if each character is in the stack alphabet.
      for (const char of t.pushSymbols) {
        if (!machine.stackAlphabet.includes(char)) {
          warnings.push({ 
            id: `pda-invalid-push-sym-${t.id}-${char}`, 
            message: `Transition pushes symbol '${char}' not in stack alphabet.`, 
            severity: 'error' 
          });
        }
      }
    }
  });
}

function validateTM(machine: TMMachine, warnings: ValidationWarning[]) {
  if (machine.inputAlphabet.length === 0) {
    warnings.push({ id: 'tm-no-input-alpha', message: 'Input alphabet is empty.', severity: 'warning' });
  }
  if (machine.tapeAlphabet.length === 0) {
    warnings.push({ id: 'tm-no-tape-alpha', message: 'Tape alphabet is empty.', severity: 'warning' });
  }

  // Check determinism (standard TM is deterministic) and tape alphabet
  machine.states.forEach(state => {
    const transitionsFromState = machine.transitions.filter(t => t.from === state.id);
    const readSymbols = new Set<string>();

    transitionsFromState.forEach(t => {
      // Check Read Symbol
      if (!machine.tapeAlphabet.includes(t.readSymbol) && t.readSymbol !== machine.blankSymbol) {
        warnings.push({ 
          id: `tm-invalid-read-${t.id}`, 
          message: `Transition reads '${t.readSymbol}', which is not in tape alphabet or blank symbol.`, 
          severity: 'error' 
        });
      }

      // Check Write Symbol
      if (!machine.tapeAlphabet.includes(t.writeSymbol) && t.writeSymbol !== machine.blankSymbol) {
        warnings.push({ 
          id: `tm-invalid-write-${t.id}`, 
          message: `Transition writes '${t.writeSymbol}', which is not in tape alphabet or blank symbol.`, 
          severity: 'error' 
        });
      }

      // Check determinism
      if (readSymbols.has(t.readSymbol)) {
        warnings.push({ 
          id: `tm-nondet-${state.id}-${t.readSymbol}`, 
          message: `TM Strict: ${state.label} has multiple transitions reading '${t.readSymbol}'. Standard TM must be deterministic.`, 
          severity: 'error' 
        });
      }
      readSymbols.add(t.readSymbol);
    });
  });

  const acceptStates = machine.states.filter(s => s.isAccept);
  const rejectStates = machine.rejectStates || [];
  if (acceptStates.length === 0) {
    warnings.push({ id: 'tm-no-accept', message: 'TM has no accept state.', severity: 'warning' });
  }
  if (rejectStates.length === 0) {
    warnings.push({ id: 'tm-no-reject', message: 'TM has no explicit reject state.', severity: 'warning' });
  }
}
