# 🛍️ Shopping Mall - Sri Lankan Multi-Vendor E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A complete, production-ready, Sri Lankan localized Multi-Vendor E-Commerce web platform inspired by **Daraz** and **eBay**. Featuring three distinct user interfaces governed by Role-Based Access Control (RBAC): **Customer Storefront**, **Seller Center (Vendor Portal)**, and **Super Admin Dashboard**.

---

## 🌟 Executive Overview

**Shopping Mall** is engineered specifically for the Sri Lankan e-commerce market ecosystem. It empowers local merchants, spice growers, traditional batik artisans, tech importers, and everyday shoppers across all **25 Sri Lankan districts**. 

The platform implements a **multi-vendor order splitting architecture**, **direct self-shipping via local Sri Lankan couriers** (Domex, Pronto, Koombiyo, PromptX, Citypak), and **PayHere/WebXpay local online payment gateway integration** with MD5 signature validation and automated interbank payouts to local Sri Lankan banks (Commercial Bank, Sampath Bank, BOC, HNB, NTB, etc.).

---

## 🔑 Key Features by User Role (RBAC)

### 🛒 1. Customer Storefront (Buyer Portal)
- **Navigation & Discovery**: Multi-level category menu (*Ceylon Tea & Spices*, *Electronics & Tech*, *Fashion & Batik*, *Home & Living*, *Beauty & Wellness*, *Automotive*), live search bar with auto-suggestions, interactive hero banner carousel, and limited-time **Flash Deals** with countdown timers & stock progress bars.
- **Sri Lankan Featured Shops Grid**: Verified vendor cards highlighting store ratings, response rates, and district pickup locations.
- **Product Details Page (PDP)**:
  - Multi-image gallery with zoom preview.
  - SKU & Variant selectors (Size, Color, Pack Size e.g., 250g, 500g, 1kg).
  - *"Sold by [Shop Name]"* badge with location, joined date, and *"Chat with Seller"* direct inquiry modal.
  - Estimated delivery timeline based on selected Sri Lankan District (Colombo: 1-2 Days, Outstation: 2-4 Days).
  - Verified buyer ratings and customer review submission system.
- **Cart & Multi-Vendor Checkout**:
  - Cart items grouped neatly by Vendor / Shop.
  - Shipping fee calculations per vendor (e.g. LKR 350 per vendor courier).
  - Islandwide Shipping Address form with all 25 Sri Lankan Districts dropdown.
  - Payment Gateways:
    - **PayHere Online Payment Gateway** (Credit/Debit Card, Genie, eZ Cash, FriMi) with interactive Sandbox modal & MD5 signature check.
    - **WebXpay Gateway**.
    - **Cash on Delivery (COD)**.
- **Customer Profile & Tracking**:
  - Order history with sub-order tracking by courier.
  - Step-by-step live courier status checkpoints with waybill tracking numbers.
  - Wishlist management.

---

### 🏬 2. Seller Center / Vendor Portal (`/seller`)
- **Shop Onboarding & Verification**:
  - Merchant setup form: Shop Name, Slug, Logo, Cover Banner, Pickup Address (District & City).
  - Local Sri Lankan Bank Account Details: Bank Name (Commercial Bank, Sampath, BOC, HNB, etc.), Branch, Account Number, Account Name, NIC/Passport.
  - Account state management: `Pending Approval`, `Active Verified`, `Suspended`.
- **Product Management (CRUD)**:
  - Product table with search, inline stock status, and low-stock indicators (`stock <= lowStockThreshold`).
  - Add / Edit product modal with multi-image URLs, description, LKR pricing, variants builder, and shipping preferences.
- **Order Management & Self-Fulfillment**:
  - Dedicated sub-orders table assigned specifically to the active vendor.
  - Fulfillment lifecycle: `Pending` -> `Packed` -> `Dispatched / In-Transit` -> `Delivered`.
  - **Courier Dispatch Action**: Input Courier Company (Domex, Pronto, Koombiyo, PromptX, Citypak, PickMe Flash, DHL) + Waybill / Tracking Number.
  - **Printable Packing Slip & Customer Invoice Generator**: Formatted document with QR code, shop branding, line items in LKR, customer address, and courier tracking label.
- **Earnings & Local Bank Payouts**:
  - Wallet metrics: Gross Sales, Platform Commission Deductions (e.g. 6-10%), Payment Gateway Fees, Net Earnings, Pending Balance, and **Available Balance for Payout**.
  - Manual *"Request Withdrawal to Bank"* form and payout request history table.
- **Seller Performance**:
  - Interactive **Recharts** 30-day revenue trend chart, fulfillment rate %, and customer review score breakdown.

---

### ⚙️ 3. Super Admin Dashboard (`/admin`)
- **Executive Platform Analytics**:
  - Platform Gross Merchandise Volume (GMV) in LKR.
  - Net Platform Commission Revenue & Gateway Fees collected.
  - Total Active Verified Shops, Customers, and Orders.
  - Category GMV Revenue distribution bar chart.
- **Vendor Moderation**:
  - Review newly registered merchant shops (`Pending Approval`).
  - Approve, reject, or suspend seller accounts.
  - Override individual vendor custom commission rates.
- **Commission Settings**:
  - Configure default platform commission percentage (e.g. 8.5%).
  - Per-category commission rates table (e.g., Electronics: 8%, Spices/Tea: 6%, Fashion: 10%).
