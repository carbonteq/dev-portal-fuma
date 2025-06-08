import React from 'react';

interface ColProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Col: React.FC<ColProps> = ({ children, style }) => {
  return (
    <div className="flex-1" style={style}>
      {children}
    </div>
  );
};

export default Col; 