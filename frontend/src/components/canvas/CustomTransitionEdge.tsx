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
  const edgeData = data as (TransitionEdgeData & { combinedLabel?: string; allTransitions?: unknown[]; hasError?: boolean });
  const isActive = !!edgeData?.isActive;
  const hasError = !!edgeData?.hasError;
  const labelText = edgeData?.combinedLabel || 'ε';

  // Light Blue & #1C1313 Edge Styling:
  // Active: Bright Light Blue #38BDF8 (3px)
  // Error/Dead: Crimson Red #EF4444 (3px)
  // Idle: Light Blue #38BDF8 (2px)
  const edgeStroke = hasError ? '#EF4444' : isActive ? '#38BDF8' : style?.stroke || '#38BDF8';
  const edgeWidth = hasError || isActive ? 3 : 2;
  const edgeFilter = hasError
    ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))'
    : isActive
    ? 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.9))'
    : undefined;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeStroke,
          strokeWidth: edgeWidth,
          filter: edgeFilter,
          transition: 'stroke 0.25s, stroke-width 0.25s, filter 0.25s',
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
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 border shadow-md cursor-pointer ${
                hasError
                  ? 'bg-red-900/90 text-red-100 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] scale-105'
                  : isActive
                  ? 'bg-sky-500 text-white dark:text-[#1C1313] border-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.7)] scale-105'
                  : 'bg-sky-50 dark:bg-[#1C1313] text-sky-800 dark:text-sky-200 border-sky-500/40 hover:border-sky-300 hover:text-slate-900 dark:text-white'
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
              className="w-4 h-4 rounded-full bg-sky-50 dark:bg-[#1C1313] border border-sky-300 dark:border-sky-500/30 text-slate-600 dark:text-slate-400 hover:text-rose-400 hover:border-rose-500 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
