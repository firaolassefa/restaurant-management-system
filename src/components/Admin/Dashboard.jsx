import React, { useState, useEffect } from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 15420,
    totalOrders: 156,
    activeStaff: 12,
    lowStockItems: 5,
    todayRevenue: 2340,
    pendingOrders: 8
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 1, table: 'Table 5', items: 3, total: 45.50, status: 'Preparing', time: '10:30 AM' },
    { id: 2, table: 'Table 2', items: 2, total: 28.75, status: 'Ready', time: '10:25 AM' },
    { id: 3, table: 'Table 8', items: 5, total: 67.25, status: 'Served', time: '10:20 AM' },
    { id: 4, table: 'Table 1', items: 1, total: 12.50, status: 'Preparing', time: '10:15 AM' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Served': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.todayRevenue}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    +8 from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeStaff}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently on duty
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">
                    Need restocking
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting preparation
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalSales}</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.table}</p>
                          <p className="text-sm text-gray-500">{order.items} items • {order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-medium">${order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

