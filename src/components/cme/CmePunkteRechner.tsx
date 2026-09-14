import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ExternalLink, Wallet, Upload, BellRing } from "lucide-react";

const TARGET_POINTS = 125;
const KR_BASE = "https://www.kurs-radar.com";
const KR_WALLET_URL = `${KR_BASE}/credit-wallet`;
const KR_KURSE_URL = `${KR_BASE}/veranstaltungen`;

// Attribution: Rechner-Daten + UTMs an Ziel-URL anhängen
function buildCtaUrl(
  baseUrl: string,
  ctaType: "wallet" | "kurse",
  params: { endDate: string; currentPoints: number; missingPoints: number; pointsPerMonth: number },
) {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "rechner");
  url.searchParams.set("utm_medium", "cme_check");
  url.searchParams.set("utm_campaign", "cme_punkte_check");
  url.searchParams.set("utm_content", ctaType === "wallet" ? "wallet_cta" : "kurse_cta");
  url.searchParams.set("zyklus_ende", params.endDate);
  url.searchParams.set("aktuelle_punkte", String(params.currentPoints));
  if (ctaType === "kurse") {
    url.searchParams.set("min_points", String(Math.max(4, Math.ceil(params.pointsPerMonth))));
    url.searchParams.set("sort", "next");
  }
  return url.toString();
}

// GA4-Event via dataLayer (feuert wenn GTM den Container geladen hat)
function trackCtaClick(
  ctaType: "wallet" | "kurse",
  params: { endDate: string; currentPoints: number; missingPoints: number; pointsPerMonth: number },
) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "cme_rechner_cta",
    cta_type: ctaType,
    rechner_zyklus_ende: params.endDate,
    rechner_aktuelle_punkte: params.currentPoints,
    rechner_punkte_fehlend: params.missingPoints,
    rechner_punkte_pro_monat: params.pointsPerMonth,
  });
}

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoInFiveYears(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 5);
  return d.toISOString().slice(0, 10);
}

function monthsBetween(fromISO: string, toISO: string): number {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  return Math.max(0, months);
}

export const CmePunkteRechner = () => {
  const [endDate, setEndDate] = useState<string>(isoInFiveYears());
  const [currentPoints, setCurrentPoints] = useState<number>(0);

  const today = isoToday();

  const result = useMemo(() => {
    const missing = Math.max(0, TARGET_POINTS - currentPoints);
    const collected = Math.min(TARGET_POINTS, Math.max(0, currentPoints));
    const monthsLeft = monthsBetween(today, endDate);
    const pointsPerMonth =
      monthsLeft > 0 && missing > 0
        ? Math.round((missing / monthsLeft) * 10) / 10
        : 0;
    const daysPerYear =
      pointsPerMonth > 0 ? Math.round((pointsPerMonth * 12) / 7) : 0;
    const progressPct = Math.min(100, (collected / TARGET_POINTS) * 100);
    const targetReached = collected >= TARGET_POINTS;
    const zyklusAbgelaufen = monthsLeft <= 0 && !targetReached;

    return {
      missing,
      collected,
      monthsLeft,
      pointsPerMonth,
      daysPerYear,
      progressPct,
      targetReached,
      zyklusAbgelaufen,
    };
  }, [currentPoints, endDate, today]);

  const ctaParams = {
    endDate,
    currentPoints,
    missingPoints: result.missing,
    pointsPerMonth: result.pointsPerMonth,
  };
  const walletUrl = buildCtaUrl(KR_WALLET_URL, "wallet", ctaParams);
  const kurseUrl = buildCtaUrl(KR_KURSE_URL, "kurse", ctaParams);

  return (
    <Card className="max-w-3xl mx-auto p-6 sm:p-8 border-primary/20">
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div>
          <Label htmlFor="end-date" className="font-roboto">
            Zyklus-Enddatum (aus deinem KZV-Konto)
          </Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            min={today}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground/70 mt-1">
            Standard: heute + 5 Jahre
          </p>
        </div>
        <div>
          <Label htmlFor="current-points" className="font-roboto">
            Bereits gesammelte Punkte
          </Label>
          <Input
            id="current-points"
            type="number"
            min={0}
            max={200}
            step={1}
            value={currentPoints}
            onChange={(e) => setCurrentPoints(Number(e.target.value) || 0)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground/70 mt-1">
            Aus deinem KZV-Online-Konto ablesbar
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            {result.collected} von {TARGET_POINTS} Punkten gesammelt
          </span>
          <span>{Math.round(result.progressPct)} %</span>
        </div>
        <Progress value={result.progressPct} className="h-3" />
      </div>

      {result.targetReached ? (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden />
          <h3 className="font-sans text-xl font-semibold text-foreground mb-2">
            Fortbildungspflicht erfüllt
          </h3>
          <p className="text-muted-foreground">
            Du hast die 125 Punkte für den aktuellen Zyklus zusammen. Nach der Nachweis-Bestätigung durch deine KZV beginnt der nächste 5-Jahres-Zyklus.
          </p>
        </div>
      ) : result.zyklusAbgelaufen ? (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" aria-hidden />
          <h3 className="font-sans text-xl font-semibold text-foreground mb-2">
            Zyklus-Enddatum liegt in der Vergangenheit
          </h3>
          <p className="text-muted-foreground">
            Wenn dein Zyklus formal abgelaufen ist und der Nachweis noch fehlt, gilt § 95d Absatz 3 SGB V. Wir empfehlen zeitnah Rücksprache mit deiner KZV, um die aktuelle Konsequenz und Nachreichungs-Optionen zu klären.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-3xl font-sans font-bold text-primary">
                {result.missing}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Punkte fehlen noch
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-3xl font-sans font-bold text-primary">
                {result.monthsLeft}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Monate verbleiben
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-3xl font-sans font-bold text-primary">
                {result.pointsPerMonth}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Punkte pro Monat
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Realistisch entspricht das ca.{" "}
              <span className="font-semibold text-foreground">
                {result.daysPerYear} Fortbildungstage
              </span>{" "}
              pro Jahr, wenn ein Präsenztag im Schnitt 7 Punkte bringt.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Wallet className="h-6 w-6 text-primary flex-shrink-0 mt-1" aria-hidden />
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground">
                  Credit Wallet — dein CME-Konto in deiner Tasche
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vergiss das manuelle Punkte-Tracken. Wir übernehmen das Konto und erinnern dich rechtzeitig.
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Upload className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                <span>
                  <strong className="text-foreground">Automatische Punkte-Uploads</strong> aus jeder KursRadar-Buchung — dein Punktestand aktualisiert sich ohne Zutun.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <BellRing className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                <span>
                  <strong className="text-foreground">Zyklus-Erinnerung</strong> 6 Monate, 3 Monate und 1 Monat vor deinem Zyklus-Ende ({endDate}).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                <span>
                  <strong className="text-foreground">Deine Rechner-Daten übernommen</strong> — dein Enddatum und die {currentPoints} bereits gesammelten Punkte werden beim Signup direkt gespeichert.
                </span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="font-roboto flex-1"
                onClick={() => trackCtaClick("wallet", ctaParams)}
              >
                <a href={walletUrl} target="_blank" rel="noopener noreferrer">
                  Credit Wallet aktivieren
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-roboto flex-1"
                onClick={() => trackCtaClick("kurse", ctaParams)}
              >
                <a href={kurseUrl} target="_blank" rel="noopener noreferrer">
                  Passende Kurse ansehen
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-3 text-center">
              Kostenlos für Praxen und einzelne Zahnärzt:innen · keine versteckten Kosten
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
