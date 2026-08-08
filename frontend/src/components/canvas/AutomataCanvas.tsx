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
      color: '#047857',
      width: 14,
      height: 14,
    },
  }), []);

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden select-none">
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
          color="#cbd5e1"
        />

        <Controls
          position="bottom-left"
          className="!m-4 !bg-white !border-slate-200 !shadow-lg"
          showInteractive={false}
        />

        <MiniMap
          position="bottom-right"
          className="!m-4 !bg-white !border-slate-200 !rounded-2xl !shadow-md"
          nodeColor={(node) => {
            if (node.data?.isActive) return '#059669';
            if (node.data?.isAccept) return '#10b981';
            return '#94a3b8';
          }}
          maskColor="rgba(241, 245, 249, 0.7)"
        />
      </ReactFlow>

      {/* Transition Configuration Modal */}
      <TransitionModal />
    </div>
  );
};
