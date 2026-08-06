import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
} from '@xyflow/react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { TransitionEdgeData } from '../../utils/graphConverter';

export const SelfLoopEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  data,
  markerEnd,
  style,
}) => {
  const { openTransitionModal, deleteTransition } = useAutomataStore();
  const edgeData = data as (TransitionEdgeData & { combinedLabel?: string });
  const isActive = !!edgeData?.isActive;
  const labelText = edgeData?.combinedLabel || 'ε';

  // Construct an upward looping arc SVG path for self loop
  const radiusX = 30;
  const radiusY = 38;
  const startX = sourceX - 12;
  const startY = sourceY - 20;
  const endX = sourceX + 12;
  const endY = sourceY - 20;

  const edgePath = `M ${startX} ${startY} C ${startX - radiusX} ${startY - radiusY}, ${endX + radiusX} ${endY - radiusY}, ${endX} ${endY}`;
  const labelX = sourceX;
  const labelY = sourceY - 50;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isActive ? '#818cf8' : style?.stroke || '#64748b',
          strokeWidth: isActive ? 3 : 2,
          filter: isActive ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))' : undefined,
          transition: 'stroke 0.3s, stroke-width 0.3s, filter 0.3s',
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openTransitionModal(source, target, id);
              }}
              title="Click to edit self-loop rules"
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-200 border shadow-md ${
                isActive
                  ? 'bg-indigo-950 text-indigo-200 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-110'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-indigo-400 hover:text-white'
              }`}
            >
              {labelText}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTransition(id);
              }}
              title="Delete Self-Loop"
              className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-400 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
