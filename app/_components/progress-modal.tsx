'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/chadcn/components/ui/dialog';
import { Progress } from '@/chadcn/components/ui/progress';
import { ReactNode } from 'react';

type ModalProgressData = {
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  durationEstimate?: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ModalProgressData;
  progress?: number;
};

export function ProgressModal({ open, onOpenChange, data, progress = 0 }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex justify-center items-center gap-2">
            {data.icon ?? '⏳'} {data.title ?? 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 mt-4">
          {progress > 0 && progress < 100 && (
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" />
          )}

          {data.description && (
            <div className="text-sm text-muted-foreground max-w-sm leading-relaxed text-center">{data.description}</div>
          )}

          {progress > 0 && (
            <>
              <Progress value={progress} className="w-full mt-4" />
              <p className="text-xs text-muted-foreground">Progress: {Math.round(progress)}%</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
