import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Company Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {/* Basketball Pizza Logo - Game + Food Theme */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 select-none">
              <circle cx="50" cy="50" r="46" fill="#D97706" stroke="#000000" strokeWidth="4.5" />
              <circle cx="50" cy="50" r="40" fill="#FBBF24" />
              <path d="M 50 10 A 40 40 0 0 0 50 90" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 0 90 50" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <path d="M 21.5 21.5 C 37 32 37 68 21.5 78.5" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <path d="M 78.5 21.5 C 63 32 63 68 78.5 78.5" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="32" cy="35" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <circle cx="68" cy="35" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <circle cx="32" cy="65" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <circle cx="68" cy="65" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <circle cx="50" cy="22" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <circle cx="50" cy="78" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
              <text 
                x="50" 
                y="59" 
                textAnchor="middle" 
                fill="#FFFFFF" 
                stroke="#78350F" 
                strokeWidth="2" 
                fontSize="26" 
                fontWeight="900" 
                paintOrder="stroke fill"
              >
                S
              </text>
            </svg>
            <span className="font-bold text-base text-gray-800">
              One <span className="text-orange-500">Spyde</span>
            </span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Fast, secure, and fresh food delivery right at your doorstep. Crafted for quick convenience.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-2 pt-1">
            <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center border border-gray-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center border border-gray-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-orange-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center border border-gray-200 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="text-gray-500 hover:text-orange-500 flex items-center">
                <span className="mr-1 text-orange-500">➔</span>
                Home Menu
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-500 hover:text-orange-500 flex items-center">
                <span className="mr-1 text-orange-500">➔</span>
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-gray-500 hover:text-orange-500 flex items-center">
                <span className="mr-1 text-orange-500">➔</span>
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-500 hover:text-orange-500 flex items-center">
                <span className="mr-1 text-orange-500">➔</span>
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Food Categories */}
        <div>
          <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li className="hover:text-orange-500 cursor-pointer">Pizza & Pasta</li>
            <li className="hover:text-orange-500 cursor-pointer">Burgers & Fast Food</li>
            <li className="hover:text-orange-500 cursor-pointer">Chinese Noodles</li>
            <li className="hover:text-orange-500 cursor-pointer">Biryani & Thalis</li>
            <li className="hover:text-orange-500 cursor-pointer">Desserts & Sweets</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider mb-1">Contact</h4>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-start space-x-2">
              <span className="text-orange-500 shrink-0">📍</span>
              <span>pondicherry. 601407 </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 shrink-0">📞</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 shrink-0">📧</span>
              <span>support@onespyde.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-400 space-y-3 sm:space-y-0">
        <p>© {new Date().getFullYear()} One Spyde. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
