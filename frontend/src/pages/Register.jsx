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
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] border border-white/10 p-8 rounded-3xl relative">
        
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-primary rounded-2xl items-center justify-center text-white font-black text-2xl mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="text-gray-400 text-sm mt-1">Join One Spyde for delicious treats!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 font-semibold">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign Up</span>
                <span>➔</span>
              </>
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-gray-400 text-xs mt-8">
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
