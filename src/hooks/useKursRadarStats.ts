import { useQuery } from '@tanstack/react-query';
import type { KursRadarStats } from '@/types/provider';

// Default statistics (used until live data sync is connected)
function getDefaultStats(): KursRadarStats {
  return {
    totalUniqueVisitors: 15000,
    totalPageViews: 45000,
    totalRegistrations: 1200,
    totalBookings: 350,
    partners: 50,
    events: 200,
  };
}

export function useKursRadarStats() {
  return useQuery({
    queryKey: ['kursradar-stats'],
    queryFn: async () => getDefaultStats(),
    staleTime: Infinity,
  });
}
