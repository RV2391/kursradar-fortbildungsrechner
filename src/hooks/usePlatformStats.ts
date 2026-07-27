import { useEffect, useState } from 'react';

/**
 * Live-Zahlen fuer den Rechner-Reason-Why: aktueller Anteil kostenloser/
 * gesponsorter Kurse in der KursRadar-Content-DB.
 *
 * Endpoint: platform-stats Edge Function auf der Live-Content-DB
 * (jdeiievsddozskkdsony), via VITE_PLATFORM_STATS_URL konfiguriert.
 *
 * Falls die URL fehlt oder die Function nicht antwortet, faellt der Hook
 * still auf statische Konstanten zurueck (fallback ist Wahrheit vom
 * 2026-07-27: 39 von 452 kommenden Kursen = 8,6 %).
 */

export interface PlatformStats {
  free_or_sponsored_count: number;
  total_upcoming_count: number;
  free_or_sponsored_pct: number;
  price_optimization_factor: number;
  price_optimization_note: string;
  earliest_start_date: string | null;
  latest_start_date: string | null;
  computed_at: string;
  state_code: string | null;
  is_fallback: boolean;
}

const FALLBACK: PlatformStats = {
  free_or_sponsored_count: 39,
  total_upcoming_count: 452,
  free_or_sponsored_pct: 0.086,
  price_optimization_factor: 0.15,
  price_optimization_note: 'Konservativer Naehrungswert (Fallback ohne Live-Query).',
  earliest_start_date: null,
  latest_start_date: null,
  computed_at: '2026-07-27',
  state_code: null,
  is_fallback: true,
};

// Modul-weites In-Memory-Cache, damit paralleles Rendern nicht mehrmals fetcht
let memoryCache: { stats: PlatformStats; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const usePlatformStats = (stateCode?: string): { stats: PlatformStats; loading: boolean } => {
  const [stats, setStats] = useState<PlatformStats>(memoryCache?.stats ?? FALLBACK);
  const [loading, setLoading] = useState<boolean>(!memoryCache);

  useEffect(() => {
    const now = Date.now();
    if (memoryCache && now - memoryCache.fetchedAt < CACHE_TTL_MS) {
      setStats(memoryCache.stats);
      setLoading(false);
      return;
    }

    const baseUrl = import.meta.env.VITE_PLATFORM_STATS_URL as string | undefined;
    if (!baseUrl) {
      // Kein Endpoint konfiguriert (dev-Setup oder pre-deploy). Fallback nutzen.
      setStats(FALLBACK);
      setLoading(false);
      return;
    }

    const url = stateCode ? `${baseUrl}?state=${encodeURIComponent(stateCode)}` : baseUrl;

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`platform-stats HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const enriched: PlatformStats = { ...data, is_fallback: false };
        memoryCache = { stats: enriched, fetchedAt: now };
        setStats(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('usePlatformStats fetch failed, using fallback:', err);
        setStats(FALLBACK);
        setLoading(false);
      });
  }, [stateCode]);

  return { stats, loading };
};
