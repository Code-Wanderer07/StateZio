import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from '@xyflow/react';
import {
  AutomataMachine,
  BatchTestCase,
  DFAMachine,
  DFATransition,
  MachineType,
  NFAMachine,
  NFATransition,
  PDAMachine,
  PDATransition,
  PresetAutomata,
  SimulationResult,
  SubsetConstructionResult,
  TMMachine,
  TMTransition,
} from '../types/automata';
import { dfaEndsWith01 } from '../presets/dfaPresets';
import { simulateDFA } from '../engine/dfaEngine';
import { simulateNFA } from '../engine/nfaEngine';
import { simulatePDA } from '../engine/pdaEngine';
import { simulateTM } from '../engine/tmEngine';
import { convertNFAToDFA } from '../engine/subsetConstruction';
import { flowElementsToMachine, machineToFlowElements } from '../utils/graphConverter';
import { getLayoutedElements } from '../utils/layout';

interface AutomataStateStore {
  // Machine State
  machine: AutomataMachine;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  activePresetId: string | null;

  // Simulation State
  inputString: string;
  simulationResult: SimulationResult | null;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.25 to 4.0

  // Batch Testing
  batchTestCases: BatchTestCase[];

  // Subset Construction Result (Module 1)
  subsetResult: SubsetConstructionResult | null;
  isSubsetDrawerOpen: boolean;

  // Theme
  theme: 'light' | 'dark';

  // Modals & UI
  isExportImportOpen: boolean;
  isTransitionModalOpen: boolean;
  transitionModalSourceId: string | null;
  transitionModalTargetId: string | null;
  editingTransitionId: string | null;
  isGuideOpen: boolean;

  // Actions
  setMachine: (machine: AutomataMachine) => void;
  setMachineType: (type: MachineType) => void;
  loadPreset: (preset: PresetAutomata) => void;
  loadSolvedMachine: (machine: AutomataMachine, testCases?: { input: string; expected: boolean }[]) => void;
  setInputString: (input: string) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleTheme: () => void;
  setIsGuideOpen: (open: boolean) => void;

  // History (Undo/Redo)
  pastStates: { machine: AutomataMachine; nodes: Node[]; edges: Edge[] }[];
  futureStates: { machine: AutomataMachine; nodes: Node[]; edges: Edge[] }[];
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Graph Manipulations
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addState: () => void;
  deleteState: (id: string) => void;
  toggleInitialState: (id: string) => void;
  toggleAcceptState: (id: string) => void;
  renameState: (id: string, label: string) => void;
  openTransitionModal: (source: string, target: string, editTransitionId?: string) => void;
  closeTransitionModal: () => void;
  saveTransition: (data: {
    symbol?: string;
    inputSymbol?: string;
    popSymbol?: string;
    pushSymbols?: string;
    readSymbol?: string;
    writeSymbol?: string;
    direction?: 'L' | 'R' | 'S';
  }) => void;
  deleteTransition: (id: string) => void;
  autoLayout: () => void;
  clearCanvas: () => void;

  // Simulation Controls
  runSimulation: (customInput?: string) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetSimulation: () => void;
  jumpToStep: (stepIndex: number) => void;

  // Batch Testing
  runBatchTests: () => void;
  addBatchTestCase: (input: string, expected: boolean) => void;
  deleteBatchTestCase: (id: string) => void;

  // Subset Construction
  runSubsetConstruction: () => void;
  applyConvertedDFA: () => void;
  setIsSubsetDrawerOpen: (open: boolean) => void;

  // Modals
  setIsExportImportOpen: (open: boolean) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
}

const initialPreset = dfaEndsWith01;
const initialFlow = machineToFlowElements(initialPreset.machine);

