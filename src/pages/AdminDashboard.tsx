import { useAdmin } from "@/hooks/useAdmin";
import { useAdminOrders, useUpdateOrderStatus, useGenerateInvoice } from "@/hooks/useAdminOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, CreditCard, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/hooks/useCourses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useInquiries } from "@/hooks/useInquiries";

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: orders, isLoading } = useAdminOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const generateInvoice = useGenerateInvoice();
  const navigate = useNavigate();
  const { inquiries, isLoading: inquiriesLoading, updateInquiryStatus } = useInquiries();

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  const handleGenerateInvoice = (orderId: string) => {
    generateInvoice.mutate(orderId);
  };

  const stats = {
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(order => order.status === 'pending').length || 0,
    confirmedOrders: orders?.filter(order => order.status === 'confirmed').length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + order.amount, 0) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={() => navigate('/auth')}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">
                              {order.order_id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.student_name}</div>
                                <div className="text-sm text-gray-500">{order.student_email}</div>
                                <div className="text-sm text-gray-500">{order.student_phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>{order.courses?.title || 'Course'}</TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(order.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.invoice_number ? (
                                <div className="text-sm">
                                  <div className="font-mono">{order.invoice_number}</div>
                                  <div className="text-gray-500">
                                    {new Date(order.invoice_generated_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleGenerateInvoice(order.id)}
                                  disabled={generateInvoice.isPending}
                                >
                                  Generate
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Customer Inquiries</CardTitle>
                <CardDescription>
                  Manage customer inquiries and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="text-center py-4">Loading inquiries...</div>
                ) : (
                  <div className="space-y-4">
                    {inquiries?.map((inquiry) => (
                      <Card key={inquiry.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{inquiry.name}</h3>
                            <p className="text-sm text-gray-600">{inquiry.email}</p>
                            {inquiry.phone && (
                              <p className="text-sm text-gray-600">{inquiry.phone}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                              {inquiry.status}
                            </Badge>
                            <Select
                              value={inquiry.status}
                              onValueChange={(value) => updateInquiryStatus({ id: inquiry.id, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {inquiry.course_interest && (
                          <p className="text-sm text-blue-600 mb-2">
                            Interest: {inquiry.course_interest}
                          </p>
                        )}
                        
                        <p className="text-gray-700 mb-2">{inquiry.message}</p>
                        
                        <p className="text-xs text-gray-500">
                          {new Date(inquiry.created_at).toLocaleString()}
                        </p>
                      </Card>
                    ))}
                    
                    {inquiries?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No inquiries found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Manage courses and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add your courses management UI here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
