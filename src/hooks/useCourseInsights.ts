import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InterviewQuestion {
  id: string;
  course_id: string;
  question: string;
  answer_outline: string;
  difficulty: string;
  category: string;
  order_index: number;
}

export interface CaseStudy {
  id: string;
  course_id: string;
  title: string;
  scenario: string;
  challenge: string;
  tasks: string[];
  hint: string | null;
  difficulty: string;
  order_index: number;
}

export const useInterviewQuestions = (courseId: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['interview-questions', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_interview_questions')
        .select('*')
        .eq('course_id', courseId!)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return (data || []) as InterviewQuestion[];
    },
    enabled: !!courseId && enabled,
  });
};

export const useCaseStudies = (courseId: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['case-studies', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_case_studies')
        .select('*')
        .eq('course_id', courseId!)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return (data || []) as CaseStudy[];
    },
    enabled: !!courseId && enabled,
  });
};
