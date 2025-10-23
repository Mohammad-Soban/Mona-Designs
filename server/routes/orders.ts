import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  addToCartSchema,
  updateCartItemSchema,
  createOrderSchema,
} from '../controllers/orders';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Cart routes (authenticated)
router.get('/cart', authenticateToken, getCart);
router.post('/cart', authenticateToken, validateRequest(addToCartSchema), addToCart);
router.patch('/cart/item/:itemId', authenticateToken, validateRequest(updateCartItemSchema), updateCartItem);
router.delete('/cart/item/:itemId', authenticateToken, removeCartItem);
router.delete('/cart', authenticateToken, clearCart);

// Order routes
router.post('/', authenticateToken, validateRequest(createOrderSchema), createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

// Admin routes
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;
