'use client';

import { NavBarAction } from '@/app/_components/header/nav-bar/types/nav-bar-action';
import { useState } from 'react';

export function useNavBarActions() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const resetEditingItemId = () => setEditingItemId(null);

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

  return { actionsConfig, editingItemId, resetEditingItemId };
}
