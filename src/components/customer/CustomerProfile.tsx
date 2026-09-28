import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, Truck, Clock, Heart, ShoppingBag
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface CustomerProfileProps {
  onSelectProduct: (product: Product) => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ onSelectProduct }) => {
  const { orders, wishlist, products, vendors } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-950 shadow-md">
            NS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black">Nimanthi Silva</h1>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                Verified Buyer 🇱🇰
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">nimanthi.silva@gmail.com • +94 77 555 1212 • Colombo 07</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'wishlist' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Order History & Sub-Order Courier Tracking</span>
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No orders placed yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
                  {/* Parent Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Parent Order ID</span>
                      <span className="font-mono font-black text-slate-900 text-sm">{order.id}</span>
                      <span className="text-xs text-slate-500 ml-3">Placed on: {order.createdAt}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                      </span>
                      {order.paymentGatewayTxnId && (
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Txn: {order.paymentGatewayTxnId}
                        </span>
                      )}
                      <span className="font-black text-base font-mono text-amber-600">
                        {formatLKR(order.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Vendor Sub-Orders List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Sub-Orders Shipped Separately by Vendors ({order.subOrders.length}):
                    </h4>

                    {order.subOrders.map(sub => {
                      const vendor = vendors.find(v => v.id === sub.vendorId);

                      return (
                        <div key={sub.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                          {/* Sub Order Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                                #{sub.id}
                              </span>
                              <span className="font-bold text-slate-800">{sub.vendorName}</span>
                              <span className="text-slate-400 text-[11px]">({vendor?.district || 'Sri Lanka'})</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                sub.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                                sub.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                Status: {sub.status.toUpperCase()}
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                {formatLKR(sub.grossTotal)}
                              </span>
                            </div>
                          </div>

                          {/* Line items */}
                          <div className="space-y-2">
                            {sub.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 text-xs bg-white p-2 rounded-xl border border-slate-200">
                                <img src={item.productImage} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900 line-clamp-1">{item.productTitle}</p>
                                  {item.variantName && <span className="text-[10px] text-slate-500">Variant: {item.variantName}</span>}
                                </div>
                                <span className="font-mono text-slate-700">{item.quantity} x {formatLKR(item.unitPrice)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Courier Tracking Status Bar */}
                          {sub.courierDetails ? (
                            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                <div className="flex items-center space-x-2">
                                  <Truck className="w-4 h-4 text-amber-600" />
                                  <span className="font-bold text-slate-900">{sub.courierDetails.courierName}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Waybill No:</span>
                                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    {sub.courierDetails.waybillNumber}
                                  </span>
                                </div>
                              </div>

                              {/* Timeline Checkpoints */}
                              <div className="space-y-2 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Courier Status Checkpoints:</span>
                                {sub.courierDetails.trackingHistory.map((evt, i) => (
                                  <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                    <div>
                                      <span className="font-bold text-slate-800 mr-2">{evt.statusText}</span>
                                      <span className="text-slate-400 text-[10px] mr-2">[{evt.timestamp}]</span>
                                      <p className="text-slate-500 text-[10px]">{evt.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Seller is currently preparing and packaging your order for courier pickup.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Saved Wishlist Items</span>
          </h2>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistedProducts.map(p => (
                <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
