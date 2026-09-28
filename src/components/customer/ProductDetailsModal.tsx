import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product, ProductVariant } from '../../types';
import { 
  X, Star, ShoppingCart, Heart, ShieldCheck, 
  Truck, CheckCircle, Store, MessageSquare
} from 'lucide-react';
import { formatLKR, SRI_LANKAN_DISTRICTS } from '../../utils/formatters';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onSelectVendorShop?: (vendorName: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectVendorShop
}) => {
  const { vendors, addToCart, wishlist, toggleWishlist, addToast } = useStore();
  const vendor = vendors.find(v => v.id === product.vendorId);
  const isWishlisted = wishlist.includes(product.id);

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([
    { id: 'r1', name: 'Dr. Bandara (Kandy)', rating: 5, date: '2026-09-20', comment: 'Top quality product! Packed securely and arrived in 2 days via Domex.', verified: true },
    { id: 'r2', name: 'Dilhani P. (Colombo)', rating: 5, date: '2026-09-18', comment: 'Authentic item as described. Excellent seller response.', verified: true }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;

  // Estimated delivery day calculation based on district
  const getDeliveryEstimate = (district: string) => {
    if (['Colombo', 'Gampaha', 'Kalutara'].includes(district)) {
      return '1 - 2 Business Days (Express Courier)';
    }
    return '2 - 4 Business Days (Islandwide Outstation)';
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setReviews(prev => [
      {
        id: `r-${Date.now()}`,
        name: 'You (Verified Buyer)',
        rating: newRating,
        date: new Date().toISOString().split('T')[0],
        comment: newComment,
        verified: true
      },
      ...prev
    ]);
    setNewComment('');
    addToast('success', 'Review Submitted', 'Thank you for rating this product!');
  };

  const handleSendMessageToSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setShowChatModal(false);
    setChatMessage('');
    addToast('success', 'Message Sent', `Your query has been sent to ${vendor?.name || 'Seller'}.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 relative flex flex-col max-h-[92vh]">
        {/* Header Close Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🇱🇰</span>
            <span className="text-sm font-bold text-slate-200">Item Catalog Details</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-amber-400 font-mono">SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative">
                <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
                {product.discountPercent && (
                  <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === img ? 'border-amber-500 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Variant Selection Column */}
            <div className="space-y-5">
              <div>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-xs mt-2">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({reviews.length} Customer Reviews)</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 inline" />
                    <span>In Stock ({product.stock} units)</span>
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-baseline space-x-3">
                <span className="text-3xl font-black font-mono text-slate-900">
                  {formatLKR(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-base font-mono line-through text-slate-400">
                    {formatLKR(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatLKR(product.originalPrice! - currentPrice)}
                  </span>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Option / Variant:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                          selectedVariant?.id === v.id
                            ? 'border-amber-500 bg-amber-500/10 text-amber-900 font-bold shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {v.name} ({formatLKR(v.price)})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <label className="text-xs font-bold text-slate-700 uppercase">Quantity:</label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="px-4 font-mono font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add {quantity} to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition shadow ${
                    isWishlisted ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Estimated Delivery Timeline by District */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 flex items-center space-x-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>Courier Delivery Estimator</span>
                  </span>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-white border border-indigo-200 text-indigo-900 font-bold px-2 py-1 rounded-lg text-xs outline-none"
                  >
                    {SRI_LANKAN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d} District</option>
                    ))}
                  </select>
                </div>
                <p className="text-indigo-900">
                  Estimated Arrival in <span className="font-bold">{selectedDistrict}</span>: <span className="font-bold text-amber-700">{getDeliveryEstimate(selectedDistrict)}</span>
                </p>
                <p className="text-[11px] text-indigo-600">Standard Seller Delivery Fee: {formatLKR(product.shippingFee)}</p>
              </div>

              {/* "Sold by [Shop Name]" Card */}
              {vendor && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={vendor.logo} alt="" className="w-10 h-10 object-cover rounded-xl border border-amber-300" />
                      <div>
                        <div className="flex items-center space-x-1 font-bold text-slate-900">
                          <Store className="w-4 h-4 text-amber-600" />
                          <span>Sold by {vendor.name}</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-[11px] text-slate-500">Located in {vendor.district}, Sri Lanka</span>
                      </div>
                    </div>

                    {onSelectVendorShop && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectVendorShop(vendor.name);
                        }}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition shadow-sm"
                      >
                        Visit Shop
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-white p-2.5 rounded-xl border border-amber-200/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Rating</span>
                      <span className="font-bold text-slate-900">{vendor.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Response Rate</span>
                      <span className="font-bold text-emerald-600">98% (Quick)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fulfillment</span>
                      <span className="font-bold text-indigo-600">Self-Shipping</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowChatModal(true)}
                    className="w-full py-2 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chat with Seller</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-200 pt-6 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Product Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Customer Ratings & Reviews</h3>

            {/* Review Form */}
            <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-xs text-slate-800 block">Write a Verified Buyer Review</span>
              
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-600 font-medium">Your Rating:</span>
                <div className="flex space-x-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Share your experience with quality, courier delivery time, and seller service..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Submit Review
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{r.name}</span>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 text-xs">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current inline" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-snug">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat with Seller Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Message {vendor?.name}</h3>
              <button onClick={() => setShowChatModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <textarea
              rows={4}
              placeholder={`Ask ${vendor?.name} about delivery times, custom bulk quantities, or product inquiries...`}
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleSendMessageToSeller}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow hover:bg-amber-600 transition"
            >
              Send Direct Inquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsModal;
