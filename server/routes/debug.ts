import { Router, Request, Response } from 'express';
import { razorpay } from '../config/razorpay';

const router = Router();

// Simple debug endpoint to log client-submitted payloads
router.post('/log', (req: Request, res: Response) => {
  try {
    console.log('DEBUG LOG:', JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('DEBUG LOG ERROR:', err);
    res.status(500).json({ success: false });
  }
});

// Test Razorpay connection
router.get('/razorpay/test', async (req: Request, res: Response) => {
  try {
    console.log('Testing Razorpay connection...');
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...');
    console.log('Has Key Secret:', !!process.env.RAZORPAY_KEY_SECRET);
    
    // Test creating a small order
    const testOrder = await razorpay.orders.create({
      amount: 100, // 1 rupee
      currency: 'INR',
      receipt: `test_${Date.now()}`,
    });
    
    console.log('Test order created:', testOrder.id);
    
    res.json({
      success: true,
      message: 'Razorpay connection successful',
      testOrderId: testOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...',
    });
  } catch (error: any) {
    console.error('Razorpay test error:', error);
    res.status(500).json({
      success: false,
      message: 'Razorpay connection failed',
      error: error.message,
    });
  }
});

// Check environment variables
router.get('/env', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set',
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set',
        MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not Set',
        FRONTEND_URL: process.env.FRONTEND_URL,
      },
    });
  } catch (err) {
    console.error('ENV DEBUG ERROR:', err);
    res.status(500).json({ success: false });
  }
});

// Test payment flow without actual payment
router.post('/test-payment', async (req: Request, res: Response) => {
  try {
    const { orderData } = req.body;
    
    console.log('Testing payment flow with order data:', orderData);
    
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required for testing',
      });
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((total: number, item: any) => total + (item.price * item.qty), 0);
    const shipping = subtotal >= 2999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    // Generate receipt ID
    const generateReceiptId = (): string => {
      return `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    // Create test order in database
    const Order = require('../models/Order').Order;
    const testOrder = new Order({
      userId: orderData.userId || null,
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
        options: item.options,
      })),
      shippingAddress: {
        label: 'Test Address',
        line1: orderData.shippingAddress?.address || 'Test Address',
        city: orderData.shippingAddress?.city || 'Test City',
        state: orderData.shippingAddress?.state || 'Test State',
        postalCode: orderData.shippingAddress?.pincode || '123456',
        country: 'India',
      },
      billingAddress: {
        label: 'Test Address',
        line1: orderData.billingAddress?.address || orderData.shippingAddress?.address || 'Test Address',
        city: orderData.billingAddress?.city || orderData.shippingAddress?.city || 'Test City',
        state: orderData.billingAddress?.state || orderData.shippingAddress?.state || 'Test State',
        postalCode: orderData.billingAddress?.pincode || orderData.shippingAddress?.pincode || '123456',
        country: 'India',
      },
      subtotal,
      shipping,
      tax,
      total,
      currency: 'INR',
      status: 'paid', // Mark as paid for testing
      payment: {
        provider: 'razorpay',
        orderId: `test_order_${Date.now()}`,
        paymentId: `test_payment_${Date.now()}`,
        signature: 'test_signature',
        captured: true,
      },
      receiptId: generateReceiptId(),
    });

    await testOrder.save();
    console.log('Test order created:', testOrder._id);

    res.json({
      success: true,
      message: 'Test payment flow completed',
      order: testOrder,
      totals: { subtotal, shipping, tax, total },
    });
  } catch (error: any) {
    console.error('Test payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Test payment flow failed',
      error: error.message,
    });
  }
});

export default router;
