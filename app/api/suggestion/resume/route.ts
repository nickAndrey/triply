import { NextResponse } from 'next/server';

import { resumeItineraryGeneration } from '@features/itinerary/actions/resume-itinerary-generation';

export async function POST(request: Request) {
  const { itinerary } = await request.json();

  resumeItineraryGeneration(itinerary).catch((err) => console.error('Background generation failed:', err));

  return NextResponse.json({ ok: true }, { status: 202 });
}
