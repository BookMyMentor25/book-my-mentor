import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: QuizOption[];
  correct_option_id: string;
  points: number;
  order_index: number;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  time_limit_minutes: number;
  passing_score: number;
  is_active: boolean;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total_points: number | null;
  passed: boolean | null;
  answers: { question_id: string; selected_option_id: string; is_correct: boolean }[] | null;
}

export const useQuizByCourse = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['quiz', 'course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as Quiz | null;
    },
    enabled: !!courseId,
  });
};

export const useQuizQuestions = (quizId: string | undefined) => {
  return useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      if (!quizId) return [];
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data || []).map(q => ({
        ...q,
        options: q.options as unknown as QuizOption[]
      })) as QuizQuestion[];
    },
    enabled: !!quizId,
  });
};

export const useUserQuizAttempts = (quizId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['quiz-attempts', quizId, user?.id],
    queryFn: async () => {
      if (!quizId || !user?.id) return [];
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data as QuizAttempt[];
    },
    enabled: !!quizId && !!user?.id,
  });
};

export const useStartQuiz = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', quizId] });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
      score,
      totalPoints,
      passed,
    }: {
      attemptId: string;
      answers: { question_id: string; selected_option_id: string; is_correct: boolean }[];
      score: number;
      totalPoints: number;
      passed: boolean;
    }) => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          completed_at: new Date().toISOString(),
          answers: answers,
          score,
          total_points: totalPoints,
          passed,
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', data.quiz_id] });
    },
  });
};
