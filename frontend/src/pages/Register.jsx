import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import API from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/register', formData);
      // Success! Pass email and simulated OTP in state to OTP page
      navigate('/verify-otp', { 
        state: { 
          email: formData.email, 
          simulatedOtp: response.data.otp,
          message: 'Account created! Please enter the 6-digit OTP code.' 
        } 
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spyde-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spyde-gray border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

        {/* Logo and Headings */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex w-12 h-12 bg-primary rounded-2xl items-center justify-center text-white font-black text-2xl mb-3 shadow-lg shadow-primary/20">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mt-1">Join One Spyde for delicious treats!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 font-medium animate-pulse-subtle">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Name */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <User size={18} />
              </span>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Phone size={18} />
              </span>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input 
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-gray-400 text-xs mt-8 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
