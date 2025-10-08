'use client';

import { renameTrip } from '@/app/_actions/trips/rename-trip';
import { NavBarAction } from '@/app/_components/header/nav-bar/types/nav-bar-action';
import { useRequest } from '@/app/_providers/request-context';
import { useState } from 'react';

export function useNavBarActions() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { finish, fail } = useRequest();

  const handleRename = async (id: string, newValue: string) => {
    try {
      await renameTrip(id, newValue);
      finish({ message: 'Item has been renamed successfully' });
      setEditingItemId(null);
    } catch (err) {
      fail((err as Error).message);
    }
  };

  const handleDelete = async () => {};

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
        console.log('Delete', params);
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
        console.log('Edit Prompt', params);
      },
    },
  ];

  return {
    actionsConfig,
    editingItemId,
    handleRename,
    handleDelete,
    handleDuplicate,
    handleExport,
    handleEditPrompt,
  };
}
