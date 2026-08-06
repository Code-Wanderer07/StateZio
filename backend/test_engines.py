"""
Test suite to verify Python engines for DFA, NFA, PDA, TM, and Subset Construction.
"""
from models.schemas import (
    DFAMachine, DFATransition, AutomataState,
    NFAMachine, NFATransition,
    PDAMachine, PDATransition,
    TMMachine, TMTransition,
)
from engine.dfa_engine import simulate_dfa
from engine.nfa_engine import simulate_nfa
from engine.pda_engine import simulate_pda
from engine.tm_engine import simulate_tm
from engine.subset_converter import convert_nfa_to_dfa

def test_dfa():
    # DFA that ends with '01'
    dfa = DFAMachine(
        name="DFA Ends with 01",
        alphabet=["0", "1"],
        startState="q0",
        acceptStates=["q2"],
        states=[
            AutomataState(id="q0", label="q0", isInitial=True, isAccept=False),
            AutomataState(id="q1", label="q1", isInitial=False, isAccept=False),
            AutomataState(id="q2", label="q2", isInitial=False, isAccept=True),
        ],
        transitions=[
            DFATransition(id="t1", **{"from": "q0", "to": "q1", "symbol": "0"}),
            DFATransition(id="t2", **{"from": "q0", "to": "q0", "symbol": "1"}),
            DFATransition(id="t3", **{"from": "q1", "to": "q1", "symbol": "0"}),
            DFATransition(id="t4", **{"from": "q1", "to": "q2", "symbol": "1"}),
            DFATransition(id="t5", **{"from": "q2", "to": "q1", "symbol": "0"}),
            DFATransition(id="t6", **{"from": "q2", "to": "q0", "symbol": "1"}),
        ]
    )

    assert simulate_dfa(dfa, "1001").accepted == True
    assert simulate_dfa(dfa, "1000").accepted == False
    assert simulate_dfa(dfa, "01").accepted == True
    assert simulate_dfa(dfa, "").accepted == False
    print("[OK] DFA Engine tests passed.")

def test_nfa_and_subset():
    # NFA for strings ending in '01'
    nfa = NFAMachine(
        name="NFA Ends in 01",
        alphabet=["0", "1"],
        startState="q0",
        acceptStates=["q2"],
        states=[
            AutomataState(id="q0", label="q0", isInitial=True, isAccept=False),
            AutomataState(id="q1", label="q1", isInitial=False, isAccept=False),
            AutomataState(id="q2", label="q2", isInitial=False, isAccept=True),
        ],
        transitions=[
            NFATransition(id="t1", **{"from": "q0", "to": "q0", "symbol": "0"}),
            NFATransition(id="t2", **{"from": "q0", "to": "q0", "symbol": "1"}),
            NFATransition(id="t3", **{"from": "q0", "to": "q1", "symbol": "0"}),
            NFATransition(id="t4", **{"from": "q1", "to": "q2", "symbol": "1"}),
        ]
    )

    assert simulate_nfa(nfa, "1001").accepted == True
    assert simulate_nfa(nfa, "100").accepted == False
    print("[OK] NFA Engine tests passed.")

    # Test Subset Converter
    conv = convert_nfa_to_dfa(nfa)
    assert len(conv.convertedDfa.states) > 0
    assert simulate_dfa(conv.convertedDfa, "1001").accepted == True
    assert simulate_dfa(conv.convertedDfa, "100").accepted == False
    print("[OK] Subset Converter tests passed.")

