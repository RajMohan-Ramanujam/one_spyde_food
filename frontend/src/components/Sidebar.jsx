import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, History, LayoutDashboard, User } from 'lucide-react';
import { AppContext } from '../App';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AppContext);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', path: '/orders', icon: <History size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  // Add Admin Dashboard link if user is admin
  if (user && user.role === 'admin') {
    navLinks.push({
      name: 'Admin Panel',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    });
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-spyde-gray border-r border-white/5 pt-20 z-40 lg:z-10 lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-4 pb-24">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  // Auto close sidebar on mobile navigation click
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) => 
                  `flex items-center space-x-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'text-gray-400 hover:bg-spyde-lightgray hover:text-white hover:pl-5'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Quick Stats banner or branding */}
          <div className="bg-spyde-lightgray border border-white/5 p-4 rounded-2xl">
            <span className="text-primary text-xs font-black tracking-widest uppercase">One Spyde</span>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Order your favorite meal and enjoy lightning-fast delivery!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
