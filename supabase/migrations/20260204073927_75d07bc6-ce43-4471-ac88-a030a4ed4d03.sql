-- Create recruiters table
CREATE TABLE public.recruiters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    company_description TEXT,
    logo_url TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_postings table
CREATE TABLE public.job_postings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID NOT NULL REFERENCES public.recruiters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL, -- full-time, part-time, internship, contract
    experience_level TEXT, -- entry, mid, senior
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'INR',
    requirements TEXT[],
    skills TEXT[],
    benefits TEXT[],
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, shortlisted, rejected, hired
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Recruiters policies
CREATE POLICY "Anyone can view verified recruiters"
ON public.recruiters FOR SELECT
USING (is_verified = true);

CREATE POLICY "Users can view their own recruiter profile"
ON public.recruiters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recruiter profile"
ON public.recruiters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recruiter profile"
ON public.recruiters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all recruiters"
ON public.recruiters FOR ALL
USING (is_admin(auth.uid()));

-- Job postings policies
CREATE POLICY "Anyone can view active job postings"
ON public.job_postings FOR SELECT
USING (is_active = true);

CREATE POLICY "Recruiters can view their own job postings"
ON public.job_postings FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE id = recruiter_id AND user_id = auth.uid()
));

CREATE POLICY "Recruiters can create job postings"
ON public.job_postings FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE id = recruiter_id AND user_id = auth.uid()
));

CREATE POLICY "Recruiters can update their own job postings"
ON public.job_postings FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE id = recruiter_id AND user_id = auth.uid()
));

CREATE POLICY "Recruiters can delete their own job postings"
ON public.job_postings FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.recruiters 
    WHERE id = recruiter_id AND user_id = auth.uid()
));

CREATE POLICY "Admin can manage all job postings"
ON public.job_postings FOR ALL
USING (is_admin(auth.uid()));

-- Job applications policies
CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.job_applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view applications for their jobs"
ON public.job_applications FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.job_postings jp
    JOIN public.recruiters r ON jp.recruiter_id = r.id
    WHERE jp.id = job_id AND r.user_id = auth.uid()
));

CREATE POLICY "Recruiters can update applications for their jobs"
ON public.job_applications FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.job_postings jp
    JOIN public.recruiters r ON jp.recruiter_id = r.id
    WHERE jp.id = job_id AND r.user_id = auth.uid()
));

CREATE POLICY "Admin can manage all applications"
ON public.job_applications FOR ALL
USING (is_admin(auth.uid()));

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_recruiters_updated_at
    BEFORE UPDATE ON public.recruiters
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON public.job_postings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();