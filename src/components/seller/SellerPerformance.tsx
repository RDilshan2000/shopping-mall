import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, Star, Award, Clock, CheckCircle2 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatLKR } from '../../utils/formatters';

export const SellerPerformance: React.FC = () => {
  const { activeSellerVendorId, vendors, products } = useStore();
  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);
  const vendorProducts = products.filter(p => p.vendorId === activeSellerVendorId);

  // Mock 30-day sales data for chart
  const chartData = [
    { date: 'Sep 01', revenue: 14500, orders: 4 },
    { date: 'Sep 05', revenue: 28900, orders: 8 },
    { date: 'Sep 10', revenue: 42000, orders: 12 },
    { date: 'Sep 15', revenue: 35000, orders: 9 },
    { date: 'Sep 20', revenue: 68000, orders: 18 },
    { date: 'Sep 25', revenue: 84500, orders: 22 },
    { date: 'Sep 28', revenue: 98000, orders: 25 },
  ];

  return (
    <div className="space-y-8">
      {/* Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Shop Score</span>
            <Star className="w-5 h-5 text-amber-500 fill-current" />
          </div>
          <p className="text-3xl font-black text-slate-900">{currentVendor?.rating.toFixed(1) || '4.9'} / 5.0</p>
          <span className="text-xs text-emerald-600 font-bold">Based on {currentVendor?.reviewCount || 124} buyer ratings</span>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Fulfillment Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">99.2%</p>
          <span className="text-xs text-slate-500">Fast processing within 24h</span>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Avg Dispatch Time</span>
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-indigo-600">1.2 Days</p>
          <span className="text-xs text-slate-500">Handover to Domex/Pronto</span>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Active Listings</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{vendorProducts.length} Items</p>
          <span className="text-xs text-slate-500">Published catalog items</span>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>30-Day Revenue Trend (LKR)</span>
            </h3>
            <p className="text-xs text-slate-500">Gross sales growth chart</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f57224" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f57224" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `Rs. ${(val / 1000)}k`} />
              <Tooltip formatter={(value: any) => formatLKR(Number(value))} />
              <Area type="monotone" dataKey="revenue" stroke="#f57224" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerPerformance;
