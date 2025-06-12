import React from 'react';
import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  link?: string;
  style?: React.CSSProperties;
}

const CustomCard: React.FC<CardProps> = ({ children, link, style }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-fd-card)',
    border: '1px solid var(--color-fd-border)',
    color: 'var(--color-fd-card-foreground)',
    ...style
  };

  const cardClasses = "rounded-lg p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-md";

  if (link) {
    return (
      <Link 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-inherit"
      >
        <div className={cardClasses} style={cardStyle}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClasses} style={cardStyle}>
      {children}
    </div>
  );
};

export default CustomCard; 