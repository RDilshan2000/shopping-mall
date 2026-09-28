import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { formatLKR } from '../../utils/formatters';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { cart, vendors, removeFromCart, updateCartQuantity, clearCart } = useStore();

  if (!isOpen) return null;

  // Group cart items by Vendor ID
  const cartByVendor: Record<string, CartItem[]> = {};
  cart.forEach(item => {
    if (!cartByVendor[item.vendorId]) {
      cartByVendor[item.vendorId] = [];
    }
    cartByVendor[item.vendorId].push(item);
  });

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  // Total estimated delivery fee across vendors (e.g. 350 LKR per vendor)
  const totalShippingFee = Object.keys(cartByVendor).length * 350;
  const grandTotal = cartSubtotal + totalShippingFee;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex justify-end">
      <div className="bg-white text-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">Your Shopping Cart</h2>
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Your cart is currently empty</p>
              <p className="text-xs text-slate-500">Explore authentic Sri Lankan tea, spices, batik, and tech!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(cartByVendor).map(([vendorId, items]) => {
                const vendor = vendors.find(v => v.id === vendorId);
                const vendorName = vendor ? vendor.name : 'Vendor Shop';

                return (
                  <div key={vendorId} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
                    {/* Vendor Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center space-x-2 font-bold text-xs text-slate-900">
                        <Store className="w-4 h-4 text-amber-600" />
                        <span className="truncate max-w-[200px]">{vendorName}</span>
                      </div>
                      <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-bold">
                        Courier: +Rs. 350
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {items.map((item, idx) => {
                        const price = item.selectedVariant ? item.selectedVariant.price : item.product.basePrice;

                        return (
                          <div key={idx} className="flex space-x-3 items-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                            <img src={item.product.images[0]} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0 bg-slate-100" />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 line-clamp-1">{item.product.title}</h4>
                              {item.selectedVariant && (
                                <span className="text-[10px] text-slate-500 block">Var: {item.selectedVariant.name}</span>
                              )}
                              <span className="font-bold font-mono text-slate-800 text-xs block mt-0.5">
                                {formatLKR(price)}
                              </span>
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg border border-slate-200 px-1">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                                className="px-1.5 py-0.5 font-bold hover:bg-slate-200 text-xs"
                              >
                                -
                              </button>
                              <span className="px-1.5 font-bold font-mono text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                                className="px-1.5 py-0.5 font-bold hover:bg-slate-200 text-xs"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-semibold text-slate-800">{formatLKR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Courier Delivery:</span>
                <span className="font-mono font-semibold text-slate-800">{formatLKR(totalShippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total (LKR):</span>
                <span className="font-mono text-amber-600">{formatLKR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-slate-400 hover:text-rose-600 font-medium py-1"
            >
              Empty Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
