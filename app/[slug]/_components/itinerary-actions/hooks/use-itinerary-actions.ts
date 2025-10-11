import { useState } from 'react';

import { TravelItineraryRow } from '@/app/_types/db/travel-itinerary-row';

export function useItineraryActions(itinerary: TravelItineraryRow) {
  const [isEditPromptConfirmationDialog, setIsEditPromptConfirmationDialog] = useState(false);
  const [isDuplicateConfirmationDialog, setIsDuplicateConfirmationDialog] = useState(false);
  const [isDeleteConfirmationDialog, setIsDeleteConfirmationDialog] = useState(false);

  return {
    itinerary,
    editPromptConfirmationDialog: {
      open: isEditPromptConfirmationDialog,
      onOpenChange: setIsEditPromptConfirmationDialog,
    },
    duplicateConfirmationDialog: {
      open: isDuplicateConfirmationDialog,
      onOpenChange: setIsDuplicateConfirmationDialog,
    },
    deleteConfirmationDialog: {
      open: isDeleteConfirmationDialog,
      onOpenChange: setIsDeleteConfirmationDialog,
    },
  };
}
