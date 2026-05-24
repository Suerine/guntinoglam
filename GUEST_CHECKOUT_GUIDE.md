# Guest Checkout Implementation Guide

## Overview

This guide documents the complete guest checkout flow implemented for your Guntino Glam e-commerce app. Guests can now purchase without creating an account, collecting essential information at checkout and confirming via Paystack payment.

---

## Architecture

### 1. **Frontend Components**

#### GuestCheckoutForm.jsx

- **Path:** `frontend/src/components/ui/GuestCheckoutForm.jsx`
- **Purpose:** Displays a two-step form for guest information and delivery address
- **State Managed:**
  - `fullName`, `email`, `phone` (guest information)
  - `address`, `city`, `county` (delivery address)
- **Features:**
  - Validates form inputs
  - Shows summary after submission
  - Edit button to return to step 1

#### Checkout.jsx (Modified)

- **Path:** `frontend/src/pages/Shop/Checkout.jsx`
- **Changes:**
  - Removed `ProtectedRoute` wrapper to allow unauthenticated access
  - Added `guestInfo` state alongside `shipping` state
  - Conditionally renders `ShippingForm` (for logged-in users) or `GuestCheckoutForm` (for guests)
  - Guest Paystack flow calls `/api/orders/guest` endpoint instead of user endpoint
  - Redirects guest users to `/guest-order-confirmation` instead of `/orders`

#### GuestOrderConfirmation.jsx (New)

- **Path:** `frontend/src/pages/Shop/GuestOrderConfirmation.jsx`
- **Purpose:** Shows order confirmation after successful guest payment
- **Features:**
  - Displays order number, guest info, delivery address, and items
  - Shows payment status and order status
  - Provides download receipt option
  - Shows next steps timeline
  - CTA buttons: Continue Shopping, Download Receipt, Return Home

#### Cart.jsx (Modified)

- **Path:** `frontend/src/pages/Shop/Cart.jsx`
- **Changes:**
  - Removed login requirement for checkout
  - Changed message from "Log in to save your cart and checkout" to "Log in to save cart or continue as guest"
  - Made checkout button available for both logged-in and guest users

---

## 2. **Backend Models & Controllers**

### Order Model (Modified)

**Path:** `backend/models/Order.js`

**New Fields:**

```javascript
isGuest: { type: Boolean, default: false }
guestEmail: { type: String, trim: true, lowercase: true }
guestName: { type: String, trim: true }
guestPhone: { type: String, trim: true }
orderId: { type: String, unique: true, sparse: true } // Format: "GG-20260524-ABC123"
```

**Changes to `paymentMethod` enum:**

- Added `"paystack"` option (was only `["mpesa", "card", "cash_on_delivery"]`)

**Changes to `user` field:**

- Made optional (`required: false`) to allow guest orders without user reference

### Order Controller (New/Modified Functions)

**Path:** `backend/controllers/orderController.js`

#### createGuestOrder()

```javascript
POST /api/orders/guest
Request body: {
  items: [{ productId, name, size, quantity, price, isRental?, ... }],
  guestEmail: "customer@example.com",
  guestName: "John Doe",
  guestPhone: "+254712345678",
  shippingAddress: { address, city, postalCode, country },
  paymentReference: "paystack_reference_xyz",
  itemsPrice: 50000,
  shippingPrice: 0,
  totalPrice: 50000
}

Response: {
  message: "Guest order created successfully",
  order: { ...orderObject },
  orderId: "GG-1234567890-ABC123"
}
```

**Features:**

- Generates unique `orderId` (format: `GG-{timestamp}-{randomStr}`)
- Validates stock availability
- Reduces product stock
- Marks order as paid immediately (Paystack handled payment)
- Sends confirmation email (optional, graceful failure)

#### getGuestOrderById()

```javascript
GET /api/orders/guest/:orderId
Response: { ...orderObject }
```

- No auth required
- Allows guests to view their order via orderId

#### getGuestOrdersByEmail()

```javascript
POST /api/orders/guest-orders/by-email
Request body: { email: "customer@example.com" }
Response: [{ ...orderObject }, ...]
```

- No auth required
- Allows guests to view all orders by email

#### updateGuestPaymentStatus()

```javascript
PATCH /api/orders/guest/:orderId/payment
Request body: { status: "completed", transactionId: "..." }
```

