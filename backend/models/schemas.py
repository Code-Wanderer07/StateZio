from typing import List, Optional, Dict, Literal, Union, Any
from pydantic import BaseModel, Field

class AutomataState(BaseModel):
    id: str
    label: str
    isInitial: bool = False
    isAccept: bool = False
    x: Optional[float] = None
    y: Optional[float] = None

class DFATransition(BaseModel):
    id: str
    from_state: str = Field(alias="from")
    to_state: str = Field(alias="to")
    symbol: str

    class Config:
        populate_by_name = True

class NFATransition(BaseModel):
    id: str
    from_state: str = Field(alias="from")
    to_state: str = Field(alias="to")
    symbol: str

    class Config:
        populate_by_name = True

class PDATransition(BaseModel):
    id: str
    from_state: str = Field(alias="from")
    to_state: str = Field(alias="to")
    inputSymbol: str
    popSymbol: str
    pushSymbols: str

    class Config:
        populate_by_name = True

class TMTransition(BaseModel):
    id: str
    from_state: str = Field(alias="from")
    to_state: str = Field(alias="to")
    readSymbol: str
    writeSymbol: str
    direction: Literal["L", "R", "S"]

    class Config:
        populate_by_name = True

class DFAMachine(BaseModel):
    type: Literal["DFA"] = "DFA"
    name: str
    alphabet: List[str]
    states: List[AutomataState]
    startState: str
    acceptStates: List[str]
    transitions: List[DFATransition]

class NFAMachine(BaseModel):
    type: Literal["NFA"] = "NFA"
    name: str
    alphabet: List[str]
    states: List[AutomataState]
    startState: str
    acceptStates: List[str]
    transitions: List[NFATransition]

class PDAMachine(BaseModel):
    type: Literal["PDA"] = "PDA"
    name: str
    inputAlphabet: List[str]
    stackAlphabet: List[str]
    initialStackSymbol: str = "Z0"
    acceptanceMode: Literal["state", "empty_stack"] = "state"
    states: List[AutomataState]
    startState: str
    acceptStates: List[str]
    transitions: List[PDATransition]

class TMMachine(BaseModel):
    type: Literal["TM"] = "TM"
    name: str
    inputAlphabet: List[str]
    tapeAlphabet: List[str]
    blankSymbol: str = "_"
    states: List[AutomataState]
    startState: str
    acceptStates: List[str]
    rejectStates: List[str]
    transitions: List[TMTransition]

class SimulationStepTrace(BaseModel):
    stepIndex: int
    activeStates: List[str]
    remainingInput: str
    readSymbol: Optional[str] = None
    activeTransitionId: Optional[str] = None
    stack: Optional[List[str]] = None
    tape: Optional[List[str]] = None
    headIndex: Optional[int] = None
    actionSummary: str
    status: Literal["RUNNING", "ACCEPTED", "REJECTED", "HALTED_ACCEPT", "HALTED_REJECT"]

class SimulationResult(BaseModel):
    accepted: bool
    finalStatus: Literal["ACCEPTED", "REJECTED", "HALTED_ACCEPT", "HALTED_REJECT"]
    totalSteps: int
    traces: List[SimulationStepTrace]
    message: str

class SimulationRequest(BaseModel):
    machine: Union[DFAMachine, NFAMachine, PDAMachine, TMMachine]
    inputString: str

class SubsetConversionResponse(BaseModel):
    convertedDfa: DFAMachine
    table: List[Dict[str, Any]]
    stepsExplanation: List[str]
