import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, CreditCard, Smartphone, CheckCircle, Lock, RefreshCw } from 'lucide-react';
import { formatLKR, calculatePayHereMD5 } from '../../utils/formatters';

interface PayHereModalProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (txnId: string, md5sig: string) => void;
  onCancel: () => void;
}

export const PayHereModal: React.FC<PayHereModalProps> = ({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onCancel
}) => {
  const { addWebhookLog } = useStore();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'genie' | 'ezcash' | 'frimi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('882');

  const merchantId = '1224810';
  const merchantSecret = '4x8910294102948102948102';
  const currency = 'LKR';

  // Calculate MD5 Signature
  const calculatedMd5 = calculatePayHereMD5(merchantId, orderId, amount, currency, merchantSecret);

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txnId = `PYH-${Math.floor(1000000 + Math.random() * 9000000)}`;

      // Log Webhook notification to system
      addWebhookLog({
        gateway: 'PayHere',
        merchantId,
        orderId,
        amount,
        currency,
        statusCode: 2, // 2 = Success in PayHere spec
        md5sig: calculatedMd5,
        md5Valid: true,
        rawPayload: {
          merchant_id: merchantId,
          order_id: orderId,
          payment_id: txnId,
          payhere_amount: amount.toFixed(2),
          payhere_currency: currency,
          status_code: '2',
          status_message: 'Successfully received payment',
          md5sig: calculatedMd5,
          custom_1: customerName,
          custom_2: customerPhone,
          email: customerEmail,
          method: selectedMethod.toUpperCase()
        }
      });

      setIsProcessing(false);
      onSuccess(txnId, calculatedMd5);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* PayHere Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wide text-lg text-amber-400">PayHere</span>
                <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded font-mono">SANDBOX</span>
              </div>
              <p className="text-xs text-blue-200">Official Sri Lankan Local Payment Gateway</p>
            </div>
          </div>

          <button onClick={onCancel} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Order ID</span>
            <p className="font-mono text-xs font-bold text-slate-800">{orderId}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Amount</span>
            <p className="text-lg font-black text-emerald-600">{formatLKR(amount)}</p>
          </div>
        </div>

        {/* Security MD5 Hash Indicator */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center space-x-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>MD5 Security Hash Validated:</span>
          </span>
          <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
            {calculatedMd5.substring(0, 14)}...
          </span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-medium transition ${
                selectedMethod === 'card' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Card</span>
            </button>

            <button
              onClick={() => setSelectedMethod('genie')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-medium transition ${
                selectedMethod === 'genie' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Genie</span>
            </button>

            <button
              onClick={() => setSelectedMethod('ezcash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-medium transition ${
                selectedMethod === 'ezcash' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-5 h-5 text-red-600" />
              <span>eZ Cash</span>
            </button>

            <button
              onClick={() => setSelectedMethod('frimi')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-medium transition ${
                selectedMethod === 'frimi' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-5 h-5 text-amber-600" />
              <span>FriMi</span>
            </button>
          </div>

          {/* Form Fields according to method */}
          {selectedMethod === 'card' ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CVV Security</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Simulated {selectedMethod.toUpperCase()} Mobile Wallet Payment
              </p>
              <p>A payment approval request will be sent to mobile number: <span className="font-mono font-bold text-slate-900">{customerPhone}</span></p>
            </div>
          )}

          {/* Submit Action */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Validating PayHere MD5 Signature...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm & Pay {formatLKR(amount)}</span>
              </>
            )}
          </button>
          
          <div className="text-center">
            <span className="text-[11px] text-slate-400">
              256-Bit SSL Encrypted • PCI-DSS Compliant PayHere Gateway
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayHereModal;
