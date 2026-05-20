import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { cart, user, searchQuery, setSearchQuery, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
      
      {/* Brand logo (Basketball Style & Orange/Black Color Pattern) */}
      <div className="flex items-center space-x-2">
        <Link to="/" onClick={() => setSearchQuery('')} className="flex items-center space-x-2.5">
          <svg viewBox="0 0 100 100" className="w-8.5 h-8.5 shrink-0 select-none">
            {/* Basketball Orange Sphere */}
            <circle cx="50" cy="50" r="46" fill="#F97316" stroke="#000000" strokeWidth="5" />
            {/* Seam lines */}
            <path d="M 50 4 A 46 46 0 0 0 50 96" fill="none" stroke="#000000" strokeWidth="4" />
            <path d="M 4 50 A 46 46 0 0 0 96 50" fill="none" stroke="#000000" strokeWidth="4" />
            <path d="M 17 17 C 35 30 35 70 17 83" fill="none" stroke="#000000" strokeWidth="4" />
            <path d="M 83 17 C 65 30 65 70 83 83" fill="none" stroke="#000000" strokeWidth="4" />
            {/* Stylized 'S' */}
            <text 
              x="50" 
              y="59" 
              textAnchor="middle" 
              fill="#FFFFFF" 
              stroke="#000000" 
              strokeWidth="2.5" 
              fontSize="28" 
              fontWeight="900" 
              paintOrder="stroke fill"
            >
              S
            </text>
          </svg>
          <span className="font-bold text-base text-gray-800 tracking-tight">
            One <span className="text-orange-500">Spyde</span>
          </span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-xs md:max-w-sm mx-4 relative">
        <input 
          type="text"
          placeholder="Search food items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-50 text-gray-800 pl-4 pr-8 py-2 rounded-lg text-xs border border-gray-200 focus:outline-none focus:border-orange-500 focus:bg-white"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-650 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Links with Active States */}
      <nav className="flex items-center space-x-3.5 md:space-x-5">
        <Link 
          to="/" 
          onClick={() => setSearchQuery('')}
          className={`text-xs font-semibold transition-colors ${
            isActive('/') ? 'text-orange-500 font-bold' : 'text-gray-500 hover:text-orange-500'
          }`}
        >
          Menu
        </Link>

        <Link 
          to="/orders" 
          className={`text-xs font-semibold transition-colors ${
            isActive('/orders') ? 'text-orange-500 font-bold' : 'text-gray-500 hover:text-orange-500'
          }`}
        >
          Orders
        </Link>

        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            className={`text-xs font-semibold transition-colors ${
              isActive('/admin') ? 'text-orange-500 font-bold' : 'text-gray-500 hover:text-orange-500'
            }`}
          >
            Admin
          </Link>
        )}

        <Link 
          to="/profile" 
          className={`text-xs font-semibold transition-colors ${
            isActive('/profile') ? 'text-orange-500 font-bold' : 'text-gray-500 hover:text-orange-500'
          }`}
        >
          Profile
        </Link>

        {/* Cart Link with Simple Badge */}
        <Link 
          to="/cart"
          className={`relative p-1.5 rounded-lg flex items-center justify-center border transition-colors ${
            isActive('/cart') 
              ? 'bg-orange-50 border-orange-200 text-orange-550' 
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="text-sm">🛒</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        <button 
          onClick={logout}
          className="text-xs text-red-500 hover:text-red-650 font-semibold transition-colors"
        >
          Logout
        </button>
      </nav>

    </header>
  );
};

export default Navbar;
