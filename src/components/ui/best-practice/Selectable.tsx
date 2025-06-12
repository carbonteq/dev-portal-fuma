'use client';

import { ReactNode, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSelection, PracticeType } from './Selection';
import { cn } from '@/lib/utils';

interface SelectableProps {
  type: PracticeType;
  children: ReactNode;
  className?: string;
}

export function Selectable({ type, children, className = '' }: SelectableProps) {
  const { selected, setSelected, layoutId } = useSelection();
  const isSelected = selected === type;
  const isDont = type === 'dont';
  
  // Base styles that work for both types
  const containerStyles = cn(
    "relative p-6 cursor-pointer dark mt-1 bg-[#e8ecf1]",
    isDont && "border-r border-gray-200",
    className
  );

  // Motion background with proper positioning and styling
  const motionBackgroundStyles = cn(
    "absolute inset-0 bg-[#151515]",
    isDont ? "rounded-tl-lg" : "rounded-tr-lg"
  );

  // Content wrapper styles
  const contentStyles = cn(
    "relative z-10 ",
    !isSelected && "best-practice-unselected"
  );

  // Animation configuration
  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
    duration: 0.5,
  };

  // Event handlers
  const handleClick = useCallback(() => {
    setSelected(type);
  }, [setSelected, type]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected(type);
    }
  }, [setSelected, type]);

  return (
    <div 
      className={containerStyles}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-label={`${isDont ? "Don't" : 'Do'} practice example`}
    >
      {isSelected && (
        <motion.div
          layoutId={layoutId}
          className={motionBackgroundStyles}
          initial={false}
          transition={springTransition}
          style={{
            zIndex: 1,
          }}
        />
      )}
      <div className={contentStyles}>
        {children}
      </div>
    </div>
  );
} 