import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_jobs",
  title: "Search jobs and internships",
  description:
    "Search active job and internship postings on Book My Mentor by keyword, location, or job type.",
  inputSchema: {
    query: z.string().trim().optional().describe("Role, skill, or company keyword."),
    location: z.string().trim().optional().describe("City name or 'remote'."),
    job_type: z.string().trim().optional().describe("e.g. full-time, internship."),
    limit: z.number().int().min(1).max(25).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, location, job_type, limit }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = supabaseForUser(ctx)
      .from("job_postings")
      .select(
        "id, title, company_name, location, job_type, experience_level, skills, salary_min, salary_max, currency, created_at",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (query) q = q.or(`title.ilike.%${query}%,company_name.ilike.%${query}%,description.ilike.%${query}%`);
    if (location) q = q.ilike("location", `%${location}%`);
    if (job_type) q = q.ilike("job_type", `%${job_type}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { jobs: data ?? [], count: data?.length ?? 0 },
    };
  },
});
