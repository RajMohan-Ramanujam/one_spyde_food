import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-spyde-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spyde-gray border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

        {/* Headings */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex w-12 h-12 bg-primary/15 rounded-2xl items-center justify-center text-primary mb-3 shadow-lg">
            {step === 1 ? <Mail size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 
              ? 'Enter your email to receive a recovery code.' 
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {/* Simulated OTP warning (Super user-friendly!) */}
        {step === 2 && simulatedOtp && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-3 rounded-xl mb-6 text-center">
            <p className="font-bold">🔑 SIMULATED RESET CODE:</p>
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

        {/* Step 1 Form */}
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-5 relative z-10">
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Request Code</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleResetPassword} className="space-y-4 relative z-10">
            {/* OTP Code */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Reset Code (OTP)</label>
              <input 
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-spyde-lightgray border border-white/5 text-white text-center font-extrabold text-lg py-3 rounded-xl focus:border-primary/50 focus:outline-none transition-colors tracking-[0.2em]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Lock size={18} />
                </span>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back navigation */}
        <div className="text-center mt-8 relative z-10 flex items-center justify-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-xs flex items-center space-x-2 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
