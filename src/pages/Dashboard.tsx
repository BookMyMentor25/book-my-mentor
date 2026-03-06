import { useAuth } from "@/hooks/useAuth";
import { useUserOrders } from "@/hooks/useOrders";
import { useJobApplications } from "@/hooks/useJobs";
import { useJobSubscription } from "@/hooks/useJobSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, CreditCard, Briefcase, Crown, MapPin, Building2, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/hooks/useCourses";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: orders, isLoading } = useUserOrders();
  const { userApplications, isLoadingApplications } = useJobApplications();
  const { hasActiveSubscription, subscription } = useJobSubscription();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-accent/10 text-accent';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      case 'accepted': return 'bg-primary/10 text-primary';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <Button onClick={signOut} variant="outline" className="text-destructive hover:bg-destructive/5">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Subscription */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" /> Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{user.user_metadata?.full_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className={hasActiveSubscription ? "border-primary/30" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-primary" /> Jobs Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasActiveSubscription ? (
                  <div className="space-y-3">
                    <Badge className="bg-primary/10 text-primary">Active</Badge>
                    <p className="text-sm text-muted-foreground">
                      Valid until <strong>{new Date(subscription?.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </p>
                    <Button onClick={() => navigate('/jobs')} variant="outline" size="sm" className="w-full gap-2">
                      <Briefcase className="w-4 h-4" /> Browse Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Get access to apply for jobs, AI Resume Builder & more.</p>
                    <Button onClick={() => navigate('/jobs/subscribe')} size="sm" className="w-full cta-primary gap-2">
                      <Crown className="w-4 h-4" /> ₹299 for 3 months
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Orders & Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5" /> My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders found</p>
                    <Button onClick={() => navigate('/#courses')} className="cta-primary">Browse Courses</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{order.courses?.title || 'Course'}</h4>
                              <p className="text-xs text-muted-foreground">Order ID: {order.order_id}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div><span className="text-muted-foreground">Amount:</span> <strong>{formatPrice(order.amount)}</strong></div>
                            <div><span className="text-muted-foreground">Date:</span> <strong>{new Date(order.created_at).toLocaleDateString()}</strong></div>
                            <div><span className="text-muted-foreground">Phone:</span> <strong>{order.student_phone}</strong></div>
                          </div>
                          {order.status === 'pending' && (
                            <div className="mt-3 p-3 bg-muted/50 border rounded text-sm text-muted-foreground">
                              <strong>Note:</strong> Your order is pending. Our team will contact you shortly.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5" /> My Job Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : !userApplications || userApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                    <Button onClick={() => navigate('/jobs')} variant="outline" className="gap-2">
                      <Briefcase className="w-4 h-4" /> Browse Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userApplications.map((app: any) => {
                      const job = app.job_postings;
                      const companyName = job?.recruiters?.company_name || 'Company';
                      return (
                        <Card key={app.id} className="border-l-4 border-l-accent hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="min-w-0 flex-1">
                                <Link to={`/job/${app.job_id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                                  {job?.title || 'Job'}
                                </Link>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{companyName}</span>
                                </div>
                              </div>
                              <Badge className={getStatusColor(app.status || 'pending')}>
                                {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                              {job?.location && (
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              )}
                              {job?.job_type && (
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.job_type.replace('-', ' ')}</span>
                              )}
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Applied {new Date(app.created_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
