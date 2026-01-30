import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import signalRService from '../services/signalr';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize state from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only handle SignalR connection, not state updates
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        await signalRService.connect();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, refreshToken, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
    await signalRService.connect();
    
    return user;
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    const { token, refreshToken, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
    await signalRService.connect();
    
    return user;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    await signalRService.disconnect();
    setUser(null);
  };

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

// Export useAuth hook separately to avoid the eslint warning
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};