import nodemailer from "nodemailer";

// Configure your email service here
// Option 1: Gmail with App Password
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// Option 2: Custom SMTP server
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateGuestOrderEmailHTML = (order) => {
  const itemsHTML = order.orderItems
    ?.map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        Size: ${item.size} | Quantity: ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        KSh ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Montserrat', sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .header h1 { font-size: 32px; margin: 0; font-weight: 300; }
        .order-number { font-size: 14px; color: #666; margin-top: 10px; }
        .section { margin-bottom: 25px; }
        .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 10px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table td { padding: 12px 8px; }
        .summary { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .summary-row.total { font-size: 18px; font-weight: bold; color: #191A23; }
        .button { background-color: #191A23; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! ♡</h1>
          <div class="order-number">Order #${order.orderId}</div>
        </div>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Hi ${order.guestName},<br><br>
          Thank you for your order! We're excited to get your items to you soon.
        </p>

        <div class="section">
          <h2>Order Details</h2>
          <table class="items-table">
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>KSh ${order.itemsPrice?.toLocaleString()}</span>
            </div>
            ${
              order.shippingPrice > 0
                ? `
            <div class="summary-row">
              <span>Shipping:</span>
              <span>KSh ${order.shippingPrice?.toLocaleString()}</span>
            </div>
            `
                : ""
            }
            <div class="summary-row total">
              <span>Total:</span>
              <span>KSh ${order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Delivery Address</h2>
          <p>
            ${order.shippingAddress?.address}<br>
            ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}<br>
            ${order.shippingAddress?.country}
          </p>
          <p style="margin-top: 10px; color: #666; font-size: 14px;">
            Phone: ${order.guestPhone}
          </p>
        </div>

        <div class="section">
          <h2>What's Next?</h2>
          <ul style="color: #666; line-height: 1.8;">
            <li>✓ We'll prepare your order for shipment</li>
            <li>✓ You'll receive an email with tracking information</li>
            <li>✓ Estimated delivery: 2-5 business days</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; margin-bottom: 15px;">
            Have questions? Contact us at support@guntinoglam.com
          </p>
        </div>

        <div class="footer">
          <p>Guntino Glam © ${new Date().getFullYear()}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send order confirmation email to guest
 * @param {Object} order - Order document from MongoDB
 * @returns {Promise}
 */
export const sendGuestOrderConfirmationEmail = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@guntinoglam.com",
      to: order.guestEmail,
      subject: `Order Confirmed - #${order.orderId} · Guntino Glam`,
      html: generateGuestOrderEmailHTML(order),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation email to logged-in user
 * @param {Object} order - Order document from MongoDB
 * @param {string} userEmail - User email address
 * @returns {Promise}
 */
export const sendUserOrderConfirmationEmail = async (order, userEmail) => {
  try {
    // Similar to guest email but with user-specific content
    const itemsHTML = order.orderItems
      ?.map(
        (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          Size: ${item.size} | Quantity: ${item.quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          KSh ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `,
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Montserrat', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .header h1 { font-size: 32px; margin: 0; font-weight: 300; }
          .section { margin-bottom: 25px; }
          .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 10px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table td { padding: 12px 8px; }
          .summary { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
          .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .summary-row.total { font-size: 18px; font-weight: bold; color: #191A23; }
          .button { background-color: #191A23; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed! ♡</h1>
            <div style="font-size: 14px; color: #666; margin-top: 10px;">Order #${order._id}</div>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Hi ${order.user?.name || "there"},<br><br>
            Thank you for your order! You can track it from your account.
          </p>

          <div class="section">
            <h2>Order Items</h2>
            <table class="items-table">
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>KSh ${order.itemsPrice?.toLocaleString()}</span>
              </div>
              ${
                order.shippingPrice > 0
                  ? `
              <div class="summary-row">
                <span>Shipping:</span>
                <span>KSh ${order.shippingPrice?.toLocaleString()}</span>
              </div>
              `
                  : ""
              }
              <div class="summary-row total">
                <span>Total:</span>
                <span>KSh ${order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Delivery Address</h2>
            <p>
              ${order.shippingAddress?.address}<br>
              ${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}<br>
              ${order.shippingAddress?.country}
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/orders" class="button">View Order Status</a>
          </div>

          <div class="footer">
            <p>Guntino Glam © ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@guntinoglam.com",
      to: userEmail,
      subject: `Order Confirmed - Guntino Glam`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("User confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send user confirmation email:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendGuestOrderConfirmationEmail,
  sendUserOrderConfirmationEmail,
};
