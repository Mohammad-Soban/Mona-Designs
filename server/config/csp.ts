export const cspConfig = {
  directives: {
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
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://*.razorpay.com",
      "https://fonts.googleapis.com"
    ],
    "style-src-elem": [
      "'self'",
      "'unsafe-inline'",
      "https://*.razorpay.com",
      "https://fonts.googleapis.com"
    ],
    "font-src": [
      "'self'",
      "https://*.razorpay.com",
      "https://fonts.gstatic.com",
      "data:"
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
      "wss://*.razorpay.com",
      "ws://localhost:8080",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com"
    ],
    "worker-src": ["'self'", "blob:"],
    "child-src": ["'self'", "blob:"],
    "form-action": ["'self'", "https://*.razorpay.com"]
  }
};