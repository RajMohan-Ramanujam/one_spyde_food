import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
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
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-400">
        <p>Please sign in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-2.5">
        <span className="text-2xl">👤</span>
        <h1 className="text-2xl font-bold text-white tracking-wide">Profile Settings</h1>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3.5 rounded-xl font-bold">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3.5 rounded-xl font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Circle */}
          <div className="flex items-center space-x-5 border-b border-white/10 pb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-2xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-snug">{user.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">👤 Full Name</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">📧 Email Address</label>
              <input 
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#121212] border border-white/10 text-gray-500 px-4 py-3 rounded-xl text-sm cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">📞 Phone Number</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Default Delivery Address */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">📍 Default Address</label>
              <textarea 
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Floor, Street Address, Landmark, City..."
                className="w-full bg-[#242424] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;
