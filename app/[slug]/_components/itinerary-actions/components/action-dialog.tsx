'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@chadcn/components/ui/alert-dialog';
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

import { useItineraryActions } from '../hooks/use-itinerary-actions';

type Props = ReturnType<typeof useItineraryActions> & {};

export function ActionDialog(props: Props) {
  const editPromptConfirmationDialog = (
    <Dialog {...props.editPromptConfirmationDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch to Edit Mode</DialogTitle>
          <DialogDescription>
            You’re about to edit your trip’s prompt. When you continue, the sidebar will switch to the **Prompt
            Editor**, replacing your current trip overview.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default">Switch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const duplicateConfirmationDialog = (
    <Dialog {...props.duplicateConfirmationDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate This Trip</DialogTitle>
          <DialogDescription>
            A new copy of this itinerary will be created with all the same destinations, activities, and details.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default">Duplicate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const deleteConfirmationDialog = (
    <AlertDialog {...props.deleteConfirmationDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove This Itinerary</AlertDialogTitle>
          <AlertDialogDescription>
            You’re about to permanently remove this trip and all its related data, including destinations, notes, and
            collaboration history.
            <br />
            <br />
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Delete trip</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <>
      {editPromptConfirmationDialog}
      {duplicateConfirmationDialog}
      {deleteConfirmationDialog}
    </>
  );
}
