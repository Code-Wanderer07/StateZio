import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const CustomStateNode = React.memo<NodeProps>(({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelValue, setLabelValue] = useState((data.label as string) || id);

  const toggleInitialState = useAutomataStore(s => s.toggleInitialState);
  const toggleAcceptState = useAutomataStore(s => s.toggleAcceptState);
  const deleteState = useAutomataStore(s => s.deleteState);
  const renameState = useAutomataStore(s => s.renameState);

  const isInitial = !!data.isInitial;
  const isAccept = !!data.isAccept;
  const isReject = !!data.isReject;
  const isActive = !!data.isActive;

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (labelValue.trim()) {
      renameState(id, labelValue.trim());
    }
    setIsEditing(false);
  };

  // Node Border & Background resolution according to #1C1313 and Light Blue Spec
  const getNodeStyling = () => {
    if (isActive) {
      if (isReject) return 'bg-rose-500 border-2 border-outline-variant/30 node-active-pulse ring-4 ring-rose-400/60 text-white scale-105';
      return 'bg-cyan-400 border-2 border-outline-variant/30 node-active-pulse ring-4 ring-cyan-300/60 text-on-surface dark:text-[#1C1313] scale-105';
    }
    if (selected) {
      if (isReject) return 'bg-surface-container dark:bg-background border-2 border-rose-500 text-on-surface ring-2 ring-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
      if (isAccept) return 'bg-surface-container dark:bg-background border-2 border-blue-400 text-on-surface dark:text-on-surface ring-2 ring-blue-400/60 shadow-lg';
      if (isInitial) return 'bg-surface-container dark:bg-background border-2 border-emerald-400 text-on-surface dark:text-on-surface ring-2 ring-emerald-400/60 shadow-lg';
      return 'bg-surface-container dark:bg-background border-2 border-cyan-400 text-on-surface dark:text-on-surface ring-2 ring-cyan-400/50 shadow-lg';
    }
    if (isReject) {
      return 'bg-surface-container dark:bg-background border-2 border-rose-500/80 text-on-surface hover:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
    }
    if (isAccept) {
      return 'bg-surface-container dark:bg-background border-2 border-blue-400 text-on-surface dark:text-on-surface hover:border-blue-300 shadow-md';
    }
    if (isInitial) {
      return 'bg-surface-container dark:bg-background border-2 border-emerald-400 text-on-surface dark:text-on-surface hover:border-emerald-300 shadow-md';
    }
    return 'bg-surface-container dark:bg-background border-2 border-cyan-400/80 text-on-surface dark:text-on-surface hover:border-cyan-300 shadow-md';
  };

  return (
    <div className="relative group">
      {/* Start State (Entry) Indicator Arrow */}
      {isInitial && (
        <div className="absolute -left-9 top-1/2 -translate-y-1/2 flex items-center text-emerald-400 pointer-events-none animate-pulse">
          <div className="w-5 h-0.5 bg-emerald-400"></div>
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-emerald-400"></div>
        </div>
      )}

      {/* Target and Source Handles */}
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Top} id="top-src" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Right} id="right" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right-src" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left-src" className="!w-2 !h-2 !bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Outer State Circle Container */}
      <div
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none cursor-grab active:cursor-grabbing ${getNodeStyling()}`}
      >
        {/* Accept State: Inner Concentric Circle (Double Circle) */}
        {isAccept && (
          <div
            className={`absolute inset-1.5 rounded-full pointer-events-none transition-all duration-300 border-2 ${
              isActive
                ? 'border-[#1C1313]/70'
                : 'border-blue-400'
            }`}
          />
        )}

        {/* State Label */}
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="z-10 px-1">
            <input
              type="text"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={handleRenameSubmit}
              autoFocus
              className="w-12 bg-surface-container dark:bg-background text-on-surface dark:text-on-surface text-xs font-mono text-center border border-cyan-400 rounded px-1 py-0.5 outline-none shadow-xs"
            />
          </form>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
            className={`z-10 font-mono font-bold tracking-wide text-xs truncate max-w-[50px] ${
              isActive ? 'text-on-surface dark:text-[#1C1313] font-extrabold' : 'text-on-surface dark:text-on-surface'
            }`}
          >
            {(data.label as string) || id}
          </span>
        )}
      </div>

      {/* Floating Action Menu on Node Hover / Selection */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface-container dark:bg-background border border-cyan-300 dark:border-cyan-500/30 rounded-full px-2 py-0.5 shadow-2xl opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleInitialState(id);
          }}
          title={isInitial ? 'Remove Start State' : 'Set as Start State (Emerald)'}
          className={`p-1 rounded-full text-xs transition-colors ${
            isInitial ? 'text-emerald-400 hover:text-emerald-300' : 'text-on-surface-variant dark:text-on-surface-variant hover:text-emerald-400'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleAcceptState(id);
          }}
          title={isAccept ? 'Remove Accept State' : 'Set as Accept State (Indigo Double Circle)'}
          className={`p-1 rounded-full text-xs transition-colors ${
            isAccept ? 'text-blue-400 hover:text-blue-300' : 'text-on-surface-variant dark:text-on-surface-variant hover:text-blue-400'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Rename State"
          className="p-1 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:text-cyan-600 dark:text-cyan-400 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteState(id);
          }}
          title="Delete State"
          className="p-1 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
});
