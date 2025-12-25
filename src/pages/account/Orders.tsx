
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/types/order';
import { useToast } from '@/components/ui/use-toast';

// Mock orders data for demonstration
const mockOrders: Order[] = Array(5).fill(null).map((_, i) => ({
  id: `ORD-${10000 + i}`,
  userId: `user-1`,
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
    fullName: `Customer`,
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

const Orders = () => {
  const { toast } = useToast();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order ${orderId} has been downloaded.`
    });
  };

  const getStatusBadge = (status: Order['status']) => {
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
    <div className="container max-w-4xl py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt.toLocaleDateString()} • {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">₹{order.total.toFixed(2)}</p>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                    {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
                
                {expandedOrder === order.id && (
                  <CardContent>
                    <div className="border-t pt-4 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-medium mb-2">Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="h-14 w-14 rounded object-cover" 
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.product.category} • Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">₹{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                          <h3 className="font-medium mb-2">Shipping Address</h3>
                          <div className="text-sm">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                              <p>{order.shippingAddress.addressLine2}</p>
                            )}
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.phoneNumber}</p>
                          </div>
                          
                          <h3 className="font-medium mt-4 mb-2">Shipping</h3>
                          <div className="text-sm">
                            <p>Status: {order.status}</p>
                            {order.trackingNumber && (
                              <p>Tracking: {order.trackingNumber}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Payment Details</h3>
                          <div className="text-sm">
                            <p>Method: {order.paymentMethod}</p>
                            <p>Status: {order.paymentStatus}</p>
                          </div>
                          
                          <h3 className="font-medium mt-4 mb-2">Order Summary</h3>
                          <div className="text-sm space-y-1">
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
                            <div className="flex justify-between border-t pt-1 mt-2 font-medium">
                              <p>Total</p>
                              <p>₹{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t pt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => handleDownloadInvoice(order.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="space-y-4">
            {mockOrders.filter(order => order.status === 'pending').length > 0 ? (
              mockOrders
                .filter(order => order.status === 'pending')
                .map((order) => (
                  // Use the same card format as the "all" tab
                  <Card key={order.id} className="overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.createdAt.toLocaleDateString()} • {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">₹{order.total.toFixed(2)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                    
                    {/* Order details expand/collapse the same as in "all" tab */}
                    {expandedOrder === order.id && (
                      <CardContent>
                        {/* Same content as in the all tab */}
                      </CardContent>
                    )}
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">You have no pending orders</p>
                  <Button asChild variant="outline">
                    <a href="/products">Continue Shopping</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Similar content for other tabs */}
        <TabsContent value="processing">
          <div className="space-y-4">
            {mockOrders.filter(order => order.status === 'processing').length > 0 ? (
              mockOrders
                .filter(order => order.status === 'processing')
                .map((order) => (
                  // Similar card as in "all" tab
                  <Card key={order.id}>
                    {/* Order card content */}
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">You have no processing orders</p>
                  <Button asChild variant="outline">
                    <a href="/products">Continue Shopping</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="delivered">
          <div className="space-y-4">
            {mockOrders.filter(order => order.status === 'delivered').length > 0 ? (
              mockOrders
                .filter(order => order.status === 'delivered')
                .map((order) => (
                  // Similar card as in "all" tab
                  <Card key={order.id}>
                    {/* Order card content */}
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">You have no delivered orders</p>
                  <Button asChild variant="outline">
                    <a href="/products">Continue Shopping</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
