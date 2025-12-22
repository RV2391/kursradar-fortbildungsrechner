import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProviderResultCard } from './ProviderResultCard';
import { useKursRadarStats } from '@/hooks/useKursRadarStats';
import { calculateProviderResults } from '@/utils/providerCalculations';
import { DENTAL_CATEGORIES, DENTAL_BENCHMARKS, type ProviderInputs, type ProviderResults } from '@/types/provider';
import { Calculator, TrendingUp, Users, MapPin, X } from 'lucide-react';

const defaultInputs: ProviderInputs = {
  coursesPerYear: 12,
  averagePrice: DENTAL_BENCHMARKS.averageCoursePrice,
  maxParticipants: 15,
  averageOccupancy: 70,
  postalCode: '',
  categories: [],
  hardToFillCourses: '',
};

export const ProviderCalculator = () => {
  const [inputs, setInputs] = useState<ProviderInputs>(defaultInputs);
  const [results, setResults] = useState<ProviderResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { data: stats, isLoading: statsLoading } = useKursRadarStats();

  const handleInputChange = (field: keyof ProviderInputs, value: string | number | string[]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setInputs((prev) => {
      const currentCategories = prev.categories;
      if (currentCategories.includes(category)) {
        return { ...prev, categories: currentCategories.filter((c) => c !== category) };
      } else {
        return { ...prev, categories: [...currentCategories, category] };
      }
    });
  };

  const handleCalculate = async () => {
    if (!stats) return;
    
    setIsCalculating(true);
    try {
      const calculatedResults = await calculateProviderResults(inputs, stats);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const isFormValid = inputs.postalCode.length >= 4 && inputs.categories.length > 0;

  return (
    <div className="w-full">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 rounded-2xl bg-card p-6 shadow-lg border"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h2 className="font-montserrat text-2xl font-semibold text-card-foreground">
                Anbieter-Kalkulator
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-roboto">
              Berechne dein Potenzial auf KursRadar
            </p>
          </div>

          <div className="space-y-5">
            {/* Courses per year */}
            <div className="space-y-2">
              <Label htmlFor="coursesPerYear" className="flex items-center gap-2 text-card-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                Kurse pro Jahr
              </Label>
              <Select
                value={inputs.coursesPerYear.toString()}
                onValueChange={(value) => handleInputChange('coursesPerYear', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Anzahl wählen" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Kurs' : 'Kurse'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Average price */}
            <div className="space-y-2">
              <Label htmlFor="averagePrice" className="text-card-foreground">
                Durchschnittlicher Kurspreis (€)
              </Label>
              <Input
                id="averagePrice"
                type="number"
                min={50}
                max={5000}
                step={10}
                value={inputs.averagePrice}
                onChange={(e) => handleInputChange('averagePrice', parseInt(e.target.value) || 0)}
                className="font-roboto"
              />
              <p className="text-xs text-muted-foreground">
                Branchendurchschnitt: {DENTAL_BENCHMARKS.averageCoursePrice}€
              </p>
            </div>

            {/* Max participants */}
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="flex items-center gap-2 text-card-foreground">
                <Users className="h-4 w-4 text-primary" />
                Max. Teilnehmer pro Kurs
              </Label>
              <Select
                value={inputs.maxParticipants.toString()}
                onValueChange={(value) => handleInputChange('maxParticipants', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Anzahl wählen" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Teilnehmer
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Average occupancy */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-card-foreground">Durchschnittliche Auslastung</Label>
                <span className="text-sm font-medium text-primary">{inputs.averageOccupancy}%</span>
              </div>
              <Slider
                value={[inputs.averageOccupancy]}
                onValueChange={([value]) => handleInputChange('averageOccupancy', value)}
                min={20}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Branchendurchschnitt: {DENTAL_BENCHMARKS.averageOccupancy}%
              </p>
            </div>

            {/* Postal code / Region */}
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="flex items-center gap-2 text-card-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Postleitzahl / Einzugsgebiet
              </Label>
              <Input
                id="postalCode"
                type="text"
                maxLength={5}
                placeholder="z.B. 80331"
                value={inputs.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, ''))}
                className="font-roboto"
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-card-foreground">Kurskategorien</Label>
              <div className="flex flex-wrap gap-2">
                {DENTAL_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={inputs.categories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-primary/80"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    {inputs.categories.includes(category) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {inputs.categories.length} Kategorie(n) ausgewählt
              </p>
            </div>

            {/* Hard to fill courses (optional) */}
            <div className="space-y-2">
              <Label htmlFor="hardToFillCourses" className="text-card-foreground">
                Schwer zu besetzende Kurse (optional)
              </Label>
              <Textarea
                id="hardToFillCourses"
                placeholder="z.B. Spezialkurs Implantologie, Wochenend-Seminare..."
                value={inputs.hardToFillCourses}
                onChange={(e) => handleInputChange('hardToFillCourses', e.target.value)}
                className="font-roboto min-h-[80px]"
              />
            </div>
          </div>

          {/* Calculate button */}
          <Button
            onClick={handleCalculate}
            disabled={!isFormValid || isCalculating || statsLoading}
            className="w-full"
            size="lg"
          >
            {isCalculating ? 'Berechnung läuft...' : 'Potenzial berechnen'}
          </Button>
          
          {!isFormValid && (
            <p className="text-xs text-muted-foreground text-center">
              Bitte PLZ und mindestens eine Kategorie auswählen
            </p>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex flex-col items-start justify-start">
          {results ? (
            <ProviderResultCard results={results} inputs={inputs} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full rounded-2xl bg-card/50 p-8 border border-dashed border-border flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <Calculator className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="font-montserrat text-xl font-medium text-muted-foreground">
                Dein Potenzial wartet
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
                Fülle das Formular aus und klicke auf "Potenzial berechnen" um deine Reichweite, ROI und Preisempfehlungen zu sehen.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
