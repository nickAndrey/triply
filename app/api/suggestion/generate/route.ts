import { NextResponse } from 'next/server';

import { startItineraryGeneration } from '@features/itinerary/actions/start-itinerary-generation';
import { createEmptyTripRecord } from '@features/itinerary/db/db-create-empty-trip';

export async function POST(request: Request) {
  const { form } = await request.json();
  const { id } = await createEmptyTripRecord(form);
  startItineraryGeneration(form, id).catch((err) => console.error('Background generation failed:', err));

  return NextResponse.json({ ok: true, itineraryId: id }, { status: 202 });
}
