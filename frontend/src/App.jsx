import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import API from './api/axios';

// Create global Context for simple state management
export const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Layout toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Initialize Auth from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('onespyde_token');
    const storedUser = localStorage.getItem('onespyde_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch cart when token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  // Auth actions
  const login = (newToken, newUser) => {
    localStorage.setItem('onespyde_token', newToken);
    localStorage.setItem('onespyde_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('onespyde_token');
    localStorage.removeItem('onespyde_user');
    setToken(null);
    setUser(null);
    setCart([]);
  };

  // Cart operations
  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        logout(); // Token expired or invalid, log out
      }
    }
  };

  const addToCart = async (foodId) => {
    try {
      await API.post('/cart/add', { foodId, quantity: 1 });
      fetchCart(); // Reload updated items from DB
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartQty = async (foodId, quantity) => {
    try {
      await API.put('/cart/update', { foodId, quantity });
      fetchCart(); // Reload updated items from DB
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      await API.delete(`/cart/remove/${foodId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        cart,
        searchQuery,
        setSearchQuery,
        sidebarOpen,
        setSidebarOpen,
        profileOpen,
        setProfileOpen,
        login,
        logout,
        fetchCart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
