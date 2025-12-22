
import { useCallback, useEffect, useRef } from 'react';
import { getTrackingSource } from '@/utils/environmentDetection';

interface GTMEvent {
  event: string;
  calculator_usage?: string;
  calculator_team_size?: number;
  calculator_dentists_count?: number;
  calculator_location_provided?: boolean;
  source?: 'standalone' | 'embed';
  [key: string]: any;
}

export const useGTMTracking = () => {
  const trackEvent = useCallback((eventData: GTMEvent) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Add source information to all events
      const enhancedEventData = {
        ...eventData,
        source: getTrackingSource()
      };
      
      console.log('🏷️ GTM Event:', enhancedEventData);
      
      // Enhanced debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.group(`GTM: ${enhancedEventData.event}`);
        console.log('Event Data:', enhancedEventData);
        console.log('DataLayer before push:', [...window.dataLayer]);
        window.dataLayer.push(enhancedEventData);
        console.log('DataLayer after push:', [...window.dataLayer]);
        console.groupEnd();
      } else {
        window.dataLayer.push(enhancedEventData);
      }
    } else {
      console.warn('⚠️ GTM: dataLayer not available');
    }
  }, []);

  const trackCalculatorInteraction = useCallback((action: string, additionalData?: Record<string, any>) => {
    trackEvent({
      event: 'calculator_interaction',
      calculator_usage: action,
      ...additionalData
    });
  }, [trackEvent]);

  const trackTeamSizeChange = useCallback((teamSize: number) => {
    trackCalculatorInteraction('team_size_changed', {
      calculator_team_size: teamSize
    });
  }, [trackCalculatorInteraction]);

  const trackDentistsCountChange = useCallback((dentistsCount: number) => {
    trackCalculatorInteraction('dentists_count_changed', {
      calculator_dentists_count: dentistsCount
    });
  }, [trackCalculatorInteraction]);

  const trackLocationProvided = useCallback(() => {
    trackCalculatorInteraction('location_provided', {
      calculator_location_provided: true
    });
  }, [trackCalculatorInteraction]);

  const trackCalculationCompleted = useCallback((
    savings: number, 
    teamSize: number, 
    dentistsCount: number, 
    hasLocation: boolean,
    timeSavingsHours?: number,
    timeSavingsValue?: number
  ) => {
    trackCalculatorInteraction('calculation_completed', {
      calculator_team_size: teamSize,
      calculator_dentists_count: dentistsCount,
      calculator_location_provided: hasLocation,
      savings_amount: Math.round(savings),
      time_savings_hours: timeSavingsHours && !isNaN(timeSavingsHours) ? Math.round(timeSavingsHours * 10) / 10 : 0,
      time_savings_value: timeSavingsValue && !isNaN(timeSavingsValue) ? Math.round(timeSavingsValue) : 0
    });
  }, [trackCalculatorInteraction]);

  const trackTimeSavingsViewed = useCallback((
    timeSavingsHours: number,
    timeSavingsValue: number,
    teamSize: number
  ) => {
    trackEvent({
      event: 'time_savings_viewed',
      time_savings_hours: Math.round(timeSavingsHours * 10) / 10,
      time_savings_value: Math.round(timeSavingsValue),
      calculator_team_size: teamSize
    });
  }, [trackEvent]);

  const trackFormStart = useCallback(() => {
    trackEvent({
      event: 'form_start',
      form_type: 'calculator_results'
    });
  }, [trackEvent]);

  const trackFormFieldComplete = useCallback((fieldName: string) => {
    trackEvent({
      event: 'form_field_complete',
      form_type: 'calculator_results',
      field_name: fieldName
    });
  }, [trackEvent]);

  // === Provider Calculator Tracking ===
  
  const trackProviderFormStart = useCallback(() => {
    trackEvent({
      event: 'provider_form_start',
      form_type: 'provider_calculator'
    });
  }, [trackEvent]);

  const trackProviderFieldChange = useCallback((fieldName: string, value: string | number | string[]) => {
    trackEvent({
      event: 'provider_field_change',
      form_type: 'provider_calculator',
      field_name: fieldName,
      field_value: Array.isArray(value) ? value.join(', ') : value
    });
  }, [trackEvent]);

  const trackProviderCalculation = useCallback((data: {
    coursesPerYear: number;
    averagePrice: number;
    region: string;
    categoriesCount: number;
    estimatedViews: number;
    additionalRevenue: number;
    roiPercentage: number;
  }) => {
    trackEvent({
      event: 'provider_calculation_completed',
      form_type: 'provider_calculator',
      courses_per_year: data.coursesPerYear,
      average_price: data.averagePrice,
      region: data.region,
      categories_count: data.categoriesCount,
      estimated_views: data.estimatedViews,
      additional_revenue: Math.round(data.additionalRevenue),
      roi_percentage: data.roiPercentage
    });
  }, [trackEvent]);

  const trackProviderResultsView = useCallback((section: 'reach' | 'roi' | 'price' | 'all') => {
    trackEvent({
      event: 'provider_results_viewed',
      form_type: 'provider_calculator',
      section_viewed: section
    });
  }, [trackEvent]);

  const trackProviderExplanationOpen = useCallback((explanationType: 'reach' | 'roi' | 'price') => {
    trackEvent({
      event: 'provider_explanation_opened',
      form_type: 'provider_calculator',
      explanation_type: explanationType
    });
  }, [trackEvent]);

  const trackProviderLeadFormStart = useCallback(() => {
    trackEvent({
      event: 'provider_lead_form_start',
      form_type: 'provider_lead'
    });
  }, [trackEvent]);

  const trackProviderLeadFieldComplete = useCallback((fieldName: string) => {
    trackEvent({
      event: 'provider_lead_field_complete',
      form_type: 'provider_lead',
      field_name: fieldName
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCalculatorInteraction,
    trackTeamSizeChange,
    trackDentistsCountChange,
    trackLocationProvided,
    trackCalculationCompleted,
    trackTimeSavingsViewed,
    trackFormStart,
    trackFormFieldComplete,
    // Provider tracking
    trackProviderFormStart,
    trackProviderFieldChange,
    trackProviderCalculation,
    trackProviderResultsView,
    trackProviderExplanationOpen,
    trackProviderLeadFormStart,
    trackProviderLeadFieldComplete
  };
};

// Custom hook for scroll tracking
export const useScrollTracking = (elementId: string, eventName: string) => {
  const hasTracked = useRef(false);
  const { trackEvent } = useGTMTracking();

  useEffect(() => {
    const handleScroll = () => {
      if (hasTracked.current) return;
      
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        hasTracked.current = true;
        trackEvent({
          event: eventName,
          element_id: elementId
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check immediately in case element is already visible
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId, eventName, trackEvent]);
};
