'use client';

import { CopyPlus, Download, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@chadcn/components/ui/tooltip';
import { cn } from '@chadcn/lib/utils';

import { useItineraryActions } from '../hooks/use-itinerary-actions';
import { Action } from '../types/action';

type Props = ReturnType<typeof useItineraryActions> & {};

export function ItineraryActionsPanel(props: Props) {
  const { duplicateConfirmationDialog, editPromptConfirmationDialog, deleteConfirmationDialog } = props;

  const actions: Action[] = [
    {
      id: 'duplicate',
      icon: <CopyPlus />,
      tooltipLabel: 'Duplicate itinerary',
      onClick: () => {
        duplicateConfirmationDialog.onOpenChange(true);
      },
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
      onClick: () => {
        editPromptConfirmationDialog.onOpenChange(true);
      },
    },
    {
      id: 'delete',
      icon: <Trash2 />,
      tooltipLabel: 'Delete itinerary',
      onClick: () => {
        deleteConfirmationDialog.onOpenChange(true);
      },
    },
  ];

  return (
    <div className="p-2 flex items-center gap-3">
      {actions.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'rounded-full',
                item.id === 'delete' && 'text-destructive hover:!bg-destructive/20 hover:!text-destructive'
              )}
              onClick={item.onClick}
            >
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{item.tooltipLabel}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
