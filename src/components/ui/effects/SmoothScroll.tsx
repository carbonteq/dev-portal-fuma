"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function SmoothScroll({
  children
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { 
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, value => {
    if (typeof window === 'undefined') return 0;
    return value * -(contentHeight - window.innerHeight);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (contentRef.current && typeof window !== 'undefined') {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Initial calculation with a small delay to ensure proper rendering
    const timer = setTimeout(handleResize, 100);
    
    window.addEventListener("resize", handleResize);
    
    // Recalculate on content changes
    const observer = new ResizeObserver(handleResize);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [isMounted, children]);

  // Return non-smooth version for SSR and initial render
  if (!isMounted) {
    return <div>{children}</div>;
  }

  return (
    <>
      {/* Invisible spacer to trigger browser scrollbar */}
      <div style={{ height: contentHeight }} />
      
      {/* Fixed content wrapper with smooth scrolling */}
      <motion.div
        className="scrollBody"
        style={{ y }}
        ref={contentRef}
      >
        {children}
      </motion.div>
    </>
  );
} 