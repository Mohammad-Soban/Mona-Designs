import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Validation schema for admin login
export const adminLoginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string()
  })
});

// Admin credentials (in production, these should be in environment variables)
const ADMIN_USERNAME = "Mona Designs";
const ADMIN_PASSWORD = "Mohammad@313";

// Admin login controller
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      { 
        username,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: "Login successful"
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};