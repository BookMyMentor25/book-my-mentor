
-- Insert CHAMPION coupon: 80% off, valid for 3 months, only for job subscription
INSERT INTO coupons (coupon_code, discount_percent, discount_amount, discount_type, description, is_active, valid_from, valid_until, max_uses, current_uses, is_reusable, applies_to)
VALUES ('CHAMPION', 80, 0, 'percentage', '80% off on Jobs & Internships subscription', true, now(), now() + interval '3 months', NULL, 0, false, 'job_subscription');

-- Create table to track per-user coupon usage for job subscriptions
CREATE TABLE public.job_subscription_coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  coupon_code text NOT NULL,
  used_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, coupon_code)
);

ALTER TABLE public.job_subscription_coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coupon usage"
ON public.job_subscription_coupon_usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage"
ON public.job_subscription_coupon_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all coupon usage"
ON public.job_subscription_coupon_usage FOR ALL
USING (is_admin(auth.uid()));
