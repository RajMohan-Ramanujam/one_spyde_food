import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setSimulatedOtp(response.data.otp);
      setSuccess('Reset code generated! Please enter it below.');
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing request. Check your email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid code or details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] border border-white/10 p-8 rounded-3xl relative">
        
        {/* Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center text-primary mb-3 text-xl font-bold">
            🔑
          </div>
          <h2 className="text-2xl font-bold text-white">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 
              ? 'Enter your email to receive a recovery code.' 
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {/* Simulated OTP warning */}
        {step === 2 && simulatedOtp && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-3 rounded-xl mb-6 text-center">
            <p className="font-bold">🔑 SIMULATED RESET CODE:</p>
            <p className="text-lg font-black tracking-widest mt-1 text-white">{simulatedOtp}</p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl mb-6 text-center font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl mb-6 text-center font-semibold">
            {success}
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-5">
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Request Code</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* OTP Code */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Reset Code (OTP)</label>
              <input 
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-[#242424] border border-white/10 text-white text-center font-extrabold text-lg py-3 rounded-xl focus:outline-none tracking-[0.2em]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
              <input 
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back navigation */}
        <div className="text-center mt-8 flex items-center justify-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-xs flex items-center space-x-2">
            <span>⬅️</span>
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
