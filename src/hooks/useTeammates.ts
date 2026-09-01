import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface TeammateProfileInput {
  display_name: string;
  headline: string;
  about?: string | null;
  course_id?: string | null;
  preferred_domain?: string | null;
  skills: string[];
  experience_level: string;
  city?: string | null;
  availability?: string | null;
  contact_email: string;
  contact_phone?: string | null;
  linkedin_url?: string | null;
}

export interface TeammateProfile extends TeammateProfileInput {
  id: string;
  user_id: string;
  status: string;
  views_count: number;
  join_requests_count: number;
  created_at: string;
  courses?: { title: string } | null;
}

/** Open teammate profiles — readable only by signed-in users (RLS enforced). */
export const useTeammateProfiles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["teammate-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_project_teammate_profiles")
        .select("*, courses ( title )")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as TeammateProfile[];
    },
    enabled: !!user,
  });
};

export const useMyTeammateProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-teammate-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_project_teammate_profiles")
        .select("*, courses ( title )")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as TeammateProfile) || null;
    },
    enabled: !!user,
  });
};

export const useCreateTeammateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TeammateProfileInput) => {
      if (!user) throw new Error("Please sign in to share your profile.");

      const { data, error } = await supabase
        .from("live_project_teammate_profiles")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;

      // Notify all registered members (batched server-side, non-blocking)
      supabase.functions
        .invoke("notify-teammate-profile", { body: { profile_id: data.id } })
        .catch(() => {});

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammate-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["my-teammate-profile"] });
    },
  });
};

export const useUpdateTeammateProfileStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "open" | "closed" }) => {
      const { error } = await supabase
        .from("live_project_teammate_profiles")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammate-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["my-teammate-profile"] });
    },
  });
};

export const useMyJoinRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["teammate-join-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teammate_join_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useSendJoinRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      profile_id: string;
      requester_name: string;
      requester_email: string;
      requester_phone?: string | null;
      message?: string | null;
    }) => {
      if (!user) throw new Error("Please sign in to join a team.");

      const { error } = await supabase.from("teammate_join_requests").insert({
        ...input,
        requester_user_id: user.id,
      });
      if (error) {
        if ((error as any).code === "23505" || error.message.includes("duplicate")) {
          throw new Error("You have already sent a request to this candidate.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teammate-join-requests"] });
    },
  });
};
