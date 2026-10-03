CREATE TABLE public.live_project_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_domain text,
  motivation text,
  amount integer NOT NULL DEFAULT 2999,
  status text NOT NULL DEFAULT 'pending_review',
  payment_reference text,
  admin_note text,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.live_project_subscriptions TO authenticated;
GRANT ALL ON public.live_project_subscriptions TO service_role;
ALTER TABLE public.live_project_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own LP subscriptions" ON public.live_project_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users create own LP subscription" ON public.live_project_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update LP subscriptions" ON public.live_project_subscriptions FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.live_project_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  subscription_id uuid NOT NULL REFERENCES public.live_project_subscriptions(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.live_project_access_codes TO authenticated;
GRANT ALL ON public.live_project_access_codes TO service_role;
ALTER TABLE public.live_project_access_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins view access codes" ON public.live_project_access_codes FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.validate_lp_subscription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending_review'; NEW.amount := 2999;
    NEW.starts_at := NULL; NEW.expires_at := NULL; NEW.admin_note := NULL; NEW.payment_reference := NULL;
    IF length(trim(NEW.full_name)) < 2 OR length(trim(NEW.full_name)) > 100 THEN RAISE EXCEPTION 'Please enter your full name.'; END IF;
    IF NEW.email !~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN RAISE EXCEPTION 'Invalid email address.'; END IF;
    IF NEW.phone !~ '^[6-9][0-9]{9}$' THEN RAISE EXCEPTION 'Please enter a valid 10-digit mobile number.'; END IF;
    IF NEW.motivation IS NOT NULL AND length(NEW.motivation) > 600 THEN RAISE EXCEPTION 'Motivation must be under 600 characters.'; END IF;
    SELECT count(*) INTO c FROM public.live_project_subscriptions
      WHERE user_id = NEW.user_id AND (status IN ('pending_review','awaiting_payment') OR (status = 'active' AND expires_at > now()));
    IF c > 0 THEN RAISE EXCEPTION 'You already have an open or active Live Projects subscription order.'; END IF;
    SELECT count(*) INTO c FROM public.live_project_subscriptions WHERE user_id = NEW.user_id AND created_at > now() - interval '24 hours';
    IF c >= 3 THEN RAISE EXCEPTION 'Too many orders today. Please try again later.'; END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status NOT IN ('pending_review','awaiting_payment','active','rejected','expired') THEN RAISE EXCEPTION 'Invalid status.'; END IF;
    IF NEW.status = 'active' AND OLD.status <> 'active' THEN
      NEW.starts_at := now(); NEW.expires_at := now() + interval '3 months';
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_lp_subscription_trg BEFORE INSERT OR UPDATE ON public.live_project_subscriptions FOR EACH ROW EXECUTE FUNCTION public.validate_lp_subscription();
CREATE TRIGGER update_lp_subscriptions_updated_at BEFORE UPDATE ON public.live_project_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.assign_lp_access_code()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE newcode text;
BEGIN
  IF EXISTS (SELECT 1 FROM public.live_project_access_codes WHERE user_id = NEW.user_id) THEN
    UPDATE public.live_project_access_codes SET subscription_id = NEW.id WHERE user_id = NEW.user_id;
    RETURN NEW;
  END IF;
  LOOP
    newcode := 'LP-' || upper(substr(encode(gen_random_bytes(8),'hex'),1,4)) || '-' || upper(substr(encode(gen_random_bytes(8),'hex'),1,4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.live_project_access_codes WHERE code = newcode);
  END LOOP;
  INSERT INTO public.live_project_access_codes (user_id, subscription_id, code) VALUES (NEW.user_id, NEW.id, newcode);
  RETURN NEW;
END; $$;
CREATE TRIGGER assign_lp_access_code_trg AFTER INSERT ON public.live_project_subscriptions FOR EACH ROW EXECUTE FUNCTION public.assign_lp_access_code();

ALTER TABLE public.live_projects ADD COLUMN IF NOT EXISTS interview_required boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.has_live_project_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.live_project_code_unlocks u
                JOIN public.live_project_access_codes c ON c.user_id = u.user_id AND upper(c.code) = upper(u.code)
                WHERE u.user_id = _user_id)
    AND EXISTS (SELECT 1 FROM public.live_project_subscriptions s
                WHERE s.user_id = _user_id AND s.status = 'active' AND s.expires_at > now());
$$;

CREATE OR REPLACE FUNCTION public.redeem_live_project_code(input_code text)
RETURNS TABLE(success boolean, message text) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); matched text;
BEGIN
  IF uid IS NULL THEN RETURN QUERY SELECT false, 'Please sign in first.'; RETURN; END IF;
  IF input_code IS NULL OR length(trim(input_code)) < 4 OR length(trim(input_code)) > 32 THEN
    RETURN QUERY SELECT false, 'Invalid Project Accessible Code.'; RETURN; END IF;
  SELECT c.code INTO matched FROM public.live_project_access_codes c
    WHERE c.user_id = uid AND upper(trim(input_code)) = upper(c.code);
  IF matched IS NULL THEN
    RETURN QUERY SELECT false, 'This code is not valid for your account.'; RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.live_project_subscriptions s WHERE s.user_id = uid AND s.status = 'active' AND s.expires_at > now()) THEN
    RETURN QUERY SELECT false, 'Your Live Projects subscription is not active yet.'; RETURN; END IF;
  INSERT INTO public.live_project_code_unlocks (user_id, code) VALUES (uid, matched)
    ON CONFLICT (user_id) DO UPDATE SET code = EXCLUDED.code, updated_at = now();
  RETURN QUERY SELECT true, 'Project Accessible Code applied.';
END; $$;

DROP FUNCTION IF EXISTS public.list_live_projects();
CREATE FUNCTION public.list_live_projects()
RETURNS TABLE(id uuid, company_name text, company_website text, contact_person text, contact_email text, title text, summary text, domain text, engagement_type text, duration text, skills text[], openings integer, stipend text, apply_url text, location text, interview_required boolean, created_at timestamptz, unlocked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH access AS (SELECT public.has_live_project_access(auth.uid()) AS ok)
  SELECT p.id,
    CASE WHEN a.ok THEN p.company_name END, CASE WHEN a.ok THEN p.company_website END,
    CASE WHEN a.ok THEN p.contact_person END, CASE WHEN a.ok THEN p.contact_email END,
    CASE WHEN a.ok THEN p.title END,
    p.summary, p.domain, p.engagement_type, p.duration, p.skills, p.openings, p.stipend,
    CASE WHEN a.ok THEN p.apply_url END, p.location, p.interview_required, p.created_at, a.ok
  FROM public.live_projects p CROSS JOIN access a
  WHERE p.status = 'published' ORDER BY p.created_at DESC LIMIT 200;
$$;
GRANT EXECUTE ON FUNCTION public.list_live_projects() TO anon, authenticated;
UPDATE public.live_project_codes SET is_active = false;