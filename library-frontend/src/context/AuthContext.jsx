import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import signalRService from '../services/signalr';

const AuthContext = createContext(null);

// Role enum mapping (backend sends numbers)
const UserRole = {
  0: 'Patron',
  1: 'Librarian', 
  2: 'Admin'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Convert numeric role to string if needed
      if (typeof parsedUser.role === 'number') {
        parsedUser.role = UserRole[parsedUser.role] || 'Patron';
      }
      return parsedUser;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        await signalRService.connect();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const normalizeUser = (userData) => {
    // Convert numeric role to string
    if (typeof userData.role === 'number') {
      userData.role = UserRole[userData.role] || 'Patron';
    }
    return userData;
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, refreshToken, user: userData } = response.data;
    
    // Normalize the user data
    const normalizedUser = normalizeUser({ ...userData });
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    
    setUser(normalizedUser);
    await signalRService.connect();
    
    return normalizedUser;
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    const { token, refreshToken, user: userData } = response.data;
    
    // Normalize the user data
    const normalizedUser = normalizeUser({ ...userData });
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    
    setUser(normalizedUser);
    await signalRService.connect();
    
    return normalizedUser;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    await signalRService.disconnect();
    setUser(null);
  };

  // Role checks - now these will work correctly
  const isAdmin = user?.role === 'Admin';
  const isLibrarian = user?.role === 'Librarian' || user?.role === 'Admin';

  const value = {
    user, 
    login, 
    register, 
    logout, 
    loading,
    isAdmin,
    isLibrarian
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};