- **Bank Payout Management**:
  - Review seller withdrawal requests.
  - Mark requests as *"Transferred"* by entering interbank transaction reference numbers (e.g., `CEFT-9948201` or `SLIPS-8841029`).
- **Catalog Moderation & Buyer Disputes**:
  - Platform-wide product catalog manager to delist infringing or counterfeit items.
  - Buyer refund & dispute resolution case manager.
- **PayHere / WebXpay Webhook Inspector**:
  - Real-time log of raw HTTP POST webhook payloads, MD5 signature validation status (Valid / Invalid), and status codes.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose / Usage |
| :--- | :--- |
| **Frontend Framework** | React 19 / Next.js (App Router pattern) with Vite 6 |
| **Language** | TypeScript (Strict mode with `verbatimModuleSyntax`) |
| **Styling & CSS** | Tailwind CSS v4 with custom glassmorphism & print media stylesheets |
| **Icons** | Lucide React |
| **Data Visualization** | Recharts (AreaChart, BarChart) |
| **State Management** | Context API + Persistent LocalStorage state engine |
| **Payment Integration** | PayHere / WebXpay Sandbox Simulator & MD5 Signature Hash Generator |
| **Celebrations** | Canvas Confetti |

---

## 🇱🇰 Sri Lankan Localization Highlights

1. **LKR Currency Standard**: All prices, discounts, delivery fees, seller earnings, commission deductions, and wallet balances are rendered in Sri Lankan Rupee (`Rs. 45,990.00` / `LKR`).
2. **Local Payment Gateways**:
   - **PayHere Integration**: Implements the official PayHere MD5 signature algorithm:
     $$\text{md5sig} = \text{MD5}(\text{merchant\_id} + \text{order\_id} + \text{amountFormatted} + \text{currency} + \text{UPPERCASE}(\text{MD5}(\text{merchant\_secret})))$$
   - Supported local payment channels: Credit/Debit Cards, Genie, eZ Cash, FriMi, Koko BNPL.
   - Live Webhook POST log inspector.
3. **Islandwide District Logistics**:
   - Shipping form includes all 25 Sri Lankan Districts (*Colombo, Gampaha, Kalutara, Kandy, Matale, Nuwara Eliya, Galle, Matara, Hambantota, Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu, Batticaloa, Ampara, Trincomalee, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Badulla, Moneragala, Ratnapura, Kegalle*).
4. **Direct Seller Courier Self-Shipping**:
   - Integrated courier partners: **Domex**, **Pronto Lanka**, **Koombiyo Delivery**, **PromptX**, **Citypak**, **PickMe Flash**, **DHL Express**.
5. **Local Bank Account Payouts**:
   - Payout requests targeting Sri Lankan banks: Commercial Bank of Ceylon, Sampath Bank, Bank of Ceylon (BOC), Hatton National Bank (HNB), Nations Trust Bank (NTB), Seylan Bank, People's Bank, NSB, DFCC.

---

## 📁 Project Folder Structure

```
shopping-mall/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/                 # Super Admin Dashboard views
│   │   │   ├── BankPayoutManager.tsx
│   │   │   ├── CatalogDisputes.tsx
│   │   │   ├── CommissionSettings.tsx
│   │   │   ├── ExecutiveAnalytics.tsx
│   │   │   └── VendorModeration.tsx
│   │   ├── common/                # Shared UI Components
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── InvoiceModal.tsx
│   │   │   ├── PayHereModal.tsx
│   │   │   ├── RoleSwitcherBar.tsx
│   │   │   ├── ToastContainer.tsx
│   │   │   └── WebhookLoggerModal.tsx
│   │   ├── customer/              # Customer Storefront views
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── CustomerProfile.tsx
│   │   │   ├── FlashDeals.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductDetailsModal.tsx
│   │   │   └── TopSellersGrid.tsx
│   │   └── seller/                # Seller Center / Vendor Portal views
│   │       ├── EarningsAndPayouts.tsx
│   │       ├── OrderFulfillment.tsx
│   │       ├── ProductManagement.tsx
│   │       ├── SellerOnboarding.tsx
│   │       └── SellerPerformance.tsx
│   ├── context/
│   │   └── StoreContext.tsx       # Global reactive state & persistent storage
│   ├── data/
│   │   └── mockData.ts            # Initial seed data for vendors, products & orders
│   ├── types/
│   │   └── index.ts               # TypeScript data models & schemas
│   ├── utils/
│   │   └── formatters.ts          # LKR formatter, PayHere MD5 algorithm & district lists
│   ├── App.tsx                    # Main App with RBAC role switcher
│   ├── index.css                  # Tailwind v4 & print styles
│   └── main.tsx                   # React entry point
├── .env.example
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Step-by-Step Installation

1. **Clone or Navigate to the Repository**:
   ```bash
   cd shopping-mall
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The production bundle will be generated in the `dist/` directory.

---

## 👥 Role Switching Quick Start

You can instantly switch between user roles using the **top bar toolbar**:
- 🛒 **Customer Storefront**: Browse products, add to cart, and test checkout via PayHere Sandbox.
- 🏪 **Seller Center**: Select an active shop account (*Ceylon Tea Masters*, *ElectroLanka*, *Serendib Batik*) to manage products, enter courier waybills, and request payouts.
- 🛡️ **Super Admin**: Approve new shops, set category commission rates, and process interbank payout transfers.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
