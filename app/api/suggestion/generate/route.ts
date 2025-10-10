import { NextResponse } from 'next/server';

import { startItineraryGeneration } from '@features/itinerary/actions/start-itinerary-generation';

export async function POST(request: Request) {
  const { form } = await request.json();

  startItineraryGeneration(form).catch((err) => console.error('Background generation failed:', err));

  return NextResponse.json({ ok: true }, { status: 202 });
}
