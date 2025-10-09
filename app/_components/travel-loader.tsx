import { ReactNode } from 'react';

import { LoaderCircle } from 'lucide-react';

import { cn } from '@chadcn/lib/utils';

type TravelLoaderProps = {
  icon?: ReactNode;
  size?: number;
  className?: string;
};

export function TravelLoader({ icon, size = 80, className }: TravelLoaderProps) {
  const ring1 = size;
  const ring2 = size * 0.8;
  const ring3 = size * 0.66;

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <LoaderCircle
        className="absolute animate-spin text-primary/30 stroke-[1.5]"
        style={{
          width: ring1,
          height: ring1,
          animationDuration: '6s',
        }}
      />
      <LoaderCircle
        className="absolute animate-spin text-primary/40 stroke-[1.25]"
        style={{
          width: ring2,
          height: ring2,
          animationDuration: '4s',
          animationDirection: 'reverse',
        }}
      />
      <LoaderCircle
        className="absolute animate-spin text-primary/50 stroke-[1.25]"
        style={{
          width: ring3,
          height: ring3,
          animationDuration: '2.5s',
        }}
      />
      <span className="absolute animate-pulse" style={{ fontSize: `${size * 0.25}px` }}>
        {icon ?? '🧭'}
      </span>
    </div>
  );
}
