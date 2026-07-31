
CREATE TABLE public.course_interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer_outline text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Hard',
  category text NOT NULL DEFAULT 'General',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_interview_questions TO authenticated;
GRANT ALL ON public.course_interview_questions TO service_role;
ALTER TABLE public.course_interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can read interview questions"
  ON public.course_interview_questions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.course_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  scenario text NOT NULL,
  challenge text NOT NULL,
  tasks text[] NOT NULL DEFAULT '{}',
  hint text,
  difficulty text NOT NULL DEFAULT 'Advanced',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_case_studies TO authenticated;
GRANT ALL ON public.course_case_studies TO service_role;
ALTER TABLE public.course_case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can read case studies"
  ON public.course_case_studies FOR SELECT TO authenticated USING (true);
