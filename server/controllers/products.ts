import { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { AdminAuthRequest } from '../middleware/adminAuth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation schemas
const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    stock: z.number().min(0),
    categories: z.array(z.object({
      name: z.enum(['home', 'lehengas', 'kurtas', 'sherwanis', 'suits', 'accessories', 'wedding', 'reception', 'sangeet', 'mehendi', 'haldi', 'festivals', 'general', 'new-arrivals']),
      rank: z.number().min(1)
    })),
    tags: z.array(z.string()).optional(),
    sizes: z.array(z.object({
      label: z.string(),
      qty: z.number().min(0)
    })).optional(),
    colors: z.array(z.object({
      label: z.string(),
      hex: z.string()
    })).optional(),
    attributes: z.record(z.any()).optional(),
    featured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    categories: z.array(z.object({
      name: z.enum(['home', 'lehengas', 'kurtas', 'sherwanis', 'suits', 'accessories', 'wedding', 'reception', 'sangeet', 'mehendi', 'haldi', 'festivals', 'general', 'new-arrivals']),
      rank: z.number().min(1)
    })).optional(),
    tags: z.array(z.string()).optional(),
    sizes: z.array(z.object({
      label: z.string(),
      qty: z.number().min(0)
    })).optional(),
    colors: z.array(z.object({
      label: z.string(),
      hex: z.string()
    })).optional(),
    attributes: z.record(z.any()).optional(),
    featured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get all products with filtering and pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      featured, 
      active, 
      page = 1, 
      limit = 10, 
      sort = 'createdAt',
      order = 'desc',
      search,
      count // If true, return count only for stats
    } = req.query;

    const query: any = {};

    // Filter by category
    if (category) {
      query['categories.name'] = category;
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // If count=true, return stats only
    if (count === 'true') {
      const total = await Product.countDocuments(query);
      return res.json({
        total,
        change: 0 // You can calculate month-over-month change if needed
      });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ [sort as string]: sortOrder, 'categories.rank': 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

// Get products by category with ranking (supports tags and occasions)
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, tag, occasion } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build query based on category, tags, and occasions
    const query: any = {
      isActive: true
    };

    // If category is "All", don't filter by category
    if (category !== 'All') {
      query['categories.name'] = category;
    }

    // Filter by tag if provided (for clothing types like lehenga, kurta, etc.)
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by occasion if provided (from attributes)
    if (occasion) {
      query[`attributes.occasions`] = { $in: [occasion] };
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ 'categories.rank': 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
    });
  }
};

// Get all products (for "All" category)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12, tag, occasion } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build query based on tags and occasions
    const query: any = {
      isActive: true
    };

    // Filter by tag if provided
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Filter by occasion if provided
    if (occasion) {
      query[`attributes.occasions`] = { $in: [occasion] };
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ featured: -1, 'categories.rank': 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all products',
    });
  }
};

// Get products by tag (clothing type)
export const getProductsByTag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 12, category, occasion } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {
      tags: { $in: [tag] },
      isActive: true
    };

    // Optional category filter
    if (category) {
      query['categories.name'] = category;
    }

    // Optional occasion filter
    if (occasion) {
      query[`attributes.occasions`] = { $in: [occasion] };
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ 'categories.rank': 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products by tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by tag',
    });
  }
};

// Get products by occasion
export const getProductsByOccasion = async (req: Request, res: Response) => {
  try {
    const { occasion } = req.params;
    const { page = 1, limit = 12, category, tag } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {
      [`attributes.occasions`]: { $in: [occasion] },
      isActive: true
    };

    // Optional category filter
    if (category) {
      query['categories.name'] = category;
    }

    // Optional tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ 'categories.rank': 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products by occasion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by occasion',
    });
  }
};

// Get single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

// Create product (Admin only)
export const createProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    console.log('Create product request body:', req.body);
    const productData = req.body;
    const files = req.files as Express.Multer.File[];

    // Generate slug
    const slug = generateSlug(productData.title);

    // Process uploaded images
    const images = files?.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: productData.title,
      role: index === 0 ? 'hero' : 'gallery',
      position: index
    })) || [];

    // Create product without createdBy field (since we're using admin auth, not user auth)
    const product = new Product({
      ...productData,
      slug,
      images,
    });

    await product.save();
    console.log('Product saved successfully:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: error.toString()
    });
  }
};

// Update product (Admin only)
export const updateProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const files = req.files as Express.Multer.File[];

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== product.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Process new images if uploaded
    if (files && files.length > 0) {
      const newImages = files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: updateData.title || product.title,
        role: 'gallery',
        position: product.images.length + index
      }));
      updateData.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete associated images
    product.images.forEach(image => {
      const imagePath = path.join(process.cwd(), 'public', image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

// Get available categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = [
      { name: 'home', label: 'Home', description: 'Featured on homepage' },
      { name: 'lehengas', label: 'Lehengas', description: 'Traditional lehengas' },
      { name: 'kurtas', label: 'Kurtas', description: 'Traditional kurtas' },
      { name: 'sherwanis', label: 'Sherwanis', description: 'Men\'s sherwanis' },
      { name: 'suits', label: 'Suits', description: 'Formal suits' },
      { name: 'accessories', label: 'Accessories', description: 'Fashion accessories' },
      { name: 'wedding', label: 'Wedding', description: 'Wedding collection' },
      { name: 'reception', label: 'Reception', description: 'Reception wear' },
      { name: 'sangeet', label: 'Sangeet', description: 'Sangeet ceremony wear' },
      { name: 'mehendi', label: 'Mehendi', description: 'Mehendi ceremony wear' },
      { name: 'haldi', label: 'Haldi', description: 'Haldi ceremony wear' },
      { name: 'festivals', label: 'Festivals', description: 'Festival wear' },
      { name: 'general', label: 'General', description: 'General collection' },
      { name: 'new-arrivals', label: 'New Arrivals', description: 'Latest arrivals' }
    ];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

export {
  createProductSchema,
  updateProductSchema,
};