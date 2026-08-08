import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { useAutomataStore } from '../../store/useAutomataStore';
import { TransitionEdgeData } from '../../utils/graphConverter';

export const CustomTransitionEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  const { openTransitionModal, deleteTransition } = useAutomataStore();
  const edgeData = data as (TransitionEdgeData & { combinedLabel?: string; allTransitions?: unknown[] });
  const isActive = !!edgeData?.isActive;
  const labelText = edgeData?.combinedLabel || 'ε';

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isActive ? '#059669' : style?.stroke || '#64748b',
          strokeWidth: isActive ? 3 : 2,
          filter: isActive ? 'drop-shadow(0 0 6px rgba(5, 150, 105, 0.6))' : undefined,
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
              title="Click to edit transition rules"
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-200 border shadow-xs ${
                isActive
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-110'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-600 hover:text-emerald-800'
              }`}
            >
              {labelText}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTransition(id);
              }}
              title="Delete Transition"
              className="w-4 h-4 rounded-full bg-white border border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
            >
              ×
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
