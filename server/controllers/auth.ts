import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const sendOTPSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
});

const verifyOTPSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

const registerUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  }),
});

const verifyRegistrationOTPSchema = z.object({
  body: z.object({
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    userData: z.object({
      email: z.string().email('Invalid email format'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    }),
  }),
});

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  } as jwt.SignOptions);
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, username, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or phone already exists',
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      username,
      phone,
      passwordHash: password, // Will be hashed by pre-save middleware
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

// Send OTP (simulated)
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // In a real application, you would integrate with SMS service like Twilio
    // For now, we'll simulate the OTP sending
    res.json({
      success: true,
      message: `OTP sent to ${phone}. Use 123456 for demo.`,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

// Verify OTP (simulated)
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    // For demo purposes, accept "123456" as valid OTP
    if (otp === '123456') {
      res.json({
        success: true,
        message: 'OTP verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
    });
  }
};

// Register user (with OTP verification)
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone: mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or phone already exists',
      });
    }

    res.json({
      success: true,
      message: 'User data validated. Please verify OTP to complete registration.',
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

// Verify registration OTP and create user
export const verifyRegistrationOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, otp, userData } = req.body;

    // For demo purposes, accept "123456" as valid OTP
    if (otp !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }, { phone: mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or phone already exists',
      });
    }

    // Create new user
    const user = new User({
      name: userData.username,
      email: userData.email,
      username: userData.username,
      phone: mobile,
      passwordHash: userData.password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
    };

    res.json({
      success: true,
      message: 'Account created successfully',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
    });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      address: user.address,
    };

    res.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.passwordHash;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      address: user.address,
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

export {
  registerSchema,
  loginSchema,
  sendOTPSchema,
  verifyOTPSchema,
  registerUserSchema,
  verifyRegistrationOTPSchema,
};
