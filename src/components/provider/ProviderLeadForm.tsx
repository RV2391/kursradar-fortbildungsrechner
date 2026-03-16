import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGTMTracking } from '@/hooks/useGTMTracking';
import { supabase } from '@/integrations/supabase/client';
import type { ProviderInputs, ProviderResults } from '@/types/provider';
import { formatCurrency } from '@/utils/providerCalculations';
import { REGIONS } from '@/types/provider';
import { Loader2, Send, Building2, Mail, User, Phone, MessageSquare } from 'lucide-react';

interface ProviderLeadFormProps {
  inputs: ProviderInputs;
  results: ProviderResults;
}

export const ProviderLeadForm = ({ inputs, results }: ProviderLeadFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedFormStart = useRef(false);
  const { toast } = useToast();
  const { trackEvent, trackProviderLeadFormStart, trackProviderLeadFieldComplete } = useGTMTracking();

  const trackFormStartOnce = () => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackProviderLeadFormStart();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    trackFormStartOnce();
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: keyof typeof formData) => {
    if (formData[field]) {
      trackProviderLeadFieldComplete(field);
    }
  };

  const isFormValid = formData.companyName && formData.email && consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Bitte fülle alle Pflichtfelder aus und stimme den Bedingungen zu.',
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Processing provider lead form submission...');

    try {
      // IP-Adresse für DSGVO-Compliance ermitteln
      let userIP = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIP = ipData.ip;
      } catch (error) {
        console.warn('Could not retrieve IP address:', error);
        userIP = 'unknown';
      }

      const consentTimestamp = new Date().toISOString();
      const region = REGIONS[inputs.region];

      const webhookData = {
        // Lead-Daten
        email: formData.email.toLowerCase().trim(),
        company_name: formData.companyName.trim(),
        contact_name: formData.contactName.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        
        // Anbieter-Eingaben
        provider_inputs: {
          courses_per_year: inputs.coursesPerYear,
          average_price: inputs.averagePrice,
          max_participants: inputs.maxParticipants,
          average_occupancy: inputs.averageOccupancy,
          region: region.name,
          region_id: inputs.region,
          categories: inputs.categories,
          hard_to_fill_courses: inputs.hardToFillCourses || '',
        },
        
        // Berechnete Ergebnisse
        calculated_results: {
          // Reichweite
          potential_reach: results.reach.potentialReach,
          estimated_views: results.reach.estimatedViews,
          estimated_clicks: results.reach.estimatedClicks,
          // ROI
          current_revenue: results.roi.currentRevenue,
          additional_participants: results.roi.additionalParticipants,
          additional_revenue: results.roi.additionalRevenue,
          kursradar_commission: results.roi.kursRadarCommission,
          net_benefit: results.roi.netBenefit,
          roi_percentage: results.roi.roiPercentage,
          // Preis
          current_price: results.priceRecommendation.currentPrice,
          recommended_price: results.priceRecommendation.recommendedPrice,
          price_position: results.priceRecommendation.pricePosition,
          optimization_potential: results.priceRecommendation.optimizationPotential,
        },
        
        // Plattform-Statistiken
        platform_stats: {
          total_visitors: results.stats.totalUniqueVisitors,
          total_events: results.stats.events,
          total_partners: results.stats.partners,
        },
        
        // Consent-Daten (DSGVO)
        consent: {
          given: consent,
          timestamp: consentTimestamp,
          ip_address: userIP,
          user_agent: navigator.userAgent,
          privacy_policy_version: '2025-01',
          opt_in_method: 'provider_calculator_form',
          page_url: window.location.href,
        },
        
        // Meta
        timestamp: consentTimestamp,
        source: 'KursRadar Provider Calculator',
        page_url: window.location.href,
        lead_type: 'provider',
      };

      // Send to secure Supabase Edge Function
      console.log('Sending provider lead data:', webhookData);

      const { data, error } = await supabase.functions.invoke('secure-webhook', {
        body: webhookData,
      });

      if (error) {
        throw new Error(`Secure webhook failed: ${error.message}`);
      }

      console.log('Provider lead submitted successfully:', data);

      // GTM Event für Lead-Tracking
      trackEvent({
        event: 'provider_lead_submission',
        form_type: 'provider_calculator',
        email: formData.email,
        company: formData.companyName,
        courses_per_year: inputs.coursesPerYear,
        average_price: inputs.averagePrice,
        region: region.name,
        categories_count: inputs.categories.length,
        estimated_views: results.reach.estimatedViews,
        estimated_revenue: results.roi.additionalRevenue,
        roi_percentage: results.roi.roiPercentage,
        page_url: window.location.href,
      });

      toast({
        title: 'Erfolgreich gesendet!',
        description: 'Vielen Dank für Ihr Interesse. Wir melden uns zeitnah bei Ihnen.',
      });

      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: '',
      });
      setConsent(false);
    } catch (error) {
      console.error('Provider lead form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-montserrat">
            <Send className="h-5 w-5 text-primary" />
            Jetzt Partner werden
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Erhalten Sie eine persönliche Beratung und erfahren Sie, wie KursRadar Ihre Reichweite steigern kann.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2 text-card-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Name der Institution*
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                onBlur={() => handleFieldBlur('companyName')}
                placeholder="z.B. Dental Academy München"
                required
                disabled={isSubmitting}
                className="bg-input"
              />
            </div>

            {/* Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="contactName" className="flex items-center gap-2 text-card-foreground">
                <User className="h-4 w-4 text-primary" />
                Ansprechpartner
              </Label>
              <Input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                onBlur={() => handleFieldBlur('contactName')}
                placeholder="Vor- und Nachname"
                disabled={isSubmitting}
                className="bg-input"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-card-foreground">
                <Mail className="h-4 w-4 text-primary" />
                E-Mail-Adresse*
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder="kontakt@ihre-institution.de"
                required
                disabled={isSubmitting}
                className="bg-input"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-card-foreground">
                <Phone className="h-4 w-4 text-primary" />
                Telefon (optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleFieldBlur('phone')}
                placeholder="+49 123 456789"
                disabled={isSubmitting}
                className="bg-input"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2 text-card-foreground">
                <MessageSquare className="h-4 w-4 text-primary" />
                Nachricht (optional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                onBlur={() => handleFieldBlur('message')}
                placeholder="Haben Sie spezielle Fragen oder Anmerkungen?"
                disabled={isSubmitting}
                className="bg-input min-h-[80px]"
              />
            </div>

            {/* Summary of calculated values */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
              <p className="font-medium text-card-foreground">Ihre Kalkulation:</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Geschätzte Views/Jahr:</span>
                <span className="text-card-foreground font-medium">{results.reach.estimatedViews.toLocaleString('de-DE')}</span>
                <span>Zusätzlicher Umsatz:</span>
                <span className="text-green-500 font-medium">+{formatCurrency(results.roi.additionalRevenue)}</span>
                <span>ROI:</span>
                <span className="text-green-500 font-medium">{results.roi.roiPercentage}%</span>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="providerConsent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                disabled={isSubmitting}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="providerConsent" className="text-sm leading-relaxed text-muted-foreground">
                Ich bin damit einverstanden, dass meine Daten zur Kontaktaufnahme und Beratung verarbeitet werden. 
                Die Daten werden DSGVO-konform gespeichert. Weitere Informationen finden Sie in unserer{' '}
                <a
                  href="https://www.kurs-radar.com/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Datenschutzerklärung
                </a>
                .*
              </Label>
            </div>

            {/* Loading indicator */}
            {isSubmitting && (
              <div className="bg-primary/10 border-l-4 border-primary p-3 rounded flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <p className="text-sm text-foreground">
                  Ihre Anfrage wird übermittelt...
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Unverbindlich anfragen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};