import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from '../App';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOtp from '../pages/VerifyOtp';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import FoodDetails from '../pages/FoodDetails';
import AdminDashboard from '../pages/AdminDashboard';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Layout wrapper for authenticated pages
const MainLayout = ({ children }) => {
  const { user } = useContext(AppContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col">
      {/* Header Navbar */}
      <Navbar />

      {/* Main App Container */}
      <div className="flex flex-1 pt-16">
        
        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
          <Footer />
        </main>

      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useContext(AppContext);

  return (
    <Routes>
      {/* Public Authentication routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/verify-otp" element={user ? <Navigate to="/" replace /> : <VerifyOtp />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />

      {/* Protected routes wrapped inside MainLayout */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/food/:id" element={<MainLayout><FoodDetails /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/orders" element={<MainLayout><Orders /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      
      {/* Protected Admin Only Route */}
      <Route 
        path="/admin" 
        element={
          user && user.role === 'admin' 
            ? <MainLayout><AdminDashboard /></MainLayout> 
            : <Navigate to="/" replace />
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
