import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContextSimple';


import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  ShoppingCart, 
  FileText, 
  Package, 
  Receipt,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/staff', icon: Users, label: 'Staff Management' },
    { path: '/admin/menu', icon: Menu, label: 'Menu Management' },
    { path: '/admin/inventory', icon: Package, label: 'Inventory' },
    { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
  ];

  const userMenuItems = [
    { path: '/menu', icon: Menu, label: 'Menu' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/orders', icon: ClipboardList, label: 'My Orders' },
    { path: '/billing', icon: Receipt, label: 'Billing' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-300">
          {user?.role === 'admin' ? 'Admin Panel' : 'Staff Panel'}
        </h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

