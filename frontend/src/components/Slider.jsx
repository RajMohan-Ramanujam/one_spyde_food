import React from 'react';

const Slider = () => {
  return (
    <div className="w-full bg-orange-500 rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-sm gap-4">
      {/* Promotional details */}
      <div className="space-y-2 text-center md:text-left">
        <span className="bg-black/20 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Offer of the Day
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
          Flat 50% OFF
        </h2>
        <p className="text-orange-100 text-sm">
          Get half price discount on your first order on One Spyde!
        </p>
        <div className="inline-block bg-white text-orange-600 font-bold font-mono text-sm px-4 py-1.5 rounded-lg mt-2">
          USE CODE: SPYDE50
        </div>
      </div>

      {/* Hero promo image */}
      <div className="w-full md:w-1/3 h-32 rounded-xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80" 
          alt="Delicious Pizza Promo" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Slider;
