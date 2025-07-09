
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderData {
  course_id: string;
  order_id: string;
  amount: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  coupon_applied?: string;
  discount_amount?: number;
}

export const useCreateOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: OrderData) => {
      if (!user) {
        console.error('No user found for order creation');
        throw new Error('User not authenticated');
      }

      console.log('Creating order in database:', { ...orderData, user_id: user.id });

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating order:', error);
        throw error;
      }

      console.log('Order created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Order mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Order mutation failed:', error);
    }
  });
};

export const useUserOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) {
        console.error('No user found for orders query');
        throw new Error('User not authenticated');
      }

      console.log('Fetching orders for user:', user.id);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          courses (
            title,
            description,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched:', data);
      return data;
    },
    enabled: !!user,
  });
};
