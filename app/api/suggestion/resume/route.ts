import { ProgressiveItineraryGenerator } from '@/app/_actions/personal-suggestion/personal-suggestion-generator';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tripId } = await request.json();

  (async () => {
    const supabase = createClient();
    const generator = new ProgressiveItineraryGenerator(supabase);
    await generator.resumeGenerateDayByDayTripPlan(tripId);
  })();

  return NextResponse.json({ ok: true }, { status: 202 });
}
