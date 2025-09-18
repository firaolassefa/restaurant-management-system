import React, { useState } from 'react';
import Navbar from '../Layout/Navbar';
import Sidebar from '../Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from 'lucide-react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Tomatoes', category: 'Vegetables', quantity: 50, unit: 'kg', minStock: 20, supplier: 'Fresh Farm Co.', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Mozzarella Cheese', category: 'Dairy', quantity: 15, unit: 'kg', minStock: 10, supplier: 'Dairy Fresh Ltd.', lastUpdated: '2024-01-14' },
    { id: 3, name: 'Olive Oil', category: 'Oils', quantity: 8, unit: 'liters', minStock: 15, supplier: 'Mediterranean Oils', lastUpdated: '2024-01-13' },
    { id: 4, name: 'Chicken Breast', category: 'Meat', quantity: 25, unit: 'kg', minStock: 20, supplier: 'Premium Meats', lastUpdated: '2024-01-15' },
    { id: 5, name: 'Rice', category: 'Grains', quantity: 100, unit: 'kg', minStock: 30, supplier: 'Grain Masters', lastUpdated: '2024-01-12' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
    supplier: ''
  });

  const categories = ['All', 'Vegetables', 'Dairy', 'Meat', 'Grains', 'Oils', 'Spices', 'Beverages'];

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { 
              ...formData, 
              id: editingItem.id, 
              quantity: parseInt(formData.quantity),
              minStock: parseInt(formData.minStock),
              lastUpdated: currentDate
            }
          : item
      ));
      setEditingItem(null);
    } else {
      setInventory([...inventory, { 
        ...formData, 
        id: Date.now(), 
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        lastUpdated: currentDate
      }]);
    }
    setFormData({ name: '', category: '', quantity: '', unit: '', minStock: '', supplier: '' });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ 
      ...item, 
      quantity: item.quantity.toString(),
      minStock: item.minStock.toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const getStockStatus = (item) => {
    if (item.quantity <= item.minStock) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    } else if (item.quantity <= item.minStock * 1.5) {
      return { status: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Good Stock', color: 'bg-green-100 text-green-800' };
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingItem(null);
                    setFormData({ name: '', category: '', quantity: '', unit: '', minStock: '', supplier: '' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inventory Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Update inventory item information' : 'Enter the details for the new inventory item'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Meat">Meat</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                          <SelectItem value="Oils">Oils</SelectItem>
                          <SelectItem value="Spices">Spices</SelectItem>
                          <SelectItem value="Beverages">Beverages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
                          placeholder="kg, liters, pieces"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock Level</Label>
                      <Input
                        id="minStock"
                        name="minStock"
                        type="number"
                        value={formData.minStock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Low Stock Alert:</strong> {lowStockItems.length} item(s) are running low on stock and need restocking.
                </AlertDescription>
              </Alert>
            )}

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search inventory items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
                <CardDescription>
                  Manage your restaurant inventory and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
                            <p className="text-sm text-gray-500">Last updated: {item.lastUpdated}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{item.quantity} {item.unit}</p>
                            <p className="text-sm text-gray-500">Min: {item.minStock} {item.unit}</p>
                          </div>
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryManagement;

