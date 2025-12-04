import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { signInWithGoogle as firebaseGoogleSignIn, initializeFirebase } from '../services/firebaseAuth';

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Firebase if configured
    initializeFirebase();
    
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🔐 Login attempt:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', JSON.stringify(response.data, null, 2));
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check response structure
      if (!response || !response.data) {
        console.error('❌ Invalid response structure:', response);
        return { 
          success: false, 
          error: { message: { en: 'Invalid server response', hi: 'अमान्य सर्वर प्रतिक्रिया' } } 
        };
      }
      
      if (response.data.success === true) {
        const { token, user: userData } = response.data.data || {};
        if (!token || !userData) {
          console.error('❌ Missing token or user data:', response.data);
          return { 
            success: false, 
            error: { message: { en: 'Missing authentication data', hi: 'प्रमाणीकरण डेटा गुम है' } } 
          };
        }
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      
      console.warn('⚠️ Login failed - response not successful:', JSON.stringify(response.data, null, 2));
      const error = response.data.error || { message: { en: 'Login failed', hi: 'लॉगिन विफल' } };
      return { success: false, error };
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: { url: err.config?.url, method: err.config?.method }
      });
      
      // Network error (backend not running, CORS, etc.)
      if (!err.response) {
        const networkError = { 
          en: 'Cannot connect to server. Please check if backend is running on port 3001.', 
          hi: 'सर्वर से कनेक्ट नहीं हो पा रहा। कृपया जांचें कि बैकएंड पोर्ट 3001 पर चल रहा है।' 
        };
        setError(networkError);
        return { success: false, error: { message: networkError } };
      }
      
      // Server error response
      let errorMsg = { en: 'Login failed', hi: 'लॉगिन विफल' };
      
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error.message || errorMsg;
        } else if (err.response.data.message) {
          errorMsg = typeof err.response.data.message === 'string' 
            ? { en: err.response.data.message, hi: err.response.data.message }
            : err.response.data.message;
        }
      }
      
      setError(errorMsg);
      return { success: false, error: { message: errorMsg } };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('📝 Register attempt:', { email: userData.email, name: userData.name });
      const response = await api.post('/auth/register', userData);
      console.log('✅ Register response:', JSON.stringify(response.data, null, 2));
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check response structure
      if (!response || !response.data) {
        console.error('❌ Invalid response structure:', response);
        return { 
          success: false, 
          error: { message: { en: 'Invalid server response', hi: 'अमान्य सर्वर प्रतिक्रिया' } } 
        };
      }
      
      if (response.data.success === true) {
        const { token, user: newUser } = response.data.data || {};
        if (!token || !newUser) {
          console.error('❌ Missing token or user data:', response.data);
          return { 
            success: false, 
            error: { message: { en: 'Missing authentication data', hi: 'प्रमाणीकरण डेटा गुम है' } } 
          };
        }
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
      }
      
      console.warn('⚠️ Registration failed - response not successful:', JSON.stringify(response.data, null, 2));
      const error = response.data.error || { message: { en: 'Registration failed', hi: 'पंजीकरण विफल' } };
      return { success: false, error };
    } catch (err) {
      console.error('❌ Registration error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: { url: err.config?.url, method: err.config?.method }
      });
      
      // Network error (backend not running, CORS, etc.)
      if (!err.response) {
        const networkError = { 
          en: 'Cannot connect to server. Please check if backend is running on port 3001.', 
          hi: 'सर्वर से कनेक्ट नहीं हो पा रहा। कृपया जांचें कि बैकएंड पोर्ट 3001 पर चल रहा है।' 
        };
        setError(networkError);
        return { success: false, error: { message: networkError } };
      }
      
      // Server error response
      let errorMsg = { en: 'Registration failed', hi: 'पंजीकरण विफल' };
      
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error.message || errorMsg;
        } else if (err.response.data.message) {
          errorMsg = typeof err.response.data.message === 'string' 
            ? { en: err.response.data.message, hi: err.response.data.message }
            : err.response.data.message;
        }
      }
      
      setError(errorMsg);
      return { success: false, error: { message: errorMsg } };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await firebaseGoogleSignIn();
      
      if (result.success) {
        // Send Firebase token to backend for user creation/login
        const response = await api.post('/auth/google', {
          token: result.token,
          user: result.user
        });
        
        if (response.data.success) {
          const { token, user: userData } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          return { success: true };
        }
        return { success: false, error: response.data.error };
      }
      return result;
    } catch (err) {
      console.error('Google sign in error:', err);
      const errorMsg = err.response?.data?.error?.message || { en: 'Google sign in failed', hi: 'Google साइन इन विफल' };
      setError(errorMsg);
      return { success: false, error: { message: errorMsg } };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
