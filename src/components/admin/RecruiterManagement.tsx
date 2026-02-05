 import { useState } from 'react';
 import { useAdminRecruiters } from '@/hooks/useAdminRecruiters';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { format } from 'date-fns';
 import { Building2, CheckCircle, XCircle, Search, Globe, Mail, Phone } from 'lucide-react';
 
 const RecruiterManagement = () => {
   const { recruiters, isLoadingRecruiters, verifyRecruiter, isVerifying } = useAdminRecruiters();
   const [searchTerm, setSearchTerm] = useState('');
 
   const filteredRecruiters = recruiters?.filter(r => 
     r.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.email.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <Building2 className="w-5 h-5" />
           Recruiter Management
         </CardTitle>
         <CardDescription>Verify and manage registered recruiters</CardDescription>
       </CardHeader>
       <CardContent>
         <div className="mb-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input
               placeholder="Search recruiters..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
         </div>
 
         {isLoadingRecruiters ? (
           <p className="text-muted-foreground">Loading recruiters...</p>
         ) : (
           <div className="space-y-4">
             {filteredRecruiters?.map((recruiter) => (
               <div
                 key={recruiter.id}
                 className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
               >
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <h4 className="font-semibold">{recruiter.company_name}</h4>
                     {recruiter.is_verified ? (
                       <Badge className="bg-green-100 text-green-800">
                         <CheckCircle className="w-3 h-3 mr-1" />
                         Verified
                       </Badge>
                     ) : (
                       <Badge variant="secondary">
                         <XCircle className="w-3 h-3 mr-1" />
                         Pending
                       </Badge>
                     )}
                   </div>
                   <div className="text-sm text-muted-foreground space-y-1">
                     <p className="flex items-center gap-2">
                       <Mail className="w-3 h-3" />
                       {recruiter.email}
                     </p>
                     <p>Contact: {recruiter.contact_person}</p>
                     {recruiter.phone && (
                       <p className="flex items-center gap-2">
                         <Phone className="w-3 h-3" />
                         {recruiter.phone}
                       </p>
                     )}
                     {recruiter.website && (
                       <p className="flex items-center gap-2">
                         <Globe className="w-3 h-3" />
                         <a href={recruiter.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                           {recruiter.website}
                         </a>
                       </p>
                     )}
                     <p className="text-xs">Registered: {format(new Date(recruiter.created_at), 'MMM dd, yyyy')}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {recruiter.is_verified ? (
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => verifyRecruiter({ id: recruiter.id, is_verified: false })}
                       disabled={isVerifying}
                     >
                       <XCircle className="w-4 h-4 mr-1" />
                       Unverify
                     </Button>
                   ) : (
                     <Button
                       size="sm"
                       className="bg-green-600 hover:bg-green-700"
                       onClick={() => verifyRecruiter({ id: recruiter.id, is_verified: true })}
                       disabled={isVerifying}
                     >
                       <CheckCircle className="w-4 h-4 mr-1" />
                       Verify
                     </Button>
                   )}
                 </div>
               </div>
             ))}
             {filteredRecruiters?.length === 0 && (
               <p className="text-center text-muted-foreground py-8">No recruiters found</p>
             )}
           </div>
         )}
       </CardContent>
     </Card>
   );
 };
 
 export default RecruiterManagement;