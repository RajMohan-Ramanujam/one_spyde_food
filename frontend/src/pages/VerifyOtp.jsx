import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
      setError('Please sign up first.');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-xl relative shadow-sm">
        
        {/* Headings */}
        <div className="text-center mb-6">
          <div className="inline-flex w-11 h-11 bg-orange-100 rounded-lg items-center justify-center text-orange-600 mb-3 text-lg font-bold">
            🛡️
          </div>
          <h2 className="text-xl font-bold text-gray-800">Verify your OTP</h2>
          <p className="text-gray-500 text-xs mt-1">
            Verification code sent to <span className="text-gray-800 font-bold">{email || 'your email'}</span>
          </p>
        </div>

        {/* Info alerts for Simulated/Dummy OTP */}
        {simulatedOtp && (
          <div className="bg-orange-50 border border-orange-200 text-orange-850 text-xs px-4 py-3 rounded-lg mb-5 text-center">
            <p className="font-bold">🔑 SIMULATED OTP CODE FOR DEMO:</p>
            <p className="text-lg font-black tracking-widest mt-1 text-gray-800">{simulatedOtp}</p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-lg mb-5 text-center font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg mb-5 text-center font-semibold">
            {success}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 text-center">
              Enter 6-Digit Code
            </label>
            <input 
              type="text"
              maxLength={6}
              required
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 tracking-[0.4em] text-center font-bold text-xl py-3 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 placeholder:text-gray-300"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !otp}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wide disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Verify Code ➔"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Didn't receive the code?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-orange-500 font-bold hover:underline"
          >
            Go Back
          </button>
        </p>

      </div>
    </div>
  );
};

export default VerifyOtp;
