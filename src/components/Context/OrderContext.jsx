// src/components/Context/OrderContext.jsx
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD-001",
      table: "Table 5",
      customer: "John Doe",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 18.99 },
        { name: "Caesar Salad", quantity: 1, price: 12.5 },
      ],
      total: 31.49,
      status: "Pending",
      orderTime: "10:30 AM",
      waiter: "Staff User",
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      table: "Table 2",
      customer: "Alice Johnson",
      items: [
        { name: "Grilled Salmon", quantity: 1, price: 24.99 },
        { name: "Iced Coffee", quantity: 2, price: 9.0 },
      ],
      total: 42.99,
      status: "Preparing",
      orderTime: "10:25 AM",
      waiter: "Staff User",
    },
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const addOrder = (order) => {
    setOrders(prevOrders => [...prevOrders, order]);
  };

  return (
    <OrderContext.Provider value={{ orders, setOrders, updateOrderStatus, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
