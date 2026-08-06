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

  // Modals & UI
  isExportImportOpen: boolean;
  isTransitionModalOpen: boolean;
  transitionModalSourceId: string | null;
  transitionModalTargetId: string | null;
  editingTransitionId: string | null;

  // Actions
  setMachine: (machine: AutomataMachine) => void;
  setMachineType: (type: MachineType) => void;
  loadPreset: (preset: PresetAutomata) => void;
  loadSolvedMachine: (machine: AutomataMachine, testCases?: { input: string; expected: boolean }[]) => void;
  setInputString: (input: string) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsPlaying: (playing: boolean) => void;

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
    const batchCases: BatchTestCase[] = testCases.map((tc, idx) => ({
      id: `sol_tc_${idx}`,
      input: tc.input,
      expected: tc.expected,
      status: 'PENDING',
    }));

    set({
      machine,
      nodes: layouted.nodes,
      edges: layouted.edges,
      activePresetId: null,
      inputString: testCases[0]?.input ?? (machine.type === 'PDA' ? 'aabb' : '01'),
      batchTestCases: batchCases,
      simulationResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      subsetResult: null,
    });
  },

  setInputString: (inputString) => {
    set({ inputString, simulationResult: null, currentStepIndex: 0, isPlaying: false });
  },

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    const updatedMachine = flowElementsToMachine(nextNodes, get().edges, get().machine);
    set({ nodes: nextNodes, machine: updatedMachine });
  },

  onEdgesChange: (changes) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    const updatedMachine = flowElementsToMachine(get().nodes, nextEdges, get().machine);
    set({ edges: nextEdges, machine: updatedMachine });
  },

  onConnect: (connection) => {
    if (connection.source && connection.target) {
      get().openTransitionModal(connection.source, connection.target);
    }
  },

  addState: () => {
    const { machine, nodes, edges } = get();
    const count = nodes.length;
    const newId = `q${count}`;
    const newNode: Node = {
      id: newId,
      type: 'customState',
      position: { x: 120 + (count % 5) * 160, y: 150 + Math.floor(count / 5) * 140 },
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
    const { machine, nodes, edges } = get();
    const nextNodes = nodes.filter((n) => n.id !== id);
    const nextEdges = edges.filter((e) => e.source !== id && e.target !== id);
    const updatedMachine = flowElementsToMachine(nextNodes, nextEdges, machine);
    set({ nodes: nextNodes, edges: nextEdges, machine: updatedMachine, selectedNodeId: null });
  },

  toggleInitialState: (id) => {
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
    const {
      machine,
      nodes,
      edges,
      transitionModalSourceId,
      transitionModalTargetId,
      editingTransitionId,
    } = get();

    if (!transitionModalSourceId || !transitionModalTargetId) return;

    const mType = machine.type;
    const transitionId = editingTransitionId || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let updatedMachine = { ...machine };

    if (mType === 'DFA') {
      const dfa = updatedMachine as DFAMachine;
      const filtered = editingTransitionId ? dfa.transitions.filter((t) => t.id !== editingTransitionId) : dfa.transitions;
      const newT: DFATransition = {
        id: transitionId,
        from: transitionModalSourceId,
        to: transitionModalTargetId,
        symbol: data.symbol || '0',
      };
      updatedMachine = { ...dfa, transitions: [...filtered, newT] };
    } else if (mType === 'NFA') {
      const nfa = updatedMachine as NFAMachine;
      const filtered = editingTransitionId ? nfa.transitions.filter((t) => t.id !== editingTransitionId) : nfa.transitions;
      const newT: NFATransition = {
        id: transitionId,
        from: transitionModalSourceId,
        to: transitionModalTargetId,
        symbol: data.symbol || 'ε',
      };
      updatedMachine = { ...nfa, transitions: [...filtered, newT] };
    } else if (mType === 'PDA') {
      const pda = updatedMachine as PDAMachine;
      const filtered = editingTransitionId ? pda.transitions.filter((t) => t.id !== editingTransitionId) : pda.transitions;
      const newT: PDATransition = {
        id: transitionId,
        from: transitionModalSourceId,
        to: transitionModalTargetId,
        inputSymbol: data.inputSymbol || 'ε',
        popSymbol: data.popSymbol || 'Z0',
        pushSymbols: data.pushSymbols || 'Z0',
      };
      updatedMachine = { ...pda, transitions: [...filtered, newT] };
    } else {
      const tm = updatedMachine as TMMachine;
      const filtered = editingTransitionId ? tm.transitions.filter((t) => t.id !== editingTransitionId) : tm.transitions;
      const newT: TMTransition = {
        id: transitionId,
        from: transitionModalSourceId,
        to: transitionModalTargetId,
        readSymbol: data.readSymbol || '_',
        writeSymbol: data.writeSymbol || '_',
        direction: data.direction || 'R',
      };
      updatedMachine = { ...tm, transitions: [...filtered, newT] };
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
    const { machine } = get();
    let updatedMachine = { ...machine };

    if (machine.type === 'DFA') {
      const dfa = machine as DFAMachine;
      updatedMachine = { ...dfa, transitions: dfa.transitions.filter((t) => t.id !== id) };
    } else if (machine.type === 'NFA') {
      const nfa = machine as NFAMachine;
      updatedMachine = { ...nfa, transitions: nfa.transitions.filter((t) => t.id !== id) };
    } else if (machine.type === 'PDA') {
      const pda = machine as PDAMachine;
      updatedMachine = { ...pda, transitions: pda.transitions.filter((t) => t.id !== id) };
    } else {
      const tm = machine as TMMachine;
      updatedMachine = { ...tm, transitions: tm.transitions.filter((t) => t.id !== id) };
    }

    const flow = machineToFlowElements(updatedMachine);
    set({ machine: updatedMachine, nodes: flow.nodes, edges: flow.edges, selectedEdgeId: null });
  },

  autoLayout: () => {
    const { nodes, edges } = get();
    const layouted = getLayoutedElements(nodes, edges, 'LR');
    set({ nodes: layouted.nodes, edges: layouted.edges });
  },

  clearCanvas: () => {
    const { machine } = get();
    const clearedMachine: AutomataMachine = {
      ...machine,
      states: [],
      startState: '',
      acceptStates: [],
      transitions: [] as never,
    };
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

    if (machine.type === 'DFA') {
      result = simulateDFA(machine as DFAMachine, input);
    } else if (machine.type === 'NFA') {
      result = simulateNFA(machine as NFAMachine, input);
    } else if (machine.type === 'PDA') {
      result = simulatePDA(machine as PDAMachine, input);
    } else {
      result = simulateTM(machine as TMMachine, input);
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
      if (machine.type === 'DFA') res = simulateDFA(machine as DFAMachine, tc.input);
      else if (machine.type === 'NFA') res = simulateNFA(machine as NFAMachine, tc.input);
      else if (machine.type === 'PDA') res = simulatePDA(machine as PDAMachine, tc.input);
      else res = simulateTM(machine as TMMachine, tc.input);

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
    set({
      batchTestCases: [
        ...batchTestCases,
        { id: `custom_tc_${Date.now()}`, input, expected, status: 'PENDING' },
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
  setIsExportImportOpen: (isExportImportOpen) => set({ isExportImportOpen }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setSelectedEdgeId: (selectedEdgeId) => set({ selectedEdgeId }),
}));
