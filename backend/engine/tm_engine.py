from typing import List, Dict
try:
    from models.schemas import TMMachine, SimulationResult, SimulationStepTrace
except ImportError:
    from ..models.schemas import TMMachine, SimulationResult, SimulationStepTrace

def simulate_tm(machine: TMMachine, input_str: str, max_steps: int = 1000) -> SimulationResult:
    blank = machine.blankSymbol or '_'
    state_lookup = {s.id: s.label for s in machine.states}

    tape_dict: Dict[int, str] = {}
    for i, char in enumerate(input_str):
        tape_dict[i] = char

    head_pos = 0
    current_state = machine.startState
    traces: List[SimulationStepTrace] = []

    def get_tape_window():
        min_idx = min(min(tape_dict.keys(), default=0), head_pos)
        max_idx = max(max(tape_dict.keys(), default=0), head_pos)
        start = min(0, min_idx - 2)
        end = max(len(input_str) + 2, max_idx + 3)
        window = [tape_dict.get(i, blank) for i in range(start, end)]
        rel_head = head_pos - start
        return window, rel_head

    # Initial Step
    init_window, init_head = get_tape_window()
    is_init_accept = current_state in machine.acceptStates
    is_init_reject = current_state in (machine.rejectStates or [])

    traces.append(
        SimulationStepTrace(
            stepIndex=0,
            activeStates=[current_state],
            remainingInput=input_str,
            readSymbol=None,
            activeTransitionId=None,
            tape=init_window,
            headIndex=init_head,
            actionSummary=f"TM Initialized at '{state_lookup.get(current_state, current_state)}', Head pos: {head_pos}",
            status="HALTED_ACCEPT" if is_init_accept else ("HALTED_REJECT" if is_init_reject else "RUNNING"),
        )
    )

    if is_init_accept or is_init_reject:
        return SimulationResult(
            accepted=is_init_accept,
            finalStatus="ACCEPTED" if is_init_accept else "REJECTED",
            totalSteps=1,
            traces=traces,
            message=f"TM halted immediately in {'accept' if is_init_accept else 'reject'} state.",
        )

    steps_count = 0
    while steps_count < max_steps:
        steps_count += 1
        current_sym = tape_dict.get(head_pos, blank)

        if current_state in machine.acceptStates:
            w, h = get_tape_window()
            traces.append(
                SimulationStepTrace(
                    stepIndex=len(traces),
                    activeStates=[current_state],
                    remainingInput="",
                    readSymbol=current_sym,
                    activeTransitionId=None,
                    tape=w,
                    headIndex=h,
                    actionSummary=f"TM reached ACCEPT state '{state_lookup.get(current_state, current_state)}'. Halting.",
                    status="ACCEPTED",
                )
            )
            return SimulationResult(
                accepted=True,
                finalStatus="ACCEPTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Accepted: TM halted in accept state '{state_lookup.get(current_state, current_state)}'.",
            )

        if current_state in (machine.rejectStates or []):
            w, h = get_tape_window()
            traces.append(
                SimulationStepTrace(
                    stepIndex=len(traces),
                    activeStates=[current_state],
                    remainingInput="",
                    readSymbol=current_sym,
                    activeTransitionId=None,
                    tape=w,
                    headIndex=h,
                    actionSummary=f"TM reached REJECT state '{state_lookup.get(current_state, current_state)}'. Halting.",
                    status="REJECTED",
                )
            )
            return SimulationResult(
                accepted=False,
                finalStatus="REJECTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Rejected: TM halted in reject state '{state_lookup.get(current_state, current_state)}'.",
            )

        # Lookup transition: (current_state, current_sym)
        transition = next(
            (t for t in machine.transitions if t.from_state == current_state and t.readSymbol == current_sym),
            None
        )

        if transition is None:
            w, h = get_tape_window()
            traces.append(
                SimulationStepTrace(
                    stepIndex=len(traces),
                    activeStates=[current_state],
                    remainingInput="",
                    readSymbol=current_sym,
                    activeTransitionId=None,
                    tape=w,
                    headIndex=h,
                    actionSummary=f"No transition for ('{state_lookup.get(current_state, current_state)}', '{current_sym}'). TM crashed / halted implicitly.",
                    status="REJECTED",
                )
            )
            return SimulationResult(
                accepted=False,
                finalStatus="REJECTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Rejected: No transition for ('{state_lookup.get(current_state, current_state)}', '{current_sym}').",
            )

        # Execute transition: Write symbol & Move head
        tape_dict[head_pos] = transition.writeSymbol
        old_state = current_state
        current_state = transition.to_state

        if transition.direction == 'R':
            head_pos += 1
        elif transition.direction == 'L':
            head_pos -= 1

        w, h = get_tape_window()
        is_acc = current_state in machine.acceptStates
        is_rej = current_state in (machine.rejectStates or [])

        traces.append(
            SimulationStepTrace(
                stepIndex=len(traces),
                activeStates=[current_state],
                remainingInput="",
                readSymbol=current_sym,
                activeTransitionId=transition.id,
                tape=w,
                headIndex=h,
                actionSummary=f"Read '{current_sym}', wrote '{transition.writeSymbol}', moved {transition.direction} -> '{state_lookup.get(current_state, current_state)}'",
                status=("ACCEPTED" if is_acc else "REJECTED") if (is_acc or is_rej) else "RUNNING",
            )
        )

        if is_acc:
            return SimulationResult(
                accepted=True,
                finalStatus="ACCEPTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Accepted: Reached accept state '{state_lookup.get(current_state, current_state)}'.",
            )
        if is_rej:
            return SimulationResult(
                accepted=False,
                finalStatus="REJECTED",
                totalSteps=len(traces),
                traces=traces,
                message=f"Rejected: Reached explicit reject state.",
            )

    return SimulationResult(
        accepted=False,
        finalStatus="REJECTED",
        totalSteps=len(traces),
        traces=traces,
        message=f"Halted: Maximum step limit ({max_steps}) exceeded.",
    )
