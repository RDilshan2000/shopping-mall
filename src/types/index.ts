export type UserRole = 'buyer' | 'seller' | 'admin';

export type SriLankanDistrict = 
  | 'Colombo' | 'Gampaha' | 'Kalutara' 
  | 'Kandy' | 'Matale' | 'Nuwara Eliya' 
  | 'Galle' | 'Matara' | 'Hambantota' 
  | 'Jaffna' | 'Kilinochchi' | 'Mannar' | 'Vavuniya' | 'Mullaitivu' 
  | 'Batticaloa' | 'Ampara' | 'Trincomalee' 
  | 'Kurunegala' | 'Puttalam' 
  | 'Anuradhapura' | 'Polonnaruwa' 
  | 'Badulla' | 'Moneragala' 
  | 'Ratnapura' | 'Kegalle';

export interface BankAccountDetails {
  bankName: string; // e.g. Commercial Bank of Ceylon
  branchName: string; // e.g. Kollupitiya / Branch Code 012
  accountNumber: string;
  accountName: string;
  nicNumber: string;
}

export type VendorStatus = 'pending' | 'approved' | 'suspended';

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  ownerName: string;
  email: string;
  phone: string;
  district: SriLankanDistrict;
  city: string;
  pickupAddress: string;
  bankAccount: BankAccountDetails;
  status: VendorStatus;
  customCommissionRate?: number; // Override default if present (e.g. 7.5%)
  rating: number;
  reviewCount: number;
  joinedDate: string;
  allowCod: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size: M, Color: Black" or "500g"
  price: number; // LKR
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  category: string;
  subCategory?: string;
  description: string;
  images: string[];
  basePrice: number; // LKR
  originalPrice?: number; // LKR (for discount badge)
  discountPercent?: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  shippingFee: number; // LKR
  pickupAvailable: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  vendorId: string;
}

export type OrderStatus = 'pending' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'payhere' | 'webxpay' | 'cod';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface TrackingEvent {
  timestamp: string;
  location: string;
  statusText: string;
  description: string;
}

export interface CourierDetails {
  courierName: string; // e.g., Domex, Pronto, Koombiyo, PromptX, Citypak
  waybillNumber: string; // e.g. DMX-9982410
  dispatchDate?: string;
  estimatedDelivery?: string;
  trackingHistory: TrackingEvent[];
}

export interface VendorSubOrder {
  id: string; // e.g., VORD-1001-A
  parentOrderId: string;
  vendorId: string;
  vendorName: string;
  items: {
    productId: string;
    productTitle: string;
    productImage: string;
    variantName?: string;
    quantity: number;
    unitPrice: number; // LKR
    subtotal: number; // LKR
  }[];
  itemsTotal: number; // LKR
  shippingFee: number; // LKR
  grossTotal: number; // LKR
  platformCommissionRate: number; // e.g. 8%
  platformCommissionAmount: number; // LKR
  gatewayFeeAmount: number; // LKR
  netSellerEarnings: number; // LKR
  status: OrderStatus;
  courierDetails?: CourierDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  district: SriLankanDistrict;
  city: string;
  postalCode: string;
}

export interface ParentOrder {
  id: string; // e.g., ORD-LK-2026-94821
  customerId: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentGatewayTxnId?: string; // e.g. PAYHERE-8841920
  payhereMd5Sig?: string; // Verified MD5 signature string
  subOrders: VendorSubOrder[];
  grandTotal: number; // LKR
  createdAt: string;
}

export type PayoutStatus = 'pending_approval' | 'transferred' | 'rejected';

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  requestedAmount: number; // LKR
  bankAccount: BankAccountDetails;
  status: PayoutStatus;
  bankRefNumber?: string; // e.g., CEFT-9948201
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface CategoryCommission {
  categoryName: string;
  commissionRate: number; // e.g. 8 = 8%
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  gateway: 'PayHere' | 'WebXpay';
  merchantId: string;
  orderId: string;
  amount: number;
  currency: string;
  statusCode: number;
  md5sig: string;
  md5Valid: boolean;
  rawPayload: Record<string, any>;
}
