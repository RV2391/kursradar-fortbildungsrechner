# KursRadar Fortbildungsrechner — Integrationsdoku

Stand: 2026-03-16

## Was ist das?

Ein interaktiver Kostenrechner, der Zahnarztpraxen zeigt, wie viel sie durch
optimierte Fortbildungsplanung mit KursRadar sparen koennen. Der Rechner
berechnet:

- **Kostenersparnis** (aktuelle Fortbildungskosten vs. optimiert mit KursRadar)
- **Zeitersparnis** (Reisezeit, Praxisschliessung, Verwaltungsaufwand)
- **Reisekosten** (Entfernung zum naechsten Dental-Fortbildungsinstitut)
- **Praxisauswirkungen** (Umsatzausfall durch Praxisschliessung)

Zielgruppe: Zahnarztpraxen (Praxisinhaber + Praxismanager).

## Tech-Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (gleiche Komponenten-Bibliothek wie Sales Commander / Content Commander)
- Framer Motion (Animationen)
- Supabase (Lead-Daten speichern via Edge Function `secure-webhook`)
- Google Tag Manager (server-side via Taggrs, `sst.kurs-radar.com`)

## Drei Seiten / Routen

| Route | Zweck | Beschreibung |
|-------|-------|--------------|
| `/` | Standalone Landingpage | Volle Seite mit Header, Erklaerung, Rechner |
| `/embed` | iframe-Einbettung | Nur der Rechner, ohne Header/Footer — fuer Einbettung auf kurs-radar.com |
| `/provider` | Veranstalter-Rechner | Separater Rechner fuer Fortbildungsanbieter (Reichweite, ROI, Provision) |

## Integration auf kurs-radar.com

### Option A: iframe (empfohlen)

Einfachste Integration. Der Rechner laeuft als eigene App auf `rechner.kurs-radar.com`
und wird per iframe eingebettet.

```html
<iframe
  src="https://rechner.kurs-radar.com/embed"
  style="width: 100%; min-width: 320px; height: 1200px; border: none; overflow: hidden;"
  title="KursRadar Fortbildungsrechner"
  allow="clipboard-write"
></iframe>
```

**Vorteile:**
- Keine Abhaengigkeit zum Plattform-Stack
- Eigenes Deployment, eigene Updates
- GTM-Tracking funktioniert unabhaengig
- Responsive (passt sich der iframe-Breite an)

**Hinweise:**
- Mindesthoehe 1200px (inkl. Ergebnis + Formular), idealerweise dynamisch per `postMessage`
- HTTPS erforderlich (Mixed Content wird geblockt)
- CSP: `frame-src https://rechner.kurs-radar.com` muss erlaubt sein
- Supabase-Domain fuer Autocomplete: `https://vkarnxgrniqtyeeibgxq.supabase.co`

### Option B: Direkter Link

Eigene Seite unter `rechner.kurs-radar.com` (oder `www.kurs-radar.com/rechner`
als Reverse Proxy). Ideal fuer:
- SEO-Landingpages ("Fortbildungskosten Zahnarztpraxis berechnen")
- LinkedIn-Ads und Social-Media-Kampagnen
- Partner-E-Mails mit direktem CTA

### Option C: React-Komponenten-Import (nur wenn Plattform auch React nutzt)

Falls die Plattform React/Next.js verwendet, koennen die Kern-Komponenten
direkt importiert werden:

```tsx
// Kern-Komponente
import { CostCalculator } from '@kursradar/fortbildungsrechner';

// Auf einer Seite einbinden
export default function RechnerPage() {
  return (
    <div className="container py-12">
      <CostCalculator />
    </div>
  );
}
```

**Voraussetzungen fuer Komponenten-Import:**
- React 18+
- Tailwind CSS mit shadcn/ui-Konfiguration
- Supabase Client (`@supabase/supabase-js`)
- Framer Motion
- Lucide React Icons

## Wo soll der Rechner auf der Plattform erscheinen?

Empfohlene Platzierungen:

1. **Eigene Unterseite** `/rechner` oder `/kostenrechner`
   - Erreichbar ueber Hauptnavigation ("Kostenrechner" oder "Einsparpotenzial")
   - SEO-optimiert mit eigenem Title/Description

2. **Homepage** — als Teaser-Section
   - Kurzversion mit 2-3 Eingabefeldern + Ergebnis
   - CTA "Detaillierte Analyse starten" → verlinkt auf `/rechner`

3. **Fuer-Praxen-Seite** (B2B-Landingpage)
   - Vollstaendiger Rechner eingebettet
   - Kontext: "Warum KursRadar fuer Ihre Praxis?"

