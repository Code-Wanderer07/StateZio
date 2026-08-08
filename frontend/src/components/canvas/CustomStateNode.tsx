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
        <div className="absolute -left-9 top-1/2 -translate-y-1/2 flex items-center text-emerald-700 animate-pulse pointer-events-none">
          <div className="w-5 h-0.5 bg-emerald-700"></div>
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-emerald-700"></div>
        </div>
      )}

      {/* Target and Source Handles */}
      <Handle type="target" position={Position.Top} id="top" className="!w-2 !h-2 !bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Top} id="top-src" className="!w-2 !h-2 !bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Right} id="right" className="!w-2 !h-2 !bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right-src" className="!w-2 !h-2 !bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Bottom} id="bottom" className="!w-2 !h-2 !bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom-src" className="!w-2 !h-2 !bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left-src" className="!w-2 !h-2 !bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Outer State Circle Container */}
      <div
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none shadow-sm cursor-grab active:cursor-grabbing ${
          isActive
            ? 'bg-emerald-50 border-2 border-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.35)] scale-110 ring-4 ring-emerald-500/20 text-emerald-950 font-bold'
            : selected
            ? 'bg-white border-2 border-emerald-500 shadow-md text-slate-900 ring-2 ring-emerald-400/30'
            : 'bg-white border-2 border-slate-300 hover:border-emerald-600 text-slate-800 hover:shadow-md'
        }`}
      >
        {/* Accept State: Inner Concentric Circle */}
        {isAccept && (
          <div
            className={`absolute inset-1.5 rounded-full pointer-events-none transition-all duration-300 border ${
              isActive
                ? 'border-emerald-600/80 bg-emerald-500/10'
                : selected
                ? 'border-emerald-500'
                : 'border-slate-400'
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
              className="w-12 bg-white text-slate-900 text-xs font-mono text-center border border-emerald-600 rounded px-1 py-0.5 outline-none shadow-xs"
            />
          </form>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
            className={`z-10 font-mono font-semibold tracking-wide text-xs truncate max-w-[50px] ${
              isActive ? 'text-emerald-900 font-bold' : 'text-slate-800'
            }`}
          >
            {(data.label as string) || id}
          </span>
        )}
      </div>

      {/* Floating Action Menu on Node Hover / Selection */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-lg opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleInitialState(id);
          }}
          title={isInitial ? 'Remove Start State' : 'Set as Start State'}
          className={`p-1 rounded-full text-xs transition-colors ${
            isInitial ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-emerald-700'
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
            isAccept ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-emerald-700'
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
          className="p-1 rounded-full text-slate-400 hover:text-emerald-700 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteState(id);
          }}
          title="Delete State"
          className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
