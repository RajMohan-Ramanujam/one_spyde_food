import React, { useContext } from 'react';
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
        className="fixed inset-0 bg-black/70 z-50"
        onClick={toggleProfile}
      ></div>

      {/* Profile Sidebar Drawer */}
      <div className="fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-[#181818] border-l border-white/10 shadow-2xl z-[60] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>👤</span>
            <span>My Account</span>
          </h2>
          <button 
            onClick={toggleProfile}
            className="text-gray-400 hover:text-white text-lg p-1.5 hover:bg-white/5 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        {user ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Avatar Circle */}
            <div className="flex flex-col items-center space-y-2 py-4">
              <div className="w-18 h-18 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-3xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="font-extrabold text-white text-lg">{user.name}</h3>
              <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {user.role} Member
              </span>
            </div>

            {/* Profile Information List */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-3.5 text-gray-300">
                <span className="text-lg">📧</span>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 font-bold">Email Address</p>
                  <p className="text-sm font-semibold truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-gray-300">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-xs text-gray-500 font-bold">Phone Number</p>
                  <p className="text-sm font-semibold">{user.phone || 'Not added yet'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-gray-300">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500 font-bold">Delivery Address</p>
                  <p className="text-sm font-semibold leading-snug">
                    {user.address || 'No address set. Update profile.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links inside drawer */}
            <div className="space-y-1 pt-6 border-t border-white/10">
              <button 
                onClick={() => handleNavigate('/profile')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-[#242424] text-gray-300 hover:text-white text-sm"
              >
                <span>Edit Profile Details</span>
                <span>➔</span>
              </button>

              <button 
                onClick={() => handleNavigate('/orders')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-[#242424] text-gray-300 hover:text-white text-sm"
              >
                <span>My Order History</span>
                <span>➔</span>
              </button>

              {user.role === 'admin' && (
                <button 
                  onClick={() => handleNavigate('/admin')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-[#242424] text-primary hover:text-primary-dark text-sm font-bold"
                >
                  <span>Admin Dashboard</span>
                  <span>➔</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-4xl">👤</span>
            <p className="text-gray-400 text-sm">Please log in to view your account details.</p>
            <button 
              onClick={() => handleNavigate('/login')}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Footer Area with Logout */}
        {user && (
          <div className="p-6 border-t border-white/10 bg-[#121212]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2.5 bg-rose-600/10 hover:bg-rose-600 border border-rose-600/20 text-rose-500 hover:text-white font-bold py-3.5 rounded-xl transition-all"
            >
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default ProfileSidebar;
