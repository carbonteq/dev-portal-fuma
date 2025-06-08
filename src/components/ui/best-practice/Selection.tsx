'use client';

import { createContext, useContext, useState, ReactNode, useId } from 'react';

// Custom Selection Context for Best Practice
export type PracticeType = 'do' | 'dont';

interface SelectionContextType {
  selected: PracticeType;
  setSelected: (type: PracticeType) => void;
  layoutId: string;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// Custom Selection Provider
interface SelectionProviderProps {
  children: ReactNode;
  defaultSelected?: PracticeType;
}

export function SelectionProvider({ children, defaultSelected = 'dont' }: SelectionProviderProps) {
  const [selected, setSelected] = useState<PracticeType>(defaultSelected);
  const layoutId = useId();
  
  return (
    <SelectionContext.Provider value={{ 
      selected, 
      setSelected, 
      layoutId: `activeBackground-${layoutId}`
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

// Custom hook to use selection
export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
} 