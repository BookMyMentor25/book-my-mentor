import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Recruiter } from './useRecruiters';

export interface JobPosting {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  requirements?: string[];
  skills?: string[];
  benefits?: string[];
  application_deadline?: string;
  is_active: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  recruiters?: Recruiter;
}

export interface JobInput {
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  requirements?: string[];
  skills?: string[];
  benefits?: string[];
  application_deadline?: string;
}

export interface JobFilters {
  search?: string;
  job_type?: string;
  experience_level?: string;
  location?: string;
}

export const useJobs = (filters?: JobFilters) => {
  const queryClient = useQueryClient();

  // Get all active job postings with filters
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('job_postings')
        .select(`
          *,
          recruiters (
            id,
            company_name,
            logo_url,
            location,
            is_verified
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.job_type && filters.job_type !== 'all') {
        query = query.eq('job_type', filters.job_type);
      }
      
      if (filters?.experience_level && filters.experience_level !== 'all') {
        query = query.eq('experience_level', filters.experience_level);
      }
      
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as JobPosting[];
    },
  });

  // Get single job by ID
  const getJobById = async (jobId: string) => {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        recruiters (
          id,
          company_name,
          contact_person,
          email,
          logo_url,
          website,
          company_description,
          location,
          industry,
          company_size,
          is_verified
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data as JobPosting;
  };

  return {
    jobs,
    isLoading,
    getJobById,
  };
};

export const useRecruiterJobs = (recruiterId?: string) => {
  const queryClient = useQueryClient();

  // Get recruiter's job postings
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['recruiter-jobs', recruiterId],
    queryFn: async () => {
      if (!recruiterId) return [];
      
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('recruiter_id', recruiterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobPosting[];
    },
    enabled: !!recruiterId,
  });

  // Create job posting
  const createJobMutation = useMutation({
    mutationFn: async (input: JobInput & { recruiter_id: string }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as JobPosting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Posted!",
        description: "Your job posting is now live and visible to candidates.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Post Job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update job posting
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...input }: Partial<JobInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as JobPosting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Updated",
        description: "Your job posting has been updated successfully.",
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

  // Delete job posting
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Deleted",
        description: "The job posting has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle job active status
  const toggleJobStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as JobPosting;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: data.is_active ? "Job Activated" : "Job Deactivated",
        description: data.is_active 
          ? "The job posting is now visible to candidates." 
          : "The job posting has been hidden from candidates.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Status Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    jobs,
    isLoading,
    createJob: createJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    toggleJobStatus: toggleJobStatusMutation.mutate,
    isCreating: createJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
  };
};

export const useJobApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Apply to a job
  const applyToJobMutation = useMutation({
    mutationFn: async (input: {
      job_id: string;
      applicant_name: string;
      applicant_email: string;
      applicant_phone?: string;
      resume_url?: string;
      cover_letter?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the recruiter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get user's applications
  const { data: userApplications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['user-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (
            id,
            title,
            location,
            job_type,
            recruiters (
              company_name,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    applyToJob: applyToJobMutation.mutate,
    isApplying: applyToJobMutation.isPending,
    userApplications,
    isLoadingApplications,
  };
};
