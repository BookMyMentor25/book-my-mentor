 import { useState } from 'react';
 import { useAdminJobs } from '@/hooks/useAdminRecruiters';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { format } from 'date-fns';
 import { Briefcase, CheckCircle, XCircle, Search, MapPin, Building2 } from 'lucide-react';
 
 const JobManagement = () => {
   const { jobs, isLoadingJobs, toggleJob, isToggling } = useAdminJobs();
   const [searchTerm, setSearchTerm] = useState('');
 
   const filteredJobs = jobs?.filter(j => 
     j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (j.recruiters as any)?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <Briefcase className="w-5 h-5" />
           Job Listings Management
         </CardTitle>
         <CardDescription>Approve and manage job postings</CardDescription>
       </CardHeader>
       <CardContent>
         <div className="mb-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search jobs..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
         </div>
 
         {isLoadingJobs ? (
           <p className="text-muted-foreground">Loading jobs...</p>
         ) : (
           <div className="space-y-4">
             {filteredJobs?.map((job) => (
               <div
                 key={job.id}
                 className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
               >
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 flex-wrap">
                     <h4 className="font-semibold">{job.title}</h4>
                     {job.is_active ? (
                       <Badge className="bg-green-100 text-green-800">
                         <CheckCircle className="w-3 h-3 mr-1" />
                         Active
                       </Badge>
                     ) : (
                       <Badge variant="secondary">
                         <XCircle className="w-3 h-3 mr-1" />
                         Inactive
                       </Badge>
                     )}
                     <Badge variant="outline">{job.job_type}</Badge>
                   </div>
                   <div className="text-sm text-muted-foreground space-y-1">
                     <p className="flex items-center gap-2">
                       <Building2 className="w-3 h-3" />
                       {(job.recruiters as any)?.company_name || 'Unknown'}
                       {(job.recruiters as any)?.is_verified && (
                         <Badge variant="secondary" className="text-xs">Verified Recruiter</Badge>
                       )}
                     </p>
                     <p className="flex items-center gap-2">
                       <MapPin className="w-3 h-3" />
                       {job.location}
                     </p>
                     <p className="text-xs">Posted: {format(new Date(job.created_at), 'MMM dd, yyyy')}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {job.is_active ? (
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => toggleJob({ id: job.id, is_active: false })}
                       disabled={isToggling}
                     >
                       <XCircle className="w-4 h-4 mr-1" />
                       Deactivate
                     </Button>
                   ) : (
                     <Button
                       size="sm"
                       className="bg-green-600 hover:bg-green-700"
                       onClick={() => toggleJob({ id: job.id, is_active: true })}
                       disabled={isToggling}
                     >
                       <CheckCircle className="w-4 h-4 mr-1" />
                       Activate
                     </Button>
                   )}
                 </div>
               </div>
             ))}
             {filteredJobs?.length === 0 && (
               <p className="text-center text-muted-foreground py-8">No jobs found</p>
             )}
           </div>
         )}
       </CardContent>
     </Card>
   );
 };
 
 export default JobManagement;