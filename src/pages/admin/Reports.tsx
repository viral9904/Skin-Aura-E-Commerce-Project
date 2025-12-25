
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Simplified mock data
const salesData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 19000 },
  { month: 'Mar', sales: 15000 },
  { month: 'Apr', sales: 18000 },
  { month: 'May', sales: 21000 },
  { month: 'Jun', sales: 25000 },
];

const productCategoryData = [
  { name: 'Face Serum', value: 45 },
  { name: 'Face Wash', value: 30 },
  { name: 'Sun Screen', value: 25 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const AdminReports = () => {
  const { toast } = useToast();

  const handleDownloadReport = (reportType: string) => {
    // Create report data to download
    let reportData;
    let fileName;
    
    switch (reportType) {
      case 'Sales':
        reportData = salesData;
        fileName = 'monthly-sales-report.json';
        break;
      case 'Product Categories':
        reportData = productCategoryData;
        fileName = 'product-categories-report.json';
        break;
      case 'Top Products':
        reportData = [
          { name: 'Hydrating Face Serum', sales: 145, revenue: '₹22,500' },
          { name: 'Vitamin C Face Wash', sales: 132, revenue: '₹18,700' },
          { name: 'SPF 50 Sun Screen', sales: 98, revenue: '₹14,250' },
        ];
        fileName = 'top-products-report.json';
        break;
      case 'Order Status':
        reportData = [
          { status: 'Pending', count: 24 },
          { status: 'Processing', count: 38 },
          { status: 'Shipped', count: 42 },
          { status: 'Delivered', count: 85 },
          { status: 'Cancelled', count: 12 },
        ];
        fileName = 'order-status-report.json';
        break;
      case 'Monthly Summary':
        reportData = {
          orders: 542,
          revenue: '₹84,250',
          avgOrderValue: '₹1,480',
          refundRate: '2.3%'
        };
        fileName = 'monthly-summary-report.json';
        break;
      default:
        reportData = { error: 'Invalid report type' };
        fileName = 'error-report.json';
    }
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "Report Downloaded",
      description: `The ${reportType} report has been downloaded successfully.`
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Sales</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('Sales')}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                  <Bar dataKey="sales" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Categories Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Categories</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('Product Categories')}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value} products`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">Hydrating Face Serum</p>
                  <p className="text-sm text-muted-foreground">145 units</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹22,500</p>
                </div>
              </li>
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">Vitamin C Face Wash</p>
                  <p className="text-sm text-muted-foreground">132 units</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹18,700</p>
                </div>
              </li>
              <li className="flex justify-between">
                <div>
                  <p className="font-medium">SPF 50 Sun Screen</p>
                  <p className="text-sm text-muted-foreground">98 units</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹14,250</p>
                </div>
              </li>
            </ul>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => handleDownloadReport('Top Products')}
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { status: 'Pending', count: 24, color: 'bg-yellow-500' },
                { status: 'Processing', count: 38, color: 'bg-blue-500' },
                { status: 'Shipped', count: 42, color: 'bg-purple-500' },
                { status: 'Delivered', count: 85, color: 'bg-green-500' },
                { status: 'Cancelled', count: 12, color: 'bg-red-500' },
              ].map((status, i) => (
                <li key={i} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${status.color} mr-2`} />
                  <div className="flex-1 flex justify-between">
                    <span>{status.status}</span>
                    <span className="font-medium">{status.count}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => handleDownloadReport('Order Status')}
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">542</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₹84,250</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">₹1,480</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Refund Rate</p>
                <p className="text-2xl font-bold">2.3%</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => handleDownloadReport('Monthly Summary')}
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
