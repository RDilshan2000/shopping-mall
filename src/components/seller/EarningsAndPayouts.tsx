import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Wallet, DollarSign, Building2, Clock, 
  CheckCircle2, Send
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

export const EarningsAndPayouts: React.FC = () => {
  const { activeSellerVendorId, orders, payoutRequests, requestBankPayout, vendors, addToast } = useStore();
  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);

  const [requestedAmount, setRequestedAmount] = useState<number>(25000);

  // Calculate vendor financial stats from all sub-orders
  let totalGross = 0;
  let totalCommission = 0;
  let totalGatewayFees = 0;
  let netEarnings = 0;
  let pendingBalance = 0;
  let deliveredBalance = 0;

  orders.forEach(parent => {
    parent.subOrders.forEach(sub => {
      if (sub.vendorId === activeSellerVendorId) {
        totalGross += sub.grossTotal;
        totalCommission += sub.platformCommissionAmount;
        totalGatewayFees += sub.gatewayFeeAmount;
        netEarnings += sub.netSellerEarnings;

        if (sub.status === 'delivered') {
          deliveredBalance += sub.netSellerEarnings;
        } else if (sub.status !== 'cancelled') {
          pendingBalance += sub.netSellerEarnings;
        }
      }
    });
  });

  // Calculate payouts breakdown
  const vendorPayouts = payoutRequests.filter(r => r.vendorId === activeSellerVendorId);
  const totalWithdrawn = vendorPayouts
    .filter(r => r.status === 'transferred')
    .reduce((acc, r) => acc + r.requestedAmount, 0);

  const pendingWithdrawalRequests = vendorPayouts
    .filter(r => r.status === 'pending_approval')
    .reduce((acc, r) => acc + r.requestedAmount, 0);

  const availableBalance = Math.max(0, deliveredBalance - totalWithdrawn - pendingWithdrawalRequests);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedAmount <= 0) return;
    if (requestedAmount > availableBalance) {
      addToast('error', 'Insufficient Funds', `Available balance is ${formatLKR(availableBalance)}`);
      return;
    }
    requestBankPayout(activeSellerVendorId, Number(requestedAmount));
  };

  return (
    <div className="space-y-8">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Wallet Balance */}
        <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 p-6 rounded-3xl shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-950/80 text-xs font-bold uppercase tracking-wider">
            <span>Available for Payout</span>
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black font-mono tracking-tight">
            {formatLKR(availableBalance)}
          </p>
          <span className="text-[11px] font-semibold bg-slate-950/15 px-2.5 py-0.5 rounded-full inline-block">
            Ready for Bank Withdrawal
          </span>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Pending Clearance</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">
            {formatLKR(pendingBalance)}
          </p>
          <span className="text-[11px] text-slate-500 block">Orders in Transit / Packaging</span>
        </div>

        {/* Net Seller Earnings */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Net Seller Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600">
            {formatLKR(netEarnings)}
          </p>
          <span className="text-[11px] text-slate-500 block">After Commission & Gateway Fees</span>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Transferred</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black font-mono text-indigo-600">
            {formatLKR(totalWithdrawn)}
          </p>
          <span className="text-[11px] text-slate-500 block">Transferred to Bank Account</span>
        </div>
      </div>

      {/* Main Grid: Request Withdrawal Form & Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span>Request Manual Bank Withdrawal Payout</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Funds are transferred directly via CEFT/SLIPS real-time interbank network to your registered Sri Lankan bank account.
            </p>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            {currentVendor && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <span className="font-bold text-slate-800 text-xs block">Target Bank Account Credentials:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bank:</span>
                    <span className="font-bold text-slate-900">{currentVendor.bankAccount.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Branch:</span>
                    <span className="font-bold text-slate-900">{currentVendor.bankAccount.branchName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account No:</span>
                    <span className="font-mono font-bold text-slate-900">{currentVendor.bankAccount.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account Name:</span>
                    <span className="font-bold text-slate-900">{currentVendor.bankAccount.accountName}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Withdrawal Amount in LKR *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  max={availableBalance}
                  value={requestedAmount}
                  onChange={e => setRequestedAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono text-base font-bold text-amber-600"
                />
                <button
                  type="button"
                  onClick={() => setRequestedAmount(availableBalance)}
                  className="absolute right-2 top-2 px-3 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-lg"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={availableBalance <= 0}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Withdrawal Request to Super Admin</span>
            </button>
          </form>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3">
            Financial Deductions Audit
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Order Sales:</span>
              <span className="font-mono text-white font-bold">{formatLKR(totalGross)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Platform Commission ({currentVendor?.customCommissionRate || 8}%):</span>
              <span className="font-mono text-rose-400">-{formatLKR(totalCommission)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Payment Gateway Deductions (2.5%):</span>
              <span className="font-mono text-rose-400">-{formatLKR(totalGatewayFees)}</span>
            </div>

            <div className="flex justify-between font-extrabold text-sm text-emerald-400 pt-3 border-t border-slate-800">
              <span>Net Seller Balance:</span>
              <span className="font-mono">{formatLKR(netEarnings)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Payout History Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="font-black text-slate-900 text-base">Bank Payout Request History</h3>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-3">Request ID</th>
              <th className="p-3">Requested Date</th>
              <th className="p-3 font-mono text-right">Amount (LKR)</th>
              <th className="p-3">Target Bank Account</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3">Bank Ref Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
            {vendorPayouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-sans font-medium">
                  No withdrawal requests recorded yet.
                </td>
              </tr>
            ) : (
              vendorPayouts.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">{req.id}</td>
                  <td className="p-3 text-slate-500 font-sans">{req.requestedAt}</td>
                  <td className="p-3 text-right font-bold text-amber-600">{formatLKR(req.requestedAmount)}</td>
                  <td className="p-3 font-sans text-[11px]">
                    <span className="font-bold text-slate-900">{req.bankAccount.bankName}</span>
                    <span className="text-slate-500 block">({req.bankAccount.accountNumber})</span>
                  </td>
                  <td className="p-3 text-center font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      req.status === 'transferred' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-bold">
                    {req.bankRefNumber || '---'}
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

export default EarningsAndPayouts;
