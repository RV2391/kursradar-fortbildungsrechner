
import { calculateNearestInstitute } from '../dentalInstitutes';
import {
  calculateAnnualCMERequirements,
  TYPICAL_TRADITIONAL_UNIT,
  TYPICAL_ONLINE_UNIT
} from '../cmeCalculations';
import { CalculationInputs } from './types';
import type { Results, TimeSavings, TimeSavingsDetails, NearestInstitute } from '../../types';
import { calculateExtendedTimeSavings, type ExtendedTimeSavings } from './extendedTimeSavingsCalculations';
import { calculateOptimizedCosts, calculateTravelCosts } from './costCalculations';
import {
  DENTIST_ANNUAL_COST,
  ASSISTANT_ANNUAL_COST,
  ASSISTANTS_PER_CAR,
  DENTIST_HOURLY_RATE,
  ASSISTANT_HOURLY_RATE,
  PREPARATION_TIME
} from './constants';

// Extended results interface with time savings
export interface ExtendedResults extends Results {
  extendedTimeSavings?: ExtendedTimeSavings;
}

// Re-export NearestInstitute so consumers can import from '@/utils/calculations'
export type { NearestInstitute } from '../../types';

const calculateTimeSavings = (
  dentists: number,
  assistants: number,
  travelTimeMinutes: number,
  traditionalDentistCME: any,
  traditionalAssistantCME: any
): TimeSavings => {
  const travelTimeHours = travelTimeMinutes / 60;
  
  // Konservative Berechnung: 5 Stunden pro Session (statt 8)
  const dentistTimePerSession = {
    trainingHours: 5, // Realistischere Dauer
    travelHours: travelTimeHours,
    prepHours: PREPARATION_TIME,
    totalHours: 5 + travelTimeHours + PREPARATION_TIME
  };

  const assistantTimePerSession = {
    trainingHours: 5, // Realistischere Dauer
    travelHours: travelTimeHours,
    prepHours: PREPARATION_TIME,
    totalHours: 5 + travelTimeHours + PREPARATION_TIME
  };

  const totalDentistHours = dentistTimePerSession.totalHours * traditionalDentistCME.requiredSessions * dentists;
  const totalAssistantHours = assistantTimePerSession.totalHours * traditionalAssistantCME.requiredSessions * assistants;
  
  // Praxisausfall-Faktor anwenden (60% der Fortbildungen führen zu echtem Ausfall)
  const PRACTICE_IMPACT_FACTOR = 0.6;
  const adjustedDentistHours = totalDentistHours * PRACTICE_IMPACT_FACTOR;
  const adjustedAssistantHours = totalAssistantHours * PRACTICE_IMPACT_FACTOR;
  
  const dentistMonetaryValue = adjustedDentistHours * DENTIST_HOURLY_RATE;
  const assistantMonetaryValue = adjustedAssistantHours * ASSISTANT_HOURLY_RATE;

  const totalTravelHours = travelTimeHours * 
    (traditionalDentistCME.requiredSessions * dentists + 
     traditionalAssistantCME.requiredSessions * Math.ceil(assistants / ASSISTANTS_PER_CAR)) *
    PRACTICE_IMPACT_FACTOR; // Auch Reisezeit konservativ berechnen

  const details: TimeSavingsDetails = {
    perSession: {
      dentist: dentistTimePerSession,
      assistant: assistantTimePerSession
    },
    monetaryValues: {
      dentist: dentistMonetaryValue,
      assistant: assistantMonetaryValue
    }
  };

  return {
    totalHoursPerYear: adjustedDentistHours + adjustedAssistantHours,
    totalMonetaryValue: dentistMonetaryValue + assistantMonetaryValue,
    dentistHours: adjustedDentistHours,
    assistantHours: adjustedAssistantHours,
    travelHours: totalTravelHours,
    details
  };
};

