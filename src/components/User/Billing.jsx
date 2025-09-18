import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Download, 
  Printer, 
  Clock, 
  MapPin, 
  User,
  Receipt,
  ArrowLeft
} from 'lucide-react';
import jsPDF from "jspdf";

const Billing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from navigation state or use sample data
  const orderData = location.state?.order || {
    items: [
      { id: 1, name: 'Margherita Pizza', price: 18.99, quantity: 2 },
      { id: 2, name: 'Caesar Salad', price: 12.50, quantity: 1 },
      { id: 3, name: 'Iced Coffee', price: 4.50, quantity: 3 },
    ],
    details: {
      tableNumber: '5',
      customerName: 'John Doe',
      specialInstructions: 'Extra cheese on pizza',
      orderType: 'Dine In'
    },
    subtotal: 50.48,
    tax: 4.04,
    total: 54.52,
    timestamp: new Date().toISOString()
  };

  const [orderNumber] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [estimatedTime] = useState('15-20 minutes');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Print Receipt
  const handlePrint = () => {
    window.print();
  };

  // Download PDF Receipt
  const handleDownload = () => {
    const doc = new jsPDF();

    // Header / Logo
    doc.setFontSize(20);
    doc.text("🍽 Restaurant Name", 20, 20);
    doc.setFontSize(12);
    doc.text("123 Main Street, Addis Ababa", 20, 28);
    doc.text("Phone: +251 900 000 000", 20, 34);

    doc.line(20, 38, 190, 38); // separator line

    // Order Info
    doc.setFontSize(14);
    doc.text("Receipt", 20, 50);

    doc.setFontSize(12);
    doc.text(`Order Number: ${orderNumber}`, 20, 60);
    doc.text(`Customer: ${orderData.details.customerName}`, 20, 68);
    doc.text(`Table: ${orderData.details.tableNumber}`, 20, 76);
    doc.text(`Date: ${formatDate(orderData.timestamp)}`, 20, 84);
    doc.text(`Order Type: ${orderData.details.orderType}`, 20, 92);

    doc.line(20, 98, 190, 98); // separator line

    // Items
    doc.setFontSize(13);
    doc.text("Items:", 20, 110);

    let yPos = 120;
    orderData.items.forEach((item) => {
      doc.text(`${item.name}  x${item.quantity}`, 25, yPos);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos, { align: "right" });
      yPos += 10;
    });

    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Payment Summary
    doc.setFontSize(12);
    doc.text("Subtotal:", 140, yPos, { align: "right" });
    doc.text(`$${orderData.subtotal.toFixed(2)}`, 190, yPos, { align: "right" });
    yPos += 8;

    doc.text("Tax (8%):", 140, yPos, { align: "right" });
    doc.text(`$${orderData.tax.toFixed(2)}`, 190, yPos, { align: "right" });
    yPos += 8;

    doc.setFontSize(14);
    doc.text("Total:", 140, yPos, { align: "right" });
    doc.text(`$${orderData.total.toFixed(2)}`, 190, yPos, { align: "right" });

    yPos += 20;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Footer
    doc.setFontSize(11);
    doc.text("✅ Payment Confirmed", 20, yPos);
    yPos += 10;
    doc.text("Thank you for dining with us! Please visit again.", 20, yPos);

    // Save PDF
    doc.save(`receipt_${orderNumber}.pdf`);
  };

  const handleNewOrder = () => {
    navigate('/menu');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <CheckCircle className="h-8 w-8" />
                  <div className="text-center">
                    <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
                    <p className="text-green-600">Your order has been received and is being prepared</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Receipt className="h-5 w-5" />
                      <span>Order Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order Number</p>
                        <p className="font-mono text-lg">{orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order Date</p>
                        <p>{formatDate(orderData.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer Name</p>
                        <p className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{orderData.details.customerName}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Table Number</p>
                        <p className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Table {orderData.details.tableNumber}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Type</p>
                      <Badge variant="secondary">{orderData.details.orderType}</Badge>
                    </div>
                    
                    {orderData.details.specialInstructions && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">
                          {orderData.details.specialInstructions}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Items in your order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Order Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                        Preparing
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Estimated time: {estimatedTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${orderData.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${orderData.total.toFixed(2)}</span>
                    </div>
                    <div className="pt-2">
                      <Badge className="bg-green-100 text-green-800 w-full justify-center">
                        Payment Confirmed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={handlePrint} variant="outline" className="w-full">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button onClick={handleNewOrder} className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Place New Order
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p>If you have any questions about your order, please contact our staff.</p>
                      <p className="font-medium">Order Number: {orderNumber}</p>
                    </div>
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

export default Billing;
