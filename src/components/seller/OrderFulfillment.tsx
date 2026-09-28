import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { VendorSubOrder, ParentOrder } from '../../types';
import { 
  Truck, Printer, X
} from 'lucide-react';
import { formatLKR, COURIERS_SRI_LANKA } from '../../utils/formatters';
import InvoiceModal from '../common/InvoiceModal';

export const OrderFulfillment: React.FC = () => {
  const { activeSellerVendorId, orders, updateSubOrderStatus, dispatchSubOrder, vendors } = useStore();
  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dispatch Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchingSubOrder, setDispatchingSubOrder] = useState<VendorSubOrder | null>(null);
  const [courierName, setCourierName] = useState('Domex Courier');
  const [waybillNumber, setWaybillNumber] = useState(`DMX-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [dispatchNotes, setDispatchNotes] = useState('Handed over to courier driver');

  // Print Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{ sub: VendorSubOrder; parent: ParentOrder } | null>(null);

  // Flatten sub-orders belonging to this vendor
  const vendorSubOrders: { sub: VendorSubOrder; parent: ParentOrder }[] = [];
  orders.forEach(parent => {
    parent.subOrders.forEach(sub => {
      if (sub.vendorId === activeSellerVendorId) {
        vendorSubOrders.push({ sub, parent });
      }
    });
  });

  const filteredSubOrders = vendorSubOrders.filter(item => {
    if (statusFilter === 'all') return true;
    return item.sub.status === statusFilter;
  });

  const handleOpenDispatchModal = (sub: VendorSubOrder) => {
    setDispatchingSubOrder(sub);
    setCourierName('Domex Courier');
    setWaybillNumber(`DMX-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setDispatchNotes('Package handed over to driver');
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingSubOrder) return;
    dispatchSubOrder(dispatchingSubOrder.id, courierName, waybillNumber, dispatchNotes);
    setShowDispatchModal(false);
  };

  const handleOpenInvoice = (sub: VendorSubOrder, parent: ParentOrder) => {
    setInvoiceData({ sub, parent });
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span>Vendor Orders & Courier Self-Fulfillment</span>
          </h2>
          <p className="text-xs text-slate-500">
            Dispatch orders, assign waybill tracking numbers (Domex, Pronto, Koombiyo), and print customer invoices for {currentVendor?.name}.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          {['all', 'pending', 'packed', 'dispatched', 'delivered'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-4">Sub-Order & Customer</th>
              <th className="p-4">Delivery Destination</th>
              <th className="p-4">Order Items</th>
              <th className="p-4 text-right">Net Revenue (LKR)</th>
              <th className="p-4 text-center">Fulfillment Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredSubOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                  No sub-orders matching current filter.
                </td>
              </tr>
            ) : (
              filteredSubOrders.map(({ sub, parent }) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        #{sub.id}
                      </span>
                      <p className="font-bold text-slate-900 pt-1">{parent.customerName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Parent: {parent.id}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{parent.shippingAddress.district} District</p>
                    <p className="text-slate-500 text-[11px] line-clamp-1">{parent.shippingAddress.city}, {parent.shippingAddress.streetAddress}</p>
                    <p className="text-slate-500 text-[10px] font-mono">Tel: {parent.shippingAddress.phone}</p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1 max-w-xs">
                      {sub.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <img src={item.productImage} alt="" className="w-6 h-6 object-cover rounded shrink-0" />
                          <span className="truncate text-slate-800 font-medium">{item.quantity}x {item.productTitle}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 text-right font-mono">
                    <span className="font-bold text-slate-900 block">{formatLKR(sub.netSellerEarnings)}</span>
                    <span className="text-[10px] text-slate-400 block">Gross: {formatLKR(sub.grossTotal)}</span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="inline-flex flex-col items-center space-y-1">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        sub.status === 'dispatched' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        sub.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        sub.status === 'packed' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {sub.status}
                      </span>
                      {sub.courierDetails && (
                        <span className="font-mono text-[9px] text-amber-700 bg-amber-50 px-1.5 rounded border border-amber-200">
                          {sub.courierDetails.waybillNumber}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {/* Action buttons based on status */}
                    {sub.status === 'pending' && (
                      <button
                        onClick={() => updateSubOrderStatus(sub.id, 'packed')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition"
                      >
                        Mark Packed
                      </button>
                    )}

                    {sub.status === 'packed' && (
                      <button
                        onClick={() => handleOpenDispatchModal(sub)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg text-xs transition shadow"
                      >
                        Dispatch Courier
                      </button>
                    )}

                    {sub.status === 'dispatched' && (
                      <button
                        onClick={() => updateSubOrderStatus(sub.id, 'delivered')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                      >
                        Confirm Delivered
                      </button>
                    )}

                    {/* Print Invoice */}
                    <button
                      onClick={() => handleOpenInvoice(sub, parent)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      title="Print Customer Invoice & Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Courier Dispatch Modal */}
      {showDispatchModal && dispatchingSubOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Dispatch Courier Details (#{dispatchingSubOrder.id})</h3>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Courier Partner *</label>
                <select
                  value={courierName}
                  onChange={e => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-bold"
                >
                  {COURIERS_SRI_LANKA.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waybill / Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={waybillNumber}
                  onChange={e => setWaybillNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dispatch Note</label>
                <input
                  type="text"
                  value={dispatchNotes}
                  onChange={e => setDispatchNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow transition"
              >
                Confirm Dispatch & Notify Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoiceModal && invoiceData && (
        <InvoiceModal
          subOrder={invoiceData.sub}
          parentOrder={invoiceData.parent}
          vendor={currentVendor}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default OrderFulfillment;
