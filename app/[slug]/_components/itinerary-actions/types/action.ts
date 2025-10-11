import { ReactNode } from 'react';

export type Action = {
  id: string;
  icon: ReactNode;
  tooltipLabel: string;
  onClick: () => void;
};
