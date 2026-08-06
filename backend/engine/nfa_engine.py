from typing import List, Set
try:
    from models.schemas import NFAMachine, SimulationResult, SimulationStepTrace
except ImportError:
    from ..models.schemas import NFAMachine, SimulationResult, SimulationStepTrace

def get_epsilon_closure(states: Set[str], machine: NFAMachine) -> Set[str]:
    closure = set(states)
    queue = list(states)
    while queue:
        curr = queue.pop(0)
        for t in machine.transitions:
            if t.from_state == curr and (t.symbol == 'ε' or t.symbol == '' or t.symbol == 'eps'):
                if t.to_state not in closure:
                    closure.add(t.to_state)
                    queue.append(t.to_state)
    return closure

def simulate_nfa(machine: NFAMachine, input_str: str) -> SimulationResult:
    traces: List[SimulationStepTrace] = []
    state_lookup = {s.id: s.label for s in machine.states}

    initial_closure = get_epsilon_closure({machine.startState}, machine)
    current_states = initial_closure
    chars = list(input_str)

    has_accept = any(s in machine.acceptStates for s in current_states)
    labels = [state_lookup.get(s, s) for s in sorted(current_states)]

    traces.append(
        SimulationStepTrace(
            stepIndex=0,
            activeStates=sorted(list(current_states)),
            remainingInput=input_str,
            readSymbol=None,
            activeTransitionId=None,
            actionSummary=f"Initial state closure: {{{', '.join(labels)}}}",
            status="RUNNING" if len(chars) > 0 else ("ACCEPTED" if has_accept else "REJECTED"),
        )
    )

    if len(chars) == 0:
        return SimulationResult(
            accepted=has_accept,
            finalStatus="ACCEPTED" if has_accept else "REJECTED",
            totalSteps=1,
            traces=traces,
            message=f"Empty string ε {'accepted' if has_accept else 'rejected'}.",
        )

    for i, sym in enumerate(chars):
        next_states: Set[str] = set()
        for curr in current_states:
            for t in machine.transitions:
                if t.from_state == curr and t.symbol == sym:
                    next_states.add(t.to_state)

        closure = get_epsilon_closure(next_states, machine)
        current_states = closure
        remaining = "".join(chars[i+1:])
        is_last = (i == len(chars) - 1)
        has_acc = any(s in machine.acceptStates for s in current_states)
        lbls = [state_lookup.get(s, s) for s in sorted(current_states)]

        if len(current_states) == 0:
            traces.append(
                SimulationStepTrace(
                    stepIndex=len(traces),
                    activeStates=[],
                    remainingInput=remaining,
                    readSymbol=sym,
                    activeTransitionId=None,
                    actionSummary=f"No valid branches for symbol '{sym}'. All paths terminated (∅).",
                    status="REJECTED",
                )
            )
            return SimulationResult(
                accepted=False,
                finalStatus="REJECTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Rejected: All active branches halted on '{sym}'.",
            )

        traces.append(
            SimulationStepTrace(
                stepIndex=len(traces),
                activeStates=sorted(list(current_states)),
                remainingInput=remaining,
                readSymbol=sym,
                activeTransitionId=None,
                actionSummary=f"Read '{sym}' -> Active states: {{{', '.join(lbls)}}}",
                status=("ACCEPTED" if has_acc else "REJECTED") if is_last else "RUNNING",
            )
        )

    accepted = any(s in machine.acceptStates for s in current_states)
    return SimulationResult(
        accepted=accepted,
        finalStatus="ACCEPTED" if accepted else "REJECTED",
        totalSteps=len(traces),
        traces=traces,
        message=f"Simulation finished. {'At least one branch reached accept state.' if accepted else 'No active branch reached an accept state.'}",
    )
