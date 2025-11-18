import { Router } from 'express';
import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  razorpayWebhook,
  getPaymentDetails,
  createRazorpayOrderSchema,
  verifyPaymentSchema,
} from '../controllers/payments';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Payment routes
// Allow create-order and verify to be called without auth (supports guest checkout)
router.post('/razorpay/create-order', validateRequest(createRazorpayOrderSchema), createRazorpayOrder);
router.post('/razorpay/verify', validateRequest(verifyPaymentSchema), verifyPayment);
router.get('/:orderId', authenticateToken, getPaymentDetails);

// Webhook route (no authentication required) - must use raw body
router.post(
  '/razorpay/webhook',
  express.raw({ type: 'application/json' }),
  (req, _res, next) => {
    // preserve raw body for signature verification
    (req as any).rawBody = req.body?.toString?.() ?? req.body;
    next();
  },
  razorpayWebhook
);

export default router;
