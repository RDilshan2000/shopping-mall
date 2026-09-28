import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/ToastContainer';

// Customer Storefront Components
import HeroCarousel from './components/customer/HeroCarousel';
import FlashDeals from './components/customer/FlashDeals';
import TopSellersGrid from './components/customer/TopSellersGrid';
import ProductCard from './components/customer/ProductCard';
import ProductDetailsModal from './components/customer/ProductDetailsModal';
import CartDrawer from './components/customer/CartDrawer';
import CheckoutPage from './components/customer/CheckoutPage';
import CustomerProfile from './components/customer/CustomerProfile';

// Seller Center Components
import SellerOnboarding from './components/seller/SellerOnboarding';
import ProductManagement from './components/seller/ProductManagement';
import OrderFulfillment from './components/seller/OrderFulfillment';
import EarningsAndPayouts from './components/seller/EarningsAndPayouts';
import SellerPerformance from './components/seller/SellerPerformance';

// Super Admin Components
import ExecutiveAnalytics from './components/admin/ExecutiveAnalytics';
import VendorModeration from './components/admin/VendorModeration';
import CommissionSettings from './components/admin/CommissionSettings';
import BankPayoutManager from './components/admin/BankPayoutManager';
import CatalogDisputes from './components/admin/CatalogDisputes';

import type { Product } from './types';
import { Store, ShieldCheck, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    role, activeSellerVendorId, vendors, products, 
    searchQuery, setSearchQuery, selectedCategory 
  } = useStore();

  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);

  // Storefront navigation tabs: 'home' | 'catalog' | 'checkout' | 'profile'
  const [buyerTab, setBuyerTab] = useState<'home' | 'catalog' | 'checkout' | 'profile'>('home');
  
  // Seller navigation tabs: 'products' | 'orders' | 'financials' | 'analytics' | 'onboarding'
  const [sellerTab, setSellerTab] = useState<'products' | 'orders' | 'financials' | 'analytics' | 'onboarding'>('products');

  // Admin navigation tabs: 'analytics' | 'vendors' | 'commissions' | 'payouts' | 'disputes'
  const [adminTab, setAdminTab] = useState<'analytics' | 'vendors' | 'commissions' | 'payouts' | 'disputes'>('analytics');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products for storefront catalog
  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* 1. Global Role Switcher Top Bar */}
      <RoleSwitcherBar />

      {/* 2. Customer Storefront View */}
      {role === 'buyer' && (
        <div className="flex-1 flex flex-col">
          <Header 
            onOpenCart={() => setIsCartOpen(true)}
            setActiveTab={(t) => setBuyerTab(t as any)}
          />

          <main className="flex-1 pb-16">
            {buyerTab === 'home' && (
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
                {/* Hero Carousel Banner */}
                <HeroCarousel onExplore={() => setBuyerTab('catalog')} />

                {/* Flash Deals */}
                <FlashDeals onSelectProduct={(p) => setSelectedProduct(p)} />

                {/* Top Sri Lankan Verified Sellers */}
                <TopSellersGrid 
                  onSelectVendor={(vName) => {
                    setSearchQuery(vName);
                    setBuyerTab('catalog');
                  }} 
                />

                {/* Main Product Catalog Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span>Trending Sri Lankan Products</span>
                      </h2>
                      <p className="text-xs text-slate-500">Ceylon tea, spices, electronics, batik & handloom items</p>
                    </div>

                    <button
                      onClick={() => setBuyerTab('catalog')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                    >
                      View All Products ({products.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredProducts.slice(0, 8).map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {buyerTab === 'catalog' && (
              <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedCategory === 'All' ? 'Islandwide Product Catalog' : selectedCategory}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing {filteredProducts.length} items from verified Sri Lankan sellers
                    </p>
                  </div>

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700"
                    >
                      Clear Search "{searchQuery}"
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {buyerTab === 'checkout' && (
              <CheckoutPage
                onBackToShopping={() => setBuyerTab('home')}
                onOrderSuccess={() => {
                  setBuyerTab('profile');
                }}
              />
            )}

            {buyerTab === 'profile' && (
              <CustomerProfile
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}
          </main>

          <Footer />

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onProceedToCheckout={() => setBuyerTab('checkout')}
          />
        </div>
      )}

      {/* 3. Seller Center View */}
      {role === 'seller' && (
        <div className="flex-1 flex flex-col bg-slate-100">
          {/* Seller Portal Header */}
          <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center font-black text-lg shadow">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-lg text-white">Seller Center</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      Vendor Portal
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Managing: <span className="text-amber-400 font-bold">{currentVendor ? currentVendor.name : 'Vendor Shop'}</span> ({currentVendor?.district || 'Sri Lanka'})
                  </p>
                </div>
              </div>

              {/* Seller Tabs Navigation */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setSellerTab('products')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    sellerTab === 'products' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Products CRUD
                </button>
                <button
                  onClick={() => setSellerTab('orders')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    sellerTab === 'orders' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Orders & Courier Fulfillment
                </button>
                <button
                  onClick={() => setSellerTab('financials')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    sellerTab === 'financials' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Wallet & Bank Payouts
                </button>
                <button
                  onClick={() => setSellerTab('analytics')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    sellerTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sales Performance
                </button>
                <button
                  onClick={() => setSellerTab('onboarding')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    sellerTab === 'onboarding' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Shop Settings
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
            {sellerTab === 'products' && <ProductManagement />}
            {sellerTab === 'orders' && <OrderFulfillment />}
            {sellerTab === 'financials' && <EarningsAndPayouts />}
            {sellerTab === 'analytics' && <SellerPerformance />}
            {sellerTab === 'onboarding' && <SellerOnboarding />}
          </main>

          <Footer />
        </div>
      )}

      {/* 4. Super Admin View */}
      {role === 'admin' && (
        <div className="flex-1 flex flex-col bg-slate-100">
          {/* Admin Header */}
          <header className="bg-slate-950 text-white border-b border-slate-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-lg text-white">Super Admin Control Center</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/40">
                      RBAC ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Platform Governance, Multi-Vendor Commissions & Interbank Payout Approval</p>
                </div>
              </div>

              {/* Admin Tabs Navigation */}
              <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setAdminTab('analytics')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    adminTab === 'analytics' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Platform GMV
                </button>
                <button
                  onClick={() => setAdminTab('vendors')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    adminTab === 'vendors' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Vendor Verification
                </button>
                <button
                  onClick={() => setAdminTab('commissions')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    adminTab === 'commissions' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Commission Rates
                </button>
                <button
                  onClick={() => setAdminTab('payouts')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    adminTab === 'payouts' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Bank Payout Transfers
                </button>
                <button
                  onClick={() => setAdminTab('disputes')}
                  className={`px-3.5 py-2 rounded-xl transition ${
                    adminTab === 'disputes' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Catalog & Disputes
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
            {adminTab === 'analytics' && <ExecutiveAnalytics />}
            {adminTab === 'vendors' && <VendorModeration />}
            {adminTab === 'commissions' && <CommissionSettings />}
            {adminTab === 'payouts' && <BankPayoutManager />}
            {adminTab === 'disputes' && <CatalogDisputes />}
          </main>

          <Footer />
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectVendorShop={(vName) => {
            setSearchQuery(vName);
            setBuyerTab('catalog');
          }}
        />
      )}

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
