import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { adminLogin, adminLoginSchema } from '../controllers/adminAuth';

const router = Router();

// Admin login route
router.post('/admin/login', validateRequest(adminLoginSchema), adminLogin);

export default router;