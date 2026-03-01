
-- Add apply_url column for external application links
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS apply_url text;

-- Add attachment_url column for job posting attachments
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS attachment_url text;
