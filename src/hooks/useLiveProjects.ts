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
  company_name: string | null;
  company_website: string | null;
  contact_person: string | null;
  contact_email: string | null;
  title: string | null;
  summary: string;
  domain: string;
  engagement_type: string;
  duration: string | null;
  skills: string[];
  openings: number;
  stipend: string | null;
  apply_url: string | null;
  location: string | null;
  created_at: string;
  unlocked: boolean;
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

/** Published projects with sensitive fields masked server-side until a Project code is applied. */
export const useLiveProjects = () =>
  useQuery({
    queryKey: ["live-projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("list_live_projects");
      if (error) throw error;
      return ((data || []) as LiveProject[]).map((p) => ({ ...p, skills: p.skills || [] }));
    },
    staleTime: 30_000,
  });

/** True once the signed-in member has applied a valid Live Project code. */
export const useLiveProjectAccess = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["live-project-access", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await (supabase as any)
        .from("live_project_code_unlocks")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  });
};

/** Redeem the Project code issued by Book My Mentor after course enrolment. */
export const useRedeemProjectCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await (supabase as any).rpc("redeem_live_project_code", {
        input_code: code,
      });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as
        | { success: boolean; message: string }
        | undefined;
      if (!row?.success) throw new Error(row?.message || "Invalid Project code.");
      return row;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["live-project-access"] });
      queryClient.invalidateQueries({ queryKey: ["live-projects"] });
      toast({
        title: "Project code applied",
        description: "Full project details are now unlocked. You can apply right away.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Could not apply code", description: error.message, variant: "destructive" });
    },
  });
};

/** Live counter per domain, driven entirely by the database. */
export const useLiveProjectDomainCounts = () =>
  useQuery({
    queryKey: ["live-project-domain-counts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("live_project_domain_counts");
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of (data || []) as { domain: string; total: number }[]) {
        counts[row.domain] = Number(row.total) || 0;
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
