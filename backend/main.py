from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
try:
    from models.schemas import (
        DFAMachine,
        NFAMachine,
        PDAMachine,
        TMMachine,
        SimulationRequest,
        SimulationResult,
        SubsetConversionResponse,
    )
    from engine.dfa_engine import simulate_dfa
    from engine.nfa_engine import simulate_nfa
    from engine.pda_engine import simulate_pda
    from engine.tm_engine import simulate_tm
    from engine.subset_converter import convert_nfa_to_dfa
    from engine.question_solver import solve_question_backend
except ImportError:
    from .models.schemas import (
        DFAMachine,
        NFAMachine,
        PDAMachine,
        TMMachine,
        SimulationRequest,
        SimulationResult,
        SubsetConversionResponse,
    )
    from .engine.dfa_engine import simulate_dfa
    from .engine.nfa_engine import simulate_nfa
    from .engine.pda_engine import simulate_pda
    from .engine.tm_engine import simulate_tm
    from .engine.subset_converter import convert_nfa_to_dfa
    from .engine.question_solver import solve_question_backend

app = FastAPI(
    title="TOC Visualizer API",
    description="Theory of Computation Automata Simulation & Conversion Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "name": "TOC Visualizer Backend Engine",
        "version": "1.0.0",
        "modules": ["Module 1 (DFA/NFA)", "Module 3 (PDA)", "Module 4 (TM)"],
    }

@app.post("/api/simulate/dfa", response_model=SimulationResult)
def api_simulate_dfa(machine: DFAMachine, input_str: str = ""):
    return simulate_dfa(machine, input_str)

@app.post("/api/simulate/nfa", response_model=SimulationResult)
def api_simulate_nfa(machine: NFAMachine, input_str: str = ""):
    return simulate_nfa(machine, input_str)

@app.post("/api/simulate/pda", response_model=SimulationResult)
def api_simulate_pda(machine: PDAMachine, input_str: str = ""):
    return simulate_pda(machine, input_str)

@app.post("/api/simulate/tm", response_model=SimulationResult)
def api_simulate_tm(machine: TMMachine, input_str: str = ""):
    return simulate_tm(machine, input_str)

@app.post("/api/convert/nfa-to-dfa", response_model=SubsetConversionResponse)
def api_convert_nfa_to_dfa(machine: NFAMachine):
    return convert_nfa_to_dfa(machine)

@app.post("/api/solve-question")
def api_solve_question(prompt: str = ""):
    return solve_question_backend(prompt)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
