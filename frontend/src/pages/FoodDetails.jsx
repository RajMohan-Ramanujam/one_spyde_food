import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import API from '../api/axios';
import Loader from '../components/Loader';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQty } = useContext(AppContext);
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/foods/${id}`);
        setFood(response.data);
      } catch (error) {
        console.error('Error fetching food details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!food) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-gray-300">Food item not found</h3>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-primary text-white py-2 px-6 rounded-xl"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const cartItem = cart.find(item => item.food_id === food.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const originalPrice = Number(food.price);
  const discountPercent = Number(food.discount_percent);
  const finalPrice = discountPercent > 0 
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white"
      >
        <span>⬅️</span>
        <span className="text-sm font-semibold">Back to Menu</span>
      </button>

      {/* Main Details Panel */}
      <div className="bg-[#181818] border border-white/10 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Food Image */}
        <div className="relative h-64 md:h-auto min-h-[300px] bg-[#242424]">
          <img 
            src={food.image_url} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          {/* Favorite heart overlay */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center border border-white/10"
          >
            <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
          </button>
          
          {/* Discount overlay */}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
              {discountPercent}% OFF Special
            </div>
          )}
        </div>

        {/* Right Side: Specifications */}
        <div className="p-6 md:p-10 flex flex-col justify-between space-y-6">
          
          {/* Identity & Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Veg / Non-Veg Indicator */}
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                {food.is_veg === 1 ? (
                  <>
                    <div className="w-3 h-3 border border-emerald-500 rounded-sm p-0.5 flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Vegetarian</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 border border-rose-500 rounded-sm flex items-center justify-center relative shrink-0">
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500"></div>
                    </div>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Non-Vegetarian</span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/10 font-bold">
                <span className="mr-1 text-xs">⭐</span>
                <span className="text-xs text-white">{Number(food.rating).toFixed(1)} / 5</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {food.name}
            </h1>
            
            <span className="inline-block text-xs bg-[#242424] text-gray-300 font-bold px-3 py-1 rounded-full border border-white/10">
              Category: {food.category}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About this dish</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {food.description || "Indulge in our mouthwatering, chef-special creation, prepared with the freshest ingredients, herbs, and spices to perfection. Served hot and fresh."}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Highlights</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="bg-[#242424] px-3 py-1 rounded-lg">✨ Freshly Prepared</span>
              <span className="bg-[#242424] px-3 py-1 rounded-lg">🚀 Quick Delivery</span>
              <span className="bg-[#242424] px-3 py-1 rounded-lg">🧼 Hygienically Packed</span>
            </div>
          </div>

          {/* Checkout & Quantity Picker */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold">Total Price</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white">₹{finalPrice}</span>
                {discountPercent > 0 && (
                  <span className="text-sm text-gray-500 line-through font-semibold">₹{originalPrice}</span>
                )}
              </div>
            </div>

            <div>
              {quantity > 0 ? (
                <div className="flex items-center bg-primary text-white rounded-xl border border-primary overflow-hidden font-bold">
                  <button 
                    onClick={() => updateCartQty(food.id, quantity - 1)}
                    className="px-4 py-2 hover:bg-primary-dark"
                  >
                    -
                  </button>
                  <span className="px-3 text-base min-w-[24px] text-center">{quantity}</span>
                  <button 
                    onClick={() => updateCartQty(food.id, quantity + 1)}
                    className="px-4 py-2 hover:bg-primary-dark"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(food.id)}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl text-sm uppercase tracking-wider"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FoodDetails;
