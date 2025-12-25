
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: "Total Products",
      value: "125",
      icon: <Package className="h-8 w-8 text-primary" />,
      change: "+12% from last month"
    },
    {
      title: "Total Users",
      value: "854",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      change: "+3% from last month"
    },
    {
      title: "Total Orders",
      value: "642",
      icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
      change: "+18% from last month"
    },
    {
      title: "Total Revenue",
      value: "₹1,24,568",
      icon: <TrendingUp className="h-8 w-8 text-yellow-500" />,
      change: "+6% from last month"
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Order #{10024 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(2023, 3, 15 - i).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">₹{(Math.random() * 1000 + 500).toFixed(2)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {["Delivered", "Processing", "Shipped", "Pending", "Delivered"][i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Hydrating Face Serum",
                "Vitamin C Face Wash",
                "SPF 50 Sun Screen",
                "Anti-Aging Night Cream",
                "Brightening Face Mask"
              ].map((product, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{product}</p>
                    <p className="text-sm text-muted-foreground">
                      {["Face Serum", "Face Wash", "Sun Screen", "Face Serum", "Face Mask"][i]}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{Math.floor(Math.random() * 100) + 10} sold</p>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className={`h-3 w-3 ${j < (5 - i * 0.5) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
