import type { 
  ProviderInputs, 
  ProviderResults, 
  KursRadarStats,
  ReachAnalysis,
  ROICalculation,
  PriceRecommendation,
  CalculationExplanation
} from '@/types/provider';
import { DENTAL_BENCHMARKS, REGIONS } from '@/types/provider';

// Calculate reach analysis based on KursRadar stats and provider inputs
function calculateReach(
  inputs: ProviderInputs, 
  stats: KursRadarStats
): ReachAnalysis {
  const region = REGIONS[inputs.region];
  const regionalMultiplier = region.multiplier;
  
  // Estimate potential reach based on total platform visitors
  const baseReach = stats.totalUniqueVisitors * regionalMultiplier;
  const categoryBoost = 1 + (inputs.categories.length * 0.05); // More categories = more visibility
  
  const potentialReach = Math.round(baseReach * categoryBoost);
  const estimatedViews = Math.round(potentialReach * inputs.coursesPerYear * 0.1);
  const estimatedClicks = Math.round(estimatedViews * DENTAL_BENCHMARKS.clickThroughRate);
  
  const explanation: CalculationExplanation = {
    formula: 'Monatliche Besucher × Regionsanteil × Kategorie-Boost × Kurse × Sichtbarkeitsfaktor',
    values: [
      { label: 'Monatliche Besucher', value: stats.totalUniqueVisitors.toLocaleString('de-DE') },
      { label: 'Regionsanteil', value: `${(regionalMultiplier * 100).toFixed(0)}% (${region.name})` },
      { label: 'Kategorie-Boost', value: `${((categoryBoost - 1) * 100).toFixed(0)}% (${inputs.categories.length} Kategorien)` },
      { label: 'Kurse pro Jahr', value: inputs.coursesPerYear.toString() },
      { label: 'Sichtbarkeitsfaktor', value: '10% (konservativ)' },
      { label: 'Klickrate (CTR)', value: `${(DENTAL_BENCHMARKS.clickThroughRate * 100).toFixed(0)}%` },
    ],
    assumptions: [
      'Die Reichweite basiert auf aktuellen Plattform-Statistiken',
      'Der Regionsanteil entspricht der Verteilung der Zahnarztpraxen',
      'Die Klickrate von 8% ist ein Branchendurchschnitt',
    ],
  };
  
  return {
    potentialReach,
    estimatedViews,
    estimatedClicks,
    regionalMultiplier,
    regionName: region.name,
    explanation,
  };
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
  
  const explanation: CalculationExplanation = {
    formula: 'Zusätzliche Buchungen × Kurspreis - KursRadar Provision (5%)',
    values: [
      { label: 'Erwartete Klicks', value: reach.estimatedClicks.toLocaleString('de-DE') },
      { label: 'Konversionsrate', value: `${(DENTAL_BENCHMARKS.conversionRate * 100).toFixed(0)}%` },
      { label: 'Geschätzte Buchungen', value: estimatedBookings.toString() },
      { label: 'Zusätzliche Teilnehmer', value: additionalParticipants.toString() },
      { label: 'Kurspreis', value: formatCurrency(inputs.averagePrice) },
      { label: 'Provision', value: `${(DENTAL_BENCHMARKS.commissionRate * 100).toFixed(0)}%` },
    ],
    assumptions: [
      'Die Konversionsrate von 3% basiert auf Erfahrungswerten ähnlicher Plattformen',
      'Nur zusätzliche Buchungen werden provisionspflichtig',
      'Die Teilnehmerzahl ist auf die verfügbare Kapazität begrenzt',
    ],
  };
  
  return {
    currentRevenue,
    additionalParticipants,
    additionalRevenue,
    kursRadarCommission,
    netBenefit,
    roiPercentage: Math.round(roiPercentage),
    breakEvenMonths: Math.min(breakEvenMonths, 12), // Cap at 12 months
    explanation,
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
  
  const priceDiffPercent = ((currentPrice - industryAverage) / industryAverage * 100).toFixed(0);
  
  const explanation: CalculationExplanation = {
    formula: 'Vergleich mit Branchendurchschnitt + Auslastungsoptimierung',
    values: [
      { label: 'Ihr Kurspreis', value: formatCurrency(currentPrice) },
      { label: 'Branchenschnitt', value: formatCurrency(industryAverage) },
      { label: 'Differenz', value: `${priceDiffPercent}%` },
      { label: 'Aktuelle Auslastung', value: `${inputs.averageOccupancy}%` },
      { label: 'Ziel-Auslastung', value: '85%' },
    ],
    assumptions: [
      'Die Branchendaten basieren auf Durchschnittswerten der Dentalbranche',
      'Höhere Preise können bei entsprechender Qualität gerechtfertigt sein',
      'Eine Auslastung von 85% gilt als optimal',
    ],
  };
  
  return {
    currentPrice,
    industryAverage,
    recommendedPrice,
    pricePosition,
    optimizationPotential,
    explanation,
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