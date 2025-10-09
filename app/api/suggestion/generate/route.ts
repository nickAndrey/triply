import { NextResponse } from 'next/server';

import { ProgressiveItineraryGenerator } from '@server-actions/personal-suggestion/personal-suggestion-generator';

import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { tripId } = await request.json();

  (async () => {
    const supabase = createClient();
    const generator = new ProgressiveItineraryGenerator(supabase);
    await generator.startGenerateTripPlan(tripId);
  })();

  return NextResponse.json({ ok: true }, { status: 202 });
}
