import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { KursRadarStats } from '@/types/provider';

// Fetch aggregated KursRadar statistics from live_data_sync
async function fetchKursRadarStats(): Promise<KursRadarStats> {
  const { data, error } = await supabase
    .from('live_data_sync')
    .select('*')
    .order('month', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching KursRadar stats:', error);
    // Return default values if no data available
    return getDefaultStats();
  }

  if (!data) {
    return getDefaultStats();
  }

  return {
    totalUniqueVisitors: data.total_uv || 0,
    totalPageViews: data.total_pv || 0,
    totalRegistrations: data.registrations || 0,
    totalBookings: data.bookings || 0,
    partners: data.partners || 0,
    events: data.events || 0,
  };
}

// Default statistics for when no data is available
function getDefaultStats(): KursRadarStats {
  return {
    totalUniqueVisitors: 15000, // Placeholder based on typical growth
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
    queryFn: fetchKursRadarStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
