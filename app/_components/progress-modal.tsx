'use client';

import { ReactNode } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@chadcn/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="flex flex-row items-center gap-3">
          <TravelLoader size={75} />
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {data.icon} {data.title ?? 'Loading...'}
            </DialogTitle>
            {data.description}
          </div>
        </DialogHeader>

        {data.footerContent && <DialogFooter>{data.footerContent}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
