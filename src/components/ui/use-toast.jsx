import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description }]);
    // Automatically remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toast, toasts };
};
