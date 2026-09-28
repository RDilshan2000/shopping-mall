import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Store, Building2, CreditCard, ShieldCheck
} from 'lucide-react';
import { SRI_LANKAN_DISTRICTS, SRI_LANKAN_BANKS } from '../../utils/formatters';
import type { SriLankanDistrict } from '../../types';

export const SellerOnboarding: React.FC = () => {
  const { registerVendorShop, activeSellerVendorId, vendors } = useStore();
  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);

  const [shopName, setShopName] = useState('Lanka Crafts & Spices');
  const [ownerName, setOwnerName] = useState('Anura Kumara');
  const [email, setEmail] = useState('anura@lankacrafts.lk');
  const [phone, setPhone] = useState('+94 77 999 8877');
  const [district, setDistrict] = useState<SriLankanDistrict>('Galle');
  const [city, setCity] = useState('Galle Fort');
  const [pickupAddress, setPickupAddress] = useState('No 84, Church Street, Galle Fort');
  const logo = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80';
  const banner = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80';

  // Bank details
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [branchName, setBranchName] = useState('Galle Fort Branch (Code 019)');
  const [accountNumber, setAccountNumber] = useState('80091820491');
  const [accountName, setAccountName] = useState('Anura Kumara Lanka Crafts');
  const [nicNumber, setNicNumber] = useState('821094819V');

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    registerVendorShop({
      name: shopName,
      slug,
      logo,
      banner,
      ownerName,
      email,
      phone,
      district,
      city,
      pickupAddress,
      bankAccount: {
        bankName,
        branchName,
        accountNumber,
        accountName,
        nicNumber
      },
      allowCod: true
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Current Shop Status Header if logged in */}
      {currentVendor && (
        <div className={`p-6 rounded-3xl border shadow-md flex flex-wrap items-center justify-between gap-4 ${
          currentVendor.status === 'approved' 
            ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800' 
            : currentVendor.status === 'pending'
            ? 'bg-amber-950/90 text-amber-100 border-amber-800'
            : 'bg-rose-950/90 text-rose-100 border-rose-800'
        }`}>
          <div className="flex items-center space-x-4">
            <img src={currentVendor.logo} alt="" className="w-14 h-14 object-cover rounded-2xl border-2 border-current" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black">{currentVendor.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full uppercase font-bold bg-black/40 border border-current">
                  {currentVendor.status}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-1">
                Owner: {currentVendor.ownerName} • Pickup: {currentVendor.district} ({currentVendor.pickupAddress})
              </p>
            </div>
          </div>

          <div className="text-right text-xs space-y-1 font-mono">
            <p className="opacity-80">Bank Account Linked:</p>
            <p className="font-bold">{currentVendor.bankAccount.bankName}</p>
            <p className="opacity-90">{currentVendor.bankAccount.accountNumber}</p>
          </div>
        </div>
      )}

      {/* Setup New Shop Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-slate-900">Seller Shop Setup & Bank Verification</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register your Sri Lankan business shop front. Direct self-fulfillment and automated payouts to your local bank account.
          </p>
        </div>

        <form onSubmit={handleSubmitOnboarding} className="space-y-8">
          
          {/* Section 1: Shop & Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>1. Store Identity & Dispatch Facility</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shop Name *</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner / Representative Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Merchant Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hotline / Mobile Phone (+94) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup District *</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value as SriLankanDistrict)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-semibold"
                >
                  {SRI_LANKAN_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d} District</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Courier Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sri Lankan Bank Details */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>2. Local Bank Payout Account (Sri Lanka)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                <select
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-semibold"
                >
                  {SRI_LANKAN_BANKS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Name & Code *</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIC or Passport Number *</label>
                <input
                  type="text"
                  required
                  value={nicNumber}
                  onChange={e => setNicNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Submit Shop Details for Super Admin Verification</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerOnboarding;
