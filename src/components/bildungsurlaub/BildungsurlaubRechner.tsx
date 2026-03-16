import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  ArrowRight,
  FileText,
  Shield,
  Scale,
  Building2,
} from 'lucide-react';
import { BILDUNGSURLAUB_SOURCES } from '@/utils/sources';

// ============================================================
// DATEN
// ============================================================

interface BundeslandInfo {
  code: string;
  name: string;
  tageProJahr: number | null;
  zweiJahresRegelung: boolean;
  kleinbetriebsSchwelle: number | null;
  wartezeit: string;
  antragsfrist: string;
  gesetz: string;
  besonderheiten: string;
  keinAnspruch: boolean;
}

const BUNDESLAENDER: BundeslandInfo[] = [
  { code: 'BW', name: 'Baden-Wuerttemberg', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: 10, wartezeit: '12 Monate', antragsfrist: '8 Wochen', gesetz: 'BzG BW', besonderheiten: 'Kleinbetriebsklausel: Unter 10 Beschaeftigte = KEIN Anspruch. Für kleine Zahnarztpraxen oft relevant!', keinAnspruch: false },
  { code: 'BY', name: 'Bayern', tageProJahr: null, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '-', antragsfrist: '-', gesetz: 'Kein Gesetz', besonderheiten: 'Einziges Bundesland ohne Bildungsurlaubsgesetz. Anspruch nur über Tarifvertrag oder Betriebsvereinbarung möglich.', keinAnspruch: true },
  { code: 'BE', name: 'Berlin', tageProJahr: 10, zweiJahresRegelung: true, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'BiUrlG BE', besonderheiten: 'Unter 25-Jaehrige: 10 Tage pro Jahr (statt in 2 Jahren). Ueberforderungsschutz bei ≤20 Beschaeftigten.', keinAnspruch: false },
  { code: 'BB', name: 'Brandenburg', tageProJahr: 10, zweiJahresRegelung: true, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'BbgWBG', besonderheiten: '', keinAnspruch: false },
  { code: 'HB', name: 'Bremen', tageProJahr: 10, zweiJahresRegelung: true, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '4 Wochen', gesetz: 'BremBUG', besonderheiten: 'Unter 25-Jaehrige: zusätzlich 2 Tage für politische Bildung.', keinAnspruch: false },
  { code: 'HH', name: 'Hamburg', tageProJahr: 10, zweiJahresRegelung: true, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'HmbBUG', besonderheiten: '', keinAnspruch: false },
  { code: 'HE', name: 'Hessen', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'HBUG', besonderheiten: '', keinAnspruch: false },
  { code: 'MV', name: 'Mecklenburg-Vorpommern', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '8 Wochen', gesetz: 'BfG M-V', besonderheiten: 'Auch für ehrenamtliche Tätigkeit nutzbar.', keinAnspruch: false },
  { code: 'NI', name: 'Niedersachsen', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '4 Wochen', gesetz: 'NBildUG', besonderheiten: '', keinAnspruch: false },
  { code: 'NW', name: 'Nordrhein-Westfalen', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: 10, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'AWbG NRW', besonderheiten: 'Kleinbetriebsklausel: Unter 10 Beschaeftigte = KEIN Anspruch. Für kleine Zahnarztpraxen oft relevant!', keinAnspruch: false },
  { code: 'RP', name: 'Rheinland-Pfalz', tageProJahr: 10, zweiJahresRegelung: true, kleinbetriebsSchwelle: 5, wartezeit: '2 Jahre (!)', antragsfrist: '6 Wochen', gesetz: 'BFG RP', besonderheiten: 'Lange Wartezeit: 2 Jahre! Kleinbetriebsklausel ab unter 5 Beschaeftigten.', keinAnspruch: false },
  { code: 'SL', name: 'Saarland', tageProJahr: 6, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '12 Monate', antragsfrist: '6 Wochen', gesetz: 'SBFG', besonderheiten: '6 Tage pro Jahr — mehr als alle anderen Bundesländer!', keinAnspruch: false },
  { code: 'SN', name: 'Sachsen', tageProJahr: 3, zweiJahresRegelung: false, kleinbetriebsSchwelle: 20, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'SaechsBFG (ab 2027)', besonderheiten: 'NEUES Gesetz! Ab 01.01.2027: 3 Tage/Jahr. Betriebe ≤20 Beschaeftigte können Erstattung beantragen.', keinAnspruch: false },
  { code: 'ST', name: 'Sachsen-Anhalt', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: 5, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'BfG LSA', besonderheiten: 'Neufassung ab September 2026. Kleinbetriebsklausel ab unter 5 Beschaeftigten.', keinAnspruch: false },
  { code: 'SH', name: 'Schleswig-Holstein', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: null, wartezeit: '6 Monate', antragsfrist: '6 Wochen', gesetz: 'WBG SH', besonderheiten: '', keinAnspruch: false },
  { code: 'TH', name: 'Thueringen', tageProJahr: 5, zweiJahresRegelung: false, kleinbetriebsSchwelle: 5, wartezeit: '6 Monate', antragsfrist: '8 Wochen', gesetz: 'ThuerBfG', besonderheiten: 'Kleinbetriebsklausel ab unter 5 Beschaeftigten.', keinAnspruch: false },
];

