import React, { useContext } from 'react';
import { Search, ShoppingCart, User, Menu, MapPin, X } from 'lucide-react';
import { AppContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleProfile }) => {
  const { cart, user, searchQuery, setSearchQuery } = useContext(AppContext);
  const navigate = useNavigate();

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If not on Home page, navigate to Home page to show filtered results
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-spyde-black/85 backdrop-blur-md border-b border-white/5 z-30 px-4 md:px-8 flex items-center justify-between">
      
      {/* Brand logo & mobile menu toggle */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white p-1 hover:bg-spyde-lightgray rounded-lg lg:hidden transition-colors"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center space-x-2">
          {/* Stylized Spyde Logo */}
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
            S
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white hidden sm:inline-block">
            ONE <span className="text-primary">SPYDE</span>
          </span>
        </Link>
      </div>

      {/* Delivery location pin (Zomato/Swiggy inspired) */}
      <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 max-w-[200px] border-l border-white/10 pl-4">
        <MapPin size={16} className="text-primary shrink-0 animate-bounce" />
        <span className="truncate font-medium">
          {user && user.address ? user.address : 'Select delivery location...'}
        </span>
      </div>

      {/* Realtime Search Bar (Eat Club inspired) */}
      <div className="flex-1 max-w-md mx-4 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Search delicious dishes, pizzas, burgers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-spyde-gray text-gray-200 pl-10 pr-10 py-2 rounded-xl text-sm border border-white/5 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-500"
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Action buttons (Cart, User Profile) */}
      <div className="flex items-center space-x-3.5">
        {/* Cart Trigger */}
        <Link 
          to="/cart"
          className="relative p-2.5 bg-spyde-gray hover:bg-spyde-lightgray border border-white/5 hover:border-primary/20 rounded-xl transition-all group"
        >
          <ShoppingCart size={19} className="text-gray-300 group-hover:text-primary transition-colors" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-spyde-black shadow-md animate-pulse">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Profile Sidebar Trigger */}
        <button 
          onClick={toggleProfile}
          className="flex items-center space-x-2 p-1.5 bg-spyde-gray hover:bg-spyde-lightgray border border-white/5 rounded-xl transition-all"
        >
          <div className="w-7 h-7 bg-primary/25 text-primary rounded-lg flex items-center justify-center font-bold text-sm border border-primary/20">
            {user && user.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
          </div>
          <span className="text-sm font-medium text-gray-300 hidden lg:inline-block pr-1">
            {user ? user.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </div>

    </header>
  );
};

export default Navbar;
