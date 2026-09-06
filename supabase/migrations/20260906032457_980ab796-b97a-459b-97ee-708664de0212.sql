-- 1. Codes table (never exposed to the client)
CREATE TABLE public.live_project_codes (
  code text PRIMARY KEY,
  is_active boolean NOT NULL DEFAULT true,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.live_project_codes TO service_role;
ALTER TABLE public.live_project_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view live project codes" ON public.live_project_codes
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

INSERT INTO public.live_project_codes (code) VALUES
  ('VENUS1121'), ('JUPITER3166'), ('RED8800'), ('WHITE0007'), ('B23874'), ('GREY3774');

-- 2. Unlocks table
CREATE TABLE public.live_project_code_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);
GRANT SELECT ON public.live_project_code_unlocks TO authenticated;
GRANT ALL ON public.live_project_code_unlocks TO service_role;
ALTER TABLE public.live_project_code_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own unlock" ON public.live_project_code_unlocks
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all unlocks" ON public.live_project_code_unlocks
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_live_project_code_unlocks_updated_at
  BEFORE UPDATE ON public.live_project_code_unlocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Access check
CREATE OR REPLACE FUNCTION public.has_live_project_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.live_project_code_unlocks WHERE user_id = _user_id
  );
$$;
REVOKE ALL ON FUNCTION public.has_live_project_access(uuid) FROM anon;

-- 4. Redeem a code
CREATE OR REPLACE FUNCTION public.redeem_live_project_code(input_code text)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  matched text;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT false, 'Please sign in first.'; RETURN;
  END IF;
  IF input_code IS NULL OR length(trim(input_code)) < 4 OR length(trim(input_code)) > 32 THEN
    RETURN QUERY SELECT false, 'Invalid Project code.'; RETURN;
  END IF;

  SELECT c.code INTO matched FROM public.live_project_codes c
  WHERE upper(trim(input_code)) = upper(c.code) AND c.is_active;

  IF matched IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid Project code. Please use the code shared with you after course enrolment.'; RETURN;
  END IF;

  INSERT INTO public.live_project_code_unlocks (user_id, code)
  VALUES (uid, matched)
  ON CONFLICT (user_id) DO UPDATE SET code = EXCLUDED.code, updated_at = now();

  RETURN QUERY SELECT true, 'Project code applied.';
END;
$$;
REVOKE ALL ON FUNCTION public.redeem_live_project_code(text) FROM anon;

-- 5. Masked listing: hides company name, website, contact person, contact email,
--    project title and application link unless the caller unlocked with a Project code.
CREATE OR REPLACE FUNCTION public.list_live_projects()
RETURNS TABLE(
  id uuid, company_name text, company_website text, contact_person text,
  contact_email text, title text, summary text, domain text, engagement_type text,
  duration text, skills text[], openings integer, stipend text, apply_url text,
  location text, created_at timestamptz, unlocked boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH access AS (SELECT public.has_live_project_access(auth.uid()) AS ok)
  SELECT
    p.id,
    CASE WHEN a.ok THEN p.company_name ELSE NULL END,
    CASE WHEN a.ok THEN p.company_website ELSE NULL END,
    CASE WHEN a.ok THEN p.contact_person ELSE NULL END,
    CASE WHEN a.ok THEN p.contact_email ELSE NULL END,
    CASE WHEN a.ok THEN p.title ELSE NULL END,
    p.summary, p.domain, p.engagement_type, p.duration, p.skills, p.openings,
    p.stipend,
    CASE WHEN a.ok THEN p.apply_url ELSE NULL END,
    p.location, p.created_at, a.ok
  FROM public.live_projects p CROSS JOIN access a
  WHERE p.status = 'published'
  ORDER BY p.created_at DESC
  LIMIT 200;
$$;
GRANT EXECUTE ON FUNCTION public.list_live_projects() TO anon, authenticated;

-- 6. Domain counts (no sensitive data)
CREATE OR REPLACE FUNCTION public.live_project_domain_counts()
RETURNS TABLE(domain text, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.domain, count(*) FROM public.live_projects p
  WHERE p.status = 'published' GROUP BY p.domain;
$$;
GRANT EXECUTE ON FUNCTION public.live_project_domain_counts() TO anon, authenticated;

-- 7. Stop raw public reads of contact data
DROP POLICY IF EXISTS "Anyone can view published live projects" ON public.live_projects;
REVOKE SELECT ON public.live_projects FROM anon;