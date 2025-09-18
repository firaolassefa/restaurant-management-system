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
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', email: 'john@restaurant.com', role: 'Waiter', phone: '123-456-7890', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@restaurant.com', role: 'Chef', phone: '123-456-7891', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@restaurant.com', role: 'Cashier', phone: '123-456-7892', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@restaurant.com', role: 'Manager', phone: '123-456-7893', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    status: 'Active'
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(member => 
        member.id === editingStaff.id 
          ? { ...formData, id: editingStaff.id }
          : member
      ));
      setEditingStaff(null);
    } else {
      setStaff([...staff, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: '', email: '', role: '', phone: '', status: 'Active' });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData(member);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingStaff(null);
                    setFormData({ name: '', email: '', role: '', phone: '', status: 'Active' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
                    <DialogDescription>
                      {editingStaff ? 'Update staff member information' : 'Enter the details for the new staff member'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Waiter">Waiter</SelectItem>
                          <SelectItem value="Chef">Chef</SelectItem>
                          <SelectItem value="Cashier">Cashier</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Kitchen Staff">Kitchen Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search staff by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Staff List */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
                <CardDescription>
                  Manage your restaurant staff members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">{member.role}</Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default StaffManagement;

