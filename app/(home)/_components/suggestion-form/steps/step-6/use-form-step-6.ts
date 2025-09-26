'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  budget: z.enum(['$', '$$', '$$$']),
  placesToSee: z.string().optional(),
  placesAvoidToSee: z.string().optional(),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep6() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  return {
    form,
  };
}
