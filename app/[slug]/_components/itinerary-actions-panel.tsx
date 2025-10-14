'use client';

import { ReactNode } from 'react';

import { CopyPlus, Download, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@chadcn/components/ui/tooltip';
import { cn } from '@chadcn/lib/utils';

import { ItineraryAction } from '@/app/_types/itinerary-action';

type Props = {
  onClick: (key: ItineraryAction) => void;
};

export function ItineraryActionsPanel({ onClick }: Props) {
  const actions: {
    id: ItineraryAction;
    icon: ReactNode;
    tooltipLabel: string;
    className?: string;
    disabled?: boolean;
  }[] = [
    {
      id: 'duplicate',
      icon: <CopyPlus />,
      tooltipLabel: 'Duplicate itinerary',
    },
    {
      id: 'export',
      icon: <Download />,
      tooltipLabel: 'Export as PDF to share',
      disabled: true,
    },
    {
      id: 'edit_prompt',
      icon: <Pencil />,
      tooltipLabel: 'Edit trip preferences',
    },
    {
      id: 'delete',
      icon: <Trash2 />,
      tooltipLabel: 'Delete itinerary',
      className: 'text-destructive hover:!bg-destructive/20 hover:!text-destructive',
    },
  ];

  return (
    <div className="inline-flex items-center gap-3">
      {actions.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="icon"
                className={cn('rounded-full', item.className)}
                onClick={() => onClick(item.id)}
                disabled={item.disabled}
              >
                {item.icon}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{item.tooltipLabel}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
