import React from 'react';
import Image from 'next/image';

// Import aside images
import NoteImg from '../../../public/img/aside/note1.png';
import TipImg from '../../../public/img/aside/tip1.png';
import CautionImg from '../../../public/img/aside/caution1.png';
import DangerImg from '../../../public/img/aside/danger1.png';

const asideVariants = ['note', 'tip', 'caution', 'danger', 'info'] as const;
type AsideVariant = typeof asideVariants[number];

interface AsideProps {
  children: React.ReactNode;
  type?: AsideVariant;
  title?: string;
  showIcon?: boolean;
}

// Default titles for each type
const defaultTitles: Record<AsideVariant, string> = {
  note: 'Note',
  tip: 'Tip',
  caution: 'Caution',
  danger: 'Danger',
  info: 'Info'
};

// Image mapping for each type
const asideImages = {
  note: NoteImg,
  tip: TipImg,
  caution: CautionImg,
  danger: DangerImg,
  info: NoteImg // fallback to note image for info type
};

// Icon components for each type
const AsideIcon: React.FC<{ type: AsideVariant }> = ({ type }) => {
  const iconClasses = "w-5 h-5 mr-2 flex-shrink-0";
  
  switch (type) {
    case 'note':
      return (
        <svg className={`${iconClasses} text-blue-500 dark:text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    case 'tip':
      return (
        <svg className={`${iconClasses} text-emerald-500`} style={{color: 'var(--color-fd-primary)'}} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      );
    case 'caution':
      return (
        <svg className={`${iconClasses} text-yellow-500 dark:text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'danger':
      return (
        <svg className={`${iconClasses} text-red-500 dark:text-red-400`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
      return (
        <svg className={`${iconClasses} text-blue-500 dark:text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

const Aside: React.FC<AsideProps> = ({ 
  children, 
  type = 'note', 
  title, 
  showIcon = true 
}) => {
  // Validate type
  if (!asideVariants.includes(type)) {
    throw new Error(
      `Invalid \`type\` prop passed to the \`<Aside>\` component.\n` +
      `Received: ${JSON.stringify(type)}\n` +
      `Expected one of ${asideVariants.map((i) => JSON.stringify(i)).join(', ')}`
    );
  }

  const finalTitle = title || defaultTitles[type];

  // CSS custom properties based styling for proper dark theme support
  const getAsideClasses = (type: AsideVariant): string => {
    const baseClasses = "rounded-sm border-l-4 p-4 my-4 relative";
    
    switch (type) {
      case 'note':
        return `${baseClasses} bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-400/70 text-blue-800 dark:text-blue-200`;
      case 'tip':
        return `${baseClasses} bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-[oklch(0.79_0.15_159.4)] text-emerald-800 dark:text-[oklch(0.79_0.15_159.4)]`;
      case 'caution':
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-950/30 border-yellow-400 dark:border-yellow-400/70 text-yellow-800 dark:text-yellow-200`;
      case 'danger':
        return `${baseClasses} bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-400/70 text-red-800 dark:text-red-200`;
      case 'info':
        return `${baseClasses} bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-400/70 text-blue-800 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-gray-50 dark:bg-gray-950/30 border-gray-400 dark:border-gray-400/70 text-gray-800 dark:text-gray-200`;
    }
  };

  // Image positioning and styling based on type
  const getImageClasses = (type: AsideVariant): string => {
    const baseClasses = "absolute z-10";
    
    switch (type) {
      case 'note':
        return `${baseClasses} -top-9 -right-4 -scale-x-100 rotate-12`;
      case 'tip':
        return `${baseClasses} -top-10 -right-8 -rotate-1`;
      case 'caution':
        return `${baseClasses} -top-9 -right-4 -rotate-1`;
      case 'danger':
        return `${baseClasses} -top-9 -right-6 rotate-1`;
      case 'info':
        return `${baseClasses} -top-9 -right-4 rotate-12`;
      default:
        return `${baseClasses} -top-9 -right-4 -rotate-1`;
    }
  };

  return (
    <aside 
      aria-label={finalTitle} 
      className={getAsideClasses(type)}
    >
      {showIcon && (
        <div className={getImageClasses(type)}>
          <Image
            src={asideImages[type]}
            alt={finalTitle}
            height={80}
            className="drop-shadow-lg"
          />
        </div>
      )}
      <div className="flex items-center mb-2 font-semibold" aria-hidden="true">
        {showIcon && <AsideIcon type={type} />}
        {finalTitle}
      </div>
      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </aside>
  );
};

export default Aside; 