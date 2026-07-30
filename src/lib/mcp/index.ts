import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchJobs from "./tools/search-jobs";
import getJob from "./tools/get-job";
import listCourses from "./tools/list-courses";
import myApplications from "./tools/my-applications";
import myAccount from "./tools/my-account";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "book-my-mentor",
  title: "book-my-mentor",
  version: "0.1.0",
  instructions:
    "Tools for Book My Mentor, an EdTech and HR-Tech platform. Use `search_jobs` and `get_job` for job and internship listings, `list_courses` for course offerings, and `my_applications` / `my_account` for the signed-in user's own applications, orders, and jobs subscription.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchJobs, getJob, listCourses, myApplications, myAccount],
});
