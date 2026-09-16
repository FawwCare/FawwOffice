import { Activity, Sun, HeartHandshake, Calendar } from 'lucide-react';
import type { ServiceType } from '@/types/booking.types';
import { cn } from '@/utils/cn';

interface ServiceIconProps {
  serviceType?: ServiceType | string;
  size?: number;
  className?: string;
  variant?: 'subtle' | 'solid' | 'raw';
}

export function ServiceIcon({
  serviceType,
  size = 18,
  className,
  variant = 'subtle',
}: ServiceIconProps) {
  const getIcon = () => {
    switch (serviceType) {
      case '근골격케어':
        return <Activity size={size} strokeWidth={2} />;
      case '요가/명상':
        return <Sun size={size} strokeWidth={2} />;
      case '멘탈코치':
        return <HeartHandshake size={size} strokeWidth={2} />;
      default:
        return <Calendar size={size} strokeWidth={2} />;
    }
  };

  if (variant === 'raw') {
    return <span className={cn('inline-flex items-center justify-center text-gray-700', className)}>{getIcon()}</span>;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-colors',
        variant === 'solid'
          ? 'bg-[#1a4a2e] text-white'
          : 'bg-gray-100 text-gray-700 group-hover:bg-[#e8f5ee] group-hover:text-[#2d7a4f]',
        'p-2',
        className
      )}
    >
      {getIcon()}
    </span>
  );
}
