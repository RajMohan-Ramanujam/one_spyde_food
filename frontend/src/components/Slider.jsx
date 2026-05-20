import React, { useState, useEffect } from 'react';

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
    <div className="relative w-full h-44 rounded-2xl overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex w-full h-full"
        style={{ transform: `translateX(-${current * 100}%)`, transition: 'transform 0.5s ease-in-out' }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className={`min-w-full h-full flex items-center justify-between px-6 sm:px-12 bg-gradient-to-r ${slide.bgColor} relative overflow-hidden`}
          >
            {/* Background elements */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full opacity-60">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
            </div>

            {/* Slide Content */}
            <div className="z-10 space-y-2">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                PROMO
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {slide.title}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                {slide.subtitle}
              </p>
              <div className="inline-block bg-[#181818] border border-primary/40 text-primary font-mono text-xs px-3 py-1 rounded">
                {slide.code}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-20 text-xs"
      >
        &lt;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-20 text-xs"
      >
        &gt;
      </button>

      {/* Circle Indicators (Uniform small dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              current === index ? 'bg-primary' : 'bg-white/40'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
