import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, CheckCircle2, Trash2, Edit3 } from 'lucide-react';
import { useAutomataStore } from '../../store/useAutomataStore';

export const CustomStateNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelValue, setLabelValue] = useState((data.label as string) || id);

  const {
    toggleInitialState,
    toggleAcceptState,
    deleteState,
    renameState,
  } = useAutomataStore();

  const isInitial = !!data.isInitial;
  const isAccept = !!data.isAccept;
  const isActive = !!data.isActive;

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (labelValue.trim()) {
      renameState(id, labelValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {/* Initial State Arrow indicator */}
      {isInitial && (
        <div className="absolute -left-9 top-1/2 -translate-y-1/2 flex items-center text-indigo-400 animate-pulse pointer-events-none">
          <div className="w-5 h-0.5 bg-indigo-400"></div>
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-indigo-400"></div>
        </div>
      )}

      {/* Target and Source Handles (all 4 cardinal directions for smooth routing) */}
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Top} id="top-src" className="!w-2 !h-2 !bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Right} id="right" className="!w-2 !h-2 !bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right-src" className="!w-2 !h-2 !bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="!w-2 !h-2 !bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left-src" className="!w-2 !h-2 !bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Outer State Circle Container */}
      <div
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none shadow-lg backdrop-blur-md cursor-grab active:cursor-grabbing ${
          isActive
            ? 'bg-indigo-950/90 border-2 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.7)] scale-110 ring-4 ring-indigo-500/30 text-indigo-200'
            : selected
            ? 'bg-slate-800/90 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-slate-100'
            : 'bg-slate-900/85 border-2 border-slate-700 hover:border-slate-500 text-slate-200 hover:shadow-md'
        }`}
      >
        {/* Accept State: Inner Concentric Circle */}
        {isAccept && (
          <div
            className={`absolute inset-1.5 rounded-full pointer-events-none transition-all duration-300 border ${
              isActive
                ? 'border-indigo-400/80 bg-indigo-500/10'
                : selected
                ? 'border-cyan-400/80'
                : 'border-slate-500/80'
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
              className="w-12 bg-slate-950 text-white text-xs font-mono text-center border border-indigo-500 rounded px-1 py-0.5 outline-none"
            />
          </form>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
            className={`z-10 font-mono font-semibold tracking-wide text-xs truncate max-w-[50px] ${
              isActive ? 'text-indigo-200 font-bold' : 'text-slate-200'
            }`}
          >
            {(data.label as string) || id}
          </span>
        )}
      </div>

      {/* Floating Action Menu on Node Hover / Selection */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/95 border border-slate-700/80 rounded-full px-2 py-0.5 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleInitialState(id);
          }}
          title={isInitial ? 'Remove Start State' : 'Set as Start State'}
          className={`p-1 rounded-full text-xs transition-colors ${
            isInitial ? 'text-amber-400 hover:text-amber-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleAcceptState(id);
          }}
          title={isAccept ? 'Remove Accept State' : 'Set as Accept State (Double Circle)'}
          className={`p-1 rounded-full text-xs transition-colors ${
            isAccept ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-white'
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
          className="p-1 rounded-full text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteState(id);
          }}
          title="Delete State"
          className="p-1 rounded-full text-slate-400 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