export const calculateResults = async (inputs: CalculationInputs): Promise<ExtendedResults> => {
  const assistants = inputs.teamSize - inputs.dentists;
  
  const traditionalDentistCME = calculateAnnualCMERequirements(
    true, 
    TYPICAL_TRADITIONAL_UNIT.duration,
    TYPICAL_TRADITIONAL_UNIT.hasExercises,
    TYPICAL_TRADITIONAL_UNIT.hasTest
  );
  
  const traditionalAssistantCME = calculateAnnualCMERequirements(
    false,
    TYPICAL_TRADITIONAL_UNIT.duration,
    TYPICAL_TRADITIONAL_UNIT.hasExercises,
    TYPICAL_TRADITIONAL_UNIT.hasTest
  );

  const traditionalCostsDentists = inputs.dentists * DENTIST_ANNUAL_COST;
  const traditionalCostsAssistants = assistants * ASSISTANT_ANNUAL_COST;

  let nearestInstitute;
  let timeSavings;
  let extendedTimeSavings;

  if (inputs.practiceLat && inputs.practiceLng) {
    const nearest = await calculateNearestInstitute(inputs.practiceLat, inputs.practiceLng);
    
    try {
      const service = new google.maps.DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [{ lat: inputs.practiceLat, lng: inputs.practiceLng }],
        destinations: [{ lat: nearest.coordinates.lat, lng: nearest.coordinates.lng }],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      });

      if (result.rows[0]?.elements[0]?.status === "OK") {
        const element = result.rows[0].elements[0];
        
        const directionsService = new google.maps.DirectionsService();
        const directionsResult = await directionsService.route({
          origin: { lat: inputs.practiceLat, lng: inputs.practiceLng },
          destination: { lat: nearest.coordinates.lat, lng: nearest.coordinates.lng },
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          optimizeWaypoints: true
        });

        let shortestRoute = directionsResult.routes[0];
        let shortestDistance = Number.MAX_VALUE;
        let shortestDuration = Number.MAX_VALUE;

        directionsResult.routes.forEach(route => {
          const distance = route.legs[0].distance.value;
          if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestDuration = route.legs[0].duration.value;
            shortestRoute = route;
          }
        });

        const oneWayDistance = shortestDistance / 1000;
        const oneWayTime = shortestDuration / 60;
        
        const roundTripDistance = oneWayDistance * 2;
        const roundTripTime = oneWayTime * 2;

        const dentistTrips = traditionalDentistCME.requiredSessions;
        const assistantGroups = Math.ceil(assistants / ASSISTANTS_PER_CAR);
        const assistantTrips = traditionalAssistantCME.requiredSessions * assistantGroups;
        
        const travelCosts = calculateTravelCosts(roundTripDistance, dentistTrips, assistantTrips);

        nearestInstitute = {
          name: nearest.name,
          oneWayDistance: oneWayDistance,
          distance: roundTripDistance,
          oneWayTravelTime: oneWayTime,
          travelTime: roundTripTime,
          travelCosts: Math.round(travelCosts)
        };

        timeSavings = calculateTimeSavings(
          inputs.dentists,
          assistants,
          roundTripTime,
          traditionalDentistCME,
          traditionalAssistantCME
        );

        // Calculate extended time savings
        extendedTimeSavings = calculateExtendedTimeSavings(
          inputs.dentists,
          assistants,
          roundTripTime,
          traditionalDentistCME,
          traditionalAssistantCME
        );
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  }

  const totalTraditionalCosts = traditionalCostsDentists + traditionalCostsAssistants +
    (nearestInstitute?.travelCosts || 0);

  const { optimizedCosts, breakdown } = calculateOptimizedCosts(totalTraditionalCosts);

  const savings = totalTraditionalCosts - optimizedCosts;
  const savingsPercentage = totalTraditionalCosts > 0
    ? (savings / totalTraditionalCosts) * 100
    : 0;

  return {
    traditionalCostsDentists,
    traditionalCostsAssistants,
    totalTraditionalCosts,
    optimizedCosts,
    savings,
    savingsPercentage,
    nearestInstitute,
    timeSavings,
    optimizationBreakdown: breakdown,
    extendedTimeSavings
  } as ExtendedResults;
};

// Re-export helpers from costCalculations so consumers can keep importing from '@/utils/calculations'
export { formatCurrency } from './costCalculations';

// Export types for use in components
export type { CalculationInputs } from './types';
export type { Results } from '../../types';
export type { ExtendedTimeSavings } from './extendedTimeSavingsCalculations';
