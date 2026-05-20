import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';
import Slider from '../components/Slider';
import Loader from '../components/Loader';

const categories = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop&q=60' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=150&auto=format&fit=crop&q=60' },
  { name: 'Noodles', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&auto=format&fit=crop&q=60' },
  { name: 'Thali', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=150&auto=format&fit=crop&q=60' },
  { name: 'Dessert', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=150&auto=format&fit=crop&q=60' },
  { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=60' }
];

const Home = () => {
  const { searchQuery } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (isVegOnly) {
        params.is_veg = true;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await API.get('/foods', { params });
      setFoods(response.data);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, isVegOnly, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Promo banner */}
      <Slider />

      {/* Categories */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wider flex items-center">
          <span className="w-1.5 h-5 bg-orange-500 rounded mr-2"></span>
          What's on your mind?
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center space-y-1.5 shrink-0 group focus:outline-none"
            >
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border-2 transition-all ${
                  selectedCategory === cat.name 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span 
                className={`text-xs font-semibold ${
                  selectedCategory === cat.name ? 'text-orange-500 font-bold' : 'text-gray-500'
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-orange-500 text-lg">🍴</span>
          <h2 className="text-lg font-bold text-gray-800">
            {selectedCategory === 'All' ? 'Popular Dishes' : `${selectedCategory} Specials`}
          </h2>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold">
            {foods.length} items
          </span>
        </div>

        {/* Veg Only */}
        <button
          onClick={() => setIsVegOnly(!isVegOnly)}
          className="flex items-center space-x-2.5 bg-white border border-gray-200 px-3.5 py-1.5 rounded-lg text-xs"
        >
          <div className="w-3.5 h-3.5 border border-emerald-500 rounded-sm p-0.5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
          <span className="font-bold text-gray-600">VEG ONLY</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isVegOnly ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {isVegOnly ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <Loader />
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white border border-gray-200 rounded-xl">
          <span className="text-3xl">🍕</span>
          <h3 className="text-base font-bold text-gray-700">No dishes found</h3>
          <p className="text-gray-400 text-xs max-w-xs">
            Try adjusting your search criteria or selected category filter!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setIsVegOnly(false);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-lg text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;
