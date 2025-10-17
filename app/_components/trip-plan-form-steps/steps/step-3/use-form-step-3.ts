'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

import { useCounter } from '@components/counter/use-counter';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

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

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useFormStep3({ initialValues }: Args = {}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      companions: initialValues?.companions || 'Solo',
      children: initialValues?.children || [],
      adults: initialValues?.adults || [],
      friends: initialValues?.friends || [],
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
    syncArray(childrenFormControl, groupCounter_children.value, (i) => ({
      child: i + 1,
      group: '0-3' as const,
    }));
  }, [groupCounter_children.value, childrenFormControl]);

  useEffect(() => {
    syncArray(adultsFormControl, groupCounter_adults.value, (i) => ({
      adult: i + 1,
    }));
  }, [groupCounter_adults.value, adultsFormControl]);

  useEffect(() => {
    syncArray(friendsFormControl, groupCounter_friends.value, (i) => ({
      friend: i + 1,
    }));
  }, [groupCounter_friends.value, friendsFormControl]);

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
