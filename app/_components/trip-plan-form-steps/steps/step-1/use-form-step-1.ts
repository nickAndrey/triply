'use client';

import { NominatimResult } from '@/app/_types/place';
import { removeDuplicatesFromArray } from '@/app/_utils/remove-duplicates-from-array';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import z from 'zod';
import { transformSearchSuggestions } from './_utils/transform-search-suggestions';

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

  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);

  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (debouncedSearchValue === '') return;

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const params = new URLSearchParams({
      'q': debouncedSearchValue,
      'format': 'json',
      'accept-language': 'en',
      'addressdetails': '1',
    });

    axios
      .get<NominatimResult[]>(`${process.env.NEXT_PUBLIC_LOCATIONS_SEARCH_API}/search?${params}`)
      .then(({ data }) => {
        const transformedData = data.map(transformSearchSuggestions);
        const cleanedData = removeDuplicatesFromArray(transformedData, 'display_name');
        setSuggestions(cleanedData);
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
    setSkipNextSearch: (val: boolean) => (skipNextSearchRef.current = val),
  };
}
