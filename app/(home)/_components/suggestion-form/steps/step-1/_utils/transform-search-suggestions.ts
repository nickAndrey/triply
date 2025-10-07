'use client';

import { NominatimResult } from '@/app/_types/place';

export function transformSearchSuggestions(item: NominatimResult): NominatimResult {
  const addr = item.address;

  let settlement =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.suburb ||
    addr.neighbourhood ||
    item.display_name.split(',')[0];

  if (addr.village) settlement = `${settlement} (village)`;
  if (addr.hamlet) settlement = `${settlement} (hamlet)`;

  const country = addr.country || '';

  return {
    ...item,
    display_name: [settlement === country ? '' : settlement, country].filter(Boolean).join(', '),
  };
}
