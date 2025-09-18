import React, { useState } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMenu } from "../Context/MenuContext";


import { Search, Plus, Minus, ShoppingCart } from "lucide-react";

const categories = ["All", "Appetizer", "Main Course", "Dessert", "Beverage"];

const UserMenu = () => {
  const { state } = useMenu();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredItems = state.menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(cartItem => cartItem.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(cartItem => cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getQuantity = (id) => {
    const item = cart.find(cartItem => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getCategoryColor = (category) => {
    const colors = {
      "Appetizer": "bg-blue-100 text-blue-800",
      "Main Course": "bg-purple-100 text-purple-800",
      "Dessert": "bg-pink-100 text-pink-800",
      "Beverage": "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Menu</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">{totalItems} items</span>
                  <span className="text-gray-500">•</span>
                  <span className="font-medium text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={() => window.location.href="/cart"}>View Cart</Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded p-2">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => {
                const quantity = getQuantity(item.id);
                return (
                  <Card key={item.id}>
                    <div className="aspect-video bg-gray-200 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)}`}>{item.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                      <p className="mt-1 font-bold text-green-600">${item.price.toFixed(2)}</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      {quantity > 0 ? (
                        <div className="flex items-center space-x-3">
                          <Button onClick={() => removeFromCart(item.id)}>-</Button>
                          <span>{quantity}</span>
                          <Button onClick={() => addToCart(item)}>+</Button>
                        </div>
                      ) : (
                        <Button onClick={() => addToCart(item)}>Add</Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserMenu;
