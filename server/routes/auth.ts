import { Router } from 'express';
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  registerUser,
  verifyRegistrationOTP,
  getProfile,
  updateProfile,
  getUserStats,
  registerSchema,
  loginSchema,
  sendOTPSchema,
  verifyOTPSchema,
  registerUserSchema,
  verifyRegistrationOTPSchema,
} from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/send-otp', validateRequest(sendOTPSchema), sendOTP);
router.post('/verify-otp', validateRequest(verifyOTPSchema), verifyOTP);
router.post('/register-user', validateRequest(registerUserSchema), registerUser);
router.post('/verify-registration-otp', validateRequest(verifyRegistrationOTPSchema), verifyRegistrationOTP);

// Protected routes
router.get('/me', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, updateProfile);

export default router;
