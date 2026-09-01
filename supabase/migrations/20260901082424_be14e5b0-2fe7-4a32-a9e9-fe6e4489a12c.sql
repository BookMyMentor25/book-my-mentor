CREATE TABLE public.live_project_teammate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  headline text NOT NULL,
  about text,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  preferred_domain text,
  skills text[] NOT NULL DEFAULT '{}',
  experience_level text NOT NULL DEFAULT 'beginner',
  city text,
  availability text,
  contact_email text NOT NULL,
  contact_phone text,
  linkedin_url text,
  status text NOT NULL DEFAULT 'open',
  views_count integer NOT NULL DEFAULT 0,
  join_requests_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_project_teammate_profiles TO authenticated;
GRANT ALL ON public.live_project_teammate_profiles TO service_role;

ALTER TABLE public.live_project_teammate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view open teammate profiles"
ON public.live_project_teammate_profiles FOR SELECT TO authenticated
USING (status = 'open' OR user_id = auth.uid());

CREATE POLICY "Users can create their own teammate profile"
ON public.live_project_teammate_profiles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own teammate profile"
ON public.live_project_teammate_profiles FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own teammate profile"
ON public.live_project_teammate_profiles FOR DELETE TO authenticated
USING (user_id = auth.uid());

CREATE INDEX idx_teammate_profiles_status_created ON public.live_project_teammate_profiles (status, created_at DESC);

CREATE TRIGGER update_teammate_profiles_updated_at
BEFORE UPDATE ON public.live_project_teammate_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.teammate_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.live_project_teammate_profiles(id) ON DELETE CASCADE,
  requester_user_id uuid NOT NULL,
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_phone text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, requester_user_id)
);

GRANT SELECT, INSERT, UPDATE ON public.teammate_join_requests TO authenticated;
GRANT ALL ON public.teammate_join_requests TO service_role;

ALTER TABLE public.teammate_join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requester or profile owner can view join requests"
ON public.teammate_join_requests FOR SELECT TO authenticated
USING (
  requester_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.live_project_teammate_profiles p
    WHERE p.id = profile_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Signed-in users can send join requests"
ON public.teammate_join_requests FOR INSERT TO authenticated
WITH CHECK (requester_user_id = auth.uid());

CREATE POLICY "Profile owner can update join request status"
ON public.teammate_join_requests FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.live_project_teammate_profiles p
    WHERE p.id = profile_id AND p.user_id = auth.uid()
  )
) WITH CHECK (true);

CREATE TRIGGER update_teammate_join_requests_updated_at
BEFORE UPDATE ON public.teammate_join_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();