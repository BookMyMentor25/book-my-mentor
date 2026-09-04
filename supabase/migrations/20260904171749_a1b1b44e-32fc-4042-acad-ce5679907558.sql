CREATE TABLE public.live_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by uuid NOT NULL,
  company_name text NOT NULL,
  company_website text,
  contact_person text NOT NULL,
  contact_email text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  domain text NOT NULL,
  engagement_type text NOT NULL DEFAULT 'internship',
  duration text,
  skills text[] NOT NULL DEFAULT '{}',
  openings integer NOT NULL DEFAULT 1,
  stipend text,
  apply_url text,
  location text,
  status text NOT NULL DEFAULT 'published',
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.live_projects TO anon;
GRANT SELECT, INSERT, UPDATE ON public.live_projects TO authenticated;
GRANT ALL ON public.live_projects TO service_role;

ALTER TABLE public.live_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published live projects"
ON public.live_projects FOR SELECT
USING (status = 'published');

CREATE POLICY "Submitters can view their own live projects"
ON public.live_projects FOR SELECT TO authenticated
USING (submitted_by = auth.uid());

CREATE POLICY "Admins can view all live projects"
ON public.live_projects FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Signed-in users can submit live projects"
ON public.live_projects FOR INSERT TO authenticated
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Submitters can update their own live projects"
ON public.live_projects FOR UPDATE TO authenticated
USING (submitted_by = auth.uid())
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Admins can update any live project"
ON public.live_projects FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete live projects"
ON public.live_projects FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE INDEX idx_live_projects_status_created ON public.live_projects (status, created_at DESC);
CREATE INDEX idx_live_projects_domain ON public.live_projects (domain);

CREATE OR REPLACE FUNCTION public.validate_live_project()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  IF length(trim(NEW.company_name)) < 2 OR length(trim(NEW.company_name)) > 120 THEN
    RAISE EXCEPTION 'Company name must be between 2 and 120 characters.';
  END IF;
  IF length(trim(NEW.title)) < 8 OR length(trim(NEW.title)) > 140 THEN
    RAISE EXCEPTION 'Project title must be between 8 and 140 characters.';
  END IF;
  IF length(trim(NEW.summary)) < 60 OR length(trim(NEW.summary)) > 1200 THEN
    RAISE EXCEPTION 'Project summary must be between 60 and 1200 characters.';
  END IF;
  IF NEW.contact_email !~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid contact email address.';
  END IF;
  IF NEW.openings < 1 OR NEW.openings > 50 THEN
    RAISE EXCEPTION 'Openings must be between 1 and 50.';
  END IF;
  IF array_length(NEW.skills, 1) IS NOT NULL AND array_length(NEW.skills, 1) > 15 THEN
    RAISE EXCEPTION 'Please list at most 15 skills.';
  END IF;

  IF TG_OP = 'INSERT' THEN
    SELECT count(*) INTO recent_count
    FROM public.live_projects
    WHERE submitted_by = NEW.submitted_by
      AND created_at > now() - interval '1 hour';
    IF recent_count >= 3 THEN
      RAISE EXCEPTION 'Submission limit reached. Please try again later.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_live_project_trigger
BEFORE INSERT OR UPDATE ON public.live_projects
FOR EACH ROW EXECUTE FUNCTION public.validate_live_project();

CREATE TRIGGER update_live_projects_updated_at
BEFORE UPDATE ON public.live_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();