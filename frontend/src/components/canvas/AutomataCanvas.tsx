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
      color: '#818cf8',
      width: 14,
      height: 14,
    },
  }), []);

  return (
    <div className="relative w-full h-full bg-[#090d16] overflow-hidden select-none">
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
          color="#334155"
        />

        <Controls
          position="bottom-left"
          className="!m-4 !bg-slate-900/90 !border-slate-700/80 !shadow-2xl"
          showInteractive={false}
        />

        <MiniMap
          position="bottom-right"
          className="!m-4 !bg-slate-950/80 !border-slate-800/80 !rounded-2xl"
          nodeColor={(node) => {
            if (node.data?.isActive) return '#818cf8';
            if (node.data?.isAccept) return '#10b981';
            return '#475569';
          }}
          maskColor="rgba(9, 13, 22, 0.75)"
        />
      </ReactFlow>

      {/* Transition Configuration Modal */}
      <TransitionModal />
    </div>
  );
};
