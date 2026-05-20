import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { cart, user, searchQuery, setSearchQuery, logout } = useContext(AppContext);
  const navigate = useNavigate();

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
      
      {/* Brand logo */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
            S
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            ONE <span className="text-primary">SPYDE</span>
          </span>
        </Link>

        {/* Location Pin */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs text-gray-400 max-w-[180px] border-l border-white/10 pl-4">
          <span className="text-primary">📍</span>
          <span className="truncate font-semibold">
            {user && user.address ? user.address : 'Select location...'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xs md:max-w-md mx-4 relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 text-sm">🔍</span>
        <input 
          type="text"
          placeholder="Search items..."
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

      {/* Navigation Links directly in Navbar */}
      <nav className="flex items-center space-x-2 md:space-x-4">
        <Link 
          to="/" 
          className="text-xs md:text-sm text-gray-300 hover:text-white font-bold px-2 py-1 rounded"
        >
          Menu
        </Link>

        <Link 
          to="/orders" 
          className="text-xs md:text-sm text-gray-300 hover:text-white font-bold px-2 py-1 rounded"
        >
          Orders
        </Link>

        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            className="text-xs md:text-sm text-primary hover:text-primary-light font-bold px-2 py-1 rounded"
          >
            Admin
          </Link>
        )}

        <Link 
          to="/profile" 
          className="text-xs md:text-sm text-gray-300 hover:text-white font-bold px-2 py-1 rounded"
        >
          Profile
        </Link>

        {/* Cart Link with Badge */}
        <Link 
          to="/cart"
          className="relative p-2 bg-[#242424] hover:bg-white/5 border border-white/10 rounded-xl flex items-center justify-center"
        >
          <span className="text-base text-gray-300">🛒</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-black">
              {cartItemCount}
            </span>
          )}
        </Link>

        <button 
          onClick={logout}
          className="text-xs md:text-sm text-rose-500 hover:text-rose-400 font-bold px-2 py-1"
        >
          Logout
        </button>
      </nav>

    </header>
  );
};

export default Navbar;
