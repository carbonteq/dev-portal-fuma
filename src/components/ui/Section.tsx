import React from 'react';

interface SectionProps {
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ children }) => {
  return (
    <div className="w-full p-4 rounded-2xl">
      {children}
    </div>
  );
};

export default Section; 