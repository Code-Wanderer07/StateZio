import React, { useMemo } from 'react';
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

export const AutomataCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setSelectedEdgeId,
  } = useAutomataStore();

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
      width: 14,
      height: 14,
    },
  }), []);

  return (
    <div className="relative w-full h-full bg-sky-50 dark:bg-[#1C1313] overflow-hidden select-none">
      {/* Top Floating Action Bar */}
      <CanvasControls />

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
          color="rgba(56, 189, 248, 0.25)"
        />

        <Controls
          position="bottom-left"
          className="!m-4 !bg-sky-50 dark:bg-[#1C1313] !border-sky-300 dark:border-sky-500/30 !shadow-2xl !rounded-xl overflow-hidden"
          showInteractive={false}
        />

        <MiniMap
          position="bottom-right"
          className="!m-4 !bg-sky-50 dark:bg-[#1C1313] !border-sky-300 dark:border-sky-500/30 !rounded-2xl !shadow-2xl"
          nodeColor={(node) => {
            if (node.data?.isActive) return '#38BDF8'; // Light Blue / Cyan
            if (node.data?.isAccept) return '#818CF8'; // Indigo
            if (node.data?.isInitial) return '#34D399'; // Emerald Green
            return '#64748B'; // Muted Slate
          }}
          maskColor="rgba(28, 19, 19, 0.8)"
        />
      </ReactFlow>

      {/* Transition Configuration Modal */}
      <TransitionModal />
    </div>
  );
};
