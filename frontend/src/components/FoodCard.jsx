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
      className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors flex flex-col justify-between"
    >
      {/* Food Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#242424]">
        <img 
          src={food.image_url} 
          alt={food.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercent}% OFF
          </div>
        )}
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-3 right-3 bg-black/75 p-1 rounded-lg border border-white/10 flex items-center justify-center">
          {food.is_veg === 1 ? (
            <div className="w-4 h-4 border-2 border-emerald-500 rounded-sm p-0.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-rose-500 rounded-sm flex items-center justify-center relative">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-rose-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and category */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="bg-[#242424] px-2.5 py-0.5 rounded-full font-semibold">
              {food.category}
            </span>
            <div className="flex items-center text-amber-500 font-bold">
              <span className="mr-1">⭐</span>
              <span className="text-gray-200">{Number(food.rating).toFixed(1)}</span>
            </div>
          </div>

          {/* Name & description */}
          <h3 className="font-bold text-gray-100 hover:text-primary transition-colors text-base line-clamp-1 mb-1">
            {food.name}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-4 h-8">
            {food.description}
          </p>
        </div>

        {/* Pricing & Add Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-gray-500 line-through text-xs font-semibold">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-white font-extrabold text-base">
              ₹{finalPrice}
            </span>
          </div>

          {/* Add to Cart Actions */}
          <div className="z-10">
            {quantity > 0 ? (
              <div className="flex items-center bg-primary text-white rounded-xl overflow-hidden font-bold border border-primary">
                <button 
                  onClick={handleDecrement}
                  className="px-3 py-1.5 hover:bg-primary-dark"
                >
                  -
                </button>
                <span className="px-2 text-sm min-w-[18px] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="px-3 py-1.5 hover:bg-primary-dark"
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAdd}
                className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-bold px-4 py-1.5 rounded-xl text-sm transition-all"
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
