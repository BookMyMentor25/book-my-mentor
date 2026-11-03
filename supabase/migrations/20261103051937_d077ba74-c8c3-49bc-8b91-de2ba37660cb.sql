ALTER TABLE public.live_project_subscriptions
  ADD COLUMN coupon_applied text,
  ADD COLUMN discount_amount integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.validate_lp_subscription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c integer; v_code text; v_row public.coupons%ROWTYPE;
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending_review'; NEW.starts_at := NULL; NEW.expires_at := NULL; NEW.admin_note := NULL; NEW.payment_reference := NULL;
    IF length(trim(NEW.full_name)) < 2 OR length(trim(NEW.full_name)) > 100 THEN RAISE EXCEPTION 'Please enter your full name.'; END IF;
    IF NEW.email !~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN RAISE EXCEPTION 'Invalid email address.'; END IF;
    IF NEW.phone !~ '^[6-9][0-9]{9}$' THEN RAISE EXCEPTION 'Please enter a valid 10-digit mobile number.'; END IF;
    IF NEW.motivation IS NOT NULL AND length(NEW.motivation) > 600 THEN RAISE EXCEPTION 'Motivation must be under 600 characters.'; END IF;
    SELECT count(*) INTO c FROM public.live_project_subscriptions
      WHERE user_id = NEW.user_id AND (status IN ('pending_review','awaiting_payment') OR (status = 'active' AND expires_at > now()));
    IF c > 0 THEN RAISE EXCEPTION 'You already have an open or active Live Projects subscription order.'; END IF;
    SELECT count(*) INTO c FROM public.live_project_subscriptions WHERE user_id = NEW.user_id AND created_at > now() - interval '24 hours';
    IF c >= 3 THEN RAISE EXCEPTION 'Too many orders today. Please try again later.'; END IF;

    v_code := NULLIF(upper(trim(coalesce(NEW.coupon_applied, ''))), '');
    IF v_code IS NULL THEN
      NEW.coupon_applied := NULL;
      NEW.discount_amount := 0;
    ELSE
      SELECT * INTO v_row FROM public.coupons WHERE lower(coupon_code) = lower(v_code);
      IF NOT FOUND THEN RAISE EXCEPTION 'Invalid coupon code.'; END IF;
      IF v_row.is_active = false THEN RAISE EXCEPTION 'This coupon is not active.'; END IF;
      IF v_row.valid_from IS NOT NULL AND now() < v_row.valid_from THEN RAISE EXCEPTION 'This coupon is not yet valid.'; END IF;
      IF v_row.valid_until IS NOT NULL AND now() > v_row.valid_until THEN RAISE EXCEPTION 'This coupon has expired.'; END IF;
      IF v_row.max_uses IS NOT NULL AND coalesce(v_row.current_uses, 0) >= v_row.max_uses THEN RAISE EXCEPTION 'This coupon has reached its usage limit.'; END IF;
      IF v_row.applies_to IS NOT NULL AND v_row.applies_to <> 'live_project_subscription' THEN RAISE EXCEPTION 'This coupon is not valid for the Live Projects plan.'; END IF;
      IF coalesce(v_row.is_reusable, true) = false THEN
        SELECT count(*) INTO c FROM public.live_project_subscriptions WHERE user_id = NEW.user_id AND upper(coupon_applied) = upper(v_code);
        IF c > 0 THEN RAISE EXCEPTION 'You have already used this coupon.'; END IF;
      END IF;
      NEW.discount_amount := LEAST(2999, round(coalesce(v_row.discount_percent, 0) / 100.0 * 2999) + coalesce(v_row.discount_amount, 0))::int;
      NEW.coupon_applied := v_code;
      UPDATE public.coupons SET current_uses = coalesce(current_uses, 0) + 1 WHERE lower(coupon_code) = lower(v_code);
    END IF;
    NEW.amount := 2999 - coalesce(NEW.discount_amount, 0);
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status NOT IN ('pending_review','awaiting_payment','active','rejected','expired') THEN RAISE EXCEPTION 'Invalid status.'; END IF;
    IF NEW.status = 'active' AND OLD.status <> 'active' THEN
      NEW.starts_at := now(); NEW.expires_at := now() + interval '3 months';
    END IF;
    NEW.coupon_applied := OLD.coupon_applied;
    NEW.discount_amount := OLD.discount_amount;
    NEW.amount := OLD.amount;
  END IF;
  RETURN NEW;
END; $$;