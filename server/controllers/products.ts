import { Request, Response } from 'express';
import { z } from 'zod';
import { Product, IProduct } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
// Image uploads via Cloudinary are disabled for now.

// Validation schemas
const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be positive'),
    currency: z.string().default('INR'),
    sku: z.string().optional(),
    stock: z.number().min(0).default(0),
    categories: z.array(z.string()).min(1, 'At least one category is required'),
    tags: z.array(z.string()).default([]),
    sizes: z.array(z.object({
      label: z.string(),
      qty: z.number().min(0),
    })).optional(),
    colors: z.array(z.object({
      label: z.string(),
      hex: z.string(),
    })).optional(),
    attributes: z.record(z.any()).default({}),
    isActive: z.boolean().default(true),
    featured: z.boolean().default(false),
    metadata: z.record(z.any()).default({}),
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
    currency: z.string().optional(),
    sku: z.string().optional(),
    stock: z.number().min(0).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    sizes: z.array(z.object({
      label: z.string(),
      qty: z.number().min(0),
    })).optional(),
    colors: z.array(z.object({
      label: z.string(),
      hex: z.string(),
    })).optional(),
    attributes: z.record(z.any()).optional(),
    isActive: z.boolean().optional(),
    featured: z.boolean().optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

const getProductsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    featured: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
  }),
});

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Upload image endpoint removed; use direct URL fields on products.

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, featured, page = '1', limit = '12', sort = 'createdAt' } = req.query;

    const query: any = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search as string };
    }

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { title: 1 };
    if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Product.countDocuments(query);

    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product._id,
      name: product.title,
      price: `₹${(product.price / 100).toLocaleString()}`,
      originalPrice: product.price > 0 ? `₹${((product.price * 1.2) / 100).toLocaleString()}` : undefined,
      rating: 4.5, // Default rating for now
      reviews: Math.floor(Math.random() * 50) + 10, // Random reviews for demo
      image: product.images.find(img => img.role === 'hero')?.url || product.images[0]?.url || '',
      badge: product.featured ? 'Featured' : undefined,
      sizes: product.sizes?.map(size => size.label) || [],
      colors: product.colors?.map(color => color.label) || [],
      category: product.categories[0] || 'General',
      description: product.description,
      inStock: product.stock > 0,
      fabric: product.attributes.fabric || 'Premium',
      occasion: product.attributes.occasion || 'General',
      sizePricing: product.sizes?.reduce((acc, size) => {
        acc[size.label] = {
          price: `₹${(product.price / 100).toLocaleString()}`,
          originalPrice: `₹${((product.price * 1.2) / 100).toLocaleString()}`,
        };
        return acc;
      }, {} as Record<string, { price: string; originalPrice: string }>) || {},
    }));

    res.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

// Get product by slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate('createdBy', 'name')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Transform product to match frontend expectations
    const transformedProduct = {
      id: product._id,
      name: product.title,
      price: `₹${(product.price / 100).toLocaleString()}`,
      originalPrice: product.price > 0 ? `₹${((product.price * 1.2) / 100).toLocaleString()}` : undefined,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10,
      image: product.images.find(img => img.role === 'hero')?.url || product.images[0]?.url || '',
      badge: product.featured ? 'Featured' : undefined,
      sizes: product.sizes?.map(size => size.label) || [],
      colors: product.colors?.map(color => color.label) || [],
      category: product.categories[0] || 'General',
      description: product.description,
      inStock: product.stock > 0,
      fabric: product.attributes.fabric || 'Premium',
      occasion: product.attributes.occasion || 'General',
      sizePricing: product.sizes?.reduce((acc, size) => {
        acc[size.label] = {
          price: `₹${(product.price / 100).toLocaleString()}`,
          originalPrice: `₹${((product.price * 1.2) / 100).toLocaleString()}`,
        };
        return acc;
      }, {} as Record<string, { price: string; originalPrice: string }>) || {},
      images: product.images.map(img => img.url),
    };

    res.json({
      success: true,
      product: transformedProduct,
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

// Get product by ID (admin)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('createdBy', 'name');

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

// Create product (admin)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const productData = req.body;

    // Generate slug
    const slug = generateSlug(productData.title);

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'A product with this title already exists',
      });
    }

    // Create product
    const product = new Product({
      ...productData,
      slug,
      createdBy: userId,
      price: productData.price * 100, // Convert to paise
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
    });
  }
};

// Update product (admin)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If title is being updated, generate new slug
    if (updates.title) {
      const slug = generateSlug(updates.title);
      
      // Check if new slug already exists (excluding current product)
      const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'A product with this title already exists',
        });
      }
      
      updates.slug = slug;
    }

    // Convert price to paise if provided
    if (updates.price) {
      updates.price = updates.price * 100;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  }
};

// Delete product (admin)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      if (image.public_id) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

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

// Upload product image (admin)
export const uploadProductImage = undefined as unknown as never;

// Delete product image (admin)
export const deleteProductImage = undefined as unknown as never;

export {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
};