export const useAutomataStore = create<AutomataStateStore>((set, get) => ({
  machine: initialPreset.machine,
  nodes: initialFlow.nodes,
  edges: initialFlow.edges,
  selectedNodeId: null,
  selectedEdgeId: null,
  activePresetId: initialPreset.id,

  inputString: '1001',
  simulationResult: null,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,

  batchTestCases: initialPreset.testCases.map((tc, idx) => ({
    id: `batch_${idx}`,
    input: tc.input,
    expected: tc.expected,
    status: 'PENDING',
  })),

  subsetResult: null,
  isSubsetDrawerOpen: false,
  isExportImportOpen: false,
  isTransitionModalOpen: false,
  transitionModalSourceId: null,
  transitionModalTargetId: null,
  editingTransitionId: null,
  isGuideOpen: false,

  theme: 'dark', // Default theme

  // History
  pastStates: [],
  futureStates: [],
  pushHistory: () => {
    const { pastStates, machine, nodes, edges } = get();
    // Deep clone to prevent reference mutations
    const snapshot = {
      machine: JSON.parse(JSON.stringify(machine)),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    set({
      pastStates: [...pastStates, snapshot].slice(-50),
      futureStates: [],
    });
  },
  undo: () => {
    const { pastStates, futureStates, machine, nodes, edges } = get();
    if (pastStates.length === 0) return;
    const newPast = [...pastStates];
    const prevState = newPast.pop()!;
    const currentSnapshot = {
      machine: JSON.parse(JSON.stringify(machine)),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    set({
      machine: prevState.machine,
      nodes: prevState.nodes,
      edges: prevState.edges,
      pastStates: newPast,
      futureStates: [currentSnapshot, ...futureStates],
      selectedNodeId: null,
      selectedEdgeId: null,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },
  redo: () => {
    const { pastStates, futureStates, machine, nodes, edges } = get();
    if (futureStates.length === 0) return;
    const newFuture = [...futureStates];
    const nextState = newFuture.shift()!;
    const currentSnapshot = {
      machine: JSON.parse(JSON.stringify(machine)),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    set({
      machine: nextState.machine,
      nodes: nextState.nodes,
      edges: nextState.edges,
      pastStates: [...pastStates, currentSnapshot],
      futureStates: newFuture,
      selectedNodeId: null,
      selectedEdgeId: null,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setMachine: (machine) => {
    const flow = machineToFlowElements(machine);
    set({
      machine,
      nodes: flow.nodes,
      edges: flow.edges,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      subsetResult: null,
    });
  },

  setMachineType: (type) => {
    const current = get().machine;
    if (current.type === type) return;

    let newMachine: AutomataMachine;
    if (type === 'DFA') {
      newMachine = {
        type: 'DFA',
        name: 'New DFA',
        alphabet: ['0', '1'],
        startState: 'q0',
        acceptStates: ['q1'],
        states: [
          { id: 'q0', label: 'q0', isInitial: true, isAccept: false, x: 150, y: 200 },
          { id: 'q1', label: 'q1', isInitial: false, isAccept: true, x: 400, y: 200 },
        ],
        transitions: [{ id: 't0_1', from: 'q0', to: 'q1', symbol: '1' }],
      };
    } else if (type === 'NFA') {
      newMachine = {
        type: 'NFA',
        name: 'New NFA',
        alphabet: ['0', '1'],
        startState: 'q0',
        acceptStates: ['q1'],
        states: [
          { id: 'q0', label: 'q0', isInitial: true, isAccept: false, x: 150, y: 200 },
          { id: 'q1', label: 'q1', isInitial: false, isAccept: true, x: 400, y: 200 },
        ],
        transitions: [{ id: 't0_eps', from: 'q0', to: 'q1', symbol: 'ε' }],
      };
    } else if (type === 'PDA') {
      newMachine = {
        type: 'PDA',
        name: 'New PDA',
        inputAlphabet: ['a', 'b'],
        stackAlphabet: ['a', 'Z0'],
        initialStackSymbol: 'Z0',
        acceptanceMode: 'state',
        startState: 'q0',
        acceptStates: ['q1'],
        states: [
          { id: 'q0', label: 'q0', isInitial: true, isAccept: false, x: 150, y: 200 },
          { id: 'q1', label: 'q1', isInitial: false, isAccept: true, x: 400, y: 200 },
        ],
        transitions: [{ id: 'pda_t1', from: 'q0', to: 'q1', inputSymbol: 'a', popSymbol: 'Z0', pushSymbols: 'aZ0' }],
      };
    } else {
      newMachine = {
        type: 'TM',
        name: 'New Turing Machine',
        inputAlphabet: ['0', '1'],
        tapeAlphabet: ['0', '1', '_'],
        blankSymbol: '_',
        startState: 'q0',
        acceptStates: ['q_acc'],
        rejectStates: ['q_rej'],
        states: [
          { id: 'q0', label: 'q0', isInitial: true, isAccept: false, x: 150, y: 200 },
          { id: 'q_acc', label: 'q_acc', isInitial: false, isAccept: true, x: 400, y: 200 },
        ],
        transitions: [{ id: 'tm_t1', from: 'q0', to: 'q_acc', readSymbol: '1', writeSymbol: '1', direction: 'R' }],
      };
    }

    const flow = machineToFlowElements(newMachine);
    set({
      machine: newMachine,
      nodes: flow.nodes,
      edges: flow.edges,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      activePresetId: null,
      subsetResult: null,
      batchTestCases: [],
    });
  },

  loadPreset: (preset) => {
    const flow = machineToFlowElements(preset.machine);
    const testCases: BatchTestCase[] = preset.testCases.map((tc, idx) => ({
      id: `tc_${idx}`,
      input: tc.input,
      expected: tc.expected,
      status: 'PENDING',
    }));

    set({
      machine: preset.machine,
      nodes: flow.nodes,
      edges: flow.edges,
      activePresetId: preset.id,
      inputString: preset.testCases[0]?.input ?? '',
      batchTestCases: testCases,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      subsetResult: null,
    });
  },

  loadSolvedMachine: (machine, testCases = []) => {
    const flow = machineToFlowElements(machine);
    const layouted = getLayoutedElements(flow.nodes, flow.edges, 'LR');
    const initialInput = testCases[0]?.input ?? (machine.type === 'PDA' ? 'aabb' : '01');
    const batchCases: BatchTestCase[] = testCases.map((tc, idx) => ({
      id: `sol_tc_${idx}`,
      input: tc.input,
      expected: tc.expected,
      status: 'PENDING',
    }));

    let initialSimResult = null;
    try {
      if (machine.type === 'DFA') {
        initialSimResult = simulateDFA(machine as DFAMachine, initialInput);
      } else if (machine.type === 'NFA') {
        initialSimResult = simulateNFA(machine as NFAMachine, initialInput);
      } else if (machine.type === 'PDA') {
        initialSimResult = simulatePDA(machine as PDAMachine, initialInput);
      } else {
        initialSimResult = simulateTM(machine as TMMachine, initialInput);
      }
    } catch (e) {
      console.warn('Initial simulation preview error:', e);
    }

    set({
      machine,
      nodes: layouted.nodes,
      edges: layouted.edges,
      activePresetId: null,
      inputString: initialInput,
      batchTestCases: batchCases,
      simulationResult: initialSimResult,
      currentStepIndex: 0,
      isPlaying: false,
      subsetResult: null,
    });

    if (initialSimResult && initialSimResult.traces.length > 0) {
      get().jumpToStep(0);
    }
  },

  setInputString: (inputString) => {
    // Guard: limit simulation input to 5000 characters to prevent hang
    const safeInput = inputString.slice(0, 5000);
    set({ inputString: safeInput, simulationResult: null, currentStepIndex: 0, isPlaying: false });
  },

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsGuideOpen: (isOpen) => set({ isGuideOpen: isOpen }),

  onNodesChange: (changes) => {
    // Only push history for structural changes (remove), ignore position changes to avoid blowing up history stack
    const isStructural = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isStructural) get().pushHistory();

    const nextNodes = applyNodeChanges(changes, get().nodes);
    
    // Performance Fix: Do not rebuild the machine object if the change is just an active drag.
    // Rebuilding the machine causes massive full-tree re-renders at 60fps.
    const isDragging = changes.some((c) => c.type === 'position' && c.dragging);
    
    if (isDragging) {
      set({ nodes: nextNodes });
    } else {
      const updatedMachine = flowElementsToMachine(nextNodes, get().edges, get().machine);
      set({ nodes: nextNodes, machine: updatedMachine });
    }
  },

  onEdgesChange: (changes) => {
    const isStructural = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isStructural) get().pushHistory();

    const nextEdges = applyEdgeChanges(changes, get().edges);
    const updatedMachine = flowElementsToMachine(get().nodes, nextEdges, get().machine);
    set({ edges: nextEdges, machine: updatedMachine });
  },

  onConnect: (connection) => {
    get().pushHistory();
    const newEdge: Edge = {
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source!,
      target: connection.target!,
      type: connection.source === connection.target ? 'selfLoopEdge' : 'customTransitionEdge',
    };
    const nextEdges = addEdge(newEdge, get().edges);
    const updatedMachine = flowElementsToMachine(get().nodes, nextEdges, get().machine);
    set({ edges: nextEdges, machine: updatedMachine });
    
    // Auto-open transition modal for the new connection
    setTimeout(() => {
      get().openTransitionModal(connection.source!, connection.target!);
    }, 10);
  },

  addState: () => {
    get().pushHistory();
    const { machine, nodes, edges } = get();
    const maxIndex = nodes.reduce((max, n) => {
      const match = n.id.match(/^q(\d+)$/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, -1);
    const newId = `q${maxIndex + 1}`;
    const newNode: Node = {
      id: newId,
      type: 'customState',
      position: { x: 120 + ((maxIndex + 1) % 5) * 160, y: 150 + Math.floor((maxIndex + 1) / 5) * 140 },
      data: {
        label: newId,
        isInitial: nodes.length === 0,
        isAccept: false,
        isActive: false,
      },
    };

    const nextNodes = [...nodes, newNode];
    const updatedMachine = flowElementsToMachine(nextNodes, edges, machine);
    set({ nodes: nextNodes, machine: updatedMachine });
  },

  deleteState: (id) => {
    get().pushHistory();
    const { machine, nodes, edges } = get();
    const nextNodes = nodes.filter((n) => n.id !== id);
    const nextEdges = edges.filter((e) => e.source !== id && e.target !== id);
    const updatedMachine = flowElementsToMachine(nextNodes, nextEdges, machine);
    set({ nodes: nextNodes, edges: nextEdges, machine: updatedMachine, selectedNodeId: null });
  },

  toggleInitialState: (id) => {
    get().pushHistory();
    const { nodes, edges, machine } = get();
    const nextNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        isInitial: n.id === id ? !n.data.isInitial : false,
      },
    }));
    const updatedMachine = flowElementsToMachine(nextNodes, edges, machine);
    set({ nodes: nextNodes, machine: updatedMachine });
  },

  toggleAcceptState: (id) => {
    get().pushHistory();
    const { nodes, edges, machine } = get();
    const nextNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        isAccept: n.id === id ? !n.data.isAccept : n.data.isAccept,
      },
    }));
    const updatedMachine = flowElementsToMachine(nextNodes, edges, machine);
    set({ nodes: nextNodes, machine: updatedMachine });
  },

  renameState: (id, label) => {
    get().pushHistory();
    const { nodes, edges, machine } = get();
    const nextNodes = nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n));
    const updatedMachine = flowElementsToMachine(nextNodes, edges, machine);
    set({ nodes: nextNodes, machine: updatedMachine });
  },

  openTransitionModal: (source, target, editTransitionId) => {
    set({
      isTransitionModalOpen: true,
      transitionModalSourceId: source,
      transitionModalTargetId: target,
      editingTransitionId: editTransitionId || null,
    });
  },

  closeTransitionModal: () => {
    set({
      isTransitionModalOpen: false,
      transitionModalSourceId: null,
      transitionModalTargetId: null,
      editingTransitionId: null,
    });
  },

  saveTransition: (data) => {
    get().pushHistory();
    const {
      machine,
      nodes,
      edges,
      transitionModalSourceId,
      transitionModalTargetId,
      editingTransitionId,
    } = get();

    if (!transitionModalSourceId || !transitionModalTargetId) return;

    const transitionId = editingTransitionId || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let updatedMachine: AutomataMachine;

    switch (machine.type) {
      case 'DFA': {
        const filtered = editingTransitionId ? machine.transitions.filter((t) => t.id !== editingTransitionId) : machine.transitions;
        const newT: DFATransition = {
          id: transitionId,
          from: transitionModalSourceId,
          to: transitionModalTargetId,
          symbol: data.symbol || '0',
        };
        updatedMachine = { ...machine, transitions: [...filtered, newT] };
        break;
      }
      case 'NFA': {
        const filtered = editingTransitionId ? machine.transitions.filter((t) => t.id !== editingTransitionId) : machine.transitions;
        const newT: NFATransition = {
          id: transitionId,
          from: transitionModalSourceId,
          to: transitionModalTargetId,
          symbol: data.symbol || 'ε',
        };
        updatedMachine = { ...machine, transitions: [...filtered, newT] };
        break;
      }
      case 'PDA': {
        const filtered = editingTransitionId ? machine.transitions.filter((t) => t.id !== editingTransitionId) : machine.transitions;
        const newT: PDATransition = {
          id: transitionId,
          from: transitionModalSourceId,
          to: transitionModalTargetId,
          inputSymbol: data.inputSymbol || 'ε',
          popSymbol: data.popSymbol || 'Z0',
          pushSymbols: data.pushSymbols || 'Z0',
        };
        updatedMachine = { ...machine, transitions: [...filtered, newT] };
        break;
      }
      case 'TM': {
        const filtered = editingTransitionId ? machine.transitions.filter((t) => t.id !== editingTransitionId) : machine.transitions;
        const newT: TMTransition = {
          id: transitionId,
          from: transitionModalSourceId,
          to: transitionModalTargetId,
          readSymbol: data.readSymbol || '_',
          writeSymbol: data.writeSymbol || '_',
          direction: (data.direction as 'L'|'R'|'S') || 'R',
        };
        updatedMachine = { ...machine, transitions: [...filtered, newT] };
        break;
      }
    }

    const flow = machineToFlowElements(updatedMachine);
    set({
      machine: updatedMachine,
      nodes: flow.nodes,
      edges: flow.edges,
      isTransitionModalOpen: false,
      transitionModalSourceId: null,
      transitionModalTargetId: null,
      editingTransitionId: null,
    });
  },

  deleteTransition: (id) => {
    get().pushHistory();
    const { machine } = get();
    let updatedMachine: AutomataMachine;

    switch (machine.type) {
      case 'DFA':
        updatedMachine = { ...machine, transitions: machine.transitions.filter((t) => t.id !== id) };
        break;
      case 'NFA':
        updatedMachine = { ...machine, transitions: machine.transitions.filter((t) => t.id !== id) };
        break;
      case 'PDA':
        updatedMachine = { ...machine, transitions: machine.transitions.filter((t) => t.id !== id) };
        break;
      case 'TM':
        updatedMachine = { ...machine, transitions: machine.transitions.filter((t) => t.id !== id) };
        break;
    }

    const flow = machineToFlowElements(updatedMachine);
    set({ machine: updatedMachine, nodes: flow.nodes, edges: flow.edges, selectedEdgeId: null });
  },

  autoLayout: () => {
    get().pushHistory();
    const { nodes, edges } = get();
    const layouted = getLayoutedElements(nodes, edges, 'LR');
    set({ nodes: layouted.nodes, edges: layouted.edges });
  },

  clearCanvas: () => {
    get().pushHistory();
    const { machine } = get();
    let clearedMachine: AutomataMachine;

    if (machine.type === 'TM') {
      clearedMachine = {
        ...machine,
        states: [],
        startState: '',
        acceptStates: [],
        rejectStates: [],
        transitions: [],
      };
    } else {
      clearedMachine = {
        ...machine,
        states: [],
        startState: '',
        acceptStates: [],
        transitions: [],
      };
    }
    set({
      machine: clearedMachine,
      nodes: [],
      edges: [],
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  runSimulation: (customInput) => {
    const input = customInput !== undefined ? customInput : get().inputString;
    const { machine } = get();
    let result: SimulationResult;

    try {
      if (machine.type === 'DFA') {
        result = simulateDFA(machine as DFAMachine, input);
      } else if (machine.type === 'NFA') {
        result = simulateNFA(machine as NFAMachine, input);
      } else if (machine.type === 'PDA') {
        result = simulatePDA(machine as PDAMachine, input);
      } else {
        result = simulateTM(machine as TMMachine, input);
      }
    } catch (err) {
      result = {
        accepted: false,
        finalStatus: 'REJECTED' as const,
        traces: [],
        totalSteps: 0,
        message: err instanceof Error ? err.message : 'Simulation error. Check machine definition.',
      };
    }

    set({
      simulationResult: result,
      currentStepIndex: 0,
      isPlaying: false,
    });

    get().jumpToStep(0);
  },

  stepForward: () => {
    const { simulationResult, currentStepIndex } = get();
    if (!simulationResult || simulationResult.traces.length === 0) {
      get().runSimulation();
      return;
    }
    if (currentStepIndex < simulationResult.traces.length - 1) {
      const nextIndex = currentStepIndex + 1;
      get().jumpToStep(nextIndex);
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      get().jumpToStep(currentStepIndex - 1);
    }
  },

  resetSimulation: () => {
    set({ currentStepIndex: 0, isPlaying: false });
    get().jumpToStep(0);
  },

  jumpToStep: (stepIndex) => {
    const { simulationResult, machine } = get();
    if (!simulationResult || !simulationResult.traces[stepIndex]) return;

    const trace = simulationResult.traces[stepIndex];
    const flow = machineToFlowElements(machine, trace.activeStates, trace.activeTransitionId);

    set({
      currentStepIndex: stepIndex,
      nodes: flow.nodes,
      edges: flow.edges,
    });
  },

  runBatchTests: () => {
    const { machine, batchTestCases } = get();
    const updated = batchTestCases.map((tc) => {
      let res: SimulationResult;
      try {
        if (machine.type === 'DFA') res = simulateDFA(machine as DFAMachine, tc.input);
        else if (machine.type === 'NFA') res = simulateNFA(machine as NFAMachine, tc.input);
        else if (machine.type === 'PDA') res = simulatePDA(machine as PDAMachine, tc.input);
        else res = simulateTM(machine as TMMachine, tc.input);
      } catch (err) {
        res = {
          accepted: false,
          finalStatus: 'REJECTED' as const,
          traces: [],
          totalSteps: 0,
          message: err instanceof Error ? err.message : 'Simulation error.',
        };
      }

      const pass = res.accepted === tc.expected;
      return {
        ...tc,
        actual: res.accepted,
        status: pass ? ('PASS' as const) : ('FAIL' as const),
        totalSteps: res.totalSteps,
      };
    });

    set({ batchTestCases: updated });
  },

  addBatchTestCase: (input, expected) => {
    const { batchTestCases } = get();
    const safeInput = input.slice(0, 5000);
    set({
      batchTestCases: [
        ...batchTestCases,
        { id: `custom_tc_${Date.now()}`, input: safeInput, expected, status: 'PENDING' },
      ],
    });
  },

  deleteBatchTestCase: (id) => {
    const { batchTestCases } = get();
    set({ batchTestCases: batchTestCases.filter((tc) => tc.id !== id) });
  },

  runSubsetConstruction: () => {
    const { machine } = get();
    if (machine.type !== 'NFA') return;
    const result = convertNFAToDFA(machine as NFAMachine);
    set({ subsetResult: result, isSubsetDrawerOpen: true });
  },

  applyConvertedDFA: () => {
    const { subsetResult } = get();
    if (!subsetResult) return;
    const flow = machineToFlowElements(subsetResult.convertedDfa);
    const layouted = getLayoutedElements(flow.nodes, flow.edges, 'LR');

    set({
      machine: subsetResult.convertedDfa,
      nodes: layouted.nodes,
      edges: layouted.edges,
      isSubsetDrawerOpen: false,
      simulationResult: null,
      currentStepIndex: 0,
      activePresetId: null,
    });
  },

  setIsSubsetDrawerOpen: (isSubsetDrawerOpen) => set({ isSubsetDrawerOpen }),
  setIsExportImportOpen: (isOpen) => set({ isExportImportOpen: isOpen }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setSelectedEdgeId: (selectedEdgeId) => set({ selectedEdgeId }),

  toggleTheme: () => {
    const { theme } = get();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: newTheme });
  },
}));
