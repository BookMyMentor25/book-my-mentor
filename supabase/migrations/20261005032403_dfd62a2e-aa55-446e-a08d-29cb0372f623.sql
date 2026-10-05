CREATE OR REPLACE FUNCTION public.has_live_project_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT _user_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.live_project_code_unlocks u
      JOIN public.live_project_access_codes c
        ON c.user_id = u.user_id AND upper(c.code) = upper(u.code)
      WHERE u.user_id = _user_id
    );
$$;

CREATE OR REPLACE FUNCTION public.redeem_live_project_code(input_code text)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); matched text;
BEGIN
  IF uid IS NULL THEN RETURN QUERY SELECT false, 'Please sign in first.'; RETURN; END IF;
  IF input_code IS NULL OR length(trim(input_code)) < 4 OR length(trim(input_code)) > 32 THEN
    RETURN QUERY SELECT false, 'Invalid Project Accessible Code.'; RETURN; END IF;
  SELECT c.code INTO matched FROM public.live_project_access_codes c
    WHERE c.user_id = uid AND upper(trim(input_code)) = upper(c.code);
  IF matched IS NULL THEN
    RETURN QUERY SELECT false, 'This code is not valid for your account.'; RETURN; END IF;
  INSERT INTO public.live_project_code_unlocks (user_id, code) VALUES (uid, matched)
    ON CONFLICT (user_id) DO UPDATE SET code = EXCLUDED.code, updated_at = now();
  RETURN QUERY SELECT true, 'Project Accessible Code applied.';
END;
$$;