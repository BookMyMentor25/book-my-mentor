import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface JobSubscription {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  starts_at: string;
  expires_at: string;
  order_id: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export const useJobSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['job-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await (supabase
        .from('job_subscriptions' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('payment_status', 'completed')
        .gte('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle());

      if (error) throw error;
      return data as unknown as JobSubscription | null;
    },
    enabled: !!user?.id,
  });

  // Check if user is blocked
  const { data: isBlocked } = useQuery({
    queryKey: ['blocked-user', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await (supabase
        .from('blocked_users' as any)
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle());
      if (error) return false;
      return !!data;
    },
    enabled: !!user?.id,
  });

  const hasActiveSubscription = !!subscription && !isBlocked;

  const purchaseSubscription = useMutation({
    mutationFn: async (orderId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await (supabase
        .from('job_subscriptions' as any)
        .insert({
          user_id: user.id,
          amount: 299,
          order_id: orderId,
          payment_status: 'completed',
          status: 'active',
        })
        .select()
        .single());

      if (error) throw error;
      return data as unknown as JobSubscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-subscription'] });
      toast({
        title: "Subscription Activated! 🎉",
        description: "You now have full access to Jobs & Internships for 3 months.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    subscription,
    hasActiveSubscription,
    isLoading,
    purchaseSubscription: purchaseSubscription.mutate,
    isPurchasing: purchaseSubscription.isPending,
  };
};
