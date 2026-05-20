import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus, MapPin, Phone, CreditCard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const { cart, updateCartQty, removeFromCart, clearCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill user details if available
  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Calculate pricing math
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
      // Map cart items into simplified array for storage in order table
      const orderItems = cart.map(item => ({
        id: item.food_id,
        name: item.name,
        price: Number(item.price),
        discount_percent: Number(item.discount_percent),
        quantity: item.quantity
      }));

      // Call API
      await API.post('/orders', {
        items: orderItems,
        totalAmount: grandTotal,
        deliveryAddress: address,
        phone: phone,
        paymentStatus: 'Paid' // Simulated instant paid checkout
      });

      // Clear local React state of cart
      clearCart();

      // Redirect to orders page
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
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 animate-fade-in">
        <div className="w-20 h-20 bg-spyde-gray border border-white/5 rounded-3xl flex items-center justify-center text-primary shadow-lg shadow-black/40">
          <ShoppingCart size={36} />
        </div>
        <h2 className="text-xl font-bold text-gray-200">Your cart is empty</h2>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Looks like you haven't added anything to your cart yet. Head back to the main menu!
        </p>
        <Link 
          to="/"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-md text-sm active:scale-95"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      <h1 className="text-2xl font-black text-white tracking-wide">Secure Checkout</h1>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-3 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-spyde-gray border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-white/5">
              {cart.map((item) => {
                const originalPrice = Number(item.price);
                const discountPercent = Number(item.discount_percent);
                const finalPrice = discountPercent > 0 
                  ? Math.round(originalPrice * (1 - discountPercent / 100))
                  : originalPrice;

                return (
                  <div key={item.food_id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      {/* Image */}
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-14 h-14 object-cover rounded-xl bg-spyde-lightgray"
                      />
                      {/* Info */}
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

                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-spyde-lightgray border border-white/5 text-white rounded-lg overflow-hidden font-bold">
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-spyde-gray transition-all text-xs"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs min-w-[16px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.food_id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-spyde-gray transition-all text-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.food_id)}
                        className="text-gray-500 hover:text-rose-500 p-1 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Address Details Form */}
          <div className="bg-spyde-gray border border-white/5 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-4">
              Delivery Details
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                  <MapPin size={14} className="mr-1.5 text-primary" /> Delivery Address
                </label>
                <textarea 
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full flat address, block number, street, city..."
                  className="w-full bg-spyde-lightgray border border-white/5 text-white p-3.5 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                  <Phone size={14} className="mr-1.5 text-primary" /> Contact Number
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full bg-spyde-lightgray border border-white/5 text-white px-3.5 py-3 rounded-xl text-sm focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Price summary */}
        <div className="space-y-4">
          <div className="bg-spyde-gray border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
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
              
              <div className="flex justify-between border-t border-white/5 pt-4 text-white font-extrabold text-base">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>

            {/* Simulated Payment badge */}
            <div className="bg-[#1a1a1a] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3 text-xs text-gray-400">
              <CreditCard size={18} className="text-primary shrink-0" />
              <span>Simulated Instant Payment (Cashless/UPI) activated</span>
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Place Order & Pay</span>
                  <ArrowRight size={16} />
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
