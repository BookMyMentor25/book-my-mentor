
-- 1. Cleanup duplicate order_ids (keep oldest)
DELETE FROM public.job_subscriptions a
USING public.job_subscriptions b
WHERE a.order_id IS NOT NULL
  AND a.order_id = b.order_id
  AND a.created_at > b.created_at;

-- 2. Lock down RLS
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.job_subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.job_subscriptions;
DROP POLICY IF EXISTS "Users can create pending subscriptions" ON public.job_subscriptions;

CREATE POLICY "Users can create pending subscriptions"
ON public.job_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND payment_status = 'pending'
  AND status = 'pending_verification'
  AND amount > 0
);

-- 3. Unique transaction ID
CREATE UNIQUE INDEX IF NOT EXISTS job_subscriptions_order_id_unique
  ON public.job_subscriptions (lower(order_id))
  WHERE order_id IS NOT NULL;

-- 4. Validation trigger
CREATE OR REPLACE FUNCTION public.validate_job_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.order_id IS NULL OR length(trim(NEW.order_id)) < 8 OR length(trim(NEW.order_id)) > 32 THEN
      RAISE EXCEPTION 'Invalid UPI transaction ID. Must be 8-32 characters.';
    END IF;
    IF NEW.order_id !~ '^[A-Za-z0-9]+$' THEN
      RAISE EXCEPTION 'UPI transaction ID must be alphanumeric.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_job_subscription_trigger ON public.job_subscriptions;
CREATE TRIGGER validate_job_subscription_trigger
BEFORE INSERT ON public.job_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.validate_job_subscription();
