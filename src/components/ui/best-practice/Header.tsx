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
      <span className="font-semibold text-lg">
        {label}
      </span>
    </div>
  );
} 