# Mona-Designs Backend API

A complete MERN stack backend for the Mona-Designs e-commerce platform with Razorpay payment integration.

## 🚀 Features

- **Authentication**: JWT-based auth with user registration, login, and OTP verification
- **Product Management**: Full CRUD operations (images via direct URLs; Cloudinary disabled for now)
- **Cart & Orders**: Persistent cart management and order processing
- **Payment Integration**: Razorpay payment gateway with signature verification and webhooks
- **Admin Panel**: Complete admin dashboard with user and order management
- **Security**: Rate limiting, CORS, helmet, input validation with Zod
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier)
- Razorpay account (test keys)
- (Optional) Cloudinary account (currently disabled; use direct URLs)

## 🛠️ Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
```

Fill in your actual values in `.env`:
```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=rzp_test_your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary Configuration (disabled; keep empty or remove)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Admin Configuration
ADMIN_INIT_EMAIL=admin@monadesigners.com
ADMIN_INIT_PASSWORD=Admin123!

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

3. **Create admin user:**
```bash
npm run seed:admin
```

4. **Start development server:**
```bash
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register-user` - Register with OTP verification
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/profile` - Update user profile

### Products (Public)
- `GET /api/products` - Get all products with pagination and filters
- `GET /api/products/slug/:slug` - Get product by slug

### Products (Admin)
- `GET /api/products/id/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- (Disabled) Image upload endpoints. Supply `images: [{ url, role, alt, position }]` directly in product payloads.

### Cart & Orders
- `GET /api/orders/cart` - Get user cart
- `POST /api/orders/cart` - Add item to cart
- `PATCH /api/orders/cart/item/:itemId` - Update cart item quantity
- `DELETE /api/orders/cart/item/:itemId` - Remove item from cart
- `DELETE /api/orders/cart` - Clear cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment signature
- `POST /api/payments/razorpay/webhook` - Razorpay webhook handler (raw body)
- `GET /api/payments/:orderId` - Get payment details

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

## 🗄️ Database Schema

### Users
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  username: string (unique),
  phone: string,
  passwordHash: string,
  role: 'user' | 'admin',
  profileImage?: { url, public_id },
  address?: Array<{ label, line1, city, state, postalCode, country }>,
  createdAt: Date,
  updatedAt: Date
}
```

### Products
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique),
  description: string,
  price: number (in paise),
  currency: string,
  sku?: string,
  stock: number,
  categories: string[],
  tags: string[],
  sizes?: Array<{ label, qty }>,
  colors?: Array<{ label, hex }>,
  images: Array<{ url, public_id, alt, role, position }>,
  attributes: object,
  isActive: boolean,
  featured: boolean,
  metadata: object,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  items: Array<{ productId, title, price, qty, size?, color?, options? }>,
  shippingAddress: { label?, line1, city, state, postalCode, country },
  billingAddress: { label?, line1, city, state, postalCode, country },
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  currency: string,
  status: 'pending' | 'created' | 'paid' | 'failed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
  payment: { provider, orderId, paymentId?, signature?, method?, captured },
  receiptId: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Express rate limiting on auth endpoints
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured for frontend origin
- **Helmet**: Security headers
- **Error Handling**: Comprehensive error handling middleware

## 💳 Payment Integration

### Razorpay Flow
1. **Create Order**: Server creates Razorpay order with amount and receipt
2. **Client Payment**: Frontend opens Razorpay checkout with order details
3. **Payment Success**: Client receives payment details and signature
4. **Verify Payment**: Server verifies signature and updates order status
5. **Webhook Support**: Webhook handler processes async events

### Signature Verification
```typescript
const crypto = require('crypto');
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');
```

### Webhook Setup
- Endpoint: `POST /api/payments/razorpay/webhook`
- Content Type: `application/json` (raw body)
- Verification: HMAC SHA256 of raw request body using `RAZORPAY_WEBHOOK_SECRET`
- Events handled: `payment.captured`, `payment.failed`, `order.paid`

Production note: Ensure your server is publicly accessible. For local testing use a tunneling tool (e.g., `ngrok http 8080`) and configure the public URL in Razorpay dashboard.

### Public URL Used for Razorpay
- During development, use your tunnel URL (e.g., `https://<random>.ngrok.io`).
- In production, use your deployed server base URL. Example: `https://api.yourdomain.com`.
- Webhook full URL example: `https://api.yourdomain.com/api/payments/razorpay/webhook`.

## 🖼️ Image Handling (No Cloudinary)

- Use direct, publicly-accessible URLs in `product.images[].url`.
- Recommended roles: `hero | gallery | thumbnail | category` for frontend placement.
- To "delete" an image, remove it from the product document.

## 🚀 Deployment

### Environment Setup
1. **MongoDB Atlas**: Create free cluster and get connection string
2. **Razorpay**: Get test keys from dashboard
3. (Optional) Cloudinary: Not required; using URL-only images
4. **Hosting**: Deploy to Railway, Render, or similar platform

### Production Checklist
- [ ] Update JWT secrets
- [ ] Set production MongoDB URI
- [ ] Configure Razorpay live keys
- [ ] Update CORS origins
- [ ] Set up webhook endpoints
- [ ] Configure environment variables on hosting platform

## 🧪 Testing

### Manual Testing
1. **Register/Login**: Test user authentication flow
2. **Product CRUD**: Test admin product management
3. **Cart Operations**: Test cart add/update/remove
4. **Order Creation**: Test order placement
5. **Payment Flow**: Test Razorpay integration
6. **Admin Functions**: Test admin dashboard

### Test Credentials
- **Admin**: Use seeded admin credentials
- **Test User**: Register new user via API
- **Razorpay**: Use test mode with test cards

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed:admin   # Create admin user
npm run typecheck    # TypeScript validation
npm test            # Run tests
```

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Razorpay Integration](https://razorpay.com/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
