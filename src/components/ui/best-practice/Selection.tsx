'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Custom Selection Context for Best Practice
export type PracticeType = 'good' | 'bad';

interface SelectionContextType {
  selected: PracticeType;
  setSelected: (type: PracticeType) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

// Custom Selection Provider
interface SelectionProviderProps {
  children: ReactNode;
  defaultSelected?: PracticeType;
}

export function SelectionProvider({ children, defaultSelected = 'bad' }: SelectionProviderProps) {
  const [selected, setSelected] = useState<PracticeType>(defaultSelected);
  
  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
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