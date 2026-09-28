import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Store, Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface TopSellersGridProps {
  onSelectVendor: (vendorId: string) => void;
}

export const TopSellersGrid: React.FC<TopSellersGridProps> = ({ onSelectVendor }) => {
  const { vendors, products } = useStore();
  const approvedVendors = vendors.filter(v => v.status === 'approved');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Store className="w-5 h-5 text-amber-500" />
            <span>Featured Sri Lankan Top Shops</span>
          </h2>
          <p className="text-xs text-slate-500">Verified Sri Lankan merchants with bank-backed credentials & direct fulfillment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {approvedVendors.map(vendor => {
          const vendorProds = products.filter(p => p.vendorId === vendor.id);

          return (
            <div
              key={vendor.id}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Banner & Logo */}
                <div className="relative h-28 bg-slate-800 overflow-hidden">
                  <img src={vendor.banner} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Verified Badge */}
                  <span className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center space-x-1 shadow">
                    <CheckCircle2 className="w-3 h-3 inline" />
                    <span>Verified Merchant</span>
                  </span>

                  {/* Logo Overlay */}
                  <div className="absolute -bottom-4 left-4 w-12 h-12 bg-white rounded-xl p-0.5 shadow-lg border border-slate-200">
                    <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-6 px-4 pb-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-600 transition">
                      {vendor.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{vendor.district}, LK</span>
                    </span>

                    <span className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{vendor.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Pickup Address: {vendor.pickupAddress}
                  </p>

                  {/* Mini Product Previews */}
                  <div className="pt-2 flex items-center space-x-2">
                    {vendorProds.slice(0, 3).map(p => (
                      <div key={p.id} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{vendorProds.length} Items
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectVendor(vendor.name)}
                  className="w-full py-2 bg-slate-100 hover:bg-amber-500 text-slate-800 hover:text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <span>Visit Shop Front</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSellersGrid;
