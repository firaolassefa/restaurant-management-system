// src/components/Admin/MenuManagement.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMenu } from "../Context/MenuContext";
import { useDropzone } from "react-dropzone";

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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [renderedItems, setRenderedItems] = useState([]);

  // Inject CSS for fade-in animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation-name: fadeIn;
        animation-fill-mode: forwards;
        animation-duration: 0.5s;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Fade-in animation effect
  useEffect(() => {
    setRenderedItems(
      state.menuItems.map((item, index) => ({ ...item, animationDelay: index * 100 }))
    );
  }, [state.menuItems]);

  // Dropzone for image upload
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Filter items
  const filteredItems = renderedItems.filter(item =>
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
      setUploadedFile(item.image || null);
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
      setUploadedFile(null);
    }
    setModalOpen(true);
  };

  // Handle form change
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = e => {
    e.preventDefault();
    const newItem = { ...formData, price: parseFloat(formData.price) };
    if (editingItem) {
      dispatch({ type: "UPDATE_MENU_ITEM", payload: { ...editingItem, ...newItem } });
    } else {
      dispatch({ type: "ADD_MENU_ITEM", payload: { id: Date.now(), ...newItem } });
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="relative overflow-hidden rounded-xl shadow-lg opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${item.animationDelay}ms` }}
                >
                  <div className="relative h-56 w-full bg-gray-100 group">
                    <img
                      src={item.image || "https://via.placeholder.com/400x225?text=No+Image"}
                      alt={item.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">{item.category}</Badge>
                    <Badge className={`absolute top-3 right-3 px-2 py-1 text-sm rounded ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </Badge>
                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 font-bold text-lg">
                      {item.price.toFixed(2)}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" onClick={() => openModal(item)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>Delete</Button>
                      <Button size="sm" variant="outline" onClick={() => toggleAvailability(item.id)}>
                        {item.available ? "Mark Unavailable" : "Mark Available"}
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </CardHeader>
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Menu Item Image</Label>
                <div {...getRootProps()} className="border-2 border-dashed p-4 text-center rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <input {...getInputProps()} />
                  {isDragActive
                    ? <p>Drop the image here...</p>
                    : <p>Drag & drop an image, or click to select a file</p>}
                </div>
                <p className="text-center text-sm text-gray-500">or paste an image URL below</p>
                <Input name="image" value={formData.image} onChange={handleChange} placeholder="Enter image URL" />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
                )}
              </div>

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
