import React, { useState, useEffect } from 'react';

const slides = [
  {
    title: 'Flat 50% OFF',
    subtitle: 'Get half price discount on your first order!',
    code: 'SPYDE50',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    bgClass: 'bg-orange-500'
  },
  {
    title: 'Free Delivery',
    subtitle: 'Order above ₹300 and get free delivery charges!',
    code: 'FREEDEL',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    bgClass: 'bg-emerald-600'
  },
  {
    title: 'Sweet Dessert Vibe',
    subtitle: 'Get 20% off on all delicious desserts!',
    code: 'SWEET20',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
    bgClass: 'bg-blue-600'
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm h-60 md:h-48 bg-gray-100">
      
      {/* Slides Container */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`w-full h-full shrink-0 ${slide.bgClass} p-5 md:p-6 flex flex-col md:flex-row items-center justify-between text-white gap-4`}
          >
            <div className="space-y-1.5 text-center md:text-left flex-1 min-w-0">
              <span className="inline-block bg-black/20 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Special Offer
              </span>
              <h2 className="text-lg md:text-xl font-extrabold leading-tight truncate">
                {slide.title}
              </h2>
              <p className="text-white/90 text-[11px] line-clamp-2">
                {slide.subtitle}
              </p>
              <div className="inline-block bg-white text-gray-800 font-bold font-mono text-[10px] px-2.5 py-1 rounded mt-1.5">
                CODE: {slide.code}
              </div>
            </div>
            <div className="w-full md:w-1/3 h-24 md:h-full rounded-lg overflow-hidden shrink-0">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Slide Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              current === idx ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default Slider;
