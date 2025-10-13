import { ReactNode } from 'react';

export type Action = {
  id: string;
  icon: ReactNode;
  tooltipLabel: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};
