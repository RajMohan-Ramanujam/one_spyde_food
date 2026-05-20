import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ food }) => {
  const { cart, addToCart, updateCartQty } = useContext(AppContext);
  const navigate = useNavigate();

  const cartItem = cart.find(item => item.food_id === food.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const originalPrice = Number(food.price);
  const discountPercent = Number(food.discount_percent);
  const finalPrice = discountPercent > 0 
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food.id);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateCartQty(food.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateCartQty(food.id, quantity - 1);
  };

  return (
    <div 
      onClick={() => navigate(`/food/${food.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      {/* Food Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img 
          src={food.image_url} 
          alt={food.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {discountPercent}% OFF
          </div>
        )}
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-2 right-2 bg-white/90 p-1 rounded border border-gray-200 flex items-center justify-center">
          {food.is_veg === 1 ? (
            <div className="w-3.5 h-3.5 border border-emerald-600 p-0.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          ) : (
            <div className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center relative">
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold">
              {food.category}
            </span>
            <div className="flex items-center text-amber-500 font-bold">
              <span className="mr-1">⭐</span>
              <span className="text-gray-700">{Number(food.rating).toFixed(1)}</span>
            </div>
          </div>

          {/* Name & description */}
          <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">
            {food.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 h-8 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Pricing & Add Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-gray-400 line-through text-xs font-semibold">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-gray-900 font-bold text-sm">
              ₹{finalPrice}
            </span>
          </div>

          {/* Add to Cart Actions */}
          <div className="z-10">
            {quantity > 0 ? (
              <div className="flex items-center bg-orange-500 text-white rounded-lg overflow-hidden font-bold">
                <button 
                  onClick={handleDecrement}
                  className="px-2.5 py-1 hover:bg-orange-600"
                >
                  -
                </button>
                <span className="px-2 text-xs min-w-[14px] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="px-2.5 py-1 hover:bg-orange-600"
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAdd}
                className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors"
              >
                + ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
