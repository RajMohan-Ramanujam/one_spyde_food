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
    <div className="space-y-8 pb-12">
      
      {/* Promotional Discount Slider */}
      <Slider />

      {/* Circular Food Categories */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider flex items-center">
          <span className="w-1.5 h-6 bg-primary rounded mr-2"></span>
          What's on your mind?
        </h2>
        <div className="flex space-x-5 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center space-y-2 shrink-0 group focus:outline-none"
            >
              <div 
                className={`w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden p-1 border-2 transition-all ${
                  selectedCategory === cat.name 
                    ? 'border-primary bg-primary/10' 
                    : 'border-white/10 bg-[#181818]'
                }`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span 
                className={`text-xs sm:text-sm font-semibold ${
                  selectedCategory === cat.name ? 'text-primary' : 'text-gray-400 group-hover:text-white'
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Toggle Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-lg">🍴</span>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {selectedCategory === 'All' ? 'Popular Dishes' : `${selectedCategory} Specials`}
          </h2>
          <span className="text-xs bg-[#242424] text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
            {foods.length} items
          </span>
        </div>

        {/* Veg Only Switch */}
        <button
          onClick={() => setIsVegOnly(!isVegOnly)}
          className="flex items-center space-x-3 bg-[#181818] border border-white/10 px-4 py-2 rounded-xl"
        >
          <div className="w-4 h-4 border-2 border-emerald-500 rounded-sm p-0.5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 bg-emerald-50 rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-gray-300 tracking-wide">VEG ONLY</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isVegOnly ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
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
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <span className="text-4xl">🍕</span>
          <h3 className="text-lg font-bold text-gray-300">No dishes found</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            We couldn't find any items matching your filters or search terms. Try adjusting them!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setIsVegOnly(false);
            }}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded-xl text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;
