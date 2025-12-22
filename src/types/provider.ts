// Provider Calculator Types

export interface ProviderInputs {
  coursesPerYear: number;
  averagePrice: number;
  maxParticipants: number;
  averageOccupancy: number; // percentage 0-100
  postalCode: string;
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

export interface ReachAnalysis {
  potentialReach: number;
  estimatedViews: number;
  estimatedClicks: number;
  regionalMultiplier: number;
}

export interface ROICalculation {
  currentRevenue: number;
  additionalParticipants: number;
  additionalRevenue: number;
  kursRadarCommission: number;
  netBenefit: number;
  roiPercentage: number;
  breakEvenMonths: number;
}

export interface PriceRecommendation {
  currentPrice: number;
  industryAverage: number;
  recommendedPrice: number;
  pricePosition: 'below' | 'average' | 'above';
  optimizationPotential: number;
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
