'use client';

import { ReactNode } from 'react';
import { useSelection } from './Selection';

interface CodeDisplayProps {
  doCodeRendered?: ReactNode;
  dontCodeRendered?: ReactNode;
  className?: string;
}

export function CodeDisplay({ doCodeRendered, dontCodeRendered, className }: CodeDisplayProps) {
  const { selected } = useSelection();
  const codeToShow = selected === 'do' ? doCodeRendered : dontCodeRendered;
  
  return (
    <div className={`p-1 ${className || ''}`}>
           
      {codeToShow ? (
        <div>
          {codeToShow}
        </div>
      ) : (
        <div className="text-gray-400 text-sm italic">
          No code example provided for this practice.
        </div>
      )}
    </div>
  );
} 