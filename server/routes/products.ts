import { Router } from 'express';
import {
  getProducts,
  getProductsByCategory,
  getAllProducts,
  getProductsByTag,
  getProductsByOccasion,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts,
  createProductSchema,
  updateProductSchema,
  upload
} from '../controllers/products';
import { authenticateAdmin } from '../middleware/adminAuth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/all', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/tag/:tag', getProductsByTag);
router.get('/occasion/:occasion', getProductsByOccasion);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', 
  authenticateAdmin,
  upload.array('images', 10),
  validateRequest(createProductSchema), 
  createProduct
);

router.patch('/:id', 
  authenticateAdmin,
  upload.array('images', 10),
  validateRequest(updateProductSchema), 
  updateProduct
);

router.delete('/:id', 
  authenticateAdmin,
  deleteProduct
);

export default router;