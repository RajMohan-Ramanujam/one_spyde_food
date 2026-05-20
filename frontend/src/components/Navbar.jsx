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
      
      {/* Brand logo (Basketball Pizza - Game + Food Theme) */}
      <div className="flex items-center space-x-2">
        <Link to="/" onClick={() => setSearchQuery('')} className="flex items-center space-x-2">
          <svg viewBox="0 0 100 100" className="w-6.5 h-6.5 shrink-0 select-none">
            {/* Pizza Crust Box */}
            <rect x="4" y="4" width="92" height="92" rx="18" fill="#D97706" stroke="#000000" strokeWidth="5" />
            {/* Cheese Layer Box */}
            <rect x="10" y="10" width="80" height="80" rx="12" fill="#FBBF24" />
            
            {/* Basketball Seams / Pizza Slice Cuts */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 24 24 C 38 34 38 66 24 76" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 76 24 C 62 34 62 66 76 76" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            
            {/* Red Pepperoni Toppings */}
            <circle cx="30" cy="30" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
            <circle cx="70" cy="30" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
            <circle cx="30" cy="70" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
            <circle cx="70" cy="70" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />

            {/* Stylized 'S' */}
            <text 
              x="50" 
              y="59" 
              textAnchor="middle" 
              fill="#FFFFFF" 
              stroke="#78350F" 
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
            className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-655 text-xs"
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
          className="text-xs text-red-500 hover:text-red-655 font-semibold transition-colors"
        >
          Logout
        </button>
      </nav>

    </header>
  );
};

export default Navbar;
