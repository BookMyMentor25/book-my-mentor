import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Recruiter {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  website?: string;
  company_description?: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecruiterInput {
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  website?: string;
  company_description?: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  location?: string;
}

export const useRecruiters = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user's recruiter profile
  const { data: recruiterProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['recruiter-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('recruiters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Recruiter | null;
    },
    enabled: !!user?.id,
  });

  // Create recruiter profile
  const createRecruiterMutation = useMutation({
    mutationFn: async (input: RecruiterInput) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('recruiters')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Recruiter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-profile'] });
      toast({
        title: "Registration Successful!",
        description: "Your recruiter profile has been created. You can now post job openings.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update recruiter profile
  const updateRecruiterMutation = useMutation({
    mutationFn: async ({ id, ...input }: Partial<RecruiterInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('recruiters')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Recruiter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-profile'] });
      toast({
        title: "Profile Updated",
        description: "Your recruiter profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    recruiterProfile,
    isLoadingProfile,
    isRecruiter: !!recruiterProfile,
    createRecruiter: createRecruiterMutation.mutate,
    updateRecruiter: updateRecruiterMutation.mutate,
    isCreating: createRecruiterMutation.isPending,
    isUpdating: updateRecruiterMutation.isPending,
  };
};
