import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/validation";

// Import routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";
import adminRoutes from "./routes/admin";
import { handleDemo } from "./routes/demo";
import debugRoutes from "./routes/debug";

export function createServer() {
  const app = express();

  // Connect to database
  connectDB();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "default-src": ["'self'", "https://*.razorpay.com", "wss://*.razorpay.com"],
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://*.razorpay.com",
            "https://checkout.razorpay.com",
            "https://api.razorpay.com",
            "https://lumberjack.razorpay.com"
          ],
          "script-src-elem": [
            "'self'",
            "'unsafe-inline'",
            "https://*.razorpay.com",
            "https://checkout.razorpay.com",
            "https://api.razorpay.com",
            "https://lumberjack.razorpay.com"
          ],
          "frame-src": [
            "'self'",
            "https://*.razorpay.com",
            "https://api.razorpay.com",
            "https://checkout.razorpay.com"
          ],
          "img-src": ["'self'", "data:", "https:", "https://*.razorpay.com", "blob:"],
          "media-src": ["'self'", "https://*.razorpay.com", "blob:"],
          "connect-src": [
            "'self'",
            "https://*.razorpay.com",
            "https://api.razorpay.com",
            "https://checkout.razorpay.com",
            "https://lumberjack.razorpay.com",
            "wss://*.razorpay.com"
          ],
          "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://*.razorpay.com",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com"
          ],
          "worker-src": ["'self'", "blob:"],
          "child-src": ["'self'", "blob:"],
          "form-action": ["'self'", "https://*.razorpay.com"],
        },
      },
    })
  );

  // CORS configuration
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  });

  // Apply rate limiting to auth routes
  app.use("/api/auth", limiter);

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/admin", adminRoutes);
  // Debug logging endpoint
  app.use('/api/debug', debugRoutes);

  // Error handling middleware (for API routes); place BEFORE non-API fallbacks
  app.use(errorHandler);

  // 404 handler for API only, let Vite serve SPA for other routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  return app;
}
