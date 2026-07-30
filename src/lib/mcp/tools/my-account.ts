import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_account",
  title: "My account overview",
  description:
    "Get the signed-in user's Book My Mentor account overview: profile, course orders, and jobs subscription status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const [profile, orders, subs] = await Promise.all([
      sb.from("profiles").select("id, full_name, email, phone").eq("id", userId).maybeSingle(),
      sb
        .from("orders")
        .select("order_id, course_id, amount, status, invoice_number, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      sb
        .from("job_subscriptions")
        .select("status, payment_status, starts_at, expires_at, amount")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);
    const firstError = profile.error || orders.error || subs.error;
    if (firstError)
      return { content: [{ type: "text", text: firstError.message }], isError: true };
    const payload = {
      email: ctx.getUserEmail(),
      profile: profile.data,
      orders: orders.data ?? [],
      job_subscriptions: subs.data ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
