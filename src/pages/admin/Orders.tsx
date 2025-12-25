
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from '@/types/order';
import { Eye, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateInvoicePDF } from '@/utils/pdfGenerator';

// Mock order data
const mockOrders: Order[] = Array(10).fill(null).map((_, i) => ({
  id: `ORD-${10000 + i}`,
  userId: `user-${i % 3}`,
  items: [
    {
      product: {
        id: `prod-${i + 1}`,
        name: `Product ${i + 1}`,
        description: 'Lorem ipsum dolor sit amet',
        price: Math.floor(Math.random() * 1000) + 500,
        image: '/placeholder.svg',
        category: i % 3 === 0 ? 'Face Serum' : i % 3 === 1 ? 'Face Wash' : 'Sun Screen',
        stock: Math.floor(Math.random() * 50) + 10,
        rating: 4,
        numReviews: 10,
      },
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 1000) + 500,
    }
  ],
  shippingAddress: {
    fullName: `Customer ${i + 1}`,
    addressLine1: `${100 + i} Main St`,
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: `40000${i}`,
    phoneNumber: `+91 98765 4321${i}`
  },
  paymentMethod: i % 2 === 0 ? 'COD' : 'Online',
  paymentStatus: i % 5 === 0 ? 'pending' : i % 5 === 1 ? 'processing' : i % 5 === 2 ? 'completed' : i % 5 === 3 ? 'failed' : 'refunded',
  status: i % 5 === 0 ? 'pending' : i % 5 === 1 ? 'processing' : i % 5 === 2 ? 'shipped' : i % 5 === 3 ? 'delivered' : 'cancelled',
  subtotal: Math.floor(Math.random() * 3000) + 1000,
  shippingCost: 100,
  tax: Math.floor(Math.random() * 300) + 100,
  total: Math.floor(Math.random() * 3500) + 1200,
  createdAt: new Date(2025, 0, 1 + i),
  updatedAt: new Date(2025, 0, 1 + i),
  trackingNumber: i % 3 === 0 ? undefined : `TRK${100000 + i}`,
}));

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() } 
        : order
    ));
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status has been updated to ${status}`
    });
  };

  const handleGenerateInvoice = (order: Order) => {
    // Create a formatted date for the invoice
    const orderDate = order.createdAt.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate PDF invoice
    const pdf = generateInvoicePDF(
      order.id,
      orderDate,
      order.items,
      order.shippingAddress,
      order.subtotal,
      order.shippingCost,
      order.total,
      order.paymentMethod
    );
    
    // Save the PDF
    pdf.save(`invoice-${order.id}.pdf`);
    
    toast({
      title: "Invoice Generated",
      description: `Invoice for order ${order.id} has been generated and is downloading`
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id}
                </TableCell>
                <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>{order.shippingAddress.fullName}</TableCell>
                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
                            <div className="text-sm">
                              <p className="font-medium">{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.phoneNumber}</p>
                              <p>User ID: {order.userId}</p>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
                            <div className="text-sm">
                              <p>{order.shippingAddress.addressLine1}</p>
                              <p>{order.shippingAddress.addressLine2}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Information</h3>
                            <div className="text-sm">
                              <p>Method: {order.paymentMethod}</p>
                              <p>Status: {order.paymentStatus}</p>
                              {order.trackingNumber && (
                                <p>Tracking: {order.trackingNumber}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={item.product.image} 
                                      alt={item.product.name}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                    <div>
                                      <p className="font-medium">{item.product.name}</p>
                                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p>₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>₹{order.subtotal.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between">
                                <p>Shipping</p>
                                <p>₹{order.shippingCost.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between">
                                <p>Tax</p>
                                <p>₹{order.tax.toFixed(2)}</p>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-medium">
                                <p>Total</p>
                                <p>₹{order.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter className="sm:justify-between flex-row">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Update Status:</p>
                            <Select 
                              value={order.status} 
                              onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Button 
                              variant="outline" 
                              onClick={() => handleGenerateInvoice(order)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </Button>
                            <DialogClose asChild>
                              <Button className="ml-2">Close</Button>
                            </DialogClose>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleGenerateInvoice(order)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
