import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Left Side Graphic Panel (Eat Club Split Screen Banner) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-orange-600 to-amber-500 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-black/25 z-0" />
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80" 
          alt="Delicious Burgers Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-85 z-0 mix-blend-multiply"
        />
        <div className="relative z-10 max-w-md space-y-6 text-center md:text-left">
          <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Premium Food Experience
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Join the Food Club!
          </h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Create an account on One Spyde to explore premium dishes, fast home delivery, and exclusive discount codes tailored for you.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-250 flex items-center justify-center text-[10px] text-gray-800 font-bold">🍔</span>
              <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-250 flex items-center justify-center text-[10px] text-gray-800 font-bold">🍕</span>
              <span className="w-8 h-8 rounded-full border-2 border-white bg-gray-250 flex items-center justify-center text-[10px] text-gray-800 font-bold">🍰</span>
            </div>
            <span className="text-xs font-semibold text-white/95">
              Loved by 10,000+ local foodies
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-sm space-y-5">
          
          {/* Logo Box */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2">
              <svg viewBox="0 0 100 100" className="w-7 h-7 shrink-0 select-none">
                <rect x="4" y="4" width="92" height="92" rx="18" fill="#D97706" stroke="#000000" strokeWidth="5" />
                <rect x="10" y="10" width="80" height="80" rx="12" fill="#FBBF24" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 24 24 C 38 34 38 66 24 76" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 76 24 C 62 34 62 66 76 76" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="30" cy="30" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
                <circle cx="70" cy="30" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
                <circle cx="30" cy="70" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
                <circle cx="70" cy="70" r="4.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
                <text x="50" y="59" textAnchor="middle" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" fontSize="28" fontWeight="900" paintOrder="stroke fill">S</text>
              </svg>
              <span className="font-bold text-base text-gray-800 tracking-tight">
                One <span className="text-orange-500">Spyde</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 pt-2">Create Account</h2>
            <p className="text-gray-400 text-xs text-center md:text-left">
              Get started by registering a new account.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3.5 py-2.5 rounded-lg font-semibold">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1">Full Name</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1">Email Address</label>
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1">Phone Number</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1">Password</label>
              <input 
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-655 text-white font-bold py-2.5 rounded-lg flex items-center justify-center text-xs uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center md:text-left text-gray-500 text-xs pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-extrabold hover:underline">
              Log in here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Register;
