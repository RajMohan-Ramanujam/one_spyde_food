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
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] border border-white/10 p-8 rounded-3xl relative">
        
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-primary rounded-2xl items-center justify-center text-white font-black text-2xl mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to order your favorite food!</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
              className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-primary text-xs hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <span>Sign In</span>
                <span>➔</span>
              </>
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-gray-400 text-xs mt-8">
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
