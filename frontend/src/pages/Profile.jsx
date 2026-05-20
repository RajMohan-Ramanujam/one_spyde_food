import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { User, Phone, MapPin, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import API from '../api/axios';

const Profile = () => {
  const { user, login } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const response = await API.put('/auth/profile', {
        userId: user.id,
        ...formData
      });

      // Update local storage and context details
      const token = localStorage.getItem('onespyde_token');
      login(token, response.data.user);

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating profile details.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-400">Please sign in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center space-x-2.5">
        <User size={24} className="text-primary" />
        <h1 className="text-2xl font-black text-white tracking-wide">Profile Settings</h1>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3.5 rounded-xl font-bold flex items-center space-x-2">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3.5 rounded-xl font-bold flex items-center space-x-2">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-spyde-gray border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Circle */}
          <div className="flex items-center space-x-5 border-b border-white/5 pb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary to-orange-400 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-snug">{user.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <User size={16} />
                </span>
                <input 
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
                  <Mail size={16} />
                </span>
                <input 
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-black/40 border border-white/5 text-gray-500 pl-10 pr-4 py-3 rounded-xl text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Phone size={16} />
                </span>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Default Delivery Address */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Default Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 top-3.5 text-gray-500">
                  <MapPin size={16} />
                </span>
                <textarea 
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House No, Floor, Street Address, Landmark, City..."
                  className="w-full bg-spyde-lightgray border border-white/5 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;
