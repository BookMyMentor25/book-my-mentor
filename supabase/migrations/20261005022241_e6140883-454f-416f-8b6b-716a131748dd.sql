CREATE OR REPLACE FUNCTION public.assign_lp_access_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  newcode text;
BEGIN
  IF EXISTS (SELECT 1 FROM public.live_project_access_codes WHERE user_id = NEW.user_id) THEN
    UPDATE public.live_project_access_codes
    SET subscription_id = NEW.id
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  END IF;

  LOOP
    newcode := 'LP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4)) || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.live_project_access_codes WHERE code = newcode);
  END LOOP;

  INSERT INTO public.live_project_access_codes (user_id, subscription_id, code)
  VALUES (NEW.user_id, NEW.id, newcode);

  RETURN NEW;
END;
$function$;