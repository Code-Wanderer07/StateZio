# StateZio 2.0 - Automata & Theory of Computation Visualizer

StateZio is a modern, mathematically rigorous, and visually stunning web application designed to help students and developers visualize, build, and simulate abstract state machines. Built from the ground up for Theory of Computation.

![StateZio Banner](https://img.shields.io/badge/StateZio-2.0-06b6d4?style=for-the-badge&logo=react&logoColor=white)

## ✨ Features

- **Universal Multi-Automata Support**: Fully supports building and simulating **DFA** (Deterministic Finite Automata), **NFA** (Non-deterministic Finite Automata), **PDA** (Pushdown Automata), and **TM** (Turing Machines).
- **Beautiful Dark Neon Glassmorphism UI**: A heavily customized, frosted-glass interface that stays out of your way while providing a futuristic, engaging environment.
- **Interactive Graph Editor**: Built on top of React Flow. Drag to create states, pull edges to create transitions, and double click to edit properties. Includes support for self-loops and multi-label curved edges.
- **Real-Time Simulation Engine**: 
  - Watch your machine evaluate strings step-by-step.
  - Features a live **Execution Trace Table** in the inspector sidebar.
  - Dedicated **Stack Visualizer** for PDAs and an infinite **Tape Visualizer** for Turing Machines.
- **NFA → DFA Subset Construction**: Automatically convert any NFA into a deterministic DFA. Generates the full powerset equivalence table and step-by-step mathematical derivations, then renders the new DFA directly to the canvas!
- **Batch Testing Suite**: Need to grade an assignment or verify edge cases? Define multiple input strings and expected outcomes (Pass/Fail) to evaluate them all instantly.
- **Mathematical Tuple Generator**: Automatically constructs the formal 5-tuple (or 7-tuple for TM) definition of your drawn machine in real-time.
- **Smart Auto-Layout**: Messy graph? Click the Auto-Layout wand (powered by Dagre) to instantly organize your nodes into a clean, readable structure.
- **Interactive Tour Guide**: First time here? Click the graduation cap for an animated, step-by-step guided tour of the entire interface.

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS (with custom Glassmorphism/Neon extensions)
- **Graph Visualization**: React Flow
- **Auto-Layout**: Dagre
- **Icons**: Lucide React
- **Tour Guide**: driver.js

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Code-Wanderer07/StateZio.git
   cd StateZio/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 📖 How to Use

1. **Select your Machine Type**: Use the top navigation bar to select between DFA, NFA, PDA, or TM.
2. **Draw your Machine**: 
   - Click the `+` icon on the left toolbar to spawn states.
   - Drag from the colored handles on a node to connect to another node (or back to itself for a loop).
   - Double-click a node to mark it as the Start or Accept state.
3. **Simulate**: 
   - Open the Simulation Deck at the bottom of the screen.
   - Enter an input string and hit Play.
   - Open the **Trace** tab in the right Inspector to see the exact execution path!
4. **Learn**: Click the glowing Question Mark icon (`?`) in the top right to read formal mathematical definitions and operational rules for the active machine type.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Built for Theory of Computation.*
