import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, CreditCard, PhoneCall, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRole } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-300">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-slate-900 rounded-xl text-amber-400 border border-slate-800 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Direct Seller Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Shipped directly by registered sellers via Domex, Pronto, Koombiyo & Citypak.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-3 bg-slate-900 rounded-xl text-amber-400 border border-slate-800 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">PayHere & WebXpay</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">100% secure local gateway supporting Visa, Mastercard, Genie, EzCash & Frimi.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-3 bg-slate-900 rounded-xl text-amber-400 border border-slate-800 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Verified Sri Lankan Shops</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">All vendors undergo Super Admin bank & NIC verification before listing products.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-3 bg-slate-900 rounded-xl text-amber-400 border border-slate-800 shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Islandwide Hotline</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Customer & Seller support operating 7 days a week: +94 11 200 0000.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🇱🇰</span>
            <span className="font-black text-lg text-white tracking-tight">Shopping<span className="text-amber-500">Mall</span></span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Sri Lanka’s premier multi-vendor e-commerce ecosystem empowering local artisans, spice growers, fashion designers, and tech vendors across all 25 districts.
          </p>
          <div className="flex items-center space-x-2 text-slate-400 pt-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Head Office: Level 18, Galle Face Terrace, Colombo 03</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Customer Portal</h5>
          <ul className="space-y-1.5 text-xs">
            <li><a href="#" className="hover:text-amber-400 transition">Track Sub-Orders & Couriers</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">PayHere / WebXpay Payment Guide</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Cash on Delivery (COD) Terms</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Dispute & Refund Resolution</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Sri Lanka Islandwide Rates</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Seller Center</h5>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setRole('seller')} className="hover:text-amber-400 transition text-left">
                Seller Dashboard Login
              </button>
            </li>
            <li>
              <button onClick={() => setRole('seller')} className="hover:text-amber-400 transition text-left">
                Register New Shop (Onboarding)
              </button>
            </li>
            <li><a href="#" className="hover:text-amber-400 transition">Courier Self-Shipping Guide (Domex/Pronto)</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Local Bank Account Payout Rules</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Platform Commission Rates (6% - 10%)</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-2">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Super Admin</h5>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setRole('admin')} className="hover:text-amber-400 transition text-left font-bold text-amber-300">
                Super Admin Console (`/admin`)
              </button>
            </li>
            <li><a href="#" className="hover:text-amber-400 transition">Vendor Verification Queue</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Bank Payout Transfers (CEFT/SLIPS)</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Category Commission Settings</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">PayHere Webhook Diagnostics</a></li>
          </ul>
        </div>
      </div>

      {/* Payment & Logistics Badges */}
      <div className="bg-slate-900 border-t border-slate-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold">Accepted Payment Gateways:</span>
            <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-bold border border-slate-700">PayHere</span>
            <span className="bg-slate-800 text-blue-400 px-2 py-0.5 rounded font-bold border border-slate-700">WebXpay</span>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">Visa / Mastercard</span>
            <span className="bg-slate-800 text-purple-300 px-2 py-0.5 rounded border border-slate-700">Genie</span>
            <span className="bg-slate-800 text-red-400 px-2 py-0.5 rounded border border-slate-700">eZ Cash</span>
            <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">FriMi</span>
            <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-bold">Cash on Delivery</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold">Fulfillment Couriers:</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Domex</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Pronto</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Koombiyo</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">PromptX</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Citypak</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950 py-3 text-center text-[10px] text-slate-600 border-t border-slate-900">
        © 2026 Sri Lanka Multi-Vendor E-Commerce Platform. All rights reserved. Sri Lankan Localized Web App.
      </div>
    </footer>
  );
};

export default Footer;
