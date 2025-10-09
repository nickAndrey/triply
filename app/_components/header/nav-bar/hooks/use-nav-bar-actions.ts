'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { deleteTrip } from '@server-actions/trips/delete-trip';
import { renameTrip } from '@server-actions/trips/rename-trip';

import { useRequest } from '@providers/request-context';

import { NavBarAction } from '@components/header/nav-bar/types/nav-bar-action';

type AlertDialogProps =
  | {
      type: 'none';
      open: boolean;
      title?: undefined;
      description?: undefined;
      action?: () => void;
    }
  | {
      type: 'edit';
      open: boolean;
      title: string;
      description: string;
      action: () => void;
    }
  | {
      type: 'delete';
      open: boolean;
      title: string;
      description: string;
      action: () => void;
    };

export function useNavBarActions() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({
    type: 'none',
    open: false,
  });

  const router = useRouter();

  const { finish, fail } = useRequest();

  const handleDialogOnOpenChange = (isOpen: boolean) => {
    setAlertDialogProps((prev) => ({ ...prev, open: isOpen }));
  };

  const handleRename = async (id: string, newValue: string, actionPrevented?: boolean) => {
    if (actionPrevented) {
      setEditingItemId(null);
      return;
    }

    try {
      await renameTrip(id, newValue);
      finish({ message: 'Item has been renamed successfully' });
      setEditingItemId(null);
    } catch (err) {
      fail((err as Error).message);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    try {
      await deleteTrip(id);
      finish({ message: 'The trip has been removed successfully' });

      if (window.location.pathname.includes(slug)) {
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 800);
      } else {
        router.refresh();
      }
    } catch (err) {
      fail((err as Error).message);
    }
  };

  const handleDuplicate = async () => {};

  const handleExport = async () => {};

  const handleEditPrompt = async () => {};

  const actionsConfig: NavBarAction[] = [
    {
      id: 0,
      label: 'Rename',
      action: (params) => {
        setEditingItemId(params.id);
      },
    },
    {
      id: 1,
      label: 'Delete',
      action: (params) => {
        setAlertDialogProps((prev) => ({
          ...prev,
          type: 'delete',
          open: true,
          title: 'Delete Trip',
          description: 'Are you sure you want to delete this trip? This action cannot be undone.',
          action() {
            handleDelete(params.id, params.trip_plan_details.slug);
          },
        }));
      },
    },
    {
      id: 2,
      label: 'Duplicate',
      action: (params) => {
        console.log('Duplicate', params);
      },
    },
    {
      id: 3,
      label: 'Export',
      action: (params) => {
        console.log('Export', params);
      },
    },
    {
      id: 4,
      label: 'Edit Prompt',
      action: (params) => {
        setAlertDialogProps((prev) => ({
          ...prev,
          type: 'edit',
          open: true,
          title: 'Confirm Changes',
          description: 'Would you like to replace the existing prompt with your new version, or keep both versions?',
          action() {
            console.log(params.id);
          },
        }));
      },
    },
  ];

  return {
    actionsConfig,
    editingItemId,
    alertDialogProps,
    handleRename,
    handleDelete,
    handleDuplicate,
    handleExport,
    handleEditPrompt,
    handleDialogOnOpenChange,
  };
}
