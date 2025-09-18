// Authentication Service
// Handles user authentication, token management, and session handling

class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.tokenKey = 'rms_auth_token';
    this.userKey = 'rms_user_data';
  }

  // Login user with email and password
  async login(email, password) {
    try {
      // In a real application, this would make an API call to your backend
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // Clear any other session data
    sessionStorage.clear();
  }

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set authentication token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Set user data
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user && user.role === requiredRole;
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('No token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      
      return {
        success: true,
        token: data.token
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout(); // Clear invalid session
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get authorization headers for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  // Validate session and refresh if needed
  async validateSession() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.status === 401) {
        // Try to refresh token
        const refreshResult = await this.refreshToken();
        return refreshResult.success;
      }

      return response.ok;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Change user password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;

