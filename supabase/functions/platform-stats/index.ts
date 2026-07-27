// Supabase Edge Function: platform-stats
//
// Liefert Live-Zahlen aus der KursRadar-Content-DB fuer den Fortbildungskosten-
// Rechner. Ersetzt die alten Hardcoded-Claims (30 % kostenlos, 15 % Preis-
// optimierung) durch tatsaechliche Ist-Werte.
//
// Deploy-Target: Live-Content-DB `jdeiievsddozskkdsony` (via Dennis-Ticket).
// NICHT gegen die Rechner-Sales-CRM-Instanz jkandfizerwyimccwrov deployen.
//
// Cache: in-memory pro Function-Instance, 24 h TTL.
// CORS: offen fuer rechner.kurs-radar.com und www.kurs-radar.com.
//
// Endpoints:
//   GET  /platform-stats              -> globale Zahlen
//   GET  /platform-stats?state=NW     -> optional Bundesland-scoped
//                                       (nutzt spaeter D2-View
//                                        event_bildungsurlaub_summary,
//                                        aktuell Fallback = globale Werte)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=86400',
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface PlatformStats {
  free_or_sponsored_count: number;
  total_upcoming_count: number;
  free_or_sponsored_pct: number;
  price_optimization_factor: number;
  price_optimization_note: string;
  earliest_start_date: string | null;
  latest_start_date: string | null;
  computed_at: string;
  state_code: string | null;
}

let cache: { data: PlatformStats; fetchedAt: number; state: string | null } | null = null;

async function computeStats(
  supabaseUrl: string,
  supabaseKey: string,
  stateCode: string | null,
): Promise<PlatformStats> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Basis-Filter fuer kommende, veroeffentlichte, sichtbare, nicht-geloeschte Kurse.
  // Wenn stateCode gesetzt: nur Kurse in diesem Bundesland (Naeherung ueber events.state).
  let query = supabase
    .from('events')
    .select('id, price_cents, is_industry_sponsored, start_date, state', { count: 'exact' })
    .gte('start_date', new Date().toISOString().slice(0, 10))
    .eq('status', 'published')
    .eq('is_visible', true)
    .is('deleted_at', null);

  if (stateCode) {
    query = query.eq('state', stateCode);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const total = count ?? data?.length ?? 0;
  const rows = data ?? [];

  const freeOrSponsored = rows.filter(
    (r) => r.price_cents === 0 || r.price_cents === null || r.is_industry_sponsored === true,
  ).length;

  const pct = total > 0 ? Math.round((100 * freeOrSponsored) / total) / 100 : 0;

  // Preisspreizung: kommt in einer Folge-Iteration. Aktuell konservativer
  // Default 15 %, aber mit klarer note-Kennzeichnung, dass es noch nicht
  // dynamisch berechnet wird. Frontend darf entscheiden, ob es diesen Claim
  // ueberhaupt zeigt.
  const priceOptimizationFactor = 0.15;

  const startDates = rows.map((r) => r.start_date).filter(Boolean).sort() as string[];

  return {
    free_or_sponsored_count: freeOrSponsored,
    total_upcoming_count: total,
    free_or_sponsored_pct: pct,
    price_optimization_factor: priceOptimizationFactor,
    price_optimization_note:
      'Konservativer Naehrungswert. Dynamische Preisspreizungs-Berechnung folgt in P1.',
    earliest_start_date: startDates.length > 0 ? startDates[0] : null,
    latest_start_date: startDates.length > 0 ? startDates[startDates.length - 1] : null,
    computed_at: new Date().toISOString(),
    state_code: stateCode,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const stateCode = url.searchParams.get('state');

    // Cache-Hit? Beruecksichtigt state-Parameter (unterschiedliche Cache-Keys).
    const now = Date.now();
    if (cache && cache.state === stateCode && now - cache.fetchedAt < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cache.data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const stats = await computeStats(supabaseUrl, supabaseKey, stateCode);
    cache = { data: stats, fetchedAt: now, state: stateCode };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('❌ platform-stats error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
