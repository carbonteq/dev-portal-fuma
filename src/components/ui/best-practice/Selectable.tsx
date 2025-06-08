'use client';

import { ReactNode } from 'react';
import { useSelection, PracticeType } from './Selection';

interface SelectableProps {
  type: PracticeType;
  children: ReactNode;
  className?: string;
}

export function Selectable({ type, children, className = '' }: SelectableProps) {
  const { selected, setSelected } = useSelection();
  const isSelected = selected === type;
  
  const baseStyles = "p-4 cursor-pointer transition-colors";
  const typeStyles = type === 'bad' 
    ? `border-r border-gray-200 ${isSelected ? 'bg-red-50 border-red-200' : 'bg-gray-50 hover:bg-red-25'}`
    : `${isSelected ? 'bg-green-50 border-green-200' : 'bg-gray-50 hover:bg-green-25'}`;
  
  return (
    <div 
      className={`${baseStyles} ${typeStyles} ${className}`}
      onClick={() => setSelected(type)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelected(type);
        }
      }}
    >
      {children}
    </div>
  );
} 