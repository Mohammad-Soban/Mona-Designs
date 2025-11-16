import { Router } from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllOrders,
} from '../controllers/admin';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Order management
router.get('/orders', getAllOrders);

export default router;
