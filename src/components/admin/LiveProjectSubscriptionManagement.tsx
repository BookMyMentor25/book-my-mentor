import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminLPSubscriptions, useUpdateLPSubscription, type LPStatus } from "@/hooks/useLiveProjectSubscription";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

const label: Record<LPStatus, string> = {
  pending_review: "Pending review",
  awaiting_payment: "Awaiting payment",
  active: "Active",
  rejected: "No slots",
  expired: "Expired",
};

const LiveProjectSubscriptionManagement = () => {
  const { data, isLoading } = useAdminLPSubscriptions();
  const update = useUpdateLPSubscription();

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Code copied" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Projects Subscriptions (₹2,999 · 3 months)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Check slots → mark "Slot available" and email payment details → once paid, mark Active and share the member's Project Accessible Code.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-2">Customer</th>
                <th className="p-2">Email / Phone</th>
                <th className="p-2">Domain</th>
                <th className="p-2">Ordered</th>
                <th className="p-2">Status</th>
                <th className="p-2">Access Code</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-b align-top">
                  <td className="p-2 font-medium">{s.full_name}</td>
                  <td className="p-2">{s.email}<br /><span className="text-muted-foreground">{s.phone}</span></td>
                  <td className="p-2">{s.preferred_domain || "Any"}</td>
                  <td className="p-2">{format(new Date(s.created_at), "dd MMM yyyy")}</td>
                  <td className="p-2">
                    <Badge variant={s.status === "active" ? "default" : "secondary"}>{label[s.status]}</Badge>
                    {s.expires_at && <div className="mt-1 text-xs text-muted-foreground">till {format(new Date(s.expires_at), "dd MMM yyyy")}</div>}
                  </td>
                  <td className="p-2">
                    {s.access_code && (
                      <button onClick={() => copy(s.access_code!)} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 font-mono text-xs">
                        {s.access_code} <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {s.status === "pending_review" && (
                        <>
                          <Button size="sm" onClick={() => update.mutate({ id: s.id, status: "awaiting_payment" })}>Slot available</Button>
                          <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: "rejected" })}>No slots</Button>
                        </>
                      )}
                      {s.status === "awaiting_payment" && (
                        <>
                          <Button size="sm" onClick={() => update.mutate({ id: s.id, status: "active" })}>Payment received — Activate</Button>
                          <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: "rejected" })}>Cancel</Button>
                        </>
                      )}
                      {s.status === "active" && (
                        <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: "expired" })}>Expire</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveProjectSubscriptionManagement;
