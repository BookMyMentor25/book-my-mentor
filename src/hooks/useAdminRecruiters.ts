 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 import { Recruiter } from './useRecruiters';
 import { JobPosting } from './useJobs';
 
 export const useAdminRecruiters = () => {
   const queryClient = useQueryClient();
 
   // Get all recruiters (for admin)
   const { data: recruiters, isLoading: isLoadingRecruiters } = useQuery({
     queryKey: ['admin-recruiters'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('recruiters')
         .select('*')
         .order('created_at', { ascending: false });
       
       if (error) throw error;
       return data as Recruiter[];
     },
   });
 
   // Verify recruiter
   const verifyRecruiterMutation = useMutation({
     mutationFn: async ({ id, is_verified }: { id: string; is_verified: boolean }) => {
       const { data, error } = await supabase
         .from('recruiters')
         .update({ is_verified })
         .eq('id', id)
         .select()
         .single();
       
       if (error) throw error;
       return data as Recruiter;
     },
     onSuccess: (data) => {
       queryClient.invalidateQueries({ queryKey: ['admin-recruiters'] });
       toast({
         title: data.is_verified ? "Recruiter Verified" : "Recruiter Unverified",
         description: `${data.company_name} has been ${data.is_verified ? 'verified' : 'unverified'}.`,
       });
     },
     onError: (error: Error) => {
       toast({
         title: "Verification Failed",
         description: error.message,
         variant: "destructive",
       });
     },
   });
 
   return {
     recruiters,
     isLoadingRecruiters,
     verifyRecruiter: verifyRecruiterMutation.mutate,
     isVerifying: verifyRecruiterMutation.isPending,
   };
 };
 
 export const useAdminJobs = () => {
   const queryClient = useQueryClient();
 
   // Get all job postings (for admin)
   const { data: jobs, isLoading: isLoadingJobs } = useQuery({
     queryKey: ['admin-jobs'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('job_postings')
         .select(`
           *,
           recruiters (
             id,
             company_name,
             contact_person,
             email,
             is_verified
           )
         `)
         .order('created_at', { ascending: false });
       
       if (error) throw error;
       return data as (JobPosting & { recruiters: Recruiter })[];
     },
   });
 
   // Toggle job active status
   const toggleJobMutation = useMutation({
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
       queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
       queryClient.invalidateQueries({ queryKey: ['jobs'] });
       toast({
         title: data.is_active ? "Job Activated" : "Job Deactivated",
         description: `The job posting has been ${data.is_active ? 'activated and is now live' : 'deactivated'}.`,
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
     jobs,
     isLoadingJobs,
     toggleJob: toggleJobMutation.mutate,
     isToggling: toggleJobMutation.isPending,
   };
 };
 
 export const useBulkEmail = () => {
   const sendBulkEmailMutation = useMutation({
     mutationFn: async ({ emails, subject, html_content }: {
       emails: string[];
       subject: string;
       html_content: string;
     }) => {
       const { data, error } = await supabase.functions.invoke('send-bulk-email', {
         body: { emails, subject, html_content }
       });
       
       if (error) throw error;
       return data;
     },
     onSuccess: (data) => {
       toast({
         title: "Emails Sent",
         description: `Successfully sent ${data.sent} emails. ${data.failed} failed.`,
       });
     },
     onError: (error: Error) => {
       toast({
         title: "Email Failed",
         description: error.message,
         variant: "destructive",
       });
     },
   });
 
   return {
     sendBulkEmail: sendBulkEmailMutation.mutate,
     isSending: sendBulkEmailMutation.isPending,
   };
 };