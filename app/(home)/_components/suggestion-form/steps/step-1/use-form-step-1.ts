'use client';

import { Place } from '@/app/_types/place';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import z from 'zod';

export const schema = z.object({
  destinationSearch: z.string().min(1, 'Field is required.'),
  destination: z.string().min(1, 'Field is required.'),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep1() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      destinationSearch: '',
      destination: '',
    },
  });

  const destinationSearch = useWatch({ control: form.control, name: 'destinationSearch' });
  const [debouncedSearchValue] = useDebounceValue(destinationSearch, 500);

  const [suggestions, setSuggestions] = useState<Place[]>([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (debouncedSearchValue === '') return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_LOCATIONS_SEARCH_API}/search?q=${debouncedSearchValue}&format=json&accept-language=en`
      )
      .then((response) => {
        setSuggestions(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

    return () => {
      source.cancel();
    };
  }, [debouncedSearchValue]);

  return {
    form,
    suggestions,
  };
}
