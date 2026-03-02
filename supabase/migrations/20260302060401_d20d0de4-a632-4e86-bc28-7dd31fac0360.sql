
-- Add contact_email field for recruiters who want to receive resumes via email
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS contact_email text;

-- Add company_name and company_website for admin-posted jobs (without recruiter)
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS company_website text;

-- Make recruiter_id nullable so admin can post without a registered recruiter
ALTER TABLE public.job_postings ALTER COLUMN recruiter_id DROP NOT NULL;
