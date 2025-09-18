// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContextSimple";
import { MenuProvider } from "./components/Context/MenuContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Admin components
import AdminDashboard from "./components/Admin/Dashboard";
import StaffManagement from "./components/Admin/StaffManagement";
import MenuManagement from "./components/Admin/MenuManagement";
import AdminOrders from "./components/Admin/Orders";
import Reports from "./components/Admin/Reports";
import InventoryManagement from "./components/Admin/InventoryManagement";

// User/Staff components
import UserMenu from "./components/User/Menu";
import Cart from "./components/User/Cart";
import Billing from "./components/User/Billing";
import UserOrders from "./components/User/Orders";

// Auth & Common components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NotFound from "./components/Common/NotFound";

// Styles
import "./App.css";
import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/menu"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />

              {/* Staff/User Routes */}
              <Route
                path="/menu"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <UserMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <UserOrders />
                  </ProtectedRoute>
                }
              />

              {/* Default and Not Found */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
