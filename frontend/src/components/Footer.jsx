import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-spyde-black border-t border-white/5 pt-16 pb-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-extrabold text-lg text-white">
              ONE <span className="text-primary">SPYDE</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium, fast, and secure food delivery right at your doorstep. Inspired by top-tier food experiences.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="w-9 h-9 bg-spyde-gray hover:bg-primary text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-spyde-gray hover:bg-primary text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-spyde-gray hover:bg-primary text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                <ExternalLink size={12} className="mr-2 text-primary" />
                Home Menu
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                <ExternalLink size={12} className="mr-2 text-primary" />
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                <ExternalLink size={12} className="mr-2 text-primary" />
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-400 hover:text-primary transition-colors flex items-center">
                <ExternalLink size={12} className="mr-2 text-primary" />
                Profile Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Food Categories */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Popular Categories</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-primary transition-colors cursor-pointer">Pizza & Pasta</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Burgers & Fries</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Chinese Noodles</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Biryani & Thali</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Desserts & Cakes</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Contact Us</h4>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-primary shrink-0 pt-0.5" />
              <span>123 Spyde Street, Foodie Lane, Bangalore, India</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-primary shrink-0" />
              <span>support@onespyde.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
        <p>© {new Date().getFullYear()} One Spyde. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
