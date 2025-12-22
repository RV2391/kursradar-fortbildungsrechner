// Provider Calculator Types

export type RegionId = 'dach' | 'germany' | 'north' | 'east' | 'west' | 'south' | 'austria' | 'switzerland' | 'local';

export interface Region {
  id: RegionId;
  name: string;
  multiplier: number;
  description: string;
}

export const REGIONS: Record<RegionId, Region> = {
  dach: { 
    id: 'dach', 
    name: 'DACH (D-A-CH)', 
    multiplier: 1.0, 
    description: 'Deutschland, Österreich, Schweiz' 
  },
  germany: { 
    id: 'germany', 
    name: 'Ganz Deutschland', 
    multiplier: 0.75, 
    description: 'Alle Bundesländer' 
  },
  north: { 
    id: 'north', 
    name: 'Nord-Deutschland', 
    multiplier: 0.2, 
    description: 'SH, HH, NI, HB, MV' 
  },
  east: { 
    id: 'east', 
    name: 'Ost-Deutschland', 
    multiplier: 0.2, 
    description: 'BE, BB, SN, ST, TH' 
  },
  west: { 
    id: 'west', 
    name: 'West-Deutschland', 
    multiplier: 0.35, 
    description: 'NRW, HE, RP, SL' 
  },
  south: { 
    id: 'south', 
    name: 'Süd-Deutschland', 
    multiplier: 0.3, 
    description: 'BY, BW' 
  },
  austria: { 
    id: 'austria', 
    name: 'Österreich', 
    multiplier: 0.15, 
    description: 'Alle Bundesländer' 
  },
  switzerland: { 
    id: 'switzerland', 
    name: 'Schweiz', 
    multiplier: 0.1, 
    description: 'Alle Kantone' 
  },
  local: { 
    id: 'local', 
    name: 'Lokal / Eine Stadt', 
    multiplier: 0.08, 
    description: 'Nur eine Stadt oder Region' 
  },
};

export interface ProviderInputs {
  coursesPerYear: number;
  averagePrice: number;
  maxParticipants: number;
  averageOccupancy: number; // percentage 0-100
  region: RegionId;
  localArea?: string;
  categories: string[];
  hardToFillCourses?: string;
}

export interface KursRadarStats {
  totalUniqueVisitors: number;
  totalPageViews: number;
  totalRegistrations: number;
  totalBookings: number;
  partners: number;
  events: number;
}

export interface CalculationExplanation {
  formula: string;
  values: { label: string; value: string }[];
  assumptions: string[];
}

export interface ReachAnalysis {
  potentialReach: number;
  estimatedViews: number;
  estimatedClicks: number;
  regionalMultiplier: number;
  regionName: string;
  explanation: CalculationExplanation;
}

export interface ROICalculation {
  currentRevenue: number;
  additionalParticipants: number;
  additionalRevenue: number;
  kursRadarCommission: number;
  netBenefit: number;
  roiPercentage: number;
  breakEvenMonths: number;
  explanation: CalculationExplanation;
}

export interface PriceRecommendation {
  currentPrice: number;
  industryAverage: number;
  recommendedPrice: number;
  pricePosition: 'below' | 'average' | 'above';
  optimizationPotential: number;
  explanation: CalculationExplanation;
}

export interface ProviderResults {
  reach: ReachAnalysis;
  roi: ROICalculation;
  priceRecommendation: PriceRecommendation;
  stats: KursRadarStats;
}

// Dental industry course categories
export const DENTAL_CATEGORIES = [
  'Prophylaxe',
  'Implantologie', 
  'Endodontie',
  'Parodontologie',
  'Kieferorthopädie',
  'Oralchirurgie',
  'Ästhetische Zahnmedizin',
  'Kinderzahnheilkunde',
  'Abrechnung',
  'Praxismanagement',
  'Hygiene',
  'Röntgen',
  'Notfallmanagement',
  'Kommunikation',
  'Digitale Zahnmedizin',
] as const;

// Industry benchmarks for dental training (based on research)
export const DENTAL_BENCHMARKS = {
  averageCoursePrice: 250, // EUR
  averageParticipants: 15,
  averageOccupancy: 70, // percentage
  commissionRate: 0.05, // 5%
  conversionRate: 0.03, // 3% of views convert to bookings
  clickThroughRate: 0.08, // 8% of views result in clicks
} as const;
