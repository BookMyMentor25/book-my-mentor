import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

/** Domains kept in sync with the "Choose your live project domain" grid. */
export const LIVE_PROJECT_DOMAINS = [
  "SaaS",
  "E-Commerce",
  "EdTech",
  "Healthcare",
  "Fintech",
  "Startup MVP",
] as const;

export const ENGAGEMENT_TYPES = [
  "Live Project",
  "Internship + Live Project",
  "Capstone / Research",
  "Freelance Sprint",
] as const;

export interface LiveProject {
  id: string;
  submitted_by: string;
  company_name: string;
  company_website: string | null;
  contact_person: string;
  contact_email: string;
  title: string;
  summary: string;
  domain: string;
  engagement_type: string;
  duration: string | null;
  skills: string[];
  openings: number;
  stipend: string | null;
  apply_url: string | null;
  location: string | null;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface LiveProjectInput {
  company_name: string;
  company_website?: string;
  contact_person: string;
  contact_email: string;
  title: string;
  summary: string;
  domain: string;
  engagement_type: string;
  duration?: string;
  skills: string[];
  openings: number;
  stipend?: string;
  apply_url?: string;
  location?: string;
}

const PUBLIC_COLUMNS =
  "id, submitted_by, company_name, company_website, contact_person, contact_email, title, summary, domain, engagement_type, duration, skills, openings, stipend, apply_url, location, status, views_count, created_at, updated_at";

export const useLiveProjects = () =>
  useQuery({
    queryKey: ["live-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_projects")
        .select(PUBLIC_COLUMNS)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data || []) as LiveProject[];
    },
    staleTime: 60_000,
  });

/** Live counter per domain, driven entirely by the database. */
export const useLiveProjectDomainCounts = () =>
  useQuery({
    queryKey: ["live-project-domain-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_projects")
        .select("domain")
        .eq("status", "published")
        .limit(1000);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data || []) {
        const key = (row as { domain: string }).domain;
        counts[key] = (counts[key] || 0) + 1;
      }
      return counts;
    },
    staleTime: 60_000,
  });

export const useMyLiveProjects = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-live-projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("live_projects")
        .select(PUBLIC_COLUMNS)
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as LiveProject[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateLiveProject = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LiveProjectInput) => {
      if (!user?.id) throw new Error("Please sign in to publish a Live Project.");

      const { data, error } = await supabase
        .from("live_projects")
        .insert({
          ...input,
          company_website: input.company_website || null,
          duration: input.duration || null,
          stipend: input.stipend || null,
          apply_url: input.apply_url || null,
          location: input.location || null,
          submitted_by: user.id,
        })
        .select(PUBLIC_COLUMNS)
        .single();

      if (error) throw error;

      // Notify every registered member (batched server-side)
      supabase.functions
        .invoke("notify-live-project", { body: { project_id: (data as LiveProject).id } })
        .catch((e) => console.error("notify-live-project failed", e));

      return data as LiveProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-projects"] });
      queryClient.invalidateQueries({ queryKey: ["live-project-domain-counts"] });
      queryClient.invalidateQueries({ queryKey: ["my-live-projects"] });
      toast({
        title: "Live Project published",
        description: "Every registered member is being notified by email right now.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not publish",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
