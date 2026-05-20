import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | menu
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);

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

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFoodId) {
        await API.put(`/foods/${editingFoodId}`, foodForm);
        triggerMessage('success', 'Food item updated successfully!');
      } else {
        await API.post('/foods', foodForm);
        triggerMessage('success', 'New food item added to menu!');
      }
      
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <h1 className="text-xl font-bold text-gray-800">Admin Control Panel</h1>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
              activeTab === 'orders' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
              activeTab === 'menu' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Edit Menu
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`px-4 py-3 rounded-lg text-xs font-bold border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{message.type === 'success' ? '✓' : '⚠️'} {message.text}</span>
        </div>
      )}

      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-700">Customer Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Order #{order.id}</h4>
                      <p className="text-xs text-gray-400">
                        Customer: <b className="text-gray-700">{order.customer_name}</b> ({order.customer_email})
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 font-semibold">Status:</span>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-white border border-gray-300 text-gray-800 rounded text-xs font-semibold px-2 py-1 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="text-xs text-gray-600 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between max-w-xs">
                        <span>• {item.name} <b className="text-orange-500">x{item.quantity}</b></span>
                        <span className="text-gray-700 font-semibold">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-500">
                    <p className="font-semibold text-gray-400 uppercase tracking-wider mb-0.5 text-[9px]">Shipping Address</p>
                    <p className="text-gray-700">{order.delivery_address}</p>
                    <p className="text-gray-700 mt-1">Phone: {order.phone}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-gray-500">Payment: <b className="text-emerald-600 font-bold">{order.payment_status}</b></span>
                    <span className="text-gray-800 text-sm font-bold">Total Paid: ₹{order.total_amount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 p-12 rounded-xl text-center text-gray-400 text-xs">
              No orders found in the database.
            </div>
          )}
        </div>
      )}

      {/* 2. MENU TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-700">Manage Food Menu</h2>
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
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase px-3 py-2 rounded-lg"
            >
              <span>{showForm ? '✕ Close Form' : '+ Add Food'}</span>
            </button>
          </div>

          {/* ADD / EDIT FOOD FORM */}
          {showForm && (
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2 mb-3">
                {editingFoodId ? 'Modify Food Details' : 'Create New Dish'}
              </h3>

              <form onSubmit={handleFoodSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="e.g. Garlic Bread"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="e.g. 199"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Category *</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
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
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={foodForm.discount_percent}
                    onChange={(e) => setFoodForm({ ...foodForm, discount_percent: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={foodForm.image_url}
                    onChange={(e) => setFoodForm({ ...foodForm, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-500 text-xs font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Describe ingredients, taste profile, quantity..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-2.5 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center space-x-5 py-1">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={foodForm.is_veg}
                      onChange={(e) => setFoodForm({ ...foodForm, is_veg: e.target.checked })}
                      className="rounded border-gray-300 text-orange-500 focus:ring-0"
                    />
                    <span>Is Vegetarian</span>
                  </label>

                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={foodForm.is_available}
                      onChange={(e) => setFoodForm({ ...foodForm, is_available: e.target.checked })}
                      className="rounded border-gray-300 text-orange-500 focus:ring-0"
                    />
                    <span>Available / In Stock</span>
                  </label>
                </div>

                <div className="md:col-span-2 pt-1">
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-lg"
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
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="p-3">Dish</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
                    {foods.map((food) => (
                      <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 flex items-center space-x-2.5">
                          <img
                            src={food.image_url}
                            alt={food.name}
                            className="w-9 h-9 object-cover rounded-lg bg-gray-100"
                          />
                          <div>
                            <span className="font-bold text-gray-800 block">{food.name}</span>
                            <span className={`text-[9px] font-bold ${food.is_veg === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {food.is_veg === 1 ? 'Veg' : 'Non-veg'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-500 font-semibold">{food.category}</td>
                        <td className="p-3 text-gray-800 font-bold">₹{food.price}</td>
                        <td className="p-3 text-orange-500 font-bold">{food.discount_percent}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            food.is_available === 1 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {food.is_available === 1 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => handleEditClick(food)}
                              className="text-gray-400 hover:text-orange-500 p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food.id)}
                              className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              🗑️
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
