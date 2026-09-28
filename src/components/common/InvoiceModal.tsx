import React from 'react';
import type { VendorSubOrder, ParentOrder, Vendor } from '../../types';
import { X, Printer, Package, Truck, Building2, MapPin, CheckCircle } from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

interface InvoiceModalProps {
  subOrder: VendorSubOrder;
  parentOrder: ParentOrder;
  vendor?: Vendor;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  subOrder,
  parentOrder,
  vendor,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200 flex flex-col">
        {/* Modal Action Bar */}
        <div className="bg-slate-900 text-slate-200 px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Vendor Packing Slip & Customer Invoice</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-document" className="p-8 space-y-6 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇱🇰</span>
                <span className="font-black text-xl text-slate-900 tracking-tight">Sri Lanka Multi-Vendor E-Commerce</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Direct Vendor Self-Fulfillment Invoice</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-mono text-xs font-bold uppercase mb-1">
                Sub-Order #{subOrder.id}
              </span>
              <p className="text-xs text-slate-500">Parent Ref: <span className="font-mono text-slate-700 font-bold">{parentOrder.id}</span></p>
              <p className="text-xs text-slate-500">Date: {subOrder.createdAt}</p>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
            {/* Vendor / Dispatch From */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 border-b border-slate-200 pb-1">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>DISPATCHED FROM (VENDOR):</span>
              </div>
              <p className="font-bold text-sm text-slate-900">{subOrder.vendorName}</p>
              <p className="text-slate-600">{vendor?.pickupAddress || 'Registered Merchant Facility'}</p>
              <p className="text-slate-600">District: <span className="font-semibold text-slate-800">{vendor?.district || 'Western Province'}</span></p>
              <p className="text-slate-600">Phone: {vendor?.phone || '+94 77 123 4567'}</p>
            </div>

            {/* Customer Shipping Address */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 border-b border-slate-200 pb-1">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>DELIVER TO (CUSTOMER):</span>
              </div>
              <p className="font-bold text-sm text-slate-900">{parentOrder.shippingAddress.fullName}</p>
              <p className="text-slate-600">{parentOrder.shippingAddress.streetAddress}</p>
              <p className="text-slate-600">{parentOrder.shippingAddress.city}, District: <span className="font-semibold text-slate-800">{parentOrder.shippingAddress.district}</span> ({parentOrder.shippingAddress.postalCode})</p>
              <p className="text-slate-600">Tel: <span className="font-mono font-bold text-slate-900">{parentOrder.shippingAddress.phone}</span></p>
            </div>
          </div>

          {/* Logistics & Courier Box */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-amber-900 font-bold uppercase block text-[10px]">Courier Partner</span>
                <p className="font-bold text-slate-900 text-sm">{subOrder.courierDetails?.courierName || 'Pending Courier Dispatch'}</p>
              </div>
            </div>

            <div>
              <span className="text-amber-900 font-bold uppercase block text-[10px]">Waybill / Tracking No.</span>
              <p className="font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded border border-amber-300 inline-block">
                {subOrder.courierDetails?.waybillNumber || 'UNASSIGNED'}
              </p>
            </div>

            <div>
              <span className="text-amber-900 font-bold uppercase block text-[10px]">Payment Terms</span>
              <p className="font-bold text-slate-900 text-sm uppercase">
                {parentOrder.paymentMethod === 'cod' ? (
                  <span className="text-rose-600">CASH ON DELIVERY (COLLECT)</span>
                ) : (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 inline" />
                    <span>PAID ONLINE ({parentOrder.paymentMethod.toUpperCase()})</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[10px]">
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {subOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{item.productTitle}</p>
                      {item.variantName && <span className="text-[10px] text-slate-500 block">Variant: {item.variantName}</span>}
                    </td>
                    <td className="p-3 text-center font-bold font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatLKR(item.unitPrice)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{formatLKR(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">{formatLKR(subOrder.itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Delivery Fee:</span>
                <span className="font-mono">{formatLKR(subOrder.shippingFee)}</span>
              </div>

              {/* Commission deduction breakdown note for vendor */}
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-dashed border-slate-200">
                <span>Platform Comm ({subOrder.platformCommissionRate}%):</span>
                <span className="font-mono text-rose-600">-{formatLKR(subOrder.platformCommissionAmount)}</span>
              </div>

              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-300">
                <span>Package Total:</span>
                <span className="font-mono text-amber-600">{formatLKR(subOrder.grossTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
            <p>Thank you for shopping with Sri Lanka Multi-Vendor E-Commerce Platform! For customer support hotline: +94 11 200 0000.</p>
            <span className="font-mono text-slate-400">System Generated Invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
