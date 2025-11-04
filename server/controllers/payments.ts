import { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { Product } from '../models/Product';
import { razorpay, verifyRazorpaySignature } from '../config/razorpay';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createRazorpayOrderSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    currency: z.string().optional().default('INR'),
    receipt: z.string().optional(),
    notes: z.any().optional(),
    orderData: z.object({
      userId: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        title: z.string(),
        price: z.number(),
        qty: z.number().min(1),
        size: z.string().optional(),
        color: z.string().optional(),
        options: z.any().optional(),
      })).optional(),
      shippingAddress: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
      }).optional(),
      billingAddress: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
      }).optional(),
    }).optional(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
  }),
});

// Create Razorpay order (supports guest checkout)
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes, orderData } = req.body;

    console.log('Creating Razorpay order:', {
      amount,
      currency,
      receipt,
      notes,
      amountInPaise: amount * 100,
      key_id: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...',
      has_key_secret: !!process.env.RAZORPAY_KEY_SECRET,
      hasOrderData: !!orderData,
      orderDataKeys: orderData ? Object.keys(orderData) : null,
      userId: orderData?.userId,
      itemsCount: orderData?.items?.length,
    });

    // Validate Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay configuration missing');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error',
        error: 'RAZORPAY_CONFIG_MISSING'
      });
    }

    // Create Razorpay order with error handling
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency,
        receipt: receipt ?? `rcpt_${Date.now()}`,
        notes: notes || {},
      });
      
      console.log('Razorpay order created successfully:', {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      });
    } catch (createError: any) {
      console.error('Razorpay create order error:', {
        message: createError.message,
        code: createError.code,
        statusCode: createError.statusCode,
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: createError.message
      });
    }

    // If orderData is provided, create order in database
    let dbOrder = null;
    if (orderData && orderData.items && orderData.items.length > 0) {
      try {
        console.log('Creating order in database with items:', orderData.items.length);
        
        // Calculate totals
        const subtotal = orderData.items.reduce((total: number, item: any) => total + (item.price * item.qty), 0);
        const shipping = subtotal >= 2999 ? 0 : 99;
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + shipping + tax;
        
        console.log('Order totals:', { subtotal, shipping, tax, total });

        // Generate receipt ID
        const generateReceiptId = (): string => {
          return `MONA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        };

        // Create order in database
        dbOrder = new Order({
          userId: orderData.userId || null, // Allow null for guest checkout
          items: orderData.items.map((item: any) => ({
            productId: new mongoose.Types.ObjectId(), // Create a new ObjectId for testing
            title: item.title,
            price: item.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
            options: item.options,
          })),
          shippingAddress: {
            label: 'Home',
            line1: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
            state: orderData.shippingAddress?.state || '',
            postalCode: orderData.shippingAddress?.pincode || '',
            country: 'India',
          },
          billingAddress: {
            label: 'Home',
            line1: orderData.billingAddress?.address || orderData.shippingAddress?.address || '',
            city: orderData.billingAddress?.city || orderData.shippingAddress?.city || '',
            state: orderData.billingAddress?.state || orderData.shippingAddress?.state || '',
            postalCode: orderData.billingAddress?.pincode || orderData.shippingAddress?.pincode || '',
            country: 'India',
          },
          subtotal,
          shipping,
          tax,
          total,
          currency: 'INR',
          status: 'created',
          payment: {
            provider: 'razorpay',
            orderId: razorpayOrder.id,
            captured: false,
          },
          receiptId: generateReceiptId(),
        });

        await dbOrder.save();
        console.log('Order created in database:', dbOrder._id);

        // Skip stock update for now since we're using dummy ObjectIds
        // TODO: Implement proper product stock management
        console.log('Skipping stock update - using dummy ObjectIds for testing');
      } catch (dbError) {
        console.error('Failed to create order in database:', dbError);
        // Continue with payment even if DB order creation fails
      }
    }

    // Return the razorpay order payload needed by client
    return res.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      orderId: dbOrder?._id, // Include database order ID if created
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

// Verify payment
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Try to find an existing Order tied to this razorpay order id
    const order = await Order.findOne({ 'payment.orderId': razorpay_order_id });

    let paymentRecord: any = null;

    if (order) {
      if (order.status !== 'paid') {
        order.status = 'paid';
        order.payment.paymentId = razorpay_payment_id;
        order.payment.signature = razorpay_signature;
        order.payment.captured = true;
        await order.save();
      }

      // Create payment record
      paymentRecord = new Payment({
        orderId: order._id,
        providerPaymentId: razorpay_payment_id,
        providerOrderId: razorpay_order_id,
        amount: order.total,
        currency: order.currency,
        status: 'captured',
        rawPayload: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      });

      await paymentRecord.save();

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: order._id,
        order,
        payment: paymentRecord,
      });
    }

    // If order is not found in DB (guest checkout), create a minimal payment record
    paymentRecord = new Payment({
      providerPaymentId: razorpay_payment_id,
      providerOrderId: razorpay_order_id,
      amount: 0,
      currency: 'INR',
      status: 'captured',
      rawPayload: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });

    await paymentRecord.save();

    return res.json({
      success: true,
      message: 'Payment verified (guest)',
      payment: paymentRecord,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
};

// Razorpay webhook handler
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = (req as any).rawBody || JSON.stringify(req.body);

    // Verify webhook signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = typeof body === 'string' ? JSON.parse(body) : req.body;

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      case 'order.paid':
        await handleOrderPaid(event);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

// Handle payment captured webhook
const handlePaymentCaptured = async (event: any) => {
  try {
    const { order_id, payment_id } = event.payload.payment.entity;

    const order = await Order.findOne({ 'payment.orderId': order_id });
    if (order && order.status !== 'paid') {
      order.status = 'paid';
      order.payment.paymentId = payment_id;
      order.payment.captured = true;
      await order.save();

      // Create payment record
      const payment = new Payment({
        orderId: order._id,
        providerPaymentId: payment_id,
        providerOrderId: order_id,
        amount: order.total,
        currency: order.currency,
        status: 'captured',
        rawPayload: event.payload,
      });
      await payment.save();
    }
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
};

// Handle payment failed webhook
const handlePaymentFailed = async (event: any) => {
  try {
    const { order_id } = event.payload.payment.entity;

    const order = await Order.findOne({ 'payment.orderId': order_id });
    if (order) {
      order.status = 'failed';
      await order.save();

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.qty } }
        );
      }
    }
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
};

// Handle order paid webhook
const handleOrderPaid = async (event: any) => {
  try {
    const { id } = event.payload.order.entity;

    const order = await Order.findOne({ 'payment.orderId': id });
    if (order && order.status !== 'paid') {
      order.status = 'paid';
      await order.save();
    }
  } catch (error) {
    console.error('Handle order paid error:', error);
  }
};

// Get payment details
export const getPaymentDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const payments = await Payment.find({ orderId: order._id });

    res.json({
      success: true,
      order,
      payments,
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
    });
  }
};

export {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
};
