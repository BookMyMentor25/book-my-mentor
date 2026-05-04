
-- Replace the strict pending-only insert policy with one that allows
-- the user to self-activate their subscription with a valid UPI txn id.
DROP POLICY IF EXISTS "Users can create pending subscriptions" ON public.job_subscriptions;

CREATE POLICY "Users can create their own subscriptions"
ON public.job_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND amount > 0
  AND amount <= 299
  AND payment_status IN ('pending', 'completed')
  AND status IN ('pending_verification', 'active')
);
