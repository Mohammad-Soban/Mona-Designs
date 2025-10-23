import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsSchema,
  createProductSchema,
  updateProductSchema,
} from '../controllers/products';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validateRequest(getProductsSchema), getProducts);
router.get('/slug/:slug', getProductBySlug);

// Admin routes
router.get('/id/:id', authenticateToken, requireAdmin, getProductById);
router.post('/', authenticateToken, requireAdmin, validateRequest(createProductSchema), createProduct);
router.patch('/:id', authenticateToken, requireAdmin, validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);
// Image upload endpoints are disabled; use URL fields on product instead.

export default router;
