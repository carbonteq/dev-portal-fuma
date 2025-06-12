'use client';

import { useSelection, PracticeType } from './Selection';

interface HeaderProps {
  type: PracticeType;
}

export function Header({ type }: HeaderProps) {
  const { selected } = useSelection();
  const isSelected = selected === type;
  
  const label = type === 'do' ? 'Do' : "Don't";
  
  return (
    <div className="prose flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-lg transition-colors duration-200 ${
          isSelected ? 'text-white' : 'text-gray-700'
        }`}>
          {label}
        </span>
        {!isSelected && (
          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to view
          </span>
        )}
      </div>
      <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        isSelected 
          ? 'bg-green-400 opacity-80' 
          : 'bg-gray-400 opacity-60 animate-pulse'
      }`} />
    </div>
  );
} 