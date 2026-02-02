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
  isGuest?: boolean; // Flag for guest attempts stored locally
}

// Local storage key for guest quiz attempts
const GUEST_QUIZ_ATTEMPTS_KEY = 'guest_quiz_attempts';

// Helper to get guest attempts from localStorage
const getGuestAttempts = (): QuizAttempt[] => {
  try {
    const stored = localStorage.getItem(GUEST_QUIZ_ATTEMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save guest attempts to localStorage
const saveGuestAttempts = (attempts: QuizAttempt[]) => {
  try {
    localStorage.setItem(GUEST_QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    console.error('Failed to save guest quiz attempts');
  }
};

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
      if (!quizId) return [];
      
      // For authenticated users, fetch from database
      if (user?.id) {
        const { data, error } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('quiz_id', quizId)
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (error) throw error;
        return data as QuizAttempt[];
      }
      
      // For guest users, get from localStorage
      const guestAttempts = getGuestAttempts();
      return guestAttempts.filter(a => a.quiz_id === quizId);
    },
    enabled: !!quizId,
  });
};

export const useStartQuiz = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      // For authenticated users, create attempt in database
      if (user?.id) {
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
      }
      
      // For guest users, create local attempt
      const guestAttempt: QuizAttempt = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quiz_id: quizId,
        user_id: 'guest',
        started_at: new Date().toISOString(),
        completed_at: null,
        score: null,
        total_points: null,
        passed: null,
        answers: null,
        isGuest: true,
      };
      
      const guestAttempts = getGuestAttempts();
      guestAttempts.unshift(guestAttempt);
      saveGuestAttempts(guestAttempts);
      
      return guestAttempt;
    },
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', quizId] });
    },
  });
};

export const useSubmitQuiz = () => {
  const { user } = useAuth();
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
      // Check if this is a guest attempt
      if (attemptId.startsWith('guest_') || !user?.id) {
        // Update local storage for guest
        const guestAttempts = getGuestAttempts();
        const attemptIndex = guestAttempts.findIndex(a => a.id === attemptId);
        
        if (attemptIndex !== -1) {
          guestAttempts[attemptIndex] = {
            ...guestAttempts[attemptIndex],
            completed_at: new Date().toISOString(),
            answers,
            score,
            total_points: totalPoints,
            passed,
          };
          saveGuestAttempts(guestAttempts);
          return guestAttempts[attemptIndex];
        }
        
        // If not found in localStorage, create new completed attempt
        const newAttempt: QuizAttempt = {
          id: attemptId,
          quiz_id: '',
          user_id: 'guest',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          answers,
          score,
          total_points: totalPoints,
          passed,
          isGuest: true,
        };
        return newAttempt;
      }
      
      // For authenticated users, update database
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
