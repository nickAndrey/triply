type Args = {
  place: string;
  city: string;
  country: string;
};

export function buildGoogleMapsLink({ place, city, country }: Args) {
  const cleanedUpPlace = place.replace(/\s*\([^)]*\)/g, '').trim();
  const query = encodeURIComponent(`${cleanedUpPlace} ${city} ${country}`);

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