def test_pda():
    # PDA for a^n b^n (n >= 0)
    pda = PDAMachine(
        name="a^n b^n",
        inputAlphabet=["a", "b"],
        stackAlphabet=["a", "Z0"],
        initialStackSymbol="Z0",
        acceptanceMode="state",
        startState="q0",
        acceptStates=["q3"],
        states=[
            AutomataState(id="q0", label="q0", isInitial=True, isAccept=False),
            AutomataState(id="q1", label="q1", isInitial=False, isAccept=False),
            AutomataState(id="q2", label="q2", isInitial=False, isAccept=False),
            AutomataState(id="q3", label="q3", isInitial=False, isAccept=True),
        ],
        transitions=[
            PDATransition(id="t0_a", **{"from": "q0", "to": "q1", "inputSymbol": "a", "popSymbol": "Z0", "pushSymbols": "aZ0"}),
            PDATransition(id="t0_eps", **{"from": "q0", "to": "q3", "inputSymbol": "ε", "popSymbol": "Z0", "pushSymbols": "Z0"}),
            PDATransition(id="t1_a", **{"from": "q1", "to": "q1", "inputSymbol": "a", "popSymbol": "a", "pushSymbols": "aa"}),
            PDATransition(id="t1_b", **{"from": "q1", "to": "q2", "inputSymbol": "b", "popSymbol": "a", "pushSymbols": "ε"}),
            PDATransition(id="t2_b", **{"from": "q2", "to": "q2", "inputSymbol": "b", "popSymbol": "a", "pushSymbols": "ε"}),
            PDATransition(id="t2_eps", **{"from": "q2", "to": "q3", "inputSymbol": "ε", "popSymbol": "Z0", "pushSymbols": "Z0"}),
        ]
    )

    assert simulate_pda(pda, "").accepted == True
    assert simulate_pda(pda, "ab").accepted == True
    assert simulate_pda(pda, "aabb").accepted == True
    assert simulate_pda(pda, "aaabbb").accepted == True
    assert simulate_pda(pda, "aab").accepted == False
    assert simulate_pda(pda, "abb").accepted == False
    print("[OK] PDA Engine tests passed.")

def test_tm():
    # TM for 0^n 1^n
    tm = TMMachine(
        name="0^n 1^n TM",
        inputAlphabet=["0", "1"],
        tapeAlphabet=["0", "1", "X", "Y", "_"],
        blankSymbol="_",
        startState="q0",
        acceptStates=["q4"],
        rejectStates=["q_rej"],
        states=[
            AutomataState(id="q0", label="q0", isInitial=True, isAccept=False),
            AutomataState(id="q1", label="q1", isInitial=False, isAccept=False),
            AutomataState(id="q2", label="q2", isInitial=False, isAccept=False),
            AutomataState(id="q3", label="q3", isInitial=False, isAccept=False),
            AutomataState(id="q4", label="q4", isInitial=False, isAccept=True),
        ],
        transitions=[
            TMTransition(id="t1", **{"from": "q0", "to": "q1", "readSymbol": "0", "writeSymbol": "X", "direction": "R"}),
            TMTransition(id="t2", **{"from": "q1", "to": "q1", "readSymbol": "0", "writeSymbol": "0", "direction": "R"}),
            TMTransition(id="t3", **{"from": "q1", "to": "q1", "readSymbol": "Y", "writeSymbol": "Y", "direction": "R"}),
            TMTransition(id="t4", **{"from": "q1", "to": "q2", "readSymbol": "1", "writeSymbol": "Y", "direction": "L"}),
            TMTransition(id="t5", **{"from": "q2", "to": "q2", "readSymbol": "0", "writeSymbol": "0", "direction": "L"}),
            TMTransition(id="t6", **{"from": "q2", "to": "q2", "readSymbol": "Y", "writeSymbol": "Y", "direction": "L"}),
            TMTransition(id="t7", **{"from": "q2", "to": "q0", "readSymbol": "X", "writeSymbol": "X", "direction": "R"}),
            TMTransition(id="t8", **{"from": "q0", "to": "q3", "readSymbol": "Y", "writeSymbol": "Y", "direction": "R"}),
            TMTransition(id="t9", **{"from": "q3", "to": "q3", "readSymbol": "Y", "writeSymbol": "Y", "direction": "R"}),
            TMTransition(id="t10", **{"from": "q3", "to": "q4", "readSymbol": "_", "writeSymbol": "_", "direction": "R"}),
        ]
    )

    assert simulate_tm(tm, "01").accepted == True
    assert simulate_tm(tm, "0011").accepted == True
    assert simulate_tm(tm, "000111").accepted == True
    assert simulate_tm(tm, "001").accepted == False
    assert simulate_tm(tm, "011").accepted == False
    print("[OK] TM Engine tests passed.")

if __name__ == "__main__":
    test_dfa()
    test_nfa_and_subset()
    test_pda()
    test_tm()
    print("\n[SUCCESS] All Backend Automata Simulation & Conversion Tests Passed!")
