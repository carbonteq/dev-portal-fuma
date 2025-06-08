import React from 'react';

interface RowProps {
  children: React.ReactNode;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  marginTop?: number;
  style?: React.CSSProperties;
}

const Row: React.FC<RowProps> = ({ 
  children, 
  justifyContent = 'flex-start', 
  marginTop,
  style 
}) => {
  // Convert justifyContent to Tailwind classes
  const justifyClasses = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  };

  const marginTopClass = marginTop ? `mt-[${marginTop}px]` : '';
  
  return (
    <div 
      className={`flex ${justifyClasses[justifyContent]} ${marginTopClass}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

export default Row; 