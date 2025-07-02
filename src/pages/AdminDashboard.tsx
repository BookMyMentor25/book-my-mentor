import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useInquiries } from "@/hooks/useInquiries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { orders, isLoading: isLoadingOrders, updateOrderStatus, isUpdating: isUpdatingOrder } = useAdminOrders();
  const { inquiries, isLoading: isLoadingInquiries, updateInquiryStatus, isUpdating: isUpdatingInquiry } = useInquiries();

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
            <CardDescription className="text-gray-600 text-center">
              You do not have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="destructive" onClick={() => signOut()}>Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and update order statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <p>Loading orders...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders?.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Badge
                              variant={
                                order.status === 'pending'
                                  ? 'secondary'
                                  : order.status === 'processing'
                                    ? 'warning'
                                    : order.status === 'shipped'
                                      ? 'success'
                                      : 'destructive'
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Select
                              defaultValue={order.status}
                              onValueChange={(status) => updateOrderStatus({ id: order.id, status })}
                              disabled={isUpdatingOrder}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={order.status} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Inquiries</CardTitle>
              <CardDescription>Respond to customer inquiries and update their status.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInquiries ? (
                <p>Loading inquiries...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Course Interest
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inquiries?.map((inquiry) => (
                        <tr key={inquiry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.message.substring(0, 50)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.course_interest || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Badge
                              variant={
                                inquiry.status === 'new'
                                  ? 'secondary'
                                  : inquiry.status === 'pending'
                                    ? 'warning'
                                    : inquiry.status === 'resolved'
                                      ? 'success'
                                      : 'destructive'
                              }
                            >
                              {inquiry.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Select
                              defaultValue={inquiry.status}
                              onValueChange={(status) => updateInquiryStatus({ id: inquiry.id, status })}
                              disabled={isUpdatingInquiry}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={inquiry.status} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
