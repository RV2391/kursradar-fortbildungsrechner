import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
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
  Mail,
  Briefcase,
  Loader2,
} from 'lucide-react';

import { BUNDESLAENDER, getBundeslandByCode } from './data/bundeslaender';
import { ROLLEN, getRolleByCode, getRollenByBranche, type BranchenCode } from './data/rollen';
import { pruefeAnspruch } from './data/anspruchLogic';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { supabase } from '@/integrations/supabase/client';

const BRANCHEN: { code: BranchenCode; label: string; iconLabel: string }[] = [
  { code: 'zahnarztpraxis', label: 'Zahnarztpraxis', iconLabel: '🦷' },
  { code: 'zahntechnik', label: 'Zahntechnik-Labor', iconLabel: '⚙️' },
  { code: 'psychotherapie', label: 'Psychotherapie', iconLabel: '🧠' },
];

export const BildungsurlaubRechner = () => {
  const { toast } = useToast();
  const { trackEvent } = useGTMTracking();

  // --- Multi-Step-State ---
  const [selectedBundesland, setSelectedBundesland] = useState<string>('');
  const [selectedBranche, setSelectedBranche] = useState<BranchenCode | ''>('');
  const [selectedRolle, setSelectedRolle] = useState<string>('');
  const [betriebsgroesse, setBetriebsgroesse] = useState<string>('');
  const [wunschkurs, setWunschkurs] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pdfRequested, setPdfRequested] = useState<boolean>(false);

  const bundesland = useMemo(() => getBundeslandByCode(selectedBundesland), [selectedBundesland]);
  const rolle = useMemo(() => getRolleByCode(selectedRolle), [selectedRolle]);
  const rollenFuerBranche = useMemo(
    () => (selectedBranche ? getRollenByBranche(selectedBranche) : []),
    [selectedBranche],
  );

  const ergebnis = useMemo(() => {
    if (!bundesland || !rolle || !betriebsgroesse) return null;
    return pruefeAnspruch(bundesland, parseInt(betriebsgroesse, 10), rolle);
  }, [bundesland, rolle, betriebsgroesse]);

  const trackedStart = useMemo(() => ({ tracked: false }), []);
  if (!trackedStart.tracked && selectedBundesland) {
    trackEvent({ event: 'bildungsurlaub_start' });
    trackedStart.tracked = true;
  }

  const handleBrancheChange = (value: BranchenCode) => {
    setSelectedBranche(value);
    setSelectedRolle('');
    trackEvent({ event: 'bildungsurlaub_branche_selected', branche: value });
  };

  const handleSubmitLeadMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ergebnis || !bundesland || !rolle) return;

    if (!email || !consent) {
      toast({
        variant: 'destructive',
        title: 'Bitte E-Mail und Zustimmung angeben',
        description: 'Ohne beides können wir dir die PDF-Analyse nicht zusenden.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const consentData = {
        given: true,
        timestamp: new Date().toISOString(),
        privacy_policy_version: '2025-01',
        opt_in_method: 'bildungsurlaub_konfigurator',
        page_url: window.location.href,
      };

      const payload = {
        form_type: 'bildungsurlaub_pdf',
        email,
        // Bei Lead-Capture: company_name wird bewusst nicht gefragt.
        // secure-webhook akzeptiert es als optional bei form_type=bildungsurlaub_pdf.
        state_code: bundesland.code,
        role_code: rolle.code,
        branche: rolle.branche,
        company_size: parseInt(betriebsgroesse, 10),
        wunschkurs: wunschkurs || null,
        anspruch: {
          has_anspruch: ergebnis.hatAnspruch,
          tage: ergebnis.tage,
          gesetz: ergebnis.gesetz,
          quelle_url: ergebnis.quelle,
        },
        consent: consentData,
        timestamp: consentData.timestamp,
        source: 'KursRadar Bildungsurlaub Konfigurator',
        page_url: window.location.href,
      };

      const { data, error } = await supabase.functions.invoke('secure-webhook', {
        body: payload,
      });

      if (error) throw new Error(error.message);

      trackEvent({
        event: 'bildungsurlaub_completed',
        state_code: bundesland.code,
        role_code: rolle.code,
        branche: rolle.branche,
        has_anspruch: ergebnis.hatAnspruch,
        tage: ergebnis.tage ?? 0,
      });

      setPdfRequested(true);
      toast({
        title: 'PDF wird erstellt',
        description: 'Du bekommst dein persönliches Bildungsurlaub-PDF in wenigen Minuten per E-Mail.',
      });
    } catch (err) {
      console.error('Bildungsurlaub lead submission error:', err);
      toast({
        variant: 'destructive',
        title: 'Etwas ist schiefgelaufen',
        description: 'Bitte versuche es in wenigen Minuten erneut.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
        {/* === EINGABE-PANEL === */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 rounded-2xl bg-card p-6 shadow-lg border"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="font-inter text-2xl font-semibold text-card-foreground">
                Bildungsurlaub-Check
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-roboto">
              Prüfe deinen Anspruch — für Zahnmedizin, Zahntechnik und Psychotherapie
            </p>
          </div>

          {/* Schritt 1 — Bundesland */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              1. In welchem Bundesland arbeitest du?
            </Label>
            <Select value={selectedBundesland} onValueChange={setSelectedBundesland}>
              <SelectTrigger>
                <SelectValue placeholder="Bundesland wählen…" />
              </SelectTrigger>
              <SelectContent>
                {BUNDESLAENDER.map((bl) => (
                  <SelectItem key={bl.code} value={bl.code}>
                    {bl.name}
                    {bl.keinAnspruch && ' (kein Gesetz)'}
                    {bl.zukuenftig && ' (ab 2027)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schritt 2 — Branche */}
          <div className="space-y-3">
            <Label className="text-card-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              2. In welchem Bereich bist du tätig?
            </Label>
            <Select
              value={selectedBranche}
              onValueChange={(v) => handleBrancheChange(v as BranchenCode)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bereich wählen…" />
              </SelectTrigger>
              <SelectContent>
                {BRANCHEN.map((b) => (
                  <SelectItem key={b.code} value={b.code}>
                    {b.iconLabel} {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schritt 3 — Rolle (kaskadiert aus Branche) */}
          {selectedBranche && (
            <div className="space-y-3">
              <Label className="text-card-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                3. Deine Rolle
              </Label>
              <Select value={selectedRolle} onValueChange={setSelectedRolle}>
                <SelectTrigger>
                  <SelectValue placeholder="Rolle wählen…" />
                </SelectTrigger>
                <SelectContent>
                  {rollenFuerBranche.map((r) => (
                    <SelectItem key={r.code} value={r.code}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rolle && (
                <p className="text-xs text-muted-foreground">{rolle.kurzbeschreibung}</p>
              )}
            </div>
          )}

          {/* Schritt 4 — Betriebsgroesse */}
          {selectedRolle && (
            <div className="space-y-3">
              <Label className="text-card-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                4. Wie viele Mitarbeiter hat dein Betrieb?
              </Label>
              <Select value={betriebsgroesse} onValueChange={setBetriebsgroesse}>
                <SelectTrigger>
                  <SelectValue placeholder="Betriebsgröße wählen…" />
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
                <p className="text-xs text-accent flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {bundesland.name}: Kleinbetriebsklausel ab unter {bundesland.kleinbetriebsSchwelle} Beschäftigten
                </p>
              )}
            </div>
          )}

          {/* Quellenhinweis */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-card-foreground mb-1">Rechtsverbindliche Quellen</p>
                <p className="text-muted-foreground">
                  Alle Angaben basieren auf den aktuellen Landesgesetzen und der KursRadar-Fact-Base
                  (Stand Juli 2026). Saarland-Novelle 09.05.2024, Sachsen-Anhalt-Novelle 01.09.2026 und Sachsen-Neugesetz ab 01.01.2027 sind eingearbeitet.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === ERGEBNIS-PANEL === */}
        <div className="flex flex-col items-start justify-start space-y-6">
          {ergebnis ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full space-y-6"
            >
              {/* --- Haupt-Ergebnis --- */}
              <Card
                className={`shadow-lg ${
                  ergebnis.hatAnspruch ? 'border-primary/30' : 'border-accent/30'
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-inter text-xl">
                    {ergebnis.hatAnspruch ? (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    ) : (
                      <XCircle className="h-6 w-6 text-accent" />
                    )}
                    {ergebnis.hatAnspruch ? 'Du hast Anspruch!' : 'Kein gesetzlicher Anspruch'}
                    {ergebnis.zukuenftig && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        ab 2027
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`rounded-lg p-4 ${
                      ergebnis.hatAnspruch
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-accent/10 border border-accent/20'
                    }`}
                  >
                    {ergebnis.hatAnspruch && ergebnis.tage && (
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-primary font-inter">
                          {ergebnis.tage} Tage
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bundesland?.zweiJahresRegelung ? 'in 2 Jahren' : 'pro Jahr'} bezahlter Bildungsurlaub
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-card-foreground">{ergebnis.grund}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Rechtsgrundlage:</span>
                    <Badge variant="secondary">{ergebnis.gesetz}</Badge>
                    {ergebnis.quelle && (
                      <a
                        href={ergebnis.quelle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {ergebnis.hinweise.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-card-foreground flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Wichtige Hinweise
                        </h4>
                        <ul className="space-y-2">
                          {ergebnis.hinweise.map((h, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* --- Lead-Magnet-Formular --- */}
              {!pdfRequested ? (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-inter text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Dein persönliches Bildungsurlaub-PDF
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Du bekommst eine 1-seitige Zusammenfassung mit deinem Anspruch, dem Muster-Antrag
                      für {bundesland?.name}
                      {rolle?.cmeSystem && ` (mit ${rolle.cmeSystem}-Kammer-Kontext)`} und den 5
                      passenden Fortbildungen auf KursRadar.
                    </p>
                    <form onSubmit={handleSubmitLeadMagnet} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wunschkurs" className="text-sm">
                          Wunschkurs (optional)
                        </Label>
                        <Input
                          id="wunschkurs"
                          type="text"
                          placeholder="z. B. Implantologie-Kurs Berlin"
                          value={wunschkurs}
                          onChange={(e) => setWunschkurs(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Wenn du einen konkreten Kurs im Auge hast, personalisieren wir den Muster-Antrag entsprechend.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bu_email" className="text-sm flex items-center gap-1">
                          <Mail className="h-4 w-4" /> Deine E-Mail-Adresse
                        </Label>
                        <Input
                          id="bu_email"
                          type="email"
                          required
                          placeholder="du@praxis-beispiel.de"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="bu_consent"
                          checked={consent}
                          onCheckedChange={(v) => setConsent(v === true)}
                        />
                        <Label
                          htmlFor="bu_consent"
                          className="text-xs text-muted-foreground leading-snug"
                        >
                          Ich stimme zu, dass KursRadar meine E-Mail-Adresse für den Versand des PDFs
                          und gelegentliche Fortbildungs-Hinweise verwendet. Widerruf jederzeit möglich.
                        </Label>
                      </div>
                      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            PDF anfordern <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-primary/40 bg-primary/5">
                  <CardContent className="p-6 text-center space-y-3">
                    <CheckCircle className="h-10 w-10 text-primary mx-auto" />
                    <h3 className="font-inter text-lg font-semibold text-card-foreground">
                      PDF wird erstellt
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Du bekommst dein Bildungsurlaub-PDF in wenigen Minuten an{' '}
                      <strong>{email}</strong>. Prüfe ggf. deinen Spam-Ordner.
                    </p>
                    <a
                      href="https://www.kurs-radar.com/signup?utm_source=rechner&utm_medium=bildungsurlaub_lead&utm_campaign=konfigurator_p0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                    >
                      Jetzt bei KursRadar anmelden <ArrowRight className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* --- Disclaimer --- */}
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                <div className="flex items-start gap-2 text-xs text-accent-foreground">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-accent" />
                  <p>
                    <strong>Hinweis:</strong> Die Angaben basieren auf öffentlich zugänglichen
                    Landesgesetzen (Stand Juli 2026) und ersetzen keine Rechtsberatung. Individueller
                    Anspruch kann von der Standard-Berechnung abweichen (Tarifvertrag, Betriebs-
                    vereinbarung, Beamtenrecht, PtW-Status). Vor konkretem Antrag bitte mit Personal-
                    abteilung oder Rechtsberatung prüfen.
                  </p>
                </div>
              </div>

              {/* --- Kurs-Link --- */}
              <a
                href={`https://www.kurs-radar.com/results?state=${bundesland?.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <p className="font-medium text-card-foreground">
                      Passende Fortbildungen in {bundesland?.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Alle KursRadar-Kurse mit BL-Filter. Frage vor Buchung beim Anbieter, ob
                      Bildungsurlaub-Anerkennung für dein Bundesland vorliegt.
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
              </a>

              {/* --- Quellen-Fussnote --- */}
              <div className="text-xs text-muted-foreground space-y-1 px-1">
                <p className="font-medium">Quellen:</p>
                <p>• {bundesland?.gesetz}</p>
                <p>• KursRadar Bildungsurlaub-Fact-Base (Stand 27.07.2026)</p>
                <p>• bildungsurlaub.de — Übersicht aller Landesgesetze</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full rounded-2xl bg-card/50 p-8 border border-dashed border-border flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <Calendar className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="font-inter text-xl font-medium text-muted-foreground">
                Hast du Anspruch auf Bildungsurlaub?
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
                Beantworte 4 Fragen und bekomme sofort ein persönliches PDF mit Anspruch, Muster-Antrag und passenden Fortbildungen.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">15/16</div>
                  <div className="text-xs text-muted-foreground">Bundesländer mit Gesetz</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">3–10</div>
                  <div className="text-xs text-muted-foreground">Tage pro Jahr</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100 %</div>
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
