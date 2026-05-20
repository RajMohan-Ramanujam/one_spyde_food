import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
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
      
      // Update application state
      login(token, user);
      
      // Redirect to Home
      navigate('/');
    } catch (err) {
      console.error(err);
      
      // If user is registered but not verified
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        setError('Your account is not verified yet. Redirecting to OTP verification...');
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
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to order your favorite food!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 font-medium animate-pulse-subtle">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-primary text-xs hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-gray-400 text-xs mt-8 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
