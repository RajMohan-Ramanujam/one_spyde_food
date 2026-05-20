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
        <h3 className="text-lg font-bold text-gray-700">Food item not found</h3>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-orange-500 text-white py-2 px-6 rounded-lg text-sm"
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
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-gray-500 hover:text-orange-500"
      >
        <span>⬅️</span>
        <span className="text-xs font-bold">Back to Menu</span>
      </button>

      {/* Main Details Panel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm">
        
        {/* Left Side: Food Image */}
        <div className="relative h-64 md:h-auto min-h-[250px] bg-gray-100">
          <img 
            src={food.image_url} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          {/* Favorite heart overlay */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center border border-gray-200 shadow"
          >
            <span className="text-base">{isFavorite ? '❤️' : '🤍'}</span>
          </button>
          
          {/* Discount overlay */}
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
              {discountPercent}% OFF Special
            </div>
          )}
        </div>

        {/* Right Side: Specifications */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
          
          {/* Identity & Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Veg / Non-Veg Indicator */}
              <div className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                {food.is_veg === 1 ? (
                  <>
                    <div className="w-3 h-3 border border-emerald-600 rounded-sm p-0.5 flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Vegetarian</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 border border-red-600 rounded-sm flex items-center justify-center relative shrink-0">
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-600"></div>
                    </div>
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Non-Veg</span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold">
                <span className="mr-1 text-xs">⭐</span>
                <span className="text-xs text-gray-700">{Number(food.rating).toFixed(1)} / 5</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              {food.name}
            </h1>
            
            <span className="inline-block text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-0.5 rounded border border-gray-200">
              Category: {food.category}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About this dish</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              {food.description || "Freshly cooked specialty dish made with selected spices and fresh local ingredients. Prepared under hygienic environment."}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Highlights</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded">✨ Freshly Prepared</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">🚀 Fast Delivery</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">🧼 Clean Kitchen</span>
            </div>
          </div>

          {/* Checkout & Quantity Picker */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-bold text-gray-900">₹{finalPrice}</span>
                {discountPercent > 0 && (
                  <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                )}
              </div>
            </div>

            <div>
              {quantity > 0 ? (
                <div className="flex items-center bg-orange-500 text-white rounded-lg overflow-hidden font-bold">
                  <button 
                    onClick={() => updateCartQty(food.id, quantity - 1)}
                    className="px-3 py-1.5 hover:bg-orange-600 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs min-w-[20px] text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => updateCartQty(food.id, quantity + 1)}
                    className="px-3 py-1.5 hover:bg-orange-600 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(food.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors"
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
