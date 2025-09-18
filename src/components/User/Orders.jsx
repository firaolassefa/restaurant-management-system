import React, { useState } from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Calendar,
  Receipt
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-001234',
      date: '2024-01-15',
      time: '2:30 PM',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
        { name: 'Caesar Salad', quantity: 1, price: 12.50 }
      ],
      total: 31.49,
      status: 'Delivered',
      table: 'Table 5',
      estimatedTime: 'Completed',
      orderType: 'Dine In'
    },
    {
      id: 2,
      orderNumber: 'ORD-001235',
      date: '2024-01-15',
      time: '3:15 PM',
      items: [
        { name: 'Grilled Salmon', quantity: 1, price: 24.99 },
        { name: 'Iced Coffee', quantity: 2, price: 9.00 }
      ],
      total: 33.99,
      status: 'Preparing',
      table: 'Table 3',
      estimatedTime: '10 mins',
      orderType: 'Dine In'
    },
    {
      id: 3,
      orderNumber: 'ORD-001236',
      date: '2024-01-14',
      time: '7:45 PM',
      items: [
        { name: 'Chicken Alfredo', quantity: 1, price: 19.99 },
        { name: 'Chocolate Cake', quantity: 1, price: 8.99 }
      ],
      total: 28.98,
      status: 'Cancelled',
      table: 'Table 2',
      estimatedTime: 'Cancelled',
      orderType: 'Dine In'
    },
    {
      id: 4,
      orderNumber: 'ORD-001237',
      date: '2024-01-14',
      time: '1:20 PM',
      items: [
        { name: 'Bruschetta', quantity: 2, price: 19.98 },
        { name: 'Tiramisu', quantity: 1, price: 7.99 }
      ],
      total: 27.97,
      status: 'Delivered',
      table: 'Table 8',
      estimatedTime: 'Completed',
      orderType: 'Takeout'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Preparing': 'bg-yellow-100 text-yellow-800',
      'Ready': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing': return <Clock className="h-4 w-4" />;
      case 'Ready': return <CheckCircle className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const reorderItems = (order) => {
    // In a real application, this would add items to cart and navigate to cart
    alert(`Reordering items from ${order.orderNumber}. This would add items to your cart.`);
  };

  const trackOrder = (order) => {
    // In a real application, this would show real-time order tracking
    alert(`Tracking order ${order.orderNumber}. This would show real-time updates.`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {orders.filter(o => o.status === 'Preparing').length} Preparing
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                      placeholder="Search orders by number or items..."
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
                <CardTitle>Order History ({filteredOrders.length})</CardTitle>
                <CardDescription>
                  View and manage your restaurant orders
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
                          <p className="text-sm text-gray-500">
                            {order.table} • {order.orderType}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{order.date} at {order.time}</span>
                          </p>
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
                                  Complete order information and actions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Order Date</p>
                                    <p className="text-sm text-gray-600">{order.date} at {order.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Table</p>
                                    <p className="text-sm text-gray-600">{order.table}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Order Type</p>
                                    <p className="text-sm text-gray-600">{order.orderType}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
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
                                
                                <div className="flex space-x-2 pt-4">
                                  {order.status === 'Delivered' && (
                                    <Button
                                      onClick={() => reorderItems(order)}
                                      className="flex-1"
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Reorder
                                    </Button>
                                  )}
                                  {(order.status === 'Preparing' || order.status === 'Ready') && (
                                    <Button
                                      onClick={() => trackOrder(order)}
                                      variant="outline"
                                      className="flex-1"
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Track Order
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <Receipt className="h-4 w-4 mr-2" />
                                    View Receipt
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {order.status === 'Delivered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => reorderItems(order)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== 'All' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'You haven\'t placed any orders yet'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;

