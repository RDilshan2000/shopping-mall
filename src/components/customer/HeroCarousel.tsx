import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Truck } from 'lucide-react';

interface HeroCarouselProps {
  onExplore: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExplore }) => {
  const slides = [
    {
      title: "Ceylon Harvest & Spice Festival",
      subtitle: "100% Organic Alba Cinnamon, BOPF Tea & Cardamom direct from Matale & Kandy Estates.",
      badge: "Avurudu Special Deals",
      cta: "Shop Spices & Tea",
      bgGradient: "from-amber-900 via-orange-900 to-slate-900",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Dialog & Tech Mega Electronics Sale",
      subtitle: "4G Pocket Routers, Solar Power Banks & Accessories with Islandwide 2-Day Courier.",
      badge: "Up to 30% Off LKR",
      cta: "Browse Tech",
      bgGradient: "from-slate-900 via-indigo-950 to-blue-900",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Serendib Handloom & Traditional Batik",
      subtitle: "Authentic Cotton Sarees & Sarongs handcrafted by traditional Sri Lankan artisans.",
      badge: "Heritage Collection",
      cta: "Discover Fashion",
      bgGradient: "from-red-950 via-amber-950 to-slate-900",
      image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800">
      <div className={`relative min-h-[380px] sm:min-h-[420px] flex items-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 p-8 sm:p-12`}>
        
        {/* Slide Background Image Overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 text-xs sm:text-sm"
            >
              <span>{slide.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-slate-300 text-xs font-medium bg-slate-900/60 px-3 py-2 rounded-xl backdrop-blur-md border border-slate-700/60">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Domex & Pronto 2-Day Delivery</span>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
