'use client';

import { useSelection, PracticeType } from './Selection';

interface HeaderProps {
  type: PracticeType;
}

export function Header({ type }: HeaderProps) {
  const { selected } = useSelection();
  const isSelected = selected === type;
  
  const config = type === 'good' 
    ? { icon: '✓', label: 'Good Practice', colors: 'text-green-600', badgeColors: 'bg-green-200 text-green-700' }
    : { icon: '✗', label: 'Bad Practice', colors: 'text-red-600', badgeColors: 'bg-red-200 text-red-700' };
  
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`${config.colors} text-lg`}>{config.icon}</span>
      <span className={`font-semibold ${type === 'good' ? 'text-green-800' : 'text-red-800'}`}>
        {config.label}
      </span>
      {isSelected && (
        <span className={`px-2 py-1 ${config.badgeColors} text-xs rounded-full`}>
          Selected
        </span>
      )}
    </div>
  );
} 