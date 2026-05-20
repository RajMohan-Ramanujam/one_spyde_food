import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import API from '../api/axios';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve email and simulated OTP from navigation state
  const [email, setEmail] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      if (location.state.simulatedOtp) {
        setSimulatedOtp(location.state.simulatedOtp);
      }
    } else {
      // Fallback if accessed directly without context
      setError('Please sign up or request a reset code first.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/auth/verify-otp', { email, otp });
      setSuccess('Account verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spyde-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spyde-gray border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

        {/* Headings */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center text-primary mb-3">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-sans">Verify your OTP</h2>
          <p className="text-gray-400 text-sm mt-1">
            Verification code sent to <span className="text-white font-medium">{email || 'your email'}</span>
          </p>
        </div>

        {/* Info alerts for Simulated/Dummy OTP (VERY friendly for testing!) */}
        {simulatedOtp && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-3 rounded-xl mb-6 text-center">
            <p className="font-bold">🔑 SIMULATED OTP CODE FOR DEMO:</p>
            <p className="text-lg font-black tracking-widest mt-1 text-white">{simulatedOtp}</p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl mb-6 text-center font-medium animate-pulse-subtle">
            {success}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Code
            </label>
            <input 
              type="text"
              maxLength={6}
              required
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only digits
              className="w-full bg-spyde-lightgray border border-white/5 text-white tracking-[0.5em] text-center font-bold text-2xl py-4.5 rounded-xl focus:border-primary/50 focus:outline-none transition-colors placeholder:text-gray-700"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !otp}
            className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">
          Didn't receive the code?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary font-bold hover:underline"
          >
            Go Back
          </button>
        </p>

      </div>
    </div>
  );
};

export default VerifyOtp;
