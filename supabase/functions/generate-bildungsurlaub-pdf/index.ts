// Supabase Edge Function: generate-bildungsurlaub-pdf
//
// Rendert das 1-Seiten-Bildungsurlaub-PDF fuer den Lead-Magnet-Flow.
// Wird vom n8n-Workflow `bildungsurlaub_lead_magnet_pdf` aufgerufen.
//
// Deploy-Target: Rechner-Supabase `jkandfizerwyimccwrov` (kein Dennis noetig).
// Stack: Deno + pdf-lib via esm.sh (schlank, deno-nativ, kein React-Overhead).
//
// Input (POST JSON):
//   {
//     email: string,
//     state_code: string,
//     role_code: string,
//     branche: 'zahnarztpraxis' | 'zahntechnik' | 'psychotherapie',
//     anspruch: {
//       has_anspruch: boolean,
//       tage: number | null,
//       gesetz: string,
//       grund: string,
//       quelle_url?: string,
//       hinweise?: string[]
//     },
//     wunschkurs?: string,
//     top_kurse?: Array<{ titel, date, city, cme_points?, price_cents?, url }>
//   }
//
// Output: { pdf_base64: string, size_bytes: number }
//
// Layout (A4 Portrait, 595 x 842 pt):
//   Header (KursRadar-Logo + Titel)             — 60 pt
//   Anspruch-Box (Ampel + Tage + Rechtsgrundlage) — 120 pt
//   Muster-Antrag (personalisiert)                — 200 pt
//   Top-5 Kurse (falls vorhanden)                 — 220 pt
//   Footer (Quelle + Stand + CTA)                 — 60 pt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// KursRadar-Turquoise ungefaehr
const BRAND_PRIMARY = rgb(0.13, 0.58, 0.68);
const BRAND_DARK = rgb(0.12, 0.16, 0.20);
const TEXT_MUTED = rgb(0.45, 0.45, 0.48);
const AMPEL_GREEN = rgb(0.18, 0.7, 0.35);
const AMPEL_AMBER = rgb(0.95, 0.62, 0.05);

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 40;

const BRANCHE_LABELS: Record<string, string> = {
  zahnarztpraxis: 'Zahnarztpraxis',
  zahntechnik: 'Zahntechnik-Labor',
  psychotherapie: 'Psychotherapie',
};

