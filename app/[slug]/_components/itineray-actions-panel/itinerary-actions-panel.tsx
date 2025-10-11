'use client';

import { ReactNode, useState } from 'react';

import { CopyPlus, Download, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@chadcn/components/ui/tooltip';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

type Action = {
  id: string;
  icon: ReactNode;
  tooltipLabel: string;
  onClick: () => void;
};

type Props = {
  itinerary: TravelItineraryRow;
};

export function ItineraryActionsPanel({ itinerary }: Props) {
  const [activeActionId, setActiveActionId] = useState();

  const actions: Action[] = [
    {
      id: 'duplicate',
      icon: <CopyPlus />,
      tooltipLabel: 'Duplicate itinerary',
      onClick: () => {},
    },
    {
      id: 'export',
      icon: <Download />,
      tooltipLabel: 'Export as PDF to share',
      onClick: () => {},
    },
    {
      id: 'edit_prompt',
      icon: <Pencil />,
      tooltipLabel: 'Edit trip preferences',
      onClick: () => {},
    },
    {
      id: 'delete',
      icon: <Trash2 />,
      tooltipLabel: 'Delete itinerary',
      onClick: () => {},
    },
  ];

  return (
    <div className="p-2 flex items-center gap-3">
      {actions.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full" onClick={item.onClick}>
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{item.tooltipLabel}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
