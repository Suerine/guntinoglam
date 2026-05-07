import axios from "axios";
import Order from "../models/Order.js";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${CONSUMER_KEY}:${CONSUMER_SECRET}`,
  ).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    // Production → "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    { headers: { Authorization: `Basic ${credentials}` } },
  );
  return res.data.access_token;
};

const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
};

const getPassword = (timestamp) =>
  Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

const formatPhone = (phone) => phone.replace(/\s+/g, "").replace(/^0/, "254");

// ─── STK Push ────────────────────────────────────────────────────────────────

export const stkPush = async (req, res) => {
  try {
    const { phone, amount, orderId, shipping } = req.body;

    // Validate required fields
    if (!phone || !amount) {
      return res.status(400).json({ message: "Phone and amount are required" });
    }

    // Validate amount
    if (amount <= 0 || !Number.isFinite(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    // Validate credentials
    if (
      !SHORTCODE ||
      !PASSKEY ||
      !CONSUMER_KEY ||
      !CONSUMER_SECRET ||
      !CALLBACK_URL
    ) {
      console.error("Missing M-Pesa environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);
    const formattedPhone = formatPhone(phone);

    // Validate phone format
    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({
        message:
          "Invalid phone format. Expected 254xxxxxxxxx (11 digits starting with 254)",
      });
    }

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: (orderId || "ORDER").substring(0, 12),
      TransactionDesc: "Order Payment",
    };

    // Log payload for debugging (remove sensitive data in production)
    console.log("STK Push payload:", {
      ...payload,
      Password: "***",
    });

    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      // Production → "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    res.status(200).json({
      CheckoutRequestID: stkRes.data.CheckoutRequestID,
      MerchantRequestID: stkRes.data.MerchantRequestID,
      ResponseCode: stkRes.data.ResponseCode,
      CustomerMessage: stkRes.data.CustomerMessage,
    });
  } catch (err) {
    const errorData = err.response?.data || {};
    const errorMessage =
      errorData.errorMessage || errorData.message || err.message;

    console.error(
      "STK Push error (400 likely means invalid request payload):",
      {
        status: err.response?.status,
        message: errorMessage,
        errorCode: errorData.errorCode,
        fullError: errorData,
      },
    );

    res.status(err.response?.status || 500).json({
      message: "STK push failed",
      error: errorMessage,
      errorCode: errorData.errorCode,
    });
  }
};

// ─── Query Transaction Status ─────────────────────────────────────────────────

export const queryTransaction = async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({ message: "checkoutRequestId is required" });
    }

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const queryRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      // Production → "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query"
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    res.status(200).json({
      ResultCode: queryRes.data.ResultCode,
      ResultDesc: queryRes.data.ResultDesc,
    });
  } catch (err) {
    const errorData = err.response?.data || {};
    const errorCode = errorData.errorCode;
    const errorMessage = JSON.stringify(errorData);

    // Handle rate limit (spike arrest violation)
    if (
      errorMessage.includes("SpikeArrestViolation") ||
      errorMessage.includes("spike arrest")
    ) {
      console.warn(
        "⚠️  Rate limit hit on query. Wait before retrying. M-Pesa allows 5 queries/60sec",
      );
      return res.status(429).json({
        ResultCode: null,
        ResultDesc: "Rate limited - try again in 12+ seconds",
        rateLimited: true,
      });
    }

    // Handle pending (normal M-Pesa behavior)
    if (errorCode === "500.001.1001") {
      return res.status(200).json({
        ResultCode: null,
        ResultDesc: "Pending",
      });
    }

    // Handle Incapsula/security blocks (HTML response instead of JSON)
    if (
      err.response?.status === 403 ||
      errorMessage.includes("Incapsula") ||
      errorMessage.includes("Request unsuccessful")
    ) {
      console.warn(
        "⚠️  Security block (Incapsula). Too many requests from same IP. Backing off...",
      );
      return res.status(429).json({
        ResultCode: null,
        ResultDesc: "Security rate limit - try again later",
        rateLimited: true,
      });
    }

    console.error("Query error:", {
      status: err.response?.status,
      message: errorMessage,
    });
    res.status(500).json({
      message: "Query failed",
      error: errorData,
    });
  }
};

// ─── Callback (Safaricom POSTs here after payment) ───────────────────────────

export const mpesaCallback = async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;

    if (!body) {
      return res.status(200).json({ message: "No callback body" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = body;

    if (ResultCode === 0) {
      const metaItems = CallbackMetadata?.Item || [];
      const getMeta = (name) => metaItems.find((i) => i.Name === name)?.Value;

      const paymentData = {
        transactionId: getMeta("MpesaReceiptNumber"),
        status: "completed",
        phone: getMeta("PhoneNumber"),
        amount: getMeta("Amount"),
        transactionDate: getMeta("TransactionDate"),
      };

      console.log("✅ M-Pesa payment confirmed:", paymentData);

      // Update order with payment info
      const orderId = MerchantRequestID;
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
          "paymentResult.transactionId": paymentData.transactionId,
          "paymentResult.status": paymentData.status,
          "paymentResult.phone": paymentData.phone,
          status: "processing",
        },
        { new: true },
      );

      if (order) {
        console.log(`Order ${orderId} payment confirmed`);
      }
    } else {
      console.log("❌ Payment failed:", ResultCode, ResultDesc);

      // Update order status to payment failed
      const orderId = MerchantRequestID;
      await Order.findByIdAndUpdate(
        orderId,
        {
          "paymentResult.status": "failed",
          "paymentResult.transactionId": null,
        },
        { new: true },
      );
    }

    // Always respond 200 — Safaricom expects this
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err.message);
    // Still return 200 to Safaricom to acknowledge receipt
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};
