
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  course_interest?: string;
  status: string;
  created_at: string;
}

export const useInquiries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Inquiry[];
    },
  });

  const updateInquiryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: "Status updated successfully",
        description: "Inquiry status has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    inquiries,
    isLoading,
    updateInquiryStatus: updateInquiryStatus.mutate,
    isUpdating: updateInquiryStatus.isPending,
  };
};
