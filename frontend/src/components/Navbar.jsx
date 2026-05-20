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

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
      
      {/* Brand logo */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="font-bold text-lg text-gray-800">
            One <span className="text-orange-500">Spyde</span>
          </span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-xs md:max-w-md mx-4 relative">
        <input 
          type="text"
          placeholder="Search food items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-100 text-gray-800 pl-4 pr-8 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:border-orange-500 focus:bg-white"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Simple Navigation Links */}
      <nav className="flex items-center space-x-3 md:space-x-6">
        <Link 
          to="/" 
          className="text-sm text-gray-600 hover:text-orange-500 font-semibold"
        >
          Menu
        </Link>

        <Link 
          to="/orders" 
          className="text-sm text-gray-600 hover:text-orange-500 font-semibold"
        >
          Orders
        </Link>

        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold"
          >
            Admin
          </Link>
        )}

        <Link 
          to="/profile" 
          className="text-sm text-gray-600 hover:text-orange-500 font-semibold"
        >
          Profile
        </Link>

        {/* Cart Link with Simple Badge */}
        <Link 
          to="/cart"
          className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300"
        >
          <span className="text-base">🛒</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        <button 
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-600 font-semibold"
        >
          Logout
        </button>
      </nav>

    </header>
  );
};

export default Navbar;
