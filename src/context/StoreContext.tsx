import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, Vendor, Product, ParentOrder, CartItem, PayoutRequest, 
  CategoryCommission, WebhookLog, OrderStatus, ProductVariant,
  CourierDetails
} from '../types';
import { 
  INITIAL_VENDORS, INITIAL_PRODUCTS, INITIAL_ORDERS, 
  INITIAL_PAYOUT_REQUESTS, CATEGORY_COMMISSIONS 
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface StoreContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeSellerVendorId: string;
  setActiveSellerVendorId: (id: string) => void;
  
  // Data
  vendors: Vendor[];
  products: Product[];
  orders: ParentOrder[];
  cart: CartItem[];
  wishlist: string[];
  payoutRequests: PayoutRequest[];
  categoryCommissions: CategoryCommission[];
  webhookLogs: WebhookLog[];
  
  // Customer Filters & Actions
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (
    shippingAddress: any,
    paymentMethod: 'payhere' | 'webxpay' | 'cod',
    paymentTxnId?: string,
    md5sig?: string
  ) => ParentOrder;
  
  // Seller Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSubOrderStatus: (subOrderId: string, status: OrderStatus) => void;
  dispatchSubOrder: (subOrderId: string, courierName: string, waybillNumber: string, notes?: string) => void;
  requestBankPayout: (vendorId: string, amount: number) => void;
  registerVendorShop: (shopData: Omit<Vendor, 'id' | 'status' | 'rating' | 'reviewCount' | 'joinedDate'>) => void;
  
  // Admin Actions
  approveVendor: (vendorId: string) => void;
  suspendVendor: (vendorId: string) => void;
  processPayoutRequest: (requestId: string, bankRef: string, notes?: string) => void;
  updateCategoryCommission: (categoryName: string, rate: number) => void;
  delistProduct: (productId: string) => void;
  addWebhookLog: (log: Omit<WebhookLog, 'id' | 'timestamp'>) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('buyer');
  const [activeSellerVendorId, setActiveSellerVendorId] = useState<string>('v-101');
  
  // Persistent state initialized with mockData
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [orders, setOrders] = useState<ParentOrder[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_REQUESTS;
  });
  
  const [categoryCommissions, setCategoryCommissions] = useState<CategoryCommission[]>(() => {
    const saved = localStorage.getItem('sri_ecommerce_commissions');
    return saved ? JSON.parse(saved) : CATEGORY_COMMISSIONS;
  });
  
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sri_ecommerce_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_payouts', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  useEffect(() => {
    localStorage.setItem('sri_ecommerce_commissions', JSON.stringify(categoryCommissions));
  }, [categoryCommissions]);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Actions
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        ((!variant && !item.selectedVariant) || item.selectedVariant?.id === variant?.id)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          selectedVariant: variant,
          quantity,
          vendorId: product.vendorId
        }];
      }
    });
    addToast('success', 'Added to Cart', `${product.title} (${quantity}) added to your shopping cart.`);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedVariant?.id === variantId)));
    addToast('info', 'Item Removed', 'Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedVariant?.id === variantId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'Wishlist Updated', 'Product removed from your wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        addToast('success', 'Wishlist Updated', 'Product saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  // Place Order logic (Order Splitting per Vendor)
  const placeOrder = (
    shippingAddress: any,
    paymentMethod: 'payhere' | 'webxpay' | 'cod',
    paymentTxnId?: string,
    md5sig?: string
  ): ParentOrder => {
    const parentOrderId = `ORD-LK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Group cart items by vendor
    const itemsByVendor: Record<string, CartItem[]> = {};
    cart.forEach(item => {
      if (!itemsByVendor[item.vendorId]) {
        itemsByVendor[item.vendorId] = [];
      }
      itemsByVendor[item.vendorId].push(item);
    });

    let parentGrandTotal = 0;
    const subOrders = Object.entries(itemsByVendor).map(([vendorId, vItems], index) => {
      const vendor = vendors.find(v => v.id === vendorId);
      const vendorName = vendor ? vendor.name : 'Vendor Shop';
      
      const subOrderItems = vItems.map(item => {
        const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.product.basePrice;
        return {
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.images[0] || '',
          variantName: item.selectedVariant?.name,
          quantity: item.quantity,
          unitPrice,
          subtotal: unitPrice * item.quantity,
        };
      });

      const itemsTotal = subOrderItems.reduce((acc, i) => acc + i.subtotal, 0);
      const shippingFee = vItems[0].product.shippingFee || 350;
      const grossTotal = itemsTotal + shippingFee;
      
      // Calculate Commission
      let commRate = vendor?.customCommissionRate;
      if (!commRate) {
        const firstCategory = vItems[0].product.category;
        const catComm = categoryCommissions.find(c => c.categoryName === firstCategory);
        commRate = catComm ? catComm.commissionRate : 8.0;
      }

      const platformCommissionAmount = (itemsTotal * commRate) / 100;
      const gatewayFeeAmount = paymentMethod === 'cod' ? 0 : (grossTotal * 0.025 + 30); // 2.5% + 30 LKR
      const netSellerEarnings = grossTotal - platformCommissionAmount - gatewayFeeAmount;

      parentGrandTotal += grossTotal;

      return {
        id: `VORD-${parentOrderId.split('-')[3]}-${index + 1}`,
        parentOrderId,
        vendorId,
        vendorName,
        items: subOrderItems,
        itemsTotal,
        shippingFee,
        grossTotal,
        platformCommissionRate: commRate,
        platformCommissionAmount,
        gatewayFeeAmount,
        netSellerEarnings,
        status: 'pending' as OrderStatus,
        createdAt: now,
        updatedAt: now,
      };
    });

    const newOrder: ParentOrder = {
      id: parentOrderId,
      customerId: 'cust-current',
      customerName: shippingAddress.fullName,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      paymentGatewayTxnId: paymentTxnId || (paymentMethod !== 'cod' ? `PYH-${Math.floor(1000000 + Math.random() * 9000000)}` : undefined),
      payhereMd5Sig: md5sig,
      subOrders,
      grandTotal: parentGrandTotal,
      createdAt: now,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Deduct Stock
    setProducts(prevProds => {
      return prevProds.map(prod => {
        const cartMatch = cart.find(c => c.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stock - cartMatch.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
    });

    addToast('success', 'Order Placed Successfully!', `Order #${parentOrderId} has been confirmed.`);
    return newOrder;
  };

  // Seller Product Actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast('success', 'Product Added', `${productData.title} is now in your catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast('info', 'Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('warning', 'Product Removed', 'Product deleted from shop.');
  };

  // Sub Order Status & Courier Dispatch
  const updateSubOrderStatus = (subOrderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      const hasSub = order.subOrders.some(so => so.id === subOrderId);
      if (!hasSub) return order;
      
      const updatedSubs = order.subOrders.map(so => {
        if (so.id === subOrderId) {
          return { ...so, status, updatedAt: new Date().toISOString().substring(0, 16).replace('T', ' ') };
        }
        return so;
      });
      return { ...order, subOrders: updatedSubs };
    }));
    addToast('info', 'Sub-order Updated', `Status changed to ${status.toUpperCase()}`);
  };

  const dispatchSubOrder = (
    subOrderId: string, 
    courierName: string, 
    waybillNumber: string, 
    notes?: string
  ) => {
    const now = new Date().toISOString().substring(0, 16).replace('T', ' ');
    const initialTracking: CourierDetails = {
      courierName,
      waybillNumber,
      dispatchDate: now.split(' ')[0],
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      trackingHistory: [
        {
          timestamp: now,
          location: 'Seller Facility',
          statusText: 'Dispatched / In-Transit',
          description: `Handed over to ${courierName}. Tracking #${waybillNumber}. ${notes || ''}`
        }
      ]
    };

    setOrders(prev => prev.map(order => {
      const hasSub = order.subOrders.some(so => so.id === subOrderId);
      if (!hasSub) return order;

      const updatedSubs = order.subOrders.map(so => {
        if (so.id === subOrderId) {
          return {
            ...so,
            status: 'dispatched' as OrderStatus,
            courierDetails: initialTracking,
            updatedAt: now
          };
        }
        return so;
      });
      return { ...order, subOrders: updatedSubs };
    }));
    addToast('success', 'Order Dispatched!', `Courier details added for ${waybillNumber}`);
  };

  // Seller Payout Request
  const requestBankPayout = (vendorId: string, amount: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const newReq: PayoutRequest = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId,
      vendorName: vendor.name,
      requestedAmount: amount,
      bankAccount: vendor.bankAccount,
      status: 'pending_approval',
      requestedAt: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };

    setPayoutRequests(prev => [newReq, ...prev]);
    addToast('success', 'Payout Requested', `Request for LKR ${amount.toLocaleString()} submitted to Super Admin.`);
  };

  // Onboarding Register Vendor
  const registerVendorShop = (shopData: Omit<Vendor, 'id' | 'status' | 'rating' | 'reviewCount' | 'joinedDate'>) => {
    const newVendor: Vendor = {
      ...shopData,
      id: `v-${Date.now()}`,
      status: 'pending',
      rating: 0,
      reviewCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setVendors(prev => [...prev, newVendor]);
    setActiveSellerVendorId(newVendor.id);
    addToast('info', 'Shop Submitted for Verification', 'Your shop details are pending Super Admin approval.');
  };

  // Admin Actions
  const approveVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'approved' } : v));
    addToast('success', 'Vendor Verified', 'Vendor shop has been approved and activated.');
  };

  const suspendVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'suspended' } : v));
    addToast('warning', 'Vendor Suspended', 'Vendor shop access suspended.');
  };

  const processPayoutRequest = (requestId: string, bankRef: string, notes?: string) => {
    setPayoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'transferred',
          bankRefNumber: bankRef,
          processedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
          adminNotes: notes
        };
      }
      return req;
    }));
    addToast('success', 'Bank Transfer Completed', `Payout ${requestId} marked as transferred with Ref #${bankRef}`);
  };

  const updateCategoryCommission = (categoryName: string, rate: number) => {
    setCategoryCommissions(prev => {
      const idx = prev.findIndex(c => c.categoryName === categoryName);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].commissionRate = rate;
        return updated;
      } else {
        return [...prev, { categoryName, commissionRate: rate }];
      }
    });
    addToast('info', 'Commission Updated', `Commission rate for ${categoryName} set to ${rate}%`);
  };

  const delistProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast('warning', 'Product Delisted', 'Infringing product removed by Super Admin.');
  };

  const addWebhookLog = (log: Omit<WebhookLog, 'id' | 'timestamp'>) => {
    const newLog: WebhookLog = {
      ...log,
      id: `wh-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setWebhookLogs(prev => [newLog, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      role, setRole,
      activeSellerVendorId, setActiveSellerVendorId,
      vendors, products, orders, cart, wishlist, payoutRequests,
      categoryCommissions, webhookLogs,
      searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
      addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, placeOrder,
      addProduct, updateProduct, deleteProduct, updateSubOrderStatus, dispatchSubOrder,
      requestBankPayout, registerVendorShop,
      approveVendor, suspendVendor, processPayoutRequest, updateCategoryCommission,
      delistProduct, addWebhookLog,
      toasts, addToast, removeToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
