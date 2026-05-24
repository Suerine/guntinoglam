# Guest Checkout - Configuration & Setup Checklist

## ✅ Implementation Complete

All code components for guest checkout have been implemented and integrated:

### Backend

- ✅ Order model updated with guest fields (isGuest, guestEmail, guestName, guestPhone, orderId)
- ✅ Guest order controller functions (createGuestOrder, getGuestOrderById, getGuestOrdersByEmail, updateGuestPaymentStatus)
- ✅ Guest API routes registered (/api/orders/guest, /api/orders/guest/:orderId, etc.)
- ✅ Email service created and integrated (sendGuestOrderConfirmationEmail)

### Frontend

- ✅ GuestCheckoutForm component created
- ✅ GuestOrderConfirmation component created
- ✅ Checkout.jsx updated with guest flow support
- ✅ Cart.jsx updated to allow guest checkout
- ✅ AppRoutes.jsx updated with guest confirmation route and Checkout route unprotected

### Features

- ✅ Guest checkout without account creation
- ✅ Unique orderId generation (GG-timestamp-random format)
- ✅ Stock management for guest orders
- ✅ Order confirmation email setup
- ✅ Guest order retrieval by orderId
- ✅ Paystack payment integration for guests
- ✅ Receipt download functionality
- ✅ Backward compatibility (existing user checkout unchanged)

---

## ⚠️ Configuration Required

### 1. Email Service Setup (HIGH PRIORITY)

#### Option A: Gmail + App Password (Easiest)

```env
# .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@guntinoglam.com
```

**Steps:**

1. Go to https://myaccount.google.com/app-passwords
2. Select "Mail" and "Windows Computer" (or your device)
3. Generate app-specific password (16 characters)
4. Copy to EMAIL_PASSWORD in .env
5. Make sure "Less secure app access" is disabled in Google Account

#### Option B: Custom SMTP Server (SendGrid, Mailgun, etc.)

```env
# .env file
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@guntinoglam.com
```

#### Option C: Nodemailer OAuth2 (Gmail - More Secure)

Requires additional setup with OAuth2 credentials. See `backend/utils/emailService.js` comments.

**Required Actions:**

- [ ] Choose email service (Gmail, SendGrid, custom SMTP)
- [ ] Add credentials to backend `.env` file
- [ ] Install required packages: `npm install nodemailer` (if not already installed)
- [ ] Test email sending in development
- [ ] Verify emails reach inbox (check spam folder)

### 2. Frontend URL Configuration

```env
# .env file
FRONTEND_URL=https://guntinoglam.com
```

This is used in user order confirmation email (link to order status page).

### 3. Environment Variables Checklist

Add these to your backend `.env` file:

```env
# Email Configuration (choose ONE option)
# Option A: Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password-here

# Option B: Custom SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Required for both
EMAIL_FROM=noreply@guntinoglam.com
FRONTEND_URL=https://guntinoglam.com

# Existing variables (verify still present)
MONGODB_URI=...
CLOUDINARY_...=...
PAYSTACK_SECRET_KEY=...
MPESA_...=...
```

---

## 🧪 Testing Checklist

### Before Deployment

- [ ] Install dependencies: `npm install nodemailer` (backend)
- [ ] Add email credentials to `.env`
- [ ] Test guest checkout flow locally
- [ ] Verify order created in database with `isGuest: true`
- [ ] Verify confirmation email received
- [ ] Test order retrieval by orderId
- [ ] Test guest order confirmation page loads correctly
- [ ] Verify stock reduced after guest order
- [ ] Check that user checkout still works (backward compatibility)

### Test Data

```javascript
// Test guest checkout with these values
{
  items: [
    {
      productId: "product_id_here",
      name: "Product Name",
      size: "M",
      quantity: 1,
      price: 50000 // in cents/kobo
    }
  ],
  guestEmail: "test@example.com",
  guestName: "Test Guest",
  guestPhone: "+254712345678",
  shippingAddress: {
    address: "123 Main St",
    city: "Nairobi",
    postalCode: "00100",
    country: "Kenya"
  },
  paymentReference: "test-reference-123",
  itemsPrice: 50000,
  shippingPrice: 0,
  totalPrice: 50000
}
```

---

## 📋 Deployment Steps

### 1. Backend Deployment

```bash
# Local testing
npm install nodemailer # if needed
# Add .env variables
# Test guest checkout locally
git add .
git commit -m "feat: add guest checkout support with email confirmation"
git push

# On production server
npm install # installs nodemailer
# Add production .env variables
npm restart # or pm2 restart
```

