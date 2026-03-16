import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Euro,
  TrendingUp,
  CheckCircle,
  Info,
  ExternalLink,
  ArrowRight,
  Shield,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  FORTBILDUNGSTYPEN,
  berechneAufstiegsBAfoeg,
  type BAfoegErgebnis,
  type Fortbildungstyp,
} from '@/utils/bafoegCalculations';
import { INDUSTRY_SOURCES } from '@/utils/sources';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

export const BAfoegRechner = () => {
  const [selectedTyp, setSelectedTyp] = useState<string>('');
  const [customKosten, setCustomKosten] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<BAfoegErgebnis | null>(null);
  const [aktivesFortbildung, setAktivesFortbildung] = useState<Fortbildungstyp | null>(null);

  const handleTypChange = (typId: string) => {
    setSelectedTyp(typId);
    const typ = FORTBILDUNGSTYPEN.find((t) => t.id === typId);
    if (typ) {
      setAktivesFortbildung(typ);
      setCustomKosten(typ.typischeKosten);
      setErgebnis(berechneAufstiegsBAfoeg(typ.typischeKosten, typ.istMeisterpruefung));
    }
  };

  const handleKostenChange = (kosten: number) => {
    setCustomKosten(kosten);
    if (kosten > 0) {
      setErgebnis(
        berechneAufstiegsBAfoeg(kosten, aktivesFortbildung?.istMeisterpruefung ?? false)
      );
    }
  };

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
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="font-montserrat text-2xl font-semibold text-card-foreground">
                Aufstiegs-BAfoeg-Rechner
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-roboto">
              Berechne, wie viel du fuer deine Fortbildung wirklich zahlst
            </p>
          </div>

          {/* Fortbildungstyp */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Welche Fortbildung planst du?
            </Label>
            <Select value={selectedTyp} onValueChange={handleTypChange}>
              <SelectTrigger>
                <SelectValue placeholder="Fortbildung waehlen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_header_zfa" disabled>
                  — ZFA-Aufstiegsfortbildungen —
                </SelectItem>
                {FORTBILDUNGSTYPEN.filter((t) => t.zielgruppe === 'ZFA').map((typ) => (
                  <SelectItem key={typ.id} value={typ.id}>
                    {typ.name}
                  </SelectItem>
                ))}
                <SelectItem value="_header_zt" disabled>
                  — Zahntechnik —
                </SelectItem>
                {FORTBILDUNGSTYPEN.filter((t) => t.zielgruppe === 'ZT').map((typ) => (
                  <SelectItem key={typ.id} value={typ.id}>
                    {typ.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Details zur gewaehlten Fortbildung */}
          {aktivesFortbildung && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">{aktivesFortbildung.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {aktivesFortbildung.dauerMonate} Monate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {aktivesFortbildung.unterrichtsstunden} UE
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">DQR {aktivesFortbildung.dqrNiveau}</Badge>
                  {aktivesFortbildung.afbgFoerderfaehig && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AFBG-foerderfaehig
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Voraussetzungen:</strong> {aktivesFortbildung.voraussetzungen}
                </p>
              </div>

              {/* Kosten anpassen */}
              <div className="space-y-2">
                <Label className="text-card-foreground">
                  Kurskosten anpassen (EUR)
                </Label>
                <Input
                  type="number"
                  min={100}
                  max={30000}
                  step={100}
                  value={customKosten ?? 0}
                  onChange={(e) => handleKostenChange(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Typische Kosten: {formatCurrency(aktivesFortbildung.typischeKosten)} —{' '}
                  {aktivesFortbildung.kostenQuelle}
                </p>
              </div>
            </motion.div>
          )}

          {/* Quellenhinweis */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-card-foreground mb-1">Quellenbasierte Berechnung</p>
                <p className="text-muted-foreground">
                  Alle Zahlen basieren auf dem{' '}
                  <a
                    href="https://www.aufstiegs-bafoeg.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Aufstiegsfortbildungsfoerderungsgesetz (AFBG)
                  </a>
                  , Stand 2024. Foerderhoehe: 50 % Zuschuss + 50 % KfW-Darlehen, davon 50 % Erlass bei
                  Bestehen = effektiv bis zu 75 % Foerderung.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ergebnis */}
        <div className="flex flex-col items-start justify-start space-y-6">
          {ergebnis && aktivesFortbildung ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-6"
            >
              {/* Haupt-Ergebnis */}
              <Card className="border-green-600/30 bg-card shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-montserrat text-xl">
                    <Euro className="h-5 w-5 text-green-500" />
                    Dein Eigenanteil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Grosse Zahl */}
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-green-500 font-montserrat">
                      {formatCurrency(ergebnis.eigenanteilEffektiv)}
                    </div>
                    <p className="text-muted-foreground mt-2">
                      statt{' '}
                      <span className="line-through">{formatCurrency(ergebnis.gesamtkosten)}</span>
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-3 text-lg px-4 py-1 bg-green-600/20 text-green-400 border-green-600/30"
                    >
                      {ergebnis.foerdersatzProzent}% gefoerdert
                    </Badge>
                  </div>

                  <Separator />

                  {/* Aufschluesselung */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-card-foreground text-sm">Foerderungs-Aufschluesselung</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gesamtkosten</span>
                        <span className="text-card-foreground">{formatCurrency(ergebnis.gesamtkosten)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Davon foerderfaehig (max. 15.000 EUR + 2.000 EUR Pruefung)
                        </span>
                        <span className="text-card-foreground">
                          {formatCurrency(ergebnis.foerderfaehigeKosten)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-green-500">
                        <span>Zuschuss (50 %, geschenkt)</span>
                        <span>-{formatCurrency(ergebnis.zuschuss)}</span>
                      </div>
                      <div className="flex justify-between text-blue-400">
                        <span>KfW-Darlehen (50 %, zinsguenstig)</span>
                        <span>{formatCurrency(ergebnis.darlehen)}</span>
                      </div>
                      <div className="flex justify-between text-green-500">
                        <span>Erlass bei Bestehen (50 % des Darlehens)</span>
                        <span>-{formatCurrency(ergebnis.erlassBeibestehen)}</span>
                      </div>
                      {ergebnis.materialkostenZuschuss > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span>Materialkosten-Zuschuss (Meisterpruefung)</span>
                          <span>-{formatCurrency(ergebnis.materialkostenZuschuss)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-card-foreground">Dein Eigenanteil</span>
                        <span className="text-green-500">
                          {formatCurrency(ergebnis.eigenanteilEffektiv)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hinweis: ohne Erlass */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      <Info className="h-3 w-3 inline mr-1" />
                      Falls du die Pruefung nicht bestehst, entfaellt der Erlass. Dann zahlst du{' '}
                      <strong>{formatCurrency(ergebnis.eigenanteilOhneErlass)}</strong> (Zuschuss bleibt, Darlehen
                      wird voll zurueckgezahlt).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Details-Karte */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-montserrat">
                    <Info className="h-4 w-4 text-primary" />
                    So funktioniert Aufstiegs-BAfoeg
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-green-500 text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">50 % Zuschuss — geschenkt</p>
                        <p className="text-muted-foreground">
                          Die Haelfte der Kosten uebernimmt der Staat. Kein Rueckzahlen, kein Kleingedrucktes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">50 % KfW-Darlehen — zinsguenstig</p>
                        <p className="text-muted-foreground">
                          Die andere Haelfte kannst du als Darlehen aufnehmen. Zinsguenstig, lange Laufzeit,
                          Rueckzahlung erst nach Abschluss.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-green-500 text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">50 % Erlass bei Bestehen</p>
                        <p className="text-muted-foreground">
                          Wenn du die Pruefung bestehst, werden 50 % des Darlehens erlassen.
                          Effektiv zahlst du nur ca. 25 % der Kosten selbst.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="font-medium text-card-foreground">Wer hat Anspruch?</p>
                    <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                      <li>Alle mit abgeschlossener Erstausbildung (z. B. ZFA, Zahntechniker)</li>
                      <li>Altersunabhaengig — kein Hoechstalter</li>
                      <li>Einkommensunabhaengig fuer den Zuschuss</li>
                      <li>Auch berufsbegleitend moeglich</li>
                    </ul>
                  </div>

                  <a
                    href="https://www.aufstiegs-bafoeg.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Offizielles BMBF-Portal zum Aufstiegs-BAfoeg
                  </a>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/30">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-montserrat text-xl font-bold text-card-foreground">
                    Passende Fortbildung finden?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Auf KursRadar findest du {aktivesFortbildung.name.split('—')[0].trim()}-Kurse
                    aller Anbieter — kammerzertifiziert, mit Preisvergleich und Bewertungen.
                  </p>
                  <a
                    href="https://www.kurs-radar.com/auth?tab=signup"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="gap-2 font-montserrat">
                      Kostenlos registrieren
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground">
                    KursRadar ist fuer dich kostenlos. Anbieter zahlen eine Provision.
                  </p>
                </CardContent>
              </Card>

              {/* Quellen */}
              <div className="text-xs text-muted-foreground space-y-1 px-1">
                <p className="font-medium">Quellen:</p>
                <p>
                  • {INDUSTRY_SOURCES.AUFSTIEGS_BAFOEG.full} —{' '}
                  <a href={INDUSTRY_SOURCES.AUFSTIEGS_BAFOEG.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    aufstiegs-bafoeg.de
                  </a>
                </p>
                <p>• Fortbildungskosten: Durchschnittswerte der Landeszahnaerztekammern und Fortbildungsakademien, Stand 2025</p>
                <p>• Foerderungssaetze: AFBG in der Fassung der letzten Novelle 2024</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full rounded-2xl bg-card/50 p-8 border border-dashed border-border flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <GraduationCap className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="font-montserrat text-xl font-medium text-muted-foreground">
                Was kostet deine Fortbildung wirklich?
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
                Waehle links eine Fortbildung aus und erfahre, wie viel du mit Aufstiegs-BAfoeg sparst.
                Die meisten ZFA zahlen nur 25 % der Kosten selbst.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary text-sm">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Bis zu 75 % Foerderung moeglich</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
