try:
    from models.schemas import DFAMachine, SimulationResult, SimulationStepTrace
except ImportError:
    from ..models.schemas import DFAMachine, SimulationResult, SimulationStepTrace

def simulate_dfa(machine: DFAMachine, input_str: str) -> SimulationResult:
    traces: List[SimulationStepTrace] = []
    current_state = machine.startState
    chars = list(input_str)

    state_lookup = {s.id: s.label for s in machine.states}

    # Initial Step
    is_initial_accept = current_state in machine.acceptStates
    traces.append(
        SimulationStepTrace(
            stepIndex=0,
            activeStates=[current_state],
            remainingInput=input_str,
            readSymbol=None,
            activeTransitionId=None,
            actionSummary=f"Started at initial state '{state_lookup.get(current_state, current_state)}'",
            status="RUNNING" if len(chars) > 0 else ("ACCEPTED" if is_initial_accept else "REJECTED"),
        )
    )

    if len(chars) == 0:
        return SimulationResult(
            accepted=is_initial_accept,
            finalStatus="ACCEPTED" if is_initial_accept else "REJECTED",
            totalSteps=1,
            traces=traces,
            message=f"Empty string ε {'accepted' if is_initial_accept else 'rejected'}.",
        )

    for i, sym in enumerate(chars):
        # Find matching transition
        transition = next(
            (t for t in machine.transitions if t.from_state == current_state and t.symbol == sym),
            None
        )

        remaining = "".join(chars[i+1:])

        if transition is None:
            traces.append(
                SimulationStepTrace(
                    stepIndex=len(traces),
                    activeStates=[],
                    remainingInput=remaining,
                    readSymbol=sym,
                    activeTransitionId=None,
                    actionSummary=f"No transition defined from '{state_lookup.get(current_state, current_state)}' on symbol '{sym}'. Trap/Dead state entered.",
                    status="REJECTED",
                )
            )
            return SimulationResult(
                accepted=False,
                finalStatus="REJECTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Rejected: No transition for symbol '{sym}' from state '{state_lookup.get(current_state, current_state)}'.",
            )

        current_state = transition.to_state
        is_last = (i == len(chars) - 1)
        is_accept = current_state in machine.acceptStates

        traces.append(
            SimulationStepTrace(
                stepIndex=len(traces),
                activeStates=[current_state],
                remainingInput=remaining,
                readSymbol=sym,
                activeTransitionId=transition.id,
                actionSummary=f"Read '{sym}' -> Transitioned to '{state_lookup.get(current_state, current_state)}'",
                status=("ACCEPTED" if is_accept else "REJECTED") if is_last else "RUNNING",
            )
        )

    accepted = current_state in machine.acceptStates
    return SimulationResult(
        accepted=accepted,
        finalStatus="ACCEPTED" if accepted else "REJECTED",
        totalSteps=len(traces),
        traces=traces,
        message=f"Simulation finished. Ended in {'accept' if accepted else 'non-accept'} state '{state_lookup.get(current_state, current_state)}'.",
    )
