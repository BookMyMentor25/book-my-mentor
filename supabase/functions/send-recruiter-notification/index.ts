 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { Resend } from "npm:resend@2.0.0";
 
 const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface RecruiterNotificationRequest {
   type: 'recruiter_registered' | 'job_posted';
   recruiter_email: string;
   recruiter_name: string;
   company_name: string;
   job_title?: string;
   job_location?: string;
 }
 
 const handler = async (req: Request): Promise<Response> => {
   // Handle CORS preflight requests
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const data: RecruiterNotificationRequest = await req.json();
     console.log("Sending recruiter notification:", data);
 
     const adminEmails = ["info@bookmymentor.com", "bookmymentor.org@gmail.com"];
     const fromEmail = "Book My Mentor <support@bookmymentor.com>";
 
     if (data.type === 'recruiter_registered') {
       // Email to recruiter
       await resend.emails.send({
         from: fromEmail,
         to: [data.recruiter_email],
         subject: "Welcome to BookMyMentor - Recruiter Registration Confirmed",
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h1 style="color: #1e3a5f;">Welcome to BookMyMentor!</h1>
             <p>Dear ${data.recruiter_name},</p>
             <p>Thank you for registering <strong>${data.company_name}</strong> on BookMyMentor's hiring platform.</p>
             <p>Your account is now pending verification by our admin team. Once verified, you'll be able to:</p>
             <ul>
               <li>Post job openings visible to thousands of qualified candidates</li>
               <li>Access our talent pool from top universities</li>
               <li>Manage applications directly from your dashboard</li>
             </ul>
             <p>We will notify you once your account is verified.</p>
             <p>Best regards,<br>Book My Mentor Team</p>
           </div>
         `,
       });
 
       // Email to admins
       await resend.emails.send({
         from: fromEmail,
         to: adminEmails,
         subject: `New Recruiter Registration - ${data.company_name}`,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h1 style="color: #1e3a5f;">New Recruiter Registration</h1>
             <p>A new recruiter has registered on BookMyMentor and needs verification:</p>
             <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Company Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.company_name}</td></tr>
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact Person:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.recruiter_name}</td></tr>
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.recruiter_email}</td></tr>
             </table>
             <p>Please log in to the Admin Dashboard to verify this recruiter.</p>
             <p><a href="https://bookmymentor.com/admin" style="background: #1e3a5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a></p>
           </div>
         `,
       });
     } else if (data.type === 'job_posted') {
       // Email to recruiter
       await resend.emails.send({
         from: fromEmail,
         to: [data.recruiter_email],
         subject: `Job Posted Successfully - ${data.job_title}`,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h1 style="color: #1e3a5f;">Job Posted Successfully!</h1>
             <p>Dear ${data.recruiter_name},</p>
             <p>Your job posting has been created successfully:</p>
             <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
               <h3 style="margin: 0 0 10px 0;">${data.job_title}</h3>
               <p style="margin: 0; color: #666;">📍 ${data.job_location}</p>
             </div>
             <p>Your job listing is now pending admin verification. Once verified, it will be live and visible to candidates.</p>
             <p>Best regards,<br>Book My Mentor Team</p>
           </div>
         `,
       });
 
       // Email to admins
       await resend.emails.send({
         from: fromEmail,
         to: adminEmails,
         subject: `New Job Posting - ${data.job_title} at ${data.company_name}`,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h1 style="color: #1e3a5f;">New Job Posting</h1>
             <p>A new job has been posted and needs verification:</p>
             <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Title:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.job_title}</td></tr>
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Company:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.company_name}</td></tr>
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.job_location}</td></tr>
               <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Posted By:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.recruiter_name}</td></tr>
             </table>
             <p>Please log in to the Admin Dashboard to verify this job posting.</p>
             <p><a href="https://bookmymentor.com/admin" style="background: #1e3a5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a></p>
           </div>
         `,
       });
     }
 
     console.log("Recruiter notification sent successfully");
 
     return new Response(JSON.stringify({ success: true }), {
       status: 200,
       headers: { "Content-Type": "application/json", ...corsHeaders },
     });
   } catch (error: any) {
     console.error("Error sending recruiter notification:", error);
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