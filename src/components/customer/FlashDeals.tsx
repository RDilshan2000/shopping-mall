import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Zap, Clock, ShoppingCart, ShieldCheck } from 'lucide-react';
import { formatLKR } from '../../utils/formatters';
import type { Product } from '../../types';

interface FlashDealsProps {
  onSelectProduct: (product: Product) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({ onSelectProduct }) => {
  const { products, vendors, addToCart } = useStore();
  const flashProducts = products.filter(p => p.isFlashDeal);

  // Countdown timer simulation (e.g. 05:42:18 remaining)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-900 via-slate-900 to-amber-950 rounded-3xl p-6 border border-orange-800/60 shadow-xl space-y-5 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-800/40 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-lg animate-pulse">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>Flash Deals Sri Lanka</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold uppercase">
                Limited Stock
              </span>
            </h2>
            <p className="text-xs text-orange-200">Huge savings on top Sri Lankan seller products</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-orange-500/40 font-mono text-xs">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400">Ends in:</span>
          <div className="flex items-center space-x-1 font-bold text-amber-400">
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* Flash Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashProducts.map(product => {
          const vendor = vendors.find(v => v.id === product.vendorId);
          const stockPercent = Math.min(100, Math.max(15, (product.stock / 50) * 100));

          return (
            <div
              key={product.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col justify-between transition group hover:shadow-2xl"
            >
              <div className="space-y-3">
                {/* Image */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPercent && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                      -{product.discountPercent}%
                    </span>
                  )}
                  {vendor && (
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[9px] px-2 py-0.5 rounded-md font-semibold border border-amber-500/30 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400 inline" />
                      <span className="truncate max-w-[90px]">{vendor.name}</span>
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div>
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-xs text-white line-clamp-2 hover:text-amber-400 cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-sm font-black font-mono text-amber-400">
                      {formatLKR(product.basePrice)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] font-mono line-through text-slate-500">
                        {formatLKR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Sold Stock</span>
                    <span className="text-amber-300 font-bold">{product.stock} items left</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashDeals;
