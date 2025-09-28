'use client';

import { useCounter } from '@/app/_components/counter/use-counter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

function syncArray<T>(
  fields: { fields: T[]; append: (value: T) => void; remove: (index: number) => void },
  targetLength: number | '',
  factory: (i: number) => T
) {
  const currentLength = fields.fields.length;

  if (targetLength === '') return;

  if (targetLength > currentLength) {
    for (let i = currentLength; i < targetLength; i++) {
      fields.append(factory(i));
    }
  } else if (targetLength < currentLength) {
    for (let i = currentLength; i > targetLength; i--) {
      fields.remove(i - 1);
    }
  }
}

export const schema = z.object({
  companions: z.enum(['Solo', 'Couple', 'Family', 'Friends']),
  groupSize: z.string().optional(),
  children: z.array(
    z.object({
      child: z.number(),
      group: z.enum(['0-3', '4-9', '10-16']),
    })
  ),
  adults: z.array(
    z.object({
      adult: z.number(),
    })
  ),
  friends: z.array(
    z.object({
      friend: z.number(),
    })
  ),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep3() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      companions: 'Solo',
      groupSize: '',
      children: [],
      adults: [],
      friends: [],
    },
  });

  const childrenFormControl = useFieldArray({
    control: form.control,
    name: 'children',
  });

  const adultsFormControl = useFieldArray({
    control: form.control,
    name: 'adults',
  });

  const friendsFormControl = useFieldArray({
    control: form.control,
    name: 'friends',
  });

  const groupCounter_children = useCounter();
  const groupCounter_adults = useCounter();
  const groupCounter_friends = useCounter();

  useEffect(() => {
    syncArray(childrenFormControl, groupCounter_children.groupMembers, (i) => ({
      child: i + 1,
      group: '0-3' as const,
    }));
  }, [groupCounter_children.groupMembers, childrenFormControl]);

  useEffect(() => {
    syncArray(adultsFormControl, groupCounter_adults.groupMembers, (i) => ({
      adult: i + 1,
    }));
  }, [groupCounter_adults.groupMembers, adultsFormControl]);

  useEffect(() => {
    syncArray(friendsFormControl, groupCounter_friends.groupMembers, (i) => ({
      friend: i + 1,
    }));
  }, [groupCounter_friends.groupMembers, friendsFormControl]);

  return {
    form,
    counters: {
      groupCounter_children,
      groupCounter_adults,
      groupCounter_friends,
    },
    controls: {
      childrenFormControl,
      adultsFormControl,
      friendsFormControl,
    },
  };
}
