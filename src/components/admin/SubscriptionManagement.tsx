import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Ban, CheckCircle, Search } from "lucide-react";

const SubscriptionManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: blockedUsers } = useQuery({
    queryKey: ["blocked-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_users" as any)
        .select("*");
      if (error) throw error;
      return data as any[];
    },
  });

  const blockUser = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await (supabase
        .from("blocked_users" as any)
        .insert({ user_id: userId, reason, blocked_by: user.id }));
      if (error) throw error;

      // Also deactivate their subscription
      await supabase
        .from("job_subscriptions")
        .update({ status: "blocked", payment_status: "failed" })
        .eq("user_id", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      toast({ title: "User blocked successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to block user", description: err.message, variant: "destructive" });
    },
  });

  const unblockUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await (supabase
        .from("blocked_users" as any)
        .delete()
        .eq("user_id", userId));
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      toast({ title: "User unblocked successfully" });
    },
  });

  const isBlocked = (userId: string) =>
    blockedUsers?.some((b: any) => b.user_id === userId);

  const filtered = subscriptions?.filter(
    (s) =>
      !search ||
      s.user_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.order_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Subscriptions</CardTitle>
        <CardDescription>Manage subscriptions & block users who haven't paid.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by user ID or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <p>Loading subscriptions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered?.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {sub.user_id?.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{sub.order_id || "—"}</td>
                    <td className="px-4 py-3 text-sm">₹{sub.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={
                        sub.payment_status === "completed" ? "default" :
                        sub.status === "blocked" ? "destructive" : "secondary"
                      }>
                        {sub.status === "blocked" ? "Blocked" : sub.payment_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(sub.expires_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isBlocked(sub.user_id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unblockUser.mutate(sub.user_id)}
                          disabled={unblockUser.isPending}
                          className="gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => blockUser.mutate({
                            userId: sub.user_id,
                            reason: "Payment not verified"
                          })}
                          disabled={blockUser.isPending}
                          className="gap-1"
                        >
                          <Ban className="w-3 h-3" /> Block
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
