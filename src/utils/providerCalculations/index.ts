import type { 
  ProviderInputs, 
  ProviderResults, 
  KursRadarStats,
  ReachAnalysis,
  ROICalculation,
  PriceRecommendation 
} from '@/types/provider';
import { DENTAL_BENCHMARKS } from '@/types/provider';

// Calculate reach analysis based on KursRadar stats and provider inputs
function calculateReach(
  inputs: ProviderInputs, 
  stats: KursRadarStats
): ReachAnalysis {
  // Regional multiplier based on postal code (simplified - could be expanded)
  const postalPrefix = inputs.postalCode.substring(0, 2);
  const regionalMultiplier = getRegionalMultiplier(postalPrefix);
  
  // Estimate potential reach based on total platform visitors
  const baseReach = stats.totalUniqueVisitors * regionalMultiplier;
  const categoryBoost = 1 + (inputs.categories.length * 0.05); // More categories = more visibility
  
  const potentialReach = Math.round(baseReach * categoryBoost);
  const estimatedViews = Math.round(potentialReach * inputs.coursesPerYear * 0.1);
  const estimatedClicks = Math.round(estimatedViews * DENTAL_BENCHMARKS.clickThroughRate);
  
  return {
    potentialReach,
    estimatedViews,
    estimatedClicks,
    regionalMultiplier,
  };
}

// Get regional multiplier based on postal code prefix (German postal system)
function getRegionalMultiplier(postalPrefix: string): number {
  // Major metropolitan areas get higher multipliers
  const metropolitanAreas: Record<string, number> = {
    '10': 1.3, '12': 1.3, '13': 1.3, // Berlin
    '80': 1.4, '81': 1.4, // München
    '20': 1.2, '21': 1.2, '22': 1.2, // Hamburg
    '50': 1.2, '51': 1.2, // Köln
    '60': 1.25, '61': 1.25, // Frankfurt
    '40': 1.15, '41': 1.15, // Düsseldorf
    '70': 1.2, '71': 1.2, // Stuttgart
  };
  
  return metropolitanAreas[postalPrefix] || 1.0;
}

// Calculate ROI based on provider inputs and KursRadar stats
function calculateROI(
  inputs: ProviderInputs,
  stats: KursRadarStats,
  reach: ReachAnalysis
): ROICalculation {
  // Current revenue calculation
  const currentOccupancyRate = inputs.averageOccupancy / 100;
  const currentParticipantsPerCourse = Math.round(inputs.maxParticipants * currentOccupancyRate);
  const currentRevenue = inputs.coursesPerYear * currentParticipantsPerCourse * inputs.averagePrice;
  
  // Estimated additional participants from KursRadar
  const estimatedBookings = Math.round(reach.estimatedClicks * DENTAL_BENCHMARKS.conversionRate);
  const additionalParticipants = Math.min(
    estimatedBookings,
    // Cap at remaining capacity
    inputs.coursesPerYear * (inputs.maxParticipants - currentParticipantsPerCourse)
  );
  
  // Revenue calculations
  const additionalRevenue = additionalParticipants * inputs.averagePrice;
  const kursRadarCommission = additionalRevenue * DENTAL_BENCHMARKS.commissionRate;
  const netBenefit = additionalRevenue - kursRadarCommission;
  
  // ROI calculation
  const roiPercentage = kursRadarCommission > 0 
    ? ((netBenefit / kursRadarCommission) * 100) 
    : 0;
  
  // Break-even in months (simplified - assumes commission as only cost)
  const monthlyBenefit = netBenefit / 12;
  const breakEvenMonths = monthlyBenefit > 0 ? Math.ceil(kursRadarCommission / monthlyBenefit) : 0;
  
  return {
    currentRevenue,
    additionalParticipants,
    additionalRevenue,
    kursRadarCommission,
    netBenefit,
    roiPercentage: Math.round(roiPercentage),
    breakEvenMonths: Math.min(breakEvenMonths, 12), // Cap at 12 months
  };
}

// Calculate price recommendation based on industry benchmarks
function calculatePriceRecommendation(inputs: ProviderInputs): PriceRecommendation {
  const industryAverage = DENTAL_BENCHMARKS.averageCoursePrice;
  const currentPrice = inputs.averagePrice;
  
  // Determine price position
  let pricePosition: 'below' | 'average' | 'above';
  const priceDiff = currentPrice - industryAverage;
  const threshold = industryAverage * 0.15; // 15% threshold
  
  if (priceDiff < -threshold) {
    pricePosition = 'below';
  } else if (priceDiff > threshold) {
    pricePosition = 'above';
  } else {
    pricePosition = 'average';
  }
  
  // Calculate recommended price (nudge towards industry average with some buffer)
  let recommendedPrice: number;
  if (pricePosition === 'below') {
    // Suggest increasing, but not too aggressively
    recommendedPrice = Math.round(currentPrice * 1.1);
  } else if (pricePosition === 'above') {
    // High prices are fine if quality matches - slight reduction suggestion
    recommendedPrice = Math.round(currentPrice * 0.95);
  } else {
    recommendedPrice = currentPrice;
  }
  
  // Optimization potential (how much more revenue if priced optimally)
  const optimalOccupancy = 0.85; // Target 85% occupancy
  const currentOccupancy = inputs.averageOccupancy / 100;
  const occupancyGap = optimalOccupancy - currentOccupancy;
  const optimizationPotential = Math.max(0, Math.round(
    occupancyGap * inputs.maxParticipants * inputs.coursesPerYear * inputs.averagePrice
  ));
  
  return {
    currentPrice,
    industryAverage,
    recommendedPrice,
    pricePosition,
    optimizationPotential,
  };
}

// Main calculation function
export async function calculateProviderResults(
  inputs: ProviderInputs,
  stats: KursRadarStats
): Promise<ProviderResults> {
  const reach = calculateReach(inputs, stats);
  const roi = calculateROI(inputs, stats, reach);
  const priceRecommendation = calculatePriceRecommendation(inputs);
  
  return {
    reach,
    roi,
    priceRecommendation,
    stats,
  };
}

// Format currency helper
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage helper
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}
