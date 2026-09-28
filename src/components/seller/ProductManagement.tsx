import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product, ProductVariant } from '../../types';
import { 
  Plus, Edit, Trash2, Package, AlertTriangle, Search, X
} from 'lucide-react';
import { formatLKR } from '../../utils/formatters';

export const ProductManagement: React.FC = () => {
  const { activeSellerVendorId, products, addProduct, updateProduct, deleteProduct, vendors } = useStore();
  const currentVendor = vendors.find(v => v.id === activeSellerVendorId);

  const vendorProducts = products.filter(p => p.vendorId === activeSellerVendorId);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ceylon Tea & Spices');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imagesText, setImagesText] = useState('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80');
  const [basePrice, setBasePrice] = useState(2500);
  const [originalPrice, setOriginalPrice] = useState(2950);
  const [stock, setStock] = useState(45);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [shippingFee, setShippingFee] = useState(350);

  // Variant helper
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState(2500);
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);

  const filteredProducts = vendorProducts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Ceylon Tea & Spices');
    setDescription('');
    setImagesText('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80');
    setBasePrice(2500);
    setOriginalPrice(2950);
    setStock(45);
    setLowStockThreshold(10);
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setShippingFee(350);
    setVariantsList([]);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setSubCategory(p.subCategory || '');
    setDescription(p.description);
    setImagesText(p.images.join('\n'));
    setBasePrice(p.basePrice);
    setOriginalPrice(p.originalPrice || p.basePrice);
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold);
    setSku(p.sku);
    setShippingFee(p.shippingFee);
    setVariantsList(p.variants || []);
    setShowModal(true);
  };

  const handleAddVariant = () => {
    if (!variantName.trim()) return;
    const newVar: ProductVariant = {
      id: `v-${Date.now()}`,
      name: variantName,
      price: Number(variantPrice),
      stock: 20,
      sku: `${sku}-${variantsList.length + 1}`
    };
    setVariantsList(prev => [...prev, newVar]);
    setVariantName('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariantsList(prev => prev.filter(v => v.id !== id));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const imageArray = imagesText.split('\n').map(s => s.trim()).filter(Boolean);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const discountPercent = originalPrice > basePrice 
      ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
      : undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        slug,
        category,
        subCategory,
        description,
        images: imageArray,
        basePrice: Number(basePrice),
        originalPrice: Number(originalPrice),
        discountPercent,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        sku,
        variants: variantsList,
        shippingFee: Number(shippingFee)
      });
    } else {
      addProduct({
        vendorId: activeSellerVendorId,
        title,
        slug,
        category,
        subCategory,
        description,
        images: imageArray,
        basePrice: Number(basePrice),
        originalPrice: Number(originalPrice),
        discountPercent,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        sku,
        variants: variantsList,
        shippingFee: Number(shippingFee),
        pickupAvailable: true
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Product Inventory ({vendorProducts.length} Items)</span>
          </h2>
          <p className="text-xs text-slate-500">Manage shop items, LKR pricing, variants, and stock alerts for {currentVendor?.name}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-100 border border-slate-300 text-slate-900 px-3.5 py-2 pl-9 rounded-xl text-xs font-medium outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
              <th className="p-4">Item & SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Base Price (LKR)</th>
              <th className="p-4 text-center">Stock Level</th>
              <th className="p-4 text-center">Variants</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                  No products found. Click "Add New Product" to start listing items.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                const isLowStock = p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <span className="font-mono text-[10px] text-slate-400">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      {formatLKR(p.basePrice)}
                      {p.originalPrice && p.originalPrice > p.basePrice && (
                        <span className="block text-[10px] line-through text-slate-400 font-normal">
                          {formatLKR(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isLowStock ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} Units
                        </span>
                        {isLowStock && (
                          <span className="text-[9px] text-rose-600 font-bold flex items-center space-x-0.5 mt-0.5">
                            <AlertTriangle className="w-3 h-3 inline" />
                            <span>Low Stock!</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono text-slate-600">
                      {p.variants ? p.variants.length : 0} Option(s)
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Shop Catalog'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-semibold"
                  >
                    <option value="Ceylon Tea & Spices">Ceylon Tea & Spices</option>
                    <option value="Electronics & Tech">Electronics & Tech</option>
                    <option value="Fashion & Batik">Fashion & Batik</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Automotive & Hardware">Automotive & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Reference *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LKR Selling Price *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={e => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold text-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (For Discount Badge)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inventory Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Low Stock Warning Threshold *</label>
                  <input
                    type="number"
                    required
                    value={lowStockThreshold}
                    onChange={e => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Image URLs (One per line) *</label>
                  <textarea
                    rows={2}
                    required
                    value={imagesText}
                    onChange={e => setImagesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Item Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Variants Builder */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">Product Options / Variants (Size, Color, Weight)</span>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g., 500g Tin or Royal Blue"
                    value={variantName}
                    onChange={e => setVariantName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price LKR"
                    value={variantPrice}
                    onChange={e => setVariantPrice(Number(e.target.value))}
                    className="w-28 px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Add Option
                  </button>
                </div>

                {variantsList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {variantsList.map(v => (
                      <span key={v.id} className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg flex items-center space-x-2">
                        <span>{v.name} - {formatLKR(v.price)}</span>
                        <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-rose-500 hover:text-rose-700">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow"
                >
                  Save Product Catalog Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
