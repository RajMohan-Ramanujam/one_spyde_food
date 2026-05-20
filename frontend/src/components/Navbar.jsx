import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleProfile }) => {
  const { cart, user, searchQuery, setSearchQuery } = useContext(AppContext);
  const navigate = useNavigate();

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#181818] border-b border-white/10 z-30 px-4 md:px-8 flex items-center justify-between">
      
      {/* Brand logo & mobile menu toggle */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg lg:hidden"
        >
          <span className="text-xl">☰</span>
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
            S
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white hidden sm:inline-block">
            ONE <span className="text-primary">SPYDE</span>
          </span>
        </Link>
      </div>

      {/* Delivery location pin */}
      <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 max-w-[200px] border-l border-white/10 pl-4">
        <span className="text-primary">📍</span>
        <span className="truncate font-semibold">
          {user && user.address ? user.address : 'Select location...'}
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
          <span className="text-sm">🔍</span>
        </div>
        <input 
          type="text"
          placeholder="Search foods, pizza, burgers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-[#242424] text-gray-200 pl-9 pr-8 py-2 rounded-xl text-sm border border-white/10 focus:outline-none placeholder:text-gray-500"
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Action buttons (Cart, User Profile) */}
      <div className="flex items-center space-x-3">
        {/* Cart Trigger */}
        <Link 
          to="/cart"
          className="relative p-2.5 bg-[#242424] hover:bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"
        >
          <span className="text-lg text-gray-300">🛒</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-black">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Profile Trigger */}
        <button 
          onClick={toggleProfile}
          className="flex items-center space-x-2 p-1.5 bg-[#242424] hover:bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="w-7 h-7 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
            {user && user.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <span className="text-sm font-semibold text-gray-300 hidden lg:inline-block pr-1">
            {user ? user.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </div>

    </header>
  );
};

export default Navbar;
