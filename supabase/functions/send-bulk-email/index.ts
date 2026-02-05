 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { Resend } from "npm:resend@2.0.0";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface BulkEmailRequest {
   emails: string[];
   subject: string;
   html_content: string;
 }
 
 const handler = async (req: Request): Promise<Response> => {
   // Handle CORS preflight requests
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     // Verify admin authorization
     const authHeader = req.headers.get("Authorization");
     if (!authHeader) {
       return new Response(JSON.stringify({ error: "Unauthorized" }), {
         status: 401,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       });
     }
 
     const supabaseClient = createClient(
       Deno.env.get("SUPABASE_URL") ?? "",
       Deno.env.get("SUPABASE_ANON_KEY") ?? "",
       { global: { headers: { Authorization: authHeader } } }
     );
 
     // Get user and check if admin
     const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
     if (userError || !user) {
       return new Response(JSON.stringify({ error: "Unauthorized" }), {
         status: 401,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       });
     }
 
     // Check admin status
     const { data: isAdmin } = await supabaseClient.rpc('is_admin', { user_uuid: user.id });
     if (!isAdmin) {
       return new Response(JSON.stringify({ error: "Admin access required" }), {
         status: 403,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       });
     }
 
     const data: BulkEmailRequest = await req.json();
     console.log(`Sending bulk email to ${data.emails.length} recipients`);
 
     if (!data.emails || data.emails.length === 0) {
       return new Response(JSON.stringify({ error: "No email addresses provided" }), {
         status: 400,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       });
     }
 
     const fromEmail = "Book My Mentor <support@bookmymentor.com>";
     const results: { success: string[]; failed: string[] } = { success: [], failed: [] };
 
     // Send emails in batches of 10 to avoid rate limiting
     const batchSize = 10;
     for (let i = 0; i < data.emails.length; i += batchSize) {
       const batch = data.emails.slice(i, i + batchSize);
       
       const promises = batch.map(async (email) => {
         try {
           await resend.emails.send({
             from: fromEmail,
             to: [email],
             subject: data.subject,
             html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                 ${data.html_content}
                 <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                 <p style="color: #888; font-size: 12px;">
                   You are receiving this email because you are subscribed to Book My Mentor updates.
                   <br>
                   <a href="https://bookmymentor.com" style="color: #1e3a5f;">Visit our website</a>
                 </p>
               </div>
             `,
           });
           results.success.push(email);
         } catch (err) {
           console.error(`Failed to send to ${email}:`, err);
           results.failed.push(email);
         }
       });
 
       await Promise.all(promises);
       
       // Small delay between batches
       if (i + batchSize < data.emails.length) {
         await new Promise(resolve => setTimeout(resolve, 100));
       }
     }
 
     console.log(`Bulk email completed. Success: ${results.success.length}, Failed: ${results.failed.length}`);
 
     return new Response(JSON.stringify({
       success: true,
       sent: results.success.length,
       failed: results.failed.length,
       failed_emails: results.failed,
     }), {
       status: 200,
       headers: { "Content-Type": "application/json", ...corsHeaders },
     });
   } catch (error: any) {
     console.error("Error sending bulk email:", error);
     return new Response(
       JSON.stringify({ error: error.message }),
       {
         status: 500,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       }
     );
   }
 };
 
 serve(handler);