from typing import List, Dict, Any, Optional
try:
    from models.schemas import DFAMachine, AutomataState, DFATransition
except ImportError:
    from ..models.schemas import DFAMachine, AutomataState, DFATransition

def solve_question_backend(prompt: str) -> Dict[str, Any]:
    query = prompt.strip().lower()

    # DFA: Ends with pattern
    import re
    ends_match = re.search(r'(?:ends?\s+(?:with|in))\s+["\']?([01ab]+)["\']?', query)
    pattern = ends_match.group(1) if ends_match else "01"
    alphabet = ['a', 'b'] if ('a' in pattern or 'b' in pattern) else ['0', '1']
    n = len(pattern)

    states = []
    for i in range(n + 1):
        matched = pattern[:i]
        states.append(
            AutomataState(
                id=f"q{i}",
                label=f"q{i} ({matched if matched else 'start'})",
                isInitial=(i == 0),
                isAccept=(i == n),
                x=100 + i * 180,
                y=220,
            )
        )

    transitions = []
    for i in range(n + 1):
        curr_prefix = pattern[:i]
        for sym in alphabet:
            cand = curr_prefix + sym
            next_idx = 0
            for l in range(min(n, len(cand)), 0, -1):
                suffix = cand[-l:]
                if pattern.startswith(suffix):
                    next_idx = l
                    break
            transitions.append(
                DFATransition(
                    id=f"t_{i}_{sym}",
                    symbol=sym,
                    **{"from": f"q{i}", "to": f"q{next_idx}"}
                )
            )

    dfa = DFAMachine(
        name=f"DFA: Ends with '{pattern}'",
        description=f"DFA accepting strings ending with '{pattern}' over Σ = {{{', '.join(alphabet)}}}.",
        alphabet=alphabet,
        states=states,
        startState="q0",
        acceptStates=[f"q{n}"],
        transitions=transitions,
    )

    return {
        "id": f"sol_dfa_ends_{pattern}",
        "title": f"DFA: Strings ending in '{pattern}'",
        "machineType": "DFA",
        "languageDescription": f"L = {{ w ∈ {{{', '.join(alphabet)}}}* | w ends with '{pattern}' }}",
        "formalDefinition": f"L = {{ x '{pattern}' | x ∈ {{{', '.join(alphabet)}}}* }}",
        "machine": dfa.model_dump(by_alias=True),
        "testCases": [
            {"input": pattern, "expected": True, "reason": f"Exact match for suffix '{pattern}'."},
            {"input": alphabet[0] + pattern, "expected": True, "reason": f"Ends with '{pattern}'."},
            {"input": pattern[:-1] if len(pattern) > 1 else alphabet[0], "expected": False, "reason": "Incomplete suffix."},
        ],
    }
