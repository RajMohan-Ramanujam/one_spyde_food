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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-xl relative shadow-sm">
        
        {/* Headings */}
        <div className="text-center mb-6">
          <div className="inline-flex w-11 h-11 bg-orange-100 rounded-lg items-center justify-center text-orange-600 mb-3 text-lg font-bold">
            🔑
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {step === 1 
              ? 'Enter your email to receive a recovery code.' 
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {/* Simulated OTP warning */}
        {step === 2 && simulatedOtp && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs px-4 py-3 rounded-lg mb-5 text-center">
            <p className="font-bold">🔑 SIMULATED RESET CODE:</p>
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
          <div className="bg-emerald-55/10 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg mb-5 text-center font-semibold">
            {success}
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wide disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Request Code ➔"
              )}
            </button>
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* OTP Code */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">Reset Code (OTP)</label>
              <input 
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-center font-bold text-base py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 tracking-[0.2em]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">New Password</label>
              <input 
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wide disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Reset Password ➔"
              )}
            </button>
          </form>
        )}

        {/* Back navigation */}
        <div className="text-center mt-6 flex items-center justify-center">
          <Link to="/login" className="text-gray-500 hover:text-orange-500 text-xs flex items-center space-x-1.5">
            <span>⬅️</span>
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
