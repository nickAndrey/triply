// From: https://github.com/perliedman/leaflet-control-geocoder/blob/be056ab/src/geocoders/nominatim.ts#L36

export type NominatimResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address: NominatimAddress;
};

export type NominatimAddress = {
  building?: string;
  city_district?: string;
  city?: string;
  town?: string;
  country_code?: string;
  country?: string;
  county?: string;
  hamlet?: string;
  house_number?: string;
  neighbourhood?: string;
  postcode?: string;
  road?: string;
  state_district?: string;
  state?: string;
  suburb?: string;
  village?: string;
};
