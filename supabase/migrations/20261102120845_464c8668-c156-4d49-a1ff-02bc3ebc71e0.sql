CREATE OR REPLACE FUNCTION public.list_live_projects()
 RETURNS TABLE(id uuid, company_name text, company_website text, contact_person text, contact_email text, title text, summary text, domain text, engagement_type text, duration text, skills text[], openings integer, stipend text, apply_url text, location text, interview_required boolean, created_at timestamp with time zone, unlocked boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH access AS (
    SELECT
      public.has_live_project_access(auth.uid()) AS ok,
      public.is_admin(auth.uid()) AS admin
  )
  SELECT p.id,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.company_name END,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.company_website END,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.contact_person END,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.contact_email END,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.title END,
    p.summary, p.domain, p.engagement_type, p.duration, p.skills, p.openings, p.stipend,
    CASE WHEN a.ok OR p.submitted_by = auth.uid() OR a.admin THEN p.apply_url END,
    p.location, p.interview_required, p.created_at,
    a.ok OR p.submitted_by = auth.uid() OR a.admin AS unlocked
  FROM public.live_projects p
  CROSS JOIN access a
  WHERE a.admin OR p.status = 'published'
  ORDER BY p.created_at DESC
  LIMIT 200;
$function$;