import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, ShoppingCart, Heart, User, Store, Sparkles
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

interface HeaderProps {
  onOpenCart: () => void;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, setActiveTab }) => {
  const { 
    cart, wishlist, searchQuery, setSearchQuery, selectedCategory, 
    setSelectedCategory, products, vendors, setRole 
  } = useStore();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const cartItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const categories = [
    'All',
    'Ceylon Tea & Spices',
    'Electronics & Tech',
    'Fashion & Batik',
    'Home & Living',
    'Beauty & Wellness',
    'Automotive & Hardware'
  ];

  // Auto suggestions logic
  const matchingProducts = searchQuery.trim() ? products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const matchingVendors = searchQuery.trim() ? vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2) : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-[11px] py-1 px-4 flex justify-between items-center font-medium">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Islandwide Fast Shipping • Free Returns in Sri Lanka</span>
          </span>
          <span className="hidden md:inline text-amber-200">|</span>
          <span className="hidden md:inline text-amber-100">Official Merchant Hotline: +94 11 200 0000</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setRole('seller'); setActiveTab('onboarding'); }}
            className="hover:underline flex items-center space-x-1 text-amber-100 font-bold"
          >
            <Store className="w-3 h-3" />
            <span>Sell on Platform (Vendor Join)</span>
          </button>
          <span className="text-amber-200">|</span>
          <span className="font-bold text-amber-200">Rs. (LKR)</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button 
            onClick={() => { setActiveTab('home'); setSelectedCategory('All'); }}
            className="flex items-center space-x-2 shrink-0 group text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              LK
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-xl text-slate-900 tracking-tight">Shopping<span className="text-amber-500">Mall</span></span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-300">LK</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Sri Lanka Multi-Vendor Platform</p>
            </div>
          </button>

          {/* Search Bar with Auto Suggestions */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Ceylon Tea, Dialog Routers, Batik Sarees, Spices, Shops..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-slate-100 border border-slate-300 focus:border-amber-500 focus:bg-white text-slate-900 pl-4 pr-12 py-2.5 rounded-full text-xs font-medium outline-none transition-all shadow-inner"
              />
              <button 
                onClick={() => { setActiveTab('catalog'); setShowSearchDropdown(false); }}
                className="absolute right-1.5 p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full transition shadow"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Suggest Dropdown */}
            {showSearchDropdown && (searchQuery.trim().length > 0) && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 px-2 z-50">
                {matchingProducts.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Matching Products
                    </div>
                    {matchingProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSearchQuery(p.title);
                          setActiveTab('catalog');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center justify-between text-xs transition"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <img src={p.images[0]} alt="" className="w-7 h-7 object-cover rounded-md" />
                          <span className="truncate font-medium text-slate-800">{p.title}</span>
                        </div>
                        <span className="font-bold font-mono text-amber-600 shrink-0">{formatLKR(p.basePrice)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingVendors.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Verified Shops
                    </div>
                    {matchingVendors.map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSearchQuery(v.name);
                          setActiveTab('catalog');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-700"
                      >
                        <span className="font-semibold text-slate-900 flex items-center space-x-1">
                          <Store className="w-3.5 h-3.5 text-amber-600" />
                          <span>{v.name}</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{v.district}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingProducts.length === 0 && matchingVendors.length === 0 && (
                  <div className="px-4 py-3 text-xs text-slate-500 text-center">
                    No exact match found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons (Wishlist, Cart, Orders) */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-3.5 py-2 rounded-full shadow transition"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white font-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center border border-amber-400">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs hidden sm:inline font-mono">{formatLKR(cartSubtotal)}</span>
            </button>

            {/* Profile Dropdown / Orders */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-1.5 p-2 text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition text-xs font-semibold"
            >
              <User className="w-5 h-5 text-slate-600" />
              <span className="hidden md:inline">My Orders</span>
            </button>
          </div>

        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto py-1 text-xs font-medium scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveTab('catalog');
              }}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
