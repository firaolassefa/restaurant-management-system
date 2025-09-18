// src/components/Admin/MenuManagement.jsx
import React, { useState } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMenu } from "../Context/MenuContext";


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Appetizer", "Main Course", "Dessert", "Beverage"];

const MenuManagement = () => {
  const { state, dispatch } = useMenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Appetizer",
    image: "",
    available: true,
  });

  // Filter items by search
  const filteredItems = state.menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle availability
  const toggleAvailability = id => {
    const item = state.menuItems.find(i => i.id === id);
    dispatch({ type: "UPDATE_MENU_ITEM", payload: { ...item, available: !item.available } });
  };

  // Delete item
  const deleteItem = id => dispatch({ type: "DELETE_MENU_ITEM", payload: id });

  // Open modal for add/edit
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Appetizer",
        image: "",
        available: true,
      });
    }
    setModalOpen(true);
  };

  // Handle input change
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = e => {
    e.preventDefault();
    if (editingItem) {
      dispatch({
        type: "UPDATE_MENU_ITEM",
        payload: { ...editingItem, ...formData, price: parseFloat(formData.price) },
      });
    } else {
      dispatch({
        type: "ADD_MENU_ITEM",
        payload: { id: Date.now(), ...formData, price: parseFloat(formData.price) },
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Menu Management</h1>
              <Button onClick={() => openModal()}>Add New Item</Button>
            </div>

            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <Card key={item.id}>
                  <div className="aspect-video bg-gray-200 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-2 left-2 ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="mt-1 font-bold text-green-600">${item.price.toFixed(2)}</p>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <Button onClick={() => toggleAvailability(item.id)}>
                      {item.available ? "Mark Unavailable" : "Mark Available"}
                    </Button>
                    <Button onClick={() => openModal(item)}>Edit</Button>
                    <Button variant="destructive" onClick={() => deleteItem(item.id)}>Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Modal for Add/Edit */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required />
              <Input name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
              <Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
              <Select value={formData.category} onValueChange={value => setFormData({ ...formData, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />
              <DialogFooter className="flex justify-end space-x-2">
                <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MenuManagement;
