import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 18.99, quantity: 2, image: '/api/placeholder/100/100' },
    { id: 2, name: 'Caesar Salad', price: 12.50, quantity: 1, image: '/api/placeholder/100/100' },
    { id: 3, name: 'Iced Coffee', price: 4.50, quantity: 3, image: '/api/placeholder/100/100' },
  ]);

  const [orderDetails, setOrderDetails] = useState({
    tableNumber: '',
    customerName: '',
    specialInstructions: '',
    orderType: 'Dine In'
  });

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (!orderDetails.tableNumber || !orderDetails.customerName) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically send the order to your backend
    const order = {
      items: cartItems,
      details: orderDetails,
      subtotal: getSubtotal(),
      tax: getTax(),
      total: getTotal(),
      timestamp: new Date().toISOString()
    };

    console.log('Placing order:', order);
    
    // Navigate to billing page
    navigate('/billing', { state: { order } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                  <p className="text-gray-500 mb-6">Add some delicious items from our menu to get started!</p>
                  <Button onClick={() => navigate('/menu')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <Button variant="outline" onClick={() => navigate('/menu')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({getTotalItems()} items)</CardTitle>
                    <CardDescription>Review your selected items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAzMEg2MFY3MEg0MFYzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Please provide your order information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={orderDetails.customerName}
                          onChange={handleInputChange}
                          placeholder="Enter customer name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tableNumber">Table Number *</Label>
                        <Input
                          id="tableNumber"
                          name="tableNumber"
                          value={orderDetails.tableNumber}
                          onChange={handleInputChange}
                          placeholder="Enter table number"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderType">Order Type</Label>
                      <Select
                        value={orderDetails.orderType}
                        onValueChange={(value) => setOrderDetails({...orderDetails, orderType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dine In">Dine In</SelectItem>
                          <SelectItem value="Takeout">Takeout</SelectItem>
                          <SelectItem value="Delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        value={orderDetails.specialInstructions}
                        onChange={handleInputChange}
                        placeholder="Any special requests or dietary restrictions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${getSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>${getTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>${getTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <p className="text-sm text-gray-600">
                        <strong>Items:</strong> {getTotalItems()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Estimated Time:</strong> 15-20 minutes
                      </p>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart;

