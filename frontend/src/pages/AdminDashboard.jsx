import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';
import { LayoutDashboard, Plus, Trash2, Edit2, ShoppingBag, ListCollapse, CheckCircle, PackageOpen } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | menu
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Form state for adding/editing foods
  const [showForm, setShowForm] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Pizza',
    is_veg: true,
    discount_percent: 0,
    is_available: true
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const triggerMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Fetch orders (all customers)
  const fetchAllOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await API.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch foods (all menu items)
  const fetchAllFoods = async () => {
    try {
      setLoadingFoods(true);
      const response = await API.get('/foods');
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching admin foods:', error);
    } finally {
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllFoods();
  }, []);

  // Update order status (Admin)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/admin/status/${orderId}`, { orderStatus: newStatus });
      triggerMessage('success', `Order #${orderId} status updated to ${newStatus}`);
      fetchAllOrders();
    } catch (error) {
      console.error(error);
      triggerMessage('error', 'Failed to update order status.');
    }
  };

  // Food Form submit (Create or Update)
  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFoodId) {
        // Edit mode
        await API.put(`/foods/${editingFoodId}`, foodForm);
        triggerMessage('success', 'Food item updated successfully!');
      } else {
        // Create mode
        await API.post('/foods', foodForm);
        triggerMessage('success', 'New food item added to menu!');
      }
      
      // Reset form and reload
      setShowForm(false);
      setEditingFoodId(null);
      setFoodForm({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Pizza',
        is_veg: true,
        discount_percent: 0,
        is_available: true
      });
      fetchAllFoods();
    } catch (error) {
      console.error(error);
      triggerMessage('error', 'Error saving food item details.');
    }
  };

  // Populate form for editing
  const handleEditClick = (food) => {
    setEditingFoodId(food.id);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      image_url: food.image_url,
      category: food.category,
      is_veg: food.is_veg === 1 || food.is_veg === true,
      discount_percent: food.discount_percent,
      is_available: food.is_available === 1 || food.is_available === true
    });
    setShowForm(true);
  };

  // Delete food item
  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/foods/${foodId}`);
      triggerMessage('success', 'Menu item deleted successfully.');
      fetchAllFoods();
    } catch (error) {
      console.error(error);
      triggerMessage('error', 'Failed to delete menu item.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2.5">
          <LayoutDashboard size={24} className="text-primary" />
          <h1 className="text-2xl font-black text-white tracking-wide">Admin Control Panel</h1>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-spyde-gray border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === 'menu' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Edit Menu
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
        }`}>
          <CheckCircle size={16} />
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-200">Customer Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-spyde-gray border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3.5 gap-2">
                    <div>
                      <h4 className="font-extrabold text-white text-base">Order #{order.id}</h4>
                      <p className="text-xs text-gray-400">
                        Customer: <b className="text-white">{order.customer_name}</b> ({order.customer_email})
                      </p>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <span className="text-xs text-gray-500">Update Status:</span>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-spyde-lightgray border border-white/10 text-white rounded-xl text-xs font-bold px-3 py-2 focus:outline-none focus:border-primary/50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="text-sm text-gray-300 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between max-w-md">
                        <span>• {item.name} <b className="text-primary font-bold">x{item.quantity}</b></span>
                        <span className="text-gray-400 font-semibold">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div className="bg-[#181818] p-3.5 rounded-2xl border border-white/5 text-xs text-gray-400">
                    <p className="font-bold text-gray-500 uppercase tracking-wider mb-0.5">Shipping Address</p>
                    <p className="text-gray-300">{order.delivery_address}</p>
                    <p className="text-gray-300 mt-1">Phone: {order.phone}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-gray-500">Payment: <b className="text-emerald-500">{order.payment_status}</b></span>
                    <span className="text-white text-sm font-black">Total Paid: ₹{order.total_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-spyde-gray border border-white/5 p-12 rounded-3xl text-center text-gray-500">
              No orders found in the database.
            </div>
          )}
        </div>
      )}

      {/* 2. MENU TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-200">Manage Food Menu</h2>
            <button
              onClick={() => {
                setEditingFoodId(null);
                setFoodForm({
                  name: '',
                  description: '',
                  price: '',
                  image_url: '',
                  category: 'Pizza',
                  is_veg: true,
                  discount_percent: 0,
                  is_available: true
                });
                setShowForm(!showForm);
              }}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus size={16} />
              <span>{showForm ? 'Close Editor' : 'Add Food'}</span>
            </button>
          </div>

          {/* ADD / EDIT FOOD FORM */}
          {showForm && (
            <div className="bg-spyde-gray border border-white/5 p-6 rounded-3xl shadow-xl animate-fade-in">
              <h3 className="font-extrabold text-white text-base border-b border-white/5 pb-2 mb-4">
                {editingFoodId ? 'Modify Food Details' : 'Create New Dish'}
              </h3>

              <form onSubmit={handleFoodSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="e.g. Garlic Bread"
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="e.g. 199"
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1">Category *</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Thali">Thali</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Salad">Salad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={foodForm.discount_percent}
                    onChange={(e) => setFoodForm({ ...foodForm, discount_percent: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-xs font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={foodForm.image_url}
                    onChange={(e) => setFoodForm({ ...foodForm, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-xs font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Describe ingredients, taste profile, quantity..."
                    className="w-full bg-spyde-lightgray border border-white/5 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center space-x-6 py-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={foodForm.is_veg}
                      onChange={(e) => setFoodForm({ ...foodForm, is_veg: e.target.checked })}
                      className="rounded bg-spyde-lightgray border-white/10 text-primary focus:ring-primary focus:ring-0"
                    />
                    <span>Is Vegetarian</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={foodForm.is_available}
                      onChange={(e) => setFoodForm({ ...foodForm, is_available: e.target.checked })}
                      className="rounded bg-spyde-lightgray border-white/10 text-primary focus:ring-primary focus:ring-0"
                    />
                    <span>In Stock / Available</span>
                  </label>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase px-6 py-3 rounded-xl transition-all"
                  >
                    {editingFoodId ? 'Save Changes' : 'Create Item'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FOODS LIST TABLE */}
          {loadingFoods ? (
            <Loader />
          ) : (
            <div className="bg-spyde-gray border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#171717] text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="p-4">Dish</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {foods.map((food) => (
                      <tr key={food.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <img
                            src={food.image_url}
                            alt={food.name}
                            className="w-10 h-10 object-cover rounded-lg bg-spyde-lightgray"
                          />
                          <div>
                            <span className="font-extrabold text-white block">{food.name}</span>
                            <span className={`text-[10px] ${food.is_veg === 1 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {food.is_veg === 1 ? 'Veg' : 'Non-veg'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-medium">{food.category}</td>
                        <td className="p-4 text-white font-extrabold">₹{food.price}</td>
                        <td className="p-4 text-primary font-bold">{food.discount_percent}%</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            food.is_available === 1 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {food.is_available === 1 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(food)}
                              className="text-gray-400 hover:text-primary p-1.5 hover:bg-spyde-lightgray rounded-lg transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food.id)}
                              className="text-gray-400 hover:text-rose-500 p-1.5 hover:bg-spyde-lightgray rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
