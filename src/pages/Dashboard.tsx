
import { useAuth } from "@/hooks/useAuth";
import { useUserOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/hooks/useCourses";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: orders, isLoading } = useUserOrders();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-purple-50"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>
          
          <Button
            onClick={signOut}
            variant="outline"
            className="hover:bg-red-50 hover:border-red-200"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="font-medium">{user.user_metadata?.full_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard size={20} />
                  <span>My Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No orders found</p>
                    <Button 
                      onClick={() => navigate('/#courses')}
                      className="bg-gradient-to-r from-purple-600 to-purple-800"
                    >
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {order.courses?.title || 'Course'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Order ID: {order.order_id}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium ml-1">
                                {formatPrice(order.amount)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium ml-1">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Contact:</span>
                              <span className="font-medium ml-1">{order.student_phone}</span>
                            </div>
                          </div>
                          
                          {order.status === 'pending' && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Your order is pending. Our team will contact you shortly 
                                to complete the payment and provide course access.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
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
