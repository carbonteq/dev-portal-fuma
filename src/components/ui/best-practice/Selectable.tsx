'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useSelection, PracticeType } from './Selection';

interface SelectableProps {
  type: PracticeType;
  children: ReactNode;
  className?: string;
}

export function Selectable({ type, children, className = '' }: SelectableProps) {
  const { selected, setSelected, layoutId } = useSelection();
  const isSelected = selected === type;
  
  const baseStyles = "relative p-6 cursor-pointer transition-colors dark";
  const typeStyles = type === 'dont' 
    ? `border-r border-gray-200`
    : ``;
  
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
      {isSelected && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-black"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.5,
          }}
        />
      )}
      <div className={`relative z-10 ${!isSelected ? 'best-practice-unselected' : ''}`}>
        {children}
      </div>
    </div>
  );
} 