type Anstellungsverhaeltnis = 'angestellt' | 'selbstständig' | 'azubi';

interface AnspruchErgebnis {
  hatAnspruch: boolean;
  grund: string;
  tage: number | null;
  hinweise: string[];
  gesetz: string;
  quelle: string;
}

// ============================================================
// ANSPRUCHS-PRÜFUNG
// ============================================================

function pruefeAnspruch(
  bundesland: BundeslandInfo,
  betriebsgroesse: number,
  anstellung: Anstellungsverhaeltnis
): AnspruchErgebnis {
  const hinweise: string[] = [];

  // Selbstständige haben nie Anspruch
  if (anstellung === 'selbstständig') {
    return {
      hatAnspruch: false,
      grund: 'Selbstständige haben keinen gesetzlichen Anspruch auf Bildungsurlaub. Das Gesetz gilt nur für Angestellte.',
      tage: null,
      hinweise: ['Fortbildungskosten sind steuerlich absetzbar (Betriebsausgaben).', 'Aufstiegs-BAfoeg ist auch für Selbstständige möglich.'],
      gesetz: bundesland.gesetz,
      quelle: BILDUNGSURLAUB_SOURCES[bundesland.code]?.url || '',
    };
  }

  // Bayern hat kein Gesetz
  if (bundesland.keinAnspruch) {
    return {
      hatAnspruch: false,
      grund: `${bundesland.name} hat kein Bildungsurlaubsgesetz. ${bundesland.besonderheiten}`,
      tage: null,
      hinweise: ['Prüfen Sie Ihren Tarifvertrag oder Betriebsvereinbarung.', 'Arbeitgeber können freiwillig Bildungsurlaub gewaehren.'],
      gesetz: bundesland.gesetz,
      quelle: BILDUNGSURLAUB_SOURCES[bundesland.code]?.url || '',
    };
  }

  // Kleinbetriebsklausel prüfen
  if (bundesland.kleinbetriebsSchwelle && betriebsgroesse < bundesland.kleinbetriebsSchwelle) {
    const grundText = bundesland.code === 'SN'
      ? `In Sachsen (ab 2027) können Betriebe mit ≤20 Beschaeftigten eine Erstattung beantragen. Bei ${betriebsgroesse} Beschaeftigten greift die Erstattungsregelung.`
      : `In ${bundesland.name} besteht bei unter ${bundesland.kleinbetriebsSchwelle} Beschaeftigten KEIN Anspruch auf Bildungsurlaub (${bundesland.gesetz}).`;

    if (bundesland.code !== 'SN') {
      return {
        hatAnspruch: false,
        grund: grundText,
        tage: null,
        hinweise: [
          'Viele Zahnarztpraxen fallen unter diese Grenze.',
          'Alternative: Freiwillige Freistellung durch den Arbeitgeber.',
          'Fortbildungskosten können steuerlich abgesetzt werden.',
          'Aufstiegs-BAfoeg ist unabhängig vom Bildungsurlaub möglich.',
        ],
        gesetz: bundesland.gesetz,
        quelle: BILDUNGSURLAUB_SOURCES[bundesland.code]?.url || '',
      };
    }
    hinweise.push('Erstattungsanspruch für Arbeitgeber bei ≤20 Beschaeftigten.');
  }

  // Azubis
  if (anstellung === 'azubi') {
    hinweise.push('Als Auszubildende/r hast du in den meisten Bundesländern ebenfalls Anspruch.');
  }

  // Anspruch besteht
  if (bundesland.besonderheiten) {
    hinweise.push(bundesland.besonderheiten);
  }
  hinweise.push(`Antragsfrist: ${bundesland.antragsfrist} vor Beginn der Fortbildung.`);
  hinweise.push(`Wartezeit: ${bundesland.wartezeit} nach Beginn des Arbeitsverhaeltnisses.`);
  hinweise.push('WICHTIG: Der Kursanbieter muss die Bildungsurlaub-Anerkennung für dein Bundesland haben.');

  return {
    hatAnspruch: true,
    grund: `Du hast Anspruch auf ${bundesland.zweiJahresRegelung ? `${bundesland.tageProJahr} Tage in 2 Jahren` : `${bundesland.tageProJahr} Tage pro Jahr`} Bildungsurlaub nach dem ${bundesland.gesetz}.`,
    tage: bundesland.tageProJahr,
    hinweise,
    gesetz: bundesland.gesetz,
    quelle: BILDUNGSURLAUB_SOURCES[bundesland.code]?.url || '',
  };
}

