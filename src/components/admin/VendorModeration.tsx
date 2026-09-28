import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Store, Search
} from 'lucide-react';

export const VendorModeration: React.FC = () => {
  const { vendors, approveVendor, suspendVendor } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredVendors = vendors.filter(v => {
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
                        v.district.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Store className="w-5 h-5 text-amber-500" />
            <span>Vendor Moderation & Verification Console ({vendors.length} Shops)</span>
          </h2>
          <p className="text-xs text-slate-500">Review newly onboarded shops, verify Sri Lankan bank credentials, and grant active status.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shop, owner or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-100 border border-slate-300 text-slate-900 px-3.5 py-2 pl-9 rounded-xl text-xs font-medium outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            {['all', 'pending', 'approved', 'suspended'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition ${
                  filterStatus === st ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-4">Shop Identity</th>
              <th className="p-4">Owner & NIC</th>
              <th className="p-4">District / Pickup Location</th>
              <th className="p-4">Sri Lankan Bank Credentials</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                  No merchant shops found matching current criteria.
                </td>
              </tr>
            ) : (
              filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={vendor.logo} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{vendor.name}</p>
                        <span className="text-[10px] text-amber-600 font-mono font-bold">Comm Rate: {vendor.customCommissionRate || 8}%</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900">{vendor.ownerName}</p>
                    <span className="font-mono text-[10px] text-slate-500">NIC: {vendor.bankAccount.nicNumber}</span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900">{vendor.district} District</p>
                    <span className="text-slate-500 text-[10px] line-clamp-1">{vendor.pickupAddress}</span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900">{vendor.bankAccount.bankName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Acc: {vendor.bankAccount.accountNumber}</p>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      vendor.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      vendor.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {vendor.status === 'pending' && (
                      <button
                        onClick={() => approveVendor(vendor.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow"
                      >
                        Approve Shop
                      </button>
                    )}

                    {vendor.status === 'approved' && (
                      <button
                        onClick={() => suspendVendor(vendor.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow"
                      >
                        Suspend Shop
                      </button>
                    )}

                    {vendor.status === 'suspended' && (
                      <button
                        onClick={() => approveVendor(vendor.id)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow"
                      >
                        Re-Activate Shop
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorModeration;
