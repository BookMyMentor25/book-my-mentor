
CREATE TABLE IF NOT EXISTS public.job_broadcast_state (
  id INT PRIMARY KEY DEFAULT 1,
  last_user_created_at TIMESTAMPTZ,
  last_user_id UUID,
  cycle_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

INSERT INTO public.job_broadcast_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.job_broadcast_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view broadcast state"
ON public.job_broadcast_state FOR SELECT
USING (public.is_admin(auth.uid()));
