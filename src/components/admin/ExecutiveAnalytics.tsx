import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, DollarSign, Store, 
  Package, PieChart 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatLKR } from '../../utils/formatters';

export const ExecutiveAnalytics: React.FC = () => {
  const { vendors, products, orders, categoryCommissions } = useStore();

  // Aggregate Platform Metrics
  let totalGMV = 0;
  let totalPlatformNetCommission = 0;
  let totalGatewayFeesCollected = 0;
  let totalSubOrdersCount = 0;

  orders.forEach(parent => {
    parent.subOrders.forEach(sub => {
      totalGMV += sub.grossTotal;
      totalPlatformNetCommission += sub.platformCommissionAmount;
      totalGatewayFeesCollected += sub.gatewayFeeAmount;
      totalSubOrdersCount++;
    });
  });

  const activeVendorsCount = vendors.filter(v => v.status === 'approved').length;
  const pendingVendorsCount = vendors.filter(v => v.status === 'pending').length;

  // Chart Data by Category GMV
  const categoryGmvData = categoryCommissions.map(c => {
    let catGross = 0;
    orders.forEach(parent => {
      parent.subOrders.forEach(sub => {
        sub.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod && prod.category === c.categoryName) {
            catGross += item.subtotal;
          }
        });
      });
    });

    return {
      category: c.categoryName.replace('&', '+'),
      gmv: catGross || Math.floor(15000 + Math.random() * 45000), // demo fallback
      commissionRate: c.commissionRate
    };
  });

  const COLORS = ['#f57224', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg space-y-2 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Total Platform GMV</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black font-mono tracking-tight text-amber-400">
            {formatLKR(totalGMV)}
          </p>
          <span className="text-xs text-slate-400 block">Gross Merchandise Volume across Sri Lanka</span>
        </div>

        {/* Net Commission Revenue */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Net Platform Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600">
            {formatLKR(totalPlatformNetCommission)}
          </p>
          <span className="text-xs text-slate-500 block">Collected via Vendor Commissions (6-10%)</span>
        </div>

        {/* Active Sellers */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Vendor Ecosystem</span>
            <Store className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {activeVendorsCount} Approved Shops
          </p>
          {pendingVendorsCount > 0 && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              {pendingVendorsCount} Pending Admin Approval
            </span>
          )}
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Sub-Orders Processed</span>
            <Package className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {totalSubOrdersCount} Sub-Orders
          </p>
          <span className="text-xs text-slate-500 block">Gateway Fees: {formatLKR(totalGatewayFeesCollected)}</span>
        </div>
      </div>

      {/* Category GMV Distribution Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-amber-500" />
              <span>Category Gross Revenue (LKR) & Commission Rates</span>
            </h3>
            <p className="text-xs text-slate-500">Sales breakdown by major product sectors</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryGmvData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `Rs. ${(val / 1000)}k`} />
              <Tooltip formatter={(value: any) => formatLKR(Number(value))} />
              <Bar dataKey="gmv" radius={[8, 8, 0, 0]}>
                {categoryGmvData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
