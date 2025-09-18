import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('rms_user_data');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('rms_user_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const mockUser = {
        id: 1,
        name: email.includes('admin') ? 'Admin User' : 'Staff User',
        email,
        role: email.includes('admin') ? 'admin' : 'staff',
      };

      setUser(mockUser);
      localStorage.setItem('rms_user_data', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rms_user_data');
    localStorage.removeItem('rms_auth_token');
  };

  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'staff',
      };

      setUser(newUser);
      localStorage.setItem('rms_user_data', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
