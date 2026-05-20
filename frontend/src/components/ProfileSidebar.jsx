import React, { useContext } from 'react';
import { X, LogOut, User, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ isOpen, toggleProfile }) => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    toggleProfile();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    toggleProfile();
    navigate(path);
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300"
        onClick={toggleProfile}
      ></div>

      {/* Profile Sidebar Drawer */}
      <div className="fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-[#121212] border-l border-white/5 shadow-2xl z-[60] flex flex-col justify-between animate-slide-in">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <User size={22} className="text-primary" />
            <span>My Account</span>
          </h2>
          <button 
            onClick={toggleProfile}
            className="text-gray-400 hover:text-white p-1 hover:bg-spyde-lightgray rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {user ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Avatar Circle */}
            <div className="flex flex-col items-center space-y-2 py-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-primary to-orange-400 rounded-full flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-primary/20">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="font-extrabold text-white text-lg">{user.name}</h3>
              <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {user.role} Member
              </span>
            </div>

            {/* Profile Information List */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-3.5 text-gray-300">
                <Mail size={18} className="text-primary shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-gray-300">
                <Phone size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium">{user.phone || 'Not added yet'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-gray-300">
                <MapPin size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Delivery Address</p>
                  <p className="text-sm font-medium line-clamp-2 leading-snug">
                    {user.address || 'No address set. Update profile.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links inside drawer */}
            <div className="space-y-2 pt-6 border-t border-white/5">
              <button 
                onClick={() => handleNavigate('/profile')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-spyde-gray text-gray-300 hover:text-white transition-all text-sm"
              >
                <span>Edit Profile Details</span>
                <ChevronRight size={16} />
              </button>

              <button 
                onClick={() => handleNavigate('/orders')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-spyde-gray text-gray-300 hover:text-white transition-all text-sm"
              >
                <span>My Order History</span>
                <ChevronRight size={16} />
              </button>

              {user.role === 'admin' && (
                <button 
                  onClick={() => handleNavigate('/admin')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-spyde-gray text-primary hover:text-primary-dark transition-all text-sm font-semibold"
                >
                  <span>Admin Dashboard</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <User size={48} className="text-gray-600 animate-bounce" />
            <p className="text-gray-400 text-sm">Please log in to view your account details.</p>
            <button 
              onClick={() => handleNavigate('/login')}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Footer Area with Logout */}
        {user && (
          <div className="p-6 border-t border-white/5 bg-[#0f0f0f]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2.5 bg-rose-600/10 hover:bg-rose-600 border border-rose-600/20 text-rose-500 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default ProfileSidebar;
