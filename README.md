# 🔮 TOC Visualizer & Automata AI Suite

> An interactive, modern educational suite for **Theory of Computation (TOC)** covering Finite Automata, Pushdown Automata, Turing Machines, and an automated AI Question Solver.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

---

## 🌟 Features

### 1. 🧠 Module 1: Finite Automata & Converters
- **Deterministic Finite Automata (DFA)** & **Non-Deterministic Finite Automata (NFA)** with $\epsilon$-transitions.
- **Interactive Graph Canvas**: Drag & drop states, configure transitions, set start/accept states with Dagre-based auto-layout.
- **NFA-to-DFA Subset Construction Converter**:
  - Live $\epsilon$-closure computation.
  - Complete power-set transition table with step-by-step mathematical trace.
  - 1-click apply converted DFA to the canvas.

### 2. 🥞 Module 3: Pushdown Automata (PDA)
- **Dynamic Stack Visualizer**: Real-time stack push/pop animations, top-of-stack tracker, and $Z_0$ bottom marker.
- Supports both **Final State Acceptance** and **Empty Stack Acceptance**.
- Multi-symbol stack pushes (e.g. `aZ0`, `aa`, `ε`).

### 3. 📼 Module 4: Turing Machines (TM)
- **Dynamic Horizontal Tape Visualizer**: Infinite tape representation with smooth read/write head animations ($L, R, S$).
- Step-by-step state and tape transitions.

### 4. ✨ AI Question Solver & Automata Synthesizer
- **Natural Language Problem Synthesis**: Enter prompts like *"Design a DFA for binary strings divisible by 3"* or *"Construct a PDA for a^n b^n"*.
- **Textbook-Quality Formal Proofs**:
  - Formal 5-Tuple / 7-Tuple definitions $\langle Q, \Sigma, \delta, q_0, F \rangle$.
  - State meaning and invariant breakdown.
  - Step-by-step construction rationale.
  - Automated test vector generation.
- **1-Click "Load onto Canvas & Simulate"**: Automatically renders synthesized automata on the canvas.
- **15+ Exam Question Bank**: Curated university exam questions across all modules.

### 5. 🛠️ Diagnostics & Utilities
- **Simulation Control Deck**: Step Forward, Step Backward, Auto-Play, Pause, and Speed Control ($0.25\times - 4.0\times$).
- **Batch Testing Suite**: Validate multiple test cases simultaneously with pass/fail metrics.
- **Export & Import**: Save and load automata as JSON, or export graph snapshots as PNG.

---

## 🏗️ Architecture

```
toc-visualizer/
├── frontend/                # React + Vite + React Flow + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Canvas, Visualizers, Solver Modal, Controls
│   │   ├── engine/          # Client-side DFA, NFA, PDA, TM & Solver Engines
│   │   ├── presets/         # Library of pre-built automata
│   │   ├── store/           # Zustand state management
│   │   └── types/           # Core TypeScript type definitions
│   └── package.json
└── backend/                 # FastAPI + Pydantic Simulation & Verification
    ├── engine/              # Python DFA, NFA, PDA, TM & Subset Engines
    ├── models/              # Pydantic Schemas
    ├── main.py              # REST API endpoints
    └── test_engines.py      # Automated test suite
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)

---

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at **http://localhost:5173/**.

---

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
The backend API will start at **http://localhost:8000/** (Docs: **http://localhost:8000/docs**).

---

## 🧪 Running Tests

### Backend Unit Tests
```bash
cd backend
python test_engines.py
```

### Frontend Build & Typecheck
```bash
cd frontend
npm run build
```

---

## 📄 License
MIT License. Created for Theory of Computation education & research.
