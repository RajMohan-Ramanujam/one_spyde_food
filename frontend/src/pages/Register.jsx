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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-xl relative shadow-sm">
        
        {/* Logo and Headings */}
        <div className="text-center mb-6">
          <div className="inline-flex w-11 h-11 bg-orange-500 rounded-lg items-center justify-center text-white font-bold text-xl mb-3">
            S
          </div>
          <h2 className="text-xl font-bold text-gray-800">Create your account</h2>
          <p className="text-gray-500 text-xs mt-1">Join One Spyde for delicious treats!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-lg mb-5 font-semibold">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5">Full Name</label>
            <input 
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5">Email Address</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5">Phone Number</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5">Password</label>
            <input 
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wide disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Sign Up ➔"
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-bold hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
