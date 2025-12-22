import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalculationExplanation } from './CalculationExplanation';
import { ProviderLeadForm } from './ProviderLeadForm';
import type { ProviderResults, ProviderInputs } from '@/types/provider';
import { formatCurrency } from '@/utils/providerCalculations';
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Euro, 
  Target, 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';

interface ProviderResultCardProps {
  results: ProviderResults;
  inputs: ProviderInputs;
}

export const ProviderResultCard = ({ results, inputs }: ProviderResultCardProps) => {
  const { reach, roi, priceRecommendation, stats } = results;

  const getPricePositionIcon = () => {
    switch (priceRecommendation.pricePosition) {
      case 'below':
        return <ArrowDownRight className="h-4 w-4 text-yellow-500" />;
      case 'above':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      default:
        return <Minus className="h-4 w-4 text-green-500" />;
    }
  };

  const getPricePositionText = () => {
    switch (priceRecommendation.pricePosition) {
      case 'below':
        return 'Unter Branchenschnitt';
      case 'above':
        return 'Über Branchenschnitt';
      default:
        return 'Im Branchenschnitt';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      {/* Platform Stats Overview */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-montserrat">
            <BarChart3 className="h-5 w-5 text-primary" />
            KursRadar Plattform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{stats.totalUniqueVisitors.toLocaleString('de-DE')}</p>
              <p className="text-xs text-muted-foreground">Besucher/Monat</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.events}</p>
              <p className="text-xs text-muted-foreground">Veranstaltungen</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.partners}</p>
              <p className="text-xs text-muted-foreground">Partner</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reach Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-montserrat">
            <Eye className="h-5 w-5 text-primary" />
            Reichweiten-Analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Potenzielle Views</span>
              </div>
              <p className="text-2xl font-bold text-card-foreground">
                {reach.estimatedViews.toLocaleString('de-DE')}
              </p>
              <p className="text-xs text-muted-foreground">pro Jahr</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <MousePointer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Erwartete Klicks</span>
              </div>
              <p className="text-2xl font-bold text-card-foreground">
                {reach.estimatedClicks.toLocaleString('de-DE')}
              </p>
              <p className="text-xs text-muted-foreground">pro Jahr</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-primary border-primary">
            <Globe className="h-3 w-3 mr-1" />
            {reach.regionName}
          </Badge>
          
          <CalculationExplanation explanation={reach.explanation} explanationType="reach" />
        </CardContent>
      </Card>

      {/* ROI Calculation */}
      <Card className="border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-montserrat">
            <TrendingUp className="h-5 w-5 text-green-500" />
            ROI-Kalkulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Aktueller Jahresumsatz</span>
              <span className="font-semibold">{formatCurrency(roi.currentRevenue)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Zusätzliche Teilnehmer
              </span>
              <span className="font-semibold text-green-500">+{roi.additionalParticipants}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Zusätzlicher Umsatz</span>
              <span className="font-semibold text-green-500">+{formatCurrency(roi.additionalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">KursRadar Provision (5%)</span>
              <span className="text-muted-foreground">-{formatCurrency(roi.kursRadarCommission)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-card-foreground">Netto-Mehrwert</span>
              <span className="text-xl font-bold text-green-500">+{formatCurrency(roi.netBenefit)}</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-green-500/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-3xl font-bold text-green-500">{roi.roiPercentage}%</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-500/50" />
          </div>
          
          <CalculationExplanation explanation={roi.explanation} explanationType="roi" />
        </CardContent>
      </Card>

      {/* Price Recommendation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-montserrat">
            <Euro className="h-5 w-5 text-primary" />
            Preisempfehlung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ihr aktueller Preis</p>
              <p className="text-xl font-bold">{formatCurrency(priceRecommendation.currentPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              {getPricePositionIcon()}
              <Badge variant="outline">{getPricePositionText()}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Branchenschnitt</p>
              <p className="text-lg font-semibold">{formatCurrency(priceRecommendation.industryAverage)}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
              <p className="text-xs text-muted-foreground">Empfohlener Preis</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(priceRecommendation.recommendedPrice)}</p>
            </div>
          </div>

          {priceRecommendation.optimizationPotential > 0 && (
            <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-600">Optimierungspotenzial</span>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                {formatCurrency(priceRecommendation.optimizationPotential)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Bei optimierter Auslastung (85%)
              </p>
            </div>
          )}
          
          <CalculationExplanation explanation={priceRecommendation.explanation} explanationType="price" />
        </CardContent>
      </Card>

      {/* Lead Form */}
      <ProviderLeadForm inputs={inputs} results={results} />
    </motion.div>
  );
};