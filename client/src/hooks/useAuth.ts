import { useState } from 'react';
import type { AuthSchema, User } from '../types/auth.type';
import { loginService } from '../api/auth.api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: AuthSchema) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService(credentials);
      
      if (response.status === 'success' && response.token) {
        const userData: User = {
          email: credentials.email,
          token: response.token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        setUser(userData);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  return { user, isLoading, error, login, logout };
};