# ⚡ StateZio — Automata Theory Visualizer & AI Suite

> An interactive, next-generation visual platform for **Theory of Computation (TOC)** — covering **DFA**, **NFA**, **Pushdown Automata (PDA)**, **Turing Machines (TM)**, Subset Construction, and an automated **AI Question Solver**.

<div align="center">

[![StateZio v1.0](https://img.shields.io/badge/StateZio-v1.0-38BDF8?style=for-the-badge&logo=electron&logoColor=white)](https://github.com/Code-Wanderer07/toc-visualizer)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

</div>

---

## 👨‍💻 Created by
**Shivakanth**  
🔗 **LinkedIn**: [linkedin.com/in/shivakanth-m-701631380](https://www.linkedin.com/in/shivakanth-m-701631380)  
🐙 **GitHub**: [@Code-Wanderer07](https://github.com/Code-Wanderer07)

---

## ✨ Features & Capabilities

### 1. 🎯 Finite Automata (DFA & NFA)
- **Deterministic Finite Automata (DFA)** & **Non-Deterministic Finite Automata (NFA)** with spontaneous $\epsilon$-transitions.
- **Interactive Graph Canvas**:
  - Drag-and-drop state creation, customizable transition loops, and instant Start / Accept state toggles.
  - Dagre-powered hierarchical auto-layout.
- **NFA-to-DFA Subset Construction Drawer**:
  - Real-time $\epsilon$-closure computation.
  - Interactive mathematical transition table displaying powerset subsets.
  - 1-click apply converted DFA directly to the canvas.

### 2. 🥞 Pushdown Automata (PDA)
- **Interactive Stack Visualizer**: Live LIFO stack push/pop animations, top-of-stack tracker, and $Z_0$ bottom-of-stack marker.
- Supports both **Final State Acceptance** and **Empty Stack Acceptance**.
- Multi-symbol stack pushes (e.g., `aZ0`, `aa`, `ε`).

### 3. 📼 Turing Machines (TM)
- **Dynamic Horizontal Tape Visualizer**: Infinite bi-directional tape representation with smooth read/write head animations ($L, R, S$).
- Step-by-step transition trace and live tape mutation tracking.
- Pre-built Turing models for binary incrementers, $a^n b^n c^n$, 1's complement, and string matchers.

### 4. 🧠 AI Question Solver & Automata Synthesizer
- **Natural Language Problem Solver**: Ask any standard exam question (e.g., *"Design a DFA for binary divisible by 3"*, *"Construct PDA for a^n b^n"*).
- **Formal Proofs & Mathematical Breakdown**:
  - Full 5-tuple / 7-tuple mathematical definitions $\langle Q, \Sigma, \delta, q_0, F \rangle$.
  - State invariant explanations and step-by-step construction rationale.
  - Automated test case generator with expected outputs.
- **1-Click "Load onto Canvas & Simulate"**: Automatically loads synthesized automata directly into the simulation engine.
- **Curated Question Bank**: 15+ university exam problems across DFA, NFA, PDA, and TM.

### 5. 🔬 Diagnostics, Simulation Deck & Batch Testing
- **Simulation Control Deck**: Play, Pause, Step Forward, Step Backward, and variable Speed Adjuster ($0.5\times - 2.0\times$).
- **Live Trace Table**: Real-time table logging current state, remaining input, tape head position, and stack contents.
- **Batch Testing Suite**: Run positive/negative test suites simultaneously with instant pass/fail validation.
- **Export & Import**: Export automata definitions as JSON, or save graph snapshots as PNG.

---

## 🏛️ Project Architecture

```
toc-visualizer/
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── public/                # Static assets & StateZio logos
│   └── src/
│       ├── components/
│       │   ├── canvas/        # React Flow graph canvas, nodes & edges
│       │   ├── conversion/    # Subset construction (NFA → DFA) drawer
│       │   ├── landing/       # StateZio interactive guide & landing page
│       │   ├── sidebar/       # Presets, Machine properties & Export/Import
│       │   ├── simulation/    # Simulation deck, trace table & batch tester
│       │   ├── solver/        # AI Question Solver & curated problem bank
│       │   ├── ui/            # High-contrast dark navbar & modals
│       │   └── visualizers/   # Live PDA Stack & TM Tape visualizers
│       ├── engine/            # Client-side DFA, NFA, PDA, TM & Solver engines
│       ├── presets/           # Pre-built automata models
│       ├── store/             # Zustand state management
│       └── types/             # TypeScript interfaces
└── backend/                   # FastAPI + Pydantic Simulation & Verification
    ├── engine/                # Python automata execution engines
    ├── models/                # Pydantic schema validation
    ├── main.py                # REST API endpoints
    └── test_engines.py        # Automated backend test suite
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)

---

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API endpoints available at **[http://127.0.0.1:8000](http://127.0.0.1:8000)** (Interactive Docs at **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**).

---

## 🧪 Testing

### Backend Test Suite
```bash
cd backend
python test_engines.py
```

### Frontend Build & Lint Verification
```bash
cd frontend
npm run build
```

---

## 📄 License
Distributed under the **MIT License**. Created with ❤️ for Theory of Computation students, researchers, and educators.
