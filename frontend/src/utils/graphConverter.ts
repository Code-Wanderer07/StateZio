import { Node, Edge, MarkerType } from '@xyflow/react';
import {
  AutomataMachine,
  AutomataState,
  DFAMachine,
  DFATransition,
  MachineType,
  NFAMachine,
  NFATransition,
  PDAMachine,
  PDATransition,
  TMMachine,
  TMTransition,
} from '../types/automata';

export interface StateNodeData {
  label: string;
  isInitial: boolean;
  isAccept: boolean;
  isReject?: boolean;
  isActive: boolean;
  traceStatus?: string;
  hasError?: boolean;
  onToggleInitial?: (id: string) => void;
  onToggleAccept?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newLabel: string) => void;
  [key: string]: unknown;
}

export interface TransitionEdgeData {
  machineType: MachineType;
  // DFA / NFA
  symbol?: string;
  // PDA
  inputSymbol?: string;
  popSymbol?: string;
  pushSymbols?: string;
  // TM
  readSymbol?: string;
  writeSymbol?: string;
  direction?: 'L' | 'R' | 'S';
  isActive?: boolean;
  hasError?: boolean;
  onEdit?: (edgeId: string) => void;
  onDelete?: (edgeId: string) => void;
  [key: string]: unknown;
}

export function formatTransitionLabel(data: TransitionEdgeData): string {
  if (data.machineType === 'DFA' || data.machineType === 'NFA') {
    return data.symbol || 'ε';
  }
  if (data.machineType === 'PDA') {
    const input = data.inputSymbol || 'ε';
    const pop = data.popSymbol || 'ε';
    const push = data.pushSymbols || 'ε';
    return `${input}, ${pop} → ${push}`;
  }
  if (data.machineType === 'TM') {
    const read = data.readSymbol || '_';
    const write = data.writeSymbol || '_';
    const dir = data.direction || 'R';
    return `${read} → ${write}, ${dir}`;
  }
  return '';
}

/**
 * Converts an AutomataMachine model to ReactFlow Nodes and Edges
 * styled according to the StateZio Specification
 */
export function machineToFlowElements(
  machine: AutomataMachine,
  activeStateIds: string[] = [],
  activeEdgeId?: string,
  errorEdgeId?: string,
  traceStatus?: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = machine.states.map((st, index) => {
    return {
      id: st.id,
      type: 'customState',
      position: {
        x: st.x !== undefined ? st.x : 100 + (index % 4) * 200,
        y: st.y !== undefined ? st.y : 150 + Math.floor(index / 4) * 160,
      },
      data: {
        label: st.label || st.id,
        isInitial: st.isInitial || machine.startState === st.id,
        isAccept: st.isAccept || (machine.acceptStates || []).includes(st.id),
        isReject: machine.type === 'TM' ? ((machine as TMMachine).rejectStates || []).includes(st.id) : false,
        isActive: activeStateIds.includes(st.id),
        traceStatus: activeStateIds.includes(st.id) ? traceStatus : undefined,
      },
    };
  });

  const edges: Edge[] = [];

  // Group transitions by (from, to) to consolidate multiple parallel transitions or self-loops cleanly
  const edgeGroups = new Map<string, Array<DFATransition | NFATransition | PDATransition | TMTransition>>();

  (machine.transitions as Array<DFATransition | NFATransition | PDATransition | TMTransition>).forEach((t) => {
    const key = `${t.from}->${t.to}`;
    if (!edgeGroups.has(key)) {
      edgeGroups.set(key, []);
    }
    edgeGroups.get(key)!.push(t);
  });

  let edgeIdx = 0;
  edgeGroups.forEach((transitions, key) => {
    const [from, to] = key.split('->');
    const isSelfLoop = from === to;
    const isEdgeActive = transitions.some((t) => t.id === activeEdgeId);
    const isEdgeError = transitions.some((t) => t.id === errorEdgeId);

    // Form combined label
    const labels = transitions.map((t) => {
      if (machine.type === 'DFA' || machine.type === 'NFA') {
        return (t as DFATransition | NFATransition).symbol || 'ε';
      } else if (machine.type === 'PDA') {
        const pt = t as PDATransition;
        return `${pt.inputSymbol || 'ε'}, ${pt.popSymbol || 'ε'} → ${pt.pushSymbols || 'ε'}`;
      } else {
        const tt = t as TMTransition;
        return `${tt.readSymbol || '_'} → ${tt.writeSymbol || '_'}, ${tt.direction || 'R'}`;
      }
    });

    const firstT = transitions[0];
    const dataPayload: TransitionEdgeData = {
      machineType: machine.type,
      isActive: isEdgeActive,
      hasError: isEdgeError,
      symbol: (firstT as DFATransition).symbol,
      inputSymbol: (firstT as PDATransition).inputSymbol,
      popSymbol: (firstT as PDATransition).popSymbol,
      pushSymbols: (firstT as PDATransition).pushSymbols,
      readSymbol: (firstT as TMTransition).readSymbol,
      writeSymbol: (firstT as TMTransition).writeSymbol,
      direction: (firstT as TMTransition).direction,
    };

    const edgeColor = isEdgeError ? '#EF4444' : isEdgeActive ? '#38BDF8' : '#38BDF8';

    edges.push({
      id: firstT.id || `edge_${from}_${to}_${edgeIdx++}`,
      source: from,
      target: to,
      type: isSelfLoop ? 'selfLoopEdge' : 'customTransitionEdge',
      animated: isEdgeActive,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeColor,
        width: 24,
        height: 24,
      },
      data: {
        ...dataPayload,
        combinedLabel: labels.join(' | '),
        allTransitions: transitions,
      },
      style: {
        stroke: edgeColor,
        strokeWidth: isEdgeActive || isEdgeError ? 3 : 2,
      },
    });
  });

  return { nodes, edges };
}

/**
 * Converts ReactFlow Nodes and Edges back into an AutomataMachine model
 */
export function flowElementsToMachine(
  nodes: Node[],
  edges: Edge[],
  currentMachine: AutomataMachine
): AutomataMachine {
  const states: AutomataState[] = nodes.map((node) => {
    const d = node.data as StateNodeData;
    return {
      id: node.id,
      label: d?.label || node.id,
      isInitial: !!d?.isInitial,
      isAccept: !!d?.isAccept,
      x: node.position.x,
      y: node.position.y,
    };
  });

  const startState = states.find((s) => s.isInitial)?.id || (states[0]?.id ?? '');
  const acceptStates = states.filter((s) => s.isAccept).map((s) => s.id);

  if (currentMachine.type === 'DFA') {
    const transitions: DFATransition[] = [];
    edges.forEach((e) => {
      const d = e.data as (TransitionEdgeData & { allTransitions?: DFATransition[] });
      if (d?.allTransitions && d.allTransitions.length > 0) {
        transitions.push(...d.allTransitions);
      } else {
        transitions.push({
          id: e.id,
          from: e.source,
          to: e.target,
          symbol: d?.symbol || '0',
        });
      }
    });
    return {
      ...currentMachine,
      states,
      startState,
      acceptStates,
      transitions,
    };
  }

  if (currentMachine.type === 'NFA') {
    const transitions: NFATransition[] = [];
    edges.forEach((e) => {
      const d = e.data as (TransitionEdgeData & { allTransitions?: NFATransition[] });
      if (d?.allTransitions && d.allTransitions.length > 0) {
        transitions.push(...d.allTransitions);
      } else {
        transitions.push({
          id: e.id,
          from: e.source,
          to: e.target,
          symbol: d?.symbol || 'ε',
        });
      }
    });
    return {
      ...currentMachine,
      states,
      startState,
      acceptStates,
      transitions,
    };
  }

  if (currentMachine.type === 'PDA') {
    const transitions: PDATransition[] = [];
    edges.forEach((e) => {
      const d = e.data as (TransitionEdgeData & { allTransitions?: PDATransition[] });
      if (d?.allTransitions && d.allTransitions.length > 0) {
        transitions.push(...d.allTransitions);
      } else {
        transitions.push({
          id: e.id,
          from: e.source,
          to: e.target,
          inputSymbol: d?.inputSymbol || 'ε',
          popSymbol: d?.popSymbol || 'Z0',
          pushSymbols: d?.pushSymbols || 'Z0',
        });
      }
    });
    return {
      ...currentMachine,
      states,
      startState,
      acceptStates,
      transitions,
    };
  }

  // TM
  const transitions: TMTransition[] = [];
  edges.forEach((e) => {
    const d = e.data as (TransitionEdgeData & { allTransitions?: TMTransition[] });
    if (d?.allTransitions && d.allTransitions.length > 0) {
      transitions.push(...d.allTransitions);
    } else {
      transitions.push({
        id: e.id,
        from: e.source,
        to: e.target,
        readSymbol: d?.readSymbol || '_',
        writeSymbol: d?.writeSymbol || '_',
        direction: d?.direction || 'R',
      });
    }
  });
  return {
    ...currentMachine,
    states,
    startState,
    acceptStates,
    rejectStates: (currentMachine as TMMachine).rejectStates || [],
    transitions,
  };
}
