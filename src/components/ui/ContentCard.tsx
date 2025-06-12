import React from 'react';
import Link from 'next/link';
import { Video, BookOpen, FileText, Star, Clock } from 'lucide-react';

interface ContentCardProps {
  title: string;
  author: string;
  rating: number;
  contentType: 'video' | 'book' | 'article';
  watchTime?: string;
  link: string;
  children: React.ReactNode;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  author, 
  rating, 
  contentType, 
  watchTime, 
  link, 
  children,
  level = 'Beginner'
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: Math.min(rating, 5) }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        className="fill-current text-yellow-500" 
      />
    ));
  };

  const getContentTypeIcon = (type: string) => {
    const iconProps = { size: 20, className: "text-current" };
    
    switch (type) {
      case 'video':
        return <Video {...iconProps} />;
      case 'book':
        return <BookOpen {...iconProps} />;
      case 'article':
        return <FileText {...iconProps} />;
      default:
        return <BookOpen {...iconProps} />;
    }
  };

  return (
    <Link 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline text-inherit"
    >
      <div 
        className="rounded-lg p-6 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-md"
        style={{
          backgroundColor: 'var(--color-fd-card)',
          border: '1px solid var(--color-fd-border)',
          color: 'var(--color-fd-card-foreground)'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getContentTypeIcon(contentType)}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">{renderStars(rating)}</div>
          </div>
        </div>

        <h4 
          className="text-xl font-semibold mb-3 leading-tight"
          style={{ color: 'var(--color-fd-primary)' }}
        >
          {title}
        </h4>

        <div 
          className="mb-4 leading-relaxed"
          style={{ color: 'var(--color-fd-foreground)' }}
        >
          {children}
        </div>

        <div 
          className="flex justify-between items-center pt-4"
          style={{ borderTop: '1px solid var(--color-fd-border)' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-fd-muted-foreground)' }}
              >
                Author: 
              </span>
              <span 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-fd-foreground)' }}
              >
                {author}
              </span>
            </div>
            <span 
              className="text-xs font-medium px-2 py-1 rounded border"
              style={{
                borderColor: 'var(--color-fd-border)',
                backgroundColor: 'var(--color-fd-muted)',
                color: 'var(--color-fd-muted-foreground)'
              }}
            >
              {level}
            </span>
          </div>
          {contentType === 'video' && watchTime && (
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: 'var(--color-fd-muted-foreground)' }} />
              <span 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-fd-foreground)' }}
              >
                {watchTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ContentCard; 