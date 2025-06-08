'use client';

import { ReactNode } from 'react';
import { useSelection } from './Selection';

interface CodeDisplayProps {
  goodCodeRendered?: ReactNode;
  badCodeRendered?: ReactNode;
}

export function CodeDisplay({ goodCodeRendered, badCodeRendered }: CodeDisplayProps) {
  const { selected } = useSelection();
  const codeToShow = selected === 'good' ? goodCodeRendered : badCodeRendered;
  
  return (
    <div className="p-4">
      <div className={`mb-3 flex items-center gap-2 ${
        selected === 'good' ? 'text-green-700' : 'text-red-700'
      }`}>
        <span className="text-lg">
          {selected === 'good' ? '✓' : '✗'}
        </span>
        <span className="font-medium">
          {selected === 'good' ? 'Good' : 'Bad'} Example
        </span>
      </div>
      
      {codeToShow ? (
        <div className="code-block">
          {codeToShow}
        </div>
      ) : (
        <div className="text-gray-500 text-sm italic">
          No code example provided for this practice.
        </div>
      )}
    </div>
  );
} 