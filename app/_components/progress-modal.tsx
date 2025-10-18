'use client';

import { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@chadcn/components/ui/alert-dialog';

import { TravelLoader } from '@components/travel-loader';

type ModalProgressData = {
  title?: string;
  description?: ReactNode;
  footerContent?: ReactNode;
  icon?: ReactNode;
};

type Props = {
  open: boolean;
  data: ModalProgressData;
  onOpenChange: (open: boolean) => void;
};

export function ProgressModal({ open, data, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md text-center">
        <AlertDialogHeader className="flex flex-row items-center gap-3">
          <TravelLoader size={75} />
          <div className="flex flex-col gap-2">
            <AlertDialogTitle className="text-lg font-semibold flex items-center gap-2">
              {data.icon} {data.title ?? 'Loading...'}
            </AlertDialogTitle>

            <AlertDialogDescription>{data.description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {data.footerContent && <AlertDialogFooter>{data.footerContent}</AlertDialogFooter>}

        <AlertDialogFooter>
          <AlertDialogCancel>Dismiss</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
