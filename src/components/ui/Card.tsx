import React from 'react';
import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  link?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, link, style }) => {
  const cardClasses = "border border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-md";

  if (link) {
    return (
      <Link 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit"
      >
        <div className={cardClasses} style={style}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClasses} style={style}>
      {children}
    </div>
  );
};

export default Card; 