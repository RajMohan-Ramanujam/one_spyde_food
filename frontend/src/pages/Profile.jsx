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
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-500">
        <p>Please sign in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-2">
        <span className="text-xl">👤</span>
        <h1 className="text-xl font-bold text-gray-800">Profile Settings</h1>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg font-bold">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-lg font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar Area */}
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-5">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">{user.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">Full Name</label>
              <input 
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">Email Address</label>
              <input 
                type="email"
                disabled
                value={user.email}
                className="w-full bg-gray-100 border border-gray-200 text-gray-400 px-3.5 py-2.5 rounded-lg text-xs cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">Phone Number</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

            {/* Default Delivery Address */}
            <div>
              <label className="block text-gray-500 text-xs font-semibold mb-1.5">Default Address</label>
              <textarea 
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat details, street, city..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wide disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;
