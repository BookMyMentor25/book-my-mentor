import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Signed-in users without a Jobs & Internships subscription get ONE free use
 * of a premium AI tool. From the second usage onwards a subscription is required.
 */
export const useFreeToolTrial = (toolId: string) => {
  const { user } = useAuth();

  const { data: usageCount, isLoading } = useQuery({
    queryKey: ['free-tool-trial', toolId, user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from('toolkit_usage')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('tool_id', toolId);
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  const used = usageCount ?? 0;

  return {
    isLoading,
    usageCount: used,
    /** true when the user still has their one free run available */
    hasFreeTrial: used < 1,
  };
};
