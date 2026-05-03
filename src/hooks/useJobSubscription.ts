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
    mutationFn: async ({ orderId, amount }: { orderId: string; amount: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate UPI transaction ID client-side (8-32 alphanumeric)
      const trimmed = orderId.trim();
      if (!/^[A-Za-z0-9]{8,32}$/.test(trimmed)) {
        throw new Error('Invalid UPI Transaction ID. It must be 8–32 alphanumeric characters with no spaces or symbols.');
      }
      if (amount <= 0 || amount > 299) {
        throw new Error('Invalid amount.');
      }

      const { data, error } = await (supabase
        .from('job_subscriptions' as any)
        .insert({
          user_id: user.id,
          amount,
          order_id: trimmed,
          payment_status: 'pending',
          status: 'pending_verification',
        })
        .select()
        .single());

      if (error) {
        // Surface DB-level errors (duplicate transaction id, invalid format)
        if (error.code === '23505') {
          throw new Error('This UPI Transaction ID has already been submitted. Please enter the correct ID from your UPI app.');
        }
        throw new Error(error.message || 'Could not record your subscription request.');
      }
      return data as unknown as JobSubscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-subscription'] });
      toast({
        title: "Payment Submitted for Verification ✅",
        description: "We've received your transaction ID. Our team will verify your payment and activate your subscription within a few hours. You'll receive a confirmation email once it's live.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
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