// ============================================================
// KOMPONENTE
// ============================================================

export const BildungsurlaubRechner = () => {
  const [selectedBundesland, setSelectedBundesland] = useState<string>('');
  const [betriebsgroesse, setBetriebsgroesse] = useState<string>('');
  const [anstellung, setAnstellung] = useState<Anstellungsverhaeltnis | ''>('');

  const bundesland = useMemo(
    () => BUNDESLAENDER.find((b) => b.code === selectedBundesland),
    [selectedBundesland]
  );

  const ergebnis = useMemo(() => {
    if (!bundesland || !betriebsgroesse || !anstellung) return null;
    return pruefeAnspruch(bundesland, parseInt(betriebsgroesse), anstellung as Anstellungsverhaeltnis);
  }, [bundesland, betriebsgroesse, anstellung]);

  const istKomplett = selectedBundesland && betriebsgroesse && anstellung;

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
        {/* Eingabe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 rounded-2xl bg-card p-6 shadow-lg border"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="font-montserrat text-2xl font-semibold text-card-foreground">
                Bildungsurlaub-Check
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-roboto">
              Prüfe in 3 Schritten, ob du Anspruch auf bezahlten Bildungsurlaub hast
            </p>
          </div>

          {/* Schritt 1: Bundesland */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              1. In welchem Bundesland arbeitest du?
            </Label>
            <Select value={selectedBundesland} onValueChange={setSelectedBundesland}>
              <SelectTrigger>
                <SelectValue placeholder="Bundesland wählen..." />
              </SelectTrigger>
              <SelectContent>
                {BUNDESLAENDER.map((bl) => (
                  <SelectItem key={bl.code} value={bl.code}>
                    {bl.name}
                    {bl.keinAnspruch && ' (kein Gesetz)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schritt 2: Betriebsgroesse */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              2. Wie viele Mitarbeiter hat deine Praxis/dein Betrieb?
            </Label>
            <Select value={betriebsgroesse} onValueChange={setBetriebsgroesse}>
              <SelectTrigger>
                <SelectValue placeholder="Betriebsgroesse wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-2 Mitarbeiter</SelectItem>
                <SelectItem value="3">3-4 Mitarbeiter</SelectItem>
                <SelectItem value="5">5-9 Mitarbeiter</SelectItem>
                <SelectItem value="10">10-19 Mitarbeiter</SelectItem>
                <SelectItem value="20">20-49 Mitarbeiter</SelectItem>
                <SelectItem value="50">50+ Mitarbeiter</SelectItem>
              </SelectContent>
            </Select>
            {bundesland?.kleinbetriebsSchwelle && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {bundesland.name}: Kleinbetriebsklausel ab unter {bundesland.kleinbetriebsSchwelle} Beschaeftigten
              </p>
            )}
          </div>

          {/* Schritt 3: Anstellung */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              3. Wie bist du angestellt?
            </Label>
            <Select value={anstellung} onValueChange={(v) => setAnstellung(v as Anstellungsverhaeltnis)}>
              <SelectTrigger>
                <SelectValue placeholder="Anstellungsverhaeltnis wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="angestellt">Angestellt (Voll- oder Teilzeit)</SelectItem>
                <SelectItem value="azubi">Auszubildende/r</SelectItem>
                <SelectItem value="selbstständig">Selbstständig / Praxisinhaber/in</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quellenhinweis */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-card-foreground mb-1">Rechtsverbindliche Quellen</p>
                <p className="text-muted-foreground">
                  Alle Angaben basieren auf den jeweiligen Landesgesetzen (Stand März 2026).
                  Bildungsurlaub existiert in 15 von 16 Bundesländern — nur Bayern hat kein Gesetz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ergebnis */}
        <div className="flex flex-col items-start justify-start space-y-6">
          {ergebnis ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-6"
            >
              {/* Haupt-Ergebnis */}
              <Card className={`shadow-lg ${ergebnis.hatAnspruch ? 'border-green-600/30' : 'border-amber-600/30'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-montserrat text-xl">
                    {ergebnis.hatAnspruch ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-amber-500" />
                    )}
                    {ergebnis.hatAnspruch ? 'Du hast Anspruch!' : 'Kein Anspruch'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ergebnis-Box */}
                  <div className={`rounded-lg p-4 ${ergebnis.hatAnspruch ? 'bg-green-600/10 border border-green-600/20' : 'bg-amber-600/10 border border-amber-600/20'}`}>
                    {ergebnis.hatAnspruch && ergebnis.tage && (
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-green-500 font-montserrat">
                          {ergebnis.tage} Tage
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bundesland?.zweiJahresRegelung ? 'in 2 Jahren' : 'pro Jahr'} bezahlter Bildungsurlaub
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-card-foreground">{ergebnis.grund}</p>
                  </div>

                  {/* Rechtsgrundlage */}
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Rechtsgrundlage: </span>
                    <Badge variant="secondary">{ergebnis.gesetz}</Badge>
                    {ergebnis.quelle && (
                      <a href={ergebnis.quelle} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <Separator />

                  {/* Hinweise */}
                  {ergebnis.hinweise.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-card-foreground flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        Wichtige Hinweise
                      </h4>
                      <ul className="space-y-2">
                        {ergebnis.hinweise.map((hinweis, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {hinweis}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dental-spezifischer Hinweis */}
              <Card className="border-primary/20">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-medium text-card-foreground flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Wichtig für Zahnarztpraxen
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Zahnmedizinische Fortbildungen sind <strong>nicht automatisch</strong> als Bildungsurlaub anerkannt.
                      Der <strong>Kursanbieter</strong> muss die Anerkennung pro Bundesland beantragen (25-200 EUR, 4-12 Wochen).
                    </p>
                    <p>
                      Viele Kammer-Fortbildungen laufen über das Berufsrecht, nicht über das Bildungsurlaubssystem.
                      Frage vor der Buchung: <em>"Ist dieser Kurs als Bildungsurlaub in [Bundesland] anerkannt?"</em>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-montserrat text-xl font-bold text-card-foreground">
                    Bildungsurlaub-fähige Kurse finden
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Auf KursRadar findest du Fortbildungen, die als Bildungsurlaub anerkannt sind —
                    mit Filter nach Bundesland, Kammerzertifizierung und Preisvergleich.
                  </p>
                  <a href="https://www.kurs-radar.com/auth?tab=signup" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2 font-montserrat">
                      Kostenlos registrieren
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Quellen */}
              <div className="text-xs text-muted-foreground space-y-1 px-1">
                <p className="font-medium">Quellen:</p>
                <p>• {BILDUNGSURLAUB_SOURCES[selectedBundesland]?.full || 'Landesgesetz'}</p>
                <p>• bildungsurlaub.de — Übersicht aller Landesgesetze</p>
                <p>• Alle Angaben Stand März 2026, ohne Gewähr</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full rounded-2xl bg-card/50 p-8 border border-dashed border-border flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <Calendar className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="font-montserrat text-xl font-medium text-muted-foreground">
                Hast du Anspruch auf Bildungsurlaub?
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
                Beantworte 3 Fragen und erfahre sofort, ob und wie viele Tage bezahlten
                Bildungsurlaub du für deine Fortbildung nutzen kannst.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-xs text-muted-foreground">Bundesländer mit Gesetz</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">5-10</div>
                  <div className="text-xs text-muted-foreground">Tage pro Jahr</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground">Gehaltsfortzahlung</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
