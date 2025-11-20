
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: string | null;
  features: string[] | null;
  category: string | null;
  is_active: boolean | null;
  created_at: string | null;
  student_count: number | null;
  rating: number | null;
  success_rate: number | null;
  job_placements: number | null;
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Courses query error:', error);
        throw error;
      }
      
      console.log('Courses fetched:', data);
      return data as Course[];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const formatPrice = (priceInPaise: number): string => {
  return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`;
};
