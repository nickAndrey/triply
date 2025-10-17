'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { cn } from '@chadcn/lib/utils';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Attach scroll tracking to your custom scroll container
  useEffect(() => {
    const container = document.querySelector('article');
    if (!container) return;

    scrollContainerRef.current = container as HTMLElement;

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-300 transform rounded-full',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      )}
    >
      <ArrowUp />
    </Button>
  );
}
