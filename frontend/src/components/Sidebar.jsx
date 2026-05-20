import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../App';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AppContext);

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Cart', path: '/cart', icon: '🛒' },
    { name: 'Orders', path: '/orders', icon: '📦' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  if (user && user.role === 'admin') {
    navLinks.push({
      name: 'Admin Panel',
      path: '/admin',
      icon: '⚙️'
    });
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#181818] border-r border-white/10 pt-20 z-40 lg:z-10 lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-4 pb-24">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) => 
                  `flex items-center space-x-4 px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-[#242424] hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="bg-[#242424] border border-white/10 p-4 rounded-2xl">
            <span className="text-primary text-xs font-bold uppercase tracking-wider">One Spyde</span>
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
