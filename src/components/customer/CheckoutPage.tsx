import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, CreditCard, MapPin, Store, CheckCircle, ArrowLeft
} from 'lucide-react';
import { formatLKR, SRI_LANKAN_DISTRICTS } from '../../utils/formatters';
import type { SriLankanDistrict } from '../../types';
import PayHereModal from '../common/PayHereModal';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onBackToShopping: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToShopping,
  onOrderSuccess
}) => {
  const { cart, vendors, placeOrder, addToast } = useStore();

  // Address Form State
  const [fullName, setFullName] = useState('Nimanthi Silva');
  const [phone, setPhone] = useState('+94 77 555 1212');
  const [email, setEmail] = useState('nimanthi.silva@gmail.com');
  const [streetAddress, setStreetAddress] = useState('No 12/B, Flower Road');
  const [district, setDistrict] = useState<SriLankanDistrict>('Colombo');
  const [city, setCity] = useState('Colombo 07');
  const [postalCode, setPostalCode] = useState('00700');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'payhere' | 'webxpay' | 'cod'>('payhere');
  
  // PayHere Modal State
  const [showPayHereModal, setShowPayHereModal] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<{ id: string; amount: number } | null>(null);

  // Group cart items by vendor
  const cartByVendor: Record<string, typeof cart> = {};
  cart.forEach(item => {
    if (!cartByVendor[item.vendorId]) cartByVendor[item.vendorId] = [];
    cartByVendor[item.vendorId].push(item);
  });

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const totalShippingFee = Object.keys(cartByVendor).length * 350;
  const grandTotal = cartSubtotal + totalShippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !streetAddress || !city) {
      addToast('error', 'Missing Information', 'Please complete all address fields.');
      return;
    }

    const shippingAddress = {
      fullName,
      phone,
      email,
      streetAddress,
      district,
      city,
      postalCode
    };

    if (paymentMethod === 'payhere') {
      // Launch PayHere Gateway Modal for MD5 verification & simulation
      const simOrderId = `ORD-LK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setPendingOrderDetails({ id: simOrderId, amount: grandTotal });
      setShowPayHereModal(true);
    } else if (paymentMethod === 'webxpay') {
      // Simulate WebXpay
      const newOrder = placeOrder(shippingAddress, 'webxpay', `WXP-${Math.floor(100000 + Math.random() * 900000)}`);
      triggerSuccess(newOrder.id);
    } else {
      // Cash on Delivery
      const newOrder = placeOrder(shippingAddress, 'cod');
      triggerSuccess(newOrder.id);
    }
  };

  const handlePayHereSuccess = (txnId: string, md5sig: string) => {
    setShowPayHereModal(false);
    const shippingAddress = { fullName, phone, email, streetAddress, district, city, postalCode };
    const newOrder = placeOrder(shippingAddress, 'payhere', txnId, md5sig);
    triggerSuccess(newOrder.id);
  };

  const triggerSuccess = (orderId: string) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    onOrderSuccess(orderId);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <button
          onClick={onBackToShopping}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 transition"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBackToShopping}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Delivery Address & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Sri Lanka Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (+94) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District *</label>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Select Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* PayHere */}
              <div
                onClick={() => setPaymentMethod('payhere')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'payhere'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-indigo-950">PayHere Gateway</span>
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">RECOMMENDED</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Credit/Debit Card, Genie, EzCash, Frimi (MD5 Signature Validated).
                </p>
              </div>

              {/* WebXpay */}
              <div
                onClick={() => setPaymentMethod('webxpay')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'webxpay'
                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-blue-950">WebXpay Lanka</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct local online card and mobile wallet checkout.
                </p>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'cod'
                    ? 'border-amber-600 bg-amber-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-slate-900">Cash on Delivery</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay cash to courier driver upon package arrival.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Order Breakdown & Split Vendor Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-3">
              Order Summary (Multi-Vendor Split)
            </h3>

            {/* Vendor Sub-orders preview */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {Object.entries(cartByVendor).map(([vId, vItems]) => {
                const vendor = vendors.find(v => v.id === vId);
                const vSubtotal = vItems.reduce((acc, i) => acc + (i.selectedVariant ? i.selectedVariant.price : i.product.basePrice) * i.quantity, 0);

                return (
                  <div key={vId} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                      <span className="flex items-center space-x-1 truncate max-w-[160px]">
                        <Store className="w-3.5 h-3.5 text-amber-600 inline" />
                        <span>{vendor?.name}</span>
                      </span>
                      <span className="font-mono">{formatLKR(vSubtotal + 350)}</span>
                    </div>

                    {vItems.map((item, i) => (
                      <div key={i} className="flex justify-between text-slate-600 text-[11px]">
                        <span className="truncate max-w-[160px]">{item.quantity}x {item.product.title}</span>
                        <span className="font-mono">{formatLKR((item.selectedVariant ? item.selectedVariant.price : item.product.basePrice) * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="text-[10px] text-indigo-700 flex justify-between font-medium">
                      <span>Direct Shipping (Domex/Pronto):</span>
                      <span className="font-mono">Rs. 350.00</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Total:</span>
                <span className="font-mono font-semibold">{formatLKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Delivery ({Object.keys(cartByVendor).length} Vendors):</span>
                <span className="font-mono font-semibold">{formatLKR(totalShippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total (LKR):</span>
                <span className="font-mono text-amber-600">{formatLKR(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Order ({formatLKR(grandTotal)})</span>
            </button>
          </div>
        </div>

      </form>

      {/* PayHere Sandbox Gateway Modal */}
      {showPayHereModal && pendingOrderDetails && (
        <PayHereModal
          orderId={pendingOrderDetails.id}
          amount={pendingOrderDetails.amount}
          customerName={fullName}
          customerEmail={email}
          customerPhone={phone}
          onSuccess={handlePayHereSuccess}
          onCancel={() => setShowPayHereModal(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
