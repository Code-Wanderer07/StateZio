import React, { useState } from 'react';
import { ValidationWarning } from '../../utils/machineValidator';

interface MachineWarningsProps {
  warnings: ValidationWarning[];
}

export const MachineWarnings: React.FC<MachineWarningsProps> = ({ warnings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (warnings.length === 0) return null;

  const errors = warnings.filter(w => w.severity === 'error');
  const hasErrors = errors.length > 0;

  return (
    <div className="absolute bottom-[140px] right-6 z-[60] flex flex-col items-end pointer-events-none">
      {isExpanded && (
        <div className="bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant/30 shadow-lg rounded-xl p-4 mb-3 w-80 max-h-64 overflow-y-auto pointer-events-auto origin-bottom-right animate-in fade-in zoom-in-95 duration-200 hide-scrollbar">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className={`material-symbols-outlined text-lg ${hasErrors ? 'text-error' : 'text-warning'}`}>
                {hasErrors ? 'error' : 'warning'}
              </span>
              Machine Rules Checklist
            </h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          
          <ul className="space-y-2">
            {warnings.map(w => (
              <li key={w.id} className="flex gap-2 items-start text-xs">
                <span className={`material-symbols-outlined text-[14px] mt-0.5 ${w.severity === 'error' ? 'text-error' : 'text-warning'}`}>
                  {w.severity === 'error' ? 'cancel' : 'info'}
                </span>
                <span className="text-on-surface-variant leading-relaxed">
                  {w.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 ${
          hasErrors 
            ? 'bg-error/20 text-error border border-error/50 hover:bg-error/30' 
            : 'bg-warning/20 text-warning border border-warning/50 hover:bg-warning/30'
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {hasErrors ? 'error' : 'warning'}
        </span>
        {warnings.length} {warnings.length === 1 ? 'Issue' : 'Issues'}
      </button>
    </div>
  );
};
