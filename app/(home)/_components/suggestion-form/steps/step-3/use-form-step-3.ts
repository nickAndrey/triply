'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  companions: z.enum(['Solo', 'Couple', 'Family', 'Friends']),
  groupSize: z.string().optional(),
  childrenAges: z.string().optional(),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep3() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      companions: 'Solo',
      groupSize: '',
      childrenAges: '',
    },
  });

  return {
    form,
  };
}
