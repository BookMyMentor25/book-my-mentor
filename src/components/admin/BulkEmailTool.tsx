 import { useState, useRef } from 'react';
 import { useBulkEmail } from '@/hooks/useAdminRecruiters';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Mail, Upload, FileText, Trash2 } from 'lucide-react';
 import { toast } from '@/hooks/use-toast';
 
 const BulkEmailTool = () => {
   const { sendBulkEmail, isSending } = useBulkEmail();
   const fileInputRef = useRef<HTMLInputElement>(null);
   
   const [emails, setEmails] = useState<string[]>([]);
   const [subject, setSubject] = useState('');
   const [htmlContent, setHtmlContent] = useState('');
   const [fileName, setFileName] = useState('');
 
   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     if (!file.name.endsWith('.csv')) {
       toast({
         title: "Invalid File",
         description: "Please upload a CSV file",
         variant: "destructive",
       });
       return;
     }
 
     setFileName(file.name);
 
     const text = await file.text();
     const lines = text.split('\n');
     const extractedEmails: string[] = [];
 
     for (const line of lines) {
       const cells = line.split(',');
       for (const cell of cells) {
         const trimmed = cell.trim().replace(/"/g, '');
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (emailRegex.test(trimmed)) {
           extractedEmails.push(trimmed.toLowerCase());
         }
       }
     }
 
     const uniqueEmails = [...new Set(extractedEmails)];
     setEmails(uniqueEmails);
 
     toast({
       title: "CSV Imported",
       description: `Found ${uniqueEmails.length} valid email addresses`,
     });
   };
 
   const handleSend = () => {
     if (emails.length === 0) {
       toast({
         title: "No Emails",
         description: "Please upload a CSV file with email addresses",
         variant: "destructive",
       });
       return;
     }
 
     if (!subject.trim()) {
       toast({
         title: "Subject Required",
         description: "Please enter an email subject",
         variant: "destructive",
       });
       return;
     }
 
     if (!htmlContent.trim()) {
       toast({
         title: "Content Required",
         description: "Please enter email content",
         variant: "destructive",
       });
       return;
     }
 
     sendBulkEmail({
       emails,
       subject,
       html_content: htmlContent,
     });
   };
 
   const clearEmails = () => {
     setEmails([]);
     setFileName('');
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   };
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <Mail className="w-5 h-5" />
           Bulk Email Tool
         </CardTitle>
         <CardDescription>Send emails to multiple users via CSV import</CardDescription>
       </CardHeader>
       <CardContent className="space-y-6">
         {/* CSV Upload */}
         <div className="space-y-2">
           <Label>Import Email Addresses (CSV)</Label>
           <div className="flex gap-2">
             <input
               ref={fileInputRef}
               type="file"
               accept=".csv"
               onChange={handleFileUpload}
               className="hidden"
             />
             <Button
               variant="outline"
               onClick={() => fileInputRef.current?.click()}
               className="gap-2"
             >
               <Upload className="w-4 h-4" />
               Upload CSV
             </Button>
             {fileName && (
               <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                 <FileText className="w-4 h-4" />
                 <span className="text-sm">{fileName}</span>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={clearEmails}
                   className="h-auto p-1"
                 >
                   <Trash2 className="w-3 h-3" />
                 </Button>
               </div>
             )}
           </div>
           {emails.length > 0 && (
             <p className="text-sm text-muted-foreground">
               {emails.length} email addresses loaded
             </p>
           )}
         </div>
 
         {/* Subject */}
         <div className="space-y-2">
           <Label htmlFor="subject">Email Subject</Label>
           <Input
             id="subject"
             value={subject}
             onChange={(e) => setSubject(e.target.value)}
             placeholder="Enter email subject..."
           />
         </div>
 
         {/* Content */}
         <div className="space-y-2">
           <Label htmlFor="content">Email Content (HTML supported)</Label>
           <Textarea
             id="content"
             value={htmlContent}
             onChange={(e) => setHtmlContent(e.target.value)}
             placeholder="Enter your email content here... You can use HTML tags for formatting."
             rows={8}
           />
           <p className="text-xs text-muted-foreground">
             Tip: Use &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;a&gt; tags for formatting
           </p>
         </div>
 
         {/* Preview count */}
         {emails.length > 0 && (
           <div className="p-4 bg-muted/50 rounded-lg">
             <p className="text-sm">
               <strong>Ready to send:</strong> This email will be sent to <strong>{emails.length}</strong> recipients.
             </p>
           </div>
         )}
 
         {/* Send Button */}
         <Button
           onClick={handleSend}
           disabled={isSending || emails.length === 0}
           className="w-full"
         >
           {isSending ? 'Sending...' : `Send to ${emails.length} Recipients`}
         </Button>
       </CardContent>
     </Card>
   );
 };
 
 export default BulkEmailTool;