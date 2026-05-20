import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const { cart, updateCartQty, removeFromCart, clearCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const subtotal = cart.reduce((total, item) => {
    const originalPrice = Number(item.price);
    const discountPercent = Number(item.discount_percent);
    const finalPrice = discountPercent > 0 
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;
    return total + (finalPrice * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 40 : 0;
  const platformFee = subtotal > 0 ? 10 : 0;
  const grandTotal = subtotal + deliveryFee + platformFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      return setError('Please provide a valid delivery address');
    }
    if (!phone.trim()) {
      return setError('Please provide a valid phone number');
    }

    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        id: item.food_id,
        name: item.name,
        price: Number(item.price),
        discount_percent: Number(item.discount_percent),
        quantity: item.quantity
      }));

      await API.post('/orders', {
        items: orderItems,
        totalAmount: grandTotal,
        deliveryAddress: address,
        phone: phone,
        paymentStatus: 'Paid'
      });

      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Try logging in again.');
    } finally {
      loading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-3xl">
          🛒
        </div>
        <h2 className="text-lg font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
          Looks like you haven't added anything to your cart yet. Head back to the menu!
        </p>
        <Link 
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg text-xs"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h1 className="text-xl font-bold text-gray-800">Secure Checkout</h1>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-lg font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Items List & Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-gray-100">
              {cart.map((item) => {
                const originalPrice = Number(item.price);
                const discountPercent = Number(item.discount_percent);
                const finalPrice = discountPercent > 0 
                  ? Math.round(originalPrice * (1 - discountPercent / 100))
                  : originalPrice;

                return (
                  <div key={item.food_id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-[10px] mt-0.5">
                          <span className="text-gray-700 font-semibold">₹{finalPrice}</span>
                          {discountPercent > 0 && (
                            <span className="text-gray-400 line-through">₹{originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-gray-100 border border-gray-200 text-gray-800 rounded overflow-hidden">
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs min-w-[12px] text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.food_id)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Details Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
              Delivery Details
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-2">
                  📍 Delivery Address
                </label>
                <textarea 
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full street address, flat number, city..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-2">
                  📞 Contact Number
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-3 py-2 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Price Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
              Bill Details
            </h2>

            <div className="space-y-2.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="text-gray-700 font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="text-emerald-600 font-semibold font-bold">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Handling Fee</span>
                <span className="text-gray-700 font-semibold">₹{platformFee}</span>
              </div>
              
              <div className="flex justify-between border-t border-gray-100 pt-3.5 text-gray-800 font-bold text-sm">
                <span>Grand Total</span>
                <span className="text-orange-500">₹{grandTotal}</span>
              </div>
            </div>

            {/* Simulated Payment */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center space-x-2 text-[10px] text-gray-500">
              <span className="text-base">💳</span>
              <span>Instant Payment (UPI/Cashless) is simulated</span>
            </div>

            {/* Place Order */}
            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wide transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Place Order & Pay ➔"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
