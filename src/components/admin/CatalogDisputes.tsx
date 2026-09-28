import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Trash2, ShieldAlert, Search
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

export const CatalogDisputes: React.FC = () => {
  const { products, vendors, delistProduct, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'disputes'>('catalog');

  // Simulated buyer disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'DSP-8841',
      orderId: 'ORD-LK-2026-98104',
      subOrderId: 'VORD-98104-2',
      customerName: 'Nimanthi Silva',
      vendorName: 'ElectroLanka Tech Store',
      issue: 'Courier package delayed past estimated delivery date by Domex',
      amount: 9390,
      status: 'open',
      date: '2026-09-27'
    }
  ]);

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleResolveDispute = (id: string, resolution: 'refund' | 'dismiss') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: resolution === 'refund' ? 'refunded' : 'dismissed' } : d));
    addToast('info', 'Dispute Case Closed', `Claim ${id} marked as ${resolution.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Catalog Moderation & Buyer Dispute Claims</span>
          </h2>
          <p className="text-xs text-slate-500">Delist counterfeit or prohibited listings, handle buyer refunds, and manage seller complaints.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'catalog' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-1 ${
              activeTab === 'disputes' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Buyer Disputes</span>
            {disputes.filter(d => d.status === 'open').length > 0 && (
              <span className="bg-rose-600 text-white font-bold text-[10px] rounded-full px-1.5 py-0.2">
                {disputes.filter(d => d.status === 'open').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Catalog Moderation View */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search product title, category or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 pl-9 rounded-xl text-xs font-medium outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                  <th className="p-4">Item & SKU</th>
                  <th className="p-4">Vendor Shop</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price (LKR)</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredProducts.map(p => {
                  const vendor = vendors.find(v => v.id === p.vendorId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                            <span className="font-mono text-[10px] text-slate-400">SKU: {p.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        {vendor ? vendor.name : 'Unknown Shop'}
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-slate-900">
                        {formatLKR(p.basePrice)}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => delistProduct(p.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs transition flex items-center space-x-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delist Item</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disputes View */}
      {activeTab === 'disputes' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Active Buyer Dispute Claims</h3>

          {disputes.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-xs">No dispute claims currently logged.</p>
          ) : (
            <div className="space-y-4">
              {disputes.map(d => (
                <div key={d.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-slate-900">{d.id} • Order Ref: {d.subOrderId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      d.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <p>Buyer: <span className="font-bold text-slate-900">{d.customerName}</span></p>
                    <p>Vendor: <span className="font-bold text-slate-900">{d.vendorName}</span></p>
                    <p className="col-span-2 text-rose-700 font-medium">Claim Reason: "{d.issue}"</p>
                  </div>

                  {d.status === 'open' && (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleResolveDispute(d.id, 'dismiss')}
                        className="px-3 py-1.5 bg-slate-200 text-slate-800 font-bold rounded-xl"
                      >
                        Dismiss Claim
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, 'refund')}
                        className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl shadow"
                      >
                        Issue Buyer Refund ({formatLKR(d.amount)})
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogDisputes;
