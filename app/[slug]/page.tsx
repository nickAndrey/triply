import { ResizableLayer } from '@/app/[slug]/_components/resizable-layer';
import { DB_TABLES } from '@/app/_constants/db-tables';
import { TripPlan } from '@/app/_types/trip-plan';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Triply | Suggestions',
  description: 'Triply — AI-Powered Travel Planner',
};

export default async function TravelSuggestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const { data } = await supabase
    .from(DB_TABLES.travel_itineraries)
    .select('trip_plan_details')
    .eq('user_id', user.id)
    .filter('trip_plan_details->>slug', 'eq', slug)
    .maybeSingle<{ trip_plan_details: TripPlan }>();

  if (!data) return notFound();

  const trip = data.trip_plan_details;

  const asideContent = trip.days.map((day) => ({
    anchor: day.dayNumber,
    title: `Day ${day.dayNumber}: ${day.theme}`,
    places: [...day.morning.map((m) => m.name), ...day.afternoon.map((a) => a.name), ...day.evening.map((e) => e.name)],
  }));

  function buildGoogleMapsLink(place: string, city: string, country: string) {
    const cleanedUpPlace = place.replace(/\s*\([^)]*\)/g, '').trim();
    const query = encodeURIComponent(`${cleanedUpPlace} ${city} ${country}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  return (
    <main className="prose dark:prose-invert min-w-[100dvw] xl:min-w-[90dvw] xl:m-auto">
      <ResizableLayer
        aside={
          <aside className="rounded-2xl bg-card p-4 shadow-md border-1">
            <h2 className="text-lg font-semibold !my-3">Trip Overview</h2>

            <nav className="space-y-3">
              {asideContent.map((day, idx) => (
                <details
                  key={day.anchor}
                  open={idx === 0}
                  className="rounded-lg bg-accent/20 hover:bg-accent/50 transition"
                >
                  <summary className="cursor-pointer px-3 py-2 font-medium">
                    <a href={`#${day.anchor}`} className="no-underline hover:underline text-sm">
                      {day.title}
                    </a>
                  </summary>

                  <ul className="px-4 pb-2 text-sm space-y-1 list-disc list-inside">
                    {day.places.map((place, idx_2) => (
                      <li key={idx_2}>
                        <a
                          href={buildGoogleMapsLink(place, trip.city, trip.country)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>{place}</strong>
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>
          </aside>
        }
      >
        <article className="">
          <h1>{trip.articleTitle}</h1>

          <h3>{trip.tripSummary}</h3>

          {trip.days.map((day) => (
            <section key={day.dayNumber}>
              <header>
                <h2 id={day.dayNumber.toString()}>
                  Day {day.dayNumber}: {day.theme}
                </h2>
                <p>
                  <em>{day.summary}</em>
                </p>
              </header>

              <h3>Morning</h3>
              <ul>
                {day.morning.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink(act.name, trip.city, trip.country)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <h3>Afternoon</h3>
              <ul>
                {day.afternoon.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink(act.name, trip.city, trip.country)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <h3>Evening</h3>
              <ul>
                {day.evening.map((act, i) => (
                  <li key={i}>
                    <a
                      href={buildGoogleMapsLink(act.name, trip.city, trip.country)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{act.name}</strong>
                    </a>
                    ({act.budget}) — {act.description}
                  </li>
                ))}
              </ul>

              <aside>
                <h4>Insider Tips</h4>
                <ul>
                  {day.insiderTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
                <p>
                  <strong>Hidden Gem:</strong> {day.hiddenGem}
                </p>
              </aside>
            </section>
          ))}

          <h2>Conclusion</h2>
          <p>{trip.tripConclusion}</p>
        </article>
      </ResizableLayer>
    </main>
  );
}
