'use client';

import { useGroupCounter } from '@/app/(home)/_components/suggestion-form/steps/step-3/_components/group-counter/use-group-counter';
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
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep3() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      companions: 'Solo',
      groupSize: '',
      children: [],
    },
  });

  const childrenFieldsArray = useFieldArray({
    control: form.control,
    name: 'children',
  });

  const adultsFieldsArray = useFieldArray({
    control: form.control,
    name: 'adults',
  });

  const groupCounter_children = useGroupCounter();
  const groupCounter_adults = useGroupCounter();

  useEffect(() => {
    syncArray(childrenFieldsArray, groupCounter_children.groupMembers, (i) => ({
      child: i + 1,
      group: '0-3' as const,
    }));
  }, [groupCounter_children.groupMembers]);

  useEffect(() => {
    syncArray(adultsFieldsArray, groupCounter_adults.groupMembers, (i) => ({
      adult: i + 1,
    }));
  }, [groupCounter_adults.groupMembers]);

  return {
    form,
    counters: {
      groupCounter_children,
      groupCounter_adults,
    },
    childrenFieldsArray,
  };
}
