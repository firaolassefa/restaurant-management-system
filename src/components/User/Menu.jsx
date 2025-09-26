import React, { useState, useEffect } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const [animateQuantity, setAnimateQuantity] = useState({}); // for pop animation

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = state.menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  const triggerQuantityAnimation = (id) => {
    setAnimateQuantity(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAnimateQuantity(prev => ({ ...prev, [id]: false }));
    }, 200); // animation duration
  };

  const addToCart = (item) => {
    triggerQuantityAnimation(item.id);
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    triggerQuantityAnimation(itemId);
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Menu</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">{totalItems} items</span>
                  <span className="text-gray-500">•</span>
                  <span className="font-medium text-green-600">{totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={() => window.location.href="/cart"}>View Cart</Button>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded p-2">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Menu Grid with entrance animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const quantity = getQuantity(item.id);
                const isAnimating = animateQuantity[item.id] || false;

                return (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden rounded-2xl shadow-md flex flex-col min-h-[420px] sm:min-h-[440px] lg:min-h-[480px] 
                               transform transition duration-300 hover:scale-105 hover:shadow-xl group
                               ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                               transition-all delay-${index * 100}`}
                  >
                    {/* Image with zoom + gradient */}
                    <div className="w-full h-40 sm:h-48 lg:h-56 relative bg-gray-100 overflow-hidden rounded-t-2xl">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-t-2xl"></div>
                      <Badge className={`absolute top-2 left-2 transform transition duration-300 group-hover:scale-110 group-hover:shadow-lg ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </Badge>
                    </div>

                    {/* Card Content */}
                    <CardHeader className="flex-1 flex flex-col justify-between p-4">
                      <div>
                        <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </div>
                      <p className="mt-2 font-bold text-green-600">{item.price.toFixed(2)}</p>
                    </CardHeader>

                    {/* Action Buttons with glow & quantity pop */}
                    <CardContent className="flex items-center justify-between border-t pt-3 px-4">
                      {quantity > 0 ? (
                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={() => removeFromCart(item.id)} 
                            size="sm" 
                            className="rounded-full px-3 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 hover:shadow-md hover:shadow-gray-400/50 transition transform duration-200"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className={`font-medium transition-transform duration-150 ${isAnimating ? "scale-125 text-lg" : ""}`}>{quantity}</span>
                          <Button 
                            onClick={() => addToCart(item)} 
                            size="sm" 
                            className="rounded-full px-3 bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-400/50 transition transform duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => addToCart(item)} 
                          size="sm" 
                          className="rounded-lg w-full bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-400/50 transition transform duration-200"
                        >
                          Add
                        </Button>
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
