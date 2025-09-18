import React, { useState, useRef } from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Download, Calendar, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedReport, setSelectedReport] = useState('Sales Overview');
  const reportRef = useRef();

  // Sample data
  const salesData = [
    { name: 'Mon', sales: 2400, orders: 24 },
    { name: 'Tue', sales: 1398, orders: 18 },
    { name: 'Wed', sales: 9800, orders: 45 },
    { name: 'Thu', sales: 3908, orders: 32 },
    { name: 'Fri', sales: 4800, orders: 38 },
    { name: 'Sat', sales: 3800, orders: 35 },
    { name: 'Sun', sales: 4300, orders: 40 }
  ];

  const monthlyData = [
    { name: 'Jan', revenue: 15420 },
    { name: 'Feb', revenue: 18230 },
    { name: 'Mar', revenue: 22100 },
    { name: 'Apr', revenue: 19800 },
    { name: 'May', revenue: 25600 },
    { name: 'Jun', revenue: 28900 }
  ];

  const categoryData = [
    { name: 'Main Course', value: 45, color: '#8884d8' },
    { name: 'Appetizer', value: 25, color: '#82ca9d' },
    { name: 'Dessert', value: 20, color: '#ffc658' },
    { name: 'Beverage', value: 10, color: '#ff7300' }
  ];

  const topItems = [
    { name: 'Margherita Pizza', orders: 156, revenue: 2964.44 },
    { name: 'Caesar Salad', orders: 134, revenue: 1675.00 },
    { name: 'Grilled Salmon', orders: 98, revenue: 2449.02 },
    { name: 'Chocolate Cake', orders: 87, revenue: 782.13 },
    { name: 'Iced Coffee', orders: 203, revenue: 913.50 }
  ];

  const staffPerformance = [
    { name: 'Jane Smith', orders: 45, revenue: 1250.50, rating: 4.8 },
    { name: 'Mike Wilson', orders: 38, revenue: 1100.25, rating: 4.6 },
    { name: 'Sarah Davis', orders: 42, revenue: 1180.75, rating: 4.7 },
    { name: 'Tom Johnson', orders: 35, revenue: 980.00, rating: 4.5 }
  ];

  const periods = ['Today', 'This Week', 'This Month', 'Last Month', 'This Year'];
  const reportTypes = ['Sales Overview', 'Menu Performance', 'Staff Performance'];

  // Export report as PDF
  const handleExport = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${selectedReport}-${selectedPeriod}.pdf`);
  };

  // Render helpers
  const renderSalesOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,900</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23.42</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Sales performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Distribution of sales across menu categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderMenuPerformance = () => (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Menu Items</CardTitle>
        <CardDescription>Best selling items by orders and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.orders} orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.revenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStaffPerformance = () => (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>Performance metrics for restaurant staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staffPerformance.map((staff, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{staff.name}</h3>
                  <p className="text-sm text-gray-500">{staff.orders} orders served</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">${staff.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
                <Badge variant="secondary">
                  ⭐ {staff.rating}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Master render function
  const renderReport = () => {
    switch (selectedReport) {
      case 'Sales Overview':
        return renderSalesOverview();
      case 'Menu Performance':
        return renderMenuPerformance();
      case 'Staff Performance':
        return renderStaffPerformance();
      default:
        return renderSalesOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map(period => (
                          <SelectItem key={period} value={period}>{period}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Report Content */}
            <div ref={reportRef}>
              {renderReport()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
