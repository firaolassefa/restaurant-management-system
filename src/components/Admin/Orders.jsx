import React, { useState } from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-001',
      table: 'Table 5',
      customer: 'John Doe',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
        { name: 'Caesar Salad', quantity: 1, price: 12.50 }
      ],
      total: 31.49,
      status: 'Preparing',
      orderTime: '10:30 AM',
      estimatedTime: '15 mins',
      waiter: 'Jane Smith'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      table: 'Table 2',
      customer: 'Alice Johnson',
      items: [
        { name: 'Grilled Salmon', quantity: 1, price: 24.99 },
        { name: 'Iced Coffee', quantity: 2, price: 9.00 }
      ],
      total: 33.99,
      status: 'Ready',
      orderTime: '10:25 AM',
      estimatedTime: 'Ready',
      waiter: 'Mike Wilson'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      table: 'Table 8',
      customer: 'Bob Brown',
      items: [
        { name: 'Chocolate Cake', quantity: 2, price: 17.98 },
        { name: 'Iced Coffee', quantity: 1, price: 4.50 }
      ],
      total: 22.48,
      status: 'Served',
      orderTime: '10:20 AM',
      estimatedTime: 'Completed',
      waiter: 'Sarah Davis'
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      table: 'Table 1',
      customer: 'Emma Wilson',
      items: [
        { name: 'Caesar Salad', quantity: 1, price: 12.50 }
      ],
      total: 12.50,
      status: 'Pending',
      orderTime: '10:35 AM',
      estimatedTime: '20 mins',
      waiter: 'Jane Smith'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-gray-100 text-gray-800',
      'Preparing': 'bg-yellow-100 text-yellow-800',
      'Ready': 'bg-green-100 text-green-800',
      'Served': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Preparing': return <Clock className="h-4 w-4" />;
      case 'Ready': return <CheckCircle className="h-4 w-4" />;
      case 'Served': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {orders.filter(o => o.status === 'Pending').length} Pending
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {orders.filter(o => o.status === 'Preparing').length} Preparing
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {orders.filter(o => o.status === 'Ready').length} Ready
                </Badge>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by number, customer, or table..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                <CardDescription>
                  Monitor and manage all restaurant orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-500">{order.table} • {order.customer}</p>
                          <p className="text-sm text-gray-500">Waiter: {order.waiter} • {order.orderTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{order.items.length} items</p>
                          <p className="text-sm text-gray-500">{order.estimatedTime}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                                <DialogDescription>
                                  Complete order information and status management
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Customer</p>
                                    <p className="text-sm text-gray-600">{order.customer}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Table</p>
                                    <p className="text-sm text-gray-600">{order.table}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Waiter</p>
                                    <p className="text-sm text-gray-600">{order.waiter}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Order Time</p>
                                    <p className="text-sm text-gray-600">{order.orderTime}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium mb-2">Items Ordered</p>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm">{item.name} x{item.quantity}</span>
                                        <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                    <span className="font-medium">Total</span>
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium mb-2">Update Status</p>
                                  <div className="flex space-x-2">
                                    {['Pending', 'Preparing', 'Ready', 'Served'].map(status => (
                                      <Button
                                        key={status}
                                        variant={order.status === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateOrderStatus(order.id, status)}
                                      >
                                        {status}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {order.status !== 'Served' && order.status !== 'Cancelled' && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Preparing">Preparing</SelectItem>
                                <SelectItem value="Ready">Ready</SelectItem>
                                <SelectItem value="Served">Served</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
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

export default Orders;