### 2. Frontend Deployment

```bash
# Already code-complete, just deploy
npm run build
# Deploy to Vercel or hosting service
```

### 3. Verification After Deployment

- [ ] Guest can checkout without login
- [ ] Confirmation email arrives
- [ ] Order visible in database
- [ ] Guest order confirmation page works
- [ ] User checkout still works

---

## 🚀 Post-Deployment Monitoring

### Watch For

1. **Email Delivery Issues**
   - Check backend logs for email errors
   - Monitor spam folder
   - Verify sender reputation

2. **Stock Issues**
   - Verify stock reduced correctly
   - Check for overselling
   - Monitor stock sync between checkout and order creation

3. **Order Issues**
   - Monitor failed guest orders
   - Track payment reference mismatches
   - Check for duplicate orders

### Logging

Add to backend after email sending:

```javascript
console.log(`Order ${order.orderId} created for ${order.guestEmail}`);
console.log(`Confirmation email sent to ${order.guestEmail}`);
```

---

## 🔧 Troubleshooting

### "Email not sending"

1. Check `.env` has correct credentials
2. Verify SMTP settings in `backend/utils/emailService.js`
3. Check backend logs for error messages
4. Test credentials with simple nodemailer script
5. Check Gmail/SMTP provider for security blocks

### "Guest redirect to login instead of checkout"

1. Verify `Checkout` route in `AppRoutes.jsx` has NO `<ProtectedRoute>`
2. Reload frontend
3. Check browser console for errors

### "Order not created"

1. Check all required fields in request body
2. Verify stock available for items
3. Check backend logs for validation errors
4. Verify `/api/orders/guest` endpoint is registered

### "Order not found by orderId"

1. Verify orderId format: `GG-timestamp-random`
2. Check database for order with correct orderId
3. Verify orderId field is indexed in database
4. Test with known orderId from database

---

## 💡 Optional Enhancements

### 1. SMS Notifications

Send SMS to guest phone number after order creation:

```javascript
// backend/utils/smsService.js
import twilio from "twilio";

export const sendGuestOrderSMS = async (phone, orderId) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  await client.messages.create({
    body: `Your order #${orderId} confirmed. Track at: guntinoglam.com/guest-order/${orderId}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};
```

### 2. Guest Account Creation Prompt

After successful payment, show modal:

```
"Create an account to track orders and manage returns"
[Create Account] [Continue as Guest]
```

### 3. Order Lookup Page

Public page to look up orders by email + orderId:

```
URL: /find-order
Form: email, orderId
Shows: Order status, items, tracking (if available)
```

### 4. Webhook Verification

Add Paystack webhook verification:

```javascript
// backend/routes/webhookRoutes.js
POST /api/webhooks/paystack
- Verify webhook signature
- Update order payment status
- Send SMS/email update
```

### 5. Guest Coupon Support

Add discount code application to guest checkout:

```javascript
// Add to GuestCheckoutForm
<input type="text" placeholder="Promo code" />
Apply discount before payment
```

---

## 📞 Support Resources

### Documentation

- [Guest Checkout Guide](./GUEST_CHECKOUT_GUIDE.md) - Complete implementation guide
- [Email Service Setup](./backend/utils/emailService.js) - Email configuration
- [Order Model](./backend/models/Order.js) - Database schema

### Key Files

- Frontend: `frontend/src/pages/Shop/Checkout.jsx`, `GuestCheckoutForm.jsx`, `GuestOrderConfirmation.jsx`
- Backend: `backend/controllers/orderController.js`, `backend/routes/orderRoutes.js`, `backend/utils/emailService.js`
- Routes: `frontend/src/routes/AppRoutes.jsx`

### External Resources

- Nodemailer Docs: https://nodemailer.com/
- SendGrid Docs: https://docs.sendgrid.com/
- Paystack Docs: https://paystack.com/docs/

---

## Summary

**Status:** ✅ Code Implementation Complete | ⚠️ Configuration Required | 🚀 Ready for Testing

**Next Immediate Action:**

1. Add email credentials to backend `.env`
2. Test email service with simple script
3. Run guest checkout flow locally
4. Deploy when ready

**Estimated Setup Time:** 30-60 minutes (mostly email configuration)

**Expected Outcome:**

- Guests can complete purchases without account creation
- Confirmation emails sent automatically
- Full order history by orderId
- Seamless integration with existing user checkout
