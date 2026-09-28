import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

interface WebhookLoggerModalProps {
  onClose: () => void;
}

export const WebhookLoggerModal: React.FC<WebhookLoggerModalProps> = ({ onClose }) => {
  const { webhookLogs } = useStore();

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Payment Gateway Webhook & MD5 Validation Log</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl text-xs text-slate-300 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>PayHere & WebXpay Security Protocol</span>
            </div>
            <p>
              When a customer completes payment via PayHere or WebXpay, the payment gateway issues an HTTP POST notification (webhook) to the platform server with parameters: <code className="text-emerald-300">merchant_id</code>, <code className="text-emerald-300">order_id</code>, <code className="text-emerald-300">payhere_amount</code>, <code className="text-emerald-300">payhere_currency</code>, <code className="text-emerald-300">status_code</code> (2 = Success), and <code className="text-amber-300">md5sig</code>.
            </p>
            <p className="font-mono text-[11px] text-slate-400">
              Formula: md5sig = UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))))
            </p>
          </div>

          {webhookLogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800">
              <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No webhook requests received yet.</p>
              <p className="text-slate-500 text-xs mt-1">Place an order using PayHere Sandbox to trigger payment notifications.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {webhookLogs.map(log => (
                <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                        {log.gateway} POST
                      </span>
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="text-slate-500">Order: {log.orderId}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {log.md5Valid ? (
                        <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700/50">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>MD5 Signature Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-700/50">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Invalid Signature</span>
                        </span>
                      )}
                      <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-bold">
                        Status Code: {log.statusCode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-slate-900 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Merchant ID:</span>
                      <span className="text-white">{log.merchantId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Amount Paid:</span>
                      <span className="text-amber-400 font-bold">{formatLKR(log.amount)} ({log.currency})</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">MD5 Signature Hash:</span>
                      <span className="text-emerald-300 break-all">{log.md5sig}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Raw POST Payload:</span>
                    <pre className="bg-slate-900 p-2.5 rounded-lg text-emerald-400 text-[11px] overflow-x-auto">
                      {JSON.stringify(log.rawPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebhookLoggerModal;
