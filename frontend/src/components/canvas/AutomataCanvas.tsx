import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  MarkerType,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAutomataStore } from '../../store/useAutomataStore';
import { CustomStateNode } from './CustomStateNode';
import { CustomTransitionEdge } from './CustomTransitionEdge';
import { SelfLoopEdge } from './SelfLoopEdge';
import { CanvasControls } from './CanvasControls';
import { TransitionModal } from './TransitionModal';
import { validateMachine } from '../../utils/machineValidator';
import { MachineWarnings } from './MachineWarnings';

export const AutomataCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setSelectedEdgeId,
    theme,
    machine,
  } = useAutomataStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      setSelectedNodeId: state.setSelectedNodeId,
      setSelectedEdgeId: state.setSelectedEdgeId,
      theme: state.theme,
      machine: state.machine,
    }))
  );

  const warnings = useMemo(() => validateMachine(machine), [machine]);

  const nodeTypes = useMemo(() => ({
    customState: CustomStateNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    customTransitionEdge: CustomTransitionEdge,
    selfLoopEdge: SelfLoopEdge,
  }), []);

  const defaultEdgeOptions = useMemo(() => ({
    type: 'customTransitionEdge',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#38BDF8', // Light Blue for idle transitions
      width: 24,
      height: 24,
    },
  }), []);

  return (
    <div className="relative w-full h-full bg-surface-container dark:bg-background overflow-hidden select-none">
      {/* Top Floating Action Bar */}
      <CanvasControls />

      {/* Warnings Panel */}
      <MachineWarnings warnings={warnings} />

      {/* Main React Flow Graph Viewport */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2.5}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
        }}
        onEdgeClick={(_, edge) => {
          setSelectedEdgeId(edge.id);
        }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color={theme === 'light' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(56, 189, 248, 0.25)'}
        />

        <Controls
          position="bottom-left"
          className="!m-4 !bg-surface-container !border-outline-variant/30 !shadow-2xl !rounded-xl overflow-hidden"
          showInteractive={false}
        />

        <MiniMap
          position="top-right"
          className="hidden md:block !m-4 !bg-cyan-50 dark:!bg-slate-950 !border-cyan-300 dark:!border-cyan-500/30 !rounded-2xl !shadow-2xl"
          nodeColor={(node) => {
            if (node.data?.isActive) return '#38BDF8'; // Light Blue / Cyan
            if (node.data?.isAccept) return '#818CF8'; // Indigo
            if (node.data?.isInitial) return '#34D399'; // Emerald Green
            return '#64748B'; // Muted Slate
          }}
          maskColor={theme === 'dark' ? 'rgba(28, 19, 19, 0.8)' : 'rgba(248, 250, 252, 0.8)'}
        />
      </ReactFlow>

      {/* Transition Configuration Modal */}
      <TransitionModal />
    </div>
  );
};
