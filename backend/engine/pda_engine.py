from typing import List, Optional, Set
try:
    from models.schemas import PDAMachine, SimulationResult, SimulationStepTrace
except ImportError:
    from ..models.schemas import PDAMachine, SimulationResult, SimulationStepTrace

def is_epsilon(sym: Optional[str]) -> bool:
    return not sym or sym in ('ε', 'eps', '', 'lambda')

def tokenize_stack_symbols(s: str, alphabet: List[str]) -> List[str]:
    if not s or is_epsilon(s):
        return []
    sorted_alpha = sorted([a for a in alphabet if a and not is_epsilon(a)], key=lambda x: len(x), reverse=True)
    tokens = []
    remaining = s
    while remaining:
        match = next((a for a in sorted_alpha if remaining.startswith(a)), None)
        if match:
            tokens.append(match)
            remaining = remaining[len(match):]
        else:
            tokens.append(remaining[0])
            remaining = remaining[1:]
    return tokens

class PDAConfig:
    def __init__(self, state: str, input_index: int, stack: List[str], trace: List[SimulationStepTrace]):
        self.state = state
        self.input_index = input_index
        self.stack = stack
        self.trace = trace

def simulate_pda(machine: PDAMachine, input_str: str, max_steps: int = 500) -> SimulationResult:
    init_stack = [machine.initialStackSymbol] if machine.initialStackSymbol else ['Z0']
    start_state = machine.startState
    stack_alphabet = machine.stackAlphabet or ['Z0', 'a', 'b', 'c', '0', '1', '(', ')']

    initial_trace = SimulationStepTrace(
        stepIndex=0,
        activeStates=[start_state],
        remainingInput=input_str,
        readSymbol=input_str[0] if len(input_str) > 0 else None,
        activeTransitionId=None,
        stack=list(init_stack),
        actionSummary=f"Initial state: {start_state}, Stack: [{', '.join(init_stack)}]",
        status="RUNNING",
    )

    def is_accepted_config(cfg: PDAConfig) -> bool:
        input_consumed = cfg.input_index >= len(input_str)
        if not input_consumed:
            return False
        if machine.acceptanceMode == 'empty_stack':
            return len(cfg.stack) == 0
        else:
            return cfg.state in machine.acceptStates

    queue: List[PDAConfig] = [
        PDAConfig(
            state=start_state,
            input_index=0,
            stack=list(init_stack),
            trace=[initial_trace],
        )
    ]

    best_reject_config: Optional[PDAConfig] = None
    visited: Set[str] = set()
    explored_count = 0

    while queue and explored_count < max_steps:
        explored_count += 1
        current = queue.pop(0)

        # Check acceptance
        if is_accepted_config(current):
            final_traces = [t.model_copy() for t in current.trace]
            final_traces[-1].status = "ACCEPTED"
            final_traces[-1].actionSummary += f" | Accepted via {'empty stack' if machine.acceptanceMode == 'empty_stack' else f'final state {current.state}'}"
            return SimulationResult(
                accepted=True,
                finalStatus="ACCEPTED",
                totalSteps=len(final_traces),
                traces=final_traces,
                message=f'Input string "{input_str}" ACCEPTED by PDA.',
            )

        if not best_reject_config or current.input_index > best_reject_config.input_index or len(current.trace) > len(best_reject_config.trace):
            best_reject_config = current

        # Cycle detection
        sig = f"{current.state}:{current.input_index}:{','.join(current.stack)}"
        if sig in visited:
            continue
        visited.add(sig)

        current_input_sym = input_str[current.input_index] if current.input_index < len(input_str) else ""
        top_of_stack = current.stack[-1] if len(current.stack) > 0 else ""

        for t in machine.transitions:
            if t.from_state != current.state:
                continue

            input_matches = is_epsilon(t.inputSymbol) or t.inputSymbol == current_input_sym
            stack_matches = is_epsilon(t.popSymbol) or t.popSymbol == top_of_stack

            if input_matches and stack_matches:
                reads_input = not is_epsilon(t.inputSymbol)
                next_input_index = current.input_index + 1 if reads_input else current.input_index

                next_stack = list(current.stack)
                if not is_epsilon(t.popSymbol):
                    if len(next_stack) == 0 or next_stack[-1] != t.popSymbol:
                        continue
                    next_stack.pop()

                if not is_epsilon(t.pushSymbols):
                    push_tokens = tokenize_stack_symbols(t.pushSymbols, stack_alphabet)
                    for sym in reversed(push_tokens):
                        next_stack.append(sym)

                next_remaining = input_str[next_input_index:]
                read_sym = t.inputSymbol if reads_input else 'ε'
                action_desc = f"Read '{read_sym}', Pop '{t.popSymbol or 'ε'}', Push '{t.pushSymbols or 'ε'}' -> State {t.to_state}"

                new_trace_step = SimulationStepTrace(
                    stepIndex=len(current.trace),
                    activeStates=[t.to_state],
                    remainingInput=next_remaining,
                    readSymbol=read_sym,
                    activeTransitionId=t.id,
                    stack=list(next_stack),
                    actionSummary=action_desc,
                    status="RUNNING",
                )

                queue.append(
                    PDAConfig(
                        state=t.to_state,
                        input_index=next_input_index,
                        stack=next_stack,
                        trace=current.trace + [new_trace_step],
                    )
                )

    reject_traces = [t.model_copy() for t in best_reject_config.trace] if best_reject_config else [initial_trace]
    reject_traces[-1].status = "REJECTED"
    reject_traces[-1].actionSummary += " | No valid accepting path found (Rejected)"

    return SimulationResult(
        accepted=False,
        finalStatus="REJECTED",
        totalSteps=len(reject_traces),
        traces=reject_traces,
        message=f'Input string "{input_str}" REJECTED by PDA (explored {explored_count} configurations).',
    )
