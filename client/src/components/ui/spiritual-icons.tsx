import { cn } from '@/lib/utils';

interface SpiritualIconProps {
  className?: string;
  size?: number;
}

// Lotus Icon - Symbol of purity and spiritual awakening
export function LotusIcon({ className, size = 24 }: SpiritualIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      data-testid="icon-lotus"
    >
      <path
        d="M12 2C12 2 8 4 6 8C4 12 6 16 12 18C18 16 20 12 18 8C16 4 12 2 12 2Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M12 4C12 4 9.5 5.5 8 8.5C6.5 11.5 8 14.5 12 16C16 14.5 17.5 11.5 16 8.5C14.5 5.5 12 4 12 4Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 6C12 6 10.5 7 9.5 9.5C8.5 12 9.5 13.5 12 14.5C14.5 13.5 15.5 12 14.5 9.5C13.5 7 12 6 12 6Z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

// Diya Icon - Sacred oil lamp for festivals and worship
export function DiyaIcon({ className, size = 24 }: SpiritualIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      data-testid="icon-diya"
    >
      {/* Flame */}
      <path
        d="M12 2C11.5 2 11 3 11 4.5C11 6 11.5 7.5 12 8C12.5 7.5 13 6 13 4.5C13 3 12.5 2 12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Wick */}
      <rect x="11.5" y="8" width="1" height="4" fill="currentColor" opacity="0.7" />
      {/* Oil lamp body */}
      <ellipse cx="12" cy="16" rx="8" ry="4" fill="currentColor" opacity="0.6" />
      <ellipse cx="12" cy="15" rx="7" ry="3" fill="currentColor" opacity="0.4" />
      {/* Spout */}
      <ellipse cx="20" cy="15" rx="1.5" ry="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

// Om Symbol - Sacred sound of the universe
export function OmIcon({ className, size = 24 }: SpiritualIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      data-testid="icon-om"
    >
      <path
        d="M12 2C16.97 2 21 6.03 21 11C21 15.97 16.97 20 12 20C7.03 20 3 15.97 3 11C3 6.03 7.03 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 9C8 9 9 8 11 8C13 8 14 9 14 11C14 13 13 14 11 14C9 14 8 13 8 11"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M14 11C14 11 15 10 16 10C17 10 17 11 17 11C17 12 16 12 16 12C15 12 14 11 14 11Z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.7" />
      <path
        d="M7 15C7 15 8 14 9 14C10 14 11 15 11 16C11 17 10 18 9 18C8 18 7 17 7 16C7 15 7 15 7 15Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

// Simple Mandala Pattern - Geometric spiritual symbol
export function MandalaIcon({ className, size = 24 }: SpiritualIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-accent", className)}
      data-testid="icon-mandala"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Second ring */}
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Inner petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 12 + 5 * Math.cos(angle);
        const y1 = 12 + 5 * Math.sin(angle);
        const x2 = 12 + 3 * Math.cos(angle);
        const y2 = 12 + 3 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={12}
            y1={12}
            x2={x1}
            y2={y1}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        );
      })}
      {/* Center */}
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  );
}