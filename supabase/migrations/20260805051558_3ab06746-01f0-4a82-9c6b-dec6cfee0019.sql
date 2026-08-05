CREATE TABLE public.group_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  group_code TEXT NOT NULL UNIQUE,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  discount_amount INTEGER NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  per_member_amount INTEGER NOT NULL CHECK (per_member_amount >= 0),
  coupon_applied TEXT,
  member_count INTEGER NOT NULL DEFAULT 3 CHECK (member_count = 3),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_enrollments TO authenticated;
GRANT ALL ON public.group_enrollments TO service_role;
ALTER TABLE public.group_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own group enrollments"
ON public.group_enrollments FOR SELECT TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own group enrollments"
ON public.group_enrollments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own group enrollments"
ON public.group_enrollments FOR UPDATE TO authenticated
USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

CREATE TABLE public.group_enrollment_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.group_enrollments(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  member_phone TEXT NOT NULL,
  share_amount INTEGER NOT NULL CHECK (share_amount >= 0),
  is_lead BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (group_id, member_email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_enrollment_members TO authenticated;
GRANT ALL ON public.group_enrollment_members TO service_role;
ALTER TABLE public.group_enrollment_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group owners can view members"
ON public.group_enrollment_members FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.group_enrollments g WHERE g.id = group_id AND g.created_by = auth.uid()));

CREATE POLICY "Group owners can add members"
ON public.group_enrollment_members FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.group_enrollments g WHERE g.id = group_id AND g.created_by = auth.uid()));

CREATE POLICY "Group owners can update members"
ON public.group_enrollment_members FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.group_enrollments g WHERE g.id = group_id AND g.created_by = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.group_enrollments g WHERE g.id = group_id AND g.created_by = auth.uid()));

CREATE POLICY "Group owners can delete members"
ON public.group_enrollment_members FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.group_enrollments g WHERE g.id = group_id AND g.created_by = auth.uid()));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS group_enrollment_id UUID REFERENCES public.group_enrollments(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_group_enrollments_updated_at BEFORE UPDATE ON public.group_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_enrollment_members_updated_at BEFORE UPDATE ON public.group_enrollment_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();