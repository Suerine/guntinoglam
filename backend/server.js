import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import "./config/cloudinary.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import MpesaRoutes from "./routes/MpesaRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paystackRoutes from "./routes/paystackRoutes.js";

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://guntinoglam.vercel.app",
  "https://www.guntinoglam.com/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("⚠️  CORS blocked request from:", origin);
        console.log("Allowed origins:", allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments/mpesa", MpesaRoutes);
app.use("/api/payments/paystack", paystackRoutes);

app.get("/", (req, res) => {
  res.send("GOF Store API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();
