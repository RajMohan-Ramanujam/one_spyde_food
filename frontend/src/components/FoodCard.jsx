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
      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow relative gap-4"
    >
      {/* Left Details Panel */}
      <div className="flex-1 space-y-1.5 min-w-0 pr-1">
        {/* Veg indicator & Category Badge */}
        <div className="flex items-center space-x-2">
          {food.is_veg === 1 ? (
            <span className="w-3.5 h-3.5 border border-emerald-600 p-0.5 flex items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
            </span>
          ) : (
            <span className="w-3.5 h-3.5 border border-red-600 p-0.5 flex items-center justify-center shrink-0">
              <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-600"></span>
            </span>
          )}
          <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            {food.category}
          </span>
          <div className="flex items-center text-[10px] text-amber-500 font-bold">
            <span>⭐</span>
            <span className="text-gray-650 ml-0.5">{Number(food.rating).toFixed(1)}</span>
          </div>
        </div>

        {/* Dish Name */}
        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight truncate">
          {food.name}
        </h3>

        {/* Dish Description */}
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 pr-1 h-8">
          {food.description}
        </p>

        {/* Pricing details */}
        <div className="flex items-baseline space-x-1.5 pt-1">
          <span className="text-gray-900 font-extrabold text-sm md:text-base">
            ₹{finalPrice}
          </span>
          {discountPercent > 0 && (
            <>
              <span className="text-gray-400 line-through text-[10px] md:text-xs">
                ₹{originalPrice}
              </span>
              <span className="text-orange-500 text-[10px] font-bold">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Image & Floating Add Button Panel */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-gray-50 border border-gray-250 shadow-sm">
          <img 
            src={food.image_url} 
            alt={food.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Floating Add to Cart button */}
        <div className="absolute bottom-[-10px] z-10 w-20 md:w-22">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-orange-500 text-white rounded-lg shadow-md font-bold overflow-hidden h-7 text-xs border border-orange-500">
              <button 
                onClick={handleDecrement}
                className="w-7 h-full hover:bg-orange-600 flex items-center justify-center font-extrabold text-xs"
              >
                -
              </button>
              <span className="flex-1 text-center bg-white text-orange-500 h-full flex items-center justify-center font-bold text-xs select-none">
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="w-7 h-full hover:bg-orange-600 flex items-center justify-center font-extrabold text-xs"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="w-full h-7 bg-white hover:bg-orange-50 border border-orange-400 text-orange-500 hover:text-orange-655 font-extrabold rounded-lg text-xs shadow-md transition-colors flex items-center justify-center"
            >
              ADD
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default FoodCard;
