import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Flat 50% OFF",
    subtitle: "On your first order on One Spyde",
    code: "USE CODE: SPYDE50",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    bgColor: "from-orange-600 to-black"
  },
  {
    id: 2,
    title: "Craving Burgers?",
    subtitle: "Buy 1 Get 1 Free on all premium burgers",
    code: "USE CODE: DOUBLEUP",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    bgColor: "from-red-600 to-black"
  },
  {
    id: 3,
    title: "Biryani Feast",
    subtitle: "Get free dessert + extra 15% discount",
    code: "USE CODE: FEAST15",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    bgColor: "from-amber-600 to-black"
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl group">
      {/* Slides Container */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className={`min-w-full h-full flex flex-row items-center justify-between px-8 sm:px-16 bg-gradient-to-r ${slide.bgColor} relative overflow-hidden`}
          >
            {/* Background elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full opacity-60">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
            </div>

            {/* Slide Content */}
            <div className="z-10 max-w-lg space-y-2 sm:space-y-4">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Limited Offer
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-gray-300 text-sm sm:text-lg">
                {slide.subtitle}
              </p>
              <div className="inline-block bg-spyde-gray border border-primary/40 text-primary font-mono font-bold text-xs sm:text-sm px-4 py-2 rounded-lg">
                {slide.code}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary/95 text-white p-2 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary/95 text-white p-2 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index ? 'bg-primary w-6' : 'bg-white/40'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
