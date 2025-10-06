import { LoaderCircle } from 'lucide-react';

type TravelLoaderProps = {
  size?: number;
};

export function TravelLoader({ size = 80 }: TravelLoaderProps) {
  const ring1 = size;
  const ring2 = size * 0.8;
  const ring3 = size * 0.66;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
        🧭
      </span>
    </div>
  );
}
