import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StackItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface StackProps {
  items: StackItem[];
  className?: string;
}

export default function Stack({ items, className }: StackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 4000); // Auto-rotate every 4 seconds
      return () => clearInterval(interval);
    }
  }, [isHovered, items.length]);

  return (
    <div 
      ref={stackRef}
      className={cn(
        "relative w-full h-[60vh] max-h-[500px] min-h-[400px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="stack-container"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={item.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              "rounded-lg shadow-lg overflow-hidden cursor-pointer",
              isActive ? "opacity-100 z-10" : "opacity-0 z-1"
            )}
            onClick={() => setActiveIndex(index)}
            data-testid={`stack-card-${item.id}`}
          >
            {/* Full Image without text */}
            <div className="relative w-full h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                data-testid={`img-${item.id}`}
              />
              {/* Subtle gradient overlay for better visual appeal */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        );
      })}
      
      {/* Navigation Dots */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === activeIndex 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
            )}
            onClick={() => setActiveIndex(index)}
            data-testid={`dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