4. **Veranstalter-Seite** `/partner-werden`
   - Provider-Rechner (`/provider`) einbetten
   - Zeigt: Reichweite, zusaetzlicher Umsatz, ROI, 5%-Provision

## Design-Anpassung

Der Rechner nutzt CSS Custom Properties / Tailwind Theme-Variablen:

```css
/* Kern-Farben (bereits auf KursRadar CD abgestimmt) */
--primary: #14b8a6;     /* Tuerkis — KursRadar Hauptfarbe */
--background: #0f1419;  /* Dark Mode Hintergrund */
--card: #1a1f2e;        /* Card-Hintergrund */
--foreground: #ffffff;  /* Text */
```

Falls die Plattform einen Light Mode nutzt: Die Komponenten unterstuetzen
`dark:` Tailwind-Klassen. Fuer Light Mode muessen die `bg-[#1a1a1a]` und
`text-gray-400` Klassen in den Ergebnis-Komponenten angepasst werden.

**Schriften:** Montserrat (Headlines) + Roboto (Body) — werden via Google Fonts
geladen. Falls die Plattform andere Fonts nutzt, einfach die `font-montserrat`
und `font-roboto` Klassen im Tailwind Config ueberschreiben.

## Lead-Tracking

Wenn ein User das Formular absendet, passiert:

1. **Supabase Edge Function** `secure-webhook` speichert die Daten
2. **GTM Event** `lead_form_submission` wird gefeuert (server-side via Taggrs)
3. **Make.com Webhook** erhaelt die Daten fuer automatisierte E-Mail-Antwort

Datenfelder: E-Mail, Praxisname, Teamgroesse, Zahnaerzte-Anzahl, Adresse,
berechnete Ersparnis, Zeitersparnis, Consent-Daten (DSGVO).

## Quellenangaben

Alle Berechnungen sind mit Quellen hinterlegt (siehe `src/utils/sources.ts`).
Der Rechner hat einen "Quellen"-Tab, der alle verwendeten Datenquellen
transparent auflistet. Wichtigste Quellen:

- § 95d SGB V (Fortbildungspflicht Zahnaerzte)
- § 48 StrlSchV (Strahlenschutz-Aktualisierung)
- BZAEK/DGZMK (CME-Punktesystem)
- VMF Tarifvertrag 2025 (ZFA-Gehaelter)
- ZWP-Online Praxismanagement-Studie 2023

## Deployment

**Aktuell:** Lovable Cloud (wird migriert)
**Ziel:** Vercel mit Custom Domain `rechner.kurs-radar.com`

```bash
# Lokal starten
npm install
npm run dev        # http://localhost:5173

# Build
npm run build      # Output: dist/

# Preview
npm run preview    # http://localhost:4173
```

## Dateien-Uebersicht (Kern)

```
src/
├── pages/
│   ├── Index.tsx              # Standalone-Seite
│   ├── Embed.tsx              # iframe-Version (ohne Header)
│   └── Provider.tsx           # Veranstalter-Rechner
├── components/
│   ├── CostCalculator.tsx     # Haupt-Rechner-Komponente
│   ├── ResultCard.tsx         # Ergebnis-Anzeige
│   ├── TimeSavingsCard.tsx    # Zeitersparnis-Karte
│   ├── CustomForm.tsx         # Lead-Capture-Formular
│   ├── AddressInput.tsx       # Adress-Autocomplete
│   ├── LocationInfo.tsx       # Naechstes Institut anzeigen
│   └── provider/              # Veranstalter-spezifische Komponenten
├── utils/
│   ├── sources.ts             # Zentrale Quellensammlung (NEU)
│   ├── calculations.ts        # Berechnungslogik (Backend-Route)
│   ├── calculations/          # Detaillierte Berechnungsmodule
│   │   ├── constants.ts       # Alle Konstanten mit Quellenverweisen
│   │   ├── costCalculations.ts
│   │   ├── timeSavingsCalculations.ts
│   │   ├── extendedTimeSavingsCalculations.ts
│   │   └── timeSavingsConstants.ts
│   ├── cmeCalculations.ts     # CME-Punkte-Berechnung
│   └── dentalInstitutes/      # 150+ Dental-Institute (DE/AT/CH)
└── hooks/
    ├── useGTMTracking.ts      # Google Tag Manager Events
    └── useKursRadarStats.ts   # Live-Statistiken von KursRadar
```

## Fragen?

Robin Venghaus — robinvenghaus@kurs-radar.com
