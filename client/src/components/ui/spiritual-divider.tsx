import { LotusIcon, DiyaIcon, OmIcon, MandalaIcon } from './spiritual-icons';
import { cn } from '@/lib/utils';

interface SpiritualDividerProps {
  type?: 'lotus' | 'diya' | 'om' | 'mandala' | 'combined';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export default function SpiritualDivider({ 
  type = 'lotus', 
  className, 
  size = 'md',
  animated = true 
}: SpiritualDividerProps) {
  const iconSize = sizeMap[size];
  
  const renderIcon = (iconType: string, index?: number) => {
    const iconProps = {
      size: iconSize,
      className: cn(
        "transition-all duration-500",
        animated && "hover:scale-110 hover:rotate-12",
        index !== undefined && animated && `animate-pulse`,
        index !== undefined && `animation-delay-${index * 200}ms`
      )
    };

    switch (iconType) {
      case 'lotus':
        return <LotusIcon {...iconProps} data-testid={`icon-lotus${index !== undefined ? `-${index}` : ''}`} />;
      case 'diya':
        return <DiyaIcon {...iconProps} data-testid={`icon-diya${index !== undefined ? `-${index}` : ''}`} />;
      case 'om':
        return <OmIcon {...iconProps} data-testid={`icon-om${index !== undefined ? `-${index}` : ''}`} />;
      case 'mandala':
        return <MandalaIcon {...iconProps} data-testid={`icon-mandala${index !== undefined ? `-${index}` : ''}`} />;
      default:
        return <LotusIcon {...iconProps} />;
    }
  };

  if (type === 'combined') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center gap-4 my-8 opacity-60 hover:opacity-90 transition-opacity duration-500",
          className
        )}
        data-testid="spiritual-divider-combined"
      >
        {/* Decorative line */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/60" />
        
        {/* Spiritual icons sequence */}
        <div className="flex items-center gap-3">
          {renderIcon('lotus', 0)}
          {renderIcon('om', 1)}
          {renderIcon('diya', 2)}
        </div>
        
        {/* Decorative line */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/60" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-4 my-8 opacity-60 hover:opacity-90 transition-opacity duration-500",
        className
      )}
      data-testid={`spiritual-divider-${type}`}
    >
      {/* Decorative line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/60" />
      
      {/* Central spiritual icon */}
      <div className="px-4">
        {renderIcon(type)}
      </div>
      
      {/* Decorative line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/60" />
    </div>
  );
}

// Individual divider components for easy use
export function LotusDivider(props: Omit<SpiritualDividerProps, 'type'>) {
  return <SpiritualDivider {...props} type="lotus" />;
}

export function DiyaDivider(props: Omit<SpiritualDividerProps, 'type'>) {
  return <SpiritualDivider {...props} type="diya" />;
}

export function OmDivider(props: Omit<SpiritualDividerProps, 'type'>) {
  return <SpiritualDivider {...props} type="om" />;
}

export function MandalaDivider(props: Omit<SpiritualDividerProps, 'type'>) {
  return <SpiritualDivider {...props} type="mandala" />;
}

export function CombinedDivider(props: Omit<SpiritualDividerProps, 'type'>) {
  return <SpiritualDivider {...props} type="combined" />;
}