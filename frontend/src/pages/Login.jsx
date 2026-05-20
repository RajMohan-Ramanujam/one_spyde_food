import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { AppContext } from '../App';

const Login = () => {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        setError('Your account is unverified. Redirecting to OTP page...');
        setTimeout(() => {
          navigate('/verify-otp', {
            state: { 
              email: err.response.data.email,
              simulatedOtp: err.response.data.otp 
            }
          });
        }, 1500);
        return;
      }

      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
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
          <h2 className="text-xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-500 text-xs mt-1">Sign in to order your favorite food!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-lg mb-5 font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-gray-500 text-xs font-semibold">Password</label>
              <Link to="/forgot-password" className="text-orange-500 text-xs hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In ➔"
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-bold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
