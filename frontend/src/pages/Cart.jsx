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
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
        <div className="w-20 h-20 bg-[#181818] border border-white/10 rounded-3xl flex items-center justify-center text-primary text-3xl">
          🛒
        </div>
        <h2 className="text-xl font-bold text-gray-200">Your cart is empty</h2>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Looks like you haven't added anything to your cart yet. Head back to the main menu!
        </p>
        <Link 
          to="/"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl text-sm"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <h1 className="text-2xl font-bold text-white tracking-wide">Secure Checkout</h1>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-white/10">
              {cart.map((item) => {
                const originalPrice = Number(item.price);
                const discountPercent = Number(item.discount_percent);
                const finalPrice = discountPercent > 0 
                  ? Math.round(originalPrice * (1 - discountPercent / 100))
                  : originalPrice;

                return (
                  <div key={item.food_id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-14 h-14 object-cover rounded-xl bg-[#242424]"
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-white line-clamp-1">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                          <span className="text-gray-400 font-semibold">₹{finalPrice}</span>
                          {discountPercent > 0 && (
                            <span className="text-gray-600 line-through">₹{originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-[#242424] border border-white/10 text-white rounded-lg overflow-hidden font-bold">
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-[#181818] text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs min-w-[16px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-[#181818] text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.food_id)}
                        className="text-gray-500 hover:text-rose-500 p-1 text-sm"
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
          <div className="bg-[#181818] border border-white/10 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 mb-4">
              Delivery Details
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center">
                  <span className="mr-1.5">📍</span> Delivery Address
                </label>
                <textarea 
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full flat address, block number, street, city..."
                  className="w-full bg-[#242424] border border-white/10 text-white p-3.5 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center">
                  <span className="mr-1.5">📞</span> Contact Number
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full bg-[#242424] border border-white/10 text-white px-3.5 py-3 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Price summary */}
        <div className="space-y-4">
          <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Bill Details
            </h2>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="text-gray-200 font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="text-emerald-500 font-semibold">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Handling Fee</span>
                <span className="text-gray-200 font-semibold">₹{platformFee}</span>
              </div>
              
              <div className="flex justify-between border-t border-white/10 pt-4 text-white font-extrabold text-base">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>

            {/* Simulated Payment badge */}
            <div className="bg-[#242424] p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3 text-xs text-gray-400">
              <span className="text-lg">💳</span>
              <span>Simulated Instant Payment (Cashless/UPI) activated</span>
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Place Order & Pay</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
