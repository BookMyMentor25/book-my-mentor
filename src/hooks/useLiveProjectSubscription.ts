import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const LP_PRICE = 2999;
export const LP_MRP = 9999;

export type LPStatus = "pending_review" | "awaiting_payment" | "active" | "rejected" | "expired";

export interface LPSubscription {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_domain: string | null;
  motivation: string | null;
  amount: number;
  status: LPStatus;
  payment_reference: string | null;
  admin_note: string | null;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface LPAdminRow extends LPSubscription {
  access_code: string | null;
}

const db = supabase as any;

export const useMyLPSubscription = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["lp-subscription", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await db
        .from("live_project_subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as LPSubscription) || null;
    },
  });
};

export const useCreateLPSubscription = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { full_name: string; email: string; phone: string; preferred_domain?: string; motivation?: string }) => {
      if (!user?.id) throw new Error("Please sign in first.");
      const { data, error } = await db
        .from("live_project_subscriptions")
        .insert({ ...input, user_id: user.id })
        .select("*")
        .single();
      if (error) throw error;
      supabase.functions
        .invoke("notify-live-project-subscription", { body: { subscription_id: data.id } })
        .catch((e) => console.error("notify failed", e));
      return data as LPSubscription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lp-subscription"] });
      toast({ title: "Order placed", description: "We'll check slot availability and email you payment details." });
    },
    onError: (e: Error) => toast({ title: "Could not place order", description: e.message, variant: "destructive" }),
  });
};

export const useAdminLPSubscriptions = () =>
  useQuery({
    queryKey: ["admin-lp-subscriptions"],
    queryFn: async () => {
      const [{ data: subs, error }, { data: codes, error: e2 }] = await Promise.all([
        db.from("live_project_subscriptions").select("*").order("created_at", { ascending: false }),
        db.from("live_project_access_codes").select("user_id, code"),
      ]);
      if (error) throw error;
      if (e2) throw e2;
      const map = new Map<string, string>((codes || []).map((c: any) => [c.user_id, c.code]));
      return ((subs || []) as LPSubscription[]).map((s) => ({ ...s, access_code: map.get(s.user_id) || null })) as LPAdminRow[];
    },
  });

export const useUpdateLPSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string; status?: LPStatus; payment_reference?: string; admin_note?: string }) => {
      const { error } = await db.from("live_project_subscriptions").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-lp-subscriptions"] });
      toast({ title: "Subscription updated" });
    },
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });
};
