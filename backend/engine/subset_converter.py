from typing import List, Set, Dict, Any, Tuple
try:
    from models.schemas import NFAMachine, DFAMachine, DFATransition, AutomataState, SubsetConversionResponse
    from engine.nfa_engine import get_epsilon_closure
except ImportError:
    from ..models.schemas import NFAMachine, DFAMachine, DFATransition, AutomataState, SubsetConversionResponse
    from .nfa_engine import get_epsilon_closure

def convert_nfa_to_dfa(machine: NFAMachine) -> SubsetConversionResponse:
    state_lookup = {s.id: s.label for s in machine.states}
    alphabet = [a for a in machine.alphabet if a not in ('ε', '', 'eps')]

    initial_closure = get_epsilon_closure({machine.startState}, machine)
    unprocessed_subsets: List[Set[str]] = [initial_closure]
    seen_subsets: List[Set[str]] = [initial_closure]

    def subset_to_key(subset: Set[str]) -> str:
        return ",".join(sorted(subset))

    def subset_to_label(subset: Set[str]) -> str:
        if len(subset) == 0:
            return "∅"
        labels = [state_lookup.get(s, s) for s in sorted(subset)]
        return f"{{{','.join(labels)}}}"

    dfa_state_counter = 0
    dfa_state_names: Dict[str, str] = {
        subset_to_key(initial_closure): f"Q{dfa_state_counter}"
    }

    dfa_states: List[AutomataState] = []
    dfa_transitions: List[DFATransition] = []
    table_rows: List[Dict[str, Any]] = []
    steps_explanation: List[str] = []

    init_key = subset_to_key(initial_closure)
    init_label = subset_to_label(initial_closure)
    steps_explanation.append(
        f"Step 1: Compute ε-closure of NFA start state '{state_lookup.get(machine.startState, machine.startState)}' -> {init_label}. This forms initial DFA state Q0."
    )

    while unprocessed_subsets:
        current_subset = unprocessed_subsets.pop(0)
        curr_key = subset_to_key(current_subset)
        curr_dfa_id = dfa_state_names[curr_key]
        curr_label = subset_to_label(current_subset)

        is_initial = (curr_key == init_key)
        is_accept = any(s in machine.acceptStates for s in current_subset)

        dfa_states.append(
            AutomataState(
                id=curr_dfa_id,
                label=f"{curr_dfa_id} = {curr_label}",
                isInitial=is_initial,
                isAccept=is_accept,
            )
        )

        row_transitions: Dict[str, Any] = {}

        for sym in alphabet:
            target_nfa_states: Set[str] = set()
            for nfa_state in current_subset:
                for t in machine.transitions:
                    if t.from_state == nfa_state and t.symbol == sym:
                        target_nfa_states.add(t.to_state)

            target_closure = get_epsilon_closure(target_nfa_states, machine)
            target_key = subset_to_key(target_closure)
            target_label = subset_to_label(target_closure)

            if len(target_closure) > 0:
                if target_key not in dfa_state_names:
                    dfa_state_counter += 1
                    dfa_state_names[target_key] = f"Q{dfa_state_counter}"
                    unprocessed_subsets.append(target_closure)
                    seen_subsets.append(target_closure)
                    steps_explanation.append(
                        f"Discovered new DFA state Q{dfa_state_counter} = {target_label} on reading '{sym}' from {curr_dfa_id}."
                    )

                target_dfa_id = dfa_state_names[target_key]
                dfa_transitions.append(
                    DFATransition(
                        id=f"t_{curr_dfa_id}_{sym}_{target_dfa_id}",
                        **{"from": curr_dfa_id, "to": target_dfa_id, "symbol": sym}
                    )
                )

                row_transitions[sym] = {
                    "targetName": f"{target_dfa_id} = {target_label}",
                    "targetSubset": sorted(list(target_closure)),
                }
            else:
                row_transitions[sym] = None

        table_rows.append({
            "dfaStateName": f"{curr_dfa_id} = {curr_label}",
            "nfaSubset": sorted(list(current_subset)),
            "transitions": row_transitions,
            "isInitial": is_initial,
            "isAccept": is_accept,
        })

    converted_dfa = DFAMachine(
        type="DFA",
        name=f"DFA ({machine.name})",
        alphabet=alphabet,
        states=dfa_states,
        startState="Q0",
        acceptStates=[s.id for s in dfa_states if s.isAccept],
        transitions=dfa_transitions,
    )

    steps_explanation.append(
        f"Subset construction complete! Generated {len(dfa_states)} DFA states and {len(dfa_transitions)} transitions."
    )

    return SubsetConversionResponse(
        convertedDfa=converted_dfa,
        table=table_rows,
        stepsExplanation=steps_explanation,
    )
