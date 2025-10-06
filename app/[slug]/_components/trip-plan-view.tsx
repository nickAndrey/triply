'use client';

import { ResizableLayer } from '@/app/[slug]/_components/resizable-layer';
import { TravelLoader } from '@/app/_components/travel-loader';
import { useSupabaseSubscriptionContext } from '@/app/_providers/supabase-subscriptions/supabase-subscriptions-context';
import { TravelItineraryRow } from '@/app/_types/supabase-update-payload';
import { useEffect } from 'react';

type Props = {
  dbRow: TravelItineraryRow;
};

export function TripPlanView({ dbRow }: Props) {
  const { subscriberStatus, tripId } = useSupabaseSubscriptionContext();

  const isSameTrip = dbRow.id === tripId;
  const isLive = subscriberStatus !== 'completed' && subscriberStatus !== 'idle';

  const trip = isLive && isSameTrip ? dbRow.trip_plan_details : dbRow.trip_plan_details;

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

          {isLive ? (
            <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 p-2 rounded-2xl">
              <TravelLoader size={100} />
              <div className="flex flex-col gap-1">
                <p className="text-primary font-medium !my-0">Your adventure is still unfolding...</p>
                <p className="text-sm text-muted-foreground !my-0">
                  New days are being added in real time — stay tuned as your journey takes shape!
                </p>
              </div>
            </div>
          ) : (
            <section className="mt-10 space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Conclusion</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{trip.tripConclusion}</p>
            </section>
          )}
        </article>
      </ResizableLayer>
    </main>
  );
}
