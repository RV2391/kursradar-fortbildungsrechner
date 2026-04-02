import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get n8n webhook URL from secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')

    // Parse request body
    const requestData = await req.json()
    console.log('📨 Secure webhook request received:', {
      email: requestData.email,
      company: requestData.company_name,
      timestamp: new Date().toISOString()
    })

    // Input validation
    if (!requestData.email || !requestData.company_name || !requestData.consent) {
      console.error('❌ Invalid input data:', requestData)
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(requestData.email)) {
      console.error('❌ Invalid email format:', requestData.email)
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      ...requestData,
      email: requestData.email.toLowerCase().trim(),
      company_name: requestData.company_name.trim(),
      consent: Boolean(requestData.consent.given)
    }

    // Store in database for GDPR compliance
    const { error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        email: sanitizedData.email,
        company_name: sanitizedData.company_name,
        submission_data: sanitizedData,
        consent_data: sanitizedData.consent,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })

    if (dbError) {
      console.error('❌ Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Database error' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Form submission stored in database')

    // Forward to n8n webhook for lead processing
    if (webhookUrl) {
      try {
        console.log('🔄 Forwarding to n8n webhook...')

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Supabase-Edge-Function/1.0'
          },
          body: JSON.stringify(sanitizedData)
        })

        if (!webhookResponse.ok) {
          console.error('❌ n8n webhook failed:', webhookResponse.status, await webhookResponse.text())
        } else {
          console.log('✅ n8n webhook delivered successfully')
        }
      } catch (webhookError) {
        console.error('❌ n8n webhook delivery error:', webhookError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})