- No auth required
- Updates payment status for guest orders

---

## 3. **API Routes**

**Path:** `backend/routes/orderRoutes.js`

**New Routes Added:**

```javascript
// Guest checkout
POST /api/orders/guest → createGuestOrder (no auth)

// Guest order retrieval
GET /api/orders/guest/:orderId → getGuestOrderById (no auth)
POST /api/orders/guest-orders/by-email → getGuestOrdersByEmail (no auth)
PATCH /api/orders/guest/:orderId/payment → updateGuestPaymentStatus (no auth)

// Existing protected routes remain unchanged
```

---

## 4. **Email Service**

**Path:** `backend/utils/emailService.js`

### Functions

#### sendGuestOrderConfirmationEmail(order)

- Generates HTML email with order details, items, totals, and delivery address
- Uses configured email transport (Gmail, SMTP, etc.)
- Called automatically after guest order creation
- Gracefully handles email failures (doesn't block order creation)

#### sendUserOrderConfirmationEmail(order, userEmail)

- Similar to guest email but includes link to user's order tracking page
- Can be integrated into existing user order flow

### Configuration

**Environment Variables Required:**

```env
# Option 1: Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Option 2: Custom SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# General
EMAIL_FROM=noreply@guntinoglam.com
FRONTEND_URL=https://guntinoglam.com
```

---

## 5. **Frontend Routes**

**Path:** `frontend/src/routes/AppRoutes.jsx`

**Changes:**

```javascript
// Removed ProtectedRoute from Checkout
-(
  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />
) +
  <Route path="/checkout" element={<Checkout />} /> +
  (
    // Added guest confirmation route (no auth required)
    <Route
      path="/guest-order-confirmation"
      element={<GuestOrderConfirmation />}
    />
  );
```

---

## Complete Guest Checkout Flow

```
1. GUEST BROWSING
   ├─ User adds items to cart (stored in localStorage)
   └─ Proceeds to /checkout

2. CHECKOUT PAGE
   ├─ AuthContext checks if user exists
   ├─ If NOT authenticated → Show GuestCheckoutForm
   │  ├─ User enters: name, email, phone
   │  ├─ User enters: address, city, county
   │  └─ Proceeds to payment (step 2)
   └─ If authenticated → Show ShippingForm (existing flow)

3. PAYSTACK PAYMENT
   ├─ PaystackPayment component initializes
   ├─ Amount: total from cart
   ├─ Email: guest email from guestInfo
   ├─ User clicks "Pay via Paystack"
   ├─ Paystack popup appears
   └─ User completes payment

4. PAYMENT SUCCESS
   ├─ Paystack returns reference
   ├─ Frontend calls POST /api/orders/guest
   │  ├─ Backend creates order with isGuest=true
   │  ├─ Generates unique orderId
   │  ├─ Reduces product stock
   │  ├─ Sends confirmation email
   │  └─ Returns orderId
   ├─ Frontend clears guest_cart from localStorage
   └─ Redirects to /guest-order-confirmation?orderId=GG-...&email=...

5. CONFIRMATION PAGE
   ├─ Fetches order via GET /api/orders/guest/:orderId
   ├─ Displays order summary
   ├─ Shows next steps
   ├─ Provides download receipt option
   └─ Links to continue shopping or home
```

---

## Key Implementation Details

### Order ID Generation

```javascript
const timestamp = Date.now(); // 1716550000000
const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // ABC123
const orderId = `GG-${timestamp}-${randomStr}`; // GG-1716550000000-ABC123
```

- Unique across all guest orders
- Human-readable format
- Includes timestamp for sorting/debugging
- Random suffix prevents collisions

### Guest Cart Handling

- Guest items stored in **localStorage** key: `guest_cart`
- Format: `[{ id, productId, name, size, price, quantity, ... }, ...]`
- Cleared after successful order creation
- Loaded from localStorage on initial page load

### Stock Management

```javascript
for (const item of orderItems) {
  const selectedSize = product.sizes.find((s) => s.size === item.size);
  selectedSize.stock -= item.quantity;
  await product.save();
}
```

- Stock reduced **immediately** upon order creation
- Prevents overselling
- Supports multiple sizes per product

### Payment Verification

- Paystack handles payment verification client-side
- Backend trusts Paystack reference (can add webhook verification for extra security)
- Order marked as `isPaid: true` immediately upon creation

---

## Testing Checklist

### Frontend

- [ ] Guest can browse products
- [ ] Guest can add items to cart
- [ ] Guest checkout button visible on cart page
- [ ] GuestCheckoutForm displays correctly
- [ ] All form fields validate properly
- [ ] Summary shows correct information after form submission
- [ ] Edit button returns to form
- [ ] Paystack payment popup opens with guest email
- [ ] Successful payment redirects to confirmation page
- [ ] Confirmation page displays order details correctly
- [ ] Download receipt works
- [ ] Continue shopping button works

### Backend

- [ ] POST /api/orders/guest creates order successfully
- [ ] OrderId generated in correct format
- [ ] Guest order has `isGuest: true`
- [ ] Stock reduced correctly
- [ ] Email sent successfully (check logs)
- [ ] GET /api/orders/guest/:orderId returns correct order
- [ ] POST /api/orders/guest-orders/by-email returns correct orders
- [ ] Existing user checkout flow unchanged

### Email

- [ ] Confirmation email sent to guest
- [ ] Email contains order details
- [ ] Email contains delivery address
- [ ] Email contains all items and totals
- [ ] Email HTML renders correctly

---

## Future Enhancements

1. **Webhook Verification**
   - Add Paystack webhook verification for extra security
   - Verify payment server-side before marking as paid

2. **SMS Notifications**
   - Send SMS updates to guest phone number
   - Include tracking link when shipment processing

3. **Guest Account Promotion**
   - After successful order, prompt: "Create account to track orders"
   - Pre-fill email/phone in signup form

4. **Order Lookup**
   - Add public page to look up order by email + orderId
   - Show shipping status without login

5. **Guest Coupon Support**
   - Apply discount codes before checkout
   - Save coupon code to guest order

6. **Order Cancellation**
   - Allow guest to cancel within 24 hours via email link
   - Restore stock automatically

---

## Troubleshooting

### Issue: Guest order not being created

**Solution:** Check that:

- All required fields are present in request
- Stock is available for all items
- `/api/orders/guest` route is added to backend
- `createGuestOrder` function is exported from orderController

### Issue: Confirmation email not sending

**Solution:**

- Check email credentials in `.env`
- Verify SMTP settings
- Check backend logs for email errors
- Email failure won't block order creation (graceful error handling)

### Issue: Guest redirected to login instead of checkout

**Solution:**

- Verify Checkout component does NOT have `<ProtectedRoute>` wrapper
- Check AppRoutes.jsx for correct route configuration

### Issue: Order ID not unique

**Solution:**

- Verify `orderId` field is unique in Order model schema
- Check for duplicate orderId values in database

---

## File Summary

### Files Created

1. `frontend/src/components/ui/GuestCheckoutForm.jsx` - Guest form component
2. `frontend/src/pages/Shop/GuestOrderConfirmation.jsx` - Confirmation page
3. `backend/utils/emailService.js` - Email sending utility

### Files Modified

1. `frontend/src/pages/Shop/Checkout.jsx` - Added guest support
2. `frontend/src/pages/Shop/Cart.jsx` - Allow guest checkout
3. `frontend/src/routes/AppRoutes.jsx` - Added confirmation route
4. `backend/models/Order.js` - Added guest fields
5. `backend/controllers/orderController.js` - Added guest endpoints + email import
6. `backend/routes/orderRoutes.js` - Added guest routes

---

## Next Steps

1. **Setup Email Service**
   - Configure SMTP credentials in `.env`
   - Test email sending with dev environment

2. **Test Guest Checkout Flow**
   - Create test guest order
   - Verify order appears in database
   - Check confirmation email

3. **Deploy Changes**
   - Deploy backend changes first
   - Deploy frontend changes
   - Verify routes are working in production

4. **Monitor Orders**
   - Track guest order creation
   - Monitor email delivery
   - Check for stock issues

---

## Support

For issues or questions about this implementation, refer to:

- Order model: `backend/models/Order.js`
- Order controller: `backend/controllers/orderController.js`
- Email service: `backend/utils/emailService.js`
- Frontend routes: `frontend/src/routes/AppRoutes.jsx`
