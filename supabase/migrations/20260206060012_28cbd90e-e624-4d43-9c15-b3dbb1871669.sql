-- Add policy for admin to update job postings
CREATE POLICY "Admin can update all job postings"
ON public.job_postings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Add policy for admin to view all recruiters
CREATE POLICY "Admin can view all recruiters"
ON public.recruiters
FOR SELECT
USING (is_admin(auth.uid()));

-- Add policy for admin to update all recruiters  
CREATE POLICY "Admin can update all recruiters"
ON public.recruiters
FOR UPDATE
USING (is_admin(auth.uid()));

-- Update inquiries to allow admin updates
CREATE POLICY "Admin can update inquiries"
ON public.inquiries
FOR UPDATE
USING (is_admin(auth.uid()));