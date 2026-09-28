import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { PayoutRequest } from '../../types';
import { 
  Building2, CheckCircle2, X
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

export const BankPayoutManager: React.FC = () => {
  const { payoutRequests, processPayoutRequest } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReq, setSelectedReq] = useState<PayoutRequest | null>(null);
  const [bankRefNumber, setBankRefNumber] = useState(`CEFT-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [adminNotes, setAdminNotes] = useState('Transferred via Commercial Bank CEFT real-time link');

  const filteredRequests = payoutRequests.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  const handleOpenProcessModal = (req: PayoutRequest) => {
    setSelectedReq(req);
    setBankRefNumber(`CEFT-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setAdminNotes('Transferred via Commercial Bank CEFT real-time link');
  };

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    processPayoutRequest(selectedReq.id, bankRefNumber, adminNotes);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <span>Seller Bank Payout Transfer Manager</span>
          </h2>
          <p className="text-xs text-slate-500">Review seller withdrawal requests, enter interbank transaction reference numbers (CEFT/SLIPS), and approve payouts.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          {['all', 'pending_approval', 'transferred'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                filterStatus === st ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-4">Request ID & Date</th>
              <th className="p-4">Vendor Shop</th>
              <th className="p-4 font-mono text-right">Requested Amount (LKR)</th>
              <th className="p-4">Target Sri Lankan Bank Credentials</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                  No payout requests matching current filter.
                </td>
              </tr>
            ) : (
              filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900">{req.id}</span>
                    <span className="text-[10px] text-slate-500 block">{req.requestedAt}</span>
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    {req.vendorName}
                  </td>

                  <td className="p-4 text-right font-mono font-black text-amber-600 text-sm">
                    {formatLKR(req.requestedAmount)}
                  </td>

                  <td className="p-4 space-y-0.5">
                    <p className="font-bold text-slate-900">{req.bankAccount.bankName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Branch: {req.bankAccount.branchName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Acc #: <span className="font-bold text-slate-800">{req.bankAccount.accountNumber}</span> ({req.bankAccount.accountName})</p>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      req.status === 'transferred' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      req.status === 'pending_approval' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    {req.bankRefNumber && (
                      <span className="block font-mono text-[9px] font-bold text-slate-600 mt-1">
                        Ref: {req.bankRefNumber}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {req.status === 'pending_approval' ? (
                      <button
                        onClick={() => handleOpenProcessModal(req)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center space-x-1 ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Process Transfer</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Process Payout Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Process Bank Transfer Payout ({selectedReq.id})</h3>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayout} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Vendor: {selectedReq.vendorName}</span>
                  <span className="font-mono text-amber-600">{formatLKR(selectedReq.requestedAmount)}</span>
                </div>
                <p className="text-[11px] text-slate-600">{selectedReq.bankAccount.bankName} - {selectedReq.bankAccount.accountNumber}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interbank Reference Number (CEFT / SLIPS) *</label>
                <input
                  type="text"
                  required
                  value={bankRefNumber}
                  onChange={e => setBankRefNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Processing Notes</label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow transition"
              >
                Mark as Bank Transferred
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankPayoutManager;
