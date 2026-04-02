-- Migration: Move form_submissions from Crocodile Supabase to Sales CRM
-- Run this in Sales CRM project (jkandfizerwyimccwrov) SQL Editor

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  submission_data JSONB NOT NULL,
  consent_data JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public form submissions (calculator has no auth)
CREATE POLICY "Allow public form submissions"
ON public.form_submissions
FOR INSERT
WITH CHECK (true);

-- Prevent public reads (only via edge functions / service role)
CREATE POLICY "No public reads on form submissions"
ON public.form_submissions
FOR SELECT
USING (false);
