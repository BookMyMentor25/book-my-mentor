
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

      if (error) throw error;
      return data as Course[];
    },
  });
};

export const formatPrice = (priceInPaise: number): string => {
  return `₹${(priceInPaise / 100).toLocaleString('en-IN')}`;
};
