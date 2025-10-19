'use client';

import { ReactNode } from 'react';

import Link from 'next/link';

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    title: string;
    description: string;
    icon?: ReactNode;
    sublink?: { label: string; href: string };
    footerButtons?: ReactNode;
  };
};

export function ProgressModal({ open, data, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md text-center">
        <AlertDialogHeader className="flex flex-row items-center gap-3">
          <TravelLoader size={75} />
          <div className="flex flex-col gap-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold flex items-center gap-2">
              {data.icon} {data.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{data.description}</AlertDialogDescription>
            {data.sublink && (
              <Link href={data.sublink.href} className="text-primary underline text-sm">
                {data.sublink.label}
              </Link>
            )}
          </div>
        </AlertDialogHeader>

        {data.footerButtons && <AlertDialogFooter>{data.footerButtons}</AlertDialogFooter>}

        <AlertDialogFooter>
          <AlertDialogCancel>Dismiss</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
