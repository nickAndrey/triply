import z from 'zod';

import { useTripPlanFormSteps } from '@components/trip-plan-form-steps/hooks/use-trip-plan-form-steps';

export type TravelItineraryForm = z.infer<ReturnType<typeof useTripPlanFormSteps>['mergedFormsShapes']> & {};
