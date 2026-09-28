import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Store, ShieldCheck, Terminal, ChevronDown } from 'lucide-react';
import WebhookLoggerModal from './WebhookLoggerModal';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, activeSellerVendorId, setActiveSellerVendorId, vendors, webhookLogs } = useStore();
  const [showLogsModal, setShowLogsModal] = useState(false);

  const activeVendor = vendors.find(v => v.id === activeSellerVendorId);

  return (
    <>
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-inner z-50 relative">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-semibold text-amber-400">
            <span className="text-base">🇱🇰</span>
            <span>Sri Lanka Multi-Vendor Platform</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Environment: <span className="text-emerald-400 font-mono font-medium">PayHere / WebXpay Sandbox Active</span></span>
        </div>

        {/* Role Selectors & Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 hidden sm:inline">Active View / Role:</span>
          
          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setRole('buyer')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'buyer' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>

            <button
              onClick={() => setRole('seller')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'seller' 
                  ? 'bg-orange-500 text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Center</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Vendor Switcher for Seller View */}
          {role === 'seller' && (
            <div className="relative group ml-2">
              <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-200">
                <span className="text-slate-400 text-[10px]">Shop:</span>
                <span className="font-semibold text-amber-300 max-w-[120px] truncate">
                  {activeVendor ? activeVendor.name : 'Select Shop'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700">
                  Switch Active Vendor Account
                </div>
                {vendors.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setActiveSellerVendorId(v.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition ${
                      activeSellerVendorId === v.id ? 'bg-slate-700/80 text-amber-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <span className="truncate">{v.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                      v.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {v.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Webhook logs button */}
          <button
            onClick={() => setShowLogsModal(true)}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 text-xs transition"
            title="Inspect PayHere & WebXpay Payment Webhook Logs"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Gateway Webhooks</span>
            {webhookLogs.length > 0 && (
              <span className="bg-emerald-500 text-slate-950 font-bold rounded-full px-1.5 py-0.2 text-[10px]">
                {webhookLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showLogsModal && (
        <WebhookLoggerModal onClose={() => setShowLogsModal(false)} />
      )}
    </>
  );
};
