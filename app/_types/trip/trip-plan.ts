import { TripCore } from './trip-core';
import { Day } from './trip-day';

export type TripPlan = {
  core: TripCore;
  days: Day[];
};
