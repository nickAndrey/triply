'use client';

import { ReactNode, useEffect, useState } from 'react';

import { LoaderCircle } from 'lucide-react';

import { useRequest } from '@providers/request-context';

import { Button } from '@chadcn/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@chadcn/components/ui/dialog';
import { Input } from '@chadcn/components/ui/input';
import { Label } from '@chadcn/components/ui/label';

import { useDuplicateItinerary } from '@/app/_hooks/use-duplicate-itinerary';
import { useItineraryDelete } from '@/app/_hooks/use-itinerary-delete';
import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';
import { ItineraryAction } from '@/app/_types/itinerary-action';

type Props = {
  action: {
    key: ItineraryAction | null;
    id: number;
  };
  itinerary: TravelItineraryRow | null;
} & {
  editPromptActionButtonClick?: () => void;
};

export function ActionDialog({ action, itinerary, editPromptActionButtonClick }: Props) {
  const { isPending } = useRequest();

  const { handleItineraryDelete } = useItineraryDelete();
  const { onDuplicateItinerary } = useDuplicateItinerary();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [itineraryName, setItineraryName] = useState(itinerary?.trip_core.navTitle);

  useEffect(() => setIsDialogOpen(true), [action.id]);

  if (!itinerary || !action.key) return null;

  const dialogConfig: Record<
    ItineraryAction,
    {
      title: string;
      description: string;
      content: ReactNode;
      actionButton: {
        label: string;
        onClick: () => void;
      };
    }
  > = {
    delete: {
      title: 'Delete This Trip',
      description: 'Permanent removal of your itinerary and related data.',
      content: (
        <div>
          You’re about to permanently delete this trip and all of its related details — including destinations, notes,
          and any collaboration history.
          <br />
          <br />
          <strong>This action cannot be undone.</strong> Are you sure you want to continue?
        </div>
      ),
      actionButton: {
        label: 'Delete anyway',
        onClick: () => handleItineraryDelete(itinerary.id).then(() => setIsDialogOpen(false)),
      },
    },

    duplicate: {
      title: 'Duplicate This Trip',
      description: 'Create a copy of your existing itinerary.',
      content: (
        <div>
          A new copy of this trip will be created, including all destinations, notes, and preferences.
          <br />
          <br />
          You can rename the copy afterward — the default name will be the original one with “(Copy)” added.
        </div>
      ),
      actionButton: {
        label: 'Duplicate',
        onClick: () => onDuplicateItinerary(itinerary.id).then(() => setIsDialogOpen(false)),
      },
    },

    rename: {
      title: 'Rename Trip',
      description: 'Give your trip a new name.',
      content: (
        <div className="flex flex-col gap-3">
          <p>
            Enter a new name for this trip below. Renaming won’t affect the trip’s content — just how it appears in your
            trip list.
          </p>

          <Label htmlFor="new-itinerary-name">Name</Label>
          <Input
            id="new-itinerary-name"
            type="text"
            value={itineraryName}
            onChange={(e) => setItineraryName(e.target.value)}
            placeholder="Provide a new name"
          />
        </div>
      ),
      actionButton: {
        label: 'Rename',
        onClick: () => {},
      },
    },

    export: {
      title: 'Export Trip Details',
      description: 'Download your trip plan for offline access.',
      content: (
        <div>
          You can export your itinerary as a <strong>PDF</strong> or <strong>CSV</strong> file to share or print.
          <br />
          <br />
          Choose your preferred format in the next step.
        </div>
      ),
      actionButton: {
        label: 'Export',
        onClick: () => {},
      },
    },

    edit_prompt: {
      title: 'Switch to Edit Mode',
      description: 'Modify the prompt that generated this itinerary.',
      content: (
        <div>
          You’re about to edit your trip’s prompt. When you continue, the sidebar will switch to the{' '}
          <strong>Prompt Editor</strong>, replacing your current trip overview.
          <br />
          <br />
          <em>Tip:</em> You can adjust destinations, tone, or preferences here — then regenerate the itinerary when
          ready.
        </div>
      ),
      actionButton: {
        label: 'Switch to edit mode',
        onClick: () => editPromptActionButtonClick?.(),
      },
    },
  };

  const { title, description, content, actionButton } = dialogConfig[action.key];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={actionButton.onClick}>
            {isPending && <LoaderCircle className="animate-spin" />}
            <span>{actionButton.label}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
