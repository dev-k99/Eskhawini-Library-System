import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import signalRService from '../services/signalr';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      signalRService.connect();
    }
    setLoading(false);
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAdmin,
      isLibrarian 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