interface PdfPayload {
  email: string;
  state_code: string;
  state_name?: string;
  role_code: string;
  role_label?: string;
  branche: 'zahnarztpraxis' | 'zahntechnik' | 'psychotherapie';
  anspruch: {
    has_anspruch: boolean;
    tage: number | null;
    gesetz: string;
    grund: string;
    quelle_url?: string;
    hinweise?: string[];
  };
  wunschkurs?: string;
  top_kurse?: Array<{
    titel: string;
    date?: string;
    city?: string;
    cme_points?: number;
    price_cents?: number;
    url?: string;
  }>;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatPrice(cents?: number): string {
  if (cents == null) return '';
  if (cents === 0) return 'kostenlos';
  return `${(cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`;
}

/** Zeilenumbruch bei fester Breite (in pt) — poor-man's word wrap. */
function wrapText(
  text: string,
  fontSize: number,
  font: any,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

async function renderPdf(p: PdfPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const brancheLabel = BRANCHE_LABELS[p.branche] || p.branche;
  const stateName = p.state_name || p.state_code;
  const roleLabel = p.role_label || p.role_code;

  let y = A4_HEIGHT - 50;

  // === Header ===
  page.drawText('KursRadar', {
    x: MARGIN_X,
    y,
    size: 20,
    font: fontBold,
    color: BRAND_PRIMARY,
  });
  page.drawText('Dein Bildungsurlaub-Anspruch', {
    x: MARGIN_X,
    y: y - 20,
    size: 13,
    font,
    color: BRAND_DARK,
  });
  page.drawText(`fuer ${brancheLabel} in ${stateName}`, {
    x: MARGIN_X,
    y: y - 36,
    size: 10,
    font: fontItalic,
    color: TEXT_MUTED,
  });

  // Divider
  y -= 55;
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: A4_WIDTH - MARGIN_X, y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.87),
  });

  // === Anspruch-Box ===
  y -= 20;
  const ampelColor = p.anspruch.has_anspruch ? AMPEL_GREEN : AMPEL_AMBER;
  const ampelLabel = p.anspruch.has_anspruch ? 'Du hast Anspruch' : 'Kein gesetzlicher Anspruch';

  // Ampel-Kreis
  page.drawCircle({
    x: MARGIN_X + 8,
    y: y - 4,
    size: 6,
    color: ampelColor,
  });

  page.drawText(ampelLabel, {
    x: MARGIN_X + 22,
    y: y - 8,
    size: 14,
    font: fontBold,
    color: ampelColor,
  });

  if (p.anspruch.has_anspruch && p.anspruch.tage) {
    page.drawText(`${p.anspruch.tage} Tage`, {
      x: A4_WIDTH - MARGIN_X - 90,
      y: y - 8,
      size: 18,
      font: fontBold,
      color: BRAND_PRIMARY,
    });
    page.drawText('pro Jahr', {
      x: A4_WIDTH - MARGIN_X - 90,
      y: y - 22,
      size: 8,
      font,
      color: TEXT_MUTED,
    });
  }

  y -= 30;
  const grundLines = wrapText(p.anspruch.grund, 10, font, A4_WIDTH - 2 * MARGIN_X);
  for (const line of grundLines) {
    page.drawText(line, { x: MARGIN_X, y, size: 10, font, color: BRAND_DARK });
    y -= 13;
  }

  y -= 4;
  page.drawText(`Rechtsgrundlage: ${p.anspruch.gesetz}`, {
    x: MARGIN_X,
    y,
    size: 9,
    font: fontBold,
    color: TEXT_MUTED,
  });
  if (p.anspruch.quelle_url) {
    page.drawText(p.anspruch.quelle_url, {
      x: MARGIN_X + font.widthOfTextAtSize(`Rechtsgrundlage: ${p.anspruch.gesetz}  `, 9),
      y,
      size: 8,
      font,
      color: BRAND_PRIMARY,
    });
  }

  // === Muster-Antrag ===
  y -= 30;
  page.drawText('Muster-Antrag an deine Praxis-/Labor-/Klinik-Leitung', {
    x: MARGIN_X,
    y,
    size: 12,
    font: fontBold,
    color: BRAND_DARK,
  });

  y -= 18;
  const antragText = p.anspruch.has_anspruch
    ? [
        'Sehr geehrte Praxisleitung,',
        '',
        `hiermit beantrage ich gemaess ${p.anspruch.gesetz} bezahlten Bildungsurlaub ` +
          `im Umfang von ${p.anspruch.tage ?? 5} Arbeitstagen fuer die berufliche Weiterbildung.`,
        p.wunschkurs
          ? `Konkret plane ich die Teilnahme an: "${p.wunschkurs}".`
          : 'Den konkreten Kurs benenne ich in einem Folgeschreiben.',
        '',
        `Der Anspruch besteht nach dem ${p.anspruch.gesetz} in Verbindung mit meinem Beschaeftigungs-` +
          `verhaeltnis als ${roleLabel}. Der Kursanbieter besitzt die entsprechende Anerkennung ` +
          `fuer ${stateName} — die Bestaetigung fuege ich bei.`,
        '',
        'Ich bitte um schriftliche Bestaetigung binnen der gesetzlichen Frist.',
        '',
        'Mit freundlichen Gruessen',
        '_______________________',
        '(Datum, Unterschrift)',
      ]
    : [
        'Hinweis: Nach aktueller Rechtslage besteht in deinem Bundesland kein gesetzlicher',
        'Anspruch. Ein Antrag ist trotzdem moeglich — ggf. ueber Tarifvertrag, Betriebs-',
        'vereinbarung oder freiwillige Freistellung. Alternativ: Fortbildungspauschale',
        '(steuerfrei bis 500 EUR/Jahr) oder Aufstiegs-BAfoeg (bis 75 % Zuschuss).',
      ];

  for (const line of antragText) {
    page.drawText(line, { x: MARGIN_X, y, size: 9, font, color: BRAND_DARK });
    y -= 12;
  }

  // === Passende Fortbildungen (Deep-Link statt kuratierte Kursliste) ===
  y -= 20;
  page.drawText(`Passende Fortbildungen in ${stateName} finden`, {
    x: MARGIN_X, y, size: 12, font: fontBold, color: BRAND_DARK,
  });

  y -= 15;
  const kursSuchLink = `https://www.kurs-radar.com/results?state=${p.state_code}`;
  page.drawText('Alle KursRadar-Kurse mit Bundesland-Filter auf einer Seite:', {
    x: MARGIN_X, y, size: 9, font, color: BRAND_DARK,
  });
  y -= 12;
  page.drawText(kursSuchLink, { x: MARGIN_X, y, size: 9, font: fontBold, color: BRAND_PRIMARY });

  y -= 18;
  const suchHinweis = [
    'Wichtig: Frage vor der Buchung beim Anbieter, ob der Kurs als Bildungsurlaub in',
    `${stateName} anerkannt ist. Die Anerkennung muss der Kursanbieter pro Bundesland`,
    'beantragen — die reine BZAeK/PTK/HWK-Fortbildungspunkte-Anerkennung reicht dafuer nicht.',
  ];
  for (const line of suchHinweis) {
    page.drawText(line, { x: MARGIN_X, y, size: 8, font: fontItalic, color: TEXT_MUTED });
    y -= 10;
  }

  // === Rechts-Disclaimer ===
  y -= 12;
  page.drawText('Rechtlicher Hinweis', { x: MARGIN_X, y, size: 9, font: fontBold, color: TEXT_MUTED });
  y -= 12;
  const disclaimerLines = [
    'Alle Angaben basieren auf oeffentlich zugaenglichen Landesgesetzen und ersetzen keine',
    'Rechtsberatung. Individueller Anspruch kann von der Standard-Berechnung abweichen',
    '(Tarifvertrag, Betriebsvereinbarung, Beamtenrecht, PtW-Status). Vor konkretem Antrag',
    'bitte mit Personalabteilung oder Rechtsberatung pruefen.',
  ];
  for (const line of disclaimerLines) {
    page.drawText(line, { x: MARGIN_X, y, size: 8, font, color: TEXT_MUTED });
    y -= 10;
  }

  // === Footer ===
  const footerY = 55;
  page.drawLine({
    start: { x: MARGIN_X, y: footerY + 20 },
    end: { x: A4_WIDTH - MARGIN_X, y: footerY + 20 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.87),
  });

  page.drawText('Quelle: KursRadar Bildungsurlaub-Fact-Base (Stand 27.07.2026)', {
    x: MARGIN_X,
    y: footerY + 6,
    size: 8,
    font,
    color: TEXT_MUTED,
  });
  page.drawText('Alle rechtlichen Angaben ohne Gewaehr. Individueller Anspruch kann abweichen.', {
    x: MARGIN_X,
    y: footerY - 6,
    size: 7,
    font: fontItalic,
    color: TEXT_MUTED,
  });
  page.drawText('www.kurs-radar.com', {
    x: A4_WIDTH - MARGIN_X - font.widthOfTextAtSize('www.kurs-radar.com', 9),
    y: footerY + 6,
    size: 9,
    font: fontBold,
    color: BRAND_PRIMARY,
  });

  return await doc.save();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = (await req.json()) as PdfPayload;

    // Minimal-Validierung — n8n vorher ausfuehrlicher
    if (!payload.email || !payload.state_code || !payload.role_code || !payload.branche) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields (email, state_code, role_code, branche)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const pdfBytes = await renderPdf(payload);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    console.log('✅ PDF rendered:', {
      email: payload.email,
      state: payload.state_code,
      role: payload.role_code,
      size_bytes: pdfBytes.length,
      has_kurse: (payload.top_kurse?.length ?? 0) > 0,
    });

    return new Response(
      JSON.stringify({ pdf_base64: pdfBase64, size_bytes: pdfBytes.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('❌ PDF render error:', error);
    return new Response(
      JSON.stringify({
        error: 'PDF render failed',
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
