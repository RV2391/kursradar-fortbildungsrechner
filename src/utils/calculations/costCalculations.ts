import {
  COST_PER_KM,
  ASSISTANTS_PER_CAR,
  FREE_COURSE_PERCENTAGE,
  PRICE_OPTIMIZATION_FACTOR,
  RESEARCH_TIME_SAVED_HOURS,
  KURSRADAR_PLATFORM_COST,
} from './constants';
import type { OptimizationBreakdown } from '../../types';

/**
 * Optimierte Kosten mit KursRadar (kostenlose Plattform-Nutzung fuer Praxen).
 *
 * Ersparnis kommt aus zwei Quellen:
 * 1. Kostenlose/gesponsorte Kurse (FREE_COURSE_PERCENTAGE der traditionellen Kosten fallen weg)
 * 2. Preisoptimierung durch Transparenz (PRICE_OPTIMIZATION_FACTOR auf den Rest)
 *
 * Beide Faktoren sind aktuell Konstanten. Ab A-P0-3 werden sie aus der
 * platform-stats Edge Function dynamisch aus der Live-Content-DB berechnet.
 */
export const calculateOptimizedCosts = (
  traditionalCosts: number
): { optimizedCosts: number; breakdown: OptimizationBreakdown } => {
  const freeCoursesSavings = traditionalCosts * FREE_COURSE_PERCENTAGE;
  const remainingCosts = traditionalCosts - freeCoursesSavings;
  const priceOptimizationSavings = remainingCosts * PRICE_OPTIMIZATION_FACTOR;
  const platformCost = KURSRADAR_PLATFORM_COST;

  const optimizedCosts = traditionalCosts - freeCoursesSavings - priceOptimizationSavings + platformCost;

  return {
    optimizedCosts: Math.round(optimizedCosts),
    breakdown: {
      freeCoursesSavings: Math.round(freeCoursesSavings),
      priceOptimizationSavings: Math.round(priceOptimizationSavings),
      researchTimeSaved: RESEARCH_TIME_SAVED_HOURS,
      platformCost,
    },
  };
};

export const calculateTravelCosts = (distance: number, dentists: number, assistants: number): number => {
  const dentistsCosts = distance * COST_PER_KM * dentists;
  const assistantGroups = Math.ceil(assistants / ASSISTANTS_PER_CAR);
  const assistantsCosts = distance * COST_PER_KM * assistantGroups;

  return Math.round(dentistsCosts + assistantsCosts);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
