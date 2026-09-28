import React from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types';
import { ShoppingCart, Heart, Star, Store } from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { vendors, addToCart, wishlist, toggleWishlist } = useStore();
  const vendor = vendors.find(v => v.id === product.vendorId);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Thumbnail Image Container */}
        <div 
          onClick={() => onSelect(product)}
          className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {product.discountPercent && (
            <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
              -{product.discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition shadow ${
              isWishlisted 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Vendor Badge Overlay */}
          {vendor && (
            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-xl text-[10px] flex items-center justify-between border border-slate-700/60">
              <span className="flex items-center space-x-1 truncate font-medium">
                <Store className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{vendor.name}</span>
              </span>
              <span className="text-emerald-400 font-bold shrink-0">{vendor.district}</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              {product.category}
            </span>

            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-amber-600 cursor-pointer transition leading-snug"
          >
            {product.title}
          </h3>

          {/* Low Stock Indicator */}
          {product.stock <= product.lowStockThreshold && (
            <div className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md inline-block">
              Only {product.stock} items left in stock!
            </div>
          )}

          {/* Price Display */}
          <div className="pt-1 flex items-baseline space-x-2">
            <span className="text-base font-black font-mono text-slate-900">
              {formatLKR(product.basePrice)}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono line-through text-slate-400">
                {formatLKR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(product)